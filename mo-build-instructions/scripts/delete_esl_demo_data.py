#!/usr/bin/env python3
"""
ESL Federal Credit Union - Delete demo customers from ODP

Sends the demo profiles this project uploaded to ODP's delete endpoint
(POST /v3/compliance/gdpr/delete). The list of emails comes from the upload ledger
(output/ledger.json) plus every output/runs/*/esl_profiles.json, so profiles from partly
failed uploads are included. Only emails matching demo.esl.*@example.com are ever sent.

Usage:
    python3 delete_esl_demo_data.py                        # list what would be deleted (default)
    python3 delete_esl_demo_data.py --execute --requester you@optimizely.com
    python3 delete_esl_demo_data.py --execute --requester you@optimizely.com --archive-ledger

--requester (or ODP_DELETE_REQUESTER in .env) is the audit email ODP records for the request.
--execute asks you to type the number of profiles before anything is sent.
--archive-ledger, after a fully accepted delete, moves ledger.json and runs/ into
    output/archive-<timestamp>/ and starts a fresh ledger that keeps next_index, so new demo
    emails never reuse a deleted address.

Delete requests are accepted asynchronously (202 + request ids, saved to output/deletions/).
ODP's docs don't say whether the delete is reversible or whether it also removes events,
so treat it as permanent. Reads ODP_PRIVATE_API_KEY and ODP_REGION from the repo-root .env.
"""
import argparse
import json
import os
import re
import shutil
import sys
import time
from datetime import datetime, timezone

import requests

from _env import ENV_FILE, load_env
from generate_esl_odp_data import LEDGER_FILE, OUTPUT_DIR, load_ledger, save_ledger

DEMO_EMAIL = re.compile(r"^demo\.esl\.[a-z0-9.\-]+@example\.com$")
CHUNK_SIZE = 50  # fewer total requests


def collect_emails():
    """Emails from the ledger and every archived run payload."""
    emails = set(load_ledger()["profiles"])
    for f in (OUTPUT_DIR / "runs").glob("*/esl_profiles.json"):
        for p in json.loads(f.read_text()):
            emails.add(p["attributes"]["email"])

    safe = {e for e in emails if DEMO_EMAIL.match(e)}
    skipped = emails - safe
    if skipped:
        print(f"Skipping {len(skipped)} email(s) that don't look like demo data, e.g. {sorted(skipped)[:3]}")
    return sorted(safe)


def archive_ledger():
    ledger = load_ledger()
    archive = OUTPUT_DIR / f"archive-{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}"
    archive.mkdir(parents=True)
    shutil.move(str(LEDGER_FILE), archive / "ledger.json")
    if (OUTPUT_DIR / "runs").is_dir():
        shutil.move(str(OUTPUT_DIR / "runs"), archive / "runs")
    save_ledger({"next_index": ledger["next_index"], "profiles": {}, "runs": []})
    print(f"Archived ledger and runs to {archive}; fresh ledger keeps next_index={ledger['next_index']}.")


def main():
    parser = argparse.ArgumentParser(description="Delete ESL demo customers from ODP.")
    parser.add_argument("--execute", action="store_true", help="actually send the delete requests")
    parser.add_argument("--requester", help="audit email for the requests (or ODP_DELETE_REQUESTER in .env)")
    parser.add_argument("--archive-ledger", action="store_true", help="after a fully accepted delete, archive the ledger and runs")
    args = parser.parse_args()

    emails = collect_emails()
    if not emails:
        sys.exit("No demo emails found in the ledger or output/runs/.")

    print(f"{len(emails)} demo profile(s) to delete, e.g. {emails[:2]} ... {emails[-1]}")
    if not args.execute:
        print("Dry run: nothing sent. Re-run with --execute --requester <email> to delete.")
        return

    load_env()
    api_key = os.environ.get("ODP_PRIVATE_API_KEY")
    requester = args.requester or os.environ.get("ODP_DELETE_REQUESTER")
    if not api_key:
        sys.exit(f"ODP_PRIVATE_API_KEY is not set in the environment or {ENV_FILE}.")
    if not requester:
        sys.exit("Pass --requester <email> (or set ODP_DELETE_REQUESTER); ODP records it for audit.")

    region = os.environ.get("ODP_REGION", "us1")
    url = f"https://api.{region}.odp.optimizely.com/v3/compliance/gdpr/delete"
    print(f"\nThis sends {len(emails)} delete request(s) to ODP ({region}) as '{requester}'.")
    if input(f"Type {len(emails)} to confirm: ").strip() != str(len(emails)):
        sys.exit("Not confirmed. Nothing sent.")

    headers = {"x-api-key": api_key, "Content-Type": "application/json", "accept": "application/json"}
    request_ids, failures = [], 0
    for i in range(0, len(emails), CHUNK_SIZE):
        chunk = emails[i:i + CHUNK_SIZE]
        n = i // CHUNK_SIZE + 1
        body = [{"requester": requester, "identifier_field_name": "email", "identifier_value": e} for e in chunk]

        max_retries = 3
        backoff = 2.0
        success = False

        for attempt in range(max_retries):
            try:
                resp = requests.post(url, headers=headers, json=body, timeout=30)

                if resp.status_code == 202:
                    ids = resp.json().get("request_ids", [])
                    request_ids.extend(ids)
                    print(f"  [ACCEPTED] batch {n} ({len(chunk)} profiles, {len(ids)} request ids)")
                    success = True
                    break
                elif resp.status_code in (403, 429) and attempt < max_retries - 1:
                    print(f"  [THROTTLED] batch {n} hit rate limit ({resp.status_code}). Retrying in {backoff}s...")
                    time.sleep(backoff)
                    backoff *= 2
                else:
                    print(f"  [FAILED]  batch {n}: {resp.status_code} - {resp.text}")
                    break
            except requests.RequestException as e:
                print(f"  [FAILED]  batch {n}: {e}")
                break

        if not success:
            failures += 1

        time.sleep(1.5)  # Safe delay between batches to stay under burst limits

    log_dir = OUTPUT_DIR / "deletions"
    log_dir.mkdir(parents=True, exist_ok=True)
    log = log_dir / f"{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}.json"
    log.write_text(json.dumps({"requester": requester, "region": region, "emails": emails,
                               "request_ids": request_ids, "failed_batches": failures}, indent=2))
    print(f"\nSaved request ids to {log}")

    if failures:
        sys.exit(f"{failures} batch(es) failed; ledger left untouched. Re-run to retry (accepted deletes are repeated harmlessly).")
    print("All delete requests accepted. ODP processes them asynchronously; check Customers in ODP before re-uploading.")
    if args.archive_ledger:
        archive_ledger()


if __name__ == "__main__":
    main()

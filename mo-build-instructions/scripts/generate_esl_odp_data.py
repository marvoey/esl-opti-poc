#!/usr/bin/env python3
"""
ESL Federal Credit Union - ODP Synthetic Data Generator
Generates realistic members, prospective members, loan calculations,
and application events tailored to the Rochester, NY area.

Usage:
    python3 generate_esl_odp_data.py [--count 40] [--seed N] [--upload] [--dry-run] [--ledger] [--start-date YYYY-MM-DD]

Each profile gets a creation time between --start-date (default: August 1st) and now. Its first
event (account/create for members, a /membership/join pageview for prospects) is stamped then and
every later event falls after it, with ts inside "data" (epoch seconds). ODP derives
"First identified" from the earliest event ts, so events are uploaded BEFORE profiles.
Always writes esl_profiles.json / esl_events.json to ./output/ for review.
--dry-run  generates and saves the files, then prints the requests an upload would
           make, without sending anything (no API key needed).
--upload   additionally pushes the data to ODP (POST /v3/profiles, POST /v3/events).

Upload ledger (output/ledger.json): every profile ODP accepted is recorded with its email,
vuid, run id and time, and each real upload archives its exact payloads under output/runs/.
New profiles continue the email numbering from the ledger, so a later run (even with the
same --seed) never reuses an email and overwrites an earlier profile. --ledger prints it.

Reads ODP_PRIVATE_API_KEY and ODP_REGION (us1 default, eu1, au1) from the repo-root .env.
Demo emails are demo.esl.<name>@example.com so they are easy to find and purge.
"""
import argparse
import json
import os
import random
import sys
import time
import uuid
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

import requests

from _env import ENV_FILE, load_env

OUTPUT_DIR = Path(__file__).resolve().parent / "output"
LEDGER_FILE = OUTPUT_DIR / "ledger.json"

FIRST_NAMES = ["Maria", "James", "Dorothy", "Priya", "Tyrone", "Linda", "Michael", "Aisha", "David",
                "Susan", "Carlos", "Emily", "Robert", "Nguyen", "Patricia", "Daniel", "Grace", "Omar"]
LAST_NAMES = ["Gonzalez", "Okafor", "Klein", "Nair", "Bell", "Johnson", "Smith", "Patel", "Williams",
              "Brown", "Rivera", "Chen", "Miller", "Davis", "Kowalski", "Murphy", "Rossi", "Hassan"]

ROCHESTER_BRANCHES = [
    "Chestnut Street (Headquarters)",
    "Greece Branch",
    "Webster Ridge Branch",
    "Penfield Branch",
    "Henrietta Branch",
    "Fairport Branch",
    "Irondequoit Branch",
    "Victor Branch",
]

CREDIT_BANDS = ["720+", "660-719", "Under 660"]
PRODUCT_OPTIONS = ["checking", "savings", "credit_card", "heloc", "auto_loan"]
LENDING_INTERESTS = ["auto_loan", "mortgage", "heloc", ""]

# Cycled over the first profiles so every segment in setup_esl_segments.py is populated
# even with a small --count: (status, lending_interest, credit_band, tier)
SEGMENT_SEEDS = [
    ("prospective", "auto_loan", None, None),  # esl_prospective_lending_intent
    ("existing", None, "720+", None),          # esl_existing_members_auto_refi
    ("existing", None, None, "Premier"),       # esl_high_balance_deposit_savers
    (None, "mortgage", None, None),            # esl_mortgage_homebuyer_intent
]


def monthly_payment(principal, annual_rate_pct, term_months):
    r = annual_rate_pct / 100 / 12
    return round(principal * r / (1 - (1 + r) ** (-term_months)), 2)


def load_ledger():
    if LEDGER_FILE.is_file():
        return json.loads(LEDGER_FILE.read_text())
    return {"next_index": 0, "profiles": {}, "runs": []}


def save_ledger(ledger):
    OUTPUT_DIR.mkdir(exist_ok=True)
    tmp = LEDGER_FILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(ledger, indent=2))
    tmp.replace(LEDGER_FILE)


def print_ledger(ledger):
    print(f"Ledger: {LEDGER_FILE}")
    print(f"  profiles uploaded: {len(ledger['profiles'])}  next email index: {ledger['next_index']}")
    for r in ledger["runs"]:
        print(f"  {r['run_id']}  seed={r['seed']}  profiles {r['profiles_uploaded']}/{r['profiles_generated']}"
              f"  events {r['events_uploaded']}/{r['events_generated']}")


LOCAL_TZ = ZoneInfo("America/New_York")
# Relative likelihood of a visit starting in each local hour (0-23): mostly daytime/evening,
# with the occasional late-night visitor.
HOUR_WEIGHTS = [1, 1, 1, 1, 1, 2, 3, 5, 7, 8, 8, 8, 8, 8, 8, 7, 7, 8, 9, 9, 8, 6, 4, 2]


def spread_creation_epochs(start, now, count):
    """One creation time per profile, evenly spread over [start, now].

    The window is cut into `count` equal slices with one profile per slice (so dates cover the
    whole window instead of clumping), the day is picked within the slice, and the time of day
    is drawn from HOUR_WEIGHTS in Rochester local time. Order is shuffled so segment-seeded
    profiles aren't all early. Never later than now."""
    lo, hi = start.timestamp(), now.timestamp()
    width = (hi - lo) / count
    epochs = []
    for i in range(count):
        day = datetime.fromtimestamp(random.uniform(lo + i * width, lo + (i + 1) * width), LOCAL_TZ)
        hour = random.choices(range(24), weights=HOUR_WEIGHTS)[0]
        local = day.replace(hour=hour, minute=random.randint(0, 59), second=random.randint(0, 59))
        epochs.append(int(min(max(local.timestamp(), lo), hi - 1)))
    random.shuffle(epochs)
    return epochs


def generate_customer_profiles(start, now, num_records=40, start_index=0):
    """Generates a mix of Existing Members and Prospective Members.

    start_index continues the email numbering from the ledger so emails are unique across runs.
    Each profile gets an internal _created_epoch spread across [start, now]; its first event is
    stamped then, which is what ODP uses for "First identified"."""
    profiles = []
    created_epochs = spread_creation_epochs(start, now, num_records)

    for i in range(num_records):
        seed = SEGMENT_SEEDS[i % len(SEGMENT_SEEDS)] if i < len(SEGMENT_SEEDS) * 2 else (None,) * 4
        seed_status, seed_interest, seed_band, seed_tier = seed

        first, last = random.choice(FIRST_NAMES), random.choice(LAST_NAMES)
        is_member = (seed_status == "existing") if seed_status else random.random() < 0.6
        email = f"demo.esl.{first.lower()}.{last.lower()}.{start_index + i}@example.com"
        vuid = f"vuid_esl_{uuid.uuid4().hex[:12]}"

        if is_member:
            member_id = f"ESL-{random.randint(100000, 999999)}"
            status = "existing"
            active_prods = random.sample(PRODUCT_OPTIONS, k=random.randint(1, 3))
            tier = seed_tier or random.choices(["Standard", "Premier", "Business"], weights=[0.6, 0.3, 0.1])[0]
            member_since = random.randint(2015, 2024)
            auto_rate = round(random.uniform(4.24, 5.49), 2)
        else:
            member_id = ""
            status = "prospective"
            active_prods = []
            tier = "Non-Member"
            member_since = None
            auto_rate = round(random.uniform(5.24, 6.74), 2)

        credit_band = seed_band or random.choices(CREDIT_BANDS, weights=[0.55, 0.35, 0.10])[0]
        lending_intent = seed_interest or random.choice(LENDING_INTERESTS)

        attributes = {
            "email": email,
            "vuid": vuid,
            "first_name": first,
            "last_name": last,
            "city": random.choice(["Rochester", "Webster", "Fairport", "Pittsford", "Penfield", "Greece"]),
            "state": "NY",
            "zip": random.choice(["14604", "14580", "14450", "14534", "14626"]),
            "esl_member_status": status,
            "member_id": member_id,
            "primary_branch": random.choice(ROCHESTER_BRANCHES),
            "relationship_tier": tier,
            "active_products": ",".join(active_prods),
            "lending_interest": lending_intent,
            "preapproved_auto_rate": auto_rate,
            "credit_score_band": credit_band,
        }
        if member_since is not None:
            attributes["member_since_year"] = member_since
        profiles.append({
            "attributes": attributes,
            "_created_epoch": created_epochs[i],
        })

    return profiles


def default_start_date(now):
    """August 1st of this year (or last year, if August hasn't happened yet)."""
    start = datetime(now.year, 8, 1, tzinfo=timezone.utc)
    return start if start <= now else start.replace(year=now.year - 1)


def generate_events_for_profiles(profiles, now):
    """Generates a first-touch event at each profile's creation time, then browsing,
    loan calculator and application events that all occur after it."""
    events = []
    now_epoch = int(now.timestamp())

    for p in profiles:
        attr = p["attributes"]
        created = p["_created_epoch"]
        cursor = created

        def advance():
            """Moves this profile's timeline forward a realistic gap (mostly within a session,
            sometimes days later) and returns the new ts, or None once it would pass now."""
            nonlocal cursor
            remaining = now_epoch - cursor
            if remaining < 30:
                return None
            gap = random.choice([random.uniform(20, 600), random.uniform(600, 6 * 3600),
                                 random.uniform(6 * 3600, 3 * 86400)])
            cursor += int(min(gap, remaining * 0.6))
            return cursor

        identifiers = {"email": attr["email"], "vuid": attr["vuid"]}
        is_member = attr["esl_member_status"] == "existing"
        lending_intent = attr["lending_interest"]

        # 1. First-touch event: anchors ODP's "First identified" date
        if is_member:
            events.append({
                "type": "account",
                "action": "create",
                "identifiers": identifiers,
                "data": {"ts": created},
            })
        else:
            events.append({
                "type": "navigation",
                "action": "pageview",
                "identifiers": identifiers,
                "data": {
                    "page_path": "/membership/join",
                    "page_title": "ESL - Membership Join",
                    "ts": created,
                },
            })

        # 2. Pageviews after creation
        path = "/personal/banking" if is_member else "/membership/join"
        if lending_intent == "auto_loan":
            path = "/loans/auto-loans"
        elif lending_intent == "mortgage":
            path = "/loans/mortgages"

        def add_pageviews(n):
            for _ in range(n):
                ts = advance()
                if ts is None:
                    return
                events.append({
                    "type": "navigation",
                    "action": "pageview",
                    "identifiers": identifiers,
                    "data": {
                        "page_path": path,
                        "page_title": f"ESL - {path.replace('/', ' ').strip().title()}",
                        "ts": ts,
                    },
                })

        add_pageviews(random.randint(2, 4))

        # 3. Loan Calculator Event (auto / mortgage intent), after the first pageviews
        calc_ts = None
        if lending_intent in ("auto_loan", "mortgage"):
            if lending_intent == "auto_loan":
                borrow_amt, term = 28000, 60
                rate = attr["preapproved_auto_rate"] if is_member else 5.74
            else:
                borrow_amt, term = 285000, 360
                rate = round(random.uniform(6.25, 7.25), 2)

            calc_ts = advance()
            if calc_ts is not None:
                events.append({
                    "type": "loan_calculator",
                    "action": "calculate",
                    "identifiers": identifiers,
                    "data": {
                        "loan_type": lending_intent,
                        "borrow_amount": borrow_amt,
                        "loan_term_months": term,
                        "interest_rate": rate,
                        "calculated_monthly_payment": monthly_payment(borrow_amt, rate, term),
                        "ts": calc_ts,
                    },
                })

        add_pageviews(random.randint(1, 4))

        # 4. Application Start Event, last in the timeline (after the calculator use when there was one)
        if lending_intent and random.random() < 0.35:
            app_ts = advance()
            if app_ts is not None:
                events.append({
                    "type": "application",
                    "action": "start",
                    "identifiers": identifiers,
                    "data": {
                        "product_name": f"ESL {lending_intent.replace('_', ' ').title()}",
                        "step_name": "Applicant Information",
                        "ts": app_ts,
                    },
                })

    return events


def send_batch(url, headers, items, label, dry_run, on_success=None, chunk_size=25):
    """POSTs items to ODP in chunks. Returns the number of failed chunks.

    on_success(chunk) is called for each chunk ODP accepted."""
    failures = 0
    for i in range(0, len(items), chunk_size):
        chunk = items[i:i + chunk_size]
        n = i // chunk_size + 1
        if dry_run:
            print(f"  [DRY-RUN] POST {url} ({len(chunk)} {label}, batch {n})")
            continue

        try:
            resp = requests.post(url, headers=headers, json=chunk, timeout=30)
        except requests.RequestException as e:
            print(f"  [FAILED]  {label} batch {n}: {e}")
            failures += 1
            continue

        if resp.status_code in (200, 201, 202):
            print(f"  [SUCCESS] {label} batch {n} ({len(chunk)} records) accepted.")
            if on_success:
                on_success(chunk)
        else:
            print(f"  [FAILED]  {label} batch {n}: {resp.status_code} - {resp.text}")
            failures += 1
        time.sleep(0.5)
    return failures


def print_summary(profiles, events):
    attrs = [p["attributes"] for p in profiles]
    print(f"\nProfiles: {len(profiles)}  Events: {len(events)}")
    print("  status:  ", dict(Counter(a["esl_member_status"] for a in attrs)))
    print("  tier:    ", dict(Counter(a["relationship_tier"] for a in attrs)))
    print("  interest:", dict(Counter(a["lending_interest"] or "(none)" for a in attrs)))
    print("  events:  ", dict(Counter(f"{e['type']}/{e['action']}" for e in events)))


def main():
    parser = argparse.ArgumentParser(description="Generate (and optionally upload) ESL demo data for ODP.")
    parser.add_argument("--count", type=int, default=40, help="number of profiles (default 40)")
    parser.add_argument("--seed", type=int, help="random seed for repeatable data")
    parser.add_argument("--upload", action="store_true", help="push generated data to ODP")
    parser.add_argument("--start-date", help="earliest event date, YYYY-MM-DD (default: August 1st); events span this date to now")
    parser.add_argument("--ledger", action="store_true", help="print the upload ledger and exit")
    parser.add_argument("--dry-run", action="store_true", help="generate and save files, print the upload requests, send nothing")
    args = parser.parse_args()

    ledger = load_ledger()
    if args.ledger:
        print_ledger(ledger)
        return

    if args.seed is not None:
        random.seed(args.seed)

    now = datetime.now(timezone.utc)
    start = default_start_date(now)
    if args.start_date:
        try:
            start = datetime.strptime(args.start_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
        except ValueError:
            sys.exit("--start-date must be YYYY-MM-DD.")
        if start >= now:
            sys.exit("--start-date must be in the past.")

    print("=== ESL Federal Credit Union: ODP Demo Data Generator ===")
    print(f"Event dates: {start.date()} to {now.date()}")
    start_index = ledger["next_index"]
    profiles = generate_customer_profiles(start, now, args.count, start_index)
    events = generate_events_for_profiles(profiles, now)
    print_summary(profiles, events)

    # Internal helper keys (_created_epoch) never reach disk or ODP
    profiles_clean = [{"attributes": p["attributes"]} for p in profiles]

    OUTPUT_DIR.mkdir(exist_ok=True)
    (OUTPUT_DIR / "esl_profiles.json").write_text(json.dumps(profiles_clean, indent=2))
    (OUTPUT_DIR / "esl_events.json").write_text(json.dumps(events, indent=2))
    print(f"\nSaved payloads to {OUTPUT_DIR}/esl_profiles.json and esl_events.json.")

    if not args.upload and not args.dry_run:
        print("Not uploading (pass --upload to push to ODP, or --dry-run to preview the requests).")
        return

    load_env()
    api_key = os.environ.get("ODP_PRIVATE_API_KEY")
    if not api_key and not args.dry_run:
        sys.exit(f"ODP_PRIVATE_API_KEY is not set in the environment or {ENV_FILE}.")

    region = os.environ.get("ODP_REGION", "us1")
    base = f"https://api.{region}.odp.optimizely.com/v3"
    headers = {"x-api-key": api_key or "", "Content-Type": "application/json"}

    run = None
    if not args.dry_run:
        run_id = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
        run_dir = OUTPUT_DIR / "runs" / run_id
        run_dir.mkdir(parents=True, exist_ok=True)
        (run_dir / "esl_profiles.json").write_text(json.dumps(profiles_clean, indent=2))
        (run_dir / "esl_events.json").write_text(json.dumps(events, indent=2))
        run = {"run_id": run_id, "seed": args.seed, "profiles_generated": len(profiles),
               "profiles_uploaded": 0, "events_generated": len(events), "events_uploaded": 0,
               "region": region, "payloads": str(run_dir)}
        ledger["runs"].append(run)
        # Reserve the indices before sending so a partial failure never reuses an email.
        ledger["next_index"] = start_index + len(profiles)
        save_ledger(ledger)
        print(f"\nArchived this run's payloads to {run_dir}")

    def record_profiles(chunk):
        now = datetime.now(timezone.utc).isoformat()
        for p in chunk:
            a = p["attributes"]
            ledger["profiles"][a["email"]] = {"vuid": a["vuid"], "run_id": run["run_id"], "uploaded_at": now}
        run["profiles_uploaded"] += len(chunk)
        save_ledger(ledger)

    def record_events(chunk):
        run["events_uploaded"] += len(chunk)
        save_ledger(ledger)

    # Events first so ODP sees each customer's earliest ts before the profile attributes arrive.
    print("\n--- 1. Uploading events (sets the timeline and First identified dates) ---")
    failures = send_batch(f"{base}/events", headers, events, "events", args.dry_run,
                          None if args.dry_run else record_events)
    print("\n--- 2. Uploading profiles (applies attributes) ---")
    failures += send_batch(f"{base}/profiles", headers, profiles_clean, "profiles", args.dry_run,
                           None if args.dry_run else record_profiles)

    if failures:
        sys.exit(f"\nUpload finished with {failures} failed batch(es).")
    if args.dry_run:
        print("\nDry run complete. Nothing was sent. Review the files in the output folder.")
        return
    print("\nUpload complete. Segments may take a few minutes to populate in ODP.")


if __name__ == "__main__":
    main()

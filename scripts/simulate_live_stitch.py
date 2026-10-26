#!/usr/bin/env python3
"""
ESL Federal Credit Union - live identity resolution & stitch simulator.
Runs Act 2 (anonymous intent) and Act 3 (identity stitch) from the terminal, as a fallback
if the site or network misbehaves on stage. Reads ODP_PRIVATE_API_KEY and ODP_REGION from .env.
"""
import json
import os
import sys
import time
import urllib.error
import urllib.request

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "mo-build-instructions", "scripts"))
from _env import load_env  # noqa: E402

load_env()

API_KEY = os.environ.get("ODP_PRIVATE_API_KEY")
REGION = os.environ.get("ODP_REGION", "us1")
TARGET_EMAIL = os.environ.get("DEMO_STITCH_EMAIL", "demo.esl.maria.gonzalez.0@example.com")

if not API_KEY:
    sys.exit("Error: ODP_PRIVATE_API_KEY is not set in the environment or .env.")

EVENT_URL = f"https://api.{REGION}.odp.optimizely.com/v3/events"
DEMO_VUID = f"vuid_esl_live_{int(time.time())}"


def banner(text):
    print("\n" + "=" * 70 + f"\n {text}\n" + "=" * 70)


def post(events):
    request = urllib.request.Request(
        EVENT_URL,
        data=json.dumps(events).encode(),
        headers={"x-api-key": API_KEY, "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            return response.status, ""
    except urllib.error.HTTPError as error:
        return error.code, error.read().decode(errors="replace")
    except urllib.error.URLError as error:
        return 0, str(error.reason)


def main():
    banner("ESL live identity resolution & zero-PII demo")
    print(f"ODP instance : api.{REGION}.odp.optimizely.com")
    print(f"Demo VUID    : {DEMO_VUID}")
    print(f"Member email : {TARGET_EMAIL}")

    input("\n[ENTER] Act 2: anonymous browsing and loan calculator...")
    now = int(time.time())
    status, detail = post([
        {"type": "navigation", "action": "pageview", "identifiers": {"vuid": DEMO_VUID},
         "data": {"ts": now - 120, "page_path": "/personal/auto-loans", "page_title": "ESL - Auto Loans & Refinancing"}},
        {"type": "loan_calculator", "action": "calculate", "identifiers": {"vuid": DEMO_VUID},
         "data": {"ts": now - 60, "loan_type": "auto_loan", "borrow_amount": 32000, "loan_term_months": 60,
                  "interest_rate": 5.49, "calculated_monthly_payment": 611.09}},
    ])
    if status not in (200, 201, 202):
        sys.exit(f"  [ERROR] {status} {detail}")
    print(f"  [OK] anonymous events accepted ({status}). Search ODP profiles for {DEMO_VUID}.")

    input("\n[ENTER] Act 3: login event (stitch vuid to member email)...")
    status, detail = post([
        {"type": "customer", "action": "login", "identifiers": {"vuid": DEMO_VUID, "email": TARGET_EMAIL},
         "data": {"ts": int(time.time()), "channel": "online_banking"}},
    ])
    if status not in (200, 201, 202):
        sys.exit(f"  [ERROR] {status} {detail}")
    print(f"  [OK] login event accepted ({status}). Open {TARGET_EMAIL}; {DEMO_VUID} should be merged.")

    banner("Demo run complete")


if __name__ == "__main__":
    main()

# ESL Federal Credit Union — ODP Historical Event & Profile Generator

A complete guide and production-ready script for generating and ingesting synthetic customer profiles and behavioral events into **Optimizely Data Platform (ODP)** with realistic, historical timestamp distribution.

---

## 1. Root Cause Analysis

### Issue A: Event Timestamps Clustered at the Same Time
In ODP's `POST /v3/events` API:
* **The API Contract:** The top-level event payload strictly accepts four keys: `type`, `action`, `identifiers`, and `data`.
* **Where `ts` Lives:** The timestamp field (`ts`) must reside **inside the `data` dictionary**, not at the root level of the event JSON.
* **Fallback Behavior:** When `"ts"` is sent at the root level, the ODP ingestion engine silently ignores it and applies the fallback rule:
  > *"If the `ts` parameter is left blank, the received time will be used as the timestamp for the event."*
* **The Fix:** Move `"ts": <epoch_seconds>` inside `"data": { "ts": ..., ... }`.

### Issue B: Customer Profile Creation Date ("First Identified") All Showing Today
In ODP's architecture:
* **How "First Identified" is Calculated:** The Customer Profile banner (`First identified: <date>`) and the **Customer Growth for All Channels** bar chart are driven by the **earliest event timestamp (`ts`)** associated with that customer's identifiers (`email` / `vuid`).
* **Why It Defaulted to Today:** 
  1. The event timestamps failed to register in the past due to Issue A.
  2. Profiles were uploaded first via `POST /v3/profiles`. In the absence of earlier historical events, ODP recorded the initial creation timestamp as the moment the API call was processed.
* **The Fix:**
  1. Assign each profile a unique `_created_epoch` between `start_date` and `now`.
  2. Emit an explicit **First-Touch / Account Creation event** at that exact timestamp (`account/create` for members, initial `navigation/pageview` for prospective members).
  3. Ensure all subsequent interactions (pageviews, loan calculations, application starts) occur chronologically *after* `_created_epoch`.
  4. Invert upload ordering: upload **events first**, then profiles.

---

## 2. Complete Patched Script (`generate_esl_odp_data.py`)

Save and run this script in your repository. It includes the complete Rochester credit union demographic model, ledger tracking, audience seed cohorts, correct `data.ts` placement, and historical account creation events.

```python
#!/usr/bin/env python3
"""
ESL Federal Credit Union - Synthetic Customer & Historical Event Generator for ODP
==================================================================================
Generates realistic Rochester-area credit union member profiles and historical
behavioral events distributed across a date window (e.g., August 1st to today).

Key Architecture:
  1. Distributes profile creation dates across the date window.
  2. Emits an initial discovery / account creation event for each customer at their creation timestamp.
  3. Places "ts" INSIDE "data" for all events (required by ODP POST /v3/events).
  4. Ensures subsequent events (pageviews, calculator, application) occur after creation.
  5. Ingests events FIRST so ODP identity resolution backdates "First Identified" dates
     and populates the Customer Growth Over Time chart.

Usage:
    python3 generate_esl_odp_data.py --count 40 --upload
    python3 generate_esl_odp_data.py --count 20 --dry-run
    python3 generate_esl_odp_data.py --ledger
"""
import argparse
from collections import Counter
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import random
import sys
import time
import uuid

import requests

from _env import ENV_FILE, load_env

OUTPUT_DIR = Path(__file__).resolve().parent / "output"
LEDGER_FILE = OUTPUT_DIR / "ledger.json"

FIRST_NAMES = [
    "Maria", "James", "Dorothy", "Priya", "Tyrone", "Sarah", "Michael",
    "Emily", "David", "Jessica", "Marcus", "Elena", "Devon", "Aaliyah", "Brian"
]
LAST_NAMES = [
    "Gonzalez", "Okafor", "Klein", "Nair", "Bell", "Chen", "Patel",
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson"
]
ROCHESTER_BRANCHES = [
    "Chestnut (Main Office)", "Webster", "Fairport", "Pittsford",
    "Penfield", "Greece", "Irondequoit", "Henrietta", "Brighton"
]
PRODUCT_OPTIONS = [
    "Free Checking", "Premier Checking", "High Yield Savings",
    "Auto Loan", "Mortgage", "Home Equity Line", "Visa Credit Card"
]
LENDING_INTERESTS = ["auto_loan", "mortgage", "home_equity", "personal_loan"]
CREDIT_BANDS = ["720+", "660-719", "Under 660"]

# Targeted seeds to guarantee qualification in your 4 core real-time segments
SEGMENT_SEEDS = [
    ("prospective", "auto_loan", "720+", "Non-Member"),
    ("prospective", "auto_loan", "660-719", "Non-Member"),
    ("existing", "auto_loan", "720+", "Premier"),
    ("existing", "auto_loan", "720+", "Standard"),
    ("existing", "auto_loan", "660-719", "Standard"),
    ("existing", None, "720+", "Premier"),
    ("existing", None, "720+", "Business"),
    ("prospective", "mortgage", "720+", "Non-Member"),
    ("existing", "mortgage", "720+", "Standard"),
]


def load_ledger():
    if not LEDGER_FILE.exists():
        return {"profiles": {}, "runs": [], "next_index": 0}
    try:
        data = json.loads(LEDGER_FILE.read_text())
        if not isinstance(data.get("profiles"), dict):
            data["profiles"] = {}
        if not isinstance(data.get("runs"), list):
            data["runs"] = []
        if "next_index" not in data:
            data["next_index"] = len(data["profiles"])
        return data
    except Exception as e:
        print(f"Warning: could not read {LEDGER_FILE} ({e}); starting fresh ledger in memory.")
        return {"profiles": {}, "runs": [], "next_index": 0}


def save_ledger(ledger):
    OUTPUT_DIR.mkdir(exist_ok=True)
    LEDGER_FILE.write_text(json.dumps(ledger, indent=2))


def print_ledger(ledger):
    print(f"Ledger: {LEDGER_FILE}")
    print(f"  profiles uploaded: {len(ledger['profiles'])}  next email index: {ledger['next_index']}")
    for r in ledger["runs"]:
        print(f"  {r['run_id']}  seed={r['seed']}  profiles {r['profiles_uploaded']}/{r['profiles_generated']}"
              f"  events {r['events_uploaded']}/{r['events_generated']}")


def default_start_date(now):
    """August 1st of this year (or last year, if August hasn't happened yet)."""
    start = datetime(now.year, 8, 1, tzinfo=timezone.utc)
    return start if start <= now else start.replace(year=now.year - 1)


def monthly_payment(principal, annual_rate_pct, months):
    if months <= 0:
        return 0.0
    r = (annual_rate_pct / 100.0) / 12.0
    if r == 0:
        return round(principal / months, 2)
    return round(principal * (r * (1 + r) ** months) / ((1 + r) ** months - 1), 2)


def generate_customer_profiles(num_records=40, start_index=0, start_date=None, now=None):
    """Generates customer profiles with randomized creation dates across the date window."""
    profiles = []
    start_ts = start_date.timestamp() if start_date else default_start_date(datetime.now(timezone.utc)).timestamp()
    now_ts = now.timestamp() if now else datetime.now(timezone.utc).timestamp()

    for i in range(num_records):
        seed = SEGMENT_SEEDS[i % len(SEGMENT_SEEDS)] if i < len(SEGMENT_SEEDS) * 2 else (None,) * 4
        seed_status, seed_interest, seed_band, seed_tier = seed

        first, last = random.choice(FIRST_NAMES), random.choice(LAST_NAMES)
        is_member = (seed_status == "existing") if seed_status else random.random() < 0.6
        email = f"demo.esl.{first.lower()}.{last.lower()}.{start_index + i}@example.com"
        vuid = f"vuid_esl_{uuid.uuid4().hex[:12]}"

        # Distribute profile creation across the historical range
        profile_created_epoch = int(random.uniform(start_ts, now_ts))
        profile_created_iso = datetime.fromtimestamp(profile_created_epoch, timezone.utc).isoformat()

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
            "created_at": profile_created_iso,
        }
        if member_since is not None:
            attributes["member_since_year"] = member_since

        profiles.append({
            "attributes": attributes,
            "_created_epoch": profile_created_epoch,
        })

    return profiles


def generate_events_for_profiles(profiles, now):
    """Generates chronological events anchored to each profile's creation date."""
    events = []
    now_epoch = now.timestamp()

    def ts_between(lo, hi):
        if lo >= hi:
            return int(lo)
        return int(random.uniform(lo, hi))

    for p in profiles:
        attr = p["attributes"]
        created_epoch = p["_created_epoch"]
        identifiers = {"email": attr["email"], "vuid": attr["vuid"]}
        is_member = attr["esl_member_status"] == "existing"
        lending_intent = attr["lending_interest"]

        # ----------------------------------------------------------------------
        # 1. FIRST-TOUCH EVENT (Anchors "First Identified" date in ODP)
        # ----------------------------------------------------------------------
        if is_member:
            events.append({
                "type": "account",
                "action": "create",
                "identifiers": identifiers,
                "data": {
                    "ts": created_epoch,  # <-- Correct: Inside data
                    "channel": "online_banking",
                    "member_id": attr["member_id"],
                }
            })
        else:
            events.append({
                "type": "navigation",
                "action": "pageview",
                "identifiers": identifiers,
                "data": {
                    "ts": created_epoch,  # <-- Correct: Inside data
                    "page_path": "/membership/join",
                    "page_title": "ESL - Join ESL Federal Credit Union",
                }
            })

        # ----------------------------------------------------------------------
        # 2. SUBSEQUENT PAGEVIEWS (Occur after creation)
        # ----------------------------------------------------------------------
        path = "/personal/banking" if is_member else "/membership/join"
        if lending_intent == "auto_loan":
            path = "/loans/auto-loans"
        elif lending_intent == "mortgage":
            path = "/loans/mortgages"

        pv_ts = ts_between(created_epoch, now_epoch)
        events.append({
            "type": "navigation",
            "action": "pageview",
            "identifiers": identifiers,
            "data": {
                "ts": pv_ts,
                "page_path": path,
                "page_title": f"ESL - {path.replace('/', ' ').strip().title()}",
            }
        })

        # ----------------------------------------------------------------------
        # 3. LOAN CALCULATOR EVENTS (Occur after creation)
        # ----------------------------------------------------------------------
        calc_ts = None
        if lending_intent:
            calc_ts = ts_between(created_epoch, now_epoch)
            borrow_amt = 28000 if lending_intent == "auto_loan" else 285000
            term = 60 if lending_intent == "auto_loan" else 360
            rate = attr["preapproved_auto_rate"] if lending_intent == "auto_loan" else 6.12

            events.append({
                "type": "loan_calculator",
                "action": "calculate",
                "identifiers": identifiers,
                "data": {
                    "ts": calc_ts,
                    "loan_type": lending_intent,
                    "borrow_amount": borrow_amt,
                    "loan_term_months": term,
                    "interest_rate": rate,
                    "calculated_monthly_payment": monthly_payment(borrow_amt, rate, term),
                }
            })

        # ----------------------------------------------------------------------
        # 4. APPLICATION START EVENT (Occurs after calculator calculation)
        # ----------------------------------------------------------------------
        if lending_intent and random.random() < 0.35:
            app_lo = calc_ts if calc_ts else created_epoch
            events.append({
                "type": "application",
                "action": "start",
                "identifiers": identifiers,
                "data": {
                    "ts": ts_between(app_lo, now_epoch),
                    "product_name": f"ESL {lending_intent.replace('_', ' ').title()}",
                    "step_name": "Applicant Information",
                }
            })

    return events


def send_batch(url, headers, items, label, dry_run, on_success=None, chunk_size=25):
    """POSTs items to ODP in chunks."""
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
    parser = argparse.ArgumentParser(description="Generate and upload ESL historical demo data for ODP.")
    parser.add_argument("--count", type=int, default=40, help="number of profiles (default 40)")
    parser.add_argument("--seed", type=int, help="random seed for repeatable data")
    parser.add_argument("--upload", action="store_true", help="push generated data to ODP")
    parser.add_argument("--start-date", help="earliest date YYYY-MM-DD (default: August 1st); dates span this to now")
    parser.add_argument("--ledger", action="store_true", help="print the upload ledger and exit")
    parser.add_argument("--dry-run", action="store_true", help="generate and save files, print requests, send nothing")
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

    print("=== ESL Federal Credit Union: ODP Historical Demo Data Generator ===")
    print(f"Date window: {start.date()} to {now.date()}")
    start_index = ledger["next_index"]
    profiles = generate_customer_profiles(args.count, start_index, start, now)
    events = generate_events_for_profiles(profiles, now)
    print_summary(profiles, events)

    OUTPUT_DIR.mkdir(exist_ok=True)
    # Strip internal helper keys for disk JSON
    profiles_clean = [{"attributes": p["attributes"]} for p in profiles]
    (OUTPUT_DIR / "esl_profiles.json").write_text(json.dumps(profiles_clean, indent=2))
    (OUTPUT_DIR / "esl_events.json").write_text(json.dumps(events, indent=2))
    print(f"\nSaved payloads to {OUTPUT_DIR}/esl_profiles.json and esl_events.json.")

    if not args.upload and not args.dry_run:
        print("Not uploading (pass --upload to push to ODP, or --dry-run to preview requests).")
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
        run = {
            "run_id": run_id, "seed": args.seed, "profiles_generated": len(profiles),
            "profiles_uploaded": 0, "events_generated": len(events), "events_uploaded": 0,
            "region": region, "payloads": str(run_dir)
        }
        ledger["runs"].append(run)
        ledger["next_index"] = start_index + len(profiles)
        save_ledger(ledger)
        print(f"\nArchived this run's payloads to {run_dir}")

    def record_profiles(chunk):
        upload_ts = datetime.now(timezone.utc).isoformat()
        for p in chunk:
            a = p["attributes"]
            ledger["profiles"][a["email"]] = {"vuid": a["vuid"], "run_id": run["run_id"], "uploaded_at": upload_ts}
        run["profiles_uploaded"] += len(chunk)
        save_ledger(ledger)

    def record_events(chunk):
        run["events_uploaded"] += len(chunk)
        save_ledger(ledger)

    # --------------------------------------------------------------------------
    # UPLOAD ORDER: EVENTS FIRST, THEN PROFILES
    # --------------------------------------------------------------------------
    print("\n--- 1. Uploading Historical Events (Establishes Timeline & First Identified Dates) ---")
    failures = send_batch(f"{base}/events", headers, events, "events", args.dry_run,
                          None if args.dry_run else record_events)

    print("\n--- 2. Uploading Customer Profiles (Applies Demographic & Core Banking Attributes) ---")
    failures += send_batch(f"{base}/profiles", headers, profiles_clean, "profiles", args.dry_run,
                           None if args.dry_run else record_profiles)

    if failures:
        sys.exit(f"\nUpload finished with {failures} failed batch(es).")
    if args.dry_run:
        print("\nDry run complete. Nothing sent.")
        return
    print("\nUpload complete! Verification in ODP:")
    print("  1. Customers > Profiles: Customer Growth chart will display distributed bars across the date window.")
    print("  2. Individual Profile Banner: 'First identified' will display each user's unique historical date.")
    print("  3. Event History: Activity timeline will display chronological progression over time.")


if __name__ == "__main__":
    main()
```

---

## 3. Step-by-Step Execution Guide

### Step 1: Ensure Prerequisites are Met
Make sure your `.env` contains:
```bash
ODP_PRIVATE_API_KEY="your_private_api_key_here"
ODP_REGION="us1"
```

### Step 2: Run a Dry-Run Verification
Preview the generated records without sending network calls:
```bash
python3 generate_esl_odp_data.py --count 40 --start-date 2026-08-01 --dry-run
```
Inspect the output in `output/esl_events.json` to verify that `"ts"` appears inside `"data"`:
```json
{
  "type": "navigation",
  "action": "pageview",
  "identifiers": {
    "email": "demo.esl.maria.gonzalez.0@example.com",
    "vuid": "vuid_esl_a1b2c3d4e5f6"
  },
  "data": {
    "ts": 1785642890,
    "page_path": "/loans/auto-loans",
    "page_title": "ESL - Loans Auto Loans"
  }
}
```

### Step 3: Execute the Live Upload
Push the batch to ODP:
```bash
python3 generate_esl_odp_data.py --count 40 --start-date 2026-08-01 --upload
```

---

## 4. UI Verification in ODP

Once uploaded, log in to your ODP tenant to verify:

1. **Customer Growth for All Channels Chart (`Customers > Profiles`):**
   * Filter the chart to **Past 90 Days**.
   * Instead of a single spike on today, you will see blue bars distributed across August, September, and October representing authentic member acquisition and prospective onboarding over time.
2. **Individual Profile Banner:**
   * In the **Customer Profiles table**, search for any demo member (e.g., `demo.esl.maria.gonzalez.0@example.com`).
   * Look at the banner at the top of the profile: **"First identified"** will display their assigned date (e.g., *Aug 14, 2026* or *Sep 22, 2026*).
3. **Event History Timeline:**
   * Click the **Event History** tab.
   * Verify that the initial event (`Account Create` for members, `Pageview` on `/membership/join` for prospects) sits at the start of their timeline, followed days or weeks later by their loan calculator usage and application starts.

#!/usr/bin/env python3
"""
ESL Federal Credit Union - ODP Schema Setup Script
Provisions all custom attributes on 'customers' and 'events' objects via ODP v3 REST API.

Usage:
    python3 setup_esl_schema.py [--dry-run]

Reads ODP_PRIVATE_API_KEY and ODP_REGION (us1 default, eu1, ap1) from the repo-root .env.
Variables already set in the shell take precedence over .env.

Safe to re-run: fields that already exist are reported and skipped.
"""
import argparse
import os
import sys

import requests

from _env import ENV_FILE, load_env

# 1. Custom fields for 'customers' object
CUSTOMER_FIELDS = [
    {"name": "esl_member_status", "display_name": "Member Status", "type": "string", "description": "prospective vs existing"},
    {"name": "member_id", "display_name": "Member ID", "type": "string", "description": "Core banking identifier"},
    {"name": "member_since_year", "display_name": "Member Since Year", "type": "number", "description": "Tenure year"},
    {"name": "primary_branch", "display_name": "Primary Branch", "type": "string", "description": "Rochester footprint branch"},
    {"name": "relationship_tier", "display_name": "Relationship Tier", "type": "string", "description": "Non-Member, Standard, Premier, Business"},
    {"name": "active_products", "display_name": "Active Products", "type": "string", "description": "Comma-separated products"},
    {"name": "lending_interest", "display_name": "Lending Interest", "type": "string", "description": "Inferred intent: auto_loan, mortgage, heloc"},
    {"name": "preapproved_auto_rate", "display_name": "Pre-Approved Auto APR", "type": "number", "description": "Qualified interest rate"},
    {"name": "credit_score_band", "display_name": "Credit Score Band", "type": "string", "description": "720+, 660-719, Under 660"},
]

# 2. Custom fields for 'events' object
EVENT_FIELDS = [
    {"name": "loan_type", "display_name": "Loan Type", "type": "string", "description": "auto_loan, mortgage, heloc, personal"},
    {"name": "borrow_amount", "display_name": "Borrow Amount", "type": "number", "description": "Principal amount input"},
    {"name": "loan_term_months", "display_name": "Loan Term (Months)", "type": "number", "description": "36, 48, 60, 72, 360"},
    {"name": "interest_rate", "display_name": "Interest Rate Calculated", "type": "number", "description": "Rate used in calculation"},
    {"name": "calculated_monthly_payment", "display_name": "Calculated Payment", "type": "number", "description": "Monthly payment result"},
    {"name": "product_name", "display_name": "Application Product Name", "type": "string", "description": "Name of applied product"},
    {"name": "step_name", "display_name": "Application Step", "type": "string", "description": "Funnel step name"},
]


def provision_fields(base_url, headers, object_name, field_definitions, dry_run):
    print(f"\nProvisioning schema for '{object_name}'...")
    url = f"{base_url}/{object_name}/fields"
    failures = 0

    for f in field_definitions:
        payload = {**f, "public_read": True}  # Allows access by Web SDK and WebEx targeting
        if dry_run:
            print(f"  [DRY-RUN] POST {url} {payload['name']} ({payload['type']})")
            continue

        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=30)
        except requests.RequestException as e:
            print(f"  [FAILED]  {f['name']}: {e}")
            failures += 1
            continue

        if resp.status_code in (200, 201):
            print(f"  [CREATED] {f['name']} ({f['type']})")
        elif resp.status_code == 409 or "already exists" in resp.text.lower():
            print(f"  [EXISTS]  {f['name']} already exists.")
        else:
            print(f"  [FAILED]  {f['name']}: {resp.status_code} - {resp.text}")
            failures += 1

    return failures


def main():
    parser = argparse.ArgumentParser(description="Provision ESL custom fields in ODP.")
    parser.add_argument("--dry-run", action="store_true", help="print requests without sending them")
    args = parser.parse_args()

    load_env(ENV_FILE)
    api_key = os.environ.get("ODP_PRIVATE_API_KEY")
    if not api_key and not args.dry_run:
        sys.exit(f"ODP_PRIVATE_API_KEY is not set in the environment or {ENV_FILE}.")

    region = os.environ.get("ODP_REGION", "us1")
    base_url = f"https://api.{region}.odp.optimizely.com/v3/schema/objects"
    headers = {"x-api-key": api_key or "", "Content-Type": "application/json"}

    print("=== Provisioning ESL Credit Union Schema in ODP ===")
    failures = provision_fields(base_url, headers, "customers", CUSTOMER_FIELDS, args.dry_run)
    failures += provision_fields(base_url, headers, "events", EVENT_FIELDS, args.dry_run)

    if failures:
        sys.exit(f"\nSchema configuration finished with {failures} failure(s).")
    print("\nSchema configuration completed.")


if __name__ == "__main__":
    main()

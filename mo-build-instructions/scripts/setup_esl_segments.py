#!/usr/bin/env python3
"""
ESL Federal Credit Union - Automated ODP Segment Setup Script
Provisions real-time audience segments in ODP via PUT /v3/segments/{segment_id}.
Also provisions corresponding Web Experimentation audiences via the WebEx REST API.

Usage:
    python3 setup_esl_segments.py [--dry-run]

Reads from the repo-root .env (shell variables take precedence):
    ODP_PRIVATE_API_KEY           required for ODP segments
    ODP_REGION                    us1 (default), eu1, ap1
    OPTIMIZELY_WEBEX_API_TOKEN    optional; WebEx audiences are skipped if unset
    OPTIMIZELY_WEBEX_PROJECT_ID   optional; defaults to the project in src/app/layout.tsx

Safe to re-run: PUT upserts ODP segments (existing ones are updated); existing WebEx audiences are skipped.
"""
import argparse
import os
import sys

import requests

from _env import ENV_FILE, load_env

DEFAULT_WEBEX_PROJECT_ID = 4775830914596864  # From src/app/layout.tsx
WEBEX_API_BASE = "https://api.optimizely.com/v2/audiences"

# ==============================================================================
# 1. ODP REAL-TIME SEGMENT DEFINITIONS (ODP AST FORMAT)
# ==============================================================================
ODP_SEGMENTS = [
    {
        "segment_id": "esl_prospective_lending_intent",
        "description": "Prospective members exhibiting auto loan interest",
        "definition": {
            "root_condition": {
                "combination": {
                    "conjunction": "AND",
                    "conditions": [
                        {
                            "customer_condition": {
                                "customer_filter": {
                                    "comparison": {
                                        "lhs": {"path_reference": {"value": "customer.esl_member_status"}},
                                        "comparator": "EQUAL",
                                        "rhs": {"string_literal": {"value": "prospective"}}
                                    }
                                }
                            }
                        },
                        {
                            "customer_condition": {
                                "customer_filter": {
                                    "comparison": {
                                        "lhs": {"path_reference": {"value": "customer.lending_interest"}},
                                        "comparator": "EQUAL",
                                        "rhs": {"string_literal": {"value": "auto_loan"}}
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        }
    },
    {
        "segment_id": "esl_existing_members_auto_refi",
        "description": "Existing members with credit score 720+ eligible for auto refinance",
        "definition": {
            "root_condition": {
                "combination": {
                    "conjunction": "AND",
                    "conditions": [
                        {
                            "customer_condition": {
                                "customer_filter": {
                                    "comparison": {
                                        "lhs": {"path_reference": {"value": "customer.esl_member_status"}},
                                        "comparator": "EQUAL",
                                        "rhs": {"string_literal": {"value": "existing"}}
                                    }
                                }
                            }
                        },
                        {
                            "customer_condition": {
                                "customer_filter": {
                                    "comparison": {
                                        "lhs": {"path_reference": {"value": "customer.credit_score_band"}},
                                        "comparator": "EQUAL",
                                        "rhs": {"string_literal": {"value": "720+"}}
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        }
    },
    {
        "segment_id": "esl_high_balance_deposit_savers",
        "description": "Existing Premier and Business members for high-yield savings / CD promotions",
        "definition": {
            "root_condition": {
                "combination": {
                    "conjunction": "AND",
                    "conditions": [
                        {
                            "customer_condition": {
                                "customer_filter": {
                                    "comparison": {
                                        "lhs": {"path_reference": {"value": "customer.esl_member_status"}},
                                        "comparator": "EQUAL",
                                        "rhs": {"string_literal": {"value": "existing"}}
                                    }
                                }
                            }
                        },
                        {
                            "customer_condition": {
                                "customer_filter": {
                                    "combination": {
                                        "conjunction": "OR",
                                        "expressions": [
                                            {
                                                "comparison": {
                                                    "lhs": {"path_reference": {"value": "customer.relationship_tier"}},
                                                    "comparator": "EQUAL",
                                                    "rhs": {"string_literal": {"value": "Premier"}}
                                                }
                                            },
                                            {
                                                "comparison": {
                                                    "lhs": {"path_reference": {"value": "customer.relationship_tier"}},
                                                    "comparator": "EQUAL",
                                                    "rhs": {"string_literal": {"value": "Business"}}
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        }
    },
    {
        "segment_id": "esl_mortgage_homebuyer_intent",
        "description": "Visitors browsing or calculating home mortgages",
        "definition": {
            "root_condition": {
                "customer_condition": {
                    "customer_filter": {
                        "comparison": {
                            "lhs": {"path_reference": {"value": "customer.lending_interest"}},
                            "comparator": "EQUAL",
                            "rhs": {"string_literal": {"value": "mortgage"}}
                        }
                    }
                }
            }
        }
    }
]


# ==============================================================================
# 2. WEB EXPERIMENTATION AUDIENCE DEFINITIONS (COOKIE-BASED SYNC)
# ==============================================================================
def webex_audiences(project_id):
    return [
        {
            "project_id": project_id,
            "name": "ESL Existing Members (esl_signed_in)",
            "description": "Authenticated members identified by esl_signed_in cookie",
            "conditions": "[\"and\", {\"type\": \"cookies\", \"name\": \"esl_signed_in\", \"value\": \"1\"}]",
            "is_classic": False,
            "segmentation": False,
        },
        {
            "project_id": project_id,
            "name": "ESL Prospective Members (Anonymous)",
            "description": "Non-authenticated visitors browsing the public website",
            "conditions": "[\"not\", {\"type\": \"cookies\", \"name\": \"esl_signed_in\", \"value\": \"1\"}]",
            "is_classic": False,
            "segmentation": False,
        },
    ]


def post_all(label, url, headers, items, name_key, dry_run):
    failures = 0
    for item in items:
        name = item[name_key]
        if dry_run:
            print(f"  [DRY-RUN] POST {url} {name}")
            continue

        try:
            resp = requests.post(url, headers=headers, json=item, timeout=30)
        except requests.RequestException as e:
            print(f"  [FAILED]  {label} '{name}': {e}")
            failures += 1
            continue

        if resp.status_code in (200, 201):
            print(f"  [CREATED] {label}: {name}")
        elif resp.status_code == 409 or "already exists" in resp.text.lower():
            print(f"  [EXISTS]  {label} '{name}' already exists.")
        else:
            print(f"  [FAILED]  {label} '{name}': {resp.status_code} - {resp.text}")
            failures += 1
    return failures


def put_segments(url_base, headers, segments, dry_run):
    failures = 0
    for seg in segments:
        seg_id = seg["segment_id"]
        url = f"{url_base}/{seg_id}"
        payload = {"description": seg["description"], "definition": seg["definition"]}
        if dry_run:
            print(f"  [DRY-RUN] PUT {url}")
            continue

        try:
            resp = requests.put(url, headers=headers, json=payload, timeout=30)
        except requests.RequestException as e:
            print(f"  [FAILED]  ODP Segment '{seg_id}': {e}")
            failures += 1
            continue

        if resp.status_code in (200, 201):
            print(f"  [SUCCESS] ODP Segment: {seg_id}")
        else:
            print(f"  [FAILED]  ODP Segment '{seg_id}': {resp.status_code} - {resp.text}")
            failures += 1
    return failures


def main():
    parser = argparse.ArgumentParser(description="Provision ESL segments in ODP and audiences in WebEx.")
    parser.add_argument("--dry-run", action="store_true", help="print requests without sending them")
    args = parser.parse_args()

    load_env()
    api_key = os.environ.get("ODP_PRIVATE_API_KEY")
    if not api_key and not args.dry_run:
        sys.exit(f"ODP_PRIVATE_API_KEY is not set in the environment or {ENV_FILE}.")

    region = os.environ.get("ODP_REGION", "us1")
    odp_url = f"https://api.{region}.odp.optimizely.com/v3/segments"
    odp_headers = {"x-api-key": api_key or "", "Content-Type": "application/json"}

    print("=== ESL Federal Credit Union - Automated Segment Setup ===")
    print("\n--- Provisioning Real-Time Segments in ODP ---")
    failures = put_segments(odp_url, odp_headers, ODP_SEGMENTS, args.dry_run)

    webex_token = os.environ.get("OPTIMIZELY_WEBEX_API_TOKEN")
    if not webex_token and not args.dry_run:
        print("\n[INFO] Skipping WebEx audience creation (OPTIMIZELY_WEBEX_API_TOKEN not set).")
    else:
        project_id = int(os.environ.get("OPTIMIZELY_WEBEX_PROJECT_ID", DEFAULT_WEBEX_PROJECT_ID))
        webex_headers = {"Authorization": f"Bearer {webex_token or ''}", "Content-Type": "application/json"}
        print("\n--- Provisioning Audiences in Web Experimentation ---")
        failures += post_all("WebEx Audience", WEBEX_API_BASE, webex_headers, webex_audiences(project_id), "name", args.dry_run)

    if failures:
        sys.exit(f"\nSegment setup finished with {failures} failure(s).")
    print("\nSegment setup finished. Verify segments under Customers > Real-Time Segments.")


if __name__ == "__main__":
    main()

# ESL ODP Identity Resolution & Zero-PII Live Demo Guide

> **Session Context**: Day 1 — Breakout 1: Customer Data Platform (ODP)  
> **Target Timing**: 05–20m (15-Minute Live Interactive Window)  
> **Primary Audience**: Data Architects, Analytics Leads, BI & Data Engineering, Compliance Officers  
> **Core Objective**: Visually prove that Optimizely captures rich pre-login financial intent (loan calculator & product browsing) on anonymous visitors and retroactively stitches it into a single unified member profile upon authentication, while exposing zero PII to client-side cookies or scripts.

---

## 1. Pre-Flight Setup (Before the Breakout Starts)

Have three browser windows/tabs pre-positioned side-by-side or on a split-screen display:

| Surface | URL / Location | Purpose |
|---|---|---|
| **Tab 1: Live ESL Demo Site** | `https://<your-deployment-url>/` in an **Incognito / Private Window** | Demonstrates the front-end experience. Keep Chrome DevTools open to **Application > Storage > Cookies**. |
| **Tab 2: ODP Event Inspector** | **ODP > Settings > History > Event Inspector** (or **Data Setup > Event Inspector**) | Provides live, real-time proof of event streaming and payload inspection as events hit the edge. Click **"Start Inspector"** 2 minutes before presenting. |
| **Tab 3: ODP Customer Profiles** | **ODP > Customers > Profiles** | Scrolled down below the Customer Growth chart directly to the **Customer Profiles table & Search bar**. |

---

## 2. The 3-Act Live Demo Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│ ACT 1: Zero-PII Security Audit (2 mins)                                │
│ DevTools inspection: Only opaque vuid + HttpOnly session + boolean (1)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ ACT 2: Anonymous Financial Intent (5 mins)                             │
│ Visitor browses Auto Loans, calculates $32,000 payment (vuid only)      │
│ ODP shows Anonymous Profile with timeline events                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ ACT 3: The Real-Time Identity "Stitch" (5 mins)                        │
│ Visitor authenticates as Maria Gonzalez (vuid + email linked)          │
│ ODP merges records: Pre-login $32k calculation retroactively stitched  │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Act 1: Prove "Zero-PII Client-Side Handling" (2 Minutes)

**Presenter Goal**: Show the Data Architects and Security leads that ESL members' sensitive financial identities are never exposed in browser-accessible DOM cookies.

1. **Inspect While Anonymous (Signed Out):**
   * Load the ESL Demo homepage in the Incognito window.
   * In DevTools, click **Application > Cookies > `https://<your-host>`**.
   * **Point out to the room:**
     * The only identifier stored in browser storage is an opaque visitor token (`vuid`, e.g. `vuid_esl_anon_...`).
     * There is zero member name, email address, credit score, or account identifier.

2. **Sign In as Maria Gonzalez:**
   * In the top navigation, click **Sign In** and authenticate as `maria.gonzalez`.
   * Look at the cookies table in DevTools immediately after sign-in. Show the two cookies created by `src/infrastructure/auth/session.ts`:
     * **`esl_session`:** Point to the **`HttpOnly`** column checkmark (`✓`).  
       *Talk track:* *"The user session key is strictly marked `HttpOnly` and `Secure`. It cannot be read or exfiltrated by any client-side JavaScript, third-party tags, or browser extensions."*
     * **`esl_signed_in`:** Value is simply **`1`** (`httpOnly: false`, `sameSite: lax`).  
       *Talk track:* *"For Optimizely Web Experimentation and CMS to personalize the digital experience at the edge without layout flicker, we don't expose member balances or PII to the browser. The client-side snippet only ever reads an opaque boolean flag (`esl_signed_in=1`). All identity and propensity resolution remains strictly server-side in ODP."*

---

### Act 2: Capture Anonymous Browsing & Loan Calculator Usage (5 Minutes)

**Presenter Goal**: Show ODP capturing high-intent financial behavior before the visitor ever signs in or identifies themselves.

1. **Fire the Anonymous Events:**
   * In your terminal, run the following cURL command to simulate an anonymous visitor (`vuid_esl_live_demo_99`) browsing auto loan rates and running a $32,000 calculator session:

```bash
curl -X POST "https://api.us1.odp.optimizely.com/v3/events" \
  -H "x-api-key: $ODP_PRIVATE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "type": "navigation",
      "action": "pageview",
      "identifiers": {
        "vuid": "vuid_esl_live_demo_99"
      },
      "data": {
        "ts": 1729688400,
        "page_path": "/loans/auto-loans",
        "page_title": "ESL - Auto Loans & Refinancing"
      }
    },
    {
      "type": "loan_calculator",
      "action": "calculate",
      "identifiers": {
        "vuid": "vuid_esl_live_demo_99"
      },
      "data": {
        "ts": 1729688520,
        "loan_type": "auto_loan",
        "borrow_amount": 32000,
        "loan_term_months": 60,
        "interest_rate": 5.49,
        "calculated_monthly_payment": 611.05
      }
    }
  ]'
```

2. **Verify in ODP (Live Demonstration):**
   * **In Tab 2 (Event Inspector):** Click **Refresh**. Expand the incoming event packet.
     * Highlight that ODP ingested both events in real time.
     * Point out that the `identifiers` block holds **only** `"vuid": "vuid_esl_live_demo_99"`.
   * **In Tab 3 (Customers > Profiles):**
     * In the search bar, type `vuid_esl_live_demo_99` and hit **Enter**.
     * Click the resulting profile record.
     * **Point out to the room:**
       * **Header:** Marked as **Anonymous Profile** (no name, email, or member number).
       * **Customer Details:** Zero PII populated.
       * **Event History Tab:** Show the visual timeline. The visitor already has `/loans/auto-loans` and a `$32,000` auto loan calculation recorded.

---

### Act 3: The Real-Time Identity Merge / "Stitch" Moment (5 Minutes)

**Presenter Goal**: Demonstrate identity stitching. When this visitor identifies themselves, ODP merges the anonymous device history directly into the verified member profile without data loss.

1. **Fire the Identity Resolution Login Event:**
   * Run the login/stitch event connecting the anonymous `vuid` to Maria Gonzalez's known email:

```bash
curl -X POST "https://api.us1.odp.optimizely.com/v3/events" \
  -H "x-api-key: $ODP_PRIVATE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "type": "customer",
      "action": "login",
      "identifiers": {
        "vuid": "vuid_esl_live_demo_99",
        "email": "demo.esl.maria.gonzalez.0@example.com"
      },
      "data": {
        "ts": 1729688700,
        "channel": "online_banking"
      }
    }
  ]'
```
*(Note: If testing against a different profile, replace the email with any active record from your `esl_profiles.json`).*

2. **Verify the Merged Profile in ODP (Tab 3):**
   * Go to **Customers > Profiles** and search for `demo.esl.maria.gonzalez.0@example.com`.
   * Open **Maria Gonzalez's** profile.
   * **Show the Merged Identifiers:**
     * Point out that `vuid_esl_live_demo_99` is now listed under Maria's identifiers alongside her email and member ID (`ESL-xxxxxx`).
   * **Show the Retroactive Event History:**
     * Click the **Event History** tab.
     * **The Climax Moment:** Point to the timeline. The `/loans/auto-loans` pageview and the `$32,000` loan calculation that occurred **before login while anonymous** are now permanently attributed to Maria Gonzalez's verified profile timeline.
   * **Show Real-Time Segment Qualification:**
     * Point out that Maria now qualifies for `esl_existing_members_auto_refi` because her verified credit tier (`720+`) merged with her anonymous auto loan intent.

---

## 3. Automation Helper Script (`simulate_live_stitch.py`)

To eliminate typing cURL commands during a live presentation, use this interactive Python runner. It executes each act with formatted console output and pauses for presenter commentary.

Save as `simulate_live_stitch.py` in your project root:

```python
#!/usr/bin/env python3
"""
ESL Federal Credit Union - Live Identity Resolution & Stitch Simulator
Runs Act 2 (Anonymous Intent) and Act 3 (Identity Stitch) interactively for live demos.
"""
import os
import sys
import time
import requests
from datetime import datetime, timezone

# Configuration
ODP_API_KEY = os.environ.get("ODP_PRIVATE_API_KEY")
ODP_REGION = os.environ.get("ODP_REGION", "us1")
TARGET_EMAIL = os.environ.get("DEMO_STITCH_EMAIL", "demo.esl.maria.gonzalez.0@example.com")

if not ODP_API_KEY:
    sys.exit("Error: ODP_PRIVATE_API_KEY is not set in environment.")

EVENT_URL = f"https://api.{ODP_REGION}.odp.optimizely.com/v3/events"
HEADERS = {
    "x-api-key": ODP_API_KEY,
    "Content-Type": "application/json"
}

# Unique session VUID for the live run
DEMO_VUID = f"vuid_esl_live_{int(time.time())}"

def print_banner(text):
    print("\n" + "=" * 70)
    print(f" {text}")
    print("=" * 70)

def main():
    print_banner("ESL Live Identity Resolution & Zero-PII Demo")
    print(f"Target ODP Instance : api.{ODP_REGION}.odp.optimizely.com")
    print(f"Generated Demo VUID : {DEMO_VUID}")
    print(f"Target Member Email : {TARGET_EMAIL}")

    # -------------------------------------------------------------------------
    # ACT 2: ANONYMOUS BROWSING & CALCULATOR
    # -------------------------------------------------------------------------
    input("\n[PRESS ENTER] to execute ACT 2: Fire Anonymous Browsing & Loan Calculator...")
    
    now_ts = int(time.time())
    anon_events = [
        {
            "type": "navigation",
            "action": "pageview",
            "identifiers": {"vuid": DEMO_VUID},
            "data": {
                "ts": now_ts - 120,
                "page_path": "/loans/auto-loans",
                "page_title": "ESL - Auto Loans & Rates"
            }
        },
        {
            "type": "loan_calculator",
            "action": "calculate",
            "identifiers": {"vuid": DEMO_VUID},
            "data": {
                "ts": now_ts - 60,
                "loan_type": "auto_loan",
                "borrow_amount": 32000,
                "loan_term_months": 60,
                "interest_rate": 5.49,
                "calculated_monthly_payment": 611.05
            }
        }
    ]

    resp = requests.post(EVENT_URL, headers=HEADERS, json=anon_events, timeout=15)
    if resp.status_code in (200, 201, 202):
        print(f"  [SUCCESS] Anonymous events accepted (Status: {resp.status_code})")
        print(f"  -> Show ODP Tab: Search '{DEMO_VUID}' to show Anonymous profile with $32,000 calculation.")
    else:
        print(f"  [ERROR] {resp.status_code} - {resp.text}")
        return

    # -------------------------------------------------------------------------
    # ACT 3: IDENTITY STITCH (LOGIN EVENT)
    # -------------------------------------------------------------------------
    input("\n[PRESS ENTER] to execute ACT 3: Fire Login Event (Stitch VUID -> Member Email)...")

    login_event = [
        {
            "type": "customer",
            "action": "login",
            "identifiers": {
                "vuid": DEMO_VUID,
                "email": TARGET_EMAIL
            },
            "data": {
                "ts": now_ts,
                "channel": "online_banking"
            }
        }
    ]

    resp = requests.post(EVENT_URL, headers=HEADERS, json=login_event, timeout=15)
    if resp.status_code in (200, 201, 202):
        print(f"  [SUCCESS] Identity resolution login event accepted (Status: {resp.status_code})")
        print(f"  -> Show ODP Tab: Open '{TARGET_EMAIL}'.")
        print(f"  -> Highlight: '{DEMO_VUID}' is merged, and pre-login calculation is stitched to timeline!")
    else:
        print(f"  [ERROR] {resp.status_code} - {resp.text}")

    print_banner("Demo Run Complete")

if __name__ == "__main__":
    main()
```

---

## 4. Key Takeaways for Data Architects & Compliance Leads

When wrapping up this segment at the **20-minute mark**, summarize with these three architecture-grounded points:

1. **Elimination of the "Pre-Login Black Hole":**
   * *Problem:* In legacy bank portals, anonymous prospective research on public marketing pages never makes it into the core banking system or CRM once a member signs into online banking on a separate domain.
   * *Optimizely Advantage:* ODP's streaming identity graph stitches the session across domains and authentication boundaries without custom ETL scripts.
2. **High-Confidence vs. Low-Confidence Merge Rules:**
   * ODP enforces strict deterministic resolution: `email` and `member_id` are **High-Confidence Identifiers (HCI)**, while `vuid` (device cookie) is a **Low-Confidence Identifier (LCI)**.
   * If two family members share an iPad, ODP will not erroneously merge their distinct bank accounts; it isolates the profiles while cleanly attributing device touchpoints according to enterprise data governance policies.
3. **Zero Client-Side PII Leakage:**
   * Financial compliance standards (GLBA, NYDFS Part 500, CCPA) strictly penalize exposing member identities, credit tiers, or financial balances in client-side cookies or dataLayer scripts.
   * With Optimizely's decoupled architecture, all enrichment and audience qualification happen at the edge and server layers. The browser receives only an encrypted session token and an anonymous targeting boolean (`esl_signed_in=1`).

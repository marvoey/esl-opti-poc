# ESL Federal Credit Union: ODP Setup & Demo Data Generation Guide

This guide provides an end-to-end operational blueprint for configuring Optimizely Data Platform (ODP) and populating realistic synthetic behavioral data for the **ESL Federal Credit Union** demo.

---

## 1. Overview & Architecture Blueprint

For the ESL Federal Credit Union scenario, ODP serves as the real-time identity, profile, and segmentation engine connecting anonymous website visitors to known credit union members.

```
       [ Anonymous Visitors & ESL Members ]
                         │
                         ▼
           [ ESL SaaS CMS / Next.js Web App ]
                         │
      ┌──────────────────┴──────────────────┐
      ▼                                     ▼
[ Web Experimentation ]             [ ODP Web SDK Tag ]
 (Personalization / Tests)           (Real-time behavioral tracking)
      ▲                                     │
      │ ◄── Real-Time Segment Sync ─────────┤
      │                                     ▼
      │                             [ ODP Profile Core ]
      │                               - Identity Graph
      │                               - Custom Schema (Lending/Products)
      │                               - Real-time Audiences
      │                                     ▲
      └─────────────────────────────────────┤
                                            │
                           [ Batch Ingestion / REST API ]
                             (Core Banking / Loan Origination mock data)
```

### Key Business Goals
1. **Differentiate Audiences:** Identify **Prospective Members** (anonymous/high-intent) vs. **Existing Members** (authenticated/multi-product).
2. **Drive Lending & Deposits:** Capture micro-behaviors (loan calculator queries, rate chart reviews, branch searches) and trigger in-session personalization via Web Experimentation.
3. **Respect Financial Compliance:** Ensure zero PII leakage to the client-side DOM while maintaining unified records in ODP.

---

## 2. ODP Workspace Configuration

### Step 2.1: Locate API Credentials
1. Log in to your ODP instance (`https://dashboard.zaius.com` or via Opti ID).
2. Navigate to **Gear Icon (Settings)** > **Integrations** > **API Information** (or **Data Setup > API Keys**).
3. Note your credentials:
   - **Public Tracker ID** (used by the Web SDK on the frontend).
   - **Private API Key** (used for REST API schema creation, event ingestion, and profile management).

### Step 2.2: Implement the ODP Web SDK (Client-Side)
Embed the ODP JavaScript tag across your ESL SaaS CMS / Next.js frontend header.

```html
<!-- ODP Web SDK Tag -->
<script type="text/javascript">
  var zaius = window.zaius || [];
  (function () {
    var z = document.createElement('script');
    z.type = 'text/javascript';
    z.async = true;
    z.src = 'https://d1igp3oop3pvki.cloudfront.net/v2/' + 'YOUR_PUBLIC_TRACKER_ID' + '/zaius-min.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(z, s);
  })();
</script>
```

In Next.js, add this to `app/layout.tsx` or `pages/_app.tsx` via `next/script` with `strategy="afterInteractive"`.

---

## 3. Schema & Custom Field Setup (UI & REST API)

You can set up custom fields in ODP either manually via the user interface or programmatically using the **ODP Schema REST API (v3)**. Using the API is recommended for demo preparation because it provisions the entire financial model in seconds.

> **Important Rule:** Custom fields in ODP only capture data *after* they are registered in the schema. Always provision fields prior to uploading profiles or events.

---

### Method A: Automated Schema Setup via ODP REST API (Recommended)

#### API Specification
* **Endpoint:** `POST https://api.us1.odp.optimizely.com/v3/schema/objects/{object_name}/fields`  
  *(Use `api.eu1.odp.optimizely.com` or `api.ap1.odp.optimizely.com` if your tenant is outside the US).*
* **Authentication Header:** `x-api-key: YOUR_PRIVATE_API_KEY`
* **Path Parameter:** `{object_name}` (e.g., `customers` or `events`).
* **Supported Types:** `string`, `number`, `boolean`, or `timestamp`.

#### Single Field Creation via cURL
```bash
curl -X POST "https://api.us1.odp.optimizely.com/v3/schema/objects/customers/fields" \
  -H "x-api-key: YOUR_PRIVATE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "esl_member_status",
    "display_name": "ESL Member Status",
    "type": "string",
    "public_read": true,
    "description": "Member vs Prospective Member"
  }'
```

#### Automated Schema Provisioning Script (`setup_esl_schema.py`)
Run this script once to create all customer and event fields required for ESL:

```python
#!/usr/bin/env python3
"""
ESL Federal Credit Union - ODP Schema Setup Script
Provisions all custom attributes on 'customers' and 'events' objects via ODP v3 REST API.
"""
import requests
import json

ODP_PRIVATE_KEY = "YOUR_ODP_PRIVATE_API_KEY"  # Replace with your Private API Key
BASE_URL = "https://api.us1.odp.optimizely.com/v3/schema/objects"

HEADERS = {
    "x-api-key": ODP_PRIVATE_KEY,
    "Content-Type": "application/json"
}

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
    {"name": "credit_score_band", "display_name": "Credit Score Band", "type": "string", "description": "720+, 660-719, Under 660"}
]

# 2. Custom fields for 'events' object
EVENT_FIELDS = [
    {"name": "loan_type", "display_name": "Loan Type", "type": "string", "description": "auto_loan, mortgage, heloc, personal"},
    {"name": "borrow_amount", "display_name": "Borrow Amount", "type": "number", "description": "Principal amount input"},
    {"name": "loan_term_months", "display_name": "Loan Term (Months)", "type": "number", "description": "36, 48, 60, 72, 360"},
    {"name": "interest_rate", "display_name": "Interest Rate Calculated", "type": "number", "description": "Rate used in calculation"},
    {"name": "calculated_monthly_payment", "display_name": "Calculated Payment", "type": "number", "description": "Monthly payment result"},
    {"name": "product_name", "display_name": "Application Product Name", "type": "string", "description": "Name of applied product"},
    {"name": "step_name", "display_name": "Application Step", "type": "string", "description": "Funnel step name"}
]

def provision_fields(object_name, field_definitions):
    print(f"\nProvisioning schema for '{object_name}'...")
    url = f"{BASE_URL}/{object_name}/fields"
    
    for f in field_definitions:
        f["public_read"] = True  # Allows access by Web SDK and WebEx targeting
        resp = requests.post(url, headers=HEADERS, json=f)
        
        if resp.status_code in [200, 201]:
            print(f"  [CREATED] {f['name']} ({f['type']})")
        elif resp.status_code == 409 or "already exists" in resp.text.lower():
            print(f"  [EXISTS]  {f['name']} already exists.")
        else:
            print(f"  [FAILED]  {f['name']}: {resp.status_code} - {resp.text}")

if __name__ == "__main__":
    print("=== Provisioning ESL Credit Union Schema in ODP ===")
    provision_fields("customers", CUSTOMER_FIELDS)
    provision_fields("events", EVENT_FIELDS)
    print("\nSchema configuration completed.")
```

---

### Method B: Manual Configuration via ODP UI

If you prefer configuring fields manually or reviewing them in the browser:

1. In ODP, navigate to **Data Setup** > **Objects & Fields** (or **Settings > Data Model > Objects & Fields**).
2. Select the **`customers`** object and click **Create New Field**.
3. Configure each field:
   - **Field Display Name:** User-friendly label (e.g., `ESL Member Status`).
   - **Field Name:** Programmatic key (e.g., `esl_member_status`).
   - **Field Type:** Select `string`, `number`, `boolean`, or `timestamp`.
   - **Public Read:** Check this box so the Web SDK and Web Experimentation can read the property client-side.
4. Repeat for the **`events`** object to register event-specific fields (`loan_type`, `borrow_amount`, `loan_term_months`).

---

## 4. ESL Segment Definitions in ODP (UI & Automated API Setup)

Segments (audiences) can be configured either programmatically using the **ODP Real-Time Segments REST API** or manually via the ODP Segment Builder interface.

---

### Method A: Automated Segment Creation via ODP Real-Time Segments API

#### API Specification
* **Endpoint:** `POST https://api.us1.odp.optimizely.com/v3/segments`  
  *(Use `api.eu1.odp.optimizely.com` or `api.ap1.odp.optimizely.com` for non-US regions).*
* **Authentication Header:** `x-api-key: YOUR_PRIVATE_API_KEY`
* **Content-Type:** `application/json`
* **Segment ID Requirements:** Must match the case-insensitive regex `[a-z0-9_]*`.
* **UI Behavior:** API-created segments immediately populate under **Customers > Real-Time Segments** with an "API-created" indicator.

#### Automated Setup Script (`setup_esl_segments.py`)
Run this script to provision all four core credit union audience segments automatically:

```python
#!/usr/bin/env python3
"""
ESL Federal Credit Union - Automated ODP Segment Setup Script
Provisions real-time audience segments in ODP via POST /v3/segments.
Also provisions corresponding Web Experimentation audiences via WebEx REST API.
"""
import requests
import json

# ==============================================================================
# CONFIGURATION
# ==============================================================================
ODP_API_BASE = "https://api.us1.odp.optimizely.com/v3/segments"
ODP_PRIVATE_KEY = "YOUR_ODP_PRIVATE_API_KEY"

WEBEX_API_BASE = "https://api.optimizely.com/v2/audiences"
WEBEX_BEARER_TOKEN = "YOUR_OPTIMIZELY_PERSONAL_ACCESS_TOKEN"  # Optional: for WebEx
WEBEX_PROJECT_ID = 4775830914596864  # From esl-opti-poc layout.tsx

ODP_HEADERS = {
    "x-api-key": ODP_PRIVATE_KEY,
    "Content-Type": "application/json"
}

WEBEX_HEADERS = {
    "Authorization": f"Bearer {WEBEX_BEARER_TOKEN}",
    "Content-Type": "application/json"
}

# ==============================================================================
# 1. ODP REAL-TIME SEGMENT DEFINITIONS
# ==============================================================================
ODP_SEGMENTS = [
    {
        "segment_id": "esl_prospective_lending_intent",
        "description": "Prospective members exhibiting high auto loan calculation or browsing intent",
        "definition": {
            "type": "customer",
            "expression": {
                "and": [
                    {
                        "field": "esl_member_status",
                        "operator": "==",
                        "value": "prospective"
                    },
                    {
                        "field": "lending_interest",
                        "operator": "==",
                        "value": "auto_loan"
                    }
                ]
            }
        }
    },
    {
        "segment_id": "esl_existing_members_auto_refi",
        "description": "Existing members with credit score 720+ eligible for auto refinance",
        "definition": {
            "type": "customer",
            "expression": {
                "and": [
                    {
                        "field": "esl_member_status",
                        "operator": "==",
                        "value": "existing"
                    },
                    {
                        "field": "credit_score_band",
                        "operator": "==",
                        "value": "720+"
                    }
                ]
            }
        }
    },
    {
        "segment_id": "esl_high_balance_deposit_savers",
        "description": "Premier and Business members for high-yield savings / CD promotions",
        "definition": {
            "type": "customer",
            "expression": {
                "and": [
                    {
                        "field": "esl_member_status",
                        "operator": "==",
                        "value": "existing"
                    },
                    {
                        "or": [
                            {"field": "relationship_tier", "operator": "==", "value": "Premier"},
                            {"field": "relationship_tier", "operator": "==", "value": "Business"}
                        ]
                    }
                ]
            }
        }
    },
    {
        "segment_id": "esl_mortgage_homebuyer_intent",
        "description": "Visitors calculating mortgage payments or browsing home loans",
        "definition": {
            "type": "customer",
            "expression": {
                "field": "lending_interest",
                "operator": "==",
                "value": "mortgage"
            }
        }
    }
]

# ==============================================================================
# 2. WEB EXPERIMENTATION AUDIENCE DEFINITIONS (COOKIE-BASED SYNC)
# ==============================================================================
WEBEX_AUDIENCES = [
    {
        "project_id": WEBEX_PROJECT_ID,
        "name": "ESL Existing Members (esl_signed_in)",
        "description": "Authenticated members identified by esl_signed_in cookie",
        "conditions": "[\"and\", {\"type\": \"cookie\", \"name\": \"esl_signed_in\", \"value\": \"1\"}]",
        "is_classic": False,
        "segmentation": False
    },
    {
        "project_id": WEBEX_PROJECT_ID,
        "name": "ESL Prospective Members (Anonymous)",
        "description": "Non-authenticated visitors browsing the public website",
        "conditions": "[\"not\", {\"type\": \"cookie\", \"name\": \"esl_signed_in\", \"value\": \"1\"}]",
        "is_classic": False,
        "segmentation": False
    }
]

def create_odp_segments():
    print("\n--- Provisioning Real-Time Segments in ODP ---")
    for seg in ODP_SEGMENTS:
        resp = requests.post(ODP_API_BASE, headers=ODP_HEADERS, json=seg)
        if resp.status_code in [200, 201]:
            print(f"  [CREATED] ODP Segment: {seg['segment_id']}")
        elif resp.status_code == 409 or "already exists" in resp.text.lower():
            print(f"  [EXISTS]  ODP Segment '{seg['segment_id']}' already exists.")
        else:
            print(f"  [FAILED]  ODP Segment '{seg['segment_id']}': {resp.status_code} - {resp.text}")

def create_webex_audiences():
    if WEBEX_BEARER_TOKEN == "YOUR_OPTIMIZELY_PERSONAL_ACCESS_TOKEN":
        print("\n[INFO] Skipping WebEx REST API audience creation (Bearer Token not configured).")
        return
    print("\n--- Provisioning Audiences in Web Experimentation ---")
    for aud in WEBEX_AUDIENCES:
        resp = requests.post(WEBEX_API_BASE, headers=WEBEX_HEADERS, json=aud)
        if resp.status_code in [200, 201]:
            print(f"  [CREATED] WebEx Audience: {aud['name']}")
        elif resp.status_code == 409 or "already exists" in resp.text.lower():
            print(f"  [EXISTS]  WebEx Audience '{aud['name']}' already exists.")
        else:
            print(f"  [FAILED]  WebEx Audience '{aud['name']}': {resp.status_code} - {resp.text}")

if __name__ == "__main__":
    print("=== ESL Federal Credit Union - Automated Segment Setup ===")
    create_odp_segments()
    create_webex_audiences()
    print("\nSegment setup finished. Verify segments under Customers > Real-Time Segments.")
```

---

### Method B: Manual Segment Rules in ODP UI

If configuring or inspecting segments within the ODP visual interface (**Customers** > **Segments** or **Real-Time Segments** > **Create Segment**):

#### Segment 1: "Prospective Members - High Lending Intent"
* **Strategic Purpose:** Feeds the acquisition variant of the SaaS CMS homepage and auto loan page.
* **UI Rule Configuration:**
  * `Customer Attribute: esl_member_status` equals `prospective` (or is empty)
  * **AND**
  * `Events: loan_calculator (calculate)` occurred at least `1` time in the last `30 days` WHERE `loan_type` equals `auto_loan`
  * **OR**
  * `Events: navigation (pageview)` occurred where `page_path` contains `/auto-loans` or `/membership`

#### Segment 2: "Existing Members - Eligible for Auto Refinance"
* **Strategic Purpose:** Feeds the deep-relationship / cross-sell variant with personalized rate cards.
* **UI Rule Configuration:**
  * `Customer Attribute: esl_member_status` equals `existing`
  * **AND**
  * `Customer Attribute: active_products` does **not** contain `auto_loan`
  * **AND**
  * `Customer Attribute: credit_score_band` equals `720+`

#### Segment 3: "High-Balance Deposit Savers"
* **Strategic Purpose:** Feeds Multi-Armed Bandit promotional CD & Certificate banners.
* **UI Rule Configuration:**
  * `Customer Attribute: esl_member_status` equals `existing`
  * **AND**
  * `Customer Attribute: relationship_tier` in `["Premier", "Business"]`
  * **AND**
  * `Events: navigation (pageview)` occurred on `/savings` or `/certificates` in last `14 days`

#### Segment 4: "Mortgage Seeker / Homebuyer"
* **Strategic Purpose:** Trigger personalized home equity / mortgage consultative appointments.
* **UI Rule Configuration:**
  * `Events: loan_calculator (calculate)` WHERE `loan_type` equals `mortgage` in last `7 days`
  * **AND**
  * `Events: application (complete)` did not occur in last `30 days`

---

## 5. Synthetic Data Generation Script

Run the following Python script to generate and ingest realistic demo data directly into your ODP instance via the ODP REST API (`https://api.zaius.com/v2/`).

### Prerequisites
```bash
pip install requests faker
```

### `generate_esl_odp_data.py`

```python
#!/usr/bin/env python3
"""
ESL Federal Credit Union - ODP Synthetic Data Generator
Generates realistic members, prospective members, loan calculations,
and application events tailored to the Rochester, NY area.
"""

import json
import random
import time
from datetime import datetime, timedelta, timezone
from faker import Faker
import requests

fake = Faker('en_US')

# ==============================================================================
# CONFIGURATION - UPDATE THESE KEYS
# ==============================================================================
ODP_API_BASE = "https://api.zaius.com/v2"
ODP_PRIVATE_KEY = "YOUR_ODP_PRIVATE_API_KEY"  # Replace with your Private API Key
ODP_TRACKER_ID = "YOUR_ODP_TRACKER_ID"        # Replace with your Tracker ID

HEADERS = {
    "Content-Type": "application/json",
    "x-api-key": ODP_PRIVATE_KEY
}

ROCHESTER_BRANCHES = [
    "Chestnut Street (Headquarters)",
    "Greece Branch",
    "Webster Ridge Branch",
    "Penfield Branch",
    "Henrietta Branch",
    "Fairport Branch",
    "Irondequoit Branch",
    "Victor Branch"
]

CREDIT_BANDS = ["720+", "660-719", "Under 660"]
PRODUCT_OPTIONS = ["checking", "savings", "credit_card", "heloc", "auto_loan"]

def generate_customer_profiles(num_records=50):
    """Generates a mix of Existing Members and Prospective Members."""
    profiles = []
    
    for i in range(num_records):
        is_member = random.random() < 0.6  # 60% members, 40% prospects
        email = f"demo.esl.{fake.user_name()}@example.com"
        vuid = f"vuid_esl_{fake.uuid4()[:12]}"
        
        if is_member:
            member_id = f"ESL-{random.randint(100000, 999999)}"
            status = "existing"
            active_prods = random.sample(PRODUCT_OPTIONS, k=random.randint(1, 3))
            tier = random.choices(["Standard", "Premier", "Business"], weights=[0.6, 0.3, 0.1])[0]
            member_since = random.randint(2015, 2024)
            auto_rate = round(random.uniform(4.24, 5.49), 2)
        else:
            member_id = None
            status = "prospective"
            active_prods = []
            tier = "Non-Member"
            member_since = None
            auto_rate = round(random.uniform(5.24, 6.74), 2)
            
        credit_band = random.choices(CREDIT_BANDS, weights=[0.55, 0.35, 0.10])[0]
        lending_intent = random.choice(["auto_loan", "mortgage", "heloc", "personal_loan", "none"])
        
        profile = {
            "attributes": {
                "email": email,
                "vuid": vuid,
                "first_name": fake.first_name(),
                "last_name": fake.last_name(),
                "phone": fake.phone_number(),
                "city": random.choice(["Rochester", "Webster", "Fairport", "Pittsford", "Penfield", "Greece"]),
                "state": "NY",
                "zip": random.choice(["14604", "14580", "14450", "14534", "14626"]),
                "esl_member_status": status,
                "member_id": member_id,
                "member_since_year": member_since,
                "primary_branch": random.choice(ROCHESTER_BRANCHES),
                "relationship_tier": tier,
                "active_products": ",".join(active_prods),
                "lending_interest": lending_intent,
                "preapproved_auto_rate": auto_rate,
                "credit_score_band": credit_band
            }
        }
        profiles.append(profile)
        
    return profiles

def generate_events_for_profiles(profiles):
    """Generates browsing, loan calculations, and application events."""
    events = []
    now = datetime.now(timezone.utc)
    
    for p in profiles:
        attr = p["attributes"]
        email = attr["email"]
        vuid = attr["vuid"]
        is_member = attr["esl_member_status"] == "existing"
        lending_intent = attr["lending_interest"]
        
        # 1. Pageview events over the past 14 days
        num_views = random.randint(3, 8)
        for _ in range(num_views):
            event_time = now - timedelta(days=random.randint(0, 14), minutes=random.randint(5, 720))
            path = "/personal/banking" if is_member else "/membership/join"
            if lending_intent == "auto_loan":
                path = "/loans/auto-loans"
            elif lending_intent == "mortgage":
                path = "/loans/mortgages"
                
            events.append({
                "type": "navigation",
                "action": "pageview",
                "identifiers": {"email": email, "vuid": vuid},
                "data": {
                    "page_path": path,
                    "page_title": f"ESL - {path.replace('/', ' ').title()}",
                    "branch_affinity": attr["primary_branch"]
                },
                "ts": event_time.isoformat()
            })
            
        # 2. Loan Calculator Event (if prospect or seeking auto loan)
        if lending_intent in ["auto_loan", "mortgage"]:
            calc_time = now - timedelta(days=random.randint(0, 7), hours=random.randint(1, 12))
            borrow_amt = 28000 if lending_intent == "auto_loan" else 285000
            term = 60 if lending_intent == "auto_loan" else 360
            rate = attr["preapproved_auto_rate"] if is_member else 5.74
            
            events.append({
                "type": "loan_calculator",
                "action": "calculate",
                "identifiers": {"email": email, "vuid": vuid},
                "data": {
                    "loan_type": lending_intent,
                    "borrow_amount": borrow_amt,
                    "loan_term_months": term,
                    "interest_rate": rate,
                    "calculated_monthly_payment": round((borrow_amt * (rate/100/12)) / (1 - (1 + rate/100/12)**(-term)), 2)
                },
                "ts": calc_time.isoformat()
            })
            
        # 3. Application Start Event (for select high-intent visitors)
        if random.random() < 0.35:
            app_time = now - timedelta(days=random.randint(0, 3), hours=random.randint(1, 4))
            events.append({
                "type": "application",
                "action": "start",
                "identifiers": {"email": email, "vuid": vuid},
                "data": {
                    "product_name": f"ESL {lending_intent.replace('_', ' ').title()}",
                    "product_category": "Lending",
                    "step_name": "Applicant Information",
                    "application_id": f"APP-{random.randint(10000, 99999)}"
                },
                "ts": app_time.isoformat()
            })
            
    return events

def send_batch_to_odp(endpoint, payload_items, chunk_size=25):
    """Sends objects to ODP in controlled chunks."""
    url = f"{ODP_API_BASE}/{endpoint}"
    for i in range(0, len(payload_items), chunk_size):
        chunk = payload_items[i:i + chunk_size]
        print(f"Uploading {len(chunk)} records to {endpoint}...")
        try:
            resp = requests.post(url, headers=HEADERS, json=chunk)
            if resp.status_code in [200, 201, 202]:
                print(f"  [SUCCESS] Batch {i//chunk_size + 1} processed.")
            else:
                print(f"  [ERROR {resp.status_code}] {resp.text}")
        except Exception as e:
            print(f"  [EXCEPTION] {e}")
        time.sleep(0.5)

if __name__ == "__main__":
    print("=== ESL Federal Credit Union: ODP Demo Data Generator ===")
    print("Generating synthetic profiles...")
    customers = generate_customer_profiles(num_records=40)
    print(f"Created {len(customers)} customer profiles.")
    
    print("Generating behavioral events...")
    events = generate_events_for_profiles(customers)
    print(f"Created {len(events)} custom events.")
    
    # Optional upload step (uncomment when ready to push directly):
    # send_batch_to_odp("profiles", customers)
    # send_batch_to_odp("events", events)
    
    # Save to local JSON files for manual review or batch upload
    with open("esl_profiles.json", "w") as f:
        json.dump(customers, f, indent=2)
    with open("esl_events.json", "w") as f:
        json.dump(events, f, indent=2)
        
    print("\nSaved payloads to 'esl_profiles.json' and 'esl_events.json'.")
    print("Ready for ingestion into ODP.")
```

---

## 6. Live In-Session Triggering & WebEx Sync

### Step 6.1: Sync ODP Audiences to Web Experimentation
1. In ODP, navigate to **Integrations** > **Optimizely Web**.
2. Enable **Audience Syncing**.
3. Under **Customers** > **Segments**, open:
   - *Prospective Members - High Lending Intent*
   - *Existing Members - Eligible for Auto Refinance*
4. Toggle **Sync to Optimizely Web** to `Active`.
5. Open **Optimizely Web Experimentation** > **Audiences**. Confirm the synced ODP segments appear with the prefix `ODP: [Segment Name]`.

### Step 6.2: Frontend Client-Side Trigger Script (Console Simulation)
During the dry-run, if you want to switch your live browser between a Prospective Member and an Existing Member without clearing cookies or reloading, paste these commands into your browser’s developer console:

#### Simulate a Prospective Member Calculating an Auto Loan:
```javascript
// Identify as prospective visitor and trigger loan calculation
zaius.customer({
  email: "marvin.prospect@rochester-demo.com",
  esl_member_status: "prospective",
  primary_branch: "Webster Ridge Branch",
  lending_interest: "auto_loan",
  credit_score_band: "720+"
});

zaius.event("loan_calculator", {
  action: "calculate",
  loan_type: "auto_loan",
  borrow_amount: 32000,
  loan_term_months: 60,
  interest_rate: 5.49
});
console.log("ODP: Switched to Prospective Member persona with Auto Loan intent.");
```

#### Simulate an Authenticated Existing Member:
```javascript
// Identify as verified existing credit union member
zaius.customer({
  email: "marvin.member@rochester-demo.com",
  member_id: "ESL-982341",
  esl_member_status: "existing",
  member_since_year: 2019,
  primary_branch: "Chestnut Street (Headquarters)",
  relationship_tier: "Premier",
  active_products: "checking,savings,credit_card",
  preapproved_auto_rate: 4.49,
  credit_score_band: "720+"
});

zaius.event("navigation", {
  action: "pageview",
  page_path: "/personal/banking",
  page_title: "ESL - Member Dashboard"
});
console.log("ODP: Switched to Existing Premier Member persona.");
```

---

## 7. Friday Dry-Run Inspection Checklist

Before the 2:00 PM CDP breakout on Friday, execute this checklist:

- [ ] **Schema Verification:** Run `setup_esl_schema.py` or inspect **Objects & Fields** in ODP to ensure `esl_member_status`, `member_id`, and event fields are active with `public_read: true`.
- [ ] **Customer Profile Inspection:** In ODP, search for `demo.esl.*` and verify that the `esl_member_status`, `member_id`, and `primary_branch` fields display correctly in the customer profile card.
- [ ] **Event Timeline:** Verify that the Customer Profile timeline shows clear badge events for `loan_calculator: calculate` and `application: start` with timestamp history.
- [ ] **Segment Membership Counter:** Verify that the *Prospective Members* and *Existing Members* segments show non-zero member counts.
- [ ] **Real-Time Sync to WebEx:** Confirm the audience tag in Web Experimentation reflects current counts.
- [ ] **Zero-PII Compliance Check:** Ensure that only hashed/anonymized IDs or permitted attributes are evaluated in client-side experiment evaluation logic.

# ESL Breakout Sessions: Discrepancy & Alignment Analysis

Using the **ESL Dry-Run Breakout Sessions Guide** as the definitive baseline for the 6 technical breakout sessions, this document details all discrepancies identified across the **Why Optimizely Strategic Narrative** and the **ESL Team Alignment & Story Playbook**, highlighting divergences in structure, timing, scenarios, and demonstration scope.

---

## 1. Structural & Delivery Rule Discrepancies (Cross-Session)

| Area | Definitive Source: Dry-Run Guide | Discrepancy in Narrative Playbooks | Action Needed to Align |
|---|---|---|---|
| **Modular Independence vs. Handoffs** | **Strict Modular Independence:** Every breakout is a self-contained module using a standardized 90-second *"Reset Script"* because stakeholder groups rotate in and out. Assumes **no one** saw the previous session. | **Sequential Handoffs:** The *Team Alignment Playbook* includes explicit "Team Hand-off" scripts assuming the same audience stays in the room (e.g., bridging CDP to Personalization), and injects the 90-second POC thank-you speech into the 00–05m slot of Breakout 1. | Keep the POC thank-you brief, use the 90-second **Reset Script** at the start of every breakout, and ensure transition remarks at the end of a session do not assume the exact same people are staying for the next hour. |
| **POC Use Case Scope Creep in Breakouts** | **Focused Workbench:** Breakouts focus strictly on the core discipline and reserve end-to-end multi-use-case synthesis for the Day 2 Executive PoC Demo. | **Overloaded Breakouts:** The *Strategic Narrative* packs all 14 Alacrity POC Use Cases (#1–#14) directly into the 6 breakout run-of-show tables (adding extra tasks into 5–10 minute blocks). | Strip the extra POC use cases out of the breakout tables in the *Strategic Narrative* (or treat them strictly as quick verbal callouts) so the 30- and 60-minute breakouts do not run over time. |

---

## 2. Session-by-Session Discrepancies

### Breakout 1: Customer Data Platform (ODP) — *Day 1, 2:00 PM – 3:00 PM*

| Element | Definitive Source: Dry-Run Guide | Discrepancy in Narrative Playbooks |
|---|---|---|
| **00–05m Opening** | Pure **Audience Framing**: Contrast batch-based data (24-hr sync delays) with real-time event streaming. | Both narrative docs insert the **90-second Day 1 Kickoff thank-you script** (thanking ESL, Alacrity, and Oshyn for the 2-week POC) into this 5-minute window. |
| **05–20m Identity Trigger** | Visitor profile captures **loan calculator usage** and product browsing, merging upon login or **email capture**. | Narrative docs specify capturing loan browsing via `a4775830914596864.cdn.optimizely.com` and authenticating specifically via `/sign-in` on `esl-onsite.optimoey.com`. |
| **20–40m Segments** | Builds **Prospective Members** (high intent, non-members) and **Existing Members** (authenticated, active banking) + propensity/product affinity. | *Strategic Narrative* adds building **life-stage intent segments** (*Buying a home, Debt consolidation, Auto loans*), audience size estimation, and fallback behavior (Use Case #6). |
| **40–50m Activation** | Downstream flow into **Web Experimentation, CMS, and outbound channels** + Snowflake/Databricks sync. | *Strategic Narrative* omits **outbound channels**; *Team Alignment Playbook* omits Snowflake/Databricks warehouse sync entirely. |

---

### Breakout 2: Personalization — *Day 1, 3:00 PM – 4:00 PM*

| Element | Definitive Source: Dry-Run Guide | Discrepancy in Narrative Playbooks |
|---|---|---|
| **Core Product Scenario** | **Auto Loans / Vehicle Refinance:**<br>• **Context Setter:** First auto loan ("Join & Apply" CTA) vs. Existing Member (pre-qualified rate cards & 1-click application).<br>• **05–20m Demo:** Prospective Member view (clean rate tables, eligibility) vs. Existing Member view (personalized greeting, **pre-approved vehicle refinance rates**). | **Personal Loans (`/personal/loans`) & Homepage Life-Stage Toggles:**<br>• Both narrative docs anchor the demo on `/personal/loans` with 3 variations (*Control*, *Existing Member: "You're Already a Member..."*, *Prospect: "Get the Funds You Need..."*).<br>• Both narrative docs add a demo of the **8 Life-Stage Toggles** on the homepage (*"Buying a home," "Fresh start," "Planning for retirement"*), which is **not** in the Dry-Run Guide. |
| **00–05m Framing** | Cost of one-size-fits-all portals (acquisition drop-off & poor cross-sell). | Narrative docs add the "maintenance trap of full-page duplication / cloning URLs" here (whereas Dry-Run covers 'personalization sprawl' in 50–60m). |
| **50–60m Wrap** | Operational Strategy & Q&A: Avoiding **"personalization sprawl"** by targeting high-impact components rather than rewriting entire sites. | *Strategic Narrative* changes this to **Audience-level engagement reporting** and quoting POC effort metrics (*"Marketer effort = <15 mins; Developer effort = 0 hours"*). |

---

### Breakout 3: Experimentation — *Day 1, 4:00 PM – 5:00 PM*

| Element | Definitive Source: Dry-Run Guide | Discrepancy in Narrative Playbooks |
|---|---|---|
| **45–55m Segment** | **Promoting Winners to SaaS CMS ONLY:** Show how marketing promotes a winning test variation into permanent SaaS CMS content with 1 click. | *Strategic Narrative* crams **Use Case #9 (Combine Personalization & Testing — running an A/B test *within* an audience + rule conflict prevention)** into this same 10-minute slot alongside 1-click winner promotion. *Team Alignment Playbook* omits 1-click promotion entirely. |
| **05–25m & 25–45m Scenarios** | Generic descriptions of the A/B test (loan application started/completed) and MAB (promotional offer variant). | Narrative docs lock in exact copy/placements: **3-way A/B test** on `/personal/loans` (33/33/34 split: *Control vs. Speed vs. Debt Consolidation*) and **Homepage MAB** on *"What's New Right Now"* (**3-Card Static Grid vs. 6-Card Interactive Carousel**). *(Note: This adds concrete specificity, provided it matches the live demo build).* |

---

### Breakout 4: Digital Asset Management (DAM) — *Day 2, 9:00 AM – 10:00 AM*

| Element | Definitive Source: Dry-Run Guide | Discrepancy in Narrative Playbooks |
|---|---|---|
| **45–55m Segment** | **Rights Management & Expiration Controls ONLY:** Setting expiration dates on promotional banners (e.g., 4.99% auto rate graphic) so assets auto-expire. | Both narrative docs inject **"Where-Used" Dependency Graph / Shared Disclosure Block Reuse (Use Case #3)** across `/` and `/personal/loans` into this 10-minute DAM slot. Furthermore, the *Strategic Narrative* Crosswalk table assigns **Use Case #13 (Localize or Create Form-Factor Variant)** to Breakout 4. |

---

### Breakout 5: Governance — *Day 2, 10:00 AM – 10:30 AM (30-Min Strict Timer)*

| Element | Definitive Source: Dry-Run Guide | Discrepancy in Narrative Playbooks |
|---|---|---|
| **05–15m Guardrails** | Content Types, Blueprints, and **locked/auto-included mandatory disclosure blocks** so an editor cannot publish a loan rate without legal disclosures. | *Strategic Narrative* adds **governed SEO/GEO (`Schema.org FinancialProduct`, OpenGraph, canonicals) and WCAG 2.1 AA accessibility validation (Use Case #11)** into this 10-minute window. |
| **15–25m Workflows** | Opti ID role-based access control (**Author vs. Compliance Reviewer vs. Publisher**), step-by-step approval chain, version rollback, and audit logs. | *Strategic Narrative* adds **minute-level campaign scheduling (Use Case #12)** and renames the middle role from *Compliance Reviewer* to *Approver*. (In a 30-minute session where demo time is strictly capped at 15 minutes total, adding Use Cases #11 and #12 risks breaking the timekeeper rule). |

---

### Breakout 6: Product Lifecycle + SDLC — *Day 2, 10:30 AM – 11:00 AM (30-Min Strict Timer)*

| Element | Definitive Source: Dry-Run Guide | Discrepancy in Narrative Playbooks |
|---|---|---|
| **05–15m Engineering Demo** | **Developer Workflow & Component Modeling:** How developers define schemas and reusable components in code, deploy via standard Git/CI-CD workflows, and expose them as typed building blocks in SaaS CMS. | Both narrative docs replace this with **The Engineering Behind the <2-Week Build**: walking through *Pragmatic Hexagonal Design*, *CMS Anti-Corruption Layer (ACL)*, and *Intrinsic CSS Tokens*, plus referencing the daily 12–4 PM POC testing windows. |
| **23–30m Q&A Topics** | API rate limits, **preview environment synchronization**, SOC2/compliance, custom integration extensibility. | *Strategic Narrative* swaps "preview environment synchronization" for **"multi-environment promotion (Dev → Stage → Prod)"**. |

---

## 3. Summary of Key Alignment Decisions Needed

1. **Personalization Demo Product (Breakout 2):**
   - *Issue:* The Dry-Run Guide prescribes **Auto Loans / Vehicle Refinance**, while both Narrative docs anchor on **Personal Loans (`/personal/loans`) + 8 Life-Stage Toggles**.
   - *Recommendation:* If `/personal/loans` is what was configured in the live POC build (`esl-onsite.optimoey.com`), update the Dry-Run Guide to align on Personal Loans. If Auto Loan variants are built, align the narratives to Auto Loans.
2. **Protecting the 30-Minute Breakouts (Governance & SDLC):**
   - *Issue:* In **Governance (Breakout 5)**, the *Strategic Narrative* crams SEO/GEO metadata, WCAG validation, and minute-level scheduling on top of Blueprints, Disclosures, and RBAC Workflows within a strict 15-minute live software demo cap.
   - *Recommendation:* Reserve Use Cases #11 & #12 for the **Day 2 Executive POC Demo Act I** rather than overloading Breakout 5.
3. **SDLC Middle Segment (Breakout 6):**
   - *Issue:* The Dry-Run Guide prioritizes showing standard developer workflows (code-to-CMS schema modeling), whereas the narrative focuses on the POC architecture story (Hexagonal design, ACL, CSS tokens).
   - *Recommendation:* Align on a tight split: spend 5 minutes showing the code-to-Visual Builder component pipeline, and 5 minutes explaining the architectural resilience (ACL and token design) that enabled the rapid turnaround.

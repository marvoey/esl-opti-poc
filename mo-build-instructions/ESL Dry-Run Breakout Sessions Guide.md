# ESL Dry-Run Breakout Sessions Guide: SaaS CMS & Web Experimentation

## Overview & Modular Audience Strategy

Because stakeholder groups rotate into the room throughout the day, each breakout session operates as an independent, self-contained module. No breakout assumes attendees saw previous sessions.

### The 4-Part Session Framework
Every breakout follows a standardized delivery structure:
1. **Audience Alignment & Context Setter (3–5 mins):** Ground newcomers in ESL's digital scenario (Prospective vs. Existing Member journeys) without re-explaining the full platform history.
2. **Persona-Specific Challenge (5 mins):** Address the specific group's KPIs, operational bottlenecks, compliance risks, and technical pain points.
3. **Targeted Live Demo (60% of time):** Use the SaaS CMS + WebEx demo environment, focusing strictly on capabilities relevant to that room.
4. **Business Impact & Q&A (last 10–15 mins):** Provide actionable takeaways for their leadership and reserve focused time for questions.

---

## The Golden Thread: "From Anonymous Prospect to Loyal Member"

| Day | Arc Theme | Breakout Sequence | Role of SaaS CMS + WebEx Build |
|---|---|---|---|
| Day 1 (Oct 27) | Audience Intent, Relevance & Optimization | 1. CDP (60m)<br>2. Personalization (60m)<br>3. Experimentation (60m) | **Front-Stage Execution:** Show how real-time behavioral data identifies Prospects vs. Members (CDP), how SaaS CMS + WebEx dynamically adapts the experience (Personalization), and how A/B and Multi-Armed Bandits validate conversion lifts (Experimentation). |
| Day 2 (Oct 28) | Enterprise Scale, Governance & SDLC | 4. DAM (60m)<br>5. Governance (30m)<br>6. Product Lifecycle + SDLC (30m) | **Back-Stage Foundation:** Demonstrate how creative assets are ingested, tagged, and surfaced in the CMS (DAM), how design blueprints and compliance guardrails prevent non-compliant releases (Governance), and how modern headless CI/CD architecture separates code releases from content publishing (SDLC). |

---

## Day 1 Breakout Sessions (October 27)

### Breakout 1: Customer Data Platform (ODP)
* **Time:** 2:00 PM – 3:00 PM (60 mins)
* **Target Audience:** Data Architects, Analytics Leads, BI & Data Engineering, Lifecycle Marketing Managers.
* **Core Mindset & Skepticism:** *"Is this another rigid CDP that duplicates our data warehouse, creates sync latency, or exposes PII?"*
* **3-Minute Context Setter:** *"For ESL, a visitor to the site is never just a generic browser—they are either an anonymous prospect researching financial solutions or an existing member managing their financial life. In this session, we explore how Optimizely unifies those behaviors in real time to power immediate on-site decisions."*

| Timing | Agenda Segment | What to Say & Show |
|---|---|---|
| 00–05m | Audience Framing | Contrast batch-based data (24-hour sync delays from warehouse/core banking) with real-time event streaming required to adapt digital experiences in milliseconds. |
| 05–20m | Unified Profile & Identity Resolution | **Show:** An anonymous visitor profile capturing loan calculator usage and product browsing, merging into a unified record when matched (e.g., login or email capture). Highlight zero-PII client-side handling. |
| 20–40m | Audience Segmentation & Behavioral Traits | **Show:** Walk through creating the two core audiences: **Prospective Members** (high intent, non-members) and **Existing Members** (authenticated, active banking). Show how propensity and product affinity update dynamically without writing SQL queries. |
| 40–50m | Activation & Integration Architecture | **Show:** How segments flow downstream directly into Web Experimentation, CMS, and outbound channels with zero developer tickets. Address warehouse sync (Snowflake/Databricks) and compliance boundaries. |
| 50–60m | Technical Q&A & Wrap | Focus on data ingestion latency, data retention policies, and architectural fit into ESL's data stack. |

* **Dry-Run Checkpoint:** Do not open the full WebEx visual editor or review experimentation result cards in this session; stop at audience sync and live profile inspection.

---

### Breakout 2: Personalization
* **Time:** 3:00 PM – 4:00 PM (60 mins)
* **Target Audience:** Digital Experience Managers, Acquisition & Retention Marketing Leads, Web Strategists, Content Leads.
* **Core Mindset & Skepticism:** *"Personalization sounds great in theory, but it usually creates a content maintenance nightmare and breaks page layouts."*
* **3-Minute Context Setter:** *"A prospective member researching a first auto loan needs education, trust, and a frictionless 'Join & Apply' CTA. An existing member looking at the same page needs pre-qualified rate cards and a 1-click application. Showing both the same generic hero banner costs ESL conversions every day."*

| Timing | Agenda Segment | What to Say & Show |
|---|---|---|
| 00–05m | The Business Problem | Explain the cost of one-size-fits-all banking portals: acquisition drop-off and poor member cross-sell. |
| 05–20m | Live Front-End Walkthrough | **Show:** Load the demo site. Toggle the persona: show the **Prospective Member view** (clean rate tables, membership eligibility highlights, introductory messaging) side-by-side with the **Existing Member view** (personalized greeting, pre-approved vehicle refinance rates). Point out how the base page structure remains unified while key blocks adapt. |
| 20–40m | Marketer Workflow: SaaS CMS + WebEx | **Show:** Jump into the **Visual Builder**. Show how a non-technical marketer creates these variations: selecting the audience, swapping text/components, utilizing Opal AI to draft variations, and linking targeted blocks without asking engineering to deploy code. |
| 40–50m | Zero-Flicker & Edge Delivery | Explain how Optimizely prevents layout shift and content flash (critical for brand trust in financial services). |
| 50–60m | Operational Strategy & Q&A | Address how ESL avoids 'personalization sprawl' by targeting high-impact components (heroes, rate cards, CTAs) rather than rewriting entire sites. |

* **Dry-Run Checkpoint:** Keep the focus on audience targeting and experience assembly. Save statistical significance, traffic allocation, and Multi-Armed Bandits for the Experimentation session.

---

### Breakout 3: Experimentation
* **Time:** 4:00 PM – 5:00 PM (60 mins)
* **Target Audience:** CRO & Experimentation Leads, Growth Product Managers, Performance Marketers, Data Analysts.
* **Core Mindset & Skepticism:** *"Does this have real statistical rigor, or is it a vanity testing tool? Can it handle high-velocity campaigns without revenue loss?"*
* **3-Minute Context Setter:** *"In financial services, testing isn't just about button colors. It’s about verifying lending value propositions without risking compliance, and maximizing rate-campaign conversions during peak promotional windows."*

| Timing | Agenda Segment | What to Say & Show |
|---|---|---|
| 00–05m | Strategy: A/B vs. MAB | Define the strategic fork: **A/B Testing** is for statistical certainty and structural learning; **Multi-Armed Bandits (MAB)** are for dynamic revenue/lead optimization where you cannot afford to waste traffic on losing variations. |
| 05–25m | Live A/B Test (Rigorous Learning) | **Show:** Open the **A/B test** configured on the SaaS CMS site. Walk through the hypothesis, variant configurations, conversion event setup (e.g., loan application started/completed), and show the **Stats Engine** dashboard. Explain sequential testing and false positive reduction. |
| 25–45m | Multi-Armed Bandit (Conversion Maximization) | **Show:** Open the **MAB** setup. Demonstrate how traffic allocation shifts dynamically toward the top-converting promotional offer/messaging variant in real time, minimizing regret during limited-time promotions. |
| 45–55m | Promoting Winners to SaaS CMS | **Show:** How a marketing team promotes a winning test variation into permanent SaaS CMS content with one click, eliminating developer backlogs to roll out test winners. |
| 55–60m | Statistical Q&A | Stats engine methodology, Sample Ratio Mismatch (SRM) detection, and experimentation governance. |

---

## Day 2 Breakout Sessions (October 28)

### Breakout 4: Digital Asset Management (DAM)
* **Time:** 9:00 AM – 10:00 AM (60 mins)
* **Target Audience:** Creative Directors, Studio/Production Teams, Brand Managers, Marketing Operations.
* **Core Mindset & Skepticism:** *"Our creatives work in Adobe, marketers work in CMS, and assets get scattered across shared drives. Does this actually fit our creative workflow?"*
* **3-Minute Context Setter:** *"Every personalized variation and experiment we run across members and prospects requires approved imagery, iconography, and promotional badges. Without a streamlined content supply chain, creative teams become the bottleneck for digital agility."*

| Timing | Agenda Segment | What to Say & Show |
|---|---|---|
| 00–05m | Creative Bottlenecks in Banking | Highlight real-world friction: asset duplication, outdated logos, expired regulatory imagery, and constant manual resizing requests. |
| 05–25m | Central Asset Repository & AI Organization | **Show:** Asset ingestion, automated AI tagging, intelligent search by campaign/audience tags (`Audience: Member`, `Product: Lending`), and metadata structures tailored to ESL's financial service products. |
| 25–45m | Direct CMS Integration & Dynamic Renditions | **Show:** Open the **SaaS CMS Visual Builder**. Click into an image slot and launch the **native DAM picker**. Select an asset, apply dynamic crops/renditions for mobile vs. desktop, and show that zero downloading or local re-uploading took place. |
| 45–55m | Rights Management & Expiration Controls | **Show:** Setting expiration dates on promotional banners (e.g., a limited-time 4.99% auto rate graphic) so assets auto-expire and prevent compliance exposure across web channels. |
| 55–60m | Q&A | Adobe Creative Cloud integrations, bulk migration, and metadata governance. |

---

### Breakout 5: Governance
* **Time:** 10:00 AM – 10:30 AM (30 mins — High Impact)
* **Target Audience:** Legal, Regulatory & Compliance Officers, Risk Management, Brand Custodians, Content Operations Leads.
* **Core Mindset & Skepticism:** *"If marketers and growth teams can change pages and test variations freely, how do we prevent someone from publishing non-compliant rates or deleting required NCUA/FDIC disclosures?"*
* **3-Minute Context Setter:** *"In a financial institution, agility cannot come at the expense of regulatory compliance. Governance in Optimizely isn’t an afterthought—it is enforced directly through our component architecture and approval workflows."*

| Timing | Agenda Segment | What to Say & Show |
|---|---|---|
| 00–05m | Governance by Design (The 3 Guardrails) | Frame governance into: **Structural Guardrails** (Design System), **Regulatory Guardrails** (Mandatory Disclosures), and **Operational Guardrails** (Approval Workflows). |
| 05–15m | Visual Builder Architectural Guardrails | **Show:** In SaaS CMS Visual Builder, demonstrate how structured Content Types and Blueprints keep branding and compliance intact. Show how mandatory disclosure/disclaimer blocks are locked or auto-included so an editor cannot publish a loan rate without the corresponding legal disclosure. |
| 15–25m | Roles, Approval Workflows & Audit Logs | **Show:** Opti ID role-based access control (Author vs. Compliance Reviewer vs. Publisher). Show the step-by-step approval chain before a personalized page or experiment goes live, complete with full version rollback and timestamped audit logs. |
| 25–30m | Compliance Q&A | Audit trail exportability, legal preview modes, and disaster-recovery rollback. |

---

### Breakout 6: Product Lifecycle + SDLC
* **Time:** 10:30 AM – 11:00 AM (30 mins — Technical & Architectural)
* **Target Audience:** Enterprise Architects, VP/Director of Engineering, Lead Developers, DevOps & Security Engineers.
* **Core Mindset & Skepticism:** *"Does this lock us into proprietary monolithic hosting, slow down CI/CD, introduce client-side security risks, or hurt Core Web Vitals?"*
* **3-Minute Context Setter:** *"Optimizely’s SaaS CMS and Web Experimentation are built on a headless, API-first foundation. Engineering maintains full control of code, components, and deployment pipelines, while liberating marketing to manage content and targeting."*

| Timing | Agenda Segment | What to Say & Show |
|---|---|---|
| 00–05m | Decoupled Architecture Blueprint | **Show/Explain:** Architecture diagram showing SaaS CMS as the headless authoring layer → **Optimizely Graph** (GraphQL CDN layer) → Frontend on modern infrastructure (Vercel/Next.js) + WebEx integration. |
| 05–15m | Developer Workflow & Component Modeling | **Show:** How developers define schemas and reusable components in code, deploy via standard Git/CI-CD workflows, and expose them as typed building blocks in SaaS CMS without tight server coupling. |
| 15–23m | Edge Performance, Caching & Zero Layout Shift | **Show/Explain:** Edge delivery through Optimizely Graph, fast GraphQL querying, cache invalidation webhooks, and how WebEx delivers variations without layout shift (CLS) or Core Web Vitals degradation. |
| 23–30m | Engineering & Security Q&A | API rate limits, preview environment synchronization, SOC2/compliance, and custom integration extensibility. |

---

## Strategic Safeguards & Dry-Run Operations

### Protecting the Day 2 Executive PoC Demo (1:40 PM – 2:40 PM)
* **In the Breakouts (Day 1 & Day 2 AM):** Treat the environment as a **modular workbench**—go deep into the specific discipline of the room (Data in CDP, Growth in Personalization/Experimentation, Creative in DAM, Compliance in Governance, Engineering in SDLC). Pull back the curtain on the mechanics, rules, and code.
* **In the Executive PoC Demo (Day 2 PM):** Switch to the **executive consumer lens**. Deliver an uninterrupted 15–20 minute end-to-end "Day in the Life" narrative showing how a single ESL campaign moves from authoring to audience personalization to live algorithmic optimization across the live site.

### 3 Tactical Rules for the Dry-Run
1. **The "Reset Script" (First 90 Seconds):** Open each session with a standardized reset:
   > *"Welcome! Today’s scenario centers on ESL’s digital experience and our two core audiences: Prospective Members looking to join and borrow, and Existing Members looking to manage and expand their relationship. In this session, we are specifically focusing on [Data / Experience / Testing / Assets / Governance / Engineering]..."*
2. **Strict Timekeeping on 30-Minute Breakouts:** Spend no more than 5 minutes setting the stage, 15 minutes demonstrating in-software, and protect 10 minutes for pointed questions.
3. **Avoid Premature Feature Spoilers:** Keep attendees focused on the current discipline without leaking the next session's core reveal.

### Friday Dry-Run Pre-Flight Checklist
- [ ] **Persona Toggle Mechanism:** Confirm instantaneous switching between **Prospective Member** and **Existing Member** views (query parameter, cookie switcher, or paired incognito browser profiles).
- [ ] **A/B vs. MAB Visual Distinction:** Ensure the A/B test and Multi-Armed Bandit are applied to distinct components/pages so their strategic differences are self-evident.
- [ ] **Populated Telemetry/Metrics:** Verify WebEx experiment dashboards have sample traffic and conversion curves populated so statistical engines can be properly explained.
- [ ] **Team Handoffs:** Designate lead speakers and software pilots for each session, including 60-second transition wraps between rooms.

# ESL Federal Credit Union Onsite: Master Plan & Execution Guide

**Client:** ESL Federal Credit Union (Rochester, NY)  
**Dates:** Day 1 (October 27, 2026) & Day 2 (October 28, 2026)  
**Event Scope:** Technical Breakout Sessions, Executive Pitch, Commercial Alignment & Live Executive PoC Demo  
**Primary Environment:** Optimizely SaaS CMS + Optimizely Graph + Optimizely Web Experimentation (`4775830914596864`) + Optimizely Data Platform (ODP) on Next.js 16 / React 19 (`marvoey/esl-opti-poc`)

---

## 1. Executive Strategy & Narrative Architecture

### 1.1 The Core Challenger Narrative
Financial institutions do not suffer from a lack of data or digital ambition—they suffer from an **activation delay** and **content supply chain friction**:
* **The Member Experience Problem:** When an existing member visits the public website, they are treated as an anonymous stranger, forced to navigate the same generic rate sheets and "Become a Member" banners.
* **The Marketing Agility Problem:** When marketing wants to test a promotional lending campaign, they face a 6-week developer release cycle, rigid CMS templates, and fragmented asset repositories.
* **The Compliance Bottleneck Problem:** Fear of non-compliant disclosures (NCUA/FDIC rules) often forces digital teams into rigid, monolithic workflows that kill experimentation velocity.

### 1.2 The Golden Thread: "From Anonymous Prospect to Loyal Member"
Every session across the two days anchors to one unified scenario in the Rochester market:
1. **Anonymous Prospect Journey:** A Rochester resident searches for an auto loan, visits ESL's public site, uses the loan calculator, and compares rates.
2. **Identity Stitch & Personalization:** The visitor logs in as an existing member (**Maria Gonzalez**). Without page reload or visual flicker, the hero, navigation, and loan rates pivot to pre-qualified member pricing (4.24% APR) and a 1-click application.
3. **Continuous Optimization:** An active **A/B Test** and **Multi-Armed Bandit (MAB)** dynamically optimize engagement and conversion in real time.
4. **Behind the Scenes:** The content, assets, governance guardrails, and deployment pipelines operate seamlessly without IT bottlenecks.

---

## 2. Master Onsite Schedule

| Day | Time | Duration | Session Name | Target Audience | Lead Role |
|---|---|---|---|---|---|
| **Day 1** | 2:00 PM – 3:00 PM | 60 mins | **Breakout: Customer Data Platform (ODP)** | Data Architects, BI & Analytics Leads, Lifecycle Marketing | Solutions Architect |
| **Day 1** | 3:00 PM – 4:00 PM | 60 mins | **Breakout: Personalization** | Digital Experience Managers, Acquisition/Retention Leads, Web Strategists | Solutions Architect |
| **Day 1** | 4:00 PM – 5:00 PM | 60 mins | **Breakout: Experimentation** | CRO Leads, Growth PMs, Analytics Leads | Solutions Architect |
| **Day 1** | 5:30 PM – 8:00 PM | 150 mins | **Post-Session Dinner** | Key Stakeholders & Evaluation Committee | Full Account Team |
| **Day 2** | 9:00 AM – 10:00 AM | 60 mins | **Breakout: Digital Asset Management (DAM)** | Creative Directors, Studio/Production, Brand Managers, Marketing Ops | Solutions Architect |
| **Day 2** | 10:00 AM – 10:30 AM | 30 mins | **Breakout: Governance** | Legal, Compliance Officers, Risk Management, Content Leads | Solutions Architect |
| **Day 2** | 10:30 AM – 11:00 AM | 30 mins | **Breakout: Product Lifecycle + SDLC** | Enterprise Architects, VP/Dir Engineering, DevOps, Lead Devs | Solutions Architect |
| **Day 2** | 11:00 AM – 11:30 AM | 30 mins | **Pricing Discussion** | VP Marketing, VP Digital/IT, Procurement Leads | Account Executive |
| **Day 2** | 11:30 AM – 12:10 PM | 40 mins | **Implementation + Customer Success** | Project Sponsors, Program Managers, IT Delivery Leads | Services / CS Lead |
| **Day 2** | 12:10 PM – 12:35 PM | 25 mins | **Product Roadmap (Working Lunch)** | All Stakeholders | Product / SA Lead |
| **Day 2** | 12:35 PM – 1:00 PM | 25 mins | **Vendor Pitch Time (Working Lunch)** | All Stakeholders | Account Executive |
| **Day 2** | 1:00 PM – 1:40 PM | 40 mins | **Orals Presentation** | Executive Committee, VP/SVP Sponsors | Account Executive |
| **Day 2** | 1:40 PM – 2:40 PM | 60 mins | **PoC Demo + Closing Thoughts** | Full Committee & Executive Sponsors | SA + AE Team |

---

## 3. Modular Breakout Session Blueprints (Day 1 & Day 2 AM)

*Because stakeholders rotate throughout the day, every breakout operates as an autonomous, 4-part modular session requiring zero prior context.*

### Breakout 1: Customer Data Platform (ODP)
* **Time:** Day 1 | 2:00 PM – 3:00 PM (60 mins)
* **Audience:** Data Architects, Data Engineers, BI Leads, CRM/Lifecycle Marketers
* **Audience Skepticism:** *"Is this another rigid CDP that duplicates our data warehouse, creates sync latency, or exposes PII?"*
* **90-Second Reset:** *"Welcome! Today’s scenario centers on ESL’s digital experience and our two core audiences: Prospective Members and Existing Members. In this hour, we are focusing on the real-time data engine that powers immediate in-session activation without warehouse latency."*

| Timing | Focus Area | Live Demonstration & Talk Track |
|---|---|---|
| **00–10m** | **Data Activation Delay Problem** | Contrast 24-hour warehouse sync delays (Snowflake/Symitar batch jobs) with the millisecond streaming required to adapt a web experience during an active session. |
| **10–25m** | **Identity Resolution & Zero-PII Audit** | **Live Split-Screen:** Open Chrome DevTools on `esl-opti-poc`. Show anonymous browsing generating only an opaque `vuid`. Sign in as Maria Gonzalez: show `esl_session` is `HttpOnly` and `esl_signed_in=1` contains zero PII. In ODP, show the anonymous $32,000 auto loan calculation instantly stitched to Maria's known profile. |
| **25–45m** | **Real-Time Audiences Without SQL** | **Live ODP Walkthrough:** Inspect the 4 credit union segments (`esl_prospective_lending_intent`, `esl_existing_members_auto_refi`, `esl_high_balance_deposit_savers`, `esl_mortgage_homebuyer_intent`). Demonstrate how attributes update dynamically via streaming events. |
| **45–60m** | **Downstream Graph/WebEx Sync & Q&A** | Show real-time sync into Optimizely Web Experimentation and Graph. Address PII boundaries, encryption at rest/transit, and SOC2 compliance. |

---

### Breakout 2: Personalization
* **Time:** Day 1 | 3:00 PM – 4:00 PM (60 mins)
* **Audience:** Digital Experience Managers, Acquisition & Retention Marketing Leads, Web Strategists
* **Audience Skepticism:** *"Personalization sounds great, but it usually creates a content maintenance nightmare and breaks page layouts."*
* **90-Second Reset:** *"Welcome! In this session, we examine how ESL eliminates one-size-fits-all banking experiences by serving high-intent prospects and existing members distinctly, without doubling editorial overhead."*

| Timing | Focus Area | Live Demonstration & Talk Track |
|---|---|---|
| **00–10m** | **The Member vs. Prospect Experience Gap** | Show the cost of a static homepage: prospects get confused by banking logins; existing members get irritated by generic "Join ESL" banners. |
| **10–25m** | **Live Front-End Experience Walkthrough** | **Live Build Walkthrough:** Open `esl-opti-poc`. Toggle between Anonymous Prospect (shows "Join", eligibility checker, public rates) and Signed-In Member (shows personalized greeting for Maria Gonzalez, pre-approved 4.24% auto loan card, 1-click apply). Point out zero layout shift (CLS). |
| **25–45m** | **Marketer Authoring: SaaS CMS Visual Builder** | **Live Authoring:** Open the Visual Builder. Select an audience condition (`esl_signed_in=1`), customize a component variant using Blueprints and Optimizely Opal AI, and preview both persona experiences live. |
| **45–60m** | **Operational Scalability & Q&A** | Discuss avoiding "personalization sprawl" by targeting high-leverage components (hero sliders, rate cards, CTAs) rather than branching entire pages. |

---

### Breakout 3: Experimentation
* **Time:** Day 1 | 4:00 PM – 5:00 PM (60 mins)
* **Audience:** CRO & Experimentation Leads, Growth Product Managers, Performance Marketers, Analytics
* **Audience Skepticism:** *"Is this a vanity testing tool, or does it have true statistical rigor? Can it handle high-velocity rate campaigns without revenue drag?"*
* **90-Second Reset:** *"Welcome! In this session, we dive into continuous experimentation—balancing long-term scientific learning with immediate conversion acceleration across ESL's financial products."*

| Timing | Focus Area | Live Demonstration & Talk Track |
|---|---|---|
| **00–10m** | **Strategic Fork: A/B Testing vs. MAB** | Explain when to use **A/B Testing** (structural UX changes, hypotheses needing statistical certainty) vs. **Multi-Armed Bandits (MAB)** (promotional rate offers, seasonal campaigns where traffic must dynamically shift to the winner). |
| **10–25m** | **Live A/B Test & Stats Engine** | **Live WebEx Walkthrough:** Open Project `4775830914596864`. Walk through the active A/B test on layout messaging. Show sequential testing, false discovery rate (FDR) control, and Sample Ratio Mismatch (SRM) diagnostics. |
| **25–45m** | **Multi-Armed Bandit in Action** | **Live MAB Walkthrough:** Open the promotional rate banner bandit. Show how traffic allocation dynamically funnels toward the highest-converting variant in real time, minimizing the "cost of exploration." |
| **45–60m** | **Zero Developer Backlog & Q&A** | Demonstrate 1-click promotion of winning variations directly into permanent SaaS CMS content, removing the typical 6-week developer implementation queue. |

---

### Breakout 4: Digital Asset Management (DAM)
* **Time:** Day 2 | 9:00 AM – 10:00 AM (60 mins)
* **Audience:** Creative Directors, Studio/Production Teams, Brand Managers, Marketing Operations
* **Audience Skepticism:** *"Our creatives work in Adobe, marketers work in CMS, and assets get scattered across shared drives. Does this actually fit our creative workflow?"*
* **90-Second Reset:** *"Welcome! Yesterday we explored Personalization and Multi-Armed Bandits across Members and Prospects. Today we look at the content supply chain that produces the assets required to feed those personalized experiences."*

| Timing | Focus Area | Live Demonstration & Talk Track |
|---|---|---|
| **00–10m** | **The Content Supply Chain Bottleneck** | Highlight asset duplication, version chaos, expired promotional graphics, and manual resizing requests between marketing and creative. |
| **10–25m** | **Central Repository & AI Auto-Tagging** | **Live DAM Walkthrough:** Ingest raw campaign assets. Show automated AI tagging, facial recognition, and structured metadata schemas tailored to credit union products (`Audience: Member`, `Product: Auto Loan`). |
| **25–45m** | **Native CMS Asset Picker & Renditions** | **Live CMS Integration:** Open SaaS CMS Visual Builder. Click an image component and launch the native DAM picker. Show dynamic smart-cropping and multi-channel aspect ratios (16:9 desktop, 1:1 mobile, 9:16 story) without downloading or re-uploading files. |
| **45–60m** | **Rights Management, Expirations & Q&A** | Demonstrate setting automatic expiration dates on promotional rate graphics (e.g., limited-time 4.99% APR banner) so expired offers cannot legally remain on live sites. |

---

### Breakout 5: Governance
* **Time:** Day 2 | 10:00 AM – 10:30 AM (30 mins — *Strictly Timed*)
* **Audience:** Legal, Regulatory & Compliance Officers, Risk Management, Content Operations Leads
* **Audience Skepticism:** *"If marketing can publish and test freely, how do we prevent someone from publishing non-compliant rates or deleting mandatory NCUA/FDIC disclosures?"*
* **90-Second Reset:** *"Welcome! In financial services, agility without guardrails is a compliance violation, and guardrails without agility create bottlenecks. In Optimizely, governance is enforced by the architecture itself."*

| Timing | Focus Area | Live Demonstration & Talk Track |
|---|---|---|
| **00–05m** | **The 3 Pillars of Financial Governance** | Frame governance across: **Design Governance** (brand system), **Regulatory Governance** (locked disclosures), and **Operational Governance** (approval chains). |
| **05–15m** | **Architectural Guardrails in Visual Builder** | **Live Code/CMS Demo:** Show `EslDisclosure` and `EslDisclosureItem` in `esl-opti-poc`. Demonstrate how mandatory NCUA/Equal Housing disclosure blocks are codified as structured content types that cannot be deleted or unlinked by editors. |
| **15–25m** | **Opti ID RBAC & Multi-Stage Approvals** | **Live Workflow:** Show role separation (Content Author vs. Compliance Reviewer vs. Publisher). Trigger an approval request for a rate change, show visual diff comparison, and review immutable audit logs. |
| **25–30m** | **Disaster Recovery Rollback & Q&A** | Demonstrate 1-click version history rollback in SaaS CMS. |

---

### Breakout 6: Product Lifecycle + SDLC
* **Time:** Day 2 | 10:30 AM – 11:00 AM (30 mins — *Strictly Timed & Highly Technical*)
* **Audience:** Enterprise Architects, VP/Director of Engineering, DevOps, Lead Developers
* **Audience Skepticism:** *"Does this lock us into proprietary monolithic hosting, slow down CI/CD, introduce client-side security risks, or hurt Core Web Vitals?"*
* **90-Second Reset:** *"Welcome! In this session, we review the headless engineering architecture powering ESL's proof-of-concept—demonstrating complete separation of code deployment from content publishing."*

| Timing | Focus Area | Live Demonstration & Talk Track |
|---|---|---|
| **00–05m** | **Hexagonal Decoupled Architecture** | Present the system architecture diagram: SaaS CMS (authoring) → Optimizely Graph (GraphQL CDN layer) → Next.js 16 App Router on Vercel + WebEx integration. |
| **05–15m** | **Developer Workflow & CLI Synchronization** | **Code Walkthrough (`esl-opti-poc`):** Show component colocation (`.tsx`, `.module.css`, `.test.tsx`). Demonstrate `npm run cms:push:vercel` pushing TypeScript component schemas directly to SaaS CMS via `@optimizely/cms-cli`. |
| **15–23m** | **Performance, Edge Caching & Core Web Vitals** | Show ISR caching (`revalidate = 60`), on-demand tag revalidation via `/api/revalidate`, and DNS preconnects ensuring zero layout shift (CLS) for WebEx snippet execution. |
| **23–30m** | **DevOps & Architecture Q&A** | Discuss preview environment synchronization, GraphQL rate limits, and Git branching strategies. |

---

## 4. Commercial & Strategic Sessions (Day 2 Midday)

### 4.1 Pricing Discussion (11:00 AM – 11:30 AM | 30 Mins)
* **Lead:** Account Executive (Supported by Solutions Architect)
* **Audience:** VP Marketing, VP Digital/IT, Procurement & Finance Leads
* **Objective:** Establish price predictability, explain the value metric, and eliminate fear of surprise usage charges.

#### Agenda Breakdown:
1. **Pricing Model Overview (10 mins):**
   * Explain Optimizely’s unified, transparent packaging (SaaS CMS, Graph queries, WebEx active monthly visitors, ODP profile tiers).
   * Contrast against legacy legacy competitors whose complex tiering penalizes digital growth.
2. **Tailored Proposal for ESL (10 mins):**
   * Review ESL’s specific sizing parameters (traffic volumes, content editor seats, active member profiles, experimentation scale).
   * Present the bundled multi-year investment schedule.
3. **Long-Term Price Certainty (10 mins):**
   * Outline multi-year caps, predictable renewal terms, and bundled growth allowances.
   * Q&A on contracting, billing schedules, and procurement terms.

---

### 4.2 Implementation + Customer Success (11:30 AM – 12:10 PM | 40 Mins)
* **Lead:** Services / Customer Success Lead
* **Audience:** Digital Project Sponsors, PMO, IT Delivery Leads, Agency Partners
* **Objective:** Prove that ESL can achieve a high-impact, compliant MVP launch in under 6 months without operational disruption.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ESL 6-MONTH MVP IMPLEMENTATION ROADMAP                  │
├─────────────────┬─────────────────┬───────────────────┬─────────────────────┤
│   MONTH 1 - 2   │   MONTH 3 - 4   │    MONTH 4 - 5    │       MONTH 6       │
│ Foundation & IA │ Component Build │ Migration & Setup │ Go-Live & Expansion │
├─────────────────┼─────────────────┼───────────────────┼─────────────────────┤
│ • Opti ID Setup │ • Next.js React │ • ODP Core Data   │ • Parallel Run & QA │
│ • Graph Schema  │   19 Components │   Sync (Symitar)  │ • Cutover / Go-Live │
│ • Design Tokens │ • Visual Builder│ • WebEx Audiences │ • Post-Launch Hyper │
│ • Taxonomy/DAM  │   Blueprints    │ • Disclosure Locks│   Care & Support    │
└─────────────────┴─────────────────┴───────────────────┴─────────────────────┘
```

#### Key Discussion Pillars:
* **< 6-Month MVP Go-Live:** Phased delivery focusing on public marketing and lending funnels first, followed by authenticated portal expansion.
* **Delivery Accelerators:** Pre-built financial services component models (as demonstrated in `esl-opti-poc`), Optimizely CLI tooling, and reference architectures.
* **Progressive Capability Enhancement:** Crawl (Headless CMS + Search) → Walk (A/B Testing & Audience Personalization) → Run (Multi-Armed Bandits & Real-Time CDP Activation).
* **Customer Support & Success Model:** Dedicated Customer Success Manager (CSM), 24/7 technical support, Named Solutions Architect for onboarding, and Optimizely Academy certification paths for ESL staff.

---

### 4.3 Product Roadmap & Vision (Working Lunch) (12:10 PM – 12:35 PM | 25 Mins)
* **Lead:** Product / SA Lead
* **Audience:** Full Committee
* **Objective:** Demonstrate continuous innovation and protect ESL’s investment over a 3–5 year horizon.

#### Content Walkthrough:
* **Investment Focus & R&D Commitment:** Optimizely reinvests over 25% of annual revenues into platform R&D, leading the market in composable, AI-driven digital experience tools.
* **12–24 Month Roadmap Highlights:**
  * **Agentic Content Workflows (Optimizely Opal):** AI agents that autonomously assemble draft landing pages, check regulatory compliance against financial guidelines, and recommend A/B test variations.
  * **Unified Graph Expansion:** Semantic vector search embedded natively into Optimizely Graph for member search and FAQ discovery.
  * **Cross-Product Intelligence:** Seamless bidirectional feedback loops where experiment winners automatically update CDP predictive traits.

---

### 4.4 Vendor Pitch Time (Working Lunch) (12:35 PM – 1:00 PM | 25 Mins)
* **Lead:** Account Executive
* **Audience:** Full Committee
* **Objective:** Articulate "Why Optimizely, Why Now" and reinforce our unique positioning in credit unions and retail banking.

#### Key Pitch Differentiators:
1. **The Only True "Experimentation-First" CMS:** Competitors treat personalization and testing as separate third-party plugins. Optimizely bakes the Stats Engine directly into the CMS edge delivery.
2. **Freedom of Architecture with Marketer Independence:** Developers use modern Next.js 16/React 19 with complete code sovereignty, while marketers get full visual autonomy via Visual Builder.
3. **Financial Services Compliance by Design:** Built-in disclosure locking, enterprise RBAC, complete audit trails, and zero-PII client exposure.

---

### 4.5 Orals Presentation (1:00 PM – 1:40 PM | 40 Mins)
* **Lead:** Account Executive & Solutions Leadership
* **Audience:** Executive Committee, SVP/VP Sponsors, Decision-Makers
* **Objective:** Executive-level synthesis connecting digital capabilities to ESL’s corporate mission and member growth goals.

#### Slide Sequence & Talking Points:
1. **Company Overview:** Global scale, financial stability, Gartner/Forrester Leader positioning.
2. **Strategic & Cultural Alignment:** Commitment to ESL's community-first mission in Greater Rochester; shared values in member service and ethical data stewardship.
3. **The Unified Platform Value:** Replacing fragmented, multi-vendor stacks (separate CMS, separate CDP, separate testing tool) with one cohesive, composable ecosystem.
4. **Go-to-Market Strategy & Business Case:** Measurable return on investment—increasing loan application completion rates, reducing acquisition costs, and accelerating speed-to-market from months to hours.
5. **Customer References:** Proven case studies in regional credit unions and enterprise financial institutions.

---

## 5. Executive PoC Demo & Closing (1:40 PM – 2:40 PM | 60 Mins)

*This is the capstone session of the entire onsite. Unlike the technical breakouts where you pull back the curtain on administrative dashboards, this session runs as an **uninterrupted 20-minute executive story**, followed by commercial alignment and next steps.*

### 5.1 The "Day in the Life" Executive Demo Script (20 Mins)

```
[ACT 1: The High-Intent Rochester Prospect] (5 mins)
• Load ESL demo site in an anonymous window.
• Visitor browses /loans/auto-loans and calculates a $32,000 auto loan.
• Show that the page emphasizes membership eligibility, trust factors, and transparent rates.

[ACT 2: The Seamless Member Transition] (5 mins)
• Member signs in as Maria Gonzalez.
• Without visual flicker or page reload, the site seamlessly updates:
  - Header welcomes Maria and displays account controls.
  - Auto loan hero updates with pre-qualified 4.24% APR member pricing.
  - Call-to-action transitions to a streamlined "1-Click Pre-Approved Application".
• DevTools callout: Zero PII exposed in the browser DOM.

[ACT 3: Dynamic Conversion Optimization] (5 mins)
• Point out the promotional rate banner powered by Optimizely Multi-Armed Bandit.
• Explain how Optimizely is automatically shifting traffic toward the highest-converting offer.
• Show how a marketer promotes the winning variation directly into production content.

[ACT 4: Behind the Curtain - Marketer Autonomy] (5 mins)
• Open SaaS CMS Visual Builder.
• Demonstrate creating a new promotional campaign variant in under 2 minutes using Opal AI and Blueprints.
• Show compliance guardrails preventing the deletion of mandatory NCUA disclosure disclaimers.
```

### 5.2 Closing Discussion & Decision Framework (40 Mins)
* **Open Discussion & Stakeholder Feedback:** Solicit reactions from each department head (Marketing, IT, Compliance, Finance).
* **Confirming Value Alignment:** Validate that Optimizely satisfies all requirements outlined in the evaluation scorecard.
* **Mutual Action Plan (MAP):**
  * Finalizing commercial agreements and contract execution.
  * Scheduling discovery and kickoff workshops.
  * Mobilizing delivery resources for the Month 1 foundation sprint.

---

## 6. Onsite Technical Pre-Flight & Runbook

### 6.1 Hardware & Display Setup
* **Primary Presenter Machine:** Dual-display enabled for the Reveal.js interactive presentation deck (`/dry-run-deck`).
* **Second Display (Audience Screen):** Clean Chrome window (zoom level 110%) with bookmarks hidden.
* **Presenter Display:** Speaker console (`Press S` in Reveal.js) showing elapsed timer, slide notes, and live click tracks.
* **Backup Connectivity:** Dedicated enterprise hotspot configured in case onsite guest Wi-Fi restricts WebSocket or GraphQL connections.

### 6.2 Browser Tab Layout (Prepared in Order)
* **Tab 1:** Live ESL Demo Site (`esl-opti-poc` on Vercel deployment or `localhost:5002`)
* **Tab 2:** Optimizely SaaS CMS Visual Builder (Experience Editor open on Home Page)
* **Tab 3:** Optimizely Web Experimentation Dashboard (Project `4775830914596864` Results view)
* **Tab 4:** Optimizely Data Platform (Scrolled to **Customers > Profiles** with PII Viewer role enabled)
* **Tab 5:** Interactive Presentation Deck (`/dry-run-deck`)

### 6.3 Demo Personas Quick-Reference

| Persona Name | Username | Role / Audience Status | Demo Purpose |
|---|---|---|---|
| **Anonymous** | *(Signed Out)* | Prospective Member | Demonstrates trust building, eligibility checks, and initial discovery tracking |
| **Maria Gonzalez** | `maria.gonzalez` | Existing Member (Premier Tier) | Primary demo persona: pre-approved auto loan (4.24%), Rochester Chestnut branch |
| **James Okafor** | `james.okafor` | Existing Member (Standard Tier) | Secondary persona: mortgage inquiry and deposit saver |
| **Dorothy Klein** | `dorothy.klein` | Existing Member (High Balance) | CD and High-Yield Savings promotion targeting |

---

## 7. Account Team Roles & Responsibilities

* **Solutions Architect (SA / SE):** 
  * Owns the technical narrative, live software demonstrations, code walk-throughs, and technical breakout sessions (CDP, Personalization, Experimentation, DAM, Governance, SDLC).
  * Executes the Executive PoC Demo on Day 2.
* **Account Executive (AE):**
  * Serves as master of ceremonies, framing business outcomes, managing overall timekeeping, driving commercial sessions (Pricing, Orals, Vendor Pitch), and securing executive close.
* **Services / Customer Success Lead:**
  * Leads the Implementation and Support session, articulating the 6-month go-live blueprint, delivery accelerators, and ongoing relationship governance.

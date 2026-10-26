# Why Optimizely: ESL Federal Credit Union Strategic Narrative & Onsite Master Playbook
**Prepared for:** ESL Federal Credit Union Evaluation Team, Alacrity Partners (Joseph Fain & SP Simon), & Oshyn  
**Live Onsite Environments:**
* **Onsite Extended Experience (ODP, Logged-In State, Personalization, A/B & MAB):** `https://esl-onsite.optimoey.com/`
* **Personal Loans Personalization & Experimentation:** `https://esl-onsite.optimoey.com/personal/loans`
* **Member Sign-In Authentication State:** `https://esl-onsite.optimoey.com/sign-in`
* **Oshyn 14-Use-Case POC Baseline Environment:** `https://opti-1920.move-esl-forward.org/`

---

## 1. Executive Strategy: The Golden Thread Across the Two-Day Onsite

Because stakeholder groups rotate into the room throughout the two days, our delivery must achieve two complementary goals:
1. **Modular Independence:** Each functional breakout operates as a self-contained, 4-part module tailored to the specific practitioners in the room (Data in CDP, Marketers in Personalization, Growth in Experimentation, Creative in DAM, Compliance in Governance, Engineering in SDLC). No session assumes attendees saw previous rooms.
2. **The Cumulative Golden Thread ("From Anonymous Prospect to Loyal Member"):** The narrative builds progressively from Day 1 to Day 2, answering the core question—*Why Optimizely for ESL Federal Credit Union?*

| Day | Arc Theme | Agenda Blocks | Strategic Role of SaaS CMS + WebEx Build |
|---|---|---|---|
| **Day 1 (Oct 27)** | **Audience Intent, Relevance & Optimization** | 1. CDP (60m)<br>2. Personalization (60m)<br>3. Experimentation (60m)<br>4. Post-Session Dinner | **Front-Stage Execution:** Show how real-time behavioral data identifies Prospects vs. Members (CDP/ODP), how SaaS CMS + WebEx dynamically adapts the experience without page cloning (Personalization), and how A/B and Multi-Armed Bandits validate conversion lifts (Experimentation). |
| **Day 2 (Oct 28)** | **Enterprise Scale, Governance & SDLC** | 5. DAM (60m)<br>6. Governance (30m)<br>7. Product Lifecycle + SDLC (30m) | **Back-Stage Foundation:** Demonstrate how creative assets are ingested, tagged, and surfaced in the CMS (DAM), how design blueprints and compliance guardrails prevent non-compliant releases (Governance), and how modern headless CI/CD architecture separates code releases from content publishing (SDLC). |
| **Day 2 (Oct 28)** | **Commercials, Delivery & Strategic Vision** | 8. Pricing (30m)<br>9. Implementation & CS (40m)<br>10. Roadmap (25m)<br>11. Vendor Pitch Time (25m) | **Business De-risking & Vision:** Prove pricing predictability with zero integration tax, de-risk the `<6-month` MVP launch (starting at "Day 45"), share product innovation (Opal AI), and deliver the **Challenger Vision** during lunch (evolving from a product catalog to an *Intent-Driven Member Concierge*). |
| **Day 2 (Oct 28)** | **Executive Synthesis & Grand Finale** | 12. Orals Presentation (40m)<br>13. PoC Demo + Closing (60m) | **The Executive Climax:** Open Orals with the signature **Opening Statement ("The Two-Week Proof")**, followed by an uninterrupted 60-minute **Executive PoC Demo** connecting all 14 use cases and the live onsite build into a single cohesive story. |

---

## 2. Standardized Delivery Framework & Tactical Rules

### The 4-Part Modular Session Framework
Every technical breakout follows this exact four-part structure:
1. **Audience Alignment & Context Setter (3–5 mins):** Ground newcomers in ESL's digital scenario (Prospective vs. Existing Member journeys) using the standardized 90-second Reset Script.
2. **Persona-Specific Challenge (5 mins):** Address the specific room's KPIs, operational bottlenecks, compliance risks, and technical pain points.
3. **Targeted Live Demo (60% of time):** Use the SaaS CMS + WebEx demo environment, focusing strictly on capabilities relevant to that room.
4. **Business Impact & Q&A (last 10–15 mins):** Provide actionable takeaways for their leadership and reserve focused time for questions.

### Strategic Safeguards & Dry-Run Operations
* **Protecting the Day 2 Executive PoC Demo (1:40 PM – 2:40 PM):**
  * **In the Breakouts (Day 1 & Day 2 AM):** Treat the environment as a **modular workbench**—go deep into the specific discipline of the room (Data in CDP, Growth in Personalization/Experimentation, Creative in DAM, Compliance in Governance, Engineering in SDLC). Pull back the curtain on the mechanics, rules, and code.
  * **In the Executive PoC Demo (Day 2 PM):** Switch to the **executive consumer lens**. Deliver an uninterrupted 15–20 minute end-to-end "Day in the Life" narrative showing how a single ESL campaign moves from authoring to audience personalization to live algorithmic optimization across the live site.
* **3 Tactical Rules for Delivery:**
  1. **The "Reset Script" (First 90 Seconds):** Open each session with a standardized reset:
     > *"Welcome! Today’s scenario centers on ESL’s digital experience and our two core audiences: Prospective Members looking to join and borrow, and Existing Members looking to manage and expand their relationship. In this session, we are specifically focusing on [Data / Experience / Testing / Assets / Governance / Engineering]..."*
  2. **Strict Timekeeping on 30-Minute Breakouts:** Spend no more than 5 minutes setting the stage, 15 minutes demonstrating in-software, and protect 10 minutes for pointed questions.
  3. **Avoid Premature Feature Spoilers:** Keep attendees focused on the current discipline without leaking the next session's core reveal.
* **Pre-Flight Technical Checklist:**
  * [ ] **Persona Toggle Mechanism:** Confirm instantaneous switching between **Prospective Member** and **Existing Member** views (query parameter, cookie switcher, or paired incognito browser profiles).
  * [ ] **A/B vs. MAB Visual Distinction:** Ensure the A/B test (`/personal/loans`) and Multi-Armed Bandit (`/` homepage offers) are applied to distinct components/pages so their strategic differences are self-evident.
  * [ ] **Populated Telemetry/Metrics:** Verify WebEx experiment dashboards have sample traffic and conversion curves populated so statistical engines can be properly explained.
  * [ ] **Team Handoffs:** Designate lead speakers and software pilots for each session, including 60-second transition wraps between rooms.

---

## 3. Spoken Anchors: Day 1 Kickoff vs. Day 2 Orals Opening Statement

### A. Day 1 Kickoff (Oct 27, 2:00 PM — Start of CDP Breakout)
*Tone: Collaborative, humble, action-oriented, under 90 seconds.*

> *"Before we jump into our first breakout on the Customer Data Platform, we want to say a sincere thank you to the ESL team, Oshyn, and Alacrity. Over the last two weeks, we've had an open Teams channel, a shared GitHub repo, and daily hands-on testing windows.
>
> What stood out to us immediately was how fast ESL's team moved through the 14 POC use cases—and with how few questions. Because you checked off those 14 baseline requirements so quickly with Oshyn, we decided to use the rest of our two-week window to build out a live glimpse of where ESL can go next on `esl-onsite.optimoey.com`—including live ODP profiles, logged-in member recognition, Personal Loan personalization, A/B testing, and Multi-Armed Bandits.
>
> Over today's three breakouts and tomorrow morning's sessions, we're not going to show you slideware promises—we're going to walk through what is already built and running live in your environment. Let's dive into the CDP."*

---

### B. The Signature Opening Statement for the Orals Presentation (Day 2, Oct 28, 1:00 PM)
*Tone: Executive, visionary, synthesizes the two-week POC and the last 24 hours of sessions right before the Executive PoC Demo.*

> *"Thank you, everyone. Over the last two days, we’ve gone deep into every layer of the platform—from ODP audiences, Personalization, and Experimentation yesterday afternoon, to DAM, Governance, SDLC, Pricing, and our `<6-month` Implementation plan this morning.
>
> As we open our formal Orals presentation, I want to step back and connect all of those sessions to a single question: **Why Optimizely for ESL Federal Credit Union?**
>
> Usually, in an Orals presentation like this, a software vendor stands up with a slide deck and asks you to take a leap of faith. They ask you to trust that their platform will be intuitive for your 39 marketers. They ask you to trust that five different tools will integrate cleanly. And they ask you to trust that you’ll hit a six-month launch deadline.
>
> Today, we don’t have to ask ESL to take a leap of faith—because of what we just proved together over the last two weeks.
>
> In less than ten business days, working side-by-side with Oshyn and guided by Alacrity’s evaluation framework, we didn't just talk about a website. Together, we stood up a working, enterprise-grade Next.js foundation and checked off all 14 of ESL’s core evaluation use cases.
>
> More importantly, look at what happened during the daily 12-to-4 PM hands-on testing windows. When ESL’s own practitioners logged into Optimizely to edit pages, compose components, manage DAM assets, and test governance workflows, you moved faster—and with far fewer questions—than anyone expected. You didn't need an army of developers sitting next to you to make routine changes. The environment simply felt natural.
>
> And because checking off those 14 foundational use cases went so smoothly, our team asked a simple question: **What else can we build for ESL before we walk into the room in Rochester?**
>
> In that same sub-two-week window, we went beyond the 14 checkboxes and built the live experience you saw in our breakouts at `esl-onsite.optimoey.com`. As you saw yesterday and this morning, that isn't a Figma mockup. It is a live application running Optimizely Data Platform (ODP), a simulated logged-in member experience, real-time Personal Loan personalization for existing members versus prospects, 3-way A/B testing, and Multi-Armed Bandit optimization dynamically routing traffic to top-performing offers.
>
> That is our entire 'Why Optimizely' story in a nutshell:
> 1. **First, Proven Velocity:** If ESL, Oshyn, and Optimizely can deliver all 14 core use cases plus advanced personalization, logged-in member recognition, and multi-armed bandit experimentation in **under two weeks**, then hitting your `<6-month` MVP go-live isn't a risk—it’s a certainty. You aren't starting at Day Zero; as we showed in our implementation session, you are starting at Day 45.
> 2. **Second, True Marketer Self-Service:** You saw in the breakouts that your marketers can manage content, assets, audiences, and tests in one unified visual workflow—without page duplication, without code deploys, and without waiting in an IT queue.
> 3. **Third, Room to Grow at Your Pace:** Because CMS, DAM, CDP, Personalization, and Experimentation are already unified under one roof and one transparent contract, ESL can launch a rock-solid MVP in under six months and progressively turn on deeper member personalization whenever your team is ready—with zero re-platforming and zero integration tax.
>
> With that foundation in mind, let’s walk through our Company Overview, Cultural Alignment, and Differentiators—and then at 1:40 PM, we will bring this entire end-to-end member and marketer journey together live in our Executive PoC Demo."*

---

## 4. Complete Session-by-Session Run-of-Show Across Both Days

### DAY 1 (October 27) — Audience Intent, Relevance & Optimization

#### Breakout 1: Customer Data Platform (ODP)
* **Time:** 2:00 PM – 3:00 PM (60 mins)
* **Target Audience:** Data Architects, Analytics Leads, BI & Data Engineering, Lifecycle Marketing Managers.
* **Core Mindset & Skepticism:** *"Is this another rigid CDP that duplicates our data warehouse, creates sync latency, or exposes PII?"*
* **3-Minute Context Setter:** *"For ESL, a visitor to the site is never just a generic browser—they are either an anonymous prospect researching financial solutions or an existing member managing their financial life. In this session, we explore how Optimizely unifies those behaviors in real time to power immediate on-site decisions."*

| Timing | Agenda Segment | What to Say & Show |
|---|---|---|
| **00–05m** | **Day 1 Kickoff & Audience Framing** | Deliver the 90-sec Day 1 Kickoff. Contrast batch-based data (24-hour sync delays from warehouse/core banking) with real-time event streaming required to adapt digital experiences in milliseconds. |
| **05–20m** | **Unified Profile & Identity Resolution** | **Show:** An anonymous visitor profile capturing loan browsing (`a4775830914596864.cdn.optimizely.com`), merging into a unified record when authenticated via `/sign-in` on `esl-onsite.optimoey.com`. Highlight zero-PII client-side tokens. |
| **20–40m** | **Hands-On Use Case #6: Audience Segmentation & Behavioral Traits** | **Show:** Build the two core POC segments live: **Audience 1 (Existing ESL Members)** and **Audience 2 (Prospective Members)**, plus life-stage intent segments (*Buying a home, Debt consolidation, Auto loans*). Inspect real-time audience size estimation, qualification rules, and fallback behavior for unidentifiable visitors without writing SQL. |
| **40–50m** | **Activation & Integration Architecture** | **Show:** How segments flow downstream natively into Web Experimentation and CMS with zero developer tickets. Address warehouse sync (Snowflake/Databricks) and compliance boundaries. |
| **50–60m** | **Technical Q&A & Wrap** | Ingestion latency, data retention, architectural fit into ESL's data stack. Bridge to Personalization: *"Now let's see how marketers activate these audiences in under 3 minutes."* |

* **Dry-Run Checkpoint:** Do not open the full WebEx visual editor or review experimentation result cards in this session; stop at audience sync and live profile inspection.

---

#### Breakout 2: Personalization
* **Time:** 3:00 PM – 4:00 PM (60 mins)
* **Target Audience:** Digital Experience Managers, Acquisition & Retention Marketing Leads, Web Strategists, Content Leads.
* **Core Mindset & Skepticism:** *"Personalization sounds great in theory, but it usually creates a content maintenance nightmare and breaks page layouts."*
* **3-Minute Context Setter:** *"A prospective member researching a personal loan needs rates, speed, and a frictionless 'Apply' CTA. An existing member looking at the same page needs to feel recognized with streamlined borrowing. Showing both the same generic hero banner costs ESL conversions every day. But if personalizing requires managing two separate pages, marketing will abandon it within six months."*

| Timing | Agenda Segment | What to Say & Show |
|---|---|---|
| **00–05m** | **The Business Problem** | Explain the cost of one-size-fits-all banking portals: acquisition drop-off and poor member cross-sell. Contrast with the maintenance trap of full-page duplication. |
| **05–20m** | **Live Walkthrough — Personal Loan Scenario** | **Show:** Load `https://esl-onsite.optimoey.com/personal/loans`. Show the single URL serving three distinct experiences: <br>• **Control:** *"Personal Loans for Life's Big Moments"* (`Apply Now`)<br>• **Audience 1 (Existing Member):** *"You're Already a Member. Let's Make Borrowing Easier."* (`View Your Loan Options`)<br>• **Audience 2 (Prospect):** *"Get the Funds You Need with a Personal Loan from ESL"* (`Apply for a Personal Loan`)<br>Show that the lower page structure (*Eligibility, Details at a Glance, FAQ, Disclosures*) remains single-sourced. |
| **20–40m** | **Marketer Workflow: SaaS CMS Visual Builder (Use Case #7)** | **Show:** Jump into the **Visual Builder**. Show how a non-technical marketer creates these variations: select the ODP audience from a dropdown, swap copy/CTA, use Opal AI for variations, and preview audiences side-by-side with zero code deploys. Show Homepage Life-Stage Toggles (*Buying a home, Planning for retirement*). |
| **40–50m** | **Zero-Flicker & Edge Delivery** | Explain how Optimizely prevents layout shift and content flash (critical for financial services brand trust and Core Web Vitals). |
| **50–60m** | **Operational Strategy, Reporting & Q&A** | Walk through audience-level engagement reporting. Address POC evaluation discussion: **Marketer effort = <15 minutes; Developer effort = 0 hours.** |

* **Dry-Run Checkpoint:** Keep the focus on audience targeting and experience assembly. Save statistical significance, traffic allocation, and Multi-Armed Bandits for Experimentation.

---

#### Breakout 3: Experimentation
* **Time:** 4:00 PM – 5:00 PM (60 mins)
* **Target Audience:** CRO & Experimentation Leads, Growth Product Managers, Performance Marketers, Data Analysts.
* **Core Mindset & Skepticism:** *"Does this have real statistical rigor, or is it a vanity testing tool? Can it handle high-velocity campaigns without revenue loss?"*
* **3-Minute Context Setter:** *"In financial services, testing isn't just about button colors. It’s about verifying lending value propositions without risking compliance, and maximizing rate-campaign conversions during peak promotional windows."*

| Timing | Agenda Segment | What to Say & Show |
|---|---|---|
| **00–05m** | **Strategy: A/B vs. MAB** | Define the strategic fork: **A/B Testing** is for statistical certainty and structural learning; **Multi-Armed Bandits (MAB)** are for dynamic revenue/lead optimization where you cannot afford to waste traffic on losing variations during limited promotional windows. |
| **05–25m** | **Live A/B Test (Rigorous Learning — Use Case #8)** | **Show:** Open the **3-way A/B test** on `https://esl-onsite.optimoey.com/personal/loans` (33/33/34 split):<br>• **Control:** *"Personal Loans for Life's Big Moments"* (`Apply Now`)<br>• **Variant A (Speed & Convenience):** *"Get Access to Funds Faster"* (`Start Your Application`)<br>• **Variant B (Debt Consolidation):** *"Simplify Your Finances with One Monthly Payment"* (`Check Your Options`)<br>Show metric binding: Primary KPI (*Loan Application Starts*) and Secondary KPIs (*CTA Clicks, Application Completion, Bounce Rate*). |
| **25–45m** | **Multi-Armed Bandit (Conversion Maximization)** | **Show:** Open the **MAB** setup on `https://esl-onsite.optimoey.com/` ("What's New Right Now" section) testing the **3-Card Static Grid** vs. **6-Card Interactive Carousel**. Show how traffic shifts dynamically toward the top-converting offer in real time, minimizing regret. |
| **45–55m** | **Hands-On Use Case #9: Combine Personalization & Testing + 1-Click Winner Promotion** | **Show:** Running an A/B test *within* an audience (e.g., Speed vs. Debt Consolidation for Prospects only) with automatic rule conflict prevention. Show promoting a winning test variation into permanent SaaS CMS content with **one click**, eliminating developer backlogs. |
| **55–60m** | **Statistical Q&A & Wrap** | Optimizely Stats Engine methodology (sequential testing, false discovery rate control), Sample Ratio Mismatch (SRM) detection, and experimentation governance. |

---

#### Post-Session Dinner (5:30 PM – 8:00 PM)
* **Goal:** Deepen personal relationships with ESL executives, Alacrity Partners (Joseph Fain & SP Simon), and Oshyn leadership in an informal setting.
* **Talking Points:** Reinforce how smooth the Day 1 sessions were, celebrate the strong collaboration during the two-week POC, and gather informal feedback to fine-tune tomorrow morning’s sessions.

---

### DAY 2 (October 28) — Enterprise Scale, Governance, SDLC, Commercials & Executive Synthesis

#### Breakout 4: Digital Asset Management (DAM)
* **Time:** 9:00 AM – 10:00 AM (60 mins)
* **Target Audience:** Creative Directors, Studio/Production Teams, Brand Managers, Marketing Operations.
* **Core Mindset & Skepticism:** *"Our creatives work in Adobe, marketers work in CMS, and assets get scattered across shared drives. Does this actually fit our creative workflow?"*
* **3-Minute Context Setter:** *"Every personalized variation and experiment we run across members and prospects requires approved imagery, iconography, and promotional badges. Without a streamlined content supply chain, creative teams become the bottleneck for digital agility."*

| Timing | Agenda Segment | What to Say & Show |
|---|---|---|
| **00–05m** | **Creative Bottlenecks in Banking** | Highlight real-world friction: asset duplication, outdated logos, expired regulatory imagery, and constant manual resizing requests. |
| **05–25m** | **Hands-On Use Case #10: Central Asset Repository & AI Organization** | **Show:** Asset ingestion, automated AI tagging, intelligent search by campaign/audience tags (`Audience: Member`, `Product: Lending`), and metadata structures tailored to ESL's financial service products. |
| **25–45m** | **Direct CMS Integration & Dynamic Renditions** | **Show:** Open SaaS CMS Visual Builder. Click into an image slot and launch the **native DAM picker**. Select an asset, apply dynamic crops/renditions for mobile vs. desktop, and show that zero downloading or local re-uploading took place. |
| **45–55m** | **Rights Management, Expiration Controls & Use Case #3 Reuse** | **Show:** Setting expiration dates on promotional banners (e.g., a limited-time 4.99% auto rate graphic) so assets auto-expire and prevent compliance exposure across web channels. Show the **"Where-Used"** dependency graph for shared disclosure blocks across `/` and `/personal/loans`. |
| **55–60m** | **Q&A & Wrap** | Adobe Creative Cloud integrations, bulk migration, and metadata governance. |

---

#### Breakout 5: Governance
* **Time:** 10:00 AM – 10:30 AM (30 mins — High Impact)
* **Target Audience:** Legal, Regulatory & Compliance Officers, Risk Management, Brand Custodians, Content Operations Leads.
* **Core Mindset & Skepticism:** *"If marketers and growth teams can change pages and test variations freely, how do we prevent someone from publishing non-compliant rates or deleting required NCUA/FDIC disclosures?"*
* **3-Minute Context Setter:** *"In a financial institution, agility cannot come at the expense of regulatory compliance. Governance in Optimizely isn’t an afterthought—it is enforced directly through our component architecture and approval workflows."*

| Timing | Agenda Segment | What to Say & Show |
|---|---|---|
| **00–05m** | **Governance by Design (The 3 Guardrails)** | Frame governance into: **Structural Guardrails** (Design System tokens), **Regulatory Guardrails** (Mandatory Disclosures), and **Operational Guardrails** (Approval Workflows). |
| **05–15m** | **Visual Builder Architectural Guardrails (Use Case #11)** | **Show:** In SaaS CMS Visual Builder, demonstrate how structured Content Types and Blueprints keep branding and compliance intact. Show how mandatory disclosure blocks are locked or auto-included so an editor cannot publish a loan rate without the corresponding legal disclosure. Show governed SEO/GEO and WCAG accessibility validation. |
| **15–25m** | **Hands-On Use Case #5 & #12: Roles, Approval Workflows & Version Rollback** | **Show:** Opti ID role-based access control (**Author → Approver → Publisher**). Author submits rate change; Approver reviews visual diff; Publisher releases (premature publish blocked). Show campaign scheduling down to the minute and 1-click historical rollback. |
| **25–30m** | **Compliance Q&A** | Audit trail exportability, legal preview modes, and disaster-recovery rollback. |

---

#### Breakout 6: Product Lifecycle + SDLC
* **Time:** 10:30 AM – 11:00 AM (30 mins — Technical & Architectural)
* **Target Audience:** Enterprise Architects, VP/Director of Engineering, Lead Developers, DevOps & Security Engineers.
* **Core Mindset & Skepticism:** *"Does this lock us into proprietary monolithic hosting, slow down CI/CD, introduce client-side security risks, or hurt Core Web Vitals?"*
* **3-Minute Context Setter:** *"Optimizely’s SaaS CMS and Web Experimentation are built on a headless, API-first foundation. Engineering maintains full control of code, components, and deployment pipelines, while liberating marketing to manage content and targeting."*

| Timing | Agenda Segment | What to Say & Show |
|---|---|---|
| **00–05m** | **Decoupled Architecture Blueprint** | **Show/Explain:** Architecture diagram showing SaaS CMS as the headless authoring layer → **Optimizely Graph** (GraphQL CDN layer) → Frontend on modern infrastructure (Vercel/Next.js) + WebEx integration. |
| **05–15m** | **The Engineering Behind the <2-Week Build** | **Show:** Walk through the live code architecture powering `esl-onsite.optimoey.com`: <br>• **Pragmatic Hexagonal Design:** Decouples core banking domain logic from presentation.<br>• **CMS Anti-Corruption Layer (ACL):** Shields frontend code from schema changes.<br>• **Intrinsic CSS Tokens:** Guarantees layout integrity programmatically. Show shared GitHub workflows and daily 12–4 PM testing windows proven during the POC. |
| **15–23m** | **Edge Performance, Caching & Zero Layout Shift** | **Show/Explain:** Edge delivery through Optimizely Graph, fast GraphQL querying, cache invalidation webhooks, and how WebEx delivers variations without layout shift (CLS) or Core Web Vitals degradation. |
| **23–30m** | **Engineering & Security Q&A** | API rate limits, multi-environment promotion (Dev → Stage → Prod), SOC2/compliance, and custom integration extensibility. |

---

#### 7. Pricing Discussion
* **Time:** 11:00 AM – 11:30 AM (30 mins)
* **Target Audience:** CIO, CFO, VP Procurement, Marketing Leadership, Alacrity Partners.
* **Outline:**
  1. **Pricing Model Overview (0–10m):** Transparent breakdown of SaaS CMS, DAM, Graph, ODP, and Experimentation with **zero per-seat licensing penalties** for ESL’s 39+ content contributors.
  2. **Proposal for ESL (10–20m):** Phased commercial structure aligned with ESL’s rollout, locking in bundle economics upfront while paying for optimization tiers as capabilities activate.
  3. **Long-Term Price Certainty (20–30m):** Multi-year renewal caps and a TCO model proving that consolidating CMS + DAM + CDP + Testing on Optimizely eliminates hundreds of thousands in third-party integration taxes.

---

#### 8. Implementation + Customer Success
* **Time:** 11:30 AM – 12:10 PM (40 mins)
* **Target Audience:** Project Sponsors, PMO, IT Leadership, Oshyn Implementation Team.
* **Outline:**
  1. **The `<6-Month` MVP Go-Live Plan — Starting at "Day 45" (0–12m):** Explain how the POC codebase, Next.js Anti-Corruption Layer, and tested content models mean ESL skips 6 weeks of initial discovery.
  2. **Delivery Accelerators (12–22m):** Pre-built component blueprints (*Hero, Snipe CTA, Key Facts, FAQ, Split Content, Disclosures*), automated migration scripts, and proven Oshyn testbed artifacts.
  3. **Progressive Capability Enhancement (Crawl → Walk → Run) (22–32m):**
     * **Months 1–6 (MVP Launch):** Core CMS, DAM, Governance, Accessibility, SEO/GEO live.
     * **Months 6–9 (Walk):** Activate high-value Personalization (Member vs. Prospect) and A/B testing on key acquisition pages (`/personal/loans`, `/checking`).
     * **Months 9–18 (Run):** Logged-in member recognition, Multi-Armed Bandits on rate campaigns, and real-time ODP behavioral journeys.
  4. **Customer Support Model (32–40m):** Dedicated CSM, 24/7 mission-critical SLA, and Optimizely Academy role-based onboarding for all 39 ESL users.

---

#### 9. Product Roadmap (Working Lunch)
* **Time:** 12:10 PM – 12:35 PM (25 mins)
* **Target Audience:** All Attendees (Lunch Session).
* **Outline:**
  1. **R&D Investment Focus (0–8m):** Optimizely’s significant R&D commitment across Composable CMS, Visual Builder, Optimizely Graph, and AI.
  2. **Direct Feedback Loop from ESL's POC (8–14m):** Show how practitioner feedback logged during the POC testing windows is already prioritized in the product pipeline.
  3. **12–24 Month Vision (14–25m):** Autonomous **Opal AI Agents** for automated content auditing, accessibility scoring, AI search readiness (GEO), and one-click experiment idea generation.

---

#### 10. Vendor Pitch Time (Working Lunch) — The Challenger Vision
* **Time:** 12:35 PM – 1:00 PM (25 mins)
* **Target Audience:** Executive Sponsors, VP Marketing, Chief Member Experience Officer, Alacrity Partners.
* **Outline (The Challenger Reframe: *From Digital Brochure to Intent-Driven Member Concierge*):**
  1. **The Banking Reality (0–7m):** Members don’t wake up seeking a "financial product SKU." They experience life events: *buying a first home in Rochester, consolidating debt, or planning retirement.* Traditional credit union sites force members to navigate deep catalog trees, causing friction and abandonment.
  2. **The Reframe — Intent-Driven Banking (7–17m):** What if ESL.org stopped acting like a static filing cabinet and operated like your most empathetic branch advisor? Show how the **Universal Component Library** + **Life-Stage Intent Toggles** (*Just starting out, Buying a home, Planning for retirement*) + **ODP Signals** dynamically assemble relevant guidance, calculators, and member stories (*Marcia in Finger Lakes, Dolores in Rochester, Elena in Brighton*).
  3. **Why Only Optimizely Delivers This (17–25m):** Because Optimizely unifies Content, Data, and Experimentation in the single interface ESL mastered during the POC, becoming an *Intent-Driven Member Concierge* is a natural marketing habit, not a risky 3-year custom IT development.

---

#### 11. Orals Presentation
* **Time:** 1:00 PM – 1:40 PM (40 mins)
* **Target Audience:** Full ESL Executive Selection Committee, Alacrity Partners, Oshyn Leadership.
* **Outline:**
  1. **The Signature Opening Statement — "The Two-Week Proof" (0–8m):** Deliver the formal address (Section 3B), synthesizing the POC velocity, the 6 breakouts, and the live proof on `esl-onsite.optimoey.com`.
  2. **Company Overview & Financial Strength (8–14m):** Market leadership across Gartner/Forrester quadrants and strong financial services community footprint.
  3. **Strategic & Cultural Alignment with ESL (14–22m):** Shared credit union ethos: member-owned focus, transparency, and community investment.
  4. **Product Overview & Key Differentiators (22–32m):** Unified Composable platform vs. fragmented point solutions; proven practitioner sentiment winner.
  5. **Experience & Financial Services References (32–40m):** Case studies of regional financial institutions driving double-digit loan application growth and dramatic editorial time savings.

---

#### 12. PoC Demo + Closing Thoughts — The Grand Finale
* **Time:** 1:40 PM – 2:40 PM (60 mins)
* **Target Audience:** Full ESL Executive Selection Committee & Stakeholders.
* **Structure:** Switch to the **Executive Consumer Lens**—an uninterrupted, end-to-end journey demonstrating the platform's complete power in 4 acts:
  1. **Act I: The Marketer's Morning (0–18m | Use Cases 1–5, 10–13):** Edit Homepage Hero, compose a new Product Detail Page with design tokens, pull a governed image from DAM with AI alt-text, update a shared disclosure block across multiple pages, and submit through the **Author → Approver → Publisher** workflow.
  2. **Act II: Recognizing the Member (18–35m | Use Cases 6–7 + `esl-onsite.optimoey.com`):** Open `https://esl-onsite.optimoey.com/personal/loans`. Show the Prospective Member view, then authenticate via `/sign-in` or toggle ODP segment to reveal the Existing Member view (*"You're Already a Member. Let's Make Borrowing Easier."*). Demonstrate the 8 Life-Stage toggles on the homepage.
  3. **Act III: Real-Time Optimization (35–48m | Use Cases 8–9, 14):** Inspect the **3-way A/B test** on `/personal/loans` (Control vs. Speed vs. Debt Consolidation) and the live **Multi-Armed Bandit** on homepage offers (3-Card Grid vs. 6-Card Carousel) shifting traffic in real time. Review the executive performance dashboard tying conversion lift directly to active variants.
  4. **Act IV: Closing Thoughts & Partnership Commitment (48–60m):**
     * *"Over the last two weeks, your team didn't just watch a demo—you worked in the platform. And in that same window, we built the foundation of your future digital branch. The environment is live, the team is aligned, and we are ready to build off this POC and launch your MVP in under six months."*

---

## 5. The 14 POC Evaluation Use Cases: Alacrity Scoring Crosswalk

| # | Use Case Name | Alacrity Evaluation Criteria | Optimizely Execution & Evidence | Primary Agenda Home |
|---|---|---|---|---|
| **1** | **Edit Existing Home Page Content** | Fast location of fields, accurate preview, completed without dev support. | Live Visual Builder on Next.js; inline text and image swap with zero code. | Breakout 2 & Exec Demo Act I |
| **2** | **Create New Product Detail Page** | Clear model, useful validation, brand consistency with existing pages. | Product Detail Page created from approved blueprint with structured tokens. | Exec Demo Act I |
| **3** | **Reuse Content and Structures** | Source/usage visible, updates propagate predictably, zero orphaned content. | Shared Rates at a Glance, Eligibility Bar & Disclosures with "Where-Used" dependency graph. | Breakout 4 (DAM) & Exec Demo Act I |
| **4** | **Compose Page with Approved Components** | Intuitive composition, layout guardrails prevent invalid design, preview matches live. | Drag-and-drop Hero, Snipe CTA, Key Facts, FAQ, Split Content, and Disclosures with token constraints. | Breakout 6 (SDLC) & Exec Demo Act I |
| **5** | **Review, Approve & Governed Publish** | Clear status/ownership, duties separated, premature publishing blocked, full audit log. | Opti ID 3-tier role governance: Author submits, Approver reviews visual diff, Publisher releases. | Breakout 5 (Governance) & Exec Demo Act I |
| **6** | **Define & Activate Target Audience** | Understandable data sources/identity rules, previewable criteria, fallback behavior visible. | ODP real-time segments: Existing Member vs. Prospect; real-time size estimation & fallback handling. | Breakout 1 (CDP) & Exec Demo Act II |
| **7** | **Personalize Home Page Hero** | Default vs. personalized clear, audience preview works, single URL (zero page cloning). | Personal Loans (`/personal/loans`) and Homepage Hero with audience preview switcher. | Breakout 2 (Personalization) & Exec Demo Act II |
| **8** | **Run A/B Test on Home Page Hero** | Clear setup of variants, traffic allocation, conversion events, and actionable reporting. | 3-way A/B test on `/personal/loans` (Control vs. Speed vs. Debt Consolidation) with Stats Engine. | Breakout 3 (Experimentation) & Exec Demo Act III |
| **9** | **Combine Personalization & Experimentation** | Clear audience/variant relationships, rule conflict prevention, interpretable reporting. | Testing Variant A vs. B *within* the Prospective Member audience; 1-click promotion to CMS. | Breakout 3 (Experimentation) & Exec Demo Act III |
| **10** | **Manage DAM Asset & Replace Hero Media** | Intuitive ingest/search, correct renditions, visible governance and where-used tracking. | Optimizely DAM: AI auto-tagging, WCAG alt-text, dynamic crops, direct Visual Builder picker. | Breakout 4 (DAM) & Exec Demo Act I |
| **11** | **Manage SEO/GEO & Accessibility Metadata** | Clear inheritance/validation, governed metadata, zero developer tickets required. | Title, Description, Canonical, OG, Schema.org `FinancialProduct`, and WCAG 2.1 AA validation. | Breakout 5 (Governance) & Exec Demo Act I |
| **12** | **Schedule, Version & Roll Back Content** | Unambiguous timezone scheduling, early release prevented, fast 1-click rollback. | Minute-level campaign start/expire (ET), side-by-side visual history diff, 1-click instant rollback. | Breakout 5 (Governance) & Exec Demo Act I |
| **13** | **Localize or Create Form-Factor Variant** | Clear shared vs. local content, visible review status, no full-page duplication. | Device-specific viewport styling and regional targeting while single-sourcing core body copy. | Breakout 4 (DAM) & Exec Demo Act I |
| **14** | **Review Content & Experience Performance** | Metrics understandable, active version/segment context available, insights actionable. | Unified performance dashboard connecting conversion lift directly to active variation and ODP segment. | Breakout 3 & Exec Demo Act III |

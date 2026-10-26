# Why Optimizely: ESL Federal Credit Union Strategic Narrative & Onsite Master Playbook
**Prepared for:** ESL Federal Credit Union Evaluation Team, Alacrity Partners (Joseph Fain & SP Simon), & Oshyn  
**Live Onsite Environments & Configuration:**
* **Onsite Extended Experience (ODP, Logged-In State, Personalization, A/B & MAB):** `https://esl-onsite.optimoey.com/` (Project ID: `4775830914596864`, Snippet: `s3-4775830914596864`)
* **Personal Loans Personalization & Experimentation:** `https://esl-onsite.optimoey.com/personal/loans`
* **Member Sign-In Authentication State:** `https://esl-onsite.optimoey.com/sign-in` (`esl_signed_in=1` cookie)
* **Oshyn 14-Use-Case POC Baseline Environment:** `https://opti-1920.move-esl-forward.org/`

---

## 1. Executive Strategy: The Golden Thread Across the Two-Day Onsite

Because stakeholder groups rotate into the room throughout the two days, our delivery must achieve two complementary goals:
1. **Modular Independence:** Each functional breakout operates as a self-contained, 4-part module tailored to the specific practitioners in the room (Data in CDP, Marketers in Personalization, Growth in Experimentation, Creative in DAM, Compliance in Governance, Engineering in SDLC). No session assumes attendees saw previous rooms.
2. **The Cumulative Golden Thread ("From Anonymous Prospect to Loyal Member"):** The narrative builds progressively from Day 1 to Day 2, answering the core question—*Why Optimizely for ESL Federal Credit Union?*

| Day | Arc Theme | Agenda Blocks | Strategic Role of SaaS CMS + WebEx Build (`4775830914596864`) |
|---|---|---|---|
| **Day 1 (Oct 27)** | **Audience Intent, Relevance & Optimization** | 1. CDP (60m)<br>2. Personalization (60m)<br>3. Experimentation (60m)<br>4. Post-Session Dinner | **Front-Stage Execution:** Show how real-time behavioral data identifies Prospects vs. Members (CDP/ODP), how SaaS CMS + WebEx Campaign **`6504326074466304`** and Opal AI test **`4520294755336192`** dynamically adapt the experience without page cloning (Personalization), and how 3-way A/B Test **`5060834274050048`** and Multi-Armed Bandit **`6613140698300416`** validate conversion lifts (Experimentation). |
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
  * **In the Executive PoC Demo (Day 2 PM):** Switch to the **executive consumer lens**. Deliver an uninterrupted 15–20 minute end-to-end "Day in the Life" narrative showing how a single ESL campaign moves from authoring to audience personalization (`6504326074466304`) to live algorithmic optimization (`5060834274050048` & `6613140698300416`) across the live site.
* **3 Tactical Rules for Delivery:**
  1. **The "Reset Script" (First 90 Seconds):** Open each session with a standardized reset:
     > *"Welcome! Today’s scenario centers on ESL’s digital experience and our two core audiences: Prospective Members looking to join and borrow, and Existing Members looking to manage and expand their relationship. In this session, we are specifically focusing on [Data / Experience / Testing / Assets / Governance / Engineering]..."*
  2. **Strict Timekeeping on 30-Minute Breakouts:** Spend no more than 5 minutes setting the stage, 15 minutes demonstrating in-software, and protect 10 minutes for pointed questions.
  3. **Avoid Premature Feature Spoilers:** Keep attendees focused on the current discipline without leaking the next session's core reveal.

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
| **05–20m** | **Unified Profile & Identity Resolution** | **Show:** An anonymous visitor profile capturing loan browsing (`a4775830914596864.cdn.optimizely.com`), merging into a unified record when authenticated via `/sign-in` on `esl-onsite.optimoey.com` (`esl_signed_in = 1`). Highlight zero-PII client-side tokens. |
| **20–40m** | **Hands-On Use Case #6: Audience Segmentation & Behavioral Traits** | **Show:** Review the core live audiences in Project `4775830914596864`:<br>• **Members (`6051496498823168`)** / **ESL Existing Members (`5641632366723072`)**: Authenticated members (`esl_signed_in = 1`).<br>• **Prospective Members (`6102578658803712`)** / **ESL Prospective Members (Anonymous) (`5523290582679552`)**: Non-authenticated visitors (`esl_signed_in = 0` / `NOT 1`).<br>Inspect real-time audience size estimation, qualification rules, and fallback behavior for unidentifiable visitors without writing SQL. |
| **40–50m** | **Activation & Integration Architecture** | **Show:** How segments flow downstream natively into Web Experimentation and CMS with zero developer tickets. Address warehouse sync (Snowflake/Databricks) and compliance boundaries. |
| **50–60m** | **Technical Q&A & Wrap** | Ingestion latency, data retention, architectural fit into ESL's data stack. Bridge to Personalization: *"Now let's see how marketers activate these audiences in under 3 minutes."* |

* **Dry-Run Checkpoint:** Do not open the full WebEx visual editor or review experimentation result cards in this session; stop at audience sync and live profile inspection.

---

#### Breakout 2: Personalization
* **Time:** 3:00 PM – 4:00 PM (60 mins)
* **Target Audience:** Digital Experience Managers, Acquisition & Retention Marketing Leads, Web Strategists, Content Leads.
* **Core Mindset & Skepticism:** *"Personalization sounds great in theory, but it usually creates a content maintenance nightmare and breaks page layouts."*
* **3-Minute Context Setter:** *"A prospective member researching a personal loan needs rates, speed, and a frictionless 'Apply for a Personal Loan' CTA. An existing member looking at the exact same URL needs to feel recognized with streamlined borrowing—not subjected to 'Can you join?' hurdles. Showing both the same generic hero banner costs ESL conversions every day. But if personalizing requires managing two separate pages, marketing will abandon it within six months."*
* **Live Optimizations Configured in Project `4775830914596864`:**
  1. **Personalization Campaign `6504326074466304` (*"Logged in experience"*):**
     * **Target Pages:** Home Page (`https://esl-onsite.optimoey.com/`, Page ID `5140379081637888`) and Personal Loans Page (`https://esl-onsite.optimoey.com/personal/loans`, Page ID `6471796898136064`).
     * **Priority 1 — Experience `4570486582018048` (*"Logged in"*, Audience `6051496498823168` `Members` `esl_signed_in = 1`, Var ID `5318764307152896`):**
       * **On Home Page (`/`):** Changes `.Hero-module__iaVPCa__headingArea > h1` to **`"Welcome back!"`**, removes `.Hero-module__iaVPCa__actionsArea` (*"Become a member"* & *"Sign in"* hero buttons), and removes the *"Can you join?"* banner (`div:nth-of-type(2) > section > div:nth-of-type(1) > div:nth-of-type(1)`).
       * **On Personal Loans (`/personal/loans`):** Changes `h1` to **`"You're Already a Member. Let's Make Borrowing Easier."`**, subhead to **`"Take advantage of a streamlined application experience and explore loan options designed for ESL members."`**, CTA button to **`"View Your Loan Options"`**, and hides the membership eligibility block (`div:nth-of-type(2) > section`).
     * **Priority 2 — Experience `5474977032437760` (*"Prospective Members"*, Audience `6102578658803712` / fallback for non-members, Var ID `4526703551184896`):**
       * **On Personal Loans (`/personal/loans`):** Changes `h1` to **`"Get the Funds You Need with a Personal Loan from ESL"`**, subhead to **`"Simple application process, competitive rates, and support every step of the way."`**, and CTA button to **`"Apply for a Personal Loan"`**.
  2. **Opal AI Variation Authoring Demo — Optimization `4520294755336192` (*"Replace slogan H1 with member-ownership value proposition"*):**
     * **Target Page:** Home Page (`/`, Page ID `5140379081637888`).
     * **Variation #1 (`4650151514472448`, `isOpalManaged: true`):** Built live with Opal AI—rewrites eyebrow to **`"Member-owned credit union"`**, H1 to **`"The bank you own — and that pays you back."`**, and body copy to **`"As an ESL member, you're an owner — not a customer. That means you share in our success through the Owners' Dividend, and get real guidance from your first account to retirement."`**

| Timing | Agenda Segment | What to Say & Show |
|---|---|---|
| **00–05m** | **The Business Problem** | Explain the cost of one-size-fits-all banking portals: acquisition drop-off, wasted screen space showing *"Can you join?"* to existing members, and poor member cross-sell. Contrast with the maintenance trap of full-page duplication. |
| **05–20m** | **Live Walkthrough — Personal Loan & Member Recognition Scenario (`6504326074466304`)** | **Show:** Load `https://esl-onsite.optimoey.com/` and `/personal/loans`. Toggle the persona via `/sign-in` (`esl_signed_in` cookie):<br>• **Prospective Member View (`5474977032437760`):** Show the acquisition hero (*"Get the Funds You Need with a Personal Loan from ESL"* + *"Apply for a Personal Loan"* CTA) and visible membership eligibility rules.<br>• **Existing Member View (`4570486582018048`):** Sign in (`esl_signed_in = 1`). Show the Home Page recognizing the member with *"Welcome back!"* (and removing *"Become a member"* & *"Can you join?"*), then navigate to `/personal/loans` to show *"You're Already a Member. Let's Make Borrowing Easier."* + *"View Your Loan Options"* CTA with the eligibility section hidden. Emphasize: **One single page URL, one structured content model, zero page cloning.** |
| **20–40m** | **Marketer Workflow: SaaS CMS Visual Builder & Opal AI (`6504326074466304` & `4520294755336192`)** | **Show:** Open Campaign **`6504326074466304`** in Optimizely WebEx to demonstrate pairing audiences (`Members` vs. `Prospective Members`) with targeted visual changes.<br>Then open Optimization **`4520294755336192`** to showcase **Opal AI (`isOpalManaged: true`)** generating credit union copy variations (*"The bank you own — and that pays you back."*) directly inside the Visual Editor without engineering support. |
| **40–50m** | **Zero-Flicker & Edge Delivery** | Explain how Optimizely snippet (`s3-4775830914596864`) and immediate activation prevent layout shift and content flash (critical for financial services brand trust and Core Web Vitals). |
| **50–60m** | **Operational Strategy, Reporting & Q&A** | Walk through audience-level engagement reporting. Address POC evaluation discussion: **Marketer effort = <15 minutes; Developer effort = 0 hours.** Address how ESL avoids 'personalization sprawl' by targeting high-impact components rather than rewriting entire sites. |

* **Dry-Run Checkpoint:** Keep the focus on audience targeting (`6504326074466304`) and Opal AI variation assembly (`4520294755336192`). Save statistical significance, traffic allocation splits, and Multi-Armed Bandits (`5060834274050048` & `6613140698300416`) for Breakout 3.

---

#### Breakout 3: Experimentation
* **Time:** 4:00 PM – 5:00 PM (60 mins)
* **Target Audience:** CRO & Experimentation Leads, Growth Product Managers, Performance Marketers, Data Analysts.
* **Core Mindset & Skepticism:** *"Does this have real statistical rigor, or is it a vanity testing tool? Can it handle high-velocity campaigns without revenue loss?"*
* **3-Minute Context Setter:** *"In financial services, testing isn't just about button colors. It’s about verifying lending value propositions without risking compliance, and maximizing conversion velocity across life-stage journeys."*
* **Live Optimizations Configured in Project `4775830914596864`:**
  1. **Live 3-Way A/B Test — Optimization `5060834274050048` (*"Personal Loans Page – Value Proposition & CTA Test"*, Layer `5070120815427584`):**
     * **Target Page:** Personal Loans Page (`https://esl-onsite.optimoey.com/personal/loans`, Page ID `6471796898136064`).
     * **Traffic Split:** 33.34% / 33.33% / 33.33%.
     * **Variations:**
       * **Original (`6468209157603328`, 33.34%):** Control hero.
       * **Variant A: Speed & Convenience (`5828135919288320`, 33.33%):** `h1` → **`"Get Access to Funds Faster"`**, Subhead → **`"Apply online in minutes and get the financial flexibility you need for life's planned and unplanned expenses."`**, CTA → **`"Start Your Application"`**.
       * **Variant B: Debt Consolidation Focus (`5740748098764800`, 33.33%):** `h1` → **`"Simplify Your Finances with One Monthly Payment"`**, Subhead → **`"Use a personal loan to consolidate higher-interest debt and potentially reduce your monthly payments."`**, CTA → **`"Check Your Options"`**.
     * **Bound Metrics (4):**
       1. **Primary Metric:** `personal loan cta click` (Event `4536124226404352`, click on `.Hero-module__iaVPCa__actionBtn`, unique per visitor, increasing).
       2. **Secondary Metric:** `loan application starts` (Custom Event `5925339619131392`, unique per visitor, increasing).
       3. **Secondary Metric:** `application completion` (Custom Event `5464295314554880`, unique per visitor, increasing).
       4. **Guardrail Metric:** `Bounce Rate` on Personal Loans Page (`6471796898136064`, decreasing).
  2. **Live 4-Arm Multi-Armed Bandit — Optimization `6613140698300416` (*"Banking for Every Stage of Life – CTA & Value Prop Bandit"*, Layer `5656166955483136`):**
     * **Target Page & Component:** Home Page (`https://esl-onsite.optimoey.com/`, Page ID `5140379081637888`) targeting the **"BANKING FOR EVERY STAGE OF LIFE"** section (`#solutions-selector`).
     * **Allocation Policy:** Multi-Armed Bandit (`min-regret`), starting at 25% / 25% / 25% / 25%.
     * **Variations (modifying `#solutions-selector-heading`, description, and header CTA button):**
       * **Original (`5407134131683328`, 25%):** Default section copy and CTA.
       * **Variation 1: Personalized Roadmap (`4772624922836992`, 25%):** Heading → **`"Financial Guidance Built for Your Next Milestone"`**, Description → **`"Select your current life stage below to get a tailored roadmap of accounts, tools, and expert advice."`**, CTA → **`"Build Your Financial Roadmap"`**.
       * **Variation 2: Goal-Oriented Plan (`5505664439549952`, 25%):** Heading → **`"Ready for What’s Next? Let’s Plan Together."`**, Description → **`"From buying your first home to planning for retirement, discover the right ESL solutions for every goal."`**, CTA → **`"Find Your Personalized Plan"`**.
       * **Variation 3: Member Guidance Focus (`5667961019564032`, 25%):** Heading → **`"Smart Banking Solutions for Every Chapter"`**, Description → **`"Explore member-exclusive rates, calculators, and step-by-step guidance designed for where you are today."`**, CTA → **`"Get Free Financial Guidance"`**.
     * **Primary Metric:** `banking stage of life cta click` (Event `4638785017741312`, click on `#solutions-selector .VerticalSelectorFeatureCard-module__2r9QVW__headerCta a`, unique per visitor, increasing).

| Timing | Agenda Segment | What to Say & Show |
|---|---|---|
| **00–05m** | **Strategy: A/B vs. MAB** | Define the strategic fork: **A/B Testing** (`5060834274050048`) is for statistical certainty and structural learning; **Multi-Armed Bandits (MAB)** (`6613140698300416`) are for dynamic revenue/lead optimization where you cannot afford to waste traffic on losing variations during promotional windows. |
| **05–25m** | **Live A/B Test (Rigorous Learning — Use Case #8)** | **Show:** Open **`5060834274050048`** (*Personal Loans Page – Value Proposition & CTA Test*). Walk through the hypothesis, the 33/33/34 split (*Original* vs. *Variant A: Speed & Convenience* vs. *Variant B: Debt Consolidation Focus*), the 4-metric funnel setup (`personal loan cta click` → `loan application starts` → `application completion` + `Bounce Rate`), and show the **Stats Engine** dashboard. *(Optional: Also show `4520294755336192` as a 50/50 Hero A/B test on `/` testing the Owners' Dividend value prop).* |
| **25–45m** | **Multi-Armed Bandit (Conversion Maximization)** | **Show:** Open **`6613140698300416`** (*Banking for Every Stage of Life – CTA & Value Prop Bandit*). Preview the 4 variations on `/#solutions-selector` (*Original*, *Personalized Roadmap*, *Goal-Oriented Plan*, *Member Guidance Focus*) and demonstrate how the `min-regret` bandit dynamically shifts traffic toward the top-converting life-stage value proposition on `banking stage of life cta click`. |
| **45–55m** | **Hands-On Use Case #9: Combine Personalization & Testing + 1-Click Winner Promotion** | **Show:** How scoping A/B Test **`5060834274050048`** to Prospective Members while running Campaign **`6504326074466304`** for Existing Members enables testing *within* an audience and prevents rule collisions on `/personal/loans`. Show promoting a winning test variation into permanent SaaS CMS content with **one click**, eliminating developer backlogs. |
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
  2. **Act II: Recognizing the Member (18–35m | Use Cases 6–7 + `esl-onsite.optimoey.com`):** Open `https://esl-onsite.optimoey.com/personal/loans`. Show the Prospective Member view (`5474977032437760`), then authenticate via `/sign-in` (`esl_signed_in = 1`) to reveal the Existing Member view (*"You're Already a Member. Let's Make Borrowing Easier."*, `4570486582018048`). Show the Home Page recognizing the member with *"Welcome back!"* and removing *"Become a member"* & *"Can you join?"*. Show the 8 Life-Stage toggles on the homepage.
  3. **Act III: Real-Time Optimization (35–48m | Use Cases 8–9, 14):** Inspect the **3-way A/B test** on `/personal/loans` (`5060834274050048`: Control vs. Speed vs. Debt Consolidation) and the live **Multi-Armed Bandit** on the "Banking for Every Stage of Life" section (`6613140698300416`: 4 value prop & CTA arms on `#solutions-selector`) dynamically routing traffic to top-performing variations in real time. Review the executive performance dashboard tying conversion lift directly to active variants.
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
| **6** | **Define & Activate Target Audience** | Understandable data sources/identity rules, previewable criteria, fallback behavior visible. | ODP real-time segments: Existing Member (`6051496498823168`) vs. Prospect (`6102578658803712`); real-time size estimation & fallback handling. | Breakout 1 (CDP) & Exec Demo Act II |
| **7** | **Personalize Home Page Hero** | Default vs. personalized clear, audience preview works, single URL (zero page cloning). | Personalization Campaign **`6504326074466304`** across Personal Loans (`/personal/loans`) and Home Page (`/` -> *"Welcome back!"*), plus Opal AI test **`4520294755336192`**. | Breakout 2 (Personalization) & Exec Demo Act II |
| **8** | **Run A/B Test on Home Page Hero** | Clear setup of variants, traffic allocation, conversion events, and actionable reporting. | 3-way A/B test **`5060834274050048`** on `/personal/loans` (Original vs. Speed & Convenience vs. Debt Consolidation) with Stats Engine and 4 bound metrics. | Breakout 3 (Experimentation) & Exec Demo Act III |
| **9** | **Combine Personalization & Experimentation** | Clear audience/variant relationships, rule conflict prevention, interpretable reporting. | Running A/B test **`5060834274050048`** *within* the Prospective Member audience alongside Campaign **`6504326074466304`** for Existing Members; 1-click promotion to CMS. | Breakout 3 (Experimentation) & Exec Demo Act III |
| **10** | **Manage DAM Asset & Replace Hero Media** | Intuitive ingest/search, correct renditions, visible governance and where-used tracking. | Optimizely DAM: AI auto-tagging, WCAG alt-text, dynamic crops, direct Visual Builder picker. | Breakout 4 (DAM) & Exec Demo Act I |
| **11** | **Manage SEO/GEO & Accessibility Metadata** | Clear inheritance/validation, governed metadata, zero developer tickets required. | Title, Description, Canonical, OG, Schema.org `FinancialProduct`, and WCAG 2.1 AA validation. | Breakout 5 (Governance) & Exec Demo Act I |
| **12** | **Schedule, Version & Roll Back Content** | Unambiguous timezone scheduling, early release prevented, fast 1-click rollback. | Minute-level campaign start/expire (ET), side-by-side visual history diff, 1-click instant rollback. | Breakout 5 (Governance) & Exec Demo Act I |
| **13** | **Localize or Create Form-Factor Variant** | Clear shared vs. local content, visible review status, no full-page duplication. | Device-specific viewport styling and regional targeting while single-sourcing core body copy. | Breakout 4 (DAM) & Exec Demo Act I |
| **14** | **Review Content & Experience Performance** | Metrics understandable, active version/segment context available, insights actionable. | Unified performance dashboard connecting conversion lift directly to active variation (`5060834274050048`) and Multi-Armed Bandit (`6613140698300416`). | Breakout 3 & Exec Demo Act III |

---

## 6. Pre-Flight Technical Checklist & Collision Prevention (Project `4775830914596864`)

- [ ] **1. Resolve `/personal/loans` Hero Collision (`6504326074466304` vs. `5060834274050048`):**
  * *The Issue:* Both Campaign `6504326074466304` and A/B Test `5060834274050048` are running on `/personal/loans` for `everyone`. Overwrites `h1`, subhead, and CTA button for 66.7% of visitors.
  * *Fix:* Either **pause `5060834274050048` during Breakout 2**, or scope `5060834274050048` to **Prospective Members (`6102578658803712` / `5523290582679552`)** and pause Experience 2 (`5474977032437760`) so Existing Members see `4570486582018048` (*"You're Already a Member..."*) while Prospects enter the 3-way test.
- [ ] **2. Resolve Home Page (`/`) H1 Collision (`6504326074466304` vs. `4520294755336192`):**
  * *The Issue:* Experience 1 (`4570486582018048`) sets H1 to `"Welcome back!"` on `/` for `Members`, but A/B Test `4520294755336192` runs for `everyone` and changes H1 to `"The bank you own — and that pays you back."` for 50% of traffic.
  * *Fix:* Target `4520294755336192` to **ESL Prospective Members (Anonymous) (`5523290582679552`)** so signed-in members always see `"Welcome back!"`.
- [ ] **3. Strip MS Word Markup in `6504326074466304`:**
  * Clean `<p class="MsoNormal">` and `<o:p></o:p>` tags in the `h1` changes for Experiences `4570486582018048` and `5474977032437760` to prevent font/margin overrides.
- [ ] **4. Direct Preview / Share Links for Instant Fallback:**
  * `6504326074466304` Exp 1 (Member on `/`): `https://esl-onsite.optimoey.com/?optimizely_token=a5ba656a5bb9dc3ff513e450bd9ca2ba8189db110a2bcef256acec99118f2e1b&optimizely_x=5318764307152896&optimizely_x_audiences=6051496498823168&optimizely_preview_layer_ids=6504326074466304&optimizely_snippet=s3-4775830914596864`
  * `6504326074466304` Exp 1 (Member on `/personal/loans`): `https://esl-onsite.optimoey.com/personal/loans?optimizely_token=a5ba656a5bb9dc3ff513e450bd9ca2ba8189db110a2bcef256acec99118f2e1b&optimizely_x=5318764307152896&optimizely_x_audiences=6051496498823168&optimizely_preview_layer_ids=6504326074466304&optimizely_snippet=s3-4775830914596864`
  * `6504326074466304` Exp 2 (Prospect on `/personal/loans`): `https://esl-onsite.optimoey.com/personal/loans?optimizely_token=a5ba656a5bb9dc3ff513e450bd9ca2ba8189db110a2bcef256acec99118f2e1b&optimizely_x=4526703551184896&optimizely_x_audiences=&optimizely_preview_layer_ids=6504326074466304&optimizely_snippet=s3-4775830914596864`
  * `4520294755336192` Var 1 (Opal AI Owners' Dividend on `/`): `https://esl-onsite.optimoey.com/?optimizely_token=a5ba656a5bb9dc3ff513e450bd9ca2ba8189db110a2bcef256acec99118f2e1b&optimizely_x=4650151514472448&optimizely_x_audiences=&optimizely_preview_layer_ids=4844370086592512&optimizely_snippet=s3-4775830914596864`
  * `5060834274050048` Variant A (Speed on `/personal/loans`): `https://esl-onsite.optimoey.com/personal/loans?optimizely_token=a5ba656a5bb9dc3ff513e450bd9ca2ba8189db110a2bcef256acec99118f2e1b&optimizely_x=5828135919288320&optimizely_x_audiences=&optimizely_preview_layer_ids=5070120815427584&optimizely_snippet=s3-4775830914596864`
  * `5060834274050048` Variant B (Debt Consolidation on `/personal/loans`): `https://esl-onsite.optimoey.com/personal/loans?optimizely_token=a5ba656a5bb9dc3ff513e450bd9ca2ba8189db110a2bcef256acec99118f2e1b&optimizely_x=5740748098764800&optimizely_x_audiences=&optimizely_preview_layer_ids=5070120815427584&optimizely_snippet=s3-4775830914596864`
  * `6613140698300416` MAB Var 1 (Personalized Roadmap on `/`): `https://esl-onsite.optimoey.com/?optimizely_token=a5ba656a5bb9dc3ff513e450bd9ca2ba8189db110a2bcef256acec99118f2e1b&optimizely_x=4772624922836992&optimizely_x_audiences=&optimizely_preview_layer_ids=5656166955483136&optimizely_snippet=s3-4775830914596864`
  * `6613140698300416` MAB Var 2 (Goal-Oriented Plan on `/`): `https://esl-onsite.optimoey.com/?optimizely_token=a5ba656a5bb9dc3ff513e450bd9ca2ba8189db110a2bcef256acec99118f2e1b&optimizely_x=5505664439549952&optimizely_x_audiences=&optimizely_preview_layer_ids=5656166955483136&optimizely_snippet=s3-4775830914596864`
  * `6613140698300416` MAB Var 3 (Member Guidance Focus on `/`): `https://esl-onsite.optimoey.com/?optimizely_token=a5ba656a5bb9dc3ff513e450bd9ca2ba8189db110a2bcef256acec99118f2e1b&optimizely_x=5667961019564032&optimizely_x_audiences=&optimizely_preview_layer_ids=5656166955483136&optimizely_snippet=s3-4775830914596864`

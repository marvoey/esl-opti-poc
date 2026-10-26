# ESL Federal Credit Union — Team Alignment & "Why Optimizely" Presentation Playbook

**Target Account:** ESL Federal Credit Union  
**Evaluation Dates:** Day 1 (Monday, October 27) & Day 2 (Tuesday, October 28)  
**Location:** Onsite (Rochester, NY)  
**Audience:** ESL Evaluation Committee (39+ Stakeholders across Marcom, Marketing, IT, Digital Banking, Compliance)  
**Advisors / Key Influencers:** Alacrity Partners (Joseph Fain, SP Simon), Oshyn (Implementation Testbed Partner)  
**Optimizely Pitch Team:** Marvin Oey (Solutions Architecture), Erlin Saenz, Account Executive, Implementation & Leadership  
**Live Demo Environments:**  
* Production Preview: `https://esl-onsite.optimoey.com/`  
* Personal Loan POC (Personalization & Experiments): `https://esl-onsite.optimoey.com/personal/loans`  
* Auth / Sign-in: `https://esl-onsite.optimoey.com/sign-in`  

---

## 1. Executive Summary & Team Alignment Principles

### The Core Premise: "We Are Not Selling a Promise — We Are Validating a Partnership"
Competitors will walk into ESL’s boardroom with glossy slide decks and make future promises about what their platforms *could* do. 

Optimizely has a fundamentally different and unassailable posture: **We have already done the work.**
* In under two weeks, working hand-in-hand with Oshyn and guided by Alacrity Partners, ESL practitioners tested and validated all **14 POC evaluation use cases**.
* During daily 12:00 PM – 4:00 PM ET testing windows, ESL marketers completed tasks faster and with fewer questions than expected.
* Because that baseline went so smoothly, we went further: we built Horizon 2 and Horizon 3 capabilities on a live, production-grade Next.js stack (`esl-onsite.optimoey.com`), featuring real-time ODP audiences, member-status personalization on Personal Loans, 3-way A/B testing, and Homepage Multi-Armed Bandits.

### The Team Rule: "One Story, Spoken With One Voice"
Every member of our team across all 11 agenda items must anchor back to this shared narrative:
1. **Never disparage competitors directly:** Let our live working software and practitioner ease-of-use speak for itself.
2. **Never treat the POC as disposable:** Frame `esl-onsite.optimoey.com` as "Sprint 0" of ESL’s actual production build. Their `<6-month` MVP launch doesn't start at Day 0—it starts at Day 45.
3. **Keep the Challenger Reframe in its dedicated slot:** Do not overwhelm functional breakout sessions with theoretical slides. Ground the breakouts in ESL's exact requirements and practitioner ease of use; deliver the strategic reframe (*Intent-Driven Member Concierge*) during **Vendor Pitch Time (Day 2, 12:35 PM)**, and bring it home during **Orals Presentation (Day 2, 1:00 PM)**.

---

## 2. The 3 Pillars of the "Why Optimizely" Story

```
+---------------------------------------------------------------------------------------------------+
|                                  THE "WHY OPTIMIZELY" THREAD                                      |
+------------------------------------+------------------------------------+-------------------------+
|             PILLAR 1               |             PILLAR 2               |        PILLAR 3         |
|         PROVEN VELOCITY            |     TRUE MARKETER SELF-SERVICE     |  ROOM TO GROW AT SCALE  |
|                                    |                                    |                         |
| * 14 POC points in <2 weeks        | * Visual on-canvas editing         | * Native ODP CDP        |
| * Oshyn testbed already live       | * Zero developer bottlenecks       | * Stats Engine testing  |
| * <6-month MVP is de-risked        | * No duplicate URLs/pages          | * Multi-Armed Bandits   |
| * Starts at Day 45, not Day 0      | * Built-in governance guardrails   | * Zero integration tax  |
+------------------------------------+------------------------------------+-------------------------+
```

### Pillar 1: Proven Velocity & Delivery Certainty
* **The Message:** "You don't have to hope our platform delivers within your sub-6-month deadline. You just spent two weeks proving it does."
* **Proof Points:** Oshyn's rapid setup; 14 use cases closed out ahead of schedule; live Next.js front-end already rendering ESL's brand and component models.

### Pillar 2: True Marketer Self-Service
* **The Message:** "Personalization and optimization cannot be an IT project. If an ESL marketer has to submit a ticket to test a loan headline or swap an audience banner, optimization dies."
* **Proof Points:** Visual Builder editing directly in page context; audience preview without cloning pages; built-in workflow approvals separating author from publisher.

### Pillar 3: Room to Grow Without the "Integration Tax"
* **The Message:** "A pure headless CMS gives you an empty box and requires 5 vendor contracts plus custom glue code to do personalization and testing. Optimizely gives you a unified composable DXP—CMS, DAM, CDP, Personalization, and Experimentation natively connected with zero integration tax."
* **Proof Points:** Native ODP tracking tag (`a4775830914596864.cdn.optimizely.com`); native Stats Engine; out-of-the-box Multi-Armed Bandit algorithms.

---

## 3. Two-Day Agenda & Team Handoff Playbook

```
OCTOBER 27 (DAY 1)
[2:00 PM - 3:00 PM] Breakout: Customer Data Platform (ODP)
[3:00 PM - 4:00 PM] Breakout: Personalization
[4:00 PM - 5:00 PM] Breakout: Experimentation
[5:30 PM - 8:00 PM] Post-Session Dinner (Executive Relationship Building)

OCTOBER 28 (DAY 2)
[09:00 AM - 10:00 AM] Breakout: Digital Asset Management (DAM)
[10:00 AM - 10:30 AM] Breakout: Governance & Workflows
[10:30 AM - 11:00 AM] Breakout: Product Lifecycle + SDLC
[11:00 AM - 11:30 AM] Pricing Discussion (Total Cost of Ownership)
[11:30 AM - 12:10 PM] Implementation + Customer Success (<6-Month MVP)
[12:10 PM - 12:35 PM] Product Roadmap (Working Lunch)
[12:35 PM - 01:00 PM] Vendor Pitch Time: The Intent-Driven Member Concierge
[01:00 PM - 01:40 PM] Orals Presentation: The Signature "Why Optimizely" Address
[01:40 PM - 02:40 PM] Executive PoC Demo & Closing Thoughts: The Grand Finale
```

---

### DAY 1: BREAKOUT SESSIONS (Monday, October 27)

#### 1. Day 1 Kickoff & Breakout: Customer Data Platform (2:00 PM – 3:00 PM)
* **Lead:** Marvin Oey & Solutions Architect
* **Objective:** Establish the collaborative tone immediately and showcase ODP as the real-time behavioral foundation for the entire site.
* **The 90-Second Kickoff Script:**
  > *"Before we jump into CDP, we want to start by saying thank you to ESL, to Simon and Joseph at Alacrity, and to our partners at Oshyn. Over the past two weeks, during your daily 12-to-4 testing windows, your team dove into our platform and checked off all 14 POC use cases faster and with fewer questions than anyone anticipated. You proved that your practitioners can pick up our tools and immediately create value. Because that went so smoothly, we asked: why stop at table stakes? Over the next two days, we’re going to walk through what you tested, but we’re also going to show you what we built together for what comes next at `esl-onsite.optimoey.com`. Let’s kick off with where every great member experience begins: understanding who the member is."*
* **Demonstration Flow:**
  1. Show ODP visitor tracking tag operating live on `esl-onsite.optimoey.com`.
  2. Define Audiences: **Existing ESL Member** vs. **Prospective Member** using real profile and behavioral criteria.
  3. Show how anonymous first-time visitors are tracked, resolved upon login (`/sign-in`), and unified in the single customer view.
  4. Showcase ODP’s predictive intent capabilities (e.g., probability to open a loan, life-stage indicators).
* **Team Hand-off to Personalization:** "Now that ODP knows who is walking into the digital branch, let's see how ESL marketers use that intelligence to shape the experience in real time."

---

#### 2. Breakout: Personalization (3:00 PM – 4:00 PM)
* **Lead:** Marvin Oey
* **Objective:** Prove that multi-audience personalization is completely marketer-driven, requires zero code changes, and avoids dangerous page cloning.
* **Demonstration Flow:**
  1. Navigate to live `/personal/loans` on `esl-onsite.optimoey.com`.
  2. Show the **Default Experience** vs. the targeted variations:
     * **Audience 1 (Existing Members):** *"You're Already a Member. Let's Make Borrowing Easier."* -> CTA: `View Your Loan Options`.
     * **Audience 2 (Prospective Members):** *"Get the Funds You Need with a Personal Loan from ESL"* -> CTA: `Apply for a Personal Loan`.
  3. Open Optimizely CMS / Visual Builder to show the authoring workflow:
     * Highlight inline visual variant authoring on the Personal Loan hero.
     * Switch viewports (Desktop/Mobile) and Audience Previews in real time.
     * Emphasize: **One single page URL, one structured content model, zero page duplication.**
  4. Demonstrate the **8 Life-Stage Toggles** from the homepage (*"Buying a home," "Fresh start," "Planning for retirement"*) showing how dynamic content modules adapt based on member life events.
* **Key Soundbite:** "Personalization in Optimizely isn't a complex IT project. It’s an editorial choice made right inside the visual canvas."

---

#### 3. Breakout: Experimentation (4:00 PM – 5:00 PM)
* **Lead:** Marvin Oey & Experimentation Specialist
* **Objective:** Prove statistical rigor and demonstrate how A/B testing and Multi-Armed Bandits convert casual traffic into funded loans and deposits.
* **Demonstration Flow:**
  1. Open the **Personal Loan A/B Test** (Scenario 2 from DOCX):
     * **Control:** *"Personal Loans for Life's Big Moments"* -> CTA: `Apply Now`
     * **Variant A (Speed & Convenience):** *"Get Access to Funds Faster"* -> CTA: `Start Your Application`
     * **Variant B (Debt Consolidation):** *"Simplify Your Finances with One Monthly Payment"* -> CTA: `Check Your Options`
  2. Show the Experiment Setup inside Optimizely:
     * Traffic allocation (33/33/34 split) and scheduling.
     * Metric tracking: Primary KPI (`Loan Application Starts`) and Secondary KPIs (`CTA Click Rate`, `Bounce Rate`).
  3. **The Differentiator — Stanford Stats Engine:**
     * Explain Sequential Testing and False Discovery Rate (FDR) control.
     * Explain why traditional t-tests cause marketers to call winners prematurely ("peaking problem"), whereas Stats Engine guarantees statistically valid results at any sample size.
  4. **The Live "Icing" — Multi-Armed Bandit (MAB):**
     * Show the *"WHAT'S NEW RIGHT NOW"* promotional section on `esl-onsite.optimoey.com`.
     * Contrast the static 3-card grid against the dynamic 6-offer carousel.
     * Explain MAB: How machine learning automatically diverts traffic to top-performing financial products in real time during a promotion without waiting weeks for a test to conclude.
* **Wrap-up for Day 1:** Establish high confidence before the evening dinner.

---

### DAY 2: PLATFORM OPERATIONS, COMMERCIALS & STRATEGY (Tuesday, October 28)

#### 4. Breakout: Digital Asset Management (9:00 AM – 10:00 AM)
* **Lead:** Solutions Architect / DAM Specialist
* **Key Message:** Centralized, compliant financial asset governance with automated omnichannel renditions.
* **Demonstration:**
  * Ingesting high-resolution campaign assets, automatic AI tagging, focal-point cropping, and accessibility compliance (alt-text).
  * Direct integration into Visual Builder.
  * **"Where-Used" Governance:** Showing how updating an interest rate graphic or compliance disclosure automatically flags or updates across every page where the asset lives, eliminating stale financial disclosures.

---

#### 5. Breakout: Governance & Workflows (10:00 AM – 10:30 AM)
* **Lead:** Marvin Oey
* **Key Message:** Safe, auditable freedom for 39+ editors without risk of regulatory non-compliance.
* **Demonstration:**
  * Role separation: Content Author edits the homepage hero; submits for review.
  * Approver receives notification, inspects side-by-side diff comparison, requests edits or approves.
  * Publisher role: Proving premature publishing is systematically blocked until compliance/legal signs off.
  * Audit logging and version rollback in a single click.

---

#### 6. Breakout: Product Lifecycle + SDLC (10:30 AM – 11:00 AM)
* **Lead:** Marvin Oey & Technical Architecture Lead
* **Key Message:** Enterprise Next.js architecture with zero developer handcuffs.
* **Demonstration:**
  * Point directly to `esl-onsite.optimoey.com` meta-description: *Enterprise Next.js architecture with Pragmatic Hexagonal Design, CMS Anti-Corruption Layer, and Intrinsic CSS Tokens*.
  * Explain how Oshyn connected Optimizely Graph via GraphQL to the Vercel-hosted Next.js app in days.
  * Show that marketers get full in-context visual editing while developers retain total code freedom and CI/CD pipelines.

---

#### 7. Pricing Discussion (11:00 AM – 11:30 AM)
* **Lead:** Account Executive & Commercial Director
* **Key Message:** Transparent, predictable TCO with zero hidden "headless integration taxes."
* **Pitch Alignment:**
  * Pure headless solutions look cheap on the CMS license, but force ESL to purchase 4 other tools (CDP, testing, DAM, middleware) and spend $300k+ annually maintaining custom integrations.
  * Optimizely delivers CMS, DAM, ODP, and Experimentation on a unified platform with transparent multi-year pricing certainty.

---

#### 8. Implementation + Customer Success (11:30 AM – 12:10 PM)
* **Lead:** Implementation Lead & Oshyn Partner Lead
* **Key Message:** Guaranteed `<6-month` MVP Go-Live because we start at Day 45.
* **Pitch Alignment:**
  * Reiterate that the Oshyn testbed used in the POC *is* the foundation for production.
  * Present the 5-phase delivery accelerator:
    * *Month 1–2:* Refine content model & design tokens (already prototyped).
    * *Month 3–4:* Content migration & core banking integrations.
    * *Month 5:* User training, governance setup, and QA.
    * *Month 6:* Public Go-Live with zero downtime.

---

#### 9. Product Roadmap (12:10 PM – 12:35 PM - Working Lunch)
* **Lead:** Product Strategy Lead
* **Key Message:** Optimizely invests more in DXP R&D than any standalone CMS vendor in the market.
* **Pitch Alignment:**
  * Walk through the 12–24 month roadmap: Agentic CMS capabilities (Opal AI workflows), autonomous experimentation, Graph expansion, and automated accessibility auditing.

---

#### 10. Vendor Pitch Time (12:35 PM – 1:00 PM - Working Lunch)
* **Lead:** Marvin Oey & Strategic Lead
* **Topic:** **"From Navigation-Driven Catalog to Intent-Driven Member Concierge"**
* **The Strategic Narrative:**
  * The traditional banking website is an interactive branch brochure: tabs for Personal, Checking, Loans, Mortgages. The member has to know what financial product solves their life problem.
  * The future of ESL is an **Intent-Driven Member Concierge**:
    * When an existing member visits ESL.org, the site doesn't treat them like a stranger searching for a rate table.
    * It recognizes their life stage (*"Buying a Home"*, *"Consolidating Debt"*, *"Planning for College"*), calculates their affinity via ODP, and dynamically surfaces tailored advice and pre-qualified options.
  * Optimizely is the only platform that combines the content model, the real-time customer data, and the experimentation engine to deliver that vision out of the box.

---

#### 11. Orals Presentation: The Signature "Why Optimizely" Address (1:00 PM – 1:40 PM)
* **Lead:** Account Executive & Marvin Oey
* **Audience:** ESL Executive Committee & All Evaluation Stakeholders
* **The Full Spoken Opening Statement:** *(See Section 4 below)*
* **Session Structure:**
  1. **Minutes 0–5:** The Opening Statement (The Two-Week Proof & Lived Experience).
  2. **Minutes 5–15:** Company Overview, Financial Stability, and Cultural Alignment with Credit Union values.
  3. **Minutes 15–25:** Product Overview & Unified Architecture (Zero Integration Tax).
  4. **Minutes 25–35:** Go-to-Market Strategy, Enterprise Financial Services References (credit unions and banks scaling on Optimizely).
  5. **Minutes 35–40:** Transition to the Executive POC Demo.

---

#### 12. Executive PoC Demo & Closing Thoughts (1:40 PM – 2:40 PM)
* **Lead:** Marvin Oey
* **Objective:** The Grand Finale—run through the complete end-to-end journey live on `esl-onsite.optimoey.com`.
* **Demo Narrative Flow:**
  1. *The Member Journey:* An anonymous visitor lands on the homepage -> browses Auto Loans -> toggles "Buying a Home" -> signs in as an existing member at `/sign-in` -> navigates to `/personal/loans` and receives the personalized borrowing options.
  2. *The Marketer Experience:* Behind the curtain—showing Visual Builder, how the page was modified, the A/B test running under Stats Engine, and the MAB optimizing promotions.
  3. *The Executive Close:* "Everything you saw today was built in two weeks on a production stack. Imagine what your team will achieve in six months."

---

## 4. The Orals Opening Statement (Verbatim Script)

*To be delivered with quiet confidence by the lead speaker at exactly 1:00 PM on Tuesday, October 28:*

> *"Good afternoon, everyone.  
> 
> Over the course of yesterday afternoon and this morning, we’ve walked through six deep technical breakouts, reviewed commercial models, explored our implementation roadmap, and shared our product vision.
> 
> But as we begin our formal Orals presentation, we want to pause and reflect on what has actually happened over the last ten business days.
> 
> When organizations run an RFP for a modern Digital Experience Platform, they are usually asked to make an act of faith. Vendors stand up here with slides, showing conceptual mockups and asking you to trust that their platform can launch in under six months, trust that 39+ marketers and content editors will find their interface intuitive, and trust that their headless integrations won’t break under pressure.
> 
> ESL didn’t ask for an act of faith. Working with Joseph and Simon at Alacrity and our partners at Oshyn, you designed a rigorous, hands-on Proof of Concept grounded in real operating work. You put your practitioners in the driver’s seat.
> 
> And what did that shared experience reveal?
> 
> First, your practitioners blew past the 14 evaluation use cases. In daily 12-to-4 testing windows, your content authors edited heroes, composed product detail pages, established governance approvals, scheduled campaign rollbacks, and configured multi-audience personalization. They moved faster, and with fewer questions, than anyone anticipated. You proved that Optimizely gives your team true self-service freedom without compromising regulatory control.
> 
> Second, because checking off those 14 boxes went so smoothly, we didn’t stop there. Together with Oshyn, we built `esl-onsite.optimoey.com` on a modern enterprise Next.js architecture. We wired in real-time ODP customer data, personalized the Personal Loan experience between members and prospective members, launched a 3-way A/B test, and deployed live Multi-Armed Bandits on your homepage offers. 
> 
> We didn’t build that to show off features. We built it to demonstrate **velocity**. 
> 
> In less than two weeks, on an agile testbed, we brought your future digital branch to life. That means your sub-6-month MVP deadline is no longer a project risk—it is a mathematical certainty. You aren't starting at Day Zero; you are starting at Day 45.
> 
> Over the next 40 minutes, we are going to talk about who we are as a company, our long-term partnership commitment, and our strategic alignment with ESL’s mission. But everything we share is anchored in one fundamental truth: **You have already tested our software. You have already experienced our velocity. And your team has already proven they can succeed with Optimizely.**
> 
> Thank you for welcoming us to Rochester. Let’s dive in."*

---

## 5. Team Dos and Don'ts

| Category | DO | DON'T |
|:---|:---|:---|
| **Tone** | Humble, confident, collaborative. Treat ESL and Oshyn as our teammates who already built something great with us. | Arrogant, defensive, or sounding like a canned sales pitch. |
| **POC Context** | Reference the daily 12–4 PM testing windows, the 14 use cases, and how fast ESL moved. | Treat the POC as an abstract generic demo or pretend we just met them today. |
| **Competitors** | Focus on the "Integration Tax" of pure headless vs. our unified composable architecture. | Mention competitor names negatively (Contentful, Sitecore, Adobe) unless ESL brings them up. |
| **Demo URLs** | Walk through the actual live site (`esl-onsite.optimoey.com`, `/personal/loans`). Show real Next.js performance. | Rely on static screenshots or Figma mockups when live software is running. |
| **6-Month Launch** | Emphasize that the POC codebase with Oshyn is the production accelerator ("Day 45"). | Talk about implementation as an 18-month waterfall project. |
| **Challenger Pitch** | Keep the "Intent-Driven Member Concierge" focused in the Vendor Pitch and Orals slots. | Derail the technical breakout sessions with conceptual philosophy slides. |
| **Practitioners** | Continuously validate the sentiment of the 39+ content editors and marcom team members in the room. | Focus solely on executive IT architecture and ignore daily authoring usability. |

---

## 6. Key Contact & Coordination Directory

* **Optimizely Solutions Architect:** Marvin Oey (`marvin.oey@optimizely.com`)
* **Optimizely Account Team:** Erlin Saenz & Enterprise AE Team
* **Alacrity Partners (Transformation Advisors):**  
  * Joseph Fain (Chief Banking Transformationist) — `joseph.fain@alacrity.partners` | 706.254.4586  
  * SP Simon (Chief Technical Transformationist) — `simon@alacrity.partners` | 502.532.1024  
* **Oshyn (Testbed & Implementation Partner):** Common engineering lead & architecture team  
* **Live POC Reference Endpoints:**  
  * Main Experience: `https://esl-onsite.optimoey.com/`  
  * Personal Loan Personalization & A/B Testing: `https://esl-onsite.optimoey.com/personal/loans`  
  * Online Banking Entry: `https://esl-onsite.optimoey.com/sign-in`

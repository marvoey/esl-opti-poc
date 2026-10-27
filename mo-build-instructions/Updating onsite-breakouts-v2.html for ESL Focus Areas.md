# Updating `onsite-breakouts-v2.html` for the ESL Onsite Focus Areas

This guide analyzes the **ESL Onsite Focus Areas** mapped to **Breakouts 1–6**, breaks down the specific technical and operational nuances behind each question, explains **step-by-step how Optimizely addresses it**, and provides **exact HTML slide, modal, and speaker-note updates** for [`public/onsite-breakouts-v2.html`](https://github.com/marvoey/esl-opti-poc/blob/main/public/onsite-breakouts-v2.html).

> **Design Constraint Preserved:** `onsite-breakouts-v2.html` enforces a live HUD word counter (`#wordCountHud`) targeting **≤ 40 visible words per slide**, keeping deep architectural walkthroughs inside `<aside class="notes">` and interactive cards concise. Every slide update below respects this architectural pattern.

---

## Summary of Breakout-Mapped Focus Areas

Out of the 16 Focus Areas provided by ESL/Alacrity, **14 map directly to the 6 Technical Breakouts** (while **#1 Support Structure** and **#3 Training Program** belong to the Day 2 11:30 AM *Implementation & CS* session, and **#4 AI BYOM & Agentic Future** spans *Breakouts 2 & 4* plus the *Product Roadmap* session):

| Breakout Session | Current Slides in `onsite-breakouts-v2.html` | Focus Areas to Address |
|---|---|---|
| **Breakout 1: CDP / ODP**<br>*(Day 1 • 2:00 PM – 3:00 PM)* | `Slide 1.1` – `Slide 1.4` | • **#8:** CRM – information flow between CDP + CRM (Creatio) |
| **Breakout 2: Personalization**<br>*(Day 1 • 3:00 PM – 4:00 PM)* | `Slide 2.1` – `Slide 2.4` | • **#7:** Cookie consent management – clarify if natively supported. If yes, please demo<br>• **#4 (Part A):** AI – flexibility of models (BYOM); preparation for agentic future (Opal in WebEx) |
| **Breakout 3: Experimentation**<br>*(Day 1 • 4:00 PM – 5:00 PM)* | `Slide 3.1` – `Slide 3.4` | • Reinforces **#7** (Consent-safe bucketing) & **#4** (Opal experiment ideation/summarization) |
| **Breakout 4: DAM**<br>*(Day 2 • 9:00 AM – 10:00 AM)* | `Slide 4.1` – `Slide 4.4` | • **#4 (Part B):** AI – flexibility of models (BYOM) & agentic DAM workflows (auto-tagging, WCAG alt-text)<br>• **#5 (Asset Layer):** Hierarchy vs. Taxonomy in DAM folders vs. structured metadata |
| **Breakout 5: Governance**<br>*(Day 2 • 10:00 AM – 10:30 AM)* | `Slide 5.1` – `Slide 5.4` | • **#5:** Hierarchy vs. Taxonomy – choice of hierarchy and advantages over a taxonomy-based approach<br>• **#10:** Search Engine – demo search engine (Optimizely Graph)<br>• **#15:** Redirect Tooling / Widget / Approach<br>• **#16:** Security – Discuss central management of security access control across the functional portfolio |
| **Breakout 6: Product + SDLC**<br>*(Day 2 • 10:30 AM – 11:00 AM)* | `Slide 6.1` – `Slide 6.4` | • **#2:** Clarify release cadence and notice<br>• **#6:** Preview un-editable – discuss why<br>• **#9:** Clarify Figma / Design system architecture (Brink Interactive)<br>• **#11:** Scalability notice / burst support<br>• **#12:** Marketplace – overview including breadth of available capabilities and types of apps<br>• **#13:** Support for release automation through Azure DevOps<br>• **#14:** CI/CD support across the platform; release management, branching, and promotion |

---

## Breakout 1: Customer Data Platform (ODP)
**Target File Section:** `COLUMN 1: BREAKOUT 1 — CUSTOMER DATA PLATFORM (ODP)` (`Slide 1.1` – `Slide 1.4`)

---

### Focus Area #8: CRM — Information Flow Between CDP + CRM

#### 1. Specific Details of the Question
* **What ESL is really asking:** ESL uses **Creatio CRM** (for member relationship management and branch/advisor workflows) and **FintechOS** (for Online Account Opening), alongside core banking data in Snowflake. Their data architects want to know:
  1. Is ODP trying to replace Creatio CRM or Snowflake?
  2. How do member attributes (e.g., loan status, branch assignment, lifecycle tier) get *into* ODP without exposing sensitive banking PII in the browser?
  3. When a member exhibits high-intent behavior on `esl-onsite.optimoey.com` (e.g., calculating a Personal Loan or abandoning an application), how does that signal flow *back* to Creatio CRM to trigger an advisor follow-up?

#### 2. Step-by-Step: How Optimizely Addresses It
1. **Step 1 — Zero-PII Web Signal Capture (Browser → ODP):**
   * As the visitor browses `/personal/loans`, the ODP JavaScript SDK (`zaius.event()`) and WebEx edge snippet (`s3-4775830914596864`) stream behavioral events (`page_view`, `loan_calculator_interaction`, `personal_loan_cta_click`) using an anonymous `vuid` cookie and hashed/opaque member ID (`esl_member_id`). No raw SSN, account balance, or cleartext PII lives in the DOM.
2. **Step 2 — Identity Resolution & Profile Stitch (`/sign-in` → ODP Graph):**
   * When the member authenticates at `/sign-in` (`esl_signed_in = 1`), ODP stitches the anonymous browsing session to the known `esl_member_id` in under 50ms via the ODP Identity Graph.
3. **Step 3 — Inbound Sync: Creatio CRM / Snowflake → ODP (Enrichment):**
   * Using **Optimizely Connect Platform (OCP)** REST/Webhook connectors or native Snowflake Zero-Copy / Nightly Sync, Creatio CRM pushes non-sensitive member metadata into ODP custom fields (e.g., `member_tenure_tier`, `assigned_branch: "Brighton"`, `prequalified_personal_loan: true`).
4. **Step 4 — Real-Time Edge Qualification (ODP → WebEx & CMS):**
   * ODP evaluates real-time segment membership (`6051496498823168` Existing Members vs. `6102578658803712` Prospective Members) and exposes it at the edge (`a4775830914596864.cdn.optimizely.com`) so `/personal/loans` adapts immediately on page load.
5. **Step 5 — Outbound Activation: ODP → Creatio CRM (Actionable Lead Routing):**
   * When an authenticated member views `/personal/loans` twice in 48 hours and clicks `Start Your Application` without submitting a FintechOS completion event within 2 hours, an **ODP Real-Time Behavioral Trigger** fires an outbound webhook / OCP payload to **Creatio CRM**, creating a Next-Best-Action task for their local ESL Member Advisor.

#### 3. How to Update `onsite-breakouts-v2.html`
1. **Update `Slide 1.3` ("Live Workbench: Unified Identity & Segments"):**
   * Update **Step 3 Card** (`40–50m • Step 3`) from generic `"Downstream Sync"` to **"Bi-Directional CRM Flow (#8)"**:
   ```html
   <div class="opti-card-dark border-t-4 border-t-[#ABFF44]">
     <div class="font-mono text-xs text-[#ABFF44]">40–50m • Step 3 (#8)</div>
     <div class="font-heading font-black text-2xl text-white mt-1">CDP ↔ Creatio CRM</div>
     <p class="text-sm text-[#E4F0DA] mt-2">
       Inbound CRM tiers enrich ODP; high-intent loan drops trigger Creatio advisor alerts.
     </p>
   </div>
   ```
2. **Add Vertical Deep-Dive Slide `Slide 1.3b` (Bi-Directional CDP ↔ CRM Architecture):**
   * Insert a new `<section>` between `Slide 1.3` and `Slide 1.4` showing the 4-stage pipeline:
     * **Card 1 (Inbound):** `Creatio CRM / Snowflake → ODP` (Member Flag, Tenure, Branch ID via OCP REST/Batch).
     * **Card 2 (Identity):** `ODP Identity Graph` (Stitches `vuid` + `esl_signed_in=1` with Zero PII).
     * **Card 3 (Edge Experience):** `WebEx + SaaS CMS` (`<50ms` qualification on `/personal/loans`).
     * **Card 4 (Outbound):** `ODP Webhook → Creatio CRM` (Loan abandonment triggers branch advisor lead).
3. **Update `Slide 1.3` & `1.4` Speaker Notes (`<aside class="notes">`):**
   * Add the exact 5-step Creatio CRM bi-directional walkthrough so the presenter can trace a single member from Creatio → ODP → `/personal/loans` → Creatio advisor queue.

---

## Breakout 2: Personalization
**Target File Section:** `COLUMN 2: BREAKOUT 2 — PERSONALIZATION` (`Slide 2.1` – `Slide 2.4`)

---

### Focus Area #7: Cookie Consent Management — Clarify if Natively Supported. If Yes, Please Demo

#### 1. Specific Details of the Question
* **What ESL is really asking:** Financial institutions face strict privacy scrutiny (GLBA, state privacy laws, third-party tracker audits). ESL wants to know:
  1. Does Optimizely include a built-in banner UI, or does it integrate with enterprise Consent Management Platforms (CMPs) like **OneTrust**, **Cookiebot**, or **Osano**?
  2. Does Optimizely natively enforce consent *before* dropping tracking cookies or stitching ODP profiles?
  3. **Can you demonstrate it live** on `esl-onsite.optimoey.com`?
  4. What happens to website personalization when a visitor **opts out** of tracking cookies? (Does the site break, or does it still work via zero-cookie session/contextual rules?)

#### 2. Step-by-Step: How Optimizely Addresses It (And How to Demo It Live)
1. **Step 1 — Native Consent APIs Built Into WebEx & ODP SDKs:**
   * Clarify transparently: Optimizely is not a legal cookie-banner text generator (like OneTrust/Cookiebot), **but** Optimizely natively enforces consent state at the SDK kernel level and connects out-of-the-box to OneTrust (`OptanonWrapper`), Cookiebot, and custom consent banners.
2. **Step 2 — Pre-Consent Hold & Opt-Out Enforcement (`optimizely.push(["optOut"])`):**
   * Before consent is granted (or if a visitor clicks "Reject Non-Essential Cookies"), calling `window.optimizely.push(["optOut", { isOptOut: true }])` or `zaius.consent({ action: "opt_out" })` immediately prevents WebEx and ODP from writing persistent tracking cookies (`optimizelyEndUserId`, `vuid`) or sending behavioral events to `logx.optimizely.com`.
3. **Step 3 — Graceful First-Party / Contextual Fallback (Personalization Without Third-Party Cookies):**
   * Even if a user opts out of marketing analytics cookies, ESL can still deliver **essential/functional first-party personalization** (such as recognizing `esl_signed_in = 1` when an existing member explicitly signs in, or personalizing by URL/contextual life-stage toggle) without third-party tracking.
4. **Step 4 — Live Browser DevTools Demo on `esl-onsite.optimoey.com` (3-Minute Live Proof):**
   * **Action 1:** Open `https://esl-onsite.optimoey.com/personal/loans` with Chrome DevTools open to **Application → Cookies** and **Console**.
   * **Action 2:** Show `optimizelyEndUserId` and `esl_signed_in` cookies under normal opted-in state.
   * **Action 3:** In the Console (or via the `#launcherModal` 1-click Consent Demo helper), execute:
     ```javascript
     window.optimizely = window.optimizely || [];
     window.optimizely.push(["optOut", { isOptOut: true }]);
     ```
   * **Action 4:** Show in the Network tab that telemetry calls to `logx.optimizely.com` are immediately suppressed, and unauthenticated visitors safely render the governed Default Experience (`Priority 2` / Control) with zero page errors or layout shift.

#### 3. How to Update `onsite-breakouts-v2.html`
1. **Add Interactive Consent Demo Button in `#launcherModal` (Press `L`):**
   * Add a dedicated **"🍪 Focus Area #7: Live Cookie Consent / Opt-Out Demo"** button and snippet inside `#launcherModal` so the presenter can trigger or copy the exact `optimizely.push(["optOut"])` command in 1 click during Breakout 2.
2. **Add Vertical Slide `Slide 2.3b` ("Focus Area #7: Native Consent & Zero-Cookie Fallback"):**
   * Insert under Column 2 (`Breakout 2 • Personalization`):
     * **Card 1:** `Native SDK Enforcement` (`optimizely.push(["optOut"])` & `zaius.consent()` block storage until opt-in).
     * **Card 2:** `OneTrust & CMP Hooks` (Out-of-the-box integration with `OptanonActiveGroups` & GPC signals).
     * **Card 3:** `100% Safe Fallback` (Opted-out visitors receive governed default experience with zero flicker).
   * Include a concise code block showing the 4-line OneTrust / native consent hook.

---

## Breakout 4: Digital Asset Management (DAM) & Breakout 2: Personalization
**Target File Sections:** `COLUMN 2` (`Slide 2.3`) & `COLUMN 4` (`Slide 4.1` – `Slide 4.3`)

---

### Focus Area #4: AI — Flexibility of Models (BYOM); Preparation for Agentic Future

#### 1. Specific Details of the Question
* **What ESL is really asking:** Credit unions cannot blindly send member or proprietary data to public consumer AI models, nor do they want to be locked into a single LLM vendor as AI evolves rapidly. ESL wants to know:
  1. **Model Flexibility / Bring Your Own Model (BYOM):** Can Optimizely Opal connect to different foundation models (OpenAI, Google Gemini, Anthropic Claude, Azure OpenAI) or ESL’s own enterprise-governed LLM endpoints?
  2. **Data Privacy & Zero Training Guarantee:** Is ESL’s data ever used to train public foundation models?
  3. **Agentic Future:** How does Optimizely move beyond basic "chatbots that write a headline" into autonomous, governed **multi-step agents** that execute real work across CMS, DAM, and Experimentation?

#### 2. Step-by-Step: How Optimizely Addresses It
1. **Step 1 — Model-Agnostic Broker & BYOM Architecture:**
   * Optimizely Opal is architected as a **model-agnostic orchestration layer**, not a hardcoded wrapper around one vendor. Out of the box, Opal routes tasks to the best-fit enterprise model (Google Vertex AI / Gemini, OpenAI Enterprise, Anthropic Claude) and supports **Bring Your Own Model (BYOM) / Custom Connectors**—allowing ESL to connect private Azure OpenAI or internal enterprise endpoints via API gateway.
2. **Step 2 — Enterprise Financial Guardrails (Zero Model Training):**
   * All prompts, brand kits, and content remain isolated within ESL’s tenant boundary. Zero customer data or content is ever retained by LLM providers or used to train foundation models.
3. **Step 3 — Embedded Brand & Compliance Context:**
   * Opal enforces ESL’s specific Brand Guidelines and tone of voice (demonstrated live in WebEx Optimization `4520294755336192` generating the *"Owners' Dividend"* variation on `esl-onsite.optimoey.com`).
4. **Step 4 — From Generative Prompts to Specialized & Workflow Agents:**
   * Show how Opal operates across three tiers:
     * **Embedded Assistive AI (Today in POC):** 1-click copy variants in WebEx (`4520294755336192`), automated image tagging, and WCAG 2.1 AA alt-text generation in DAM (`Use Case #10`).
     * **Specialized Agents (Custom Tools & BYOM):** Purpose-built agents configured with ESL’s NCUA/lending compliance rules that audit pages for missing disclosures or translate English campaigns to Spanish (`en` → `es`).
     * **Multi-Step Workflow Agents (The Agentic Future):** Autonomous, human-in-the-loop workflows where a campaign brief triggers an agent chain: *Ingest DAM asset → Generate WCAG metadata → Assemble CMS preview page → Draft 3 A/B test hypotheses → Pause at Approver queue for human sign-off*.

#### 3. How to Update `onsite-breakouts-v2.html`
1. **Update `Slide 2.3` Speaker Notes (Breakout 2 — Opal AI `4520294755336192`):**
   * Add a dedicated callout for **Focus Area #4** when showing the Opal AI *Owners' Dividend* variation (`isOpalManaged: true`), explaining the model-agnostic gateway and BYOM support.
2. **Add Vertical Slide `Slide 4.3b` ("Focus Area #4: Opal AI — BYOM & The Agentic Supply Chain"):**
   * Insert in Breakout 4 (`DAM`) showing the 3 pillars:
     * **Pillar 1: Pluggable BYOM Gateway** (Connect Azure OpenAI, Gemini, Anthropic, or custom ESL models; zero data training).
     * **Pillar 2: Specialized Compliance Agents** (Automated WCAG alt-text, taxonomy tagging & NCUA disclosure verification).
     * **Pillar 3: Human-in-the-Loop Agentic Workflows** (Agents draft, tag, and assemble; ESL Approvers retain final publish lock).

---

## Breakout 5: Governance (30-Minute Sprint)
**Target File Section:** `COLUMN 5: BREAKOUT 5 — GOVERNANCE` (`Slide 5.1` – `Slide 5.4`)

Breakout 5 is a high-density 30-minute sprint that maps to **four specific Focus Areas (#5, #10, #15, #16)** alongside POC Use Cases #5, #11, and #12.

---

### Focus Area #5: Hierarchy vs. Taxonomy — Choice of Hierarchy and Advantages Over a Taxonomy-Based Approach

#### 1. Specific Details of the Question
* **What ESL is really asking:** Pure headless/content-mesh vendors (e.g., Contentful) force everything into a flat, tag-only "bucket of entries" (taxonomy-only). Marketers hate this because they cannot see their website structure, know what URL a page lives at, or set folder-level permissions. ESL wants us to articulate **why Optimizely uses a hierarchical content tree** and how it combines with taxonomy.

#### 2. Step-by-Step: How Optimizely Addresses It
1. **Step 1 — The Pitfall of Pure Taxonomy-Only CMSs:**
   * In a flat, taxonomy-only system, 500 banking pages sit in a single unorganized list. If a marketer mis-tags a page, it disappears from navigation, breaks breadcrumbs, or appears in the wrong section—and you cannot easily grant "Lending Authors" permission to only the `/personal/loans` branch.
2. **Step 2 — Optimizely’s Content Hierarchy (Structural Truth):**
   * Optimizely SaaS CMS organizes pages in a visual **Content Tree Hierarchy** (`Home → Personal → Loans → Auto Loans`). This automatically drives:
     * **Deterministic URL Routing & Breadcrumbs:** Moving a page in the tree automatically updates routes and triggers redirect rules.
     * **Permission & Access Inheritance:** Granting ESL’s Lending team edit rights on `/personal/loans` cascades automatically to child pages.
     * **Visual Wayfinding for 39 Contributors:** Marketers immediately see the site’s information architecture without running search queries.
3. **Step 3 — Hybrid Power: Hierarchy for Structure + Taxonomy for Dynamic Assembly:**
   * Optimizely doesn't force an "either/or" compromise. Pages live in a **governed Hierarchy**, while **Shared Blocks, Rates, FAQs, and DAM Assets** carry rich **Taxonomy tags** (`Audience: Member`, `LifeStage: Buying a Home`, `Product: Lending`) indexed in **Optimizely Graph**. That’s how the homepage *Life-Stage Solutions Selector* dynamically queries across categories while the site retains a rock-solid tree structure.

---

### Focus Area #10: Search Engine — Demo Search Engine

#### 1. Specific Details of the Question
* **What ESL is really asking:** ESL wants to see what powers on-site member search (and internal content discovery) and verify that it isn't a basic SQL `LIKE %keyword%` query. They want a **live demo** of search capabilities.

#### 2. Step-by-Step: How Optimizely Addresses It (And How to Demo It Live)
1. **Step 1 — Powered Natively by Optimizely Graph (No Separate Search Server Required):**
   * Every content item, block, rate, and FAQ published in SaaS CMS is automatically indexed in real time into **Optimizely Graph**, which serves as both the headless GraphQL delivery layer and a full-featured **Enterprise Search Engine**.
2. **Step 2 — Semantic Vector + Full-Text Lexical Search (`_fulltext`):**
   * Optimizely Graph combines exact keyword matching, fuzzy typo tolerance, stemming, and semantic vector relevance so a member searching *"consolidate credit card debt"* surfaces the **Personal Loans** page even if those exact words aren't in the H1.
3. **Step 3 — Banking Synonyms, Boosting & Pinned/Promoted Results:**
   * Marketers manage **Synonyms** (e.g., `HELOC ↔ Home Equity Line of Credit`, `APR ↔ Interest Rate`, `Car Loan ↔ Auto Loan`) and **Best Bets / Promoted Results** directly in the UI without code deployments.
4. **Step 4 — Faceted Filtering & Instant GraphQL Response:**
   * Returns categorized results (`Pages`, `Loans & Rates`, `FAQs`, `calculators`) in `<30ms` from the global CDN edge.

---

### Focus Area #15: Redirect Tooling / Widget / Approach

#### 1. Specific Details of the Question
* **What ESL is really asking:** During the `<6-month` migration of ESL.org—and ongoing seasonal campaigns—marketers need to manage thousands of legacy URLs, 301/302 redirects, and vanity URLs (`esl.org/dividend`, `esl.org/autoloan`) without asking engineering to edit `next.config.js` or CDN edge rules for every change.

#### 2. Step-by-Step: How Optimizely Addresses It
1. **Step 1 — Automatic Slug-Change Redirects:**
   * When an author renames or moves a page in the SaaS CMS Hierarchy, Optimizely tracks historical route changes so existing inbound links and SEO equity never break with 404s.
2. **Step 2 — Self-Service Redirect Management App / Widget in CMS:**
   * Marketers manage **301 (Permanent)**, **302 (Temporary)**, and **Vanity Campaign URLs** directly inside the CMS admin interface—including exact match, wildcard/regex rules, and **Bulk CSV Import/Export** for the initial site migration.
3. **Step 3 — Edge Execution via Optimizely Graph + Next.js Edge Middleware:**
   * Redirect rules are synced to Optimizely Graph / Edge Config and evaluated at the CDN edge (`middleware.ts`) in `<5ms` before the page even renders—preserving Core Web Vitals and eliminating server hops.
4. **Step 4 — Governance & Loop Prevention:**
   * Built-in validation blocks circular redirect chains (`A → B → A`) and requires Publisher permissions to activate site-wide regex redirects.

---

### Focus Area #16: Security — Central Management of Security Access Control Across the Functional Portfolio

#### 1. Specific Details of the Question
* **What ESL is really asking:** ESL has **~59 named users** across 5 distinct groups (17 System Admins, 26 Content Admins, 10 Marcom, 3 Marketing Ops, 3 Digital Engagement) touching CMS, DAM, Web Experimentation, and ODP. Security/IT wants to verify they don't have to manage 5 separate user directories or risk an offboarded employee retaining access.

#### 2. Step-by-Step: How Optimizely Addresses It
1. **Step 1 — Opti ID: Single Enterprise Identity Fabric:**
   * Every module in the portfolio—**SaaS CMS, CMP/DAM, Web Experimentation, ODP, and Opal AI**—is unified behind **Opti ID** (`login.optimizely.com`).
2. **Step 2 — Microsoft Entra ID (Azure AD) SAML 2.0 / OIDC SSO + SCIM 2.0 Provisioning:**
   * ESL connects **Microsoft Entra ID** once. When ESL IT adds a marketer to an Entra security group (`ESL-Opti-Marcom-Authors`), **SCIM 2.0** automatically provisions their account and assigns their exact product roles. When someone leaves ESL and is disabled in Entra ID, access is revoked across every Optimizely product instantaneously.
3. **Step 3 — Two-Layer Granular RBAC (Portfolio Level + Content Tree Level):**
   * **Layer 1 (Opti ID Admin Center):** Controls which products a user can access and their role per instance (`Admin`, `Publisher`, `Approver`, `Author`, `Viewer`).
   * **Layer 2 (CMS Hierarchy ACLs):** Within SaaS CMS, permissions inherit down the content tree (`Focus Area #5`), ensuring a Lending Author can edit `/personal/loans` drafts, a Compliance Officer can approve (`Use Case #5`), and only a Publisher can push live.

---

#### 3. How to Update `onsite-breakouts-v2.html` for Breakout 5 (`#5, #10, #15, #16`)
1. **Update `Slide 5.1` & `Slide 5.3` ("15-Minute Live Compliance Walkthrough"):**
   * Update the footer and demo bullets to explicitly include Focus Areas **#5, #10, #15, and #16**.
2. **Add Two Vertical Slides in Column 5 (`Slide 5.3b` and `Slide 5.3c`):**
   * **`Slide 5.3b` — Information Architecture & Discovery (`#5 Hierarchy vs. Taxonomy` + `#10 Graph Search` + `#15 Redirects`):**
     * **Card 1 (#5 Hierarchy + Taxonomy):** Tree hierarchy drives URLs, breadcrumbs & RBAC inheritance; Taxonomy tags drive dynamic Graph slots.
     * **Card 2 (#10 Live Graph Search):** Semantic + full-text GraphQL search, banking synonyms (`HELOC ↔ Home Equity`), and pinned Best Bets.
     * **Card 3 (#15 Redirect Manager):** Self-service 301/302 & vanity URLs, bulk CSV migration import, and `<5ms` Next.js Edge Middleware execution.
     * Include a concise GraphQL snippet showing a live `_fulltext` + facet search query against Optimizely Graph.
   * **`Slide 5.3c` — Enterprise Security & Central Access (`#16 Opti ID Across Portfolio`):**
     * Visual 3-column flow mapping ESL's **59 RFP Users**:
       1. `Microsoft Entra ID (SSO + SCIM 2.0)` → Automated group sync & instant deprovisioning.
       2. `Opti ID Central Admin` → Single control plane across CMS, DAM, WebEx, ODP & Opal.
       3. `Granular Separation of Duties` → 17 SysAdmins, 26 Content Admins, 10 Marcom, 3 Mktg Ops, 3 Digital Engagement enforced with full SOC 2 Type II audit logs.

---

## Breakout 6: Product Lifecycle + SDLC (30-Minute Sprint)
**Target File Section:** `COLUMN 6: BREAKOUT 6 — PRODUCT LIFECYCLE + SDLC` (`Slide 6.1` – `Slide 6.4`)

Breakout 6 is where ESL’s Enterprise Architects, Engineering Leads, and DevOps teams evaluate **seven specific Focus Areas (#2, #6, #9, #11, #12, #13, #14)**.

---

### Focus Area #2: Clarify Release Cadence and Notice

#### 1. Specific Details of the Question
* **What ESL is really asking:** Legacy DXP platforms require painful yearly/bi-annual version upgrades (`v11 → v12`) that freeze marketing projects for months and cost six figures in SI upgrade fees. Conversely, enterprise IT fears unannounced SaaS UI/API changes breaking production. They want clarity on **how updates ship** and **how much advance notice ESL gets**.

#### 2. Step-by-Step: How Optimizely Addresses It
1. **Step 1 — Evergreen Multi-Tenant SaaS (Zero Version Upgrades Forever):**
   * Optimizely CMS SaaS, Graph, WebEx, and ODP operate on a **continuous, zero-downtime release cadence**. Features and security patches roll out weekly/bi-weekly behind the scenes. ESL will **never** pay for or execute a major version upgrade again.
2. **Step 2 — Strict Backward Compatibility & Versioned APIs:**
   * All REST APIs, Content Management APIs, and GraphQL endpoints are strictly versioned. Automatic weekly platform releases never alter ESL’s Next.js front-end code or break existing Graph queries.
3. **Step 3 — Release Notice & Communication SLA:**
   * **Monthly Release Notes & Roadmap Previews:** Published in the Optimizely Help Center & Customer Portal.
   * ** Optimizely Status & Trust Center (`status.optimizely.com`):** Real-time automated webhook/email notifications for maintenance windows.
   * **Breaking Change / Deprecation Policy:** Minimum **6 to 12 months advance notice** for any versioned API deprecation, allowing engineering ample time to test in `Dev`/`Stage` before cutover.

---

### Focus Area #6: Preview Un-Editable — Discuss Why

#### 1. Specific Details of the Question
* **What ESL is really asking:** During the two-week POC hands-on testing, ESL evaluators noticed that when clicking into certain **Preview** views (or viewing rendered page states), fields were **un-editable** directly on the canvas (or required editing via the structured form/outline panel). They want an honest architectural explanation of **why preview is un-editable in those contexts** and how Visual Builder handles editing vs. previewing.

#### 2. Step-by-Step: How Optimizely Addresses It
1. **Step 1 — Intentional Separation of "Edit Mode" vs. "Pure Preview Mode":**
   * In a decoupled Next.js + SaaS CMS architecture, **Preview Mode** renders the exact, unadulterated production React DOM (without injecting editor DOM wrappers, `contenteditable` attributes, or mutation scripts). This guarantees **100% WYSIWYG fidelity**, accurate responsive viewport testing, and interactive testing of calculators/accordions without accidentally modifying content when clicking a button.
2. **Step 2 — Governed Shared & Computed Components Are Locked by Design:**
   * On pages containing **Shared Content Blocks** (e.g., *Rates at a Glance*, *Eligibility Bar*, *Mandatory NCUA Disclosures* from Use Cases #3 & #5), those fields are **intentionally read-only (un-editable)** at the page level so a page author cannot accidentally overwrite a bank-wide APR rate or legal footnote while editing a local page hero. To edit a shared block, the author clicks into the shared source item (subject to Approver permissions).
3. **Step 3 — How On-Page Editing Works (`data-epi-edit` Annotations in Next.js):**
   * In Visual Builder’s **On-Page Edit Mode**, inline click-to-edit is controlled by lightweight `data-epi-edit="propertyName"` attributes in the Next.js React components. During the rapid 10-day POC build, Oshyn prioritized **Blueprint Form/Outline Editing** for complex composite components to enforce strict Brink design token guardrails (`Use Case #4`), while inline `data-epi-edit` bindings can be enabled on any text/image prop in 1 line of JSX whenever ESL wants direct canvas click-editing.

---

### Focus Area #9: Clarify Figma / Design System Architecture

#### 1. Specific Details of the Question
* **What ESL is really asking:** ESL partnered with **Brink Interactive** to create their Figma Design System. They want to understand the exact architectural pipeline from **Brink’s Figma Tokens & Components → Next.js Code → Optimizely Visual Builder**, and how design updates flow without marketers breaking the brand.

#### 2. Step-by-Step: How Optimizely Addresses It
1. **Step 1 — Figma Design Tokens to Intrinsic CSS Variables:**
   * Brink Interactive’s Figma variables (colors, typography scales, spacing, border radii, surface themes) export directly as W3C Design Tokens JSON into Tailwind CSS / CSS custom properties (`--surface-neutral-3`, `--text-primary`).
2. **Step 2 — 1:1 Component Mapping (Figma Component ↔ CMS Blueprint ↔ React Component):**
   * Every Figma component (e.g., `Hero`, `Snipe CTA`, `Key Facts`, `FAQ`, `Split Content`) maps to:
     1. A **SaaS CMS Content Type / Visual Builder Blueprint** defining the allowed content fields and style choices.
     2. A **React/Next.js Component** styled strictly by Brink tokens.
3. **Step 3 — Governed "Display Settings" Instead of Freeform CSS:**
   * Marketers never pick hex codes or pixel padding in Visual Builder. Instead, Visual Builder exposes **Display Settings** mapped to Brink variants (e.g., `Theme: Light | Dark Fir`, `Layout: 50/50 Split | Full Bleed`). Selecting a setting toggles a CSS token class on the React component—making off-brand pages mathematically impossible.

---

### Focus Area #11: Scalability Notice / Burst Support

#### 1. Specific Details of the Question
* **What ESL is really asking:** When ESL announces its annual **Owners' Dividend** payout, launches a major rate promotion, or experiences regional banking news spikes, traffic can surge 5×–10× in minutes. Does ESL have to notify Optimizely in advance ("scalability notice") to provision servers, and how does burst scaling work?

#### 2. Step-by-Step: How Optimizely Addresses It
1. **Step 1 — Zero Advance Notice Required for Typical Promotional Bursts:**
   * Because Optimizely CMS SaaS, Optimizely Graph, and WebEx run on a cloud-native, auto-scaling architecture fronted by global multi-tenant **Cloudflare CDN Edge**, **no advance notice is required** for marketing campaigns, rate drops, or Owners' Dividend announcements.
2. **Step 2 — Edge-First Caching Absorbs 95%+ of Traffic Surges:**
   * Visitors never hit the CMS authoring database. Next.js Static/ISR pages and Optimizely Graph queries are cached at 300+ global edge PoPs, and WebEx snippet `s3-4775830914596864` evaluates audiences locally in the browser/edge in `<50ms`.
3. **Step 3 — Elastic Auto-Scaling & High-Event Coordination Option:**
   * Behind the CDN, Optimizely Graph and ODP ingestion clusters auto-scale horizontally based on CPU/request telemetry. For massive planned load tests (penetration/stress testing) or 20×+ black-swan events, ESL can optionally notify Support/TAM so engineering can monitor dedicated telemetry—without extra burst-infrastructure fees.

---

### Focus Area #12: Marketplace — Overview Including Breadth of Available Capabilities and Types of Apps

#### 1. Specific Details of the Question
* **What ESL is really asking:** ESL wants to know what pre-built integrations exist in the **Optimizely Marketplace** (`marketplace.optimizely.com` + OCP App Directory) so they aren't building custom point-to-point middleware for every third-party tool in their stack.

#### 2. Step-by-Step: How Optimizely Addresses It
1. **Step 1 — Two Native Extensibility Ecosystems:**
   * **Optimizely Marketplace (CMS / DAM / Experimentation Apps)** and the **Optimizely Connect Platform (OCP) Directory** (100+ pre-built data & lifecycle connectors).
2. **Step 2 — Breadth of App Categories Relevant to ESL:**
   * **CRM & Core Data:** Salesforce, Microsoft Dynamics, HubSpot, Snowflake, Databricks, AWS S3, plus **OCP Webhook/REST SDK** for **Creatio CRM** and **FintechOS**.
   * **Translation & Localization (English ↔ Spanish):** Smartling, Lionbridge, RWS Trados, Translations.com, and Opal AI Translation Agents.
   * **Design & Creative:** Adobe Creative Cloud (Photoshop, Illustrator, InDesign), Figma integrations, Bynder, Aprimo.
   * **Compliance, Accessibility & SEO:** Siteimprove, Monsido, OneTrust, Google Analytics 4 (GA4), Adobe Analytics.
   * **Developer & Search Utilities:** Redirect Manager, Graph Explorer, Vercel/Netlify/Azure DevOps deployment hooks.

---

### FocusAreas #13 & #14: Support for Release Automation Through Azure DevOps (`#13`) + CI/CD Support Across the Platform: Release Management, Branching, and Promotion (`#14`)

#### 1. Specific Details of the Question
* **What ESL is really asking:** ESL’s engineering team standardizes on **Azure DevOps** (Repos + Pipelines). They want a clear walkthrough of:
  1. How **code** branches (`feature/* → dev → staging → main`) build and deploy automatically through Azure DevOps (`#13`).
  2. How **CMS content models, Visual Builder blueprints, and content** promote across the 3 RFP environments (**Development → Staging → Production**) without manual recreation or content freezes (`#14`).

#### 2. Step-by-Step: How Optimizely Addresses It
1. **Step 1 — Decoupling Code CI/CD from Content Publishing:**
   * In Optimizely’s headless architecture, **code deployments** (Next.js frontend) and **content publishing** (SaaS CMS) run on completely independent tracks—meaning marketers publish daily without waiting for a two-week Azure DevOps sprint release.
2. **Step 2 — Schema-as-Code & Content Model Promotion via `@optimizely/cms-cli` (`#14`):**
   * Content types, block schemas, and Visual Builder display templates are defined as version-controlled JSON/TypeScript manifests in the Git repository alongside the Next.js app.
   * When a developer creates a new component on a `feature/*` branch, they test against the **CMS Development** environment.
3. **Step 3 — Automated Azure DevOps Pipeline (`azure-pipelines.yml` — `#13`):**
   * When a Pull Request merges in Azure DevOps (`dev → staging → main`), the **Azure Pipeline** automatically executes four steps:
     1. **Lint, Typecheck & Unit Tests:** Validates the Hexagonal Anti-Corruption Layer (`toLoanHeroModel`) and TypeScript types.
     2. **Schema Promotion (`opti-cms-cli push`):** Authenticates via OAuth Client Credentials and pushes updated CMS content type definitions & Visual Builder blueprints to the target CMS environment (`Dev → Stage → Prod`).
     3. **Graph Sync & Codegen:** Triggers Optimizely Graph schema synchronization and verifies GraphQL fragments.
     4. **Zero-Downtime Frontend Deploy + Automated E2E Tests:** Deploys the Next.js build (to Vercel / Azure App Service) and runs Playwright/Cypress visual + accessibility checks.
4. **Step 4 — Safe Content & Experience Promotion (`#14`):**
   * **Schemas** flow `Dev → Stage → Prod` via Azure DevOps CI/CD.
   * **Content** is authored directly in Production (held in `Draft` / `Ready for Review` states via Use Case #5 workflow and scheduled via Use Case #12 Projects/Releases) OR exported/imported across environments via the CMS Content Migration API.

---

#### 3. How to Update `onsite-breakouts-v2.html` for Breakout 6 (`#2, #6, #9, #11, #12, #13, #14`)
1. **Update `Slide 6.3` ("Live Code Workbench"):**
   * Expand the code block or add a toggleable tab showing both the **Hexagonal ACL + `data-epi-edit` binding (`#6 & #9`)** and the **Azure DevOps CI/CD Pipeline (`#13 & #14`)**.
2. **Add Two Vertical Deep-Dive Slides in Column 6 (`Slide 6.3b` and `Slide 6.3c`):**
   * **`Slide 6.3b` — Azure DevOps CI/CD, Branching & Figma Token Architecture (`#6, #9, #13, #14`):**
     * Left column: 3-tier promotion matrix (`Dev → Stage → Prod`) showing Git branching + `@optimizely/cms-cli` schema sync via Azure DevOps Pipelines (`#13, #14`), Brink Figma token mapping (`#9`), and why Preview isolates the DOM while `data-epi-edit` powers inline editing (`#6`).
     * Right column: `azure-pipelines.yml` snippet showing automated CMS schema promotion + Next.js deploy.
   * **`Slide 6.3c` — Evergreen SaaS Lifecycle, Burst Scale & Marketplace (`#2, #11, #12`):**
     * **Card 1 (#2 Release Cadence & Notice):** Continuous zero-downtime SaaS updates; 0 version upgrades; 6–12 mo API deprecation notice via Trust Center.
     * **Card 2 (#11 Burst Support):** Cloudflare global edge CDN + elastic Graph auto-scaling; 0 advance notice needed for promotional rate spikes.
     * **Card 3 (#12 Marketplace Breadth):** 100+ vetted apps across CRM (Creatio/OCP), Adobe CC, Figma, Smartling/Spanish translation, OneTrust & Siteimprove.

---

## Drop-In HTML Snippets for `onsite-breakouts-v2.html`

Below are the ready-to-paste HTML blocks you can insert directly into `public/onsite-breakouts-v2.html` (every slide stays strictly under the **≤ 40 visible words** HUD rule while packing full step-by-step talking points into `<aside class="notes">`).

### 1. Insert After `Slide 1.3` (Breakout 1 — Focus Area #8: CDP ↔ CRM Flow)

```html
        <!-- Slide 1.3b: Focus Area #8 — Bi-Directional CDP + CRM Flow -->
        <section class="slide-light" data-background-color="#E4F0DA" data-breakout="Breakout 1 • CDP ↔ CRM Flow (#8)">
          <div class="pt-8 flex justify-between items-center">
            <span class="opti-pill bg-[#08251A] text-[#ABFF44]">Focus Area #8 • Architecture Deep Dive</span>
            <span class="font-mono text-xs text-[#08251A]">ODP ↔ Creatio CRM &amp; Snowflake</span>
          </div>

          <div class="my-auto">
            <h2 class="font-heading font-black text-5xl text-[#08251A] mb-6">
              Bi-Directional Flow: CDP + Creatio CRM
            </h2>

            <div class="grid grid-cols-4 gap-4">
              <div class="opti-card-light">
                <div class="font-mono text-xs font-bold text-[#197050]">1. INBOUND CRM</div>
                <div class="font-heading font-black text-2xl text-[#08251A] mt-1">Creatio &rarr; ODP</div>
                <p class="text-xs text-[#0D3A29] mt-2">Sync member tier, branch ID &amp; loan eligibility via OCP.</p>
              </div>

              <div class="opti-card-green">
                <div class="font-mono text-xs font-bold text-[#08251A]">2. IDENTITY GRAPH</div>
                <div class="font-heading font-black text-2xl text-[#08251A] mt-1">Zero-PII Stitch</div>
                <p class="text-xs text-[#08251A] mt-2">Merge anonymous web <code>vuid</code> with hashed member ID.</p>
              </div>

              <div class="opti-card-light">
                <div class="font-mono text-xs font-bold text-[#007B79]">3. EDGE ACTIVATION</div>
                <div class="font-heading font-black text-2xl text-[#08251A] mt-1">&lt;50ms WebEx</div>
                <p class="text-xs text-[#0D3A29] mt-2">Qualify Member vs. Prospect live on <code>/personal/loans</code>.</p>
              </div>

              <div class="opti-card-blue">
                <div class="font-mono text-xs font-bold text-[#08251A]">4. OUTBOUND LEAD</div>
                <div class="font-heading font-black text-2xl text-[#08251A] mt-1">ODP &rarr; Creatio</div>
                <p class="text-xs text-[#08251A] mt-2">High-intent loan abandonment triggers advisor follow-up.</p>
              </div>
            </div>
          </div>

          <div class="font-mono text-xs text-[#08251A]">
            Zero sensitive banking PII stored in browser DOM or cookies.
          </div>

          <aside class="notes">
            <h4>[FOCUS AREA #8: CRM — INFORMATION FLOW BETWEEN CDP + CRM]</h4>
            <ol>
              <li><strong>Inbound (Creatio CRM / Snowflake &rarr; ODP):</strong> Using Optimizely Connect Platform (OCP) REST webhooks or nightly Snowflake sync, Creatio pushes non-PII attributes (<code>member_status</code>, <code>assigned_branch</code>, <code>prequalified_tier</code>) into ODP.</li>
              <li><strong>Zero-PII Identity Stitch:</strong> When a visitor signs in at <code>/sign-in</code> (<code>esl_signed_in=1</code>), ODP stitches their anonymous browsing behavior (<code>/personal/loans</code> calculator usage) to their known Member ID in under 50ms.</li>
              <li><strong>Outbound (ODP &rarr; Creatio CRM):</strong> If an authenticated member interacts with the Personal Loan calculator and clicks "Start Application" without completing the FintechOS flow within 2 hours, ODP fires a real-time webhook back to Creatio CRM—routing a warm lead directly to their branch advisor.</li>
            </ol>
          </aside>
        </section>
```

---

### 2. Insert After `Slide 2.3` (Breakout 2 — Focus Area #7: Cookie Consent Management & Live Demo)

```html
        <!-- Slide 2.3b: Focus Area #7 — Cookie Consent Management & Live Demo -->
        <section class="slide-light" data-background-color="#E4F0DA" data-breakout="Breakout 2 • Consent Management (#7)">
          <div class="pt-8 flex justify-between items-center">
            <span class="opti-pill bg-[#08251A] text-[#ABFF44]">Focus Area #7 • Privacy &amp; Consent Demo</span>
            <span class="font-mono text-xs text-[#08251A]">Native SDK Enforcement + CMP Hooks</span>
          </div>

          <div class="my-auto grid grid-cols-12 gap-6 items-center">
            <div class="col-span-5 space-y-3">
              <h2 class="font-heading font-black text-4xl text-[#08251A]">
                Native Consent Enforcement &amp; Safe Fallback.
              </h2>
              <div class="opti-card-green">
                <div class="font-heading font-bold text-lg text-[#08251A]">100% Consent-Safe</div>
                <p class="text-xs text-[#08251A] mt-1">
                  Suppresses cookies until opt-in; opted-out visitors safely render default content.
                </p>
              </div>
            </div>

            <div class="col-span-7">
              <pre><code class="language-javascript" data-trim data-noescape>
// 1. Native WebEx + ODP Consent Enforcement (OneTrust / Custom CMP)
window.optimizely = window.optimizely || [];
if (!userGrantedAnalyticsConsent) {
  // Suppresses tracking cookies &amp; logx telemetry until explicit opt-in
  window.optimizely.push(["optOut", { isOptOut: true }]);
  zaius.consent({ action: "opt_out" });
}
// 2. First-party session state (esl_signed_in=1) still renders safely!
              </code></pre>
            </div>
          </div>

          <div class="font-mono text-xs text-[#08251A]">
            Live Demo: Open DevTools on /personal/loans &rarr; toggle optOut &rarr; verify zero tracking &amp; clean fallback.
          </div>

          <aside class="notes">
            <h4>[FOCUS AREA #7: COOKIE CONSENT MANAGEMENT — CLARIFY &amp; LIVE DEMO]</h4>
            <ul>
              <li><strong>Clarification:</strong> Optimizely provides <strong>native consent enforcement APIs</strong> inside both the WebEx snippet (<code>s3-4775830914596864</code>) and ODP SDK, designed to bind directly to enterprise CMP banners (OneTrust <code>OptanonWrapper</code>, Cookiebot, TrustArc) or ESL's custom consent banner.</li>
              <li><strong>Step-by-Step Live Demo (2 Mins):</strong>
                <ol>
                  <li>Open <code>https://esl-onsite.optimoey.com/personal/loans</code> and open Chrome DevTools (<strong>Application &rarr; Cookies</strong> + <strong>Console</strong>).</li>
                  <li>Run <code>window.optimizely.push(["optOut", { isOptOut: true }])</code> in the Console.</li>
                  <li>Show that persistent tracking cookies and outbound <code>logx.optimizely.com</code> event dispatches stop immediately, while the visitor still receives a zero-flicker governed experience.</li>
                </ol>
              </li>
            </ul>
          </aside>
        </section>
```

---

### 3. Insert After `Slide 4.3` (Breakout 4 — Focus Area #4: AI BYOM & Agentic Future)

```html
        <!-- Slide 4.3b: Focus Area #4 — Opal AI BYOM & Agentic Future -->
        <section class="slide-light" data-background-color="#E4F0DA" data-breakout="Breakout 4 • AI BYOM & Agentic Future (#4)">
          <div class="pt-8 flex justify-between items-center">
            <span class="opti-pill bg-[#08251A] text-[#ABFF44]">Focus Area #4 • AI Architecture &amp; Roadmap</span>
            <span class="font-mono text-xs text-[#08251A]">Model Flexibility (BYOM) + Governed Agents</span>
          </div>

          <div class="my-auto">
            <h2 class="font-heading font-black text-5xl text-[#08251A] mb-6">
              Opal AI: Model-Agnostic Today. Agentic Tomorrow.
            </h2>

            <div class="grid grid-cols-3 gap-6">
              <div class="opti-card-light">
                <span class="material-symbols-rounded text-[#197050]">hub</span>
                <div class="font-heading font-black text-2xl text-[#08251A] mt-2">1. Pluggable BYOM</div>
                <p class="text-xs text-[#0D3A29] mt-2">Connect Azure OpenAI, Gemini, Claude, or custom ESL endpoints. Zero model training.</p>
              </div>

              <div class="opti-card-green">
                <span class="material-symbols-rounded text-[#08251A]">smart_toy</span>
                <div class="font-heading font-black text-2xl text-[#08251A] mt-2">2. Specialized Agents</div>
                <p class="text-xs text-[#08251A] mt-2">Automated DAM tagging, WCAG alt-text, Spanish translation &amp; NCUA compliance checks.</p>
              </div>

              <div class="opti-card-blue">
                <span class="material-symbols-rounded text-[#08251A]">account_tree</span>
                <div class="font-heading font-black text-2xl text-[#08251A] mt-2">3. Agentic Workflows</div>
                <p class="text-xs text-[#08251A] mt-2">Multi-step agents draft pages &amp; tests; human Approvers retain publish lock.</p>
              </div>
            </div>
          </div>

          <div class="font-mono text-xs text-[#08251A]">
            Live in POC Today: Opal WebEx Variation 4520294755336192 + DAM Auto-Tagging (Use Case #10).
          </div>

          <aside class="notes">
            <h4>[FOCUS AREA #4: AI — FLEXIBILITY OF MODELS (BYOM) &amp; AGENTIC FUTURE]</h4>
            <ul>
              <li><strong>Model Flexibility (BYOM):</strong> Optimizely Opal is an orchestration gateway, not locked to one LLM. Out-of-the-box it leverages enterprise Gemini/OpenAI/Claude models, and via <strong>BYOM / Custom Agent Tools</strong>, ESL can route requests to private Azure OpenAI or internal credit-union models. Zero ESL data ever trains public models.</li>
              <li><strong>Preparation for the Agentic Future:</strong>
                <ul>
                  <li><em>Level 1 (Assistive — Live in POC):</em> Inline copy generation (Owners' Dividend <code>4520294755336192</code>) and DAM WCAG alt-text.</li>
                  <li><em>Level 2 (Specialized Agents):</em> Domain-specific agents enforcing ESL's brand kit, financial terminology, and regulatory disclosure checklists.</li>
                  <li><em>Level 3 (Multi-Step Workflow Agents):</em> Autonomous agent chains that take a campaign brief, pull approved DAM assets, assemble a Visual Builder draft, configure an A/B test, and route to ESL Compliance for human sign-off.</li>
                </ul>
              </li>
            </ul>
          </aside>
        </section>
```

---

### 4. Insert After `Slide 5.3` (Breakout 5 — Focus Areas #5, #10, #15, #16)

```html
        <!-- Slide 5.3b: Focus Areas #5, #10, #15 — Hierarchy, Graph Search & Redirects -->
        <section class="slide-light" data-background-color="#E4F0DA" data-breakout="Breakout 5 • Hierarchy, Search & Redirects (#5, #10, #15)">
          <div class="pt-8 flex justify-between items-center">
            <span class="opti-pill bg-[#08251A] text-[#ABFF44]">Focus Areas #5, #10 &amp; #15 • Architecture &amp; Discovery</span>
            <span class="font-mono text-xs text-[#08251A]">Tree Hierarchy + Graph Search + Edge Redirects</span>
          </div>

          <div class="my-auto">
            <h2 class="font-heading font-black text-5xl text-[#08251A] mb-6">
              Structured Hierarchy. Semantic Search. Zero-Code Redirects.
            </h2>

            <div class="grid grid-cols-3 gap-6">
              <div class="opti-card-light">
                <div class="font-mono text-xs font-bold text-[#197050]">#5 • HIERARCHY + TAXONOMY</div>
                <div class="font-heading font-black text-2xl text-[#08251A] mt-1">Best of Both Worlds</div>
                <p class="text-xs text-[#0D3A29] mt-2">Tree hierarchy drives URLs, breadcrumbs &amp; RBAC inheritance; taxonomy tags power dynamic Graph slots.</p>
              </div>

              <div class="opti-card-green">
                <div class="font-mono text-xs font-bold text-[#08251A]">#10 • LIVE SEARCH ENGINE</div>
                <div class="font-heading font-black text-2xl text-[#08251A] mt-1">Optimizely Graph</div>
                <p class="text-xs text-[#08251A] mt-2">Full-text + semantic vector search, banking synonyms (<code>HELOC &leftrightarrow; Home Equity</code>) &amp; pinned results.</p>
              </div>

              <div class="opti-card-blue">
                <div class="font-mono text-xs font-bold text-[#08251A]">#15 • REDIRECT TOOLING</div>
                <div class="font-heading font-black text-2xl text-[#08251A] mt-1">Self-Service 301/302</div>
                <p class="text-xs text-[#08251A] mt-2">Auto-redirect on slug move, bulk CSV import &amp; vanity URLs evaluated at the Next.js edge.</p>
              </div>
            </div>
          </div>

          <div class="font-mono text-xs text-[#08251A]">
            Live Demo: Run semantic query + synonym match in Optimizely Graph Explorer.
          </div>

          <aside class="notes">
            <h4>[STEP-BY-STEP ANSWERS FOR #5, #10, AND #15]</h4>
            <ul>
              <li><strong>#5 Hierarchy vs. Taxonomy:</strong> Flat taxonomy-only CMSs turn 500 pages into an unmanageable bucket where authors can't see site structure or inherit folder permissions. Optimizely gives ESL a <strong>visual Content Tree Hierarchy</strong> (driving deterministic URL routing, breadcrumbs, and folder-level RBAC inheritance) <em>plus</em> <strong>structured Taxonomy tags</strong> on shared blocks and DAM assets for dynamic Graph querying.</li>
              <li><strong>#10 Search Engine Demo:</strong> Powered natively by <strong>Optimizely Graph</strong>—no third-party search server required. Demo live: (1) Semantic + <code>_fulltext</code> query for <em>"debt consolidation"</em> returning Personal Loans, (2) Synonym expansion (<code>HELOC = Home Equity Line</code>), and (3) Pinned/Promoted Best Bets.</li>
              <li><strong>#15 Redirect Tooling:</strong> (1) Moving/renaming a page in the Hierarchy auto-generates route mappings, (2) Marketers manage 301/302, regex, and vanity URLs (<code>esl.org/dividend</code>) with Bulk CSV import for migration, and (3) Next.js Edge Middleware executes redirects in <code>&lt;5ms</code> with loop detection.</li>
            </ul>
          </aside>
        </section>

        <!-- Slide 5.3c: Focus Area #16 — Central Security & Access Control Across Portfolio -->
        <section data-background-color="#08251A" data-breakout="Breakout 5 • Portfolio Security & RBAC (#16)">
          <div class="pt-8 flex justify-between items-center">
            <span class="opti-pill bg-[#ABFF44] text-[#08251A]">Focus Area #16 • Enterprise Security &amp; RBAC</span>
            <span class="font-mono text-xs text-[#91DBDA]">Opti ID + Microsoft Entra ID (SSO &amp; SCIM 2.0)</span>
          </div>

          <div class="my-auto">
            <h2 class="font-heading font-black text-5xl text-white mb-6">
              Central Access Control Across All 59 ESL Seats.
            </h2>

            <div class="grid grid-cols-3 gap-6">
              <div class="opti-card-dark border-t-4 border-t-[#ABFF44]">
                <div class="font-mono text-xs text-[#ABFF44]">LAYER 1 • IDENTITY</div>
                <div class="font-heading font-black text-2xl text-white mt-1">Microsoft Entra ID</div>
                <p class="text-sm text-[#E4F0DA] mt-2">SAML 2.0 / OIDC SSO + SCIM 2.0 auto-provisioning &amp; instant offboarding.</p>
              </div>

              <div class="opti-card-green">
                <div class="font-mono text-xs text-[#08251A]">LAYER 2 • CONTROL PLANE</div>
                <div class="font-heading font-black text-2xl text-[#08251A] mt-1">Opti ID Admin Center</div>
                <p class="text-sm text-[#08251A] mt-2">Single role matrix spanning CMS, DAM, WebEx, ODP &amp; Opal AI.</p>
              </div>

              <div class="opti-card-dark border-t-4 border-t-[#91DBDA]">
                <div class="font-mono text-xs text-[#91DBDA]">LAYER 3 • CONTENT ACLs</div>
                <div class="font-heading font-black text-2xl text-white mt-1">Tree Inheritance</div>
                <p class="text-sm text-[#E4F0DA] mt-2">Enforces Author &rarr; Approver &rarr; Publisher separation down to folder/block level.</p>
              </div>
            </div>
          </div>

          <div class="font-mono text-xs text-[#91DBDA]">
            RFP Sizing Mapped: 17 SysAdmins • 26 Content Admins • 10 Marcom • 3 Mktg Ops • 3 Digital Engagement.
          </div>

          <aside class="notes">
            <h4>[FOCUS AREA #16: CENTRAL SECURITY ACCESS CONTROL ACROSS PORTFOLIO]</h4>
            <ul>
              <li><strong>Single Control Plane (Opti ID):</strong> IT never manages separate user lists across CMS, DAM, WebEx, and ODP. All 59 ESL seats authenticate through <strong>Opti ID</strong> integrated with <strong>Microsoft Entra ID</strong>.</li>
              <li><strong>Automated SCIM 2.0 Lifecycle:</strong> Mapping Entra ID groups (e.g., <code>ESL-Marcom-Authors</code>, <code>ESL-Compliance-Approvers</code>) automatically assigns product entitlements and CMS tree permissions. Disabling a user in Entra revokes access across the entire portfolio immediately.</li>
            </ul>
          </aside>
        </section>
```

---

### 5. Insert After `Slide 6.3` (Breakout 6 — Focus Areas #2, #6, #9, #11, #12, #13, #14)

```html
        <!-- Slide 6.3b: Focus Areas #6, #9, #13, #14 — CI/CD, Figma Tokens & Preview Architecture -->
        <section data-background-color="#08251A" data-breakout="Breakout 6 • Azure DevOps CI/CD & Design System (#6, #9, #13, #14)">
          <div class="pt-8 flex justify-between items-center">
            <span class="opti-pill bg-[#ABFF44] text-[#08251A]">Focus Areas #6, #9, #13 &amp; #14 • Engineering Deep Dive</span>
            <span class="font-mono text-xs text-[#91DBDA]">Azure DevOps + 3-Tier Promotion + Brink Figma Tokens</span>
          </div>

          <div class="my-auto grid grid-cols-12 gap-6 items-center">
            <div class="col-span-5 space-y-3">
              <div class="opti-card-dark">
                <div class="font-mono text-xs text-[#ABFF44]">#9 FIGMA &amp; #6 PREVIEW</div>
                <p class="text-xs text-[#E4F0DA] mt-1">Brink Figma tokens map to React props. Preview isolates DOM; <code>data-epi-edit</code> unlocks inline edit; shared blocks stay locked.</p>
              </div>
              <div class="opti-card-green">
                <div class="font-mono text-xs text-[#08251A]">#13 AZURE DEVOPS &amp; #14 CI/CD</div>
                <p class="text-xs text-[#08251A] mt-1">Git branches promote schemas (<code>Dev &rarr; Stage &rarr; Prod</code>) via <code>@optimizely/cms-cli</code>.</p>
              </div>
            </div>

            <div class="col-span-7">
              <pre><code class="language-yaml" data-trim data-noescape>
# azure-pipelines.yml — Focus Areas #13 &amp; #14 (Dev &rarr; Stage &rarr; Prod)
trigger: [ main, staging, dev ]
steps:
  - script: npm run test:acl &amp;&amp; npm run build
    displayName: '1. Validate Hexagonal ACL &amp; Brink Design Tokens (#9)'
  - script: npx @optimizely/cms-cli schema push --env $(TARGET_ENV)
    displayName: '2. Promote CMS Content Types &amp; Blueprints (#14)'
  - script: npx playwright test --grep "@wcag-and-preview"
    displayName: '3. Verify Zero-CLS Edge &amp; Governance Guardrails'
              </code></pre>
            </div>
          </div>

          <div class="font-mono text-xs text-[#91DBDA]">
            Code releases and CMS content publishing run on 100% decoupled tracks.
          </div>

          <aside class="notes">
            <h4>[STEP-BY-STEP ANSWERS FOR #6, #9, #13, AND #14]</h4>
            <ul>
              <li><strong>#6 Why Preview Is Un-Editable:</strong>
                <ol>
                  <li><em>Pure Preview Isolation:</em> Preview mode renders the exact production React DOM without editor wrapper scripts so authors can test interactive calculators and responsive breakpoints accurately.</li>
                  <li><em>Shared Block Governance:</em> Shared components (Rates at a Glance, Eligibility Bar, NCUA Disclosures) are intentionally read-only at the page level so an author cannot accidentally overwrite bank-wide rates.</li>
                  <li><em>Inline Edit vs. Form Edit:</em> On-page editing uses <code>data-epi-edit="fieldName"</code> in JSX, whereas the POC intentionally locked structural props into Blueprint forms to protect Brink design tokens.</li>
                </ol>
              </li>
              <li><strong>#9 Figma / Design System Architecture:</strong> Brink Interactive's Figma variables export to CSS custom properties/Tailwind tokens. Visual Builder Blueprints expose governed <em>Display Settings</em> (never raw hex/pixel inputs) mapped 1:1 to React component props.</li>
              <li><strong>#13 &amp; #14 Azure DevOps &amp; CI/CD Promotion:</strong> Content schemas live as JSON-as-Code in Git. Merging a PR in Azure DevOps runs <code>@optimizely/cms-cli</code> to promote schemas across <code>Dev &rarr; Stage &rarr; Prod</code> automatically while content authors publish independently.</li>
            </ul>
          </aside>
        </section>

        <!-- Slide 6.3c: Focus Areas #2, #11, #12 — Release Cadence, Burst Scale & Marketplace -->
        <section class="slide-light" data-background-color="#E4F0DA" data-breakout="Breakout 6 • SaaS Lifecycle, Scale & Marketplace (#2, #11, #12)">
          <div class="pt-8 flex justify-between items-center">
            <span class="opti-pill bg-[#08251A] text-[#ABFF44]">Focus Areas #2, #11 &amp; #12 • Platform Operations</span>
            <span class="font-mono text-xs text-[#08251A]">Evergreen SaaS • Elastic Edge • 100+ Apps</span>
          </div>

          <div class="my-auto">
            <h2 class="font-heading font-black text-5xl text-[#08251A] mb-6">
              Zero Upgrades. Elastic Burst Scale. Open Ecosystem.
            </h2>

            <div class="grid grid-cols-3 gap-6">
              <div class="opti-card-light">
                <div class="font-mono text-xs font-bold text-[#197050]">#2 • RELEASE CADENCE</div>
                <div class="font-heading font-black text-2xl text-[#08251A] mt-1">Evergreen SaaS</div>
                <p class="text-xs text-[#0D3A29] mt-2">Continuous zero-downtime releases; zero version upgrades; 6–12 mo API deprecation notice.</p>
              </div>

              <div class="opti-card-green">
                <div class="font-mono text-xs font-bold text-[#08251A]">#11 • BURST SUPPORT</div>
                <div class="font-heading font-black text-2xl text-[#08251A] mt-1">Auto-Scaling Edge</div>
                <p class="text-xs text-[#08251A] mt-2">Cloudflare CDN + elastic Graph clusters absorb Owners' Dividend spikes with 0 advance notice.</p>
              </div>

              <div class="opti-card-blue">
                <div class="font-mono text-xs font-bold text-[#08251A]">#12 • MARKETPLACE</div>
                <div class="font-heading font-black text-2xl text-[#08251A] mt-1">100+ Vetted Apps</div>
                <p class="text-xs text-[#08251A] mt-2">Turnkey connectors for CRM (Creatio/OCP), Adobe CC, Figma, Smartling, OneTrust &amp; GA4.</p>
              </div>
            </div>
          </div>

          <div class="font-mono text-xs text-[#08251A]">
            99.99% Enterprise SLA • Status &amp; release subscriptions at status.optimizely.com.
          </div>

          <aside class="notes">
            <h4>[STEP-BY-STEP ANSWERS FOR #2, #11, AND #12]</h4>
            <ul>
              <li><strong>#2 Release Cadence &amp; Notice:</strong> Continuous weekly/bi-weekly backward-compatible releases with zero downtime. Big-bang version upgrades are eliminated forever. Monthly release notes + Trust Center alerts + 6–12 months advance deprecation notice on versioned APIs.</li>
              <li><strong>#11 Scalability Notice / Burst Support:</strong> No advance notice is required for promotional bursts or rate announcements. Global Cloudflare CDN caches Graph queries and Next.js routes at the edge, while Kubernetes/Azure clusters auto-scale horizontally.</li>
              <li><strong>#12 Marketplace Overview:</strong> Spans 6 core categories: (1) CRM &amp; Data (OCP connectors for Creatio, Salesforce, Snowflake), (2) Localization (Smartling, Lionbridge, Opal AI), (3) Creative/Design (Adobe CC, Figma), (4) Compliance &amp; Privacy (OneTrust, Siteimprove), (5) Analytics (GA4, Adobe), and (6) Dev/Ops utilities (Redirect Manager, Azure DevOps).</li>
            </ul>
          </aside>
        </section>
```

# ESL Onsite: 16 Focus Areas & Agenda Alignment Matrix

**Document Purpose:** Operational mapping of ESL Federal Credit Union's 16 specific onsite technical and architectural focus areas to the two-day onsite agenda, designating presenters, timing, and talking points.  
**Audience:** Optimizely Account & Solutions Engineering Team, Oshyn Systems Architecture Leads.  
**Context:** ESL Federal Credit Union DXP RFP Onsite Evaluation (coordinated by Alacrity Partners).

---

## 1. Executive Master Mapping Matrix

| # | Focus Area | Agenda Slot | Lead Role | Technical Positioning & Demonstration Strategy |
|---|---|---|---|---|
| **1** | **Support team resource structure** | **Day 2: Implementation & CS**<br>*(11:30 AM – 12:10 PM)* | Services / CS Lead | • Detail Optimizely Tier 1–3 support architecture, 24/7/365 follow-the-sun severity escalation, dedicated Technical Account Manager (TAM) / Customer Success Manager (CSM), and Oshyn’s post-launch hypercare and tier-1 operational handoff model. |
| **2** | **Release cadence and notice** | **Day 2: Breakout 6 (SDLC)**<br>*(10:30 AM – 11:00 AM)* | Solutions Architect | • Continuous, backward-compatible evergreen updates (SaaS). Zero disruptive version upgrades (contrast with legacy CMS upgrades). Minimum 6–12 months advance warning for API deprecations published via Optimizely Trust Center and status alerts. |
| **3** | **Training program + resources** | **Day 2: Implementation & CS**<br>*(11:30 AM – 12:10 PM)* | Services / CS Lead | • Optimizely Academy certification tracks (Visual Builder Marketer, Content Author, Developer), role-based onboarding sprints (Authors, Approvers, Admins), and tailored Oshyn train-the-trainer workshops. |
| **4** | **AI – flexibility of models (BYOM); preparation for agentic future** | **Day 2: Product Roadmap**<br>*(12:10 PM – 12:35 PM)* & **All Breakouts** | Solutions Architect | • **Opal Architecture:** Pluggable LLM foundation (OpenAI, Anthropic, Gemini, Azure OpenAI).<br>• **Enterprise BYOM / Private Endpoints:** Direct connection to private enterprise AI models via secure API gateways.<br>• **Agentic Future:** Transition from one-off generative prompts to multi-step agentic workflows (autonomous research, asset ingestion, automated compliance checks, variant generation). |
| **5** | **Hierarchy vs. Taxonomy – choice of hierarchy and advantages over taxonomy** | **Day 2: Breakout 5 (Governance)**<br>*(10:00 AM – 10:30 AM)* | Solutions Architect | • Optimizely delivers **both**: a semantic content tree (hierarchy) providing intuitive URL routing, editorial access boundaries, and role-based folder inheritance, combined with flat metadata tags & categories (taxonomy) for decoupled query filtering via Optimizely Graph. Marketers get predictable editorial wayfinding, while developers get decoupled Graph querying. |
| **6** | **Preview un-editable – discuss why** | **Day 2: Breakout 6 (SDLC)**<br>*(10:30 AM – 11:00 AM)* | Solutions Architect | • Clarify why standard preview mode isolates the render frame: prevents accidental touch-event corruption, ensures accurate responsive device emulation, and preserves CSR/SSR hydration boundaries.<br>• Contrast with **Visual Builder on-page editing mode**, which injects direct inline content-editing overlays into headless components when authoring. |
| **7** | **Cookie consent management – clarify native support & demo** | **Day 1: Breakout 2 (Personalization)**<br>*(3:00 PM – 4:00 PM)* | Solutions Architect | • Optimizely Web Experimentation & ODP integrate with Tier-1 CMPs (OneTrust, Cookiebot, TrustArc). Native SDK hooks (`optimizely.push("optOut")` / consent listeners) suppress tracking scripts and anonymous cookie dropping until explicit opt-in is granted. Show how ODP respects consent flags prior to profile stitch. |
| **8** | **CRM – information flow between CDP + CRM** | **Day 1: Breakout 1 (ODP / CDP)**<br>*(2:00 PM – 3:00 PM)* | Solutions Architect | • Bi-directional data pipelines between **ODP and Creatio CRM**:<br>1. *Inbound to ODP:* Member lifecycle stage, credit score tier, and branch association synced via batch/webhook.<br>2. *Outbound from ODP:* Real-time web engagement scores, high-intent loan drops, and segment membership pushed to Creatio for branch advisor outreach. |
| **9** | **Clarify Figma / Design system architecture** | **Day 2: Breakout 6 (SDLC)**<br>*(10:30 AM – 11:00 AM)* | Solutions Architect / Oshyn | • Map Brink Interactive's Figma design tokens (colors, typography, grid, spacing) to Tailwind/CSS variables and React component props.<br>• Show how CMS Visual Builder blueprints lock down typography and layouts so authors cannot produce off-brand or non-compliant design drift. |
| **10** | **Search Engine – demo search engine** | **Day 2: Breakout 5 (Governance)**<br>*(10:00 AM – 10:30 AM)* & **Exec Demo** | Solutions Architect | • Demo **Optimizely Graph semantic search**:<br>• Full-text search across credit union products, natural language semantic filtering (e.g., "auto loan refinancing"), synonym definitions (HELOC ↔ home equity line), and promoted search results in the live Next.js front end. |
| **11** | **Scalability notice / burst support** | **Day 2: Breakout 6 (SDLC)**<br>*(10:30 AM – 11:00 AM)* | Solutions Architect | • Cloud-native multi-tenant SaaS architecture on Microsoft Azure backed by global multi-CDN edge caching (Cloudflare/Fastly). High-volume promotional bursts (e.g., rate change announcements or community dividend days) are absorbed at the edge with automatic auto-scaling Graph clusters. No manual pre-warming required for typical traffic surges. |
| **12** | **Marketplace – overview of breadth & app types** | **Day 2: Breakout 6 (SDLC)**<br>*(10:30 AM – 11:00 AM)* | Solutions Architect | • Highlight Optimizely Marketplace ecosystem: 100+ vetted apps and connectors across DAM (Bynder, Aprimo, native), Form providers, Translation (Translations.com, Lionbridge), Analytics, CDPs, and Marketing Automation. |
| **13** | **Support for release automation through Azure DevOps** | **Day 2: Breakout 6 (SDLC)**<br>*(10:30 AM – 11:00 AM)* | Solutions Architect / Oshyn | • Headless architecture decouples front-end releases from CMS content. Demonstrate Azure DevOps pipelines compiling Next.js code, running Cypress/Playwright regression suites, and pushing zero-downtime artifacts to hosting (Vercel/Azure) using webhook triggers. |
| **14** | **CI/CD support: release management, branching, and promotion** | **Day 2: Breakout 6 (SDLC)**<br>*(10:30 AM – 11:00 AM)* | Solutions Architect / Oshyn | • **Code:** Git branching strategy (Feature → `dev` → `staging` → `main`) via CI/CD pipelines.<br>• **Content & Schemas:** Three-tier CMS environment model (Dev, Stage, Prod). Content type schema sync and environment synchronization APIs. Content authoring proceeds independently of software releases. |
| **15** | **Redirect Tooling / Widget / Approach** | **Day 2: Breakout 5 (Governance)**<br>*(10:00 AM – 10:30 AM)* | Solutions Architect | • Demo Optimizely URL Redirect Management / Rules Engine: 301/302 regex mapping, vanity short-URLs for marketing campaigns, bulk CSV upload/export, and automatic redirect generation when page slugs/routes are modified to preserve SEO equity. |
| **16** | **Security – central management of access control (RBAC)** | **Day 2: Breakout 5 (Governance)**<br>*(10:00 AM – 10:30 AM)* | Solutions Architect | • Show **Opti ID** central administration: Microsoft Entra ID (Azure AD) SSO integration, SCIM auto-provisioning/deprovisioning, and role-based access control (RBAC) across CMS, DAM, WebEx, and Graph with strict separation of duties (Author vs. Reviewer vs. Publisher). |

---

## 2. Chronological Session Distribution

### Day 1: Afternoon Technical Breakouts
* **2:00 PM – 3:00 PM | Breakout 1: ODP / Customer Data Platform**
  * **Focus Item #8:** CRM (Bi-directional information flow between ODP and Creatio CRM)
* **3:00 PM – 4:00 PM | Breakout 2: Personalization**
  * **Focus Item #7:** Cookie consent management (Integration with OneTrust / native SDK controls)
* **4:00 PM – 5:00 PM | Breakout 3: Experimentation**
  * Live A/B testing, Multi-Armed Bandits (MAB), and Stats Engine statistical rigor.

---

### Day 2: Morning Operations, Governance & Commercials
* **9:00 AM – 10:00 AM | Breakout 4: Digital Asset Management (DAM)**
  * Adobe Creative Cloud connector, brand governance, and AI auto-tagging.
* **10:00 AM – 10:30 AM | Breakout 5: Governance & Compliance**
  * **Focus Item #5:** Hierarchy vs. Taxonomy architectural advantages
  * **Focus Item #10:** Search Engine demonstration (Optimizely Graph semantic search)
  * **Focus Item #15:** Redirect Tooling, vanity URLs, and automated alias management
  * **Focus Item #16:** Central security, RBAC, and Entra ID SSO via Opti ID
* **10:30 AM – 11:00 AM | Breakout 6: Product Lifecycle + SDLC**
  * **Focus Item #2:** Evergreen release cadence and notice windows
  * **Focus Item #6:** Preview un-editable rationale (hydration safety vs. Visual Builder live editing)
  * **Focus Item #9:** Figma design system architecture & Brink token mapping
  * **Focus Item #11:** Scalability notice and multi-tenant burst absorption
  * **Focus Item #12:** Optimizely Marketplace ecosystem & app catalog
  * **Focus Item #13:** Release automation via Azure DevOps
  * **Focus Item #14:** CI/CD branching, promotion, and content sync across environments
* **11:00 AM – 11:30 AM | Pricing Discussion**
  * Commercial clarity, zero-integration tax, and predictable licensing.
* **11:30 AM – 12:10 PM | Implementation + Customer Success**
  * **Focus Item #1:** Support team resource structure (Tier 1–3, 24/7/365, TAM/CSM)
  * **Focus Item #3:** Training programs, Optimizely Academy certification, and enablement sprints
* **12:10 PM – 12:35 PM | Product Roadmap (Working Lunch)**
  * **Focus Item #4:** AI flexibility (BYOM, private models) and agentic workflows (Opal roadmap)
* **12:35 PM – 1:00 PM | Vendor Pitch Time (Working Lunch)**
  * The Challenger Vision: Evolving ESL from a static catalog to an Intent-Driven Member Concierge.

---

### Day 2: Executive Finale
* **1:00 PM – 1:40 PM | Orals Presentation**
  * Executive overview, financial stability, credit union alignment, and "The Two-Week Proof."
* **1:40 PM – 2:40 PM | PoC Demo + Closing Thoughts**
  * Uninterrupted 60-minute 4-Act Executive Demo synthesizing all 14 POC use cases and live extended capabilities on `esl-onsite.optimoey.com`.

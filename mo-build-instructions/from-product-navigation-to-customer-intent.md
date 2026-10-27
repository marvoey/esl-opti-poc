# From Product Navigation to Customer Intent

A step-by-step digital experience and AI transformation strategy for ESL Federal Credit Union

The goal is to transform ESL.org from a website that primarily helps people find financial products into an experience that helps people accomplish financial goals.

This is not primarily an AI chatbot project or a CMS redesign. It's a transformation of how ESL understands customer needs, guides decisions, connects systems, and measures business outcomes.

I would approach it in 10 steps, beginning with one measurable customer journey rather than attempting to redesign the entire website.

## The transformation

Current model

Product-driven

Homepage

Borrow → Mortgages

Compare products

Apply

Customer must translate their goal into ESL's product taxonomy.

Target model

Intent-driven

"I want to buy a home"

Understand situation

Guide options and tradeoffs

Take next action

ESL translates the customer's goal into relevant products, services, and actions.

## Phase 1 — Discover and prioritize

## Step 1. Establish the business outcomes

Start with business strategy, not technology selection.

Interview ESL's leaders across digital banking, marketing, lending, deposits, member services, compliance, and IT.

Determine whether the primary objective is acquiring more members, growing deposits, increasing funded loans, improving cross-sell, or lowering service costs.

Deliverable: A business outcome scorecard with baseline metrics and accountable owners.

## Step 2. Discover what members are trying to accomplish

Analyze on-site search, organic search queries, contact-center conversations, chatbot logs, branch feedback, customer interviews, and abandonment points, subject to privacy and data-use controls.

Identify the goals behind product searches. For example, "mortgage rates" may reflect a desire to buy a first home, refinance, or understand affordability.

Group those signals into an intent taxonomy rather than immediately mapping them to existing product categories.

Deliverable: A ranked inventory of customer intents, supported by actual research.

Example intent taxonomy

| Customer intent             | Potential ESL services                    |
| --------------------------- | ----------------------------------------- |
| Buy my first home           | Mortgage, education, affordability tools  |
| Reduce monthly payments     | Refinancing, debt management              |
| Make my savings work harder | Savings, certificates, advisory referral  |
| Start a business            | Business checking, financing, specialists |
| Manage my existing accounts | Digital banking, support, self-service    |

Illustrative taxonomy to validate with ESL member research.

## Step 3. Map the end-to-end customer journeys

For each high-value intent, map the complete journey from the first question through application, approval, funding, and ongoing relationship.

Identify where the member must leave ESL.org, repeat information, contact a representative, or interpret unfamiliar financial terminology.

Map the supporting systems: CMS, analytics, CRM, identity, loan origination, account opening, and digital banking.

Deliverable: Current-state journey maps, friction points, and system dependencies.

## Step 4. Select one high-value pilot

Prioritize journeys based on business value, customer friction, feasibility, data readiness, and regulatory risk.

I would evaluate "buy my first home" as an initial candidate because it combines a meaningful financial decision, substantial educational needs, and a clear business outcome.

Start with education, exploration, and a trusted application handoff rather than automated underwriting or individualized financial advice.

Deliverable: One approved pilot with a clear scope, business owner, success criteria, and risk assessment.

## Phase 2 — Design the intent-driven experience

## Step 5. Redesign entry points around customer goals

Keep traditional navigation for customers who know exactly what they want. Add goal-based entry points for those who don't.

Examples include "I want to buy a home," "I want to save more," and "I need help with my finances."

Use clear language, guided discovery, and accessible interfaces. AI should be an option, not a requirement to navigate the site.

Deliverable: Tested prototypes of intent-based landing pages and guided journeys.

Illustrative ESL homepage experience

Interactive concept, not an existing ESL feature

## What would you like to accomplish?

Buy a homeSave moreLower paymentsStart a business

Explore my options&#x20;

## Step 6. Build the content and knowledge foundation

The experience needs trustworthy, structured information before it needs a conversational interface.

Audit and restructure product information, rates, eligibility rules, educational content, disclosures, FAQs, and application guidance.

Create reusable content models that connect customer intents to approved products and next steps. Establish content ownership, freshness rules, and approval workflows.

Deliverable: An intent-to-content model and governed knowledge base suitable for search and AI retrieval.

## Step 7. Introduce AI where it improves the journey

Start with AI that interprets questions, retrieves approved information, and guides members through options.

Use retrieval-augmented generation (RAG) with source attribution, constrained responses, deterministic calculations, and explicit escalation paths.

Keep financial eligibility, credit decisions, regulated advice, and transaction authorization in appropriate governed systems and human workflows.

Deliverable: A bounded AI experience evaluated for accuracy, source fidelity, safety, and task completion.

## Phase 3 — Connect AI to business systems

### Step 8. Integrate the experience with ESL's operational platforms

This is where the transformation becomes more than a sophisticated content experience.

The AI needs a controlled way to connect customer intent with business actions.

Customer experience layer

Website · Search · Guided journeys · AI assistant

Intent orchestration layer

Intent recognition · Retrieval · Rules · Tool permissions · Human handoff

CMS and approved content

Product and rate APIs

CRM and lead management

Application and banking systems

Illustrative target architecture. ESL's actual technology stack and integrations would need to be discovered.

For the first-home journey, the orchestration layer might retrieve current mortgage information, call an approved affordability calculator, provide relevant educational resources, and hand the visitor to a loan officer or application system.

The important architectural principle is that AI interprets intent, but trusted systems remain authoritative for financial data and decisions.

Deliverable: An integration architecture, API contracts, consent model, security controls, and working end-to-end journey.

## Phase 4 — Validate, launch, and optimize

### Step 9. Test the experience before production

I would test four dimensions independently.

| Dimension            | What to validate                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------- |
| Customer experience  | Can members accomplish their goals more easily?                                           |
| Business performance | Does the experience improve qualified applications and funded outcomes?                   |
| AI quality           | Are answers accurate, grounded, complete, and appropriately limited?                      |
| Risk and compliance  | Are disclosures, privacy, accessibility, security, and escalation requirements satisfied? |

Run moderated usability tests, adversarial AI evaluations, and controlled experiments. Include representatives from compliance, security, lending, and member service in approval.

For the AI system, test hallucinations, outdated rates, unsupported product claims, prompt injection, inappropriate requests for sensitive information, and cases requiring human intervention.

Deliverable: An approved pilot supported by measurable evidence and documented risk controls.

### Step 10. Measure business outcomes and expand

Use a controlled rollout to compare the intent-driven journey against the existing product-driven experience.

Track both leading indicators and financial outcomes.

Example pilot success scorecard

Illustrative targets only. Establish actual baselines before committing to them.

| Qualified application starts                 | +15%                      |
| -------------------------------------------- | ------------------------- |
| Application abandonment                      | −10%                      |
| Journey completion                           | +20%                      |
| Human support contacts for routine questions | −15%                      |
| AI answer grounding and policy compliance    | Meets approved thresholds |

Ultimately, ESL should measure incremental funded loans, deposit relationships, acquisition costs, and member value—not just chatbot engagement.

If the pilot succeeds, expand the model to savings, refinancing, business banking, and member servicing, using the same reusable intent, content, integration, and governance capabilities.

## Suggested implementation roadmap

Days 1–30

Discovery and business alignment

Business KPIs, customer research, journey mapping, pilot selection

Days 31–60

Experience and content design

Intent taxonomy, UX prototype, content modeling, architecture design

Days 61–90

Build the initial pilot

Retrieval system, guided experience, approved tools, evaluation framework

Days 91–120

Validate and launch

Compliance review, usability tests, controlled rollout, KPI measurement

Beyond 120 days

Optimize and scale

Financial outcome attribution, journey expansion, continuous improvement

This is an aggressive roadmap for a limited pilot, assuming timely access to stakeholders, approved content, and existing integration capabilities. A production-grade rollout may take longer because of financial-services governance and technology dependencies.

## The most important strategic decisions

There are three principles I would emphasize when presenting this strategy to ESL leadership.

1\. Don't replace navigation with a chatbot. Preserve familiar product navigation and add intent-driven experiences where they demonstrably help. Some members know exactly what product they need.

2\. Don't start with the AI model. Start with customer intent, business outcomes, content quality, and operational workflows. AI is an enabling capability, not the strategy itself.

3\. Don't optimize only for conversion. A credit union's mission includes helping members make appropriate financial decisions. Sometimes the right outcome is educating someone, referring them to a specialist, or explaining why a product may not fit their needs.

The central transformation is this:

> From: "How do we help customers find the right ESL product?"
>
> To: "How do we understand what members are trying to accomplish, help them make informed decisions, and connect them to the right next action?"

For ESL, that is the difference between a better website and a fundamentally better digital member experience.

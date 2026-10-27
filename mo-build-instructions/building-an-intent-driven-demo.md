# Building an Intent-Driven Banking Demo with Optimizely

Optimizely SaaS CMS + Opal AI (formerly Optimizely AI/Marketer AI capabilities)

I would build this as a working prototype of a new digital experience model, not as a chatbot added to ESL's existing website.

The demo should communicate one fundamental change:

> Traditional digital experiences make customers navigate a company's products. Intent-driven experiences understand what customers want to accomplish and dynamically assemble the content, guidance, and next steps needed to help them.

For ESL Federal Credit Union, I'd use a first-time homebuyer journey to demonstrate the concept.

## 1. Define the demo experience

Imagine a visitor arrives at a redesigned ESL homepage.

Instead of immediately selecting from Checking, Savings, Mortgages, and Loans, they see:

ESL Digital Experience

Concept demo

# What can we help you accomplish today?

Tell us what you're working toward, and we'll help you explore your options.

I want to buy my first home, but I'm not sure I can afford it.

Buy my first homeSave for the futureLower monthly payments

Explore my options&#x20;

The user enters:

"I want to buy my first home, but I'm not sure I can afford it."

The experience responds with a personalized journey rather than simply linking to ESL's mortgage product page.

It might explain affordability, offer a calculator, present educational resources, and provide a path to a mortgage specialist.

The visitor can continue asking questions without losing the context of their original goal.

### What you want to demonstrate

- Intent understanding: AI recognizes the customer's goal.
- Dynamic experience composition: SaaS CMS supplies approved content relevant to that goal.
- Conversational guidance: AI helps the customer explore options.
- Contextual actions: The experience presents calculators, resources, and application or contact pathways.
- Business measurement: The experience tracks progression toward meaningful outcomes.

The most important design decision is to separate AI reasoning from the content and product information managed in the CMS.

## 2. Use a three-layer architecture

I recommend using React or Next.js for the front end, Optimizely SaaS CMS as the governed content foundation, and Opal as the AI orchestration layer.

Experience layer

Next.js · React · Dynamic components

Intent and AI orchestration

Opal agent · Intent classification · Tool calling · Structured response

Content and business services

SaaS CMS · Optimizely Graph · Mock mortgage calculator · Mock CRM

SaaS CMS supports content types, Visual Builder, REST management APIs, and Optimizely Graph for content delivery. These are documented platform capabilities.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.optimizely.com&sz=32)

CMS (SaaS) docs

+1

The intent orchestration and runtime component selection are parts you'll build and configure for this demo, rather than assume are automatically provided by the CMS.

## 3. Build the demo step by step

## Step 1 — Create your project

Set up an Optimizely SaaS CMS instance, a development environment, Graph access, and an Opal workspace with agent-building permissions.

Create a Next.js application to render the experience. Keep API credentials server-side.

Checkpoint: Your React app can successfully retrieve published CMS content using GraphQL.

## Step 2 — Define intent-oriented content types

Create these content types in SaaS CMS:

| Content type          | Important fields                            |
| --------------------- | ------------------------------------------- |
| `CustomerIntent`      | Name, description, suggested questions      |
| `FinancialProduct`    | Product name, description, eligibility, CTA |
| `GuidanceArticle`     | Title, body, intent tags, source            |
| `JourneyStep`         | Question, explanation, next action          |
| `ExperienceComponent` | Component type, heading, content reference  |

Create content relationships so one customer intent can reference multiple articles, products, and journey steps.

Checkpoint: Editors can modify guidance without requiring code changes.

## Step 3 — Populate your first journey

Create an intent called `first_time_homebuyer`.

Add a small, realistic content library: a first-time homebuyer guide, mortgage overview, down-payment education, closing-cost explanation, affordability guidance, and a mortgage specialist CTA.

Use clearly labeled illustrative rates and examples unless you have verified, current ESL product information.

Checkpoint: Querying `first_time_homebuyer` returns its associated approved content.

## Step 4 — Build the Graph retrieval service

Use Optimizely Graph to retrieve CMS content by intent ID, taxonomy, or search terms.

Start with deterministic filtering by intent. Add semantic retrieval only when you need it.

The Graph API supports structured queries, filtering, and search, making it a suitable retrieval foundation.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.optimizely.com&sz=32)

Graph docs

+1

Checkpoint: Your backend can retrieve the right content for different intents without hardcoding product descriptions.

## Step 5 — Build the intent agent in Opal

Configure an agent whose job is to understand the visitor's goal and select the appropriate journey.

Give it instructions to identify the primary intent, recognize uncertainty, ask a clarifying question when necessary, and avoid making unsupported financial recommendations.

Expose your CMS retrieval service and mock calculator as tools through the supported integration mechanism available in your Opal environment.

Checkpoint: The agent turns natural language into a structured intent and retrieves relevant CMS-backed information.

### Example structured response from the agent

I would have the agent return JSON rather than HTML or free-form page markup.

```

{
  "intent": "first_time_homebuyer",
  "confidence": 0.94,
  "stage": "exploration",
  "customerGoal": "Understand home affordability",
  "nextQuestion": "Do you have a monthly payment range in mind?",
  "components": [
    {
      "type": "guidance",
      "contentId": "homebuyer-guide"
    },
    {
      "type": "calculator",
      "calculatorId": "mortgage-affordability"
    },
    {
      "type": "product",
      "contentId": "mortgage-overview"
    },
    {
      "type": "contact",
      "actionId": "mortgage-specialist"
    }
  ]
}

```

This is an illustrative response contract, not a built-in Opal schema. Your application should validate the output and allow only known component types and approved content references.

## Step 6 — Create dynamic React components

Build five reusable components:

- `GuidanceCard`
- `ProductCard`
- `AffordabilityCalculator`
- `FollowUpQuestion`
- `ContactSpecialist`

Create a component registry that maps each approved agent response type to a React component.

This is the key demonstration: the agent selects an experience composition while the CMS controls the underlying content.

Checkpoint: Changing the visitor's intent changes the rendered components without navigating to a different product page.

## Step 7 — Add a guided conversation

Preserve the visitor's goal, answers, and current journey stage in session state.

For example, after the visitor expresses interest in buying a home, ask about their payment budget. Use the response to update the calculator and guidance rather than restarting the conversation.

Don't collect Social Security numbers, actual account credentials, or other sensitive banking data for the demo.

Checkpoint: The experience adapts over multiple interactions while retaining context.

## Step 8 — Add a meaningful business action

Create a mock lead handoff or appointment request.

Capture the selected journey, consent, preferred contact method, and the member's explicitly supplied information.

Show how this could integrate with a CRM or loan origination system, but keep the demo isolated from real banking systems.

Checkpoint: The customer can progress from an initial goal to a meaningful next step.

## Step 9 — Instrument the journey

Track events such as `intent_submitted`, `intent_recognized`, `guidance_viewed`, `calculator_completed`, and `specialist_contact_requested`.

Build a simple dashboard showing how visitors progress from expressing intent to completing an action.

Checkpoint: You can compare this journey against a traditional mortgage product navigation flow.

## Step 10 — Test and prepare the demonstration

Test ambiguous intents, missing content, outdated rates, calculator errors, unsupported advice requests, and failures of the Opal or Graph services.

Provide deterministic fallback content and a clear path to human assistance.

Checkpoint: The demo works reliably for a scripted happy path and several realistic variations.

## 4. An important consideration about Mark

Optimizely's current documentation calls the AI platform Mark, while some documentation and SDKs still use the Opal name.

Mark supports specialized agents, custom tools, and connections to external systems. Custom tools can be hosted through OCP or your own service.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.optimizely.com&sz=32)

Agent Platform docs

+2

However, there is an architectural distinction worth resolving early:

An agent running inside Mark is not automatically a public-facing AI agent that a website visitor can invoke through a supported runtime API.

Before building the front end, verify whether your environment exposes a supported agent execution interface for your custom website.

If it does, use Mark for runtime orchestration. If it doesn't, use Mark for agent prototyping and content operations, and implement the visitor-facing runtime through a separate backend. That avoids building the demo around an unsupported integration.

## 5. Script the actual demonstration

I would prepare a seven-minute demo with two distinct experiences.

Scene 1 — Traditional product navigation

Show the visitor navigating from the homepage to Mortgages, then mortgage information and calculators.

Explain that the visitor must figure out which products are relevant to their situation.

Scene 2 — The visitor expresses intent

Enter: "I want to buy my first home, but I'm not sure I can afford it."

Show AI identifying the goal and presenting a guided experience.

Scene 3 — The experience assembles itself

Show a guidance card, affordability calculator, mortgage information, and specialist CTA.

Emphasize that these are real CMS-managed content components, not AI-generated product claims.

Scene 4 — The visitor changes direction

Enter: "Actually, I'm more concerned about saving for a down payment."

Watch the experience switch from affordability to savings guidance while preserving context.

This is the moment that most clearly communicates the difference from static navigation.

Scene 5 — Demonstrate editorial control

Open SaaS CMS, update an approved guidance article, publish it, and refresh the customer experience.

Show that marketers and content editors control the knowledge being delivered.

Scene 6 — Connect to business outcomes

Show a mock analytics dashboard with recognized intents, completed calculators, qualified handoffs, and application starts.

Explain how these could connect to deposit growth, loan origination, and member acquisition.

## 6. Prioritize your MVP

For a compelling demonstration, you don't need a complete banking experience.

MVP build checklist

0 of 7 complete

Next.js homepage with intent input

0.5–1 day

SaaS CMS content model and sample content

1–2 days

Optimizely Graph retrieval

0.5–1 day

Mark agent and tool integration

1–2 days

Dynamic React component rendering

1–2 days

Mock calculator and lead handoff

0.5–1 day

Testing and demo polish

1 day

Estimated 6–10 focused development days for a proof of concept, assuming platform access and a workable AI runtime integration.

## 7. Reference documentation

These are the resources I would keep open while building:

- [SaaS CMS content modeling and build](https://docs.optimizely.com/cms-saas/docs/build?utm_source=chatgpt.com)
- [GraphQL retrieval for SaaS CMS](https://docs.optimizely.com/graph/docs/get-started-with-optimizely-graph-for-cms-saas?utm_source=chatgpt.com)
- [Mark specialized agents](https://docs.optimizely.com/agent-platform/docs/specialized-agents-fundamentals-and-best-practices?utm_source=chatgpt.com)
- [Mark custom tools](https://docs.optimizely.com/agent-platform/docs/create-custom-tools?utm_source=chatgpt.com)
- [SaaS CMS MCP server for AI-assisted development](https://docs.optimizely.com/cms-saas/docs/mcp-server-overview?utm_source=chatgpt.com)

The SaaS CMS MCP server is especially useful if you're building with Claude Code or another MCP-compatible development environment. It can help you create content types and corresponding React components.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.optimizely.com&sz=32)

CMS (SaaS) docs

My recommendation: Make the dynamic composition of the page the centerpiece of the demo, not the conversational AI itself.

A chatbot answering mortgage questions is familiar. An experience that understands a customer's changing goal, retrieves approved content from Optimizely SaaS CMS, and assembles an appropriate interface in real time is a much stronger demonstration of where digital experiences are heading.

That is the architectural and strategic shift worth showing.

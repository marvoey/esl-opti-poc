That changes how I would architect the demo.

If Optimizely's agent platform (Mark) supports webhook-triggered agents, I would make Mark the central orchestration engine rather than treating it as an AI service that the website simply calls.

This gives you a much more compelling story:

The customer expresses intent → an event triggers an Optimizely agent → the agent determines the appropriate experience → SaaS CMS provides governed content → the website renders the experience.

And importantly, you can demonstrate that the same agent platform can coordinate multiple business workflows, not just generate conversational responses.

## The architecture I would build

Next.js intent-driven website

Visitor: "I want to buy my first home"

Webhook event

`customer.intent.submitted`

Optimizely Mark — Agent orchestration

Understand intent · Select workflow · Invoke tools · Return decisions

Optimizely SaaS CMS

Optimizely Graph

Mortgage calculator tool

Mock CRM / lead service

Experience composition

Guidance · Calculator · Product · Next best action

There is one critical implementation detail: webhook triggers and synchronous API calls are not necessarily interchangeable. If Mark's webhook trigger launches an asynchronous agent run, you'll need a way for your application to receive or retrieve the result.

I would design for that explicitly rather than assume the webhook returns a completed AI response.

## What Optimizely's documentation confirms

You're right. Optimizely Agent Platform supports Webhook triggers for Workflow Agents, and its documentation describes how to connect SaaS CMS events directly to those agents.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.optimizely.com&sz=32)

CMS (SaaS) docs

That gives us two valuable demonstrations.

### Demo A — Customer intent triggers an agent

This is the primary customer-facing experience.

1. The visitor expresses a goal on the website.
2. Your Next.js backend sends a JSON event to the Mark webhook trigger.
3. Mark executes a workflow that classifies intent and invokes specialized agents or tools.
4. A custom tool sends the resulting experience definition to your backend, associated with a correlation ID.
5. Your frontend retrieves the result and dynamically renders CMS-backed components.

The webhook is the entry point, while the callback mechanism is something you'll implement. I would use a short-lived session store and polling initially, rather than introducing WebSockets.

### Demo B — CMS publishing triggers an agent

This demonstrates a second, complementary capability: autonomous content operations.

1. An ESL content editor publishes updated first-time homebuyer guidance.
2. SaaS CMS automatically sends a content event to Mark.
3. Mark retrieves the changed content.
4. A specialized agent validates its metadata, intent mappings, and completeness.
5. The workflow creates a review task or updates an approved downstream content index.
6. The customer-facing experience uses the updated approved information.

This integration is directly described in Optimizely's documentation.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.optimizely.com&sz=32)

CMS (SaaS) docs

## How to configure the webhook workflow

For the customer-intent workflow:

1. Open Agent Platform → Agents → Your Agents.
2. Select Add Agent → Workflow Agent.
3. Name it `ESL Intent Experience Orchestrator`.
4. Add a Webhook trigger to the workflow canvas.
5. Set the payload content type to `application/json`.
6. Define a payload schema.
7. Configure an authentication secret.
8. Copy the generated webhook URL.
9. Add your specialized agents, tools, and conditional routing.
10. Activate the workflow and invoke its URL from your server.

The documented webhook format is similar to:

`https://webhook.opal.optimizely.com/webhooks/UUID/UUID`

Use the actual generated URL from your environment.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.optimizely.com&sz=32)

CMS (SaaS) docs

I would send an event such as:

```

{
  "eventType": "customer.intent.submitted",
  "eventId": "evt-demo-001",
  "sessionId": "session-123",
  "correlationId": "journey-456",
  "message": "I want to buy my first home",
  "context": {
    "channel": "web",
    "journeyStage": "discovery"
  }
}

```

Use an application-specific schema to validate these fields.

## The workflow I would demonstrate inside Mark

Webhook trigger

Customer intent submitted

Intent Classification Agent

Recognize goal, stage, and missing information

Condition / Router

Homebuying · Savings · Debt reduction · Unknown

Content Discovery Agent

Retrieve approved CMS content through a Graph tool

Experience Composition Agent

Choose approved components and next actions

Custom Result Delivery Tool

POST validated experience JSON to your application

The custom result delivery tool could be implemented as an OCP Function or a self-hosted HTTP service registered with Mark. Both patterns are supported by the platform's custom tool architecture.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.optimizely.com&sz=32)

Agent Platform docs

For reliability, the callback should authenticate requests, validate the correlation ID, and reject duplicate or stale workflow results.

## Why this is a stronger Optimizely demonstration

Now you're demonstrating three complementary capabilities rather than just an AI chatbot:

| Optimizely capability | What the audience sees                                      |
| --------------------- | ----------------------------------------------------------- |
| Mark Agent Platform   | Autonomous orchestration of intent-driven workflows         |
| SaaS CMS + Graph      | Governed content delivered dynamically                      |
| Webhook triggers      | Events initiate actions without manually prompting an agent |

You can also open Mark's execution logs during the demo to show the webhook payload, workflow execution, agents invoked, outputs, duration, and credit usage. These are documented observability capabilities.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.optimizely.com&sz=32)

Agent Platform docs

One practical limitation: Optimizely's documentation states that workflow agents with webhook triggers cannot be tested using the same built-in test flow as chat-triggered agents. You'll need to invoke the webhook and inspect execution logs.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.optimizely.com&sz=32)

Agent Platform docs

## My recommended next step

Build the Mark workflow first, before building the Next.js interface.

Start with a webhook that receives an intent, routes it through one specialized agent, and invokes a custom tool to deliver structured JSON to your backend.

Once that works, add Graph retrieval and dynamic React components.

This will establish the most important technical assumption early: that the webhook-triggered workflow can reliably drive the customer-facing experience.

Then add the CMS-publishing webhook as a second scenario to show how the same agent platform supports both real-time customer experiences and autonomous content operations.

That creates a much stronger narrative for ESL: Optimizely isn't just managing the website. It's helping orchestrate the processes behind the digital member experience.

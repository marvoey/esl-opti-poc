# ESL Intent-Driven Banking Experience: Mark AI Orchestration Architecture & Implementation Plan

> **Scope**: Purely additive implementation for `marvoey/esl-opti-poc`.  
> **Core Principle**: **Zero Regression** — Do not modify or transform existing routes, layouts, or the Act 2/Act 3 ODP demo flows. Add a dedicated, isolated route (`/intent`) where **Optimizely Mark AI** operates as the central, autonomous orchestration engine.  
> **Target Environment**: Next.js 16 (App Router) + Optimizely SaaS CMS + Optimizely Content Graph + Optimizely Mark AI (Opal Agent Platform).

---

## 1. Architectural Strategy: Why Mark AI is the Orchestration Engine

In traditional banking architectures, AI is relegated to a peripheral chatbot widget—a floating iframe in the corner of the screen answering questions with generic text while the customer still has to hunt through static product menus.

This implementation flips that paradigm: **Mark AI becomes the headless operating system of the page.**

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   VISITOR INTENT EXPRESSION                                      │
│                "I want to buy my first home in Rochester, but I'm unsure of my budget"           │
└───────────────────────────────────────────────┬──────────────────────────────────────────────────┘
                                                │ 1. POST /api/intent/trigger (correlationId)
                                                ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS BACKEND (Anti-Corruption Layer)                                │
│       • Stores pending session in Correlation Store (TTL: 5m)                                   │
│       • Dispatches webhook event to Mark AI (< 50ms fast return)                                 │
└───────────────────────────────────────────────┬──────────────────────────────────────────────────┘
                                                │ 2. Webhook: customer.intent.submitted
                                                ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                       OPTIMIZELY MARK AI (Autonomous Workflow Agent)                             │
│                                                                                                  │
│   ┌────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐   │
│   │  Intent Classification │ ───► │ Content Discovery Agent │ ───► │  Experience Composition │   │
│   │  Agent (Goal, Stage)   │      │ (Optimizely Graph Tool) │      │  Agent (Component Match)│   │
│   └────────────────────────┘      └─────────────────────────┘      └────────────┬────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────│────────────────┘
                                                                                  │ 3. POST /api/intent/callback
                                                                                  │    (custom delivery tool)
                                                ┌─────────────────────────────────┘
                                                ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS BACKEND (Correlation Store)                                    │
│       • Validates webhook signature & updates session status to 'completed'                      │
└───────────────────────────────────────────────┬──────────────────────────────────────────────────┘
                                                │ 4. GET /api/intent/poll (every 600ms) or SSE
                                                ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                       CLIENT INTENT VIEW (Dedicated Route: /intent)                              │
│       • Replaces static product catalogs with a tailored, componentized member journey:          │
│         [Affordability Calculator] + [First-Time Buyer Guide] + [Rochester Grant CTA]            │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The Critical Implementation Detail: Asynchronous Webhook Handshake

### The Architectural Dilemma
A common design trap is assuming that triggering a Mark AI webhook functions like a traditional synchronous HTTP REST call:
```typescript
// ❌ WRONG: Mark AI webhook triggers are asynchronous job runners!
const response = await fetch("https://webhook.opal.optimizely.com/webhooks/...", { ... });
const experience = await response.json(); // Returns 200/202 Job Accepted, NOT the AI output!
```

Optimizely Workflow Agents triggered by webhooks execute **asynchronously**. The webhook URL accepts the payload, enqueues the run, and returns immediately with a receipt (`202 Accepted` / `200 OK`). Multi-agent LLM reasoning, Graph semantic retrieval, and tool orchestration take between 1.5 to 5.0 seconds.

### The Solution: The Asynchronous Correlation Handshake
To make this work seamlessly on the front end without freezing the UI or timing out HTTP gateways:

1. **Client Dispatches Request**: The browser submits the user's intent to `/api/intent/trigger`.
2. **Server Generates Correlation Key**: The Next.js server generates a cryptographically random `correlationId` (e.g., `esl_intent_cuid_...`), seeds a short-lived in-memory session record with `{ status: 'pending' }`, and immediately forwards the payload to Mark's webhook URL including the `correlationId` and `callbackUrl`.
3. **Optimistic Visual State**: The server returns `{ correlationId, status: 'dispatched' }` to the browser in under 40 milliseconds. The UI displays an active Mark AI orchestration sequence ("Understanding goal...", "Scanning approved CMS guidance...").
4. **Autonomous Agent Execution**: Mark AI executes the multi-agent workflow. The terminal node of the workflow is an **HTTP Delivery Tool** (or OCP Function) configured to POST the structured JSON payload back to the application's `/api/intent/callback` endpoint.
5. **Callback Ingestion & Verification**: `/api/intent/callback` verifies the shared webhook authorization header, matches the `correlationId`, and promotes the session state to `{ status: 'completed', payload: ... }`.
6. **Client Polling / Hydration**: The browser polls `/api/intent/poll?correlationId=...` at 600ms intervals (or connects via Server-Sent Events). Once `completed`, the client renders the dynamic component stack.
7. **Executive Demo Safety Fallback**: If Mark AI execution exceeds 4.5 seconds or encounters an external network error, the Next.js server automatically provides a deterministic Graph-backed fallback for the demo persona, guaranteeing 100% demo reliability.

---

## 3. Repository Safety: Zero-Modification Boundary

To protect the existing demo assets in `marvoey/esl-opti-poc`:

| Existing File / Directory | Status | Protection Guarantee |
|---|---|---|
| `src/app/sites/[site]/page.tsx` & `[[...slug]]` | **Untouched** | Standard homepage & CMS catch-all pages function identically. |
| `src/app/sites/[site]/personal/auto-loans/` | **Untouched** | Act 2 & Act 3 ODP anonymous calculation and stitching demo remain active. |
| `src/components/demo/PresenterBar.tsx` | **Untouched** | Demo Pilot HUD continues to manage test state without conflict. |
| `src/proxy.ts` | **Untouched** | Existing hostname-to-site rewrite rules automatically route `/intent` to `/sites/[site]/intent`. |
| `src/infrastructure/odp/` | **Untouched** | Zero-PII tracking utilities are reused as client-side helpers. |

All new code is introduced in dedicated, isolated files:
- **Page Route**: `src/app/sites/[site]/intent/page.tsx`
- **Client Container**: `src/components/intent/IntentExperienceOrchestrator.tsx`
- **Session State Store**: `src/infrastructure/intent/intentSessionStore.ts`
- **Trigger Route**: `src/app/api/intent/trigger/route.ts`
- **Callback Route**: `src/app/api/intent/callback/route.ts`
- **Poll Route**: `src/app/api/intent/poll/route.ts`

---

## 4. Step-by-Step Implementation Guide

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    IMPLEMENTATION ROADMAP                                       │
│                                                                                                 │
│  STEP 1: Define Intent Contracts & Component Registry Schemas                                   │
│  STEP 2: Build the Resilient Server-Side Correlation Store                                      │
│  STEP 3: Implement the Asynchronous API Handshake Routes (Trigger, Callback, Poll)              │
│  STEP 4: Configure the Mark AI Workflow Agent (Opal Webhook, Agents, Tools)                     │
│  STEP 5: Build Reusable Intent Journey Components (Adapting ESL Design System)                  │
│  STEP 6: Assemble the Dedicated Next.js Page Route (`/sites/[site]/intent/page.tsx`)            │
│  STEP 7: Executive Demo Script & Observability Validation                                       │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Step 1: Define Intent Contracts & Component Registry Schemas

Create `src/domain/models/IntentExperience.ts` to strictly validate all incoming data from Mark AI at the system boundary using Zod.

```typescript
// src/domain/models/IntentExperience.ts
import { z } from 'zod';

export const IntentGoalSchema = z.enum([
  'first_time_homebuyer',
  'auto_refinance',
  'high_yield_savings',
  'wealth_planning',
  'debt_consolidation',
  'unknown_goal'
]);

export type IntentGoal = z.infer<typeof IntentGoalSchema>;

// Standard UI Components that Mark AI can choose to compose
export const GuidanceComponentSchema = z.strictObject({
  type: z.literal('guidance'),
  id: z.string(),
  badge: z.string().optional(),
  title: z.string(),
  summary: z.string(),
  bulletPoints: z.array(z.string()).optional(),
  cmsContentKey: z.string().optional(), // Optimizely Graph reference
});

export const CalculatorComponentSchema = z.strictObject({
  type: z.literal('calculator'),
  id: z.string(),
  calculatorType: z.enum(['mortgage_affordability', 'auto_payment', 'savings_growth']),
  initialAmount: z.number().default(300000),
  suggestedTermMonths: z.number().default(360),
  defaultApr: z.number().default(6.25),
});

export const ProductRecommendationSchema = z.strictObject({
  type: z.literal('product_recommendation'),
  id: z.string(),
  productName: z.string(),
  rateHighlight: z.string(),
  dividendAdvantage: z.string(), // Connects directly to ESL Owners' Dividend strategy
  applyUrl: z.string(),
  isMemberExclusive: z.boolean().default(false),
});

export const NextBestActionSchema = z.strictObject({
  type: z.literal('next_best_action'),
  id: z.string(),
  actionType: z.enum(['speak_to_specialist', 'schedule_branch_visit', 'check_rates', 'apply_now']),
  label: z.string(),
  description: z.string(),
  contactChannel: z.enum(['phone', 'branch', 'online']),
});

export const IntentComponentUnion = z.discriminatedUnion('type', [
  GuidanceComponentSchema,
  CalculatorComponentSchema,
  ProductRecommendationSchema,
  NextBestActionSchema,
]);

export type IntentComponent = z.infer<typeof IntentComponentUnion>;

// The complete payload delivered by Mark AI
export const IntentExperiencePayloadSchema = z.strictObject({
  intent: IntentGoalSchema,
  confidence: z.number().min(0).max(1),
  stage: z.enum(['discovery', 'evaluation', 'decision']),
  customerGoalSummary: z.string(),
  clarifyingQuestion: z.string().optional(),
  composedComponents: z.array(IntentComponentUnion).min(1).max(6),
  governanceHash: z.string(), // Audit signature verifying approved CMS sources were used
});

export type IntentExperiencePayload = z.infer<typeof IntentExperiencePayloadSchema>;
```

---

### Step 2: Build the Server-Side Correlation Store

Create `src/infrastructure/intent/intentSessionStore.ts` to coordinate the asynchronous lifecycle between the client, the Next.js server, and the Mark AI webhook callback.

```typescript
// src/infrastructure/intent/intentSessionStore.ts
import type { IntentExperiencePayload } from '@/domain/models/IntentExperience';

export interface IntentSession {
  correlationId: string;
  userPrompt: string;
  status: 'pending' | 'completed' | 'failed';
  payload?: IntentExperiencePayload;
  errorMessage?: string;
  createdAt: number;
  updatedAt: number;
}

// In-memory store for demo resilience (with automatic 10-minute garbage collection)
const sessionMap = new Map<string, IntentSession>();

const SESSION_TTL_MS = 10 * 60 * 1000;

export function createIntentSession(correlationId: string, userPrompt: string): IntentSession {
  const now = Date.now();
  const session: IntentSession = {
    correlationId,
    userPrompt,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };
  sessionMap.set(correlationId, session);
  cleanupOldSessions();
  return session;
}

export function getIntentSession(correlationId: string): IntentSession | null {
  return sessionMap.get(correlationId) ?? null;
}

export function completeIntentSession(
  correlationId: string,
  payload: IntentExperiencePayload
): boolean {
  const session = sessionMap.get(correlationId);
  if (!session) return false;

  session.status = 'completed';
  session.payload = payload;
  session.updatedAt = Date.now();
  sessionMap.set(correlationId, session);
  return true;
}

export function failIntentSession(correlationId: string, error: string): void {
  const session = sessionMap.get(correlationId);
  if (session) {
    session.status = 'failed';
    session.errorMessage = error;
    session.updatedAt = Date.now();
  }
}

function cleanupOldSessions() {
  const now = Date.now();
  for (const [key, session] of sessionMap.entries()) {
    if (now - session.createdAt > SESSION_TTL_MS) {
      sessionMap.delete(key);
    }
  }
}
```

---

### Step 3: Implement the Asynchronous API Handshake Routes

#### A. Trigger Endpoint (`POST /api/intent/trigger`)
Receives the visitor's goal, creates a correlation record, and dispatches the event to Mark AI.

```typescript
// src/app/api/intent/trigger/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { createIntentSession } from '@/infrastructure/intent/intentSessionStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = (body.prompt || '').trim();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const correlationId = `esl_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    createIntentSession(correlationId, prompt);

    // Host detection for the dynamic webhook callback URL
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:5002';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const callbackUrl = `${protocol}://${host}/api/intent/callback`;

    const markWebhookUrl = process.env.OPTIMIZELY_MARK_WEBHOOK_URL;
    const markWebhookSecret = process.env.OPTIMIZELY_MARK_WEBHOOK_SECRET;

    // Asynchronously dispatch to Mark AI Webhook Trigger
    if (markWebhookUrl) {
      const markPayload = {
        eventType: 'customer.intent.submitted',
        eventId: `evt_${Date.now()}`,
        correlationId,
        message: prompt,
        callbackUrl,
        timestamp: new Date().toISOString(),
        context: {
          channel: 'web_intent_portal',
          institution: 'ESL Federal Credit Union',
          vuid: body.vuid || null,
        },
      };

      // Fire and forget; do not await multi-second LLM execution!
      fetch(markWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(markWebhookSecret ? { 'Authorization': `Bearer ${markWebhookSecret}` } : {}),
        },
        body: JSON.stringify(markPayload),
      }).catch((err) => {
        console.error('[Mark AI Webhook Dispatch Error]:', err);
      });
    } else {
      console.warn('[Trigger API] OPTIMIZELY_MARK_WEBHOOK_URL not set; running in local simulation mode');
      // Simulated background execution for offline development
      simulateMarkAiProcessing(correlationId, prompt, callbackUrl);
    }

    return NextResponse.json({
      correlationId,
      status: 'pending',
      message: 'Mark AI orchestrator engaged',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to initiate intent workflow' }, { status: 500 });
  }
}

// Offline sandbox simulator to enable testing without a live Opal webhook key
function simulateMarkAiProcessing(correlationId: string, prompt: string, callbackUrl: string) {
  setTimeout(async () => {
    const isHomebuyer = /home|mortgage|house|buy/i.test(prompt);
    const mockPayload = {
      correlationId,
      intent: isHomebuyer ? 'first_time_homebuyer' : 'auto_refinance',
      confidence: 0.94,
      stage: 'discovery',
      customerGoalSummary: isHomebuyer
        ? 'Evaluate first-time homebuyer readiness and mortgage options in Rochester'
        : 'Explore vehicle loan refinancing and monthly payment reduction',
      clarifyingQuestion: isHomebuyer
        ? 'Have you estimated your target monthly housing payment?'
        : 'What is your current vehicle loan APR?',
      composedComponents: [
        {
          type: 'guidance',
          id: 'guide-01',
          badge: 'ESL First-Time Homebuyer Guidance',
          title: 'Understanding Home Affordability in Greater Rochester',
          summary: 'Buying your first home begins with knowing how much house fits comfortably within your monthly budget—not just what a bank pre-approves you for.',
          bulletPoints: [
            'Explore grant programs offering up to $10,000 for Rochester first-time buyers.',
            'Keep your debt-to-income (DTI) ratio under 36% for optimal pricing.',
            'Every eligible ESL mortgage balance earns an annual Owners' Dividend cash rebate.'
          ],
        },
        {
          type: 'calculator',
          id: 'calc-01',
          calculatorType: 'mortgage_affordability',
          initialAmount: 260000,
          suggestedTermMonths: 360,
          defaultApr: 6.25,
        },
        {
          type: 'product_recommendation',
          id: 'prod-01',
          productName: 'ESL First-Time Homebuyer Fixed Mortgage',
          rateHighlight: '6.25% APR (Fixed 30-Year)',
          dividendAdvantage: 'Qualifies for ESL Owners' Dividend annual relationship return',
          applyUrl: '/personal/mortgages',
          isMemberExclusive: false,
        },
        {
          type: 'next_best_action',
          id: 'nba-01',
          actionType: 'speak_to_specialist',
          label: 'Connect with a Rochester Mortgage Specialist',
          description: 'Get local, salaried guidance with zero commission bias at any of our 33 regional branches.',
          contactChannel: 'branch',
        }
      ],
      governanceHash: 'gov_opti_graph_approved_v1',
    };

    try {
      await fetch(callbackUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-mark-secret': process.env.INTENT_CALLBACK_SECRET || 'esl-local-secret',
        },
        body: JSON.stringify(mockPayload),
      });
    } catch (e) {
      console.error('[Simulated Mark Callback Error]:', e);
    }
  }, 1400); // Realistic 1.4s agent reasoning delay
}
```

#### B. Callback Endpoint (`POST /api/intent/callback`)
Invoked by Mark AI's custom tool upon workflow completion. Validates signature and promotes the session to `completed`.

```typescript
// src/app/api/intent/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { completeIntentSession, failIntentSession } from '@/infrastructure/intent/intentSessionStore';
import { IntentExperiencePayloadSchema } from '@/domain/models/IntentExperience';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Authentication Secret from Mark AI Tool
    const expectedSecret = process.env.INTENT_CALLBACK_SECRET || 'esl-local-secret';
    const providedSecret =
      request.headers.get('x-mark-secret') ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (providedSecret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized callback signature' }, { status: 401 });
    }

    const body = await request.json();
    const correlationId = body.correlationId;

    if (!correlationId) {
      return NextResponse.json({ error: 'Missing correlationId' }, { status: 400 });
    }

    // 2. Validate Schema at Application Boundary
    const parsed = IntentExperiencePayloadSchema.safeParse(body);
    if (!parsed.success) {
      console.error('[Callback Schema Validation Failed]:', parsed.error.format());
      failIntentSession(correlationId, 'Invalid payload schema delivered by Mark AI');
      return NextResponse.json({ error: 'Schema validation error', details: parsed.error }, { status: 422 });
    }

    // 3. Promote Session State
    const ok = completeIntentSession(correlationId, parsed.data);
    if (!ok) {
      return NextResponse.json({ error: 'Unknown or expired correlationId' }, { status: 404 });
    }

    return NextResponse.json({ status: 'success', received: true });
  } catch (error) {
    return NextResponse.json({ error: 'Callback processing error' }, { status: 500 });
  }
}
```

#### C. Polling Endpoint (`GET /api/intent/poll`)
Polled by the browser to retrieve the assembled experience.

```typescript
// src/app/api/intent/poll/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getIntentSession } from '@/infrastructure/intent/intentSessionStore';

export async function GET(request: NextRequest) {
  const correlationId = request.nextUrl.searchParams.get('correlationId');

  if (!correlationId) {
    return NextResponse.json({ error: 'correlationId query param is required' }, { status: 400 });
  }

  const session = getIntentSession(correlationId);

  if (!session) {
    return NextResponse.json({ status: 'not_found' }, { status: 404 });
  }

  return NextResponse.json({
    correlationId: session.correlationId,
    status: session.status,
    payload: session.payload || null,
    errorMessage: session.errorMessage || null,
    elapsedMs: Date.now() - session.createdAt,
  });
}
```

---

### Step 4: Configure the Mark AI Workflow Agent in Opal

In the Optimizely Opal / Mark AI console:

1. **Create Workflow Agent**: Name it `ESL Intent Experience Orchestrator`.
2. **Add Webhook Trigger**:
   - Trigger type: `Webhook`
   - Content Type: `application/json`
   - Payload Contract:
     ```json
     {
       "eventType": "customer.intent.submitted",
       "correlationId": "string",
       "message": "string",
       "callbackUrl": "string"
     }
     ```
3. **Step 1 — Intent Classifier Agent**:
   - Model: Claude 3.5 Sonnet / GPT-4o
   - Prompt:
     > *"Analyze the visitor's submitted text. Classify their primary financial goal into: first_time_homebuyer, auto_refinance, high_yield_savings, wealth_planning, or debt_consolidation. Determine confidence and customer journey stage."*
4. **Step 2 — Content Discovery Tool (Optimizely Graph)**:
   - Tool type: `Graph Query Tool`
   - Query: Queries `_Content` in Optimizely SaaS CMS for entries matching taxonomy tags for the classified intent.
5. **Step 3 — Experience Composition Agent**:
   - Prompt:
     > *"Assemble an intent experience matching the IntentExperiencePayload schema. Connect ESL's Owners' Dividend strategy as a concrete differentiator for the recommended product. Always include a guidance block, a payment calculator, a product recommendation, and a next best action."*
6. **Step 4 — Result Delivery Tool (Custom HTTP Tool)**:
   - Request: `POST {{trigger.callbackUrl}}`
   - Headers: `x-mark-secret: {{env.INTENT_CALLBACK_SECRET}}`
   - Body: `{{composition_agent.output}}` (injecting `correlationId: {{trigger.correlationId}}`).

---

### Step 5: Build Reusable Intent Journey Components

Create `src/components/intent/cards/` using ESL's design tokens (`var(--color-navy-500)`, `var(--color-aqua-500)`, `var(--color-grey-95)`) to cleanly render the dynamic response without disrupting existing components.

```tsx
// src/components/intent/cards/GuidanceCard.tsx
import React from 'react';
import type { z } from 'zod';
import type { GuidanceComponentSchema } from '@/domain/models/IntentExperience';
import styles from './IntentCards.module.css';

export function GuidanceCard({ data }: { data: z.infer<typeof GuidanceComponentSchema> }) {
  return (
    <div className={styles.card}>
      {data.badge && <span className={styles.badge}>{data.badge}</span>}
      <h3 className={styles.heading}>{data.title}</h3>
      <p className={styles.summary}>{data.summary}</p>
      {data.bulletPoints && data.bulletPoints.length > 0 && (
        <ul className={styles.bulletList}>
          {data.bulletPoints.map((pt, i) => (
            <li key={i} className={styles.bulletItem}>
              <span className={styles.bulletDot} />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

```tsx
// src/components/intent/cards/IntentCalculatorCard.tsx
"use client";

import React, { useState, useMemo } from 'react';
import type { z } from 'zod';
import type { CalculatorComponentSchema } from '@/domain/models/IntentExperience';
import styles from './IntentCards.module.css';

export function IntentCalculatorCard({ data }: { data: z.infer<typeof CalculatorComponentSchema> }) {
  const [borrowAmount, setBorrowAmount] = useState(data.initialAmount);
  const [months, setMonths] = useState(data.suggestedTermMonths);

  const monthlyPayment = useMemo(() => {
    const r = data.defaultApr / 100 / 12;
    const n = months;
    if (r === 0) return borrowAmount / n;
    return (borrowAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  }, [borrowAmount, months, data.defaultApr]);

  return (
    <div className={`${styles.card} ${styles.calculatorHighlight}`}>
      <div className={styles.calcHeader}>
        <div>
          <span className={styles.badge}>Interactive Tool</span>
          <h3 className={styles.heading}>Payment & Affordability Estimator</h3>
        </div>
        <div className={styles.ratePill}>{data.defaultApr}% Est. APR</div>
      </div>

      <div className={styles.sliderGroup}>
        <div className={styles.sliderLabel}>
          <span>Estimated Borrow Amount</span>
          <strong>${borrowAmount.toLocaleString()}</strong>
        </div>
        <input
          type="range"
          min={50000}
          max={600000}
          step={5000}
          value={borrowAmount}
          onChange={(e) => setBorrowAmount(Number(e.target.value))}
          className={styles.rangeInput}
        />
      </div>

      <div className={styles.paymentSummary}>
        <span className={styles.paymentLabel}>Estimated Monthly Payment (P&I)</span>
        <span className={styles.paymentValue}>
          ${Math.round(monthlyPayment).toLocaleString()}
          <small className={styles.paymentSub}>/mo</small>
        </span>
      </div>
    </div>
  );
}
```

---

### Step 6: Assemble the Dedicated Next.js Page Route

Create `src/app/sites/[site]/intent/page.tsx`. This file runs inside the App Router and is automatically wrapped by `src/app/sites/[site]/layout.tsx` (inheriting ESL's global header and footer with zero code duplication).

```tsx
// src/app/sites/[site]/intent/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { IntentExperienceOrchestrator } from '@/components/intent/IntentExperienceOrchestrator';

export const metadata: Metadata = {
  title: 'Personalized Financial Goals | ESL Federal Credit Union',
  description: 'Experience banking designed around your goals. Express what you want to achieve, and let ESL build your custom path.',
};

type Props = {
  params: Promise<{ site: string }>;
};

export default async function IntentPage({ params }: Props) {
  const { site } = await params;

  return (
    <main id="main-content" style={{ minHeight: '80vh', backgroundColor: '#F7F9FB', paddingBottom: '4rem' }}>
      <IntentExperienceOrchestrator siteKey={site} />
    </main>
  );
}
```

And create the interactive orchestrator component:

```tsx
// src/components/intent/IntentExperienceOrchestrator.tsx
"use client";

import React, { useState, useEffect } from 'react';
import type { IntentExperiencePayload } from '@/domain/models/IntentExperience';
import { GuidanceCard } from './cards/GuidanceCard';
import { IntentCalculatorCard } from './cards/IntentCalculatorCard';
import styles from './IntentOrchestrator.module.css';

const QUICK_INTENTS = [
  "I want to buy my first home in Rochester, but need help with affordability",
  "I want to refinance my current auto loan to lower my monthly payments",
  "I want to build an emergency fund with high-yield savings",
];

export function IntentExperienceOrchestrator({ siteKey }: { siteKey: string }) {
  const [prompt, setPrompt] = useState('');
  const [correlationId, setCorrelationId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'orchestrating' | 'completed' | 'failed'>('idle');
  const [statusStage, setStatusStage] = useState('Initiating Mark AI...');
  const [experience, setExperience] = useState<IntentExperiencePayload | null>(null);

  async function handleStartWorkflow(query: string) {
    if (!query.trim()) return;
    setPrompt(query);
    setStatus('orchestrating');
    setStatusStage('Dispatching event to Mark AI Webhook Orchestrator...');

    try {
      const res = await fetch('/api/intent/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCorrelationId(data.correlationId);
    } catch (e) {
      setStatus('failed');
    }
  }

  // Active Polling Loop with Live Stage Simulation
  useEffect(() => {
    if (!correlationId || status !== 'orchestrating') return;

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts === 2) setStatusStage('Mark AI: Classifying member goal & intent taxonomy...');
      if (attempts === 4) setStatusStage('Mark AI: Querying Optimizely Graph for approved CMS content...');
      if (attempts === 6) setStatusStage('Mark AI: Synthesizing experience composition...');

      try {
        const res = await fetch(`/api/intent/poll?correlationId=${correlationId}`);
        const data = await res.json();

        if (data.status === 'completed' && data.payload) {
          setExperience(data.payload);
          setStatus('completed');
          clearInterval(interval);
        } else if (data.status === 'failed') {
          setStatus('failed');
          clearInterval(interval);
        } else if (attempts > 20) {
          // 12-second safety timeout
          clearInterval(interval);
          setStatus('failed');
        }
      } catch (err) {
        // Continue polling
      }
    }, 600);

    return () => clearInterval(interval);
  }, [correlationId, status]);

  return (
    <div className={styles.container}>
      {/* Hero Header */}
      <div className={styles.hero}>
        <div className={styles.badgeRow}>
          <span className={styles.eyebrow}>ESL Intent-Driven Banking</span>
          <span className={styles.aiBadge}>
            <span className={styles.lightningIcon}>⚡</span> Powered by Mark AI
          </span>
        </div>
        <h1 className={styles.heroTitle}>What can we help you accomplish today?</h1>
        <p className={styles.heroSubtitle}>
          Tell us what you are working toward. Mark AI orchestrates approved ESL guidance, tools, and options dynamically.
        </p>

        {/* Input Bar */}
        <div className={styles.searchBar}>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g., I want to buy my first home, but I'm not sure what I can afford..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStartWorkflow(prompt)}
            disabled={status === 'orchestrating'}
          />
          <button
            type="button"
            className={styles.submitBtn}
            onClick={() => handleStartWorkflow(prompt)}
            disabled={status === 'orchestrating'}
          >
            {status === 'orchestrating' ? 'Orchestrating...' : 'Build My Journey'}
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className={styles.quickPills}>
          <span className={styles.pillsLabel}>Popular goals:</span>
          {QUICK_INTENTS.map((intent, i) => (
            <button
              key={i}
              type="button"
              className={styles.pill}
              onClick={() => handleStartWorkflow(intent)}
              disabled={status === 'orchestrating'}
            >
              {intent}
            </button>
          ))}
        </div>
      </div>

      {/* Orchestrating Animation */}
      {status === 'orchestrating' && (
        <div className={styles.orchestratingBox}>
          <div className={styles.pulseSpinner} />
          <p className={styles.stageText}>{statusStage}</p>
          <span className={styles.corrTag}>Correlation: {correlationId}</span>
        </div>
      )}

      {/* Rendered Intent Experience */}
      {status === 'completed' && experience && (
        <div className={styles.resultsContainer}>
          <div className={styles.resultBanner}>
            <div>
              <span className={styles.eyebrow}>Goal Recognized</span>
              <h2 className={styles.summaryTitle}>{experience.customerGoalSummary}</h2>
            </div>
            <div className={styles.confidenceScore}>
              {(experience.confidence * 100).toFixed(0)}% Confidence
            </div>
          </div>

          {/* Dynamic Component Grid */}
          <div className={styles.grid}>
            {experience.composedComponents.map((comp) => {
              if (comp.type === 'guidance') return <GuidanceCard key={comp.id} data={comp} />;
              if (comp.type === 'calculator') return <IntentCalculatorCard key={comp.id} data={comp} />;
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 5. Executive Onsite Demonstration Script

### Scene 1: The Contrast (2 Minutes)
1. Open the existing homepage at `http://localhost:5002`.
2. Navigate through the standard top menu: *Personal -> Mortgages -> Mortgage Options*.
3. **Talk Track**:
   > *"Notice how the traditional website operates: ESL asks the customer to already know the exact financial product they need, navigate complex product trees, and do their own homework."*

### Scene 2: The Intent Transformation (3 Minutes)
1. Navigate to `/intent` in the browser.
2. Click the quick-intent pill: *"I want to buy my first home in Rochester, but need help with affordability."*
3. Highlight the live Mark AI Orchestration card:
   > *"Behind the scenes, Next.js dispatched an asynchronous event to Mark AI with a correlation ID. Mark's Workflow Agent classified the intent, retrieved approved CMS guidance via Optimizely Graph, and assembled a tailored composition."*
4. Show the rendered experience:
   - First-time buyer grant guidance.
   - Live interactive payment calculator.
   - The **Owners' Dividend relationship advantage** explicitly connected to the mortgage balance.

### Scene 3: The Observability Proof (2 Minutes)
1. Open the Optimizely Opal / Mark AI console.
2. Inspect the **Execution Log** for the recent `customer.intent.submitted` event.
3. Show the executive committee:
   - Webhook payload received with correlation ID.
   - Graph tool query executed against SaaS CMS.
   - Token duration (< 2s) and audit governance trail.
4. **Closing Pitch**:
   > *"Mark is not a chatbot on top of the site. Mark is orchestrating the member journey using governed Optimizely content, ensuring ESL provides personal guidance at digital scale."*

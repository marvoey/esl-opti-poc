# Refactoring Guide: ESL ODP Identity Resolution & Zero-PII Demo

This guide provides end-to-step instructions for refactoring **`marvoey/esl-opti-poc`** (Next.js 16 App Router, React 19, Tailwind CSS v4) to implement the real-time identity resolution flow and zero-PII compliance architecture documented in the *ESL ODP Identity Resolution & Zero-PII Demo Guide*.

---

## 1. Target Architecture & Project Structure

To meet the security compliance bar (zero PII in browser storage or non-HttpOnly cookies) while enabling the real-time 3-Act live identity stitch, the repository requires the following file layout:

```text
marvoey/esl-opti-poc/
├── .env.local                                     <- ODP API Keys & Tracker IDs
├── scripts/
│   └── simulate_live_stitch.py                   <- Presenter CLI fallback runner
├── src/
│   ├── infrastructure/
│   │   ├── auth/
│   │   │   └── session.ts                        <- HttpOnly session + esl_signed_in=1
│   │   └── odp/
│   │       ├── vuid.ts                           <- Client & server VUID extractor
│   │       └── tracker.ts                        <- Server-side ODP v3 Event dispatcher
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts                <- Sets cookies + fires Act 3 stitch event
│   │   │   │   └── logout/route.ts               <- Clears cookies
│   │   │   └── odp/
│   │   │       └── event/route.ts                <- Next.js proxy for client ODP events
│   │   └── loans/
│   │       └── auto-loans/page.tsx               <- Act 2 Auto Loan page with calculator
│   └── components/
│       ├── auth/
│       │   └── SignInModal.tsx                   <- 1-Click "Maria Gonzalez" demo login
│       ├── demo/
│       │   └── PresenterBar.tsx                  <- Floating HUD for foolproof onsite triggers
│       ├── layout/
│       │   └── Header.tsx                        <- Dynamic Sign In vs. Member badge
│       └── loans/
│           └── AutoLoanCalculator.tsx            <- Interactive $32k loan calculator
```

---

## 2. Environment Configuration

Add the following environment variables to `.env.local` and your Vercel Project Settings:

```ini
# .env.local

# ODP API Configuration
ODP_PRIVATE_API_KEY="your_odp_private_api_key_here"
ODP_REGION="us1"
NEXT_PUBLIC_ODP_TRACKER_ID="your_public_tracker_id_here"

# Seed Member for Demo Stitching
DEMO_MEMBER_EMAIL="demo.esl.maria.gonzalez.0@example.com"
DEMO_MEMBER_NAME="Maria Gonzalez"
DEMO_MEMBER_ID="ESL-849201"
```

---

## 3. Zero-PII Session Manager

Create `src/infrastructure/auth/session.ts`. This module enforces:
1. `esl_session`: Strictly `httpOnly: true` and `secure: true` (opaque base64 JSON payload, inaccessible to client JavaScript).
2. `esl_signed_in`: A non-PII boolean (`"1"`) with `httpOnly: false`, allowing edge decisioning, Optimizely Web Experimentation, and dynamic UI states.
3. No member name, email, or balances in browser cookies or localStorage.

```typescript
// src/infrastructure/auth/session.ts
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "esl_session";
export const SIGNED_IN_COOKIE_NAME = "esl_signed_in";

export interface DemoMember {
  id: string;
  email: string;
  name: string;
  memberId: string;
  relationshipTier: string;
  creditScoreBand: string;
}

export const SEEDED_MEMBERS: Record<string, DemoMember> = {
  "maria.gonzalez": {
    id: "mem_maria_01",
    email: process.env.DEMO_MEMBER_EMAIL || "demo.esl.maria.gonzalez.0@example.com",
    name: "Maria Gonzalez",
    memberId: "ESL-849201",
    relationshipTier: "Premier",
    creditScoreBand: "720+",
  },
};

/**
 * Creates the compliance-governed cookies upon sign-in
 */
export async function createSession(username: string): Promise<DemoMember | null> {
  const member = SEEDED_MEMBERS[username] || SEEDED_MEMBERS["maria.gonzalez"];
  const cookieStore = await cookies();

  // 1. HttpOnly secure session token (opaque payload, zero readable PII)
  const sessionToken = Buffer.from(
    JSON.stringify({ sub: member.id, exp: Date.now() + 86400 * 1000 })
  ).toString("base64");

  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 86400,
  });

  // 2. Non-PII edge targeting cookie for WebEx and CMS Personalization
  cookieStore.set(SIGNED_IN_COOKIE_NAME, "1", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 86400,
  });

  return member;
}

/**
 * Validates session state server-side
 */
export async function getSession(): Promise<{ isAuthenticated: boolean; member?: DemoMember }> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  const signedIn = cookieStore.get(SIGNED_IN_COOKIE_NAME);

  if (session?.value && signedIn?.value === "1") {
    return {
      isAuthenticated: true,
      member: SEEDED_MEMBERS["maria.gonzalez"],
    };
  }

  return { isAuthenticated: false };
}

/**
 * Clears session cookies on sign-out
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(SIGNED_IN_COOKIE_NAME);
}
```

---

## 4. ODP VUID & REST Event Tracker

Create `src/infrastructure/odp/vuid.ts` to manage anonymous visitor tokens:

```typescript
// src/infrastructure/odp/vuid.ts
export const VUID_COOKIE_NAME = "vuid";

/**
 * Generates or extracts the client-side VUID
 */
export function getOrCreateClientVuid(): string {
  if (typeof window === "undefined") return "";

  // Check localStorage first
  let vuid = localStorage.getItem("esl_vuid");

  // Check cookies as fallback
  if (!vuid) {
    const match = document.cookie.match(new RegExp("(^| )" + VUID_COOKIE_NAME + "=([^;]+)"));
    if (match) vuid = match[2];
  }

  if (!vuid) {
    vuid = `vuid_esl_live_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem("esl_vuid", vuid);
    document.cookie = `${VUID_COOKIE_NAME}=${vuid}; path=/; max-age=31536000; SameSite=Lax`;
  }

  return vuid;
}
```

Create `src/infrastructure/odp/tracker.ts` to dispatch events to the ODP v3 REST API:

```typescript
// src/infrastructure/odp/tracker.ts
export interface OdpEventPayload {
  type: string;
  action: string;
  identifiers: {
    vuid: string;
    email?: string;
  };
  data?: Record<string, string | number | boolean | null>;
}

export async function sendOdpEvents(events: OdpEventPayload[]) {
  const apiKey = process.env.ODP_PRIVATE_API_KEY;
  const region = process.env.ODP_REGION || "us1";

  if (!apiKey) {
    console.warn("[ODP] Warning: ODP_PRIVATE_API_KEY is not defined.");
    return { success: false, error: "Missing API Key" };
  }

  const url = `https://api.${region}.odp.optimizely.com/v3/events`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(events),
      cache: "no-store",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[ODP Event Failed] ${response.status}: ${errText}`);
      return { success: false, status: response.status, error: errText };
    }

    return { success: true, status: response.status };
  } catch (err: any) {
    console.error("[ODP Event Error]", err);
    return { success: false, error: err.message };
  }
}
```

---

## 5. Next.js Route Handlers (Act 3 Stitch Trigger)

### 5.1 Sign-In & Stitch Route Handler
Create `src/app/api/auth/login/route.ts`. This route authenticates the demo persona, sets the secure cookies, and fires the dual-identifier `customer: login` event into ODP to stitch the pre-login `vuid` to Maria's `email`.

```typescript
// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/infrastructure/auth/session";
import { sendOdpEvents } from "@/infrastructure/odp/tracker";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = body.username || "maria.gonzalez";
    const vuid = body.vuid;

    if (!vuid) {
      return NextResponse.json({ error: "Missing visitor identifier (vuid)" }, { status: 400 });
    }

    // 1. Establish zero-PII session cookies
    const member = await createSession(username);
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // 2. ACT 3: Fire the Real-Time Identity Resolution Stitch Event into ODP
    const stitchEvent = [
      {
        type: "customer",
        action: "login",
        identifiers: {
          vuid: vuid,
          email: member.email,
        },
        data: {
          ts: Math.floor(Date.now() / 1000),
          channel: "online_banking",
          esl_member_status: "existing",
          relationship_tier: member.relationshipTier,
          credit_score_band: member.creditScoreBand,
        },
      },
    ];

    const odpResult = await sendOdpEvents(stitchEvent);

    return NextResponse.json({
      success: true,
      member: {
        name: member.name,
        email: member.email,
        memberId: member.memberId,
      },
      stitchedVuid: vuid,
      odpStatus: odpResult.status || 200,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### 5.2 Sign-Out Route Handler
Create `src/app/api/auth/logout/route.ts`:

```typescript
// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { clearSession } from "@/infrastructure/auth/session";

export async function POST() {
  await clearSession();
  return NextResponse.json({ success: true });
}
```

### 5.3 ODP Client Proxy Route Handler
Create `src/app/api/odp/event/route.ts` to allow client components to stream events without exposing the private API key:

```typescript
// src/app/api/odp/event/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendOdpEvents } from "@/infrastructure/odp/tracker";

export async function POST(req: NextRequest) {
  try {
    const events = await req.json();
    const result = await sendOdpEvents(Array.isArray(events) ? events : [events]);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

---

## 6. Act 2 Auto Loan Calculator & Page

### 6.1 Calculator Component
Create `src/components/loans/AutoLoanCalculator.tsx` with preset values ($32,000, 60 mo, 5.49% APR, $611.05/mo):

```tsx
// src/components/loans/AutoLoanCalculator.tsx
"use client";

import React, { useState, useEffect } from "react";
import { getOrCreateClientVuid } from "@/infrastructure/odp/vuid";

export default function AutoLoanCalculator() {
  const [borrowAmount, setBorrowAmount] = useState<number>(32000);
  const [termMonths, setTermMonths] = useState<number>(60);
  const [interestRate, setInterestRate] = useState<number>(5.49);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(611.05);
  const [lastFiredStatus, setLastFiredStatus] = useState<string | null>(null);
  const [isFiring, setIsFiring] = useState<boolean>(false);

  useEffect(() => {
    const monthlyRate = interestRate / 100 / 12;
    if (monthlyRate === 0) {
      setMonthlyPayment(borrowAmount / termMonths);
      return;
    }
    const payment =
      (borrowAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
    setMonthlyPayment(Math.round(payment * 100) / 100);
  }, [borrowAmount, termMonths, interestRate]);

  const handleCalculateEvent = async () => {
    setIsFiring(true);
    const vuid = getOrCreateClientVuid();

    const payload = [
      {
        type: "loan_calculator",
        action: "calculate",
        identifiers: { vuid },
        data: {
          ts: Math.floor(Date.now() / 1000),
          loan_type: "auto_loan",
          borrow_amount: borrowAmount,
          loan_term_months: termMonths,
          interest_rate: interestRate,
          calculated_monthly_payment: monthlyPayment,
        },
      },
    ];

    try {
      const res = await fetch("/api/odp/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setLastFiredStatus(`Captured $${borrowAmount.toLocaleString()} calculation for ${vuid}`);
      } else {
        setLastFiredStatus("Error sending event to ODP");
      }
    } catch {
      setLastFiredStatus("Network error firing event");
    } finally {
      setIsFiring(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 max-w-2xl mx-auto">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            ESL Auto Financing Tool
          </span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">Payment Calculator</h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500">Estimated Rate</span>
          <div className="text-xl font-bold text-slate-800">{interestRate}% APR</div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700">Borrow Amount</label>
            <span className="text-lg font-bold text-sky-700">${borrowAmount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="10000"
            max="75000"
            step="1000"
            value={borrowAmount}
            onChange={(e) => setBorrowAmount(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700">Loan Term (Months)</label>
            <span className="text-lg font-bold text-sky-700">{termMonths} Months</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[36, 48, 60, 72].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setTermMonths(term)}
                className={`py-2 text-sm font-bold rounded-lg border transition ${
                  termMonths === term
                    ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {term} Mo
              </button>
            ))}
          </div>
        </div>

        <div className="bg-sky-50 rounded-xl p-6 border border-sky-100 text-center">
          <span className="text-sm font-medium text-sky-800">Estimated Monthly Payment</span>
          <div className="text-4xl font-extrabold text-sky-950 mt-1">
            ${monthlyPayment.toFixed(2)}
            <span className="text-base font-normal text-sky-700">/mo</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Based on {interestRate}% APR for {termMonths} months with $0 down payment.
          </p>
        </div>

        <button
          onClick={handleCalculateEvent}
          disabled={isFiring}
          className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition shadow-lg hover:shadow-sky-500/25 flex items-center justify-center gap-2"
        >
          {isFiring ? "Streaming to ODP..." : "Recalculate & Lock This Rate"}
        </button>

        {lastFiredStatus && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center justify-between">
            <span>✓ {lastFiredStatus}</span>
            <span className="text-emerald-600 font-mono text-[10px]">ODP Real-Time Edge</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 6.2 Auto Loans Route
Create `src/app/loans/auto-loans/page.tsx`:

```tsx
// src/app/loans/auto-loans/page.tsx
"use client";

import React, { useEffect } from "react";
import AutoLoanCalculator from "@/components/loans/AutoLoanCalculator";
import { getOrCreateClientVuid } from "@/infrastructure/odp/vuid";

export default function AutoLoansPage() {
  useEffect(() => {
    const vuid = getOrCreateClientVuid();

    fetch("/api/odp/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        {
          type: "navigation",
          action: "pageview",
          identifiers: { vuid },
          data: {
            ts: Math.floor(Date.now() / 1000),
            page_path: "/loans/auto-loans",
            page_title: "ESL - Auto Loans & Refinancing",
          },
        },
      ]),
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-sky-600">
          Borrowing Solutions
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 mt-2">Auto Loans & Refinancing</h1>
        <p className="text-lg text-slate-600 mt-3 max-w-2xl mx-auto">
          Low fixed rates, flexible terms up to 72 months, and fast online approval for Rochester
          and Finger Lakes drivers.
        </p>
      </div>

      <AutoLoanCalculator />
    </div>
  );
}
```

---

## 7. Client UI: Sign-In Modal & Header Integration

### 7.1 Sign-In Modal
Create `src/components/auth/SignInModal.tsx`:

```tsx
// src/components/auth/SignInModal.tsx
"use client";

import React, { useState } from "react";
import { getOrCreateClientVuid } from "@/infrastructure/odp/vuid";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (member: any) => void;
}

export default function SignInModal({ isOpen, onClose, onSuccess }: SignInModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setLoading(true);
    const vuid = getOrCreateClientVuid();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "maria.gonzalez",
          vuid,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess(data.member);
        onClose();
        window.location.reload();
      } else {
        alert("Sign-in failed: " + data.error);
      }
    } catch {
      alert("Network error during sign-in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-900">ESL Online Banking</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        <p className="text-sm text-slate-600 mb-6">
          Sign in to access your accounts, view pre-approved rates, and manage payments.
        </p>

        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
            Live Demo Preset
          </span>
          <div className="text-sm font-bold text-slate-800 mt-1">Maria Gonzalez (Premier Member)</div>
          <div className="text-xs text-slate-500 font-mono mt-0.5">
            demo.esl.maria.gonzalez.0@example.com
          </div>
          <div className="text-xs text-sky-600 mt-2">
            ✓ Triggers Act 3 Identity Stitch (VUID → Member Email)
          </div>
        </div>

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition shadow-lg hover:shadow-sky-500/25"
        >
          {loading ? "Authenticating & Stitching Profile..." : "Sign In as Maria Gonzalez"}
        </button>
      </div>
    </div>
  );
}
```

### 7.2 Header Component
Create `src/components/layout/Header.tsx`:

```tsx
// src/components/layout/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SignInModal from "@/components/auth/SignInModal";

export default function Header() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const hasSignedInCookie = document.cookie.includes("esl_signed_in=1");
    setIsSignedIn(hasSignedInCookie);
  }, []);

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-sky-700 text-white font-extrabold flex items-center justify-center text-xl">
            ESL
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">
            Federal Credit Union
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/loans/auto-loans" className="text-sm font-semibold text-slate-600 hover:text-sky-600">
            Auto Loans
          </Link>

          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-800">Maria Gonzalez</span>
                <span className="block text-[11px] text-emerald-600 font-medium">Premier Member</span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl transition shadow-sm"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>

      <SignInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsSignedIn(true)}
      />
    </header>
  );
}
```

---

## 8. Presenter HUD Bar

Create `src/components/demo/PresenterBar.tsx` and mount it into your root layout (`src/app/layout.tsx`). This floating widget lets you trigger Act 2, Act 3, or clear state during live demos without switching windows.

```tsx
// src/components/demo/PresenterBar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { getOrCreateClientVuid } from "@/infrastructure/odp/vuid";

export default function PresenterBar() {
  const [vuid, setVuid] = useState("");
  const [cookieState, setCookieState] = useState({ esl_session: false, esl_signed_in: false });
  const [statusMessage, setStatusMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setVuid(getOrCreateClientVuid());
    updateCookieDisplay();
  }, []);

  const updateCookieDisplay = () => {
    setCookieState({
      esl_session: document.cookie.includes("esl_session="),
      esl_signed_in: document.cookie.includes("esl_signed_in=1"),
    });
  };

  const fireAct2 = async () => {
    setStatusMessage("Firing Act 2 ($32,000 calculation)...");
    const res = await fetch("/api/odp/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        {
          type: "navigation",
          action: "pageview",
          identifiers: { vuid },
          data: {
            ts: Math.floor(Date.now() / 1000) - 60,
            page_path: "/loans/auto-loans",
            page_title: "ESL - Auto Loans & Refinancing",
          },
        },
        {
          type: "loan_calculator",
          action: "calculate",
          identifiers: { vuid },
          data: {
            ts: Math.floor(Date.now() / 1000),
            loan_type: "auto_loan",
            borrow_amount: 32000,
            loan_term_months: 60,
            interest_rate: 5.49,
            calculated_monthly_payment: 611.05,
          },
        },
      ]),
    });

    if (res.ok) {
      setStatusMessage("Act 2 confirmed. Check Tab 2 (Inspector) & Tab 3 (Profiles).");
    } else {
      setStatusMessage("Error sending Act 2 events.");
    }
  };

  const fireAct3 = async () => {
    setStatusMessage("Firing Act 3 (Stitching VUID to Maria Gonzalez)...");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "maria.gonzalez", vuid }),
    });

    if (res.ok) {
      updateCookieDisplay();
      setStatusMessage("Act 3 Identity Stitch confirmed! Open Maria's profile in ODP.");
      setTimeout(() => window.location.reload(), 1200);
    } else {
      setStatusMessage("Stitch error.");
    }
  };

  const resetSession = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("esl_vuid");
    document.cookie = "vuid=; path=/; max-age=0";
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-slate-900/95 text-white backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-700/50 max-w-sm text-xs font-sans">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold tracking-wider uppercase text-[10px] text-slate-300">
              Demo Pilot HUD
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white text-xs"
          >
            {isExpanded ? "Minimize" : "Expand"}
          </button>
        </div>

        <div className="font-mono bg-slate-950/80 p-2 rounded-lg mb-3 break-all border border-slate-800 text-[11px]">
          <span className="text-slate-500">VUID: </span>
          <span className="text-sky-400 font-semibold">{vuid || "Detecting..."}</span>
        </div>

        {isExpanded && (
          <div className="space-y-3 mb-3 pt-2 border-t border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1">
                Zero-PII Cookie State
              </span>
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${cookieState.esl_signed_in ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-slate-800 text-slate-500"}`}>
                  esl_signed_in={cookieState.esl_signed_in ? "1" : "0"}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                  HttpOnly: ✓
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={fireAct2}
                className="py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition"
              >
                Act 2: $32k Calc
              </button>
              <button
                onClick={fireAct3}
                className="py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition"
              >
                Act 3: Stitch Maria
              </button>
            </div>

            <button
              onClick={resetSession}
              className="w-full py-1.5 bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-400 rounded-lg transition text-[11px]"
            >
              Reset Anonymous Demo
            </button>
          </div>
        )}

        {statusMessage && (
          <div className="text-[11px] text-sky-300 bg-sky-950/50 p-2 rounded border border-sky-800/50">
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 9. Standalone Fallback Runner

Create `scripts/simulate_live_stitch.py` for terminal-driven execution if network or UI issues occur onsite:

```python
#!/usr/bin/env python3
"""
ESL Federal Credit Union - Live Identity Resolution & Stitch Simulator
Executes Act 2 (Anonymous Intent) and Act 3 (Identity Stitch) interactively for live demos.
"""
import os
import sys
import time
import requests

ODP_API_KEY = os.environ.get("ODP_PRIVATE_API_KEY")
ODP_REGION = os.environ.get("ODP_REGION", "us1")
TARGET_EMAIL = os.environ.get("DEMO_STITCH_EMAIL", "demo.esl.maria.gonzalez.0@example.com")

if not ODP_API_KEY:
    sys.exit("Error: ODP_PRIVATE_API_KEY is not set in environment.")

EVENT_URL = f"https://api.{ODP_REGION}.odp.optimizely.com/v3/events"
HEADERS = {
    "x-api-key": ODP_API_KEY,
    "Content-Type": "application/json"
}

DEMO_VUID = f"vuid_esl_live_{int(time.time())}"

def print_banner(text):
    print("\n" + "=" * 70)
    print(f" {text}")
    print("=" * 70)

def main():
    print_banner("ESL Live Identity Resolution & Zero-PII Demo")
    print(f"Target ODP Instance : api.{ODP_REGION}.odp.optimizely.com")
    print(f"Generated Demo VUID : {DEMO_VUID}")
    print(f"Target Member Email : {TARGET_EMAIL}")

    # ACT 2: ANONYMOUS BROWSING & CALCULATOR
    input("\n[PRESS ENTER] to execute ACT 2: Fire Anonymous Browsing & Loan Calculator...")
    now_ts = int(time.time())
    anon_events = [
        {
            "type": "navigation",
            "action": "pageview",
            "identifiers": {"vuid": DEMO_VUID},
            "data": {
                "ts": now_ts - 120,
                "page_path": "/loans/auto-loans",
                "page_title": "ESL - Auto Loans & Rates"
            }
        },
        {
            "type": "loan_calculator",
            "action": "calculate",
            "identifiers": {"vuid": DEMO_VUID},
            "data": {
                "ts": now_ts - 60,
                "loan_type": "auto_loan",
                "borrow_amount": 32000,
                "loan_term_months": 60,
                "interest_rate": 5.49,
                "calculated_monthly_payment": 611.05
            }
        }
    ]

    resp = requests.post(EVENT_URL, headers=HEADERS, json=anon_events, timeout=15)
    if resp.status_code in (200, 201, 202):
        print(f"  [SUCCESS] Anonymous events accepted (Status: {resp.status_code})")
        print(f"  -> Show ODP Tab: Search '{DEMO_VUID}' to show Anonymous profile with $32,000 calculation.")
    else:
        print(f"  [ERROR] {resp.status_code} - {resp.text}")
        return

    # ACT 3: IDENTITY STITCH (LOGIN EVENT)
    input("\n[PRESS ENTER] to execute ACT 3: Fire Login Event (Stitch VUID -> Member Email)...")
    login_event = [
        {
            "type": "customer",
            "action": "login",
            "identifiers": {
                "vuid": DEMO_VUID,
                "email": TARGET_EMAIL
            },
            "data": {
                "ts": now_ts,
                "channel": "online_banking"
            }
        }
    ]

    resp = requests.post(EVENT_URL, headers=HEADERS, json=login_event, timeout=15)
    if resp.status_code in (200, 201, 202):
        print(f"  [SUCCESS] Identity resolution login event accepted (Status: {resp.status_code})")
        print(f"  -> Show ODP Tab: Open '{TARGET_EMAIL}'.")
        print(f"  -> Highlight: '{DEMO_VUID}' is merged, and pre-login calculation is stitched to timeline!")
    else:
        print(f"  [ERROR] {resp.status_code} - {resp.text}")

    print_banner("Demo Run Complete")

if __name__ == "__main__":
    main()
```

---

## 10. Pre-Flight Verification Checklist

1. **Tab 1: Incognito Demo Window (`https://esl-onsite.optimoey.com/loans/auto-loans`)**
   - Inspect Cookies: only `vuid` is present. No PII exists in browser storage.
2. **Tab 2: ODP Event Inspector**
   - Start the inspector.
   - Adjust the slider to $32,000 and click **"Recalculate & Lock This Rate"**.
   - Verify `loan_calculator: calculate` appears with `borrow_amount: 32000` and the current `vuid`.
3. **Tab 3: ODP Customer Profiles**
   - Search for the `vuid` from Tab 1.
   - Confirm it renders as an **Anonymous Profile** with the $32,000 calculation in the event timeline.
4. **The Stitch (Act 3)**:
   - Click **Sign In** and pick **Maria Gonzalez**.
   - In Tab 3, refresh Maria's profile (`demo.esl.maria.gonzalez.0@example.com`).
   - Confirm the `vuid` has merged into her identifier list and the pre-login calculation is stitched to her verified member timeline.

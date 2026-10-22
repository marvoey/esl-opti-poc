# Architecture & Implementation Decision: Interactive Reveal.js Presentation for ESL PoC

> **Target Repository**: `marvoey/esl-opti-poc` (Next.js 16.3.4, React 19.2.8, App Router, Tailwind CSS v4)  
> **Source Material**: ESL Dry-Run Breakout Sessions Guide  
> **Primary Goal**: Deliver an interactive, modular presentation embedded directly into the Next.js demo application for Friday's dry-run and onsite presentations.

---

## 1. Decision Matrix & Framework Evaluation

| Framework / Approach | React 19 & Next.js 16 Compatibility | Architecture & CSS Isolation | Presenter Capabilities (Overview, Clicker, Timer) | Trade-Offs & Limitations | Verdict |
|---|---|---|---|---|---|
| **Reveal.js (`reveal.js`)** | ⚠️ **Client Boundary Required**<br>DOM-driven; runs via dynamic import in a leaf client component. | ⭐⭐⭐⭐⭐ **High**<br>Scoped to an isolated App Router route (`/dry-run-deck`); zero CSS bleed into core credit union components. | ⭐⭐⭐⭐⭐ **Best-in-Class**<br>2D grid matrix (`ESC`), vertical sub-slides, native presenter console (`S`), PDF export (`?print-pdf`), slide fragments. | Requires client-side lifecycle management and cleanup on unmount. | **SELECTED (Winner)** |
| **Native Custom Build (Embla Carousel + Tailwind v4)** | ⭐⭐⭐⭐⭐ **Native**<br>Already installed in `package.json` (`embla-carousel-react`). | ⭐⭐⭐⭐⭐ **Perfect**<br>Reuses existing design tokens without additional bundle dependencies. | ⭐⭐ **Basic**<br>Lacks 2D vertical drill-down, speaker notes window, elapsed time counters, or overview matrix. | High engineering overhead to custom-build speaker notes, keyboard listeners, and slide state. | **Fallback Only** |
| **Spectacle (Formidable Labs)** | ❌ **High Risk**<br>Peer dependency conflicts with React 19 and Next.js 16 Server Components. | ⚠️ **Moderate**<br>Legacy CSS-in-JS primitives create SSR hydration mismatches in React 19. | ⭐⭐⭐⭐ **Good**<br>Has presenter mode and step transitions. | Stalls build pipelines on React 19; unmaintained for modern Next.js App Router streaming. | **Disqualified** |
| **Slidev** | ❌ **Incompatible**<br>Vite/Vue 3 engine. | ❌ **Fails**<br>Cannot run natively inside a Next.js App Router tree. | ⭐⭐⭐⭐⭐ **Excellent**<br>Rich dev-centric presentation system. | Would require running an external service/port or embedding via an external `<iframe>`. | **Disqualified** |
| **MDX-Deck** | ❌ **Incompatible**<br>Unmaintained legacy package. | ❌ **Fails** | ⭐⭐ **Dated** | Incompatible with React 19 and modern Webpack/Turbopack tooling. | **Disqualified** |

---

## 2. Why Reveal.js Solves the ESL Rotating Audience Challenge

1. **Non-Linear 2D Navigation (Overview Matrix via `ESC`)**:
   * Breakout sessions occur throughout the day for rotating stakeholder groups (Data teams at 2:00 PM, Marketers at 3:00 PM, Compliance at 10:00 AM, Engineering at 10:30 AM).
   * Reveal.js organizes horizontal slides for broad agenda milestones (Morning vs. Afternoon, Day 1 vs. Day 2) and vertical slides for session run-of-shows.
   * Pressing `ESC` brings up a birds-eye grid allowing the presenter to click directly into any breakout without flipping past unrelated slides.
2. **Dual-Screen Presenter Console (`S` Key)**:
   * Opens an external speaker console containing slide preview, upcoming queue, speaker notes, and an active stopwatch (critical for 30-minute sessions like Governance and SDLC).
3. **Route Isolation (No Layout Pollution)**:
   * Colocating the presentation under `src/app/dry-run-deck/` keeps it outside `src/app/sites/[site]/`, preventing the main ESL site header, footer, and theme resets from interfering with slide styles.

---

## 3. Step-by-Step Implementation Guide

### Step 1: Install Dependencies
Run in the root of `esl-opti-poc`:

```bash
npm install reveal.js @types/reveal.js
```

---

### Step 2: Create Isolated Route Shell (`src/app/dry-run-deck/layout.tsx`)

This layout provides an isolated full-viewport container and imports Reveal.js styles without affecting public credit union routes:

```tsx
import type { Metadata } from "next";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";

export const metadata: Metadata = {
  title: "ESL Onsite Dry-Run Presentation",
  description: "Interactive breakout sessions guide and run-of-show deck",
  robots: { index: false, follow: false },
};

export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        backgroundColor: "#111827",
      }}
    >
      {children}
    </div>
  );
}
```

---

### Step 3: Implement Presentation Page (`src/app/dry-run-deck/page.tsx`)

Create the client-side component handling Reveal initialization, 2D slide hierarchy, custom styles, and talk tracks:

```tsx
"use client";

import React, { useEffect, useRef } from "react";

export default function DryRunPresentation() {
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let deckInstance: any = null;

    async function initReveal() {
      if (typeof window === "undefined" || !deckRef.current) return;
      const Reveal = (await import("reveal.js")).default;

      deckInstance = new Reveal(deckRef.current, {
        hash: true,
        slideNumber: "c/t",
        transition: "slide",
        controls: true,
        progress: true,
        center: true,
        keyboard: true,
        overview: true,
        embedded: false,
      });

      await deckInstance.initialize();
    }

    initReveal();

    return () => {
      try {
        if (deckInstance) {
          deckInstance.destroy();
        }
      } catch {
        // Safe teardown
      }
    };
  }, []);

  return (
    <div
      className="reveal"
      ref={deckRef}
      style={{ width: "100%", height: "100%", color: "#F9FAFB" }}
    >
      <div className="slides">

        {/* ============================================================== */}
        {/* TITLE SLIDE: CONTEXT & GOLDEN THREAD                          */}
        {/* ============================================================== */}
        <section>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "2.4em", marginBottom: "0.2em", color: "#FFFFFF" }}>
              ESL Federal Credit Union
            </h1>
            <h3 style={{ fontSize: "1.2em", color: "#38BDF8", fontWeight: 400 }}>
              Onsite Dry-Run: Modular Breakout Sessions Guide
            </h3>
            <p style={{ fontSize: "0.8em", marginTop: "1.5em", color: "#9CA3AF" }}>
              The Golden Thread: <em>Anonymous Prospect → Verified Member Relationship</em>
            </p>
            <div style={{ marginTop: "2em", fontSize: "0.65em", color: "#6B7280" }}>
              Press <strong>ESC</strong> for Session Overview Matrix &bull; Press <strong>S</strong> for Speaker Console
            </div>
          </div>
          <aside className="notes">
            Frame the meeting upfront: 6 modular sessions, designed for rotating teams. Every breakout starts with the 90-second reset so nobody feels lost.
          </aside>
        </section>

        {/* ============================================================== */}
        {/* DAY 1 OVERVIEW SLIDE                                           */}
        {/* ============================================================== */}
        <section>
          <h2>Day 1 (Oct 27): Audience, Relevance & Optimization</h2>
          <p style={{ color: "#9CA3AF", fontSize: "0.8em" }}>
            Connecting real-time audience discovery to front-end personalization and testing.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginTop: "1.5em", textAlign: "left", fontSize: "0.7em" }}>
            <div style={{ background: "#1F2937", padding: "16px", borderRadius: "8px", borderTop: "4px solid #38BDF8" }}>
              <h4 style={{ color: "#FFFFFF", marginBottom: "8px" }}>1. CDP (ODP)</h4>
              <p>2:00 PM – 3:00 PM (60m)</p>
              <p style={{ color: "#9CA3AF" }}>Data architecture, profile unification, real-time segment creation without batch lag.</p>
            </div>
            <div style={{ background: "#1F2937", padding: "16px", borderRadius: "8px", borderTop: "4px solid #34D399" }}>
              <h4 style={{ color: "#FFFFFF", marginBottom: "8px" }}>2. Personalization</h4>
              <p>3:00 PM – 4:00 PM (60m)</p>
              <p style={{ color: "#9CA3AF" }}>Tailoring experience for Prospects (acquisition) vs. Members (cross-sell rate cards).</p>
            </div>
            <div style={{ background: "#1F2937", padding: "16px", borderRadius: "8px", borderTop: "4px solid #F472B6" }}>
              <h4 style={{ color: "#FFFFFF", marginBottom: "8px" }}>3. Experimentation</h4>
              <p>4:00 PM – 5:00 PM (60m)</p>
              <p style={{ color: "#9CA3AF" }}>Live A/B test (learning) vs. Multi-Armed Bandit (traffic shifting during promotions).</p>
            </div>
          </div>
          <p style={{ fontSize: "0.65em", marginTop: "1.5em", color: "#6B7280" }}>
            Navigate right (→) to start Breakout 1 &bull; Navigate down (↓) for tactical session drill-downs.
          </p>
        </section>

        {/* ============================================================== */}
        {/* BREAKOUT 1: CUSTOMER DATA PLATFORM (2D STACK)                 */}
        {/* ============================================================== */}
        <section>
          {/* 1.1 High-Level Hook */}
          <section>
            <span style={{ fontSize: "0.7em", color: "#38BDF8", textTransform: "uppercase", letterSpacing: "1px" }}>
              Breakout 1 (2:00 PM – 3:00 PM &bull; 60 Mins)
            </span>
            <h2 style={{ marginTop: "0.2em" }}>Customer Data Platform (ODP)</h2>
            <p style={{ fontSize: "0.8em", color: "#D1D5DB" }}>
              <strong>Audience:</strong> Data Architects, Analytics Leads, BI Engineers, Lifecycle Marketers
            </p>
            <blockquote style={{ background: "#1F2937", padding: "12px 20px", borderLeft: "4px solid #38BDF8", fontSize: "0.75em", fontStyle: "italic", textAlign: "left", margin: "1.5em auto" }}>
              "Financial institutions don't have a data shortage—they have an activation delay. Knowing someone is an existing member vs. a high-intent prospect only matters if the website reacts in milliseconds."
            </blockquote>
            <p style={{ fontSize: "0.65em", color: "#9CA3AF" }}>
              ↓ Press DOWN for Run-of-Show, Live Verification, and Q&A strategy
            </p>
          </section>

          {/* 1.2 Run of Show Breakdown */}
          <section>
            <h3>ODP Breakout: 60-Minute Run-of-Show</h3>
            <div style={{ textAlign: "left", fontSize: "0.7em", lineHeight: "1.6", marginTop: "1em" }}>
              <p><strong>00–05m | Context Reset & Audience Framing:</strong> Batch data (24-hour core banking warehouse lag) vs. streaming in-session events.</p>
              <p><strong>05–20m | Unified Profiles & Identity Resolution:</strong> Anonymous prospect browsing auto loans → identification at sign-in. Show zero-PII client leakage.</p>
              <p><strong>20–40m | Real-Time Audiences:</strong> Show live rule evaluation: <code>esl_member_status == 'existing'</code> vs. <code>'prospective'</code> with credit tiers.</p>
              <p><strong>40–50m | Downstream Activation:</strong> How ODP segments sync natively to WebEx and GraphQL without engineering tickets.</p>
              <p><strong>50–60m | Architecture, Governance & Security Q&A:</strong> PII controls, SOC2, warehouse sync (Snowflake/Databricks).</p>
            </div>
            <aside className="notes">
              Do not open the WebEx Visual Editor in this hour. Keep the focus strictly on data ingestion, identity resolution, and audience segmentation.
            </aside>
          </section>

          {/* 1.3 Key Screen to Show */}
          <section>
            <h3>ODP Live Environment Demo Target</h3>
            <ul style={{ textAlign: "left", fontSize: "0.75em", lineHeight: "1.7" }}>
              <li><strong>Customer Profiles Table:</strong> Search for seeded members (e.g., <code>maria.gonzalez</code> or <code>james.okafor</code>).</li>
              <li><strong>Customer Details Tab:</strong> Show custom banking attributes (<code>relationship_tier</code>, <code>credit_score_band</code>, <code>lending_interest</code>).</li>
              <li><strong>Event History Timeline:</strong> Verify loan calculations and branch locator events occurring chronologically.</li>
              <li><strong>Real-Time Segments Page:</strong> View active segments (<code>esl_existing_members_auto_refi</code>).</li>
            </ul>
          </section>
        </section>

        {/* ============================================================== */}
        {/* BREAKOUT 2: PERSONALIZATION (2D STACK)                         */}
        {/* ============================================================== */}
        <section>
          {/* 2.1 Hook */}
          <section>
            <span style={{ fontSize: "0.7em", color: "#34D399", textTransform: "uppercase", letterSpacing: "1px" }}>
              Breakout 2 (3:00 PM – 4:00 PM &bull; 60 Mins)
            </span>
            <h2 style={{ marginTop: "0.2em" }}>Personalization</h2>
            <p style={{ fontSize: "0.8em", color: "#D1D5DB" }}>
              <strong>Audience:</strong> Digital Experience Managers, Acquisition & Retention Leads, Content Strategists
            </p>
            <blockquote style={{ background: "#1F2937", padding: "12px 20px", borderLeft: "4px solid #34D399", fontSize: "0.75em", fontStyle: "italic", textAlign: "left", margin: "1.5em auto" }}>
              "Showing both prospects and members the same generic hero banner costs ESL conversions every day. True personalization combines structured CMS reuse with zero-flicker delivery."
            </blockquote>
            <p style={{ fontSize: "0.65em", color: "#9CA3AF" }}>
              ↓ Press DOWN for Live Experience Walkthrough and Marketer Workflow
            </p>
          </section>

          {/* 2.2 Run of Show */}
          <section>
            <h3>Personalization Breakout: Run-of-Show</h3>
            <div style={{ textAlign: "left", fontSize: "0.7em", lineHeight: "1.6", marginTop: "1em" }}>
              <p><strong>00–05m | Context Reset:</strong> Contrast the acquisition needs of a non-member vs. pre-approved borrowing needs of an active member.</p>
              <p><strong>05–20m | Front-End Experience Walkthrough:</strong> Load live site in incognito (Prospect) vs. signed-in as Maria Gonzalez (Member).</p>
              <p><strong>20–40m | Marketer Authoring Workflow:</strong> Open SaaS CMS Visual Builder; showcase Blueprint swapping and audience assignment without code deploys.</p>
              <p><strong>40–50m | Zero-Flicker & Performance:</strong> Explain client-side cookie evaluation (<code>esl_signed_in=1</code>) avoiding layout shifts.</p>
              <p><strong>50–60m | Personalization Operations & Q&A:</strong> Avoiding personalization sprawl, content governance, and editorial efficiency.</p>
            </div>
          </section>

          {/* 2.3 Site Verification */}
          <section>
            <h3>Live Demo Inspection: Member vs. Prospect</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", textAlign: "left", fontSize: "0.7em", marginTop: "1em" }}>
              <div style={{ background: "#1F2937", padding: "14px", borderRadius: "6px" }}>
                <h4 style={{ color: "#38BDF8" }}>Prospective Member (Anonymous)</h4>
                <ul>
                  <li>Header: "Join" & "Sign In" buttons</li>
                  <li>Hero: Trust badges & membership eligibility</li>
                  <li>CTA: "Become a Member" onboarding funnel</li>
                </ul>
              </div>
              <div style={{ background: "#1F2937", padding: "14px", borderRadius: "6px" }}>
                <h4 style={{ color: "#34D399" }}>Existing Member (Signed In)</h4>
                <ul>
                  <li>Header: Personalized Account Menu ("Maria Gonzalez")</li>
                  <li>Hero: Pre-approved 4.24% auto refinance rate card</li>
                  <li>CTA: 1-click loan application with pre-filled profile data</li>
                </ul>
              </div>
            </div>
          </section>
        </section>

        {/* ============================================================== */}
        {/* BREAKOUT 3: EXPERIMENTATION (2D STACK)                        */}
        {/* ============================================================== */}
        <section>
          {/* 3.1 Hook */}
          <section>
            <span style={{ fontSize: "0.7em", color: "#F472B6", textTransform: "uppercase", letterSpacing: "1px" }}>
              Breakout 3 (4:00 PM – 5:00 PM &bull; 60 Mins)
            </span>
            <h2 style={{ marginTop: "0.2em" }}>Experimentation</h2>
            <p style={{ fontSize: "0.8em", color: "#D1D5DB" }}>
              <strong>Audience:</strong> CRO & Optimization Leads, Growth PMs, Analytics & Data Science
            </p>
            <blockquote style={{ background: "#1F2937", padding: "12px 20px", borderLeft: "4px solid #F472B6", fontSize: "0.75em", fontStyle: "italic", textAlign: "left", margin: "1.5em auto" }}>
              "Not every test has the same goal. When you need learning and statistical certainty, use A/B testing. When you have a promotional rate campaign, you cannot afford to send 50% of traffic to a losing variation for 4 weeks."
            </blockquote>
            <p style={{ fontSize: "0.65em", color: "#9CA3AF" }}>
              ↓ Press DOWN for A/B vs. MAB Strategy and Stats Engine deep-dive
            </p>
          </section>

          {/* 3.2 Run of Show */}
          <section>
            <h3>Experimentation: Run-of-Show</h3>
            <div style={{ textAlign: "left", fontSize: "0.7em", lineHeight: "1.6", marginTop: "1em" }}>
              <p><strong>00–05m | Context Reset:</strong> The experimentation maturity spectrum in credit unions—from vanity tests to revenue drivers.</p>
              <p><strong>05–25m | Live A/B Test Deep-Dive:</strong> Structural value proposition testing on the landing page, Stats Engine sequential testing, FDR control.</p>
              <p><strong>25–45m | Multi-Armed Bandit (MAB):</strong> Promotional rate banner optimization shifting traffic dynamically to maximize conversions.</p>
              <p><strong>45–55m | Closing the Loop:</strong> Promoting the winning variant into permanent SaaS CMS content without developer backlogs.</p>
              <p><strong>55–60m | Stats Rigor & Q&A:</strong> Sample Ratio Mismatch (SRM), statistical power, and guardrail metrics.</p>
            </div>
          </section>
        </section>

        {/* ============================================================== */}
        {/* DAY 2 OVERVIEW SLIDE                                           */}
        {/* ============================================================== */}
        <section>
          <h2>Day 2 (Oct 28): Scale, Governance & SDLC</h2>
          <p style={{ color: "#9CA3AF", fontSize: "0.8em" }}>
            The enterprise operational foundation powering marketing agility and regulatory compliance.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginTop: "1.5em", textAlign: "left", fontSize: "0.7em" }}>
            <div style={{ background: "#1F2937", padding: "16px", borderRadius: "8px", borderTop: "4px solid #FBBF24" }}>
              <h4 style={{ color: "#FFFFFF", marginBottom: "8px" }}>4. DAM</h4>
              <p>9:00 AM – 10:00 AM (60m)</p>
              <p style={{ color: "#9CA3AF" }}>Content supply chain, direct CMS asset picker, dynamic crops, rights expiration.</p>
            </div>
            <div style={{ background: "#1F2937", padding: "16px", borderRadius: "8px", borderTop: "4px solid #A78BFA" }}>
              <h4 style={{ color: "#FFFFFF", marginBottom: "8px" }}>5. Governance</h4>
              <p>10:00 AM – 10:30 AM (30m)</p>
              <p style={{ color: "#9CA3AF" }}>Mandatory legal disclaimers, role permissions, audit trails, and brand guardrails.</p>
            </div>
            <div style={{ background: "#1F2937", padding: "16px", borderRadius: "8px", borderTop: "4px solid #60A5FA" }}>
              <h4 style={{ color: "#FFFFFF", marginBottom: "8px" }}>6. SDLC + Architecture</h4>
              <p>10:30 AM – 11:00 AM (30m)</p>
              <p style={{ color: "#9CA3AF" }}>Next.js 16 decoupled architecture, Optimizely Graph, CI/CD, and edge delivery.</p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* BREAKOUT 4: DAM (2D STACK)                                     */}
        {/* ============================================================== */}
        <section>
          <section>
            <span style={{ fontSize: "0.7em", color: "#FBBF24", textTransform: "uppercase", letterSpacing: "1px" }}>
              Breakout 4 (9:00 AM – 10:00 AM &bull; 60 Mins)
            </span>
            <h2 style={{ marginTop: "0.2em" }}>Digital Asset Management (DAM)</h2>
            <p style={{ fontSize: "0.8em", color: "#D1D5DB" }}>
              <strong>Audience:</strong> Creative Directors, Production Teams, Brand Managers, Marketing Ops
            </p>
            <blockquote style={{ background: "#1F2937", padding: "12px 20px", borderLeft: "4px solid #FBBF24", fontSize: "0.75em", fontStyle: "italic", textAlign: "left", margin: "1.5em auto" }}>
              "The hidden killer of personalization isn't targeting—it's content supply chain starvation. If creating, approving, and resizing assets takes weeks, experimentation stalls."
            </blockquote>
          </section>
          <section>
            <h3>DAM: Run-of-Show & Live Integration</h3>
            <ul style={{ textAlign: "left", fontSize: "0.7em", lineHeight: "1.7" }}>
              <li><strong>00–05m | Creative Bottlenecks in Banking:</strong> Manual asset resizing, expired regulatory imagery, and shared-drive chaos.</li>
              <li><strong>05–25m | Central Repository & AI Tagging:</strong> Auto-tagging by audience (<code>Audience: Member</code>) and product category.</li>
              <li><strong>25–45m | Native CMS Picker:</strong> Selecting approved DAM assets inside Visual Builder with responsive auto-cropping.</li>
              <li><strong>45–55m | Rights & Expiration Management:</strong> Auto-expiring promotional rate banners to eliminate compliance risk.</li>
              <li><strong>55–60m | Workflow & Creative Cloud Integration:</strong> Handoffs from Adobe CC into production.</li>
            </ul>
          </section>
        </section>

        {/* ============================================================== */}
        {/* BREAKOUT 5: GOVERNANCE (2D STACK - TIGHT 30 MINS)              */}
        {/* ============================================================== */}
        <section>
          <section>
            <span style={{ fontSize: "0.7em", color: "#A78BFA", textTransform: "uppercase", letterSpacing: "1px" }}>
              Breakout 5 (10:00 AM – 10:30 AM &bull; 30 Mins)
            </span>
            <h2 style={{ marginTop: "0.2em" }}>Governance & Compliance</h2>
            <p style={{ fontSize: "0.8em", color: "#D1D5DB" }}>
              <strong>Audience:</strong> Legal, Regulatory & Compliance Officers, Risk Management, Brand Custodians
            </p>
            <blockquote style={{ background: "#1F2937", padding: "12px 20px", borderLeft: "4px solid #A78BFA", fontSize: "0.75em", fontStyle: "italic", textAlign: "left", margin: "1.5em auto" }}>
              "In a financial institution, agility cannot come at the expense of regulatory compliance. Governance in Optimizely isn't an afterthought—it is enforced directly through our component architecture and approval workflows."
            </blockquote>
          </section>
          <section>
            <h3>Governance: 30-Minute Precision Agenda</h3>
            <div style={{ textAlign: "left", fontSize: "0.7em", lineHeight: "1.6" }}>
              <p><strong>00–05m | Governance by Design:</strong> Structural guardrails (design system), Regulatory guardrails (NCUA/disclosures), Operational guardrails (approvals).</p>
              <p><strong>05–15m | Visual Builder Guardrails (Show):</strong> How structured content types (e.g., <code>EslDisclosure</code>) prevent editors from removing required disclosures.</p>
              <p><strong>15–25m | Role Permissions & Audit Trails:</strong> Role separation (Author vs. Compliance Reviewer vs. Publisher) and version rollbacks.</p>
              <p><strong>25–30m | Compliance Q&A:</strong> Audit exportability, legal preview modes, disaster recovery.</p>
            </div>
          </section>
        </section>

        {/* ============================================================== */}
        {/* BREAKOUT 6: SDLC & ARCHITECTURE (2D STACK - TIGHT 30 MINS)     */}
        {/* ============================================================== */}
        <section>
          <section>
            <span style={{ fontSize: "0.7em", color: "#60A5FA", textTransform: "uppercase", letterSpacing: "1px" }}>
              Breakout 6 (10:30 AM – 11:00 AM &bull; 30 Mins)
            </span>
            <h2 style={{ marginTop: "0.2em" }}>Product Lifecycle & SDLC</h2>
            <p style={{ fontSize: "0.8em", color: "#D1D5DB" }}>
              <strong>Audience:</strong> Enterprise Architects, VP/Director of Engineering, Lead Developers, DevOps
            </p>
            <blockquote style={{ background: "#1F2937", padding: "12px 20px", borderLeft: "4px solid #60A5FA", fontSize: "0.75em", fontStyle: "italic", textAlign: "left", margin: "1.5em auto" }}>
              "Optimizely's SaaS CMS and Web Experimentation are built on a headless, API-first foundation. Engineering maintains full control of code, components, and deployment pipelines, while liberating marketing to manage content and targeting."
            </blockquote>
          </section>
          <section>
            <h3>Engineering Agenda: 30-Minute Run-of-Show</h3>
            <div style={{ textAlign: "left", fontSize: "0.7em", lineHeight: "1.6" }}>
              <p><strong>00–05m | Decoupled Architecture Blueprint:</strong> SaaS CMS → Optimizely Graph (GraphQL CDN) → Next.js 16 App Router on Vercel.</p>
              <p><strong>05–15m | Developer Workflow & Component Modeling:</strong> Schema definition in TypeScript, <code>optimizely-cms-cli</code> schema synchronization, Git CI/CD pipelines.</p>
              <p><strong>15–23m | Edge Performance & Zero Layout Shift:</strong> ISR cache tag revalidation (<code>/api/revalidate</code>), zero client-side layout shift (CLS), script delivery optimization.</p>
              <p><strong>23–30m | Architecture Q&A:</strong> GraphQL query performance, webhook latency, security boundaries.</p>
            </div>
          </section>
        </section>

        {/* ============================================================== */}
        {/* DAY 2 PM: EXECUTIVE POC DEMO STRATEGY                          */}
        {/* ============================================================== */}
        <section>
          <h2>The Afternoon Handoff: Executive PoC Demo</h2>
          <p style={{ color: "#38BDF8", fontSize: "0.85em" }}>Day 2 &bull; 1:40 PM – 2:40 PM (60 Mins)</p>
          <div style={{ background: "#1F2937", padding: "20px", borderRadius: "8px", textAlign: "left", fontSize: "0.75em", marginTop: "1.5em" }}>
            <h4 style={{ color: "#FFFFFF", marginBottom: "8px" }}>Critical Transition from Breakouts to Executive Demo</h4>
            <p><strong>In the Breakouts:</strong> You pulled back the curtain on the machinery (API calls, ODP AST definitions, Visual Builder configuration, developer CLI pushes).</p>
            <p style={{ marginTop: "10px" }}><strong>In the 1:40 PM Executive PoC:</strong> Switch entirely to the <em>executive business outcome narrative</em>. Run the live end-to-end journey uninterrupted:</p>
            <ol style={{ marginTop: "8px", marginLeft: "20px" }}>
              <li>Campaign conception in DAM</li>
              <li>Page assembly with regulatory blueprints in SaaS CMS</li>
              <li>Live visitor experience adapting from Anonymous Prospect to Loyal Member</li>
              <li>Measurable loan conversion acceleration via Multi-Armed Bandit</li>
            </ol>
          </div>
        </section>

      </div>
    </div>
  );
}
```

---

## 4. Key Keyboard Controls & Presenter Operations

| Keystroke | Function | When to Use During the Dry-Run |
|---|---|---|
| **`ESC`** | **Overview Grid** | Toggle a birds-eye matrix of all slides. Jump instantly to Breakout 5 or 6 when a new group enters the room. |
| **`S`** | **Speaker Console** | Opens a separate window with elapsed timer, current slide, next slide preview, and speaker notes. |
| **`Space` / `→`** | **Next Slide** | Standard clicker forward progression. |
| **`↓` (Down Arrow)** | **Vertical Sub-Slide** | Drill down into the specific run-of-show or technical verification without advancing the horizontal agenda. |
| **`F`** | **Fullscreen** | Expand to full presentation mode. |
| **`?print-pdf`** | **PDF Export** | Append to the URL (`/dry-run-deck?print-pdf`) and press `Cmd+P` / `Ctrl+P` to generate a leave-behind PDF deck. |

---

## 5. Verification & Deployment Checklist

1. **Verify Isolation**: Navigate to `http://localhost:5002/dry-run-deck` and ensure no header or footer from `src/app/sites/[site]/layout.tsx` is visible.
2. **Test Speaker View (`S`)**: Confirm that pop-ups are allowed so the speaker console opens in a dedicated window with an active timer.
3. **Test Keyboard Controls**: Verify that hardware presentation clickers advance slides smoothly.
4. **Deploy**: Push changes to the repository; Vercel will automatically build and deploy the interactive deck at `<your-vercel-domain>/dry-run-deck`.

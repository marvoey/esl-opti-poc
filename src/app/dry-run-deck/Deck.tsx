"use client";

import React, { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import styles from "./deck.module.css";

const accent = (color: string) => ({ "--deck-accent": color }) as CSSProperties;

const SKY = "#38bdf8";
const GREEN = "#34d399";
const PINK = "#f472b6";
const AMBER = "#fbbf24";
const VIOLET = "#a78bfa";
const BLUE = "#60a5fa";

function OverviewCard({
  color,
  title,
  time,
  children,
}: {
  color: string;
  title: string;
  time: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.card} style={accent(color)}>
      <h4>{title}</h4>
      <p>{time}</p>
      <p className={styles.cardMuted}>{children}</p>
    </div>
  );
}

function HookSlide({
  color,
  kicker,
  title,
  audience,
  quote,
  drill,
}: {
  color: string;
  kicker: string;
  title: string;
  audience: string;
  quote: string;
  drill?: string;
}) {
  return (
    <section style={accent(color)}>
      <span className={styles.kicker}>{kicker}</span>
      <h2 style={{ marginTop: "0.2em" }}>{title}</h2>
      <p className={styles.audience}>
        <strong>Audience:</strong> {audience}
      </p>
      <blockquote className={styles.quote}>{quote}</blockquote>
      {drill && <p className={styles.drill}>{drill}</p>}
    </section>
  );
}

export function Deck() {
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let deck: { destroy: () => void } | null = null;

    async function initReveal() {
      if (!deckRef.current) return;
      const [{ default: Reveal }, { default: RevealNotes }] = await Promise.all([
        import("reveal.js"),
        import("reveal.js/plugin/notes"),
      ]);
      if (cancelled || !deckRef.current) return;

      const instance = new Reveal(deckRef.current, {
        hash: true,
        slideNumber: "c/t",
        transition: "slide",
        controls: true,
        progress: true,
        center: true,
        keyboard: true,
        overview: true,
        embedded: false,
        plugins: [RevealNotes],
      });
      await instance.initialize();

      if (cancelled) {
        instance.destroy();
        return;
      }
      deck = instance;
    }

    initReveal();

    return () => {
      cancelled = true;
      try {
        deck?.destroy();
      } catch {
        // Reveal may already have torn down its DOM.
      }
      deck = null;
    };
  }, []);

  return (
    <div className={`reveal ${styles.deck}`} ref={deckRef}>
      <div className="slides">
        {/* TITLE */}
        <section>
          <div className={styles.center}>
            <h1 className={styles.title}>ESL Federal Credit Union</h1>
            <h3 className={styles.subtitle}>Onsite Dry-Run: Modular Breakout Sessions Guide</h3>
            <p className={styles.tagline}>
              The Golden Thread: <em>Anonymous Prospect → Verified Member Relationship</em>
            </p>
            <div className={styles.hint}>
              Press <strong>ESC</strong> for Session Overview Matrix &bull; Press <strong>S</strong> for Speaker Console
            </div>
          </div>
          <aside className="notes">
            Frame the meeting upfront: 6 modular sessions, designed for rotating teams. Every breakout starts with the
            90-second reset so nobody feels lost.
          </aside>
        </section>

        {/* DAY 1 OVERVIEW */}
        <section>
          <h2>Day 1 (Oct 27): Audience, Relevance & Optimization</h2>
          <p className={styles.lead}>
            Connecting real-time audience discovery to front-end personalization and testing.
          </p>
          <div className={styles.cards}>
            <OverviewCard color={SKY} title="1. CDP (ODP)" time="2:00 PM – 3:00 PM (60m)">
              Data architecture, profile unification, real-time segment creation without batch lag.
            </OverviewCard>
            <OverviewCard color={GREEN} title="2. Personalization" time="3:00 PM – 4:00 PM (60m)">
              Tailoring experience for Prospects (acquisition) vs. Members (cross-sell rate cards).
            </OverviewCard>
            <OverviewCard color={PINK} title="3. Experimentation" time="4:00 PM – 5:00 PM (60m)">
              Live A/B test (learning) vs. Multi-Armed Bandit (traffic shifting during promotions).
            </OverviewCard>
          </div>
          <p className={styles.hint}>
            Navigate right (→) to start Breakout 1 &bull; Navigate down (↓) for tactical session drill-downs.
          </p>
        </section>

        {/* BREAKOUT 1: CDP (ODP) */}
        <section>
          <HookSlide
            color={SKY}
            kicker="Breakout 1 (2:00 PM – 3:00 PM • 60 Mins)"
            title="Customer Data Platform (ODP)"
            audience="Data Architects, Analytics Leads, BI Engineers, Lifecycle Marketers"
            quote={`"Financial institutions don't have a data shortage—they have an activation delay. Knowing someone is an existing member vs. a high-intent prospect only matters if the website reacts in milliseconds."`}
            drill="↓ Press DOWN for Run-of-Show, Live Verification, and Q&A strategy"
          />

          <section style={accent(SKY)}>
            <h3>ODP Breakout: 60-Minute Run-of-Show</h3>
            <div className={styles.runOfShow}>
              <p>
                <strong>00–05m | Context Reset & Audience Framing:</strong> Batch data (24-hour core banking warehouse
                lag) vs. streaming in-session events.
              </p>
              <p>
                <strong>05–20m | Unified Profiles & Identity Resolution:</strong> Anonymous prospect browsing auto
                loans → identification at sign-in. Show zero-PII client leakage.
              </p>
              <p>
                <strong>20–40m | Real-Time Audiences:</strong> Show live rule evaluation:{" "}
                <code>esl_member_status == &apos;existing&apos;</code> vs. <code>&apos;prospective&apos;</code> with
                credit tiers.
              </p>
              <p>
                <strong>40–50m | Downstream Activation:</strong> How ODP segments sync natively to WebEx and GraphQL
                without engineering tickets.
              </p>
              <p>
                <strong>50–60m | Architecture, Governance & Security Q&A:</strong> PII controls, SOC2, warehouse sync
                (Snowflake/Databricks).
              </p>
            </div>
            <aside className="notes">
              Do not open the WebEx Visual Editor in this hour. Keep the focus strictly on data ingestion, identity
              resolution, and audience segmentation.
            </aside>
          </section>

          <section>
            <h3>ODP Live Environment Demo Target</h3>
            <ul className={styles.list}>
              <li>
                <strong>Customer Profiles Table:</strong> Search for seeded members (e.g.,{" "}
                <code>maria.gonzalez</code> or <code>james.okafor</code>).
              </li>
              <li>
                <strong>Customer Details Tab:</strong> Show custom banking attributes (
                <code>relationship_tier</code>, <code>credit_score_band</code>, <code>lending_interest</code>).
              </li>
              <li>
                <strong>Event History Timeline:</strong> Verify loan calculations and branch locator events occurring
                chronologically.
              </li>
              <li>
                <strong>Real-Time Segments Page:</strong> View active segments (
                <code>esl_existing_members_auto_refi</code>).
              </li>
            </ul>
          </section>
        </section>

        {/* BREAKOUT 2: PERSONALIZATION */}
        <section>
          <HookSlide
            color={GREEN}
            kicker="Breakout 2 (3:00 PM – 4:00 PM • 60 Mins)"
            title="Personalization"
            audience="Digital Experience Managers, Acquisition & Retention Leads, Content Strategists"
            quote={`"Showing both prospects and members the same generic hero banner costs ESL conversions every day. True personalization combines structured CMS reuse with zero-flicker delivery."`}
            drill="↓ Press DOWN for Live Experience Walkthrough and Marketer Workflow"
          />

          <section style={accent(GREEN)}>
            <h3>Personalization Breakout: Run-of-Show</h3>
            <div className={styles.runOfShow}>
              <p>
                <strong>00–05m | Context Reset:</strong> Contrast the acquisition needs of a non-member vs.
                pre-approved borrowing needs of an active member.
              </p>
              <p>
                <strong>05–20m | Front-End Experience Walkthrough:</strong> Load live site in incognito (Prospect) vs.
                signed-in as Maria Gonzalez (Member).
              </p>
              <p>
                <strong>20–40m | Marketer Authoring Workflow:</strong> Open SaaS CMS Visual Builder; showcase Blueprint
                swapping and audience assignment without code deploys.
              </p>
              <p>
                <strong>40–50m | Zero-Flicker & Performance:</strong> Explain client-side cookie evaluation (
                <code>esl_signed_in=1</code>) avoiding layout shifts.
              </p>
              <p>
                <strong>50–60m | Personalization Operations & Q&A:</strong> Avoiding personalization sprawl, content
                governance, and editorial efficiency.
              </p>
            </div>
          </section>

          <section>
            <h3>Live Demo Inspection: Member vs. Prospect</h3>
            <div className={styles.cardsTwo}>
              <div className={styles.panel}>
                <h4 style={{ color: SKY }}>Prospective Member (Anonymous)</h4>
                <ul>
                  <li>Header: &quot;Join&quot; & &quot;Sign In&quot; buttons</li>
                  <li>Hero: Trust badges & membership eligibility</li>
                  <li>CTA: &quot;Become a Member&quot; onboarding funnel</li>
                </ul>
              </div>
              <div className={styles.panel}>
                <h4 style={{ color: GREEN }}>Existing Member (Signed In)</h4>
                <ul>
                  <li>Header: Personalized Account Menu (&quot;Maria Gonzalez&quot;)</li>
                  <li>Hero: Pre-approved 4.24% auto refinance rate card</li>
                  <li>CTA: 1-click loan application with pre-filled profile data</li>
                </ul>
              </div>
            </div>
          </section>
        </section>

        {/* BREAKOUT 3: EXPERIMENTATION */}
        <section>
          <HookSlide
            color={PINK}
            kicker="Breakout 3 (4:00 PM – 5:00 PM • 60 Mins)"
            title="Experimentation"
            audience="CRO & Optimization Leads, Growth PMs, Analytics & Data Science"
            quote={`"Not every test has the same goal. When you need learning and statistical certainty, use A/B testing. When you have a promotional rate campaign, you cannot afford to send 50% of traffic to a losing variation for 4 weeks."`}
            drill="↓ Press DOWN for A/B vs. MAB Strategy and Stats Engine deep-dive"
          />

          <section style={accent(PINK)}>
            <h3>Experimentation: Run-of-Show</h3>
            <div className={styles.runOfShow}>
              <p>
                <strong>00–05m | Context Reset:</strong> The experimentation maturity spectrum in credit unions—from
                vanity tests to revenue drivers.
              </p>
              <p>
                <strong>05–25m | Live A/B Test Deep-Dive:</strong> Structural value proposition testing on the landing
                page, Stats Engine sequential testing, FDR control.
              </p>
              <p>
                <strong>25–45m | Multi-Armed Bandit (MAB):</strong> Promotional rate banner optimization shifting
                traffic dynamically to maximize conversions.
              </p>
              <p>
                <strong>45–55m | Closing the Loop:</strong> Promoting the winning variant into permanent SaaS CMS
                content without developer backlogs.
              </p>
              <p>
                <strong>55–60m | Stats Rigor & Q&A:</strong> Sample Ratio Mismatch (SRM), statistical power, and
                guardrail metrics.
              </p>
            </div>
          </section>
        </section>

        {/* DAY 2 OVERVIEW */}
        <section>
          <h2>Day 2 (Oct 28): Scale, Governance & SDLC</h2>
          <p className={styles.lead}>
            The enterprise operational foundation powering marketing agility and regulatory compliance.
          </p>
          <div className={styles.cards}>
            <OverviewCard color={AMBER} title="4. DAM" time="9:00 AM – 10:00 AM (60m)">
              Content supply chain, direct CMS asset picker, dynamic crops, rights expiration.
            </OverviewCard>
            <OverviewCard color={VIOLET} title="5. Governance" time="10:00 AM – 10:30 AM (30m)">
              Mandatory legal disclaimers, role permissions, audit trails, and brand guardrails.
            </OverviewCard>
            <OverviewCard color={BLUE} title="6. SDLC + Architecture" time="10:30 AM – 11:00 AM (30m)">
              Next.js 16 decoupled architecture, Optimizely Graph, CI/CD, and edge delivery.
            </OverviewCard>
          </div>
        </section>

        {/* BREAKOUT 4: DAM */}
        <section>
          <HookSlide
            color={AMBER}
            kicker="Breakout 4 (9:00 AM – 10:00 AM • 60 Mins)"
            title="Digital Asset Management (DAM)"
            audience="Creative Directors, Production Teams, Brand Managers, Marketing Ops"
            quote={`"The hidden killer of personalization isn't targeting—it's content supply chain starvation. If creating, approving, and resizing assets takes weeks, experimentation stalls."`}
          />
          <section style={accent(AMBER)}>
            <h3>DAM: Run-of-Show & Live Integration</h3>
            <ul className={styles.list}>
              <li>
                <strong>00–05m | Creative Bottlenecks in Banking:</strong> Manual asset resizing, expired regulatory
                imagery, and shared-drive chaos.
              </li>
              <li>
                <strong>05–25m | Central Repository & AI Tagging:</strong> Auto-tagging by audience (
                <code>Audience: Member</code>) and product category.
              </li>
              <li>
                <strong>25–45m | Native CMS Picker:</strong> Selecting approved DAM assets inside Visual Builder with
                responsive auto-cropping.
              </li>
              <li>
                <strong>45–55m | Rights & Expiration Management:</strong> Auto-expiring promotional rate banners to
                eliminate compliance risk.
              </li>
              <li>
                <strong>55–60m | Workflow & Creative Cloud Integration:</strong> Handoffs from Adobe CC into
                production.
              </li>
            </ul>
          </section>
        </section>

        {/* BREAKOUT 5: GOVERNANCE */}
        <section>
          <HookSlide
            color={VIOLET}
            kicker="Breakout 5 (10:00 AM – 10:30 AM • 30 Mins)"
            title="Governance & Compliance"
            audience="Legal, Regulatory & Compliance Officers, Risk Management, Brand Custodians"
            quote={`"In a financial institution, agility cannot come at the expense of regulatory compliance. Governance in Optimizely isn't an afterthought—it is enforced directly through our component architecture and approval workflows."`}
          />
          <section style={accent(VIOLET)}>
            <h3>Governance: 30-Minute Precision Agenda</h3>
            <div className={styles.runOfShow}>
              <p>
                <strong>00–05m | Governance by Design:</strong> Structural guardrails (design system), Regulatory
                guardrails (NCUA/disclosures), Operational guardrails (approvals).
              </p>
              <p>
                <strong>05–15m | Visual Builder Guardrails (Show):</strong> How structured content types (e.g.,{" "}
                <code>EslDisclosure</code>) prevent editors from removing required disclosures.
              </p>
              <p>
                <strong>15–25m | Role Permissions & Audit Trails:</strong> Role separation (Author vs. Compliance
                Reviewer vs. Publisher) and version rollbacks.
              </p>
              <p>
                <strong>25–30m | Compliance Q&A:</strong> Audit exportability, legal preview modes, disaster recovery.
              </p>
            </div>
          </section>
        </section>

        {/* BREAKOUT 6: SDLC & ARCHITECTURE */}
        <section>
          <HookSlide
            color={BLUE}
            kicker="Breakout 6 (10:30 AM – 11:00 AM • 30 Mins)"
            title="Product Lifecycle & SDLC"
            audience="Enterprise Architects, VP/Director of Engineering, Lead Developers, DevOps"
            quote={`"Optimizely's SaaS CMS and Web Experimentation are built on a headless, API-first foundation. Engineering maintains full control of code, components, and deployment pipelines, while liberating marketing to manage content and targeting."`}
          />
          <section style={accent(BLUE)}>
            <h3>Engineering Agenda: 30-Minute Run-of-Show</h3>
            <div className={styles.runOfShow}>
              <p>
                <strong>00–05m | Decoupled Architecture Blueprint:</strong> SaaS CMS → Optimizely Graph (GraphQL CDN)
                → Next.js 16 App Router on Vercel.
              </p>
              <p>
                <strong>05–15m | Developer Workflow & Component Modeling:</strong> Schema definition in TypeScript,{" "}
                <code>optimizely-cms-cli</code> schema synchronization, Git CI/CD pipelines.
              </p>
              <p>
                <strong>15–23m | Edge Performance & Zero Layout Shift:</strong> ISR cache tag revalidation (
                <code>/api/revalidate</code>), zero client-side layout shift (CLS), script delivery optimization.
              </p>
              <p>
                <strong>23–30m | Architecture Q&A:</strong> GraphQL query performance, webhook latency, security
                boundaries.
              </p>
            </div>
          </section>
        </section>

        {/* DAY 2 PM: EXECUTIVE POC DEMO */}
        <section>
          <h2>The Afternoon Handoff: Executive PoC Demo</h2>
          <p style={{ color: SKY, fontSize: "0.85em" }}>Day 2 &bull; 1:40 PM – 2:40 PM (60 Mins)</p>
          <div className={styles.handoff}>
            <h4 style={{ color: "#fff", marginBottom: "8px" }}>Critical Transition from Breakouts to Executive Demo</h4>
            <p>
              <strong>In the Breakouts:</strong> You pulled back the curtain on the machinery (API calls, ODP AST
              definitions, Visual Builder configuration, developer CLI pushes).
            </p>
            <p style={{ marginTop: "10px" }}>
              <strong>In the 1:40 PM Executive PoC:</strong> Switch entirely to the <em>executive business outcome
              narrative</em>. Run the live end-to-end journey uninterrupted:
            </p>
            <ol>
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

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

const SITE_HOME_URL = "https://esl-onsite.optimoey.com/";
const SITE_PERSONAL_LOANS_URL = "https://esl-onsite.optimoey.com/personal/loans";

const OPTI_PROJECT_ID = "4775830914596864";
const OPTI_CAMPAIGN_LOGGED_IN_URL = `https://app.optimizely.com/v2/projects/${OPTI_PROJECT_ID}/campaigns/6504326074466304`;
const OPTI_EXP_HOME_HERO_AB_URL = `https://app.optimizely.com/v2/projects/${OPTI_PROJECT_ID}/experiments/4520294755336192/variations`;
const OPTI_EXP_LOANS_AB_URL = `https://app.optimizely.com/v2/projects/${OPTI_PROJECT_ID}/experiments/5060834274050048/variations`;
const OPTI_EXP_HOME_MAB_URL = `https://app.optimizely.com/v2/projects/${OPTI_PROJECT_ID}/experiments/6613140698300416/variations`;

function NewTabLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? styles.link}
    >
      {children}
    </a>
  );
}

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
            <div className={styles.linkRow} style={{ justifyContent: "center", marginTop: "1.2em" }}>
              <NewTabLink href={SITE_HOME_URL} className={styles.linkPill}>
                Home Page (/) ↗
              </NewTabLink>
              <NewTabLink href={SITE_PERSONAL_LOANS_URL} className={styles.linkPill}>
                Personal Loans (/personal/loans) ↗
              </NewTabLink>
            </div>
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
              Tailoring experience for Prospects vs. Members across{" "}
              <NewTabLink href={SITE_HOME_URL}>Home (/)</NewTabLink> and{" "}
              <NewTabLink href={SITE_PERSONAL_LOANS_URL}>Personal Loans</NewTabLink>.
            </OverviewCard>
            <OverviewCard color={PINK} title="3. Experimentation" time="4:00 PM – 5:00 PM (60m)">
              Live A/B tests &amp; Multi-Armed Bandit on{" "}
              <NewTabLink href={SITE_HOME_URL}>Home (/)</NewTabLink> and{" "}
              <NewTabLink href={SITE_PERSONAL_LOANS_URL}>Personal Loans</NewTabLink>.
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
                streamlined borrowing needs of an active member.
              </p>
              <p>
                <strong>05–20m | Front-End Experience Walkthrough:</strong> Open{" "}
                <NewTabLink href={SITE_HOME_URL}>Home Page (/)</NewTabLink> and{" "}
                <NewTabLink href={SITE_PERSONAL_LOANS_URL}>Personal Loans (/personal/loans)</NewTabLink> — toggle
                Prospective Member vs. Existing Member (Signed In).
              </p>
              <p>
                <strong>20–40m | Marketer Authoring Workflow:</strong> Inspect{" "}
                <NewTabLink href={OPTI_CAMPAIGN_LOGGED_IN_URL}>
                  Logged in experience (ID: 6504326074466304)
                </NewTabLink>{" "}
                and SaaS CMS Visual Builder; showcase audience assignment without code deploys.
              </p>
              <p>
                <strong>40–50m | Zero-Flicker & Performance:</strong> Explain client-side cookie evaluation (
                <code>esl_signed_in=1</code> vs. <code>esl_signed_in=0</code>) avoiding layout shifts.
              </p>
              <p>
                <strong>50–60m | Personalization Operations & Q&A:</strong> Avoiding personalization sprawl, content
                governance, and editorial efficiency.
              </p>
            </div>
          </section>

          <section style={accent(GREEN)}>
            <h3>Live Demo Inspection: Logged In Experience</h3>
            <p className={styles.lead}>
              Campaign:{" "}
              <NewTabLink href={OPTI_CAMPAIGN_LOGGED_IN_URL}>
                Logged in experience (ID: 6504326074466304) ↗
              </NewTabLink>
            </p>
            <div className={styles.cardsTwo}>
              <div className={styles.panel}>
                <h4 style={{ color: SKY }}>Prospective Members (esl_signed_in=0)</h4>
                <ul>
                  <li>
                    <NewTabLink href={SITE_HOME_URL}>Home Page (/) ↗</NewTabLink>: Default acquisition hero &amp;
                    onboarding CTAs
                  </li>
                  <li>
                    <NewTabLink href={SITE_PERSONAL_LOANS_URL}>Personal Loans (/personal/loans) ↗</NewTabLink>: H1{" "}
                    <em>&quot;Get the Funds You Need with a Personal Loan from ESL&quot;</em>
                  </li>
                  <li>
                    CTA: <em>&quot;Apply for a Personal Loan&quot;</em> with introductory rate messaging
                  </li>
                </ul>
              </div>
              <div className={styles.panel}>
                <h4 style={{ color: GREEN }}>Logged In Members (esl_signed_in=1)</h4>
                <ul>
                  <li>
                    <NewTabLink href={SITE_HOME_URL}>Home Page (/) ↗</NewTabLink>: H1{" "}
                    <em>&quot;Welcome back!&quot;</em> (acquisition hero &amp; snipe CTAs suppressed)
                  </li>
                  <li>
                    <NewTabLink href={SITE_PERSONAL_LOANS_URL}>Personal Loans (/personal/loans) ↗</NewTabLink>: H1{" "}
                    <em>&quot;You&apos;re Already a Member. Let&apos;s Make Borrowing Easier.&quot;</em>
                  </li>
                  <li>
                    CTA: <em>&quot;View Your Loan Options&quot;</em> with streamlined member copy
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.linkRow}>
              <NewTabLink href={SITE_HOME_URL} className={styles.linkPill}>
                Open Home Page (/) ↗
              </NewTabLink>
              <NewTabLink href={SITE_PERSONAL_LOANS_URL} className={styles.linkPill}>
                Open Personal Loans (/personal/loans) ↗
              </NewTabLink>
              <NewTabLink href={OPTI_CAMPAIGN_LOGGED_IN_URL} className={styles.linkPill}>
                Optimizely Campaign 6504326074466304 ↗
              </NewTabLink>
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
            drill="↓ Press DOWN for A/B vs. MAB Strategy, Live Demo Links, and Stats Engine deep-dive"
          />

          <section style={accent(PINK)}>
            <h3>Experimentation: Run-of-Show</h3>
            <div className={styles.runOfShow}>
              <p>
                <strong>00–05m | Context Reset:</strong> The experimentation maturity spectrum in credit unions—from
                vanity tests to revenue drivers.
              </p>
              <p>
                <strong>05–25m | Live A/B Test Deep-Dive:</strong> Value proposition tests on{" "}
                <NewTabLink href={SITE_HOME_URL}>Home Page (/)</NewTabLink> (
                <NewTabLink href={OPTI_EXP_HOME_HERO_AB_URL}>ID: 4520294755336192</NewTabLink>) and{" "}
                <NewTabLink href={SITE_PERSONAL_LOANS_URL}>Personal Loans (/personal/loans)</NewTabLink> (
                <NewTabLink href={OPTI_EXP_LOANS_AB_URL}>ID: 5060834274050048</NewTabLink>), Stats Engine sequential
                testing &amp; FDR control.
              </p>
              <p>
                <strong>25–45m | Multi-Armed Bandit (MAB):</strong> Solutions selector optimization on{" "}
                <NewTabLink href={SITE_HOME_URL}>Home Page (/)</NewTabLink> (
                <NewTabLink href={OPTI_EXP_HOME_MAB_URL}>ID: 6613140698300416</NewTabLink>) shifting traffic
                dynamically to maximize conversions.
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

          <section style={accent(PINK)}>
            <h3>Live Experimentation Demo Targets</h3>
            <div className={styles.cards}>
              <div className={styles.card} style={accent(PINK)}>
                <h4>Home Page Hero (A/B)</h4>
                <p className={styles.metaId}>ID: 4520294755336192</p>
                <p className={styles.cardMuted}>
                  <strong>Replace slogan H1 with member-ownership value proposition:</strong> Original vs.{" "}
                  <em>&quot;The bank you own — and that pays you back.&quot;</em> (Owners&apos; Dividend).
                </p>
                <div className={styles.linkRow}>
                  <NewTabLink href={SITE_HOME_URL} className={styles.linkPill}>
                    Home Page (/) ↗
                  </NewTabLink>
                  <NewTabLink href={OPTI_EXP_HOME_HERO_AB_URL} className={styles.linkPill}>
                    Optimizely ↗
                  </NewTabLink>
                </div>
              </div>

              <div className={styles.card} style={accent(PINK)}>
                <h4>Personal Loans (A/B)</h4>
                <p className={styles.metaId}>ID: 5060834274050048</p>
                <p className={styles.cardMuted}>
                  <strong>Personal Loans Page – Value Proposition &amp; CTA Test:</strong> Original vs. Variant A (
                  <em>Speed &amp; Convenience</em>) vs. Variant B (<em>Debt Consolidation Focus</em>).
                </p>
                <div className={styles.linkRow}>
                  <NewTabLink href={SITE_PERSONAL_LOANS_URL} className={styles.linkPill}>
                    Personal Loans ↗
                  </NewTabLink>
                  <NewTabLink href={OPTI_EXP_LOANS_AB_URL} className={styles.linkPill}>
                    Optimizely ↗
                  </NewTabLink>
                </div>
              </div>

              <div className={styles.card} style={accent(PINK)}>
                <h4>Stage of Life (MAB)</h4>
                <p className={styles.metaId}>ID: 6613140698300416</p>
                <p className={styles.cardMuted}>
                  <strong>Banking for Every Stage of Life – CTA &amp; Value Prop Bandit:</strong> Original vs.{" "}
                  <em>Personalized Roadmap</em>, <em>Goal-Oriented Plan</em> &amp; <em>Member Guidance Focus</em>.
                </p>
                <div className={styles.linkRow}>
                  <NewTabLink href={SITE_HOME_URL} className={styles.linkPill}>
                    Home Page (/) ↗
                  </NewTabLink>
                  <NewTabLink href={OPTI_EXP_HOME_MAB_URL} className={styles.linkPill}>
                    Optimizely ↗
                  </NewTabLink>
                </div>
              </div>
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
              <li>
                Live visitor experience adapting from Anonymous Prospect to Loyal Member on{" "}
                <NewTabLink href={SITE_HOME_URL}>Home (/)</NewTabLink> &amp;{" "}
                <NewTabLink href={SITE_PERSONAL_LOANS_URL}>Personal Loans (/personal/loans)</NewTabLink>
              </li>
              <li>
                Measurable loan conversion acceleration via Multi-Armed Bandit (
                <NewTabLink href={OPTI_EXP_HOME_MAB_URL}>ID: 6613140698300416</NewTabLink>)
              </li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}

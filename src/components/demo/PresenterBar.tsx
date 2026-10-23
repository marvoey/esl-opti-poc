"use client";

import React, { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/atoms/button/Button";
import { signInAs, signOut } from "@/app/sites/[site]/sign-in/actions";
import { monthlyPayment } from "@/components/organisms/auto-loan-calculator/monthlyPayment";
import { loanCalculatorEvent, pageviewEvent, trackEvents } from "@/infrastructure/odp/client";
import { clearClientVuid, getOrCreateClientVuid } from "@/infrastructure/odp/vuid";
import styles from "./PresenterBar.module.css";

const DEMO_MEMBER = "maria.gonzalez";

const subscribeNever = () => () => {};
const hasSignedInCookie = () => document.cookie.includes("esl_signed_in=1");

/**
 * Floating control for live demos: fires Act 2 (anonymous intent) and Act 3 (identity stitch),
 * or resets to an anonymous visitor. Mounted only when NEXT_PUBLIC_DEMO_HUD=1.
 */
export function PresenterBar() {
  // Cookies are browser-only: empty on the server and during hydration, real values after.
  const vuid = useSyncExternalStore(subscribeNever, getOrCreateClientVuid, () => "");
  const signedIn = useSyncExternalStore(subscribeNever, hasSignedInCookie, () => false);
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState("");

  async function fireAct2() {
    setMessage("Firing Act 2 ($32,000 calculation)...");
    const ok = await trackEvents([
      pageviewEvent("/loans/auto-loans", "ESL - Auto Loans & Refinancing"),
      loanCalculatorEvent({
        borrow_amount: 32000,
        loan_term_months: 60,
        interest_rate: 5.49,
        calculated_monthly_payment: monthlyPayment(32000, 5.49, 60),
      }),
    ]);
    setMessage(ok ? "Act 2 sent. Check the Event Inspector and the anonymous profile." : "Act 2 failed.");
  }

  // Full reloads below: the Optimizely snippet only evaluates cookie audiences on page load.
  async function fireAct3() {
    setMessage("Firing Act 3 (stitching to the member)...");
    const { ok } = await signInAs(DEMO_MEMBER);
    if (!ok) return setMessage("Act 3 failed.");
    setMessage("Act 3 sent. Open the member profile in ODP.");
    window.setTimeout(() => window.location.reload(), 1200);
  }

  async function reset() {
    await signOut();
    clearClientVuid();
    window.location.reload();
  }

  return (
    <aside className={styles.bar} aria-label="Demo presenter controls">
      <div className={styles.top}>
        <span className={styles.title}>Demo pilot</span>
        <button type="button" className={styles.toggle} aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
          {expanded ? "Minimize" : "Expand"}
        </button>
      </div>
      <p className={styles.vuid}>
        <span>VUID </span>
        {vuid || "detecting..."}
      </p>
      {expanded && (
        <div className={styles.controls}>
          <p className={styles.cookie}>esl_signed_in={signedIn ? "1" : "0"}</p>
          <div className={styles.actions}>
            <Button type="button" size="sm" onClick={fireAct2}>
              Act 2: $32k calc
            </Button>
            <Button type="button" size="sm" variant="secondary" onClick={fireAct3}>
              Act 3: stitch
            </Button>
          </div>
          <Button type="button" size="sm" variant="outline" fullWidth onClick={reset}>
            Reset to anonymous
          </Button>
        </div>
      )}
      <p role="status" className={styles.message}>
        {message}
      </p>
    </aside>
  );
}

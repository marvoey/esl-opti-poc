"use client";

import React, { useId, useMemo, useState } from "react";
import { Button } from "@/components/atoms/button/Button";
import { Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { loanCalculatorEvent, trackEvents } from "@/infrastructure/odp/client";
import { monthlyPayment } from "./monthlyPayment";
import styles from "./AutoLoanCalculator.module.css";

const TERMS = [36, 48, 60, 72] as const;
const APR = 5.49;
const money = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD" });

/** Auto loan payment calculator. "Lock this rate" records the calculation against the anonymous visitor. */
export function AutoLoanCalculator() {
  const amountId = useId();
  const [amount, setAmount] = useState(32000);
  const [term, setTerm] = useState<number>(60);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const payment = useMemo(() => monthlyPayment(amount, APR, term), [amount, term]);

  async function handleLock() {
    setStatus("sending");
    const ok = await trackEvents([
      loanCalculatorEvent({
        borrow_amount: amount,
        loan_term_months: term,
        interest_rate: APR,
        calculated_monthly_payment: payment,
      }),
    ]);
    setStatus(ok ? "sent" : "failed");
  }

  return (
    <section className={styles.card} aria-labelledby={`${amountId}-heading`}>
      <div className={styles.header}>
        <Heading level="h3" id={`${amountId}-heading`}>
          Payment calculator
        </Heading>
        <Text as="span" variant="label" color="brand">
          {APR}% APR
        </Text>
      </div>

      <div className={styles.field}>
        <label htmlFor={amountId} className={styles.label}>
          <span>Borrow amount</span>
          <strong>{money(amount)}</strong>
        </label>
        <input
          id={amountId}
          type="range"
          min={10000}
          max={75000}
          step={1000}
          value={amount}
          onChange={(event) => {
            setAmount(Number(event.target.value));
            setStatus("idle");
          }}
          className={styles.range}
        />
      </div>

      <fieldset className={styles.field}>
        <legend className={styles.label}>
          <span>Loan term</span>
          <strong>{term} months</strong>
        </legend>
        <div className={styles.terms}>
          {TERMS.map((months) => (
            <Button
              key={months}
              type="button"
              size="sm"
              variant={months === term ? "primary" : "outline"}
              aria-pressed={months === term}
              onClick={() => {
                setTerm(months);
                setStatus("idle");
              }}
            >
              {months} mo
            </Button>
          ))}
        </div>
      </fieldset>

      <div className={styles.result} aria-live="polite">
        <Text as="span" variant="body-sm" color="secondary">
          Estimated monthly payment
        </Text>
        <span className={styles.payment}>{money(payment)}</span>
        <Text as="span" variant="caption" color="secondary">
          {APR}% APR for {term} months, $0 down.
        </Text>
      </div>

      <Button type="button" fullWidth isLoading={status === "sending"} onClick={handleLock}>
        Recalculate &amp; lock this rate
      </Button>

      <div role="status" className={styles.status}>
        {status === "sent" && (
          <Text as="p" variant="body-sm" color="brand">
            Calculation saved.
          </Text>
        )}
        {status === "failed" && (
          <Text as="p" variant="body-sm" color="inherit" className={styles.error}>
            We couldn&apos;t save that calculation. Please try again.
          </Text>
        )}
      </div>
    </section>
  );
}

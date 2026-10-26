import React from "react";
import type { Metadata } from "next";
import { Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { AutoLoanCalculator } from "@/components/organisms/auto-loan-calculator/AutoLoanCalculator";
import { PageviewBeacon } from "./PageviewBeacon";
import styles from "./page.module.css";

const TITLE = "Auto Loans & Refinancing";

export const metadata: Metadata = { title: TITLE };

/** Demo page for ODP identity resolution. Declared here so `/personal/auto-loans` is not looked up as a CMS page. */
export default function AutoLoansPage() {
  return (
    <main id="main-content" className={styles.main}>
      <PageviewBeacon path="/personal/auto-loans" title={`ESL - ${TITLE}`} />
      <header className={styles.intro}>
        <Text as="p" variant="eyebrow" color="brand">
          Borrowing solutions
        </Text>
        <Heading level="h1">{TITLE}</Heading>
        <Text as="p" variant="body-lg" color="secondary">
          Low fixed rates, flexible terms up to 72 months, and fast online approval for Rochester and
          Finger Lakes drivers.
        </Text>
      </header>
      <AutoLoanCalculator />
    </main>
  );
}

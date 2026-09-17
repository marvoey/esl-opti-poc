import React from "react";
import { Heading, Text, Eyebrow } from "@/components/atoms";
import { ButtonSpecimens } from "./ButtonSpecimens";
import { CardSpecimens } from "./CardSpecimens";
import styles from "../page.module.css";

export function ComponentMatrix() {
  return (
    <section className={styles.specimenSection} aria-label="Figma Button & Component Matrix">
      <div className={styles.specimenHeader}>
        <Eyebrow color="accent">WCAG 2.2 AA Verified Design Tokens</Eyebrow>
        <Heading level="h2">Figma Button & Component Matrix</Heading>
        <Text variant="body">
          All 12 interactive variants from Figma unified in one matrix with dynamic intrinsic hugging, 4px grid rhythm, accessible focus rings, and 300ms ease-out hover motion.
        </Text>
      </div>

      <div className={styles.buttonShowcaseGrid}>
        <ButtonSpecimens />
        <CardSpecimens />
      </div>
    </section>
  );
}

import React from "react";
import { Heading, Text } from "@/components/atoms";
import styles from "../page.module.css";

const PILLARS = [
  {
    index: "01",
    title: "Anti-Corruption Layer",
    desc: "Simulated CMS adapter today, CMS tomorrow. Domain models and UI components are strictly insulated from vendor payloads.",
  },
  {
    index: "02",
    title: "Intrinsic Design Tokens",
    desc: "Zero media-query fragility. Layouts scale smoothly via CSS Grid, Flexbox, @container queries, and clamp() mathematical curves.",
  },
  {
    index: "03",
    title: "Zero Reflow & Leak Discipline",
    desc: "React Server Components by default. Compositor-only GPU transitions (transform/opacity) and strict lifecycle cleanup.",
  },
  {
    index: "04",
    title: "Spec-Driven Development",
    desc: "Every capability starts with a validated contract in openspec/ and a verified test suite before any application code is touched.",
  },
];

export function ArchitecturePillars() {
  return (
    <section className={styles.pillarsGrid} aria-label="Architecture Pillars">
      {PILLARS.map((pillar) => (
        <article key={pillar.index} className={styles.pillarCard}>
          <div className={styles.pillarHeader}>
            <span className={styles.pillarIndex}>{pillar.index}</span>
            <Heading level="h4">{pillar.title}</Heading>
          </div>
          <Text variant="body-sm">{pillar.desc}</Text>
        </article>
      ))}
    </section>
  );
}

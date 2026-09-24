import React from "react";
import { Heading, Text, Eyebrow, Stat } from "@/components/atoms";
import styles from "../page.module.css";

export function TypographySpecimen() {
  return (
    <section className={styles.specimenSection} aria-label="Typography Scale Specimen">
      <div className={styles.specimenHeader}>
        <Eyebrow color="brand">Design System Core</Eyebrow>
        <Heading level="h2">Typography Scale Atoms</Heading>
      </div>

      <div className={styles.specimenCard}>
        <div className={styles.specimenRow}>
          <div className={styles.specimenMeta}>
            <Text variant="micro">H1 DESKTOP / MOBILE</Text>
            <Text variant="micro">Albert Sans 700 • 34px-52px / 40px-60px LH</Text>
          </div>
          <Heading level="h1">The quick brown fox jumps over the lazy dog.</Heading>
        </div>

        <div className={styles.specimenRow}>
          <div className={styles.specimenMeta}>
            <Text variant="micro">H2 DESKTOP / MOBILE</Text>
            <Text variant="micro">Albert Sans 700 • 28px-40px / 36px-48px LH</Text>
          </div>
          <Heading level="h2">Design systems bridge the gap between design & dev.</Heading>
        </div>

        <div className={styles.specimenRow}>
          <div className={styles.specimenMeta}>
            <Text variant="micro">H3 DESKTOP / MOBILE</Text>
            <Text variant="micro">Albert Sans 700 • 22px-28px / 28px-36px LH</Text>
          </div>
          <Heading level="h3">Design systems bridge the gap between design & dev.</Heading>
        </div>

        <div className={styles.specimenRow}>
          <div className={styles.specimenMeta}>
            <Text variant="micro">H4 DESKTOP / MOBILE</Text>
            <Text variant="micro">Albert Sans 700 • 20px / 24px LH</Text>
          </div>
          <Heading level="h4">Design systems bridge the gap between design & dev.</Heading>
        </div>

        <div className={styles.specimenRow}>
          <div className={styles.specimenMeta}>
            <Text variant="micro">STAT VALUE</Text>
            <Text variant="micro">Albert Sans 700 • 40px-60px / 44px-64px LH</Text>
          </div>
          <Stat>12,480</Stat>
        </div>

        <div className={styles.specimenRow}>
          <div className={styles.specimenMeta}>
            <Text variant="micro">SUBHEAD & BODY LARGE</Text>
            <Text variant="micro">Albert Sans 400/500 • 18px-24px / 16px-20px</Text>
          </div>
          <Text variant="subhead">Design systems bridge the gap between design & dev.</Text>
          <Text variant="body-lg">
            A well-defined scale helps maintain rhythm across pages. This body copy demonstrates comfortable line hierarchy and contrast against neutral surfaces.
          </Text>
        </div>

        <div className={styles.specimenRow}>
          <div className={styles.specimenMeta}>
            <Text variant="micro">BODY DESKTOP / MOBILE</Text>
            <Text variant="micro">Albert Sans 400 • 16px / 24px LH</Text>
          </div>
          <Text variant="body">
            A well-defined scale helps maintain rhythm across pages. This body copy demonstrates comfortable line hierarchy and contrast against neutral surfaces.
          </Text>
        </div>

        <div className={styles.specimenRow}>
          <div className={styles.specimenMeta}>
            <Text variant="micro">BODY SMALL DESKTOP / MOBILE</Text>
            <Text variant="micro">Albert Sans 400 • 14px / 20px LH</Text>
          </div>
          <Text variant="body-sm">
            This smaller variation is optimized for sidebars, metadata summaries, nested information blocks, and utility tooltips.
          </Text>
        </div>

        <div className={styles.specimenRow}>
          <div className={styles.specimenMeta}>
            <Text variant="micro">LABEL DESKTOP / MOBILE</Text>
            <Text variant="micro">Albert Sans 600 • 18px / 28px LH</Text>
          </div>
          <Text variant="label">CONFIRM PAYMENT METHOD</Text>
        </div>

        <div className={styles.specimenRow}>
          <div className={styles.specimenMeta}>
            <Text variant="micro">CAPTION DESKTOP / MOBILE</Text>
            <Text variant="micro">Albert Sans 400 • 14px / 16px LH</Text>
          </div>
          <Text variant="caption">Fig 4.2: Typography token mapping on 4px grid increments.</Text>
        </div>

        <div className={styles.specimenRow}>
          <div className={styles.specimenMeta}>
            <Text variant="micro">MICRO DESKTOP / MOBILE</Text>
            <Text variant="micro">Albert Sans 600 • 12px / 16px LH</Text>
          </div>
          <Text variant="micro">Fig 4.2: Typography token mapping on 4px grid increments.</Text>
        </div>

        <div className={styles.specimenRow}>
          <div className={styles.specimenMeta}>
            <Text variant="micro">MULTI-COLOR EYEBROWS</Text>
            <Text variant="micro">League Spartan 700 • Brand, Accent & Vibrant</Text>
          </div>
          <div className={styles.eyebrowGroup}>
            <Eyebrow color="brand">BRAND INTENT (#00395D)</Eyebrow>
            <Eyebrow color="accent">ACCENT INTENT (#00A3A3)</Eyebrow>
            <Eyebrow color="vibrant">VIBRANT INTENT (#68E0CC)</Eyebrow>
          </div>
        </div>
      </div>
    </section>
  );
}

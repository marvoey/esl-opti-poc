import React from "react";
import { Text } from "@/components/atoms";
import { StyleguideHero } from "./components/StyleguideHero";
import { ArchitecturePillars } from "./components/ArchitecturePillars";
import { ComponentMatrix } from "./components/ComponentMatrix";
import { TypographySpecimen } from "./components/TypographySpecimen";
import styles from "./page.module.css";

export default function StyleguidePage() {
  return (
    <div className={styles.mainWrapper}>
      <main id="main-content" className={styles.contentContainer}>
        <StyleguideHero />
        <ArchitecturePillars />
        <ComponentMatrix />
        <TypographySpecimen />
      </main>

      <footer className={styles.footerBar}>
        <Text variant="caption">Built with Next.js App Router • Strict TypeScript • Pure Design Tokens</Text>
      </footer>
    </div>
  );
}

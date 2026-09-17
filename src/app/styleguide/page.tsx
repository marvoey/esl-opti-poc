import React from "react";
import { getNavigationQuery } from "@/application/queries/getNavigationQuery";
import { Header } from "@/components/header/Header";
import { Text } from "@/components/atoms";
import { StyleguideHero } from "./components/StyleguideHero";
import { ArchitecturePillars } from "./components/ArchitecturePillars";
import { ComponentMatrix } from "./components/ComponentMatrix";
import { TypographySpecimen } from "./components/TypographySpecimen";
import styles from "./page.module.css";

export default async function StyleguidePage() {
  // Pure server-side query consuming the Application Port
  const navigation = await getNavigationQuery();

  return (
    <div className={styles.mainWrapper}>
      <Header navigation={navigation} />

      <main className={styles.contentContainer}>
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

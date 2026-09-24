import React from "react";
import {
  Display,
  Text,
  Eyebrow,
  Button,
  UserIcon,
  ArrowRightIcon,
} from "@/components/atoms";
import styles from "../page.module.css";

export function StyleguideHero() {
  return (
    <section className={styles.heroSection}>
      <Eyebrow color="brand">Enterprise Architecture Ready</Eyebrow>
      <Display as="h1">Building products with beautiful, functional systems.</Display>
      <Text variant="subhead" className={styles.heroSubtitle}>
        A decoupled, media-query agnostic, high-performance architecture built for seamless headless CMS integration.
      </Text>
      <div className={styles.buttonGroup}>
        <Button variant="primary" leftIcon={<UserIcon />}>
          Sign In
        </Button>
        <Button variant="primary" rightIcon={<ArrowRightIcon />}>
          Learn more about joining ESL
        </Button>
        <Button variant="outline" leftIcon={<UserIcon />}>
          Become a member
        </Button>
      </div>
    </section>
  );
}

import React from "react";
import { CircleHelpIcon } from "@/components/atoms/icons";
import { Text } from "@/components/atoms/text/Text";
import { SimpleLink } from "@/components/atoms/link/SimpleLink";
import styles from "./SnipeCta.module.css";

export interface SnipeCtaProps {
  title?: string;
  description?: string;
  linkLabel?: string;
  linkHref?: string;
  linkTarget?: string;
  linkRel?: string;
  className?: string;
}

/**
 * SnipeCta Organism Component
 * Displays membership eligibility call-to-action banner right below the hero slider.
 * Renders an outer section with --gradient-linear-wash background, an inner container,
 * and 3 elements (CircleHelp icon, body typography with bold and regular segments, and SimpleLink).
 */
export function SnipeCta({
  title = "Can you join?",
  description = "If you live, work, worship, or attend school in our region — yes!",
  linkLabel = "Check your eligibility",
  linkHref = "/eligibility",
  linkTarget,
  linkRel,
  className = "",
}: SnipeCtaProps) {
  const combinedSectionClass = className
    ? `${styles.snipeCta} ${className}`
    : styles.snipeCta;

  return (
    <section className={combinedSectionClass} aria-label="Membership eligibility">
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <CircleHelpIcon
              size={15}
              color="var(--color-primary)"
              className={styles.icon}
            />
            <Text
              as="h2"
              variant="body"
              weight="bold"
              color="primary"
              className={styles.title}
            >
              {title}
            </Text>
          </div>

          <div className={styles.contentWrap}>
            <Text
              as="span"
              variant="body"
              color="primary"
              className={styles.description}
            >
              {description}
            </Text>
            <SimpleLink
              href={linkHref}
              target={linkTarget || undefined}
              rel={linkRel || undefined}
              className={styles.link}
            >
              {linkLabel}
            </SimpleLink>
          </div>
        </div>
      </div>
    </section>
  );
}

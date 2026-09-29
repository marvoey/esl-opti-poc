import React from "react";
import { Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import { ArrowRightIcon, CheckIcon } from "@/components/atoms/icons";
import styles from "./FinalCta.module.css";
import { DEFAULT_FINAL_CTA_PROPS, type FinalCtaProps } from "./finalCtaData";

export type { FinalCtaProps } from "./finalCtaData";

/**
 * Final CTA Organism
 *
 * Centered, high-conversion section placed near the bottom of product and
 * landing pages to prompt users to open an account: a soft aqua/mint
 * gradient background, an H2 + supporting copy, a primary button with a
 * trailing arrow, and an eligibility note (check icon + micro text).
 */
export function FinalCta({
  id = DEFAULT_FINAL_CTA_PROPS.id,
  heading = DEFAULT_FINAL_CTA_PROPS.heading,
  description = DEFAULT_FINAL_CTA_PROPS.description,
  buttonText = DEFAULT_FINAL_CTA_PROPS.buttonText,
  buttonHref = DEFAULT_FINAL_CTA_PROPS.buttonHref,
  eligibilityNote = DEFAULT_FINAL_CTA_PROPS.eligibilityNote,
  className = "",
}: FinalCtaProps) {
  const sectionClassName = className
    ? `${styles.section} ${className}`
    : styles.section;
  const sectionId = id || "final-cta";
  const headingId = `${sectionId}-heading`;

  return (
    <section id={sectionId} aria-labelledby={headingId} className={sectionClassName}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Heading level="h2" id={headingId} className={styles.heading}>
            {heading}
          </Heading>
          <Text as="p" variant="body" className={styles.description}>
            {description}
          </Text>
          <div className={styles.actionWrapper}>
            <Button
              variant="primary"
              href={buttonHref}
              rightIcon={<ArrowRightIcon size={20} aria-hidden="true" />}
              className={styles.button}
            >
              {buttonText}
            </Button>
          </div>
          <p className={styles.eligibilityNote}>
            <CheckIcon
              className={styles.checkIcon}
              size={16}
              aria-hidden={true}
            />
            <span className={styles.eligibilityText}>{eligibilityNote}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

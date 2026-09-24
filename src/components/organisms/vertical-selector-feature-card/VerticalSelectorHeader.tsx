import React from "react";
import { Heading, type HeadingLevel } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import { ArrowRightIcon } from "@/components/atoms/icons";
import type { FeatureCardCtaData } from "./VerticalSelectorFeatureCard";
import styles from "./VerticalSelectorFeatureCard.module.css";

interface VerticalSelectorHeaderProps {
  eyebrow?: string | null;
  title?: string;
  headingLevel?: HeadingLevel;
  headingId: string;
  description?: string | null;
  cta?: FeatureCardCtaData | null;
}

export function VerticalSelectorHeader({
  eyebrow,
  title,
  headingLevel = "h2",
  headingId,
  description,
  cta,
}: VerticalSelectorHeaderProps) {
  const headerCtaExternalProps = cta?.external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <div className={styles.headerRow}>
      <div className={styles.headerContent}>
        {eyebrow && (
          <Text
            as="span"
            variant="eyebrow"
            color="accent"
            className={styles.eyebrow}
          >
            {eyebrow}
          </Text>
        )}

        {title && (
          <Heading
            level={headingLevel}
            id={headingId}
            className={styles.title}
          >
            {title}
          </Heading>
        )}

        {description && (
          <Text
            as="p"
            variant="body-lg"
            color="primary"
            className={styles.description}
          >
            {description}
          </Text>
        )}
      </div>

      {cta && (
        <div className={styles.headerCta}>
          <Button
            variant="primary"
            shape="pill"
            align="right"
            href={cta.href}
            rightIcon={<ArrowRightIcon size={20} />}
            {...headerCtaExternalProps}
          >
            {cta.label}
          </Button>
        </div>
      )}
    </div>
  );
}

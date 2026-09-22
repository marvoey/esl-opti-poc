import React, { useId } from "react";
import { Heading, type HeadingLevel } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import { ArrowRightIcon } from "@/components/atoms/icons";
import { ProcessCard } from "@/components/atoms/card/process-card/ProcessCard";
import styles from "./SplitContentStepList.module.css";

export interface StepItem {
  id?: string;
  step: number | string;
  title: string;
  description: string;
}

export interface SplitContentStepListCta {
  label: string;
  href: string;
}

export interface SplitContentStepListProps {
  /** DOM id; falls back to a useId()-derived id (project idiom, ComparisonCardPair.tsx). */
  id?: string;
  eyebrow?: string;
  title: string;
  titleLevel?: HeadingLevel;
  description: string;
  cta?: SplitContentStepListCta;
  steps: StepItem[];
  className?: string;
}

/**
 * Split Content + Step List Organism
 *
 * Dark-theme, conversion-focused two-column section: editorial copy and a
 * pill CTA on the left, a numbered process step list on the right. Steps
 * are rendered as a semantic <ol> of `ProcessCard variant="inverse"` cards
 * so assistive tech announces "List, N items" (WCAG 2.2 AA).
 */
export function SplitContentStepList({
  id,
  eyebrow,
  title,
  titleLevel = "h2",
  description,
  cta,
  steps,
  className = "",
}: SplitContentStepListProps) {
  const autoId = useId();
  const sectionId = id ?? `split-content-step-list-${autoId.replace(/:/g, "")}`;
  const headingId = `${sectionId}-heading`;

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={`${styles.section} ${className}`.trim()}
    >
      <div className={styles.container}>
        <div className={styles.textCol}>
          {eyebrow && (
            <Text
              as="span"
              variant="eyebrow"
              color="vibrant"
              className={styles.eyebrow}
            >
              {eyebrow}
            </Text>
          )}
          <Heading level={titleLevel} id={headingId} className={styles.title}>
            {title}
          </Heading>
          <Text
            as="p"
            variant="body-lg"
            color="inverted-muted"
            className={styles.description}
          >
            {description}
          </Text>
          {cta && (
            <Button
              variant="secondary"
              shape="pill"
              href={cta.href}
              rightIcon={<ArrowRightIcon size={18} aria-hidden="true" />}
              className={styles.cta}
            >
              {cta.label}
            </Button>
          )}
        </div>

        <ol className={styles.stepList}>
          {steps.map((item) => (
            <li key={item.id ?? item.step} className={styles.stepItem}>
              <ProcessCard
                step={item.step}
                title={item.title}
                description={item.description}
                variant="inverse"
                className={styles.stepCard}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

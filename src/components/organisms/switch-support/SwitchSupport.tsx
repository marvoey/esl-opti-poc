import React from "react";
import { Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { ProcessCard } from "@/components/atoms/card/process-card/ProcessCard";
import { Button } from "@/components/atoms/button/Button";
import { TextLink } from "@/components/atoms/link/TextLink";
import { Icon } from "@/components/atoms/icons";
import { CircleCheck } from "@/components/atoms/circle-check/CircleCheck";
import styles from "./SwitchSupport.module.css";

export interface SwitchSupportStep {
  id: string;
  step: number;
  title: string;
  description: string;
}

export interface SwitchSupportProps {
  id?: string;
  title?: string;
  description?: string;
  steps: SwitchSupportStep[];
  ctaLabel?: string;
  ctaHref?: string;
  linkLabel?: string;
  linkHref?: string;
  className?: string;
}

export function SwitchSupport({
  id,
  title,
  description,
  steps = [],
  ctaLabel,
  ctaHref,
  linkLabel,
  linkHref,
  className = "",
}: SwitchSupportProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`}
      aria-labelledby={title ? `${id ?? "switch-support"}-heading` : undefined}
    >
      <div className={styles.container}>
        {(title || description) && (
          <div className={styles.header}>
            {title && (
              <Heading
                level="h2"
                id={id ? `${id}-heading` : undefined}
                className={styles.heading}
              >
                {title}
              </Heading>
            )}
            {description && (
              <Text variant="body-lg" color="inverted" className={styles.description}>
                {description}
              </Text>
            )}
          </div>
        )}

        <div className={styles.grid}>
          {steps.map((item) => (
            <ProcessCard
              key={item.id}
              step={item.step}
              title={item.title}
              description={item.description}
              variant="inverse"
            />
          ))}
        </div>

        {(ctaLabel && ctaHref) || (linkLabel && linkHref) ? (
          <div className={styles.ctaRow}>
            {ctaLabel && ctaHref && (
              <Button
                href={ctaHref}
                variant="secondary"
                rightIcon={<Icon name="arrow-right" size={18} />}
                className={styles.button}
              >
                {ctaLabel}
              </Button>
            )}
            {linkLabel && linkHref && (
              <TextLink
                href={linkHref}
                variant="light"
                underline="none"
                textVariant="body-sm"
                className={styles.link}
              >
                <span className={styles.linkContent}>
                  <CircleCheck size={28} />
                  {linkLabel}
                </span>
              </TextLink>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

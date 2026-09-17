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

interface SwitchSupportHeaderProps {
  headingId?: string;
  title?: string;
  description?: string;
}

function SwitchSupportHeader({ headingId, title, description }: SwitchSupportHeaderProps) {
  if (!title && !description) return null;

  return (
    <div className={styles.header}>
      {title && (
        <Heading
          level="h2"
          id={headingId}
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
  );
}

interface SwitchSupportActionsProps {
  ctaLabel?: string;
  ctaHref?: string;
  linkLabel?: string;
  linkHref?: string;
}

function SwitchSupportActions({
  ctaLabel,
  ctaHref,
  linkLabel,
  linkHref,
}: SwitchSupportActionsProps) {
  const hasCta = Boolean(ctaLabel && ctaHref);
  const hasLink = Boolean(linkLabel && linkHref);

  if (!hasCta && !hasLink) return null;

  return (
    <div className={styles.ctaRow}>
      {hasCta && (
        <Button
          href={ctaHref!}
          variant="secondary"
          rightIcon={<Icon name="arrow-right" size={18} />}
          className={styles.button}
        >
          {ctaLabel}
        </Button>
      )}
      {hasLink && (
        <TextLink
          href={linkHref!}
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
  );
}

const EMPTY_STEPS: SwitchSupportStep[] = [];

export function SwitchSupport({
  id,
  title,
  description,
  steps = EMPTY_STEPS,
  ctaLabel,
  ctaHref,
  linkLabel,
  linkHref,
  className = "",
}: SwitchSupportProps) {
  if (!steps || steps.length === 0) return null;

  const headingId = id ? `${id}-heading` : undefined;
  const labelledBy = title ? (headingId ?? "switch-support-heading") : undefined;

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`.trim()}
      aria-labelledby={labelledBy}
    >
      <div className={styles.container}>
        <SwitchSupportHeader
          headingId={headingId}
          title={title}
          description={description}
        />

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

        <SwitchSupportActions
          ctaLabel={ctaLabel}
          ctaHref={ctaHref}
          linkLabel={linkLabel}
          linkHref={linkHref}
        />
      </div>
    </section>
  );
}

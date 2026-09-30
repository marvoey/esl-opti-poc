import React, { useId } from "react";
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
  description: React.ReactNode;
}

export interface SwitchSupportProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: React.ReactNode;
  steps: SwitchSupportStep[];
  ctaLabel?: string;
  ctaHref?: string;
  linkLabel?: string;
  linkHref?: string;
  className?: string;
}

interface SwitchSupportHeaderProps {
  headingId?: string;
  eyebrow?: string;
  title?: string;
  description?: React.ReactNode;
}

function SwitchSupportHeader({ headingId, eyebrow, title, description }: SwitchSupportHeaderProps) {
  if (!eyebrow && !title && !description) return null;

  return (
    <div className={styles.header}>
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
          level="h2"
          id={headingId}
          color="inverted"
          className={styles.heading}
        >
          {title}
        </Heading>
      )}
      {description && (
        <Text
          as={typeof description === "string" ? "p" : "div"}
          variant="body-lg"
          color="inverted"
          className={styles.description}
        >
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
  eyebrow,
  title,
  description,
  steps = EMPTY_STEPS,
  ctaLabel,
  ctaHref,
  linkLabel,
  linkHref,
  className = "",
}: SwitchSupportProps) {
  const autoId = useId();

  if (!steps || steps.length === 0) return null;

  // Always resolve to a real, unique id so aria-labelledby cannot dangle when the
  // CMS block omits `id`, and so two instances on one page do not collide.
  const headingId = `${id ?? `switch-support-${autoId.replace(/:/g, "")}`}-heading`;
  const labelledBy = title ? headingId : undefined;

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`.trim()}
      aria-labelledby={labelledBy}
    >
      <div className={styles.container}>
        <SwitchSupportHeader
          headingId={headingId}
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <ol className={styles.grid} role="list">
          {steps.map((item) => (
            <li key={item.id} className={styles.stepItem}>
              <ProcessCard
                step={item.step}
                title={item.title}
                description={item.description}
                variant="inverse"
              />
            </li>
          ))}
        </ol>

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

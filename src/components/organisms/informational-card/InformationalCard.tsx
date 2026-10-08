import React, { useId } from "react";
import { Badge } from "@/components/atoms/badge/Badge";
import { Heading } from "@/components/atoms/heading/Heading";
import { SimpleLink } from "@/components/atoms/link/SimpleLink";
import { Text } from "@/components/atoms/text/Text";
import styles from "./InformationalCard.module.css";
import type { InformationalCardProps } from "./informationalCardData";

export type { InformationalCardProps, InformationalCardLink } from "./informationalCardData";

/**
 * Informational Card Organism
 * A white card with a taxonomy pill, title, copy, an optional "why it's here"
 * note under a divider, and a "see the details" link. With a link, the link's
 * ::after stretches over the card so the whole card is clickable, and hover or
 * keyboard focus switches the border and link to the accent color.
 */
export function InformationalCard({
  id,
  badge,
  title,
  headingLevel = "h2",
  description,
  noteLabel,
  note,
  cta,
  className = "",
}: InformationalCardProps) {
  const autoId = useId();
  if (!title) return null;

  const headingId = `${id ?? autoId}-heading`;
  const hasCta = Boolean(cta?.href && cta.label);
  const classes = [styles.card, hasCta ? styles.interactive : null, className]
    .filter(Boolean)
    .join(" ");

  return (
    <article id={id} className={classes} aria-labelledby={headingId}>
      <div className={styles.body}>
        {badge && (
          <Badge variant="neutral" borderColor="var(--color-accent)" className={styles.badge}>
            {badge}
          </Badge>
        )}

        <Heading as={headingLevel} level="h4" color="primary" id={headingId} className={styles.title}>
          {title}
        </Heading>

        {description && (
          <Text as="div" variant="body-sm" color="secondary" className={styles.description}>
            {description}
          </Text>
        )}

        {note && (
          <>
            <hr className={styles.divider} />
            <Text as="p" variant="body-sm" color="primary" className={styles.note}>
              {noteLabel && <strong>{noteLabel}</strong>}
              {noteLabel ? ` ${note}` : note}
            </Text>
          </>
        )}
      </div>

      {hasCta && cta && (
        <SimpleLink
          href={cta.href}
          color="primary"
          className={styles.cta}
          {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {cta.label}
        </SimpleLink>
      )}
    </article>
  );
}

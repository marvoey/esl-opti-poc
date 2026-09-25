import React, { useId } from "react";
import { Heading, type HeadingLevel } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import { ArrowRightIcon } from "@/components/atoms/icons";
import { RatesCard } from "@/components/atoms/card/rates-card/RatesCard";
import styles from "./MetricCardRow.module.css";
import {
  DEFAULT_METRIC_CARD_ROW,
  type MetricCardItemData,
} from "./metricCardRowData";

export interface MetricCardRowProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  description?: string;
  cta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  cards?: MetricCardItemData[];
  className?: string;
}

/**
 * Metric Card Row Organism
 * Dark navy gradient showcase section featuring:
 * 1. A 2-column header with white heading & description, vibrant turquoise eyebrow,
 *    and a bottom-right aligned secondary pill CTA button with arrow.
 * 2. A 3-column responsive grid displaying a Rates Card Aqua (<RatesCard>) in each column.
 */
export function MetricCardRow({
  id,
  eyebrow = DEFAULT_METRIC_CARD_ROW.eyebrow,
  title = DEFAULT_METRIC_CARD_ROW.title,
  headingLevel = "h2",
  description = DEFAULT_METRIC_CARD_ROW.description,
  cta = DEFAULT_METRIC_CARD_ROW.cta,
  cards = DEFAULT_METRIC_CARD_ROW.cards,
  className = "",
}: MetricCardRowProps) {
  const autoId = useId();
  const headingId = `${id ?? autoId}-heading`;

  const sectionClassName = className
    ? `${styles.section} ${className}`
    : styles.section;

  const ctaExternalProps = cta?.external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <section id={id} className={sectionClassName} aria-labelledby={headingId}>
      <div className={styles.container}>
        {/* Div 1: Header Row (100% Width) */}
        <div className={styles.headerRow}>
          <div className={styles.headerContent}>
            {eyebrow && (
              <Text as="span" variant="eyebrow" color="vibrant" className={styles.eyebrow}>
                {eyebrow}
              </Text>
            )}
            {title && (
              <Heading level={headingLevel} id={headingId} color="inverted" className={styles.title}>
                {title}
              </Heading>
            )}
            {description && (
              <Text
                as="p"
                variant="body-lg"
                color="inverted"
                className={styles.description}
              >
                {description}
              </Text>
            )}
          </div>

          {cta && (
            <div className={styles.headerCta}>
              <Button
                variant="secondary"
                shape="pill"
                align="right"
                href={cta.href}
                rightIcon={<ArrowRightIcon size={20} />}
                {...ctaExternalProps}
              >
                {cta.label}
              </Button>
            </div>
          )}
        </div>

        {/* Div 2: Cards Row (100% Width, Margin-Top: 48px, 3 Columns) */}
        {cards && cards.length > 0 && (
          <ul className={styles.cardsRow} role="list">
            {cards.map((card) => (
              <li key={card.id ?? card.title} className={styles.cardItem}>
                <RatesCard
                  category={card.category}
                  categoryIcon={card.categoryIcon}
                  rate={card.rate}
                  rateUnit={card.rateUnit}
                  rateLabel={card.rateLabel}
                  title={card.title}
                  description={card.description}
                  ctaText={card.ctaText}
                  href={card.href}
                  variant={card.variant}
                  className={styles.ratesCard}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

import React, { useId } from "react";
import { Heading, type HeadingLevel } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Badge } from "@/components/atoms/badge/Badge";
import { Button } from "@/components/atoms/button/Button";
import { CheckIcon, CreditCardIcon, ArrowRightIcon } from "@/components/atoms/icons";
import styles from "./ComparisonCardPair.module.css";
import {
  DEFAULT_COMPARISON_CARD_PAIR_DATA,
  type ComparisonCardData,
  type ComparisonFeatureItem,
} from "./comparisonCardPairData";

export interface ComparisonCardPairProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  description?: string;
  cards?: [ComparisonCardData, ComparisonCardData] | ComparisonCardData[];
  className?: string;
}

function ComparisonCardItem({ card }: { card: ComparisonCardData }) {
  return (
    <article className={styles.card} aria-labelledby={`card-title-${card.id}`}>
      {/* Card Header divided in 2 */}
      <div className={styles.cardHeader}>
        <Heading
          level="h3"
          id={`card-title-${card.id}`}
          className={styles.cardTitle}
        >
          {card.title}
        </Heading>
        {card.badgeText && (
          <Badge
            variant="aqua"
            className={styles.badge}
            borderColor="var(--color-primary)"
            textColor="var(--color-primary)"
          >
            {card.badgeText}
          </Badge>
        )}
      </div>

      {/* Description text */}
      <Text as="p" variant="body" className={styles.cardDescription}>
        {card.description}
      </Text>

      {/* Features List UL > LI * 3 */}
      <ul className={styles.featureList} aria-label={`${card.title} features`}>
        {card.features.map((item: ComparisonFeatureItem) => (
          <li key={item.id} className={styles.featureItem}>
            <span className={styles.featureIcon}>
              {item.iconType === "credit-card" ? (
                <CreditCardIcon size={18} aria-hidden="true" />
              ) : (
                <CheckIcon size={18} aria-hidden="true" />
              )}
            </span>
            <Text as="span" variant="body" weight="bold">
              {item.text}
            </Text>
          </li>
        ))}
      </ul>

      {/* Pill button(s), 100% width, text and arrow centered. One button by default, or two side-by-side (stacked on mobile) when secondaryCta is set. */}
      {(card.cta || card.secondaryCta) && (
        <div className={card.secondaryCta && card.cta ? styles.cardActionTwo : styles.cardAction}>
          {card.cta && (
            <Button
              variant="primary"
              shape="pill"
              size="md"
              fullWidth
              href={card.cta.href}
              target={card.cta.external ? "_blank" : undefined}
              rel={card.cta.external ? "noopener noreferrer" : undefined}
              rightIcon={<ArrowRightIcon size={18} aria-hidden="true" />}
            >
              {card.cta.label}
            </Button>
          )}
          {card.secondaryCta && (
            <Button
              variant="outline"
              shape="pill"
              size="md"
              fullWidth
              href={card.secondaryCta.href}
              target={card.secondaryCta.external ? "_blank" : undefined}
              rel={card.secondaryCta.external ? "noopener noreferrer" : undefined}
              aria-label={card.secondaryCta.label.toLowerCase() === "learn more" ? `Learn more about ${card.title}` : undefined}
            >
              {card.secondaryCta.label}
            </Button>
          )}
        </div>
      )}
    </article>
  );
}

/**
 * Comparison Card Pair Organism
 *
 * Section layout:
 * - Row 1: Header row spanning 100% width mimicking CircularImageMetricRow without right button.
 * - 22px gap separation between Row 1 and Row 2.
 * - Row 2: 2 equal 50% columns on desktop (22px gap), stacking vertically on mobile (22px row gap).
 * - 2 white cards with 16px border-radius, 16px padding-block, 8px padding-inline, 16px internal gap.
 */
export function ComparisonCardPair({
  id,
  eyebrow = DEFAULT_COMPARISON_CARD_PAIR_DATA.eyebrow,
  title = DEFAULT_COMPARISON_CARD_PAIR_DATA.title,
  headingLevel = "h2",
  description = DEFAULT_COMPARISON_CARD_PAIR_DATA.description,
  cards = DEFAULT_COMPARISON_CARD_PAIR_DATA.cards,
  className = "",
}: ComparisonCardPairProps) {
  const autoId = useId();
  const sectionId = id ?? `comparison-pair-${autoId.replace(/:/g, "")}`;
  const headingId = `${sectionId}-heading`;

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={`${styles.section} ${className}`.trim()}
    >
      <div className={styles.container}>
        {/* Row 1: Header Row (100% width) */}
        <header className={styles.headerRow}>
          {eyebrow && (
            <Text as="p" variant="eyebrow" className={styles.eyebrow}>
              {eyebrow}
            </Text>
          )}
          <Heading level={headingLevel} id={headingId} className={styles.title}>
            {title}
          </Heading>
          {description && (
            <Text as="p" variant="body-lg" color="primary" className={styles.description}>
              {description}
            </Text>
          )}
        </header>

        {/* Row 2: 2 Columns 50% on desktop, stacked on mobile */}
        <ul className={styles.cardsGrid} role="list">
          {cards.slice(0, 2).map((card) => (
            <li key={card.id} className={styles.cardItem}>
              <ComparisonCardItem card={card} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

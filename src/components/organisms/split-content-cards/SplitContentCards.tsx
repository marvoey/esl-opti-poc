import React, { useId } from "react";
import { Heading, type HeadingLevel } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import { Stat } from "@/components/atoms/stat/Stat";
import { ArrowRightIcon, StarIcon } from "@/components/atoms/icons";
import { DEFAULT_SPLIT_CONTENT_CARDS_DATA } from "./splitContentCardsData";
import styles from "./SplitContentCards.module.css";

export interface SplitContentCardsHeroMetricData {
  subhead: string;
  value: string;
  unit?: string;
  description?: string;
}

export interface SplitContentCardsStatItemData {
  id?: string;
  value: string;
  label: string;
  icon?: string | null;
}

export interface SplitContentCardsCtaData {
  label: string;
  href: string;
  external?: boolean;
}

export interface SplitContentCardsProps {
  id?: string;
  eyebrow?: string | null;
  title?: string;
  headingLevel?: HeadingLevel;
  description?: React.ReactNode | string | null;
  cta?: SplitContentCardsCtaData | null;
  heroMetric?: SplitContentCardsHeroMetricData | null;
  statCards?: SplitContentCardsStatItemData[];
  backgroundImage?: string;
  className?: string;
}

function isStarStat(stat: SplitContentCardsStatItemData): boolean {
  return (
    stat.icon === "star" ||
    stat.id === "stat-satisfaction" ||
    /satisfaction/i.test(stat.label ?? "")
  );
}

function HeroMetricCard({ metric }: { metric: SplitContentCardsHeroMetricData }) {
  return (
    <li className={styles.heroCard}>
      {metric.subhead && (
        <Text as="span" variant="eyebrow" color="primary" className={styles.heroSubhead}>
          {metric.subhead}
        </Text>
      )}
      <div className={styles.heroStatGroup}>
        <Stat color="accent" className={styles.heroStatValue}>{metric.value}</Stat>
        {metric.unit && <span className={styles.heroStatUnit}>{metric.unit}</span>}
      </div>
      {metric.description && (
        <Text as="p" variant="body" color="primary" className={styles.heroDescription}>
          {metric.description}
        </Text>
      )}
    </li>
  );
}

function StatCard({ stat }: { stat: SplitContentCardsStatItemData }) {
  return (
    <li className={styles.statCard}>
      <div className={styles.statValueGroup}>
        <Stat color="accent" size="sm" className={styles.statValue}>{stat.value}</Stat>
        {isStarStat(stat) && (
          <StarIcon size={24} fill="currentColor" className={styles.statStarIcon} />
        )}
      </div>
      <Text as="p" variant="body" color="primary" className={styles.statLabel}>{stat.label}</Text>
    </li>
  );
}

/**
 * SplitContentCards Organism
 * A conversion and brand-equity showcase section pairing a narrative content column
 * with frosted glass metric and proof-point stat cards over an atmospheric Rochester line illustration.
 */
export function SplitContentCards({
  id,
  eyebrow = DEFAULT_SPLIT_CONTENT_CARDS_DATA.eyebrow,
  title = DEFAULT_SPLIT_CONTENT_CARDS_DATA.title,
  headingLevel = "h2",
  description = DEFAULT_SPLIT_CONTENT_CARDS_DATA.description,
  cta = DEFAULT_SPLIT_CONTENT_CARDS_DATA.cta,
  heroMetric = DEFAULT_SPLIT_CONTENT_CARDS_DATA.heroMetric,
  statCards = DEFAULT_SPLIT_CONTENT_CARDS_DATA.statCards,
  backgroundImage,
  className = "",
}: SplitContentCardsProps) {
  const autoId = useId();
  const headingId = `${id ?? autoId}-heading`;

  const sectionClassName = className
    ? `${styles.section} ${className}`
    : styles.section;

  const sectionStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : undefined;

  const hasStatCards = statCards !== undefined && statCards.length > 0;
  const hasCards = Boolean(heroMetric) || hasStatCards;

  return (
    <section
      id={id}
      className={sectionClassName}
      style={sectionStyle}
      aria-labelledby={headingId}
    >
      <div className={styles.container}>
        {/* Column 1: Narrative & CTA */}
        <div className={styles.contentColumn}>
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
              as={typeof description === "string" ? "p" : "div"}
              variant="body-lg"
              color="primary"
              className={styles.description}
            >
              {description}
            </Text>
          )}

          {cta && (
            <div className={styles.ctaWrapper}>
              <Button
                variant="primary"
                shape="pill"
                href={cta.href}
                rightIcon={<ArrowRightIcon size={16} />}
              >
                {cta.label}
              </Button>
            </div>
          )}
        </div>

        {/* Column 2: Proof-Point Glass Metric Cards */}
        {/* role="list" restores list semantics in Safari/VoiceOver when list-style: none */}
        {hasCards && (
          <ul className={styles.cardsColumn} role="list">
            {/* Top Hero Card */}
            {heroMetric && <HeroMetricCard metric={heroMetric} />}

            {/* Stat Cards (50% each) */}
            {hasStatCards &&
              statCards.map((stat) => (
                <StatCard key={stat.id ?? `${stat.label}-${stat.value}`} stat={stat} />
              ))}
          </ul>
        )}
      </div>
    </section>
  );
}

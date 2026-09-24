import React, { useId } from "react";
import { Heading, type HeadingLevel } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import { Stat } from "@/components/atoms/stat/Stat";
import { ArrowRightIcon } from "@/components/atoms/icons";
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
              color="secondary"
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
        <div className={styles.cardsColumn}>
          {/* Top Hero Card */}
          {heroMetric && (
            <div className={styles.heroCard}>
              {heroMetric.subhead && (
                <Text
                  as="span"
                  variant="eyebrow"
                  color="primary"
                  className={styles.heroSubhead}
                >
                  {heroMetric.subhead}
                </Text>
              )}

              <div className={styles.heroStatGroup}>
                <Stat color="accent" className={styles.heroStatValue}>{heroMetric.value}</Stat>
                {heroMetric.unit && (
                  <span className={styles.heroStatUnit}>{heroMetric.unit}</span>
                )}
              </div>

              {heroMetric.description && (
                <Text
                  as="p"
                  variant="body"
                  color="primary"
                  className={styles.heroDescription}
                >
                  {heroMetric.description}
                </Text>
              )}
            </div>
          )}

          {/* Bottom Dual Stat Cards */}
          {statCards && statCards.length > 0 && (
            <div className={styles.dualStatsRow}>
              {statCards.map((stat) => (
                <div
                  key={stat.id ?? `${stat.label}-${stat.value}`}
                  className={styles.statCard}
                >
                  <Stat color="accent" className={styles.statValue}>{stat.value}</Stat>
                  <Text
                    as="p"
                    variant="body"
                    color="primary"
                    className={styles.statLabel}
                  >
                    {stat.label}
                  </Text>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

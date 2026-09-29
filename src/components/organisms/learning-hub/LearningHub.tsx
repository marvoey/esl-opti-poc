import React, { useId } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { Heading, type HeadingLevel } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import { Badge } from "@/components/atoms/badge/Badge";
import { ArrowRightIcon } from "@/components/atoms/icons";
import styles from "./LearningHub.module.css";
import {
  DEFAULT_LEARNING_HUB_PROPS,
  type LearningHubCardItem,
  type LearningHubProps,
} from "./learningHubData";

export type { LearningHubProps, LearningHubCardItem } from "./learningHubData";

interface LearningHubCardProps {
  card: LearningHubCardItem;
}

/**
 * Learning Hub Card
 * Accessible article/tool preview card: a single <article> wrapping a single
 * semantic link (when `href` is provided) so no interactive elements are
 * nested inside one another.
 */
function LearningHubCard({ card }: LearningHubCardProps) {
  const externalProps = card.external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  const media = (
    <div className={styles.mediaWrapper}>
      {card.imageSrc && (
        <Image
          src={card.imageSrc}
          alt={card.imageAlt ?? ""}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 360px"
          className={styles.thumbnail}
        />
      )}
      <Badge
        variant="aqua"
        borderColor="var(--color-text-primary)"
        textColor="var(--color-text-primary)"
        className={styles.cardBadge}
      >
        {card.badgeText}
      </Badge>
    </div>
  );

  const content = (
    <div className={styles.content}>
      <Text
        as="p"
        variant="body-lg"
        weight="bold"
        color="primary"
        className={styles.cardTitle}
      >
        {card.title}
      </Text>
    </div>
  );

  if (card.href) {
    return (
      <article className={styles.card}>
        <NextLink
          href={card.href}
          className={styles.cardLink}
          {...externalProps}
        >
          {media}
          {content}
        </NextLink>
      </article>
    );
  }

  return (
    <article className={styles.card}>
      {media}
      {content}
    </article>
  );
}

/**
 * Learning Hub Organism
 * Editorial content-discovery section mirroring `<VideoStoryCardRow>`'s
 * header layout and responsive structure, tailored for articles, financial
 * guides, and educational resources:
 * 1. Subtle neutral background (var(--color-bg-subtle) / #F7F9FB).
 * 2. Header row with teal eyebrow, navy heading, neutral-600 description,
 *    and a bottom-right aligned primary pill CTA button with arrow.
 * 3. 3-column responsive grid of article/tool cards (image + aqua badge
 *    overlay + bold title), collapsing to a horizontal scroll-snap track
 *    on mobile (< 768px), with zero JS runtime overhead.
 */
export function LearningHub({
  id,
  eyebrow = DEFAULT_LEARNING_HUB_PROPS.eyebrow,
  title = DEFAULT_LEARNING_HUB_PROPS.title,
  headingLevel = "h2",
  description = DEFAULT_LEARNING_HUB_PROPS.description,
  cta = DEFAULT_LEARNING_HUB_PROPS.cta,
  cards = DEFAULT_LEARNING_HUB_PROPS.cards,
  className = "",
}: LearningHubProps) {
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
              <Heading level={headingLevel} id={headingId} className={styles.title}>
                {title}
              </Heading>
            )}
            {description && (
              <Text
                as="p"
                variant="body-lg"
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
                className={styles.cta}
                {...ctaExternalProps}
              >
                {cta.label}
              </Button>
            </div>
          )}
        </div>

        {/* Div 2: Cards Row (3 Columns Desktop, Horizontal Scroll-Snap Mobile) */}
        {cards && cards.length > 0 && (
          <ul className={styles.cardsRow} role="list">
            {cards.map((card, index) => (
              <li key={card.id ?? card.title} className={styles.cardItem}>
                <LearningHubCard card={card} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

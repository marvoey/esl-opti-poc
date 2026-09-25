import React, { useId } from "react";
import { Heading, type HeadingLevel } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { MediaCard, type MediaCardProps } from "@/components/atoms/card/media-card/MediaCard";
import styles from "./MediaCardGrid.module.css";
import { DEFAULT_MEDIA_CARD_GRID } from "./mediaCardGridData";

export type MediaCardItemData = MediaCardProps;

export interface MediaCardGridProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  cards?: MediaCardItemData[];
  className?: string;
}

/**
 * Media Card Grid Organism
 * Branded dark navy promotional showcase section featuring:
 * 1. Focused header row with turquoise eyebrow and white H2 heading.
 * 2. Dynamic 2 or 3-column responsive grid displaying <MediaCard> promotional cards.
 */
export function MediaCardGrid({
  id,
  eyebrow = DEFAULT_MEDIA_CARD_GRID.eyebrow,
  title = DEFAULT_MEDIA_CARD_GRID.title,
  headingLevel = "h2",
  cards = DEFAULT_MEDIA_CARD_GRID.cards ?? [],
  className = "",
}: MediaCardGridProps) {
  const autoId = useId();
  const headingId = `${id ?? autoId}-heading`;

  const sectionClassName = className
    ? `${styles.section} ${className}`
    : styles.section;

  const isTwoCols = cards.length === 2;
  const gridLayoutClass = isTwoCols ? styles.grid2 : styles.grid3;

  return (
    <section id={id} className={sectionClassName} aria-labelledby={headingId} data-theme="dark">
      <div className={styles.container}>
        {/* Div 1: Header Row */}
        <div className={styles.headerRow}>
          {eyebrow && (
            <Text as="span" variant="eyebrow" color="accent" className={styles.eyebrow}>
              {eyebrow}
            </Text>
          )}
          {title && (
            <Heading level={headingLevel} id={headingId} className={styles.title}>
              {title}
            </Heading>
          )}
        </div>

        {/* Div 2: Cards Row (Dynamic 2 or 3 Columns) */}
        {cards.length > 0 && (
          <div className={`${styles.cardsRow} ${gridLayoutClass}`}>
            {cards.map((card) => (
              <MediaCard
                key={card.id ?? card.title}
                {...card}
                className={styles.cardItem}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

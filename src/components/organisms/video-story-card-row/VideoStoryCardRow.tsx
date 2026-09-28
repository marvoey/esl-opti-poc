import React, { useId } from "react";
import { Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import { ArrowRightIcon } from "@/components/atoms/icons";
import { TestimonialCard } from "@/components/atoms/card/testimonial-card/TestimonialCard";
import styles from "./VideoStoryCardRow.module.css";
import {
  DEFAULT_VIDEO_STORY_CARD_ROW,
  type VideoStoryCardRowProps,
} from "./videoStoryCardRowData";

export type { VideoStoryCardRowProps, VideoStoryCardItemData } from "./videoStoryCardRowData";

/**
 * Video Story Card Row Organism
 * Editorial member story showcase section featuring:
 * 1. Clean white background (var(--color-bg) / #FFFFFF).
 * 2. 2-column header row with teal eyebrow, deep navy heading & description,
 *    and a bottom-right aligned primary pill CTA button with arrow.
 * 3. 3-column responsive grid displaying a Testimonial Card (<TestimonialCard>) in each column
 *    with interactive video facade and lightbox dialog.
 */
export function VideoStoryCardRow({
  id,
  eyebrow = DEFAULT_VIDEO_STORY_CARD_ROW.eyebrow,
  title = DEFAULT_VIDEO_STORY_CARD_ROW.title,
  headingLevel = "h2",
  description = DEFAULT_VIDEO_STORY_CARD_ROW.description,
  cta = DEFAULT_VIDEO_STORY_CARD_ROW.cta,
  cards = DEFAULT_VIDEO_STORY_CARD_ROW.cards,
  className = "",
}: VideoStoryCardRowProps) {
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
              <Text as="span" variant="eyebrow" color="accent" className={styles.eyebrow}>
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
                as={typeof description === "string" ? "p" : "div"}
                variant="body-lg"
                color="primary"
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
                {...ctaExternalProps}
              >
                {cta.label}
              </Button>
            </div>
          )}
        </div>

        {/* Div 2: Cards Row (100% Width, Margin-Top: 48px, 3 Columns) */}
        {cards && cards.length > 0 && (
          <ul className={styles.cardsRow}>
            {cards.map((card) => (
              <li key={card.id ?? card.title} className={styles.cardItem}>
                <TestimonialCard
                  imageSrc={card.imageSrc}
                  imageAlt={card.imageAlt}
                  videoUrl={card.videoUrl}
                  videoTitle={card.videoTitle}
                  icon={card.icon}
                  title={card.title}
                  quote={card.quote}
                  author={card.author}
                  className={styles.testimonialCard}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

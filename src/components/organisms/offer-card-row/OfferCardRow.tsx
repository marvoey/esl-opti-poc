"use client";

import React, { useId, useState, useCallback, useEffect, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { withReducedMotion } from "@/components/molecules/carousel/emblaMotion";
import type { EmblaCarouselType } from "embla-carousel";
import { Heading, type HeadingLevel } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { MediaCard } from "@/components/atoms/card/media-card/MediaCard";
import styles from "./OfferCardRow.module.css";
import {
  DEFAULT_OFFER_CARD_ROW_PROPS,
  DEFAULT_OFFER_CARDS_6,
  type OfferCardItemData,
  type OfferCardRowProps,
} from "./offerCardRowData";

export type { OfferCardItemData, OfferCardRowProps };

function ChevronLeftIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/**
 * Offer Card Row Organism
 * Promotional showcase featuring:
 * 1. Branded dark navy gradient section with focused header row (turquoise eyebrow + white H2).
 * 2. Embla Carousel showcasing 6 time-sensitive banking offer cards (3 visible on desktop, 2 on tablet, 1 on mobile).
 * 3. Netflix-style navigation: small solid navy panels flanking the row, always visible,
 *    instead of small floating circular buttons.
 */
export function OfferCardRow({
  id,
  eyebrow = DEFAULT_OFFER_CARD_ROW_PROPS.eyebrow,
  title = DEFAULT_OFFER_CARD_ROW_PROPS.title,
  headingLevel = "h2",
  cards = DEFAULT_OFFER_CARDS_6,
  className = "",
}: OfferCardRowProps) {
  const autoId = useId();
  const headingId = `${id ?? autoId}-heading`;
  const carouselId = `${id ?? autoId}-carousel`;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    withReducedMotion({
      align: "start",
      containScroll: "trimSnaps",
      slidesToScroll: 1,
    })
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(cards.length > 3);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  // null until Embla reports, so no card is inert during SSR/first paint.
  const [slidesInView, setSlidesInView] = useState<number[] | null>(null);

  // Embla hands back an array; derive the Set once per change so the per-slide
  // lookup below is O(1) without keeping a derived structure in state.
  const inViewSet = useMemo(
    () => (slidesInView === null ? null : new Set(slidesInView)),
    [slidesInView]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onInView = () => setSlidesInView(emblaApi.slidesInView());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("slidesInView", onInView);
    emblaApi.on("reInit", onInView);
    queueMicrotask(() => {
      onSelect(emblaApi);
      onInView();
    });
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("slidesInView", onInView);
      emblaApi.off("reInit", onInView);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const sectionClassName = className
    ? `${styles.section} ${className}`
    : styles.section;

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

        {/* Div 2: Embla Carousel Row */}
        {cards.length > 0 && (
          <div className={styles.carouselWrapper}>
            {/* Prev Button */}
            <button
              type="button"
              className={styles.navButton}
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Previous offers"
              aria-controls={carouselId}
            >
              <ChevronLeftIcon size={16} />
            </button>

            {/* Embla Viewport */}
            <div
              className={styles.viewport}
              ref={emblaRef}
              id={carouselId}
              role="region"
              aria-roledescription="carousel"
              aria-label="Offers carousel"
            >
              <div className={styles.track}>
                {cards.map((card, index) => (
                  <div
                    key={card.id ?? card.title}
                    className={styles.slide}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${cards.length}`}
                    inert={inViewSet !== null && !inViewSet.has(index)}
                  >
                    <MediaCard
                      {...card}
                      className={styles.cardItem}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              type="button"
              className={styles.navButton}
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Next offers"
              aria-controls={carouselId}
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

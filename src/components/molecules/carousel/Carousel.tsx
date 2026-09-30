"use client";

import React, { useCallback, useEffect, useState } from "react";
import type { EmblaViewportRefType } from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Carousel.module.css";

export interface CarouselProps {
  children: React.ReactNode;
  /** The `emblaRef` returned by the caller's own `useEmblaCarousel()` call, attached to the viewport element. */
  emblaRef: EmblaViewportRefType;
  /**
   * The Embla API instance (the second value returned by `useEmblaCarousel()`).
   * Optional for backward compatibility, but required to get keyboard arrow-key
   * navigation and the built-in Previous/Next controls (WCAG 2.1.1 Keyboard).
   */
  emblaApi?: EmblaCarouselType;
  className?: string;
  viewportClassName?: string;
  containerClassName?: string;
  ariaLabel?: string;
  /** Renders built-in Previous/Next buttons. Default `true`. Set `false` if the caller renders its own. */
  showControls?: boolean;
  prevLabel?: string;
  nextLabel?: string;
}

export interface CarouselSlideProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Marks a slide that is scrolled out of the clipped viewport. Embla keeps every
   * slide mounted, so without this their links and buttons stay in the tab order
   * while invisible (WCAG 2.4.3 Focus Order, 2.4.7 Focus Visible).
   */
  inert?: boolean;
}

export function Carousel({
  children,
  emblaRef,
  emblaApi,
  className,
  viewportClassName,
  containerClassName,
  ariaLabel = "Carousel",
  showControls = true,
  prevLabel = "Previous slide",
  nextLabel = "Next slide",
}: CarouselProps) {
  const carouselClass = className
    ? `${styles.carousel} ${className}`
    : styles.carousel;

  const viewportClass = viewportClassName
    ? `${styles.viewport} ${viewportClassName}`
    : styles.viewport;

  const containerClass = containerClassName
    ? `${styles.container} ${containerClassName}`
    : styles.container;

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback((api: EmblaCarouselType) => {
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    queueMicrotask(() => updateScrollState(emblaApi));
    emblaApi.on("select", updateScrollState);
    emblaApi.on("reInit", updateScrollState);
    return () => {
      emblaApi.off("select", updateScrollState);
      emblaApi.off("reInit", updateScrollState);
    };
  }, [emblaApi, updateScrollState]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!emblaApi) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        emblaApi.scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        emblaApi.scrollNext();
      }
    },
    [emblaApi]
  );

  const slideCount = React.Children.count(children);

  return (
    <section
      className={carouselClass}
      aria-label={ariaLabel}
      aria-roledescription="carousel"
    >
      <div
        className={viewportClass}
        ref={emblaRef}
        onKeyDown={emblaApi ? handleKeyDown : undefined}
      >
        <div className={containerClass}>{children}</div>
      </div>

      {showControls && emblaApi && slideCount > 1 && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label={prevLabel}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label={nextLabel}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}

export function CarouselSlide({ children, className, inert }: CarouselSlideProps) {
  const slideClass = className
    ? `${styles.slide} ${className}`
    : styles.slide;

  return (
    <div
      className={slideClass}
      role="group"
      aria-roledescription="slide"
      inert={inert}
    >
      {children}
    </div>
  );
}

"use client";

import React from "react";
import type { EmblaViewportRefType } from "embla-carousel-react";
import styles from "./Carousel.module.css";

export interface CarouselProps {
  children: React.ReactNode;
  /** The `emblaRef` returned by the caller's own `useEmblaCarousel()` call, attached to the viewport element. */
  emblaRef: EmblaViewportRefType;
  className?: string;
  viewportClassName?: string;
  containerClassName?: string;
  ariaLabel?: string;
}

export interface CarouselSlideProps {
  children: React.ReactNode;
  className?: string;
}

export function Carousel({
  children,
  emblaRef,
  className,
  viewportClassName,
  containerClassName,
  ariaLabel = "Carousel",
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

  return (
    <section
      className={carouselClass}
      aria-label={ariaLabel}
      aria-roledescription="carousel"
    >
      <div className={viewportClass} ref={emblaRef}>
        <div className={containerClass}>{children}</div>
      </div>
    </section>
  );
}

export function CarouselSlide({ children, className }: CarouselSlideProps) {
  const slideClass = className
    ? `${styles.slide} ${className}`
    : styles.slide;

  return (
    <div
      className={slideClass}
      role="group"
      aria-roledescription="slide"
    >
      {children}
    </div>
  );
}

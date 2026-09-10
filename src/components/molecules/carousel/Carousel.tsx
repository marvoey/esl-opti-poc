"use client";

import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType, EmblaPluginType, EmblaCarouselType } from "embla-carousel";
import styles from "./Carousel.module.css";

export interface CarouselProps {
  children: React.ReactNode;
  options?: EmblaOptionsType;
  plugins?: EmblaPluginType[];
  className?: string;
  viewportClassName?: string;
  containerClassName?: string;
  ariaLabel?: string;
  setApi?: (api: EmblaCarouselType) => void;
}

export interface CarouselSlideProps {
  children: React.ReactNode;
  className?: string;
}

export function Carousel({
  children,
  options,
  plugins,
  className,
  viewportClassName,
  containerClassName,
  ariaLabel = "Carousel",
  setApi,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);

  useEffect(() => {
    if (emblaApi && setApi) {
      setApi(emblaApi);
    }
  }, [emblaApi, setApi]);

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

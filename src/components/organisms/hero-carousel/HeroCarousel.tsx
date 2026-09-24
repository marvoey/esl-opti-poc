"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Carousel, CarouselSlide } from "@/components/molecules/carousel/Carousel";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import { Icon, type IconName } from "@/components/atoms/icons";
import styles from "./HeroCarousel.module.css";

function resolveSlideCtaIcon(iconKey?: string | null): {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} {
  if (!iconKey) return { leftIcon: undefined, rightIcon: undefined };

  const clean = iconKey.trim().toLowerCase();
  if (!clean || clean === "none") {
    return { leftIcon: undefined, rightIcon: undefined };
  }

  if (clean === "arrow" || clean === "arrow-right") {
    return {
      leftIcon: undefined,
      rightIcon: <ArrowRight size={18} aria-hidden="true" />,
    };
  }

  return {
    leftIcon: <Icon name={clean as IconName} size={18} aria-hidden="true" />,
    rightIcon: undefined,
  };
}

export interface HeroCarouselProps {
  className?: string;
  ariaLabel?: string;
  slides?: SlideItem[];
  variant?: "default" | "squared";
  editProps?: {
    eyebrow?: Record<string, any>;
    heading?: Record<string, any>;
    description?: Record<string, any>;
    primaryCta?: Record<string, any>;
    primaryCtaText?: Record<string, any>;
  };
}

import { HERO_SLIDES, type SlideItem } from "./heroSlides";
export { HERO_SLIDES, type SlideItem };

export function HeroCarousel({
  className,
  ariaLabel = "Featured hero slider",
  slides = HERO_SLIDES,
  variant = "default",
  editProps,
}: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
  });
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return true;
  });

  // WCAG 2.2 SC 2.2.2: Subscribe to runtime changes for reduced motion
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsPlaying(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Autoplay effect with Page Visibility API guard to prevent blank slides when tab is backgrounded
  useEffect(() => {
    if (!emblaApi || !isPlaying || (slides && slides.length <= 1)) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startAutoplay = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (typeof document !== "undefined" && document.hidden) return;
        emblaApi.scrollNext();
      }, 6000);
    };

    const stopAutoplay = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (typeof document !== "undefined" && document.hidden) {
        stopAutoplay();
      } else {
        // Tab became visible: re-sync Embla loop and recalculate dimensions
        emblaApi.reInit();
        startAutoplay();
      }
    };

    if (typeof document === "undefined" || !document.hidden) {
      startAutoplay();
    }

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      stopAutoplay();
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, [emblaApi, isPlaying, slides]);

  const activeSlides = slides && slides.length > 0 ? slides : [];

  if (activeSlides.length === 0) {
    return null;
  }

  const combinedClass = className
    ? `${styles.heroCarousel} ${className}`
    : styles.heroCarousel;

  return (
    <div className={combinedClass}>
      <Carousel
        ariaLabel={ariaLabel}
        className={styles.heroContainer}
        containerClassName={styles.slideTrack}
        emblaRef={emblaRef}
        emblaApi={emblaApi}
        showControls={false}
      >
        {activeSlides.map((slide, index) => {
          const isFirst = index === 0;
          const isSquared = variant === "squared";
          const primaryIcons = resolveSlideCtaIcon(slide.primaryCtaIcon);
          const secondaryIcons = resolveSlideCtaIcon(slide.secondaryCtaIcon);
          return (
            <CarouselSlide key={slide.id} className={styles.slideItem}>
              <article className={styles.slideContent}>
                <div className={styles.textGroup}>
                  {/* 1. Eyebrow */}
                  <div
                    className={styles.eyebrowArea}
                    {...(isFirst && editProps?.eyebrow ? editProps.eyebrow : {})}
                  >
                    <Text as="p" variant="eyebrow" color="guidance">
                      {slide.eyebrow}
                    </Text>
                  </div>

                  {/* 2. Heading with custom typography tokens */}
                  <div
                    className={styles.headingArea}
                    {...(isFirst && editProps?.heading ? editProps.heading : {})}
                  >
                    <Text as="h2" variant="hero-h2" color="primary">
                      {slide.titleLine1}
                      {slide.titleLine2 && (
                        <>
                          <br />
                          {slide.titleLine2}
                        </>
                      )}
                    </Text>
                  </div>

                  {/* 3. Body text */}
                  <div
                    className={styles.bodyArea}
                    {...(isFirst && editProps?.description ? editProps.description : {})}
                  >
                    <Text as="div" variant="subhead" color="primary">
                      {slide.body}
                    </Text>
                  </div>

                  {/* 5. Actions */}
                  <div className={styles.actionsArea}>
                    {slide.primaryCta && (
                      <div {...(isFirst && (editProps?.primaryCta || editProps?.primaryCtaText) ? (editProps.primaryCta || editProps.primaryCtaText) : {})}>
                        <Button
                          variant={(slide.primaryCtaVariant as any) || "primary"}
                          leftIcon={primaryIcons.leftIcon}
                          rightIcon={primaryIcons.rightIcon}
                          className={styles.actionBtn}
                          href={slide.primaryCtaHref || undefined}
                          target={slide.primaryCtaExternal ? "_blank" : undefined}
                          rel={slide.primaryCtaExternal ? "noopener noreferrer" : undefined}
                        >
                          {slide.primaryCta}
                        </Button>
                      </div>
                    )}
                    {slide.secondaryCta && (
                      <Button
                        variant={(slide.secondaryCtaVariant as any) || "secondary"}
                        leftIcon={secondaryIcons.leftIcon}
                        rightIcon={secondaryIcons.rightIcon}
                        className={styles.actionBtn}
                        href={slide.secondaryCtaHref || undefined}
                        target={slide.secondaryCtaExternal ? "_blank" : undefined}
                        rel={slide.secondaryCtaExternal ? "noopener noreferrer" : undefined}
                      >
                        {slide.secondaryCta}
                      </Button>
                    )}
                  </div>
                </div>

                {/* 4. Responsive Image & Badge (Circle or Squared) */}
                {slide.imageSrc && (
                  <div className={styles.mediaArea}>
                    <div className={isSquared ? styles.imageWrapperSquared : styles.imageWrapper}>
                      <Image
                        src={slide.imageSrc}
                        alt={slide.imageAlt || ""}
                        width={440}
                        height={440}
                        className={isSquared ? styles.imageSquared : styles.image}
                        priority={isFirst}
                        loading={isFirst ? "eager" : "lazy"}
                        unoptimized={Boolean(slide.imageSrc.startsWith("http"))}
                      />
                      {(slide.badgeStat || slide.badgeLabel) && (
                        <div className={isSquared ? styles.badgeSquared : styles.badge} aria-hidden="true">
                          {slide.badgeStat && <span className={styles.badgePercent}>{slide.badgeStat}</span>}
                          {slide.badgeLabel && <span className={styles.badgeLabel}>{slide.badgeLabel}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </article>
            </CarouselSlide>
          );
        })}
      </Carousel>

      {/* Accessible Navigation Controls (only shown when multiple slides exist) */}
      {activeSlides.length > 1 && (
        <nav className={styles.controls} aria-label="Hero carousel navigation">
          <button
            type="button"
            onClick={scrollPrev}
            className={styles.controlBtn}
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className={styles.controlBtn}
            aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
            aria-pressed={!isPlaying}
          >
            {isPlaying ? (
              <Pause size={18} aria-hidden="true" />
            ) : (
              <Play size={18} aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={scrollNext}
            className={styles.controlBtn}
            aria-label="Next slide"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  );
}

"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Carousel, CarouselSlide } from "@/components/molecules/carousel/Carousel";
import { Text } from "@/components/atoms/text/Text";
import { Button, type ButtonVariant } from "@/components/atoms/button/Button";
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
  headingLevel?: "h1" | "h2";
  editProps?: {
    eyebrow?: Record<string, unknown>;
    heading?: Record<string, unknown>;
    description?: Record<string, unknown>;
    primaryCta?: Record<string, unknown>;
    primaryCtaText?: Record<string, unknown>;
  };
}

import { HERO_SLIDES, type SlideItem } from "./heroSlides";
export { HERO_SLIDES, type SlideItem };

export function HeroCarousel({
  className,
  ariaLabel = "Featured hero slider",
  slides = HERO_SLIDES,
  variant = "default",
  headingLevel = "h2",
  editProps,
}: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // null until Embla reports, so no slide is inert during SSR/first paint.
  const [slidesInView, setSlidesInView] = useState<number[] | null>(null);

  // Embla hands back an array; derive the Set once per change so the per-slide
  // lookup below is O(1) without keeping a derived structure in state.
  const inViewSet = useMemo(
    () => (slidesInView === null ? null : new Set(slidesInView)),
    [slidesInView]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const onInView = () => setSlidesInView(emblaApi.slidesInView());
    onSelect();
    onInView();
    emblaApi.on("select", onSelect);
    emblaApi.on("slidesInView", onInView);
    emblaApi.on("reInit", onInView);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("slidesInView", onInView);
      emblaApi.off("reInit", onInView);
    };
  }, [emblaApi]);

  // WCAG 2.2 SC 2.2.2: Sync with prefers-reduced-motion after mount to avoid hydration mismatch
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (mediaQuery.matches) {
      timer = setTimeout(() => setIsPlaying(false), 0);
    }
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsPlaying(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      if (timer) clearTimeout(timer);
      mediaQuery.removeEventListener("change", handleChange);
    };
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

  const slideCount = slides?.length ?? 0;

  // Autoplay effect with Page Visibility API guard to prevent blank slides when tab is backgrounded
  useEffect(() => {
    if (!emblaApi || !isPlaying || slideCount <= 1) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    function tick() {
      if (typeof document !== "undefined" && document.hidden) return;
      emblaApi?.scrollNext();
    }

    function startAutoplay() {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(tick, 6000);
    }

    function handleVisibilityChange() {
      if (typeof document !== "undefined" && document.hidden) {
        if (intervalId) { clearInterval(intervalId); intervalId = null; }
      } else {
        // Tab became visible: re-sync Embla loop and recalculate dimensions
        emblaApi?.reInit();
        startAutoplay();
      }
    }

    if (typeof document === "undefined" || !document.hidden) {
      startAutoplay();
    }

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, [emblaApi, isPlaying, slideCount]);

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
            <CarouselSlide
              key={slide.id}
              className={styles.slideItem}
              inert={inViewSet !== null && !inViewSet.has(index)}
            >
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
                    {/* Only the first slide may carry the requested level: every slide
                        is mounted at once, so using h1 throughout would emit one h1
                        per slide (WCAG 1.3.1). */}
                    <Text as={isFirst ? headingLevel : "h2"} variant="hero-h2" color="primary">
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
                          variant={(slide.primaryCtaVariant as ButtonVariant) || "primary"}
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
                        variant={(slide.secondaryCtaVariant as ButtonVariant) || "secondary"}
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
                        fill
                        sizes="(max-width: 768px) 100vw, 440px"
                        className={isSquared ? styles.imageSquared : styles.image}
                        priority={isFirst}
                        fetchPriority={isFirst ? "high" : "auto"}
                      />
                      {(slide.badgeStat || slide.badgeLabel) && (
                        <div className={isSquared ? styles.badgeSquared : styles.badge} aria-hidden="true">
                          {slide.badgeStat && (() => {
                            const hasPercentSuffix = slide.badgeStat.trim().endsWith("%");
                            const statValue = hasPercentSuffix
                              ? slide.badgeStat.trim().slice(0, -1)
                              : slide.badgeStat;
                            return (
                              <span className={styles.badgePercent}>
                                {statValue}
                                {hasPercentSuffix && (
                                  <span className={styles.badgePercentSymbol}>%</span>
                                )}
                              </span>
                            );
                          })()}
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

      {/* SC 4.1.3: announce slide changes. Kept silent while auto-rotating, per the
          APG carousel pattern, so the rotation does not continuously interrupt. */}
      {activeSlides.length > 1 && (
        <div
          className={styles.visuallyHidden}
          aria-live={isPlaying ? "off" : "polite"}
          aria-atomic="true"
        >
          {`Slide ${selectedIndex + 1} of ${activeSlides.length}`}
        </div>
      )}

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

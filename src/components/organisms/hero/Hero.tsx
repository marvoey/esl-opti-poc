import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Text } from "@/components/atoms/text/Text";
import { Button, type ButtonVariant } from "@/components/atoms/button/Button";
import { Icon, type IconName } from "@/components/atoms/icons";
import { DEFAULT_HERO_CONTENT, type HeroContentItem } from "./heroContent";
import styles from "./Hero.module.css";

export { DEFAULT_HERO_CONTENT, type HeroContentItem };

export interface HeroProps {
  content?: HeroContentItem;
  variant?: "default" | "squared";
  headingLevel?: "h1" | "h2";
  /** The hero image is normally the LCP element, so it is preloaded by default. */
  priority?: boolean;
  className?: string;
  editProps?: {
    eyebrow?: Record<string, unknown>;
    heading?: Record<string, unknown>;
    description?: Record<string, unknown>;
    primaryCta?: Record<string, unknown>;
    primaryCtaText?: Record<string, unknown>;
  };
}

function resolveCtaIcon(iconKey?: string | null): {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} {
  if (!iconKey) return {};
  const clean = iconKey.trim().toLowerCase();
  if (!clean || clean === "none") return {};
  if (clean === "arrow" || clean === "arrow-right") {
    return { rightIcon: <ArrowRight size={18} aria-hidden="true" /> };
  }
  return { leftIcon: <Icon name={clean as IconName} size={18} aria-hidden="true" /> };
}

/**
 * Hero Organism
 *
 * A single, static hero. Visually identical to one HeroCarousel slide, but with
 * no rotation: no Embla, no autoplay, no controls, and no carousel ARIA. Because
 * it holds no client state it stays a Server Component.
 */
export function Hero({
  content = DEFAULT_HERO_CONTENT,
  variant = "default",
  headingLevel = "h1",
  priority = true,
  className,
  editProps,
}: HeroProps) {
  const isSquared = variant === "squared";
  const primaryIcons = resolveCtaIcon(content.primaryCtaIcon);
  const secondaryIcons = resolveCtaIcon(content.secondaryCtaIcon);
  const sectionClass = className ? `${styles.hero} ${className}` : styles.hero;

  return (
    <div className={sectionClass}>
      <div className={styles.heroContainer}>
        <article className={styles.content}>
          <div className={styles.textGroup}>
            <div className={styles.eyebrowArea} {...(editProps?.eyebrow ?? {})}>
              <Text as="p" variant="eyebrow" color="guidance">
                {content.eyebrow}
              </Text>
            </div>

            <div className={styles.headingArea} {...(editProps?.heading ?? {})}>
              <Text as={headingLevel} variant="hero-h2" color="primary">
                {content.titleLine1}
                {content.titleLine2 && (
                  <>
                    <br />
                    {content.titleLine2}
                  </>
                )}
              </Text>
            </div>

            <div className={styles.bodyArea} {...(editProps?.description ?? {})}>
              <Text as="div" variant="subhead" color="primary">
                {content.body}
              </Text>
            </div>

            <div className={styles.actionsArea}>
              {content.primaryCta && (
                <div {...(editProps?.primaryCta ?? editProps?.primaryCtaText ?? {})}>
                  <Button
                    variant={(content.primaryCtaVariant as ButtonVariant) || "primary"}
                    leftIcon={primaryIcons.leftIcon}
                    rightIcon={primaryIcons.rightIcon}
                    className={styles.actionBtn}
                    href={content.primaryCtaHref || undefined}
                    target={content.primaryCtaExternal ? "_blank" : undefined}
                    rel={content.primaryCtaExternal ? "noopener noreferrer" : undefined}
                  >
                    {content.primaryCta}
                  </Button>
                </div>
              )}
              {content.secondaryCta && (
                <Button
                  variant={(content.secondaryCtaVariant as ButtonVariant) || "secondary"}
                  leftIcon={secondaryIcons.leftIcon}
                  rightIcon={secondaryIcons.rightIcon}
                  className={styles.actionBtn}
                  href={content.secondaryCtaHref || undefined}
                  target={content.secondaryCtaExternal ? "_blank" : undefined}
                  rel={content.secondaryCtaExternal ? "noopener noreferrer" : undefined}
                >
                  {content.secondaryCta}
                </Button>
              )}
            </div>
          </div>

          {content.imageSrc && (
            <div className={styles.mediaArea}>
              <div className={isSquared ? styles.imageWrapperSquared : styles.imageWrapper}>
                <Image
                  src={content.imageSrc}
                  alt={content.imageAlt || ""}
                  fill
                  sizes="(max-width: 768px) 100vw, 440px"
                  className={isSquared ? styles.imageSquared : styles.image}
                  priority={priority}
                  fetchPriority={priority ? "high" : "auto"}
                />
                {(content.badgeStat || content.badgeLabel) && (
                  <div
                    className={isSquared ? styles.badgeSquared : styles.badge}
                    aria-hidden="true"
                  >
                    {content.badgeStat && <HeroBadgeStat stat={content.badgeStat} />}
                    {content.badgeLabel && (
                      <span className={styles.badgeLabel}>{content.badgeLabel}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

function HeroBadgeStat({ stat }: { stat: string }) {
  const trimmed = stat.trim();
  const hasPercentSuffix = trimmed.endsWith("%");
  const value = hasPercentSuffix ? trimmed.slice(0, -1) : stat;

  return (
    <span className={styles.badgePercent}>
      {value}
      {hasPercentSuffix && <span className={styles.badgePercentSymbol}>%</span>}
    </span>
  );
}

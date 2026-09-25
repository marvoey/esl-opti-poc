import React, { useId } from "react";
import Image from "next/image";
import { Heading } from "@/components/atoms/heading/Heading";
import { Text, type TextColor } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import styles from "./SideBySide.module.css";

export interface SideBySideProps {
  id?: string;
  variant?: "dark" | "light";
  eyebrow: string;
  eyebrowColor?: TextColor;
  headline: React.ReactNode;
  headingLevel?: "h1" | "h2" | "h3" | "h4";
  body: string | React.ReactNode;
  ctaLabel: string;
  ctaUrl: string;
  ctaExternal?: boolean;
  imageSrc: string;
  imageAlt: string;
  className?: string;
  loading?: "eager" | "lazy";
  priority?: boolean;
  ariaLabel?: string;
}

export function SideBySide({
  id,
  variant = "dark",
  eyebrow,
  eyebrowColor,
  headline,
  headingLevel = "h3",
  body,
  ctaLabel,
  ctaUrl,
  ctaExternal = false,
  imageSrc,
  imageAlt,
  className = "",
  loading = "lazy",
  priority = false,
  ariaLabel,
}: SideBySideProps) {
  const isDark = variant === "dark";
  const autoId = useId();
  const headingId = `${id ?? autoId}-heading`;
  const resolvedEyebrowColor = eyebrowColor ?? "accent";

  const combinedSectionClass = className
    ? `${styles.section} ${className}`
    : styles.section;

  const cardClass = isDark
    ? `${styles.card} ${styles.cardDark}`
    : `${styles.card} ${styles.cardLight}`;

  // Content stays first in the DOM so screen readers reach the heading
  // before the decorative image; visual column order is flipped per
  // variant (and collapsed to image-on-top on mobile) via CSS `order`.
  const contentClass = isDark
    ? `${styles.content} ${styles.contentOrderFirst}`
    : `${styles.content} ${styles.contentOrderLast}`;

  const imageColumnClass = isDark
    ? `${styles.imageColumn} ${styles.imageColumnRight}`
    : `${styles.imageColumn} ${styles.imageColumnLeft}`;

  const headlineColorClass = isDark
    ? styles.headlineDark
    : styles.headlineLight;

  const externalLinkProps = ctaExternal
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <section
      id={id}
      className={combinedSectionClass}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabel ? undefined : headingId}
    >
      <div className={styles.container}>
        <article className={cardClass} data-theme={variant}>
          <div className={contentClass}>
            <Text
              as="span"
              variant="eyebrow"
              color={resolvedEyebrowColor}
              className={styles.eyebrow}
            >
              {eyebrow}
            </Text>
            <Heading
              level={headingLevel}
              id={headingId}
              className={`${styles.headline} ${headlineColorClass}`}
            >
              {headline}
            </Heading>
            <Text
              as={typeof body === "string" ? "p" : "div"}
              variant="body"
              color={isDark ? "inverted-muted" : "secondary"}
              className={styles.body}
            >
              {body}
            </Text>
            <Button
              href={ctaUrl}
              variant={isDark ? "secondary" : "primary"}
              {...externalLinkProps}
            >
              {ctaLabel}
            </Button>
          </div>

          <div className={imageColumnClass}>
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              loading={loading}
              priority={priority}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={styles.image}
              aria-hidden={imageAlt ? undefined : true}
            />
          </div>
        </article>
      </div>
    </section>
  );
}

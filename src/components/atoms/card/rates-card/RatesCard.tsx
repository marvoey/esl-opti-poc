import React from "react";
import { CarIcon, SimpleLink, Text } from "../../../atoms";
import styles from "./RatesCard.module.css";

export type RatesCardVariant = "default" | "active";

export interface RatesCardBaseProps {
  category: string;
  categoryIcon?: React.ReactNode;
  rate: string;
  rateUnit?: string;
  rateLabel?: string;
  title: string;
  description: string;
  ctaText?: string;
  variant?: RatesCardVariant;
  className?: string;
}

export type RatesCardAsLink = RatesCardBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof RatesCardBaseProps> & {
    href: string;
  };

export type RatesCardAsDiv = RatesCardBaseProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof RatesCardBaseProps> & {
    href?: undefined;
  };

export type RatesCardProps = RatesCardAsLink | RatesCardAsDiv;

/**
 * RatesCard Component (Figma: "❖ Rates Card Aqua")
 * Compact rate highlight card with category icon badge, high-impact rate display,
 * title, descriptive body, and trailing arrow CTA.
 * 
 * Supports 2 variants:
 * - "default": Dark Navy inverse surface (#00395D) with subtle border.
 * - "active": Persistent luminous Turquoise border (#68E0CC) and elevation glow.
 */
export function RatesCard(props: RatesCardProps) {
  const { category, categoryIcon, rate, rateUnit = "%", rateLabel = "APR", title, description, ctaText = "Explore auto loans", variant = "default", className = "", ...rest } = props;
  const href = "href" in rest ? (rest.href as string) : undefined;
  
  const divProps = { ...rest } as React.HTMLAttributes<HTMLElement>;
  if ("href" in divProps) delete (divProps as Record<string, unknown>).href;

  const variantClass = variant === "active" ? styles.active : styles.default;
  const classes = [styles.card, variantClass, className].filter(Boolean).join(" ");

  return (
    <article className={classes} {...divProps}>
      <header className={styles.header}>
        <span className={styles.iconContainer} aria-hidden="true">
          {categoryIcon ?? <CarIcon size={16} />}
        </span>
        <Text as="p" variant="label" color="vibrant" className={styles.category}>
          {category}
        </Text>
      </header>

      <div className={styles.rateGroup}>
        <Text as="p" variant="stat" color="inverted" className={styles.rateValue}>
          {rate}
        </Text>
        <div className={styles.rateMeta}>
          {rateUnit && <span className={styles.rateUnit}>{rateUnit}</span>}
          {rateLabel && <span className={styles.rateLabel}>{rateLabel}</span>}
        </div>
      </div>

      <div className={styles.body}>
        <Text as="h3" variant="body" weight="bold" color="inverted" className={styles.title}>
          {title}
        </Text>
        <Text as="p" variant="body" color="inverted" className={styles.description}>
          {description}
        </Text>
      </div>

      <footer className={styles.footer}>
        {href ? (
          <SimpleLink href={href} color="accent" className={styles.footerLink}>
            {ctaText}
          </SimpleLink>
        ) : (
          <SimpleLink as="span" color="accent" className={styles.footerLink}>
            {ctaText}
          </SimpleLink>
        )}
      </footer>
    </article>
  );
}

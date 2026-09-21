import React from "react";
import Link from "next/link";
import { ArrowRightIcon, PiggyBankIcon } from "../../icons";
import { Text } from "../../text/Text";
import styles from "./IconContentCard.module.css";

export type IconContentCardVariant = "default" | "inverse";

export interface IconContentCardBaseProps {
  title: string;
  description?: React.ReactNode;
  ctaText?: string;
  icon?: React.ReactNode;
  variant?: IconContentCardVariant;
  className?: string;
}

export type IconContentCardAsLink = IconContentCardBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof IconContentCardBaseProps> & {
    href: string;
  };

export type IconContentCardAsButton = IconContentCardBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof IconContentCardBaseProps> & {
    href?: undefined;
  };

export type IconContentCardProps =
  | IconContentCardAsLink
  | IconContentCardAsButton;

/**
 * IconContentCard Component (Figma: "Icon content cards")
 * Editorial left-aligned card featuring an icon badge, heading, body copy, and CTA with arrow.
 * Strict 3-Tier Design Tokens & WCAG 2.2 AA compliant.
 * Variants:
 * - "default": White card with #D5E5F4 border. Smoothly transitions on hover (300ms ease-out)
 *   to Navy surface, Turquoise ring, and luminous text/icon.
 * - "inverse": Direct inverted state with Navy surface, Turquoise ring, and glow elevation.
 */
export function IconContentCard({
  title,
  description,
  ctaText = "CTA here",
  icon,
  variant = "default",
  className = "",
  ...rest
}: IconContentCardProps) {
  const variantClass = variant === "inverse" ? styles.inverse : styles.default;
  const classes = [styles.card, variantClass, className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <div className={styles.iconBadge} aria-hidden="true">
        {icon ?? <PiggyBankIcon size={24} />}
      </div>

      <div className={styles.content}>
        <Text
          as="span"
          variant="button"
          color="inherit"
          className={styles.title}
        >
          {title}
        </Text>
        {description && (
          <Text
            as={typeof description === "string" ? "p" : "div"}
            variant="body-sm"
            color="inherit"
            className={styles.description}
          >
            {description}
          </Text>
        )}
      </div>

      <div className={styles.ctaWrapper}>
        <Text as="span" variant="micro" color="inherit">
          {ctaText}
        </Text>
        <span className={styles.arrow} aria-hidden="true">
          <ArrowRightIcon size={18} />
        </span>
      </div>
    </>
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...linkRest } = rest as IconContentCardAsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as IconContentCardAsButton;

  return (
    <button type={type} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}

import React from "react";
import Link from "next/link";
import { PiggyBankIcon, ArrowRightIcon } from "../../icons";
import { Text } from "../../text/Text";
import styles from "./QuickLinkSimple.module.css";

export type QuickLinkSimpleVariant = "default" | "inverse";

export interface QuickLinkSimpleBaseProps {
  title: string;
  icon?: React.ReactNode;
  variant?: QuickLinkSimpleVariant;
  className?: string;
}

export type QuickLinkSimpleAsLink = QuickLinkSimpleBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof QuickLinkSimpleBaseProps> & {
    href: string;
  };

export type QuickLinkSimpleAsButton = QuickLinkSimpleBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof QuickLinkSimpleBaseProps> & {
    href?: undefined;
  };

export type QuickLinkSimpleProps =
  | QuickLinkSimpleAsLink
  | QuickLinkSimpleAsButton;

/**
 * QuickLinkSimple Component (Figma: "Quick Link Simple")
 * Compact vertical card with centered title on top and circular icon badge below.
 * Features 2 variants:
 * - "default": White surface (#FFFFFF), #D5E5F4 border, #ECFBF8 circle badge.
 *   On hover, smoothly animates (300ms ease-out) to Navy (#00395D) with Turquoise (#68E0CC) 2px ring and glow shadow.
 * - "inverse": Direct inverted state displaying Navy surface, Turquoise ring, and luminous icon.
 */
export function QuickLinkSimple({
  title,
  icon,
  variant = "default",
  className = "",
  ...rest
}: QuickLinkSimpleProps) {
  const variantClass = variant === "inverse" ? styles.inverse : styles.default;
  const classes = [styles.card, variantClass, className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <Text
        as="span"
        variant="button"
        color="inherit"
        className={styles.title}
      >
        {title}
      </Text>
      <div className={styles.iconCircle} aria-hidden="true">
        {icon ?? <PiggyBankIcon size={43} />}
      </div>
      <ArrowRightIcon size={16} className={styles.arrow} aria-hidden="true" />
    </>
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...linkRest } = rest as QuickLinkSimpleAsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as QuickLinkSimpleAsButton;

  return (
    <button type={type} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}

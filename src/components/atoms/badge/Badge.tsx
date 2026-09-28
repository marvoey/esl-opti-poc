import React from "react";
import { Text } from "../text/Text";
import styles from "./Badge.module.css";

export type BadgeVariant = "aqua" | "neutral" | "dark" | "teal-outline" | "teal";

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  /** Overrides the variant's border color (CSS color or `var(--token)`). Falls back to the variant default when omitted. */
  borderColor?: string;
  /** Overrides the variant's text color (CSS color or `var(--token)`). Falls back to the variant default when omitted. */
  textColor?: string;
  /** Overrides the variant's background color (CSS color or `var(--token)`). Falls back to the variant default when omitted. */
  backgroundColor?: string;
}

/**
 * Badge / Taxonomy Atom Component
 * Renders compact metadata tags matching Figma "Taxonomy Dark" specs.
 * Directly composes <Text variant="micro"> per the Typography Composition Law.
 * Border/text/background colors default to the chosen `variant`, but can be
 * overridden per-instance via `borderColor`/`textColor`/`backgroundColor`
 * instead of overriding the variant's CSS from a consuming component.
 */
export function Badge({
  children,
  variant = "aqua",
  className = "",
  borderColor,
  textColor,
  backgroundColor,
  style,
  ...rest
}: BadgeProps) {
  const variantClass =
    variant === "teal-outline" || variant === "teal"
      ? styles.tealOutline || styles.dark
      : styles[variant] || styles.aqua;
  const classes = [styles.badge, variantClass, className]
    .filter(Boolean)
    .join(" ");

  const colorOverrides: React.CSSProperties = {
    ...(borderColor ? { borderColor } : undefined),
    ...(textColor ? { color: textColor } : undefined),
    ...(backgroundColor ? { backgroundColor } : undefined),
  };

  return (
    <Text
      as="span"
      variant="micro"
      color="inherit"
      className={classes}
      style={{ ...colorOverrides, ...style }}
      {...rest}
    >
      {children}
    </Text>
  );
}

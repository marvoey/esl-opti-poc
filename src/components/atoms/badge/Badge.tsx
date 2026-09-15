import React from "react";
import { Text } from "../text/Text";
import styles from "./Badge.module.css";

export type BadgeVariant = "aqua" | "neutral" | "dark" | "teal-outline";

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

/**
 * Badge / Taxonomy Atom Component
 * Renders compact metadata tags matching Figma "Taxonomy Dark" specs.
 * Directly composes <Text variant="micro"> per the Typography Composition Law.
 */
export function Badge({
  children,
  variant = "aqua",
  className = "",
  ...rest
}: BadgeProps) {
  const variantClass =
    variant === "teal-outline"
      ? styles.tealOutline
      : styles[variant] || styles.aqua;
  const classes = [styles.badge, variantClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <Text
      as="span"
      variant="micro"
      color="inherit"
      className={classes}
      {...rest}
    >
      {children}
    </Text>
  );
}

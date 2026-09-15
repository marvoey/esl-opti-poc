import React from "react";
import styles from "./Text.module.css";

export type TextVariant =
  | "stat"
  | "subhead"
  | "body-lg"
  | "body"
  | "body-sm"
  | "label"
  | "caption"
  | "micro"
  | "button"
  | "eyebrow"
  | "h1"
  | "hero-h2"
  | "footer-title";

export type TextColor =
  | "primary"
  | "secondary"
  | "brand"
  | "muted"
  | "accent"
  | "vibrant"
  | "inverted"
  | "inverted-muted"
  | "guidance"
  | "inherit";

export type TextWeight = "regular" | "medium" | "semibold" | "bold";

export type TextTag = "p" | "span" | "div" | "label" | "small" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color"> {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  weight?: TextWeight;
  as?: TextTag;
  className?: string;
  id?: string;
}

const variantClassMap: Record<TextVariant, string> = {
  stat: styles.stat,
  subhead: styles.subhead,
  "body-lg": styles.bodyLg,
  body: styles.body,
  "body-sm": styles.bodySm,
  label: styles.label,
  caption: styles.caption,
  micro: styles.micro,
  button: styles.button,
  eyebrow: styles.eyebrow,
  h1: styles.h1,
  "hero-h2": styles.heroH2,
  "footer-title": styles.footerTitle,
};

const colorClassMap: Record<TextColor, string> = {
  primary: styles.colorPrimary,
  secondary: styles.colorSecondary,
  brand: styles.colorBrand,
  muted: styles.colorMuted,
  accent: styles.colorAccent,
  vibrant: styles.colorVibrant,
  inverted: styles.colorInverted,
  "inverted-muted": styles.colorInvertedMuted,
  guidance: styles.colorGuidance,
  inherit: styles.colorInherit,
};

const weightClassMap: Record<TextWeight, string> = {
  regular: styles.weightRegular,
  medium: styles.weightMedium,
  semibold: styles.weightSemibold,
  bold: styles.weightBold,
};

export function Text({
  children,
  variant = "body",
  color,
  weight,
  as,
  className,
  id,
  ...rest
}: TextProps) {
  // Default tag heuristics based on variant
  const defaultTag: TextTag =
    variant === "button" || variant === "eyebrow"
      ? "span"
      : variant === "label"
      ? "label"
      : variant === "caption" || variant === "micro"
      ? "small"
      : "p";

  const Component = as || defaultTag;
  const variantClass = variantClassMap[variant] || styles.body;
  const colorClass = color ? colorClassMap[color] : "";
  const weightClass = weight ? weightClassMap[weight] : "";

  const combinedClasses = [
    styles.base,
    variantClass,
    colorClass,
    weightClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component id={id} className={combinedClasses} {...rest}>
      {children}
    </Component>
  );
}

/**
 * Shorthand Eyebrow Typography Atom
 */
export function Eyebrow(props: Omit<TextProps, "variant">) {
  return <Text variant="eyebrow" as="span" {...props} />;
}

/**
 * Shorthand Caption Typography Atom
 */
export function Caption(props: Omit<TextProps, "variant">) {
  return <Text variant="caption" {...props} />;
}

/**
 * Shorthand Micro Typography Atom
 */
export function Micro(props: Omit<TextProps, "variant">) {
  return <Text variant="micro" {...props} />;
}

/**
 * Shorthand ButtonLabel Typography Atom
 */
export function ButtonLabel(props: Omit<TextProps, "variant">) {
  return <Text variant="button" {...props} />;
}

import React from "react";
import Link from "next/link";
import { Text, type TextVariant, type TextWeight } from "../text/Text";
import styles from "./TextLink.module.css";

export type TextLinkVariant = "dark" | "light";
export type TextLinkUnderline = "hover" | "always" | "none";

export interface TextLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
  variant?: TextLinkVariant;
  underline?: TextLinkUnderline;
  external?: boolean;
  className?: string;
  weight?: TextWeight;
  textVariant?: TextVariant;
}

/**
 * TextLink Atom Component
 * Inline editorial link with smooth underline and color transitions on hover.
 * Supports 'dark' (navy on light) and 'light' (white/turquoise on dark).
 */
export function TextLink({
  children,
  href,
  variant = "dark",
  underline,
  external = false,
  className = "",
  weight,
  textVariant = "button",
  ...rest
}: TextLinkProps) {
  // Default underline behavior matching Figma:
  // "dark": underline reveals on hover
  // "light": always underlined (white default -> turquoise hover)
  const resolvedUnderline =
    underline ?? (variant === "light" ? "always" : "hover");
  const variantClass = variant === "light" ? styles.light : styles.dark;
  const underlineClass =
    resolvedUnderline === "always"
      ? styles.underlineAlways
      : resolvedUnderline === "none"
        ? styles.underlineNone
        : styles.underlineHover;

  const classes = [styles.textLink, variantClass, underlineClass, className]
    .filter(Boolean)
    .join(" ");

  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link href={href} className={classes} {...externalProps} {...rest}>
      <Text as="span" variant={textVariant} weight={weight} color="inherit">
        {children}
      </Text>
    </Link>
  );
}

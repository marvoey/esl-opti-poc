import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Text } from "../../text/Text";
import styles from "./QuickLinkLarge.module.css";

export type QuickLinkLargeVariant = "default" | "active";

export interface QuickLinkLargeBaseProps {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  variant?: QuickLinkLargeVariant;
  className?: string;
}

export type QuickLinkLargeAsLink = QuickLinkLargeBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof QuickLinkLargeBaseProps> & {
    href: string;
  };

export type QuickLinkLargeAsButton = QuickLinkLargeBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof QuickLinkLargeBaseProps> & {
    href?: undefined;
  };

export type QuickLinkLargeProps =
  | QuickLinkLargeAsLink
  | QuickLinkLargeAsButton;

/**
 * QuickLinkLarge Component (Figma: "❖ Quick Link Large")
 * High-emphasis card featuring centered title on top and 124x124px image slot below.
 * Implements 2 variants:
 * - "default": White surface, #D5E5F4 border. On hover, smoothly reveals Navy text underline,
 *   2px Turquoise (#68E0CC) ring, and glow elevation shadow.
 * - "active": Persistent active state featuring the Turquoise ring, glow shadow, and title underline.
 */
export function QuickLinkLarge({
  title,
  imageSrc,
  imageAlt = "",
  variant = "default",
  className = "",
  ...rest
}: QuickLinkLargeProps) {
  const variantClass = variant === "active" ? styles.active : styles.default;
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
      <div className={styles.imageWrapper}>
        {imageSrc ? (
          <Image src={imageSrc} alt={imageAlt} width={124} height={124} className={styles.image} />
        ) : (
          <div className={styles.placeholder} aria-hidden="true" />
        )}
      </div>
    </>
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...linkRest } = rest as QuickLinkLargeAsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as QuickLinkLargeAsButton;

  return (
    <button type={type} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "../../icons";
import { Text } from "../../text/Text";
import styles from "./QuickLink.module.css";

export interface QuickLinkBaseProps {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

export type QuickLinkAsLink = QuickLinkBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof QuickLinkBaseProps> & {
    href: string;
  };

export type QuickLinkAsButton = QuickLinkBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof QuickLinkBaseProps> & {
    href?: undefined;
  };

export type QuickLinkProps = QuickLinkAsLink | QuickLinkAsButton;

/**
 * QuickLink Component
 * Row card with thumbnail image placeholder on left, label, and trailing arrow.
 * Implements 300ms ease-out hover elevation with Turquoise border and arrow glide.
 */
export function QuickLink({
  title,
  imageSrc,
  imageAlt = "",
  className = "",
  ...rest
}: QuickLinkProps) {
  const classes = [styles.card, className].filter(Boolean).join(" ");

  const content = (
    <>
      <div className={styles.imagePlaceholder} aria-hidden={!imageAlt}>
        {imageSrc ? (
          <Image src={imageSrc} alt={imageAlt} width={52} height={52} className={styles.thumbnail} />
        ) : (
          <div className={styles.patternPlaceholder} />
        )}
      </div>

      <Text
        as="span"
        variant="button"
        color="inherit"
        className={styles.title}
      >
        {title}
      </Text>

      <span className={styles.arrowWrapper} aria-hidden="true">
        <ArrowRightIcon size={20} />
      </span>
    </>
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...linkRest } = rest as QuickLinkAsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as QuickLinkAsButton;

  return (
    <button type={type} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}

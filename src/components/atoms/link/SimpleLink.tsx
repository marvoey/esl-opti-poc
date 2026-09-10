import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "../icons";
import { Text } from "../text/Text";
import styles from "./SimpleLink.module.css";

export interface SimpleLinkBaseProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export type SimpleLinkAsLink = SimpleLinkBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof SimpleLinkBaseProps> & {
    href: string;
    as?: "a";
  };

export type SimpleLinkAsButton = SimpleLinkBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof SimpleLinkBaseProps> & {
    href?: never;
    as?: "button";
  };

export type SimpleLinkAsSpan = SimpleLinkBaseProps &
  Omit<React.HTMLAttributes<HTMLSpanElement>, keyof SimpleLinkBaseProps> & {
    href?: never;
    as: "span";
  };

export type SimpleLinkProps = SimpleLinkAsLink | SimpleLinkAsButton | SimpleLinkAsSpan;

/**
 * SimpleLink Atom Component (Figma: "Simple Link")
 * Inline text link with arrow, supports custom color prop.
 * Can render as Link, button, or span (for nesting inside other links).
 */
export function SimpleLink({
  children,
  className = "",
  icon,
  ...rest
}: SimpleLinkProps) {
  const content = (
    <>
      <Text as="span" variant="body-sm" weight="semibold" color="inherit">
        {children}
      </Text>
      {icon ?? (
        <ArrowRightIcon
          size={16}
          className={styles.arrow}
          aria-hidden={true}
        />
      )}
    </>
  );

  const classes = [styles.simpleLink, className].filter(Boolean).join(" ");

  if ("as" in rest && rest.as === "span") {
    const { as, ...spanProps } = rest as SimpleLinkAsSpan;
    return (
      <span className={classes} {...spanProps}>
        {content}
      </span>
    );
  }

  if ("href" in rest && rest.href) {
    const { href, as, ...anchorProps } = rest as SimpleLinkAsLink;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const { as, type = "button", ...buttonProps } = rest as SimpleLinkAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}

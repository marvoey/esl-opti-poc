import React from "react";
import Link from "next/link";
import { Text } from "../text/Text";
import styles from "./Button.module.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "link";
export type ButtonSize = "md" | "sm";
export type ButtonShape = "pill" | "rounded";
export type ButtonType = "button" | "submit" | "reset";

export interface ButtonBaseProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
  className?: string;
}

export interface ButtonAsButtonProps
  extends ButtonBaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps | "type"> {
  href?: undefined;
  type?: ButtonType;
}

export interface ButtonAsLinkProps
  extends ButtonBaseProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps | "href"> {
  href: string;
}

export type ButtonAsButton = ButtonAsButtonProps;
export type ButtonAsLink = ButtonAsLinkProps;
export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

/**
 * Enterprise Reusable Button Atom Component
 * Implements WCAG 2.2 AA contrast & target size, polymorphic Next.js Link / button,
 * 300ms ease-out smart animation, and strict Figma Button Label typography (16px, 700, 20px LH).
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  shape = "pill",
  leftIcon,
  rightIcon,
  fullWidth = false,
  isLoading = false,
  className = "",
  ...rest
}: ButtonProps) {
  const variantClass =
    variant === "tertiary"
      ? styles.tertiary || styles.outline
      : styles[variant] || styles.primary;
  const sizeClass = size === "sm" ? styles.sizeSm : styles.sizeMd;
  const shapeClass = shape === "rounded" ? styles.rounded : styles.pill;
  const fullWidthClass = fullWidth ? styles.fullWidth : "";
  const loadingClass = isLoading ? styles.loading : "";

  const classes = [
    styles.button,
    variantClass,
    sizeClass,
    shapeClass,
    fullWidthClass,
    loadingClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {leftIcon && (
        <span className={styles.iconLeft} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      <Text
        as="span"
        variant="button"
        color="inherit"
        className={styles.label}
      >
        {children}
      </Text>
      {rightIcon && (
        <span className={styles.iconRight} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </>
  );

  if ("href" in rest && typeof rest.href === "string" && rest.href) {
    const { href, ...linkRest } = rest as ButtonAsLinkProps;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {content}
      </Link>
    );
  }

  const { type = "button", disabled, ...buttonRest } = rest as ButtonAsButtonProps;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading ? true : undefined}
      {...buttonRest}
    >
      {content}
    </button>
  );
}

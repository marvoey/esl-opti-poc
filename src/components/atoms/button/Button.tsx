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
  align?: "left" | "right";
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

function buildClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  shape: ButtonShape,
  align: "left" | "right",
  fullWidth: boolean,
  isLoading: boolean,
  rightIcon: React.ReactNode,
  className: string
): string {
  const variantClass =
    variant === "tertiary"
      ? styles.tertiary || styles.outline
      : styles[variant] || styles.primary;

  return [
    styles.button,
    variantClass,
    size === "sm" ? styles.sizeSm : styles.sizeMd,
    shape === "rounded" ? styles.rounded : styles.pill,
    rightIcon ? styles.hasArrow : null,
    align === "right" ? styles.alignRight : null,
    fullWidth ? styles.fullWidth : null,
    isLoading ? styles.loading : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

function ButtonContent({
  children,
  leftIcon,
  rightIcon,
}: Pick<ButtonBaseProps, "children" | "leftIcon" | "rightIcon">) {
  return (
    <>
      {leftIcon && (
        <span className={styles.iconLeft} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      <Text as="span" variant="button" color="inherit" className={styles.label}>
        {children}
      </Text>
      {rightIcon && (
        <span className={styles.iconRight} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  shape = "pill",
  align = "left",
  leftIcon,
  rightIcon,
  fullWidth = false,
  isLoading = false,
  className = "",
  ...rest
}: ButtonProps) {
  const classes = buildClasses(variant, size, shape, align, fullWidth, isLoading, rightIcon, className);

  if ("href" in rest && typeof rest.href === "string" && rest.href) {
    const { href, ...linkRest } = rest as ButtonAsLinkProps;
    return (
      <Link href={href} className={classes} {...linkRest}>
        <ButtonContent leftIcon={leftIcon} rightIcon={rightIcon}>{children}</ButtonContent>
      </Link>
    );
  }

  const { type = "button", disabled, ...buttonRest } = rest as ButtonAsButtonProps;
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...buttonRest}
    >
      <ButtonContent leftIcon={leftIcon} rightIcon={rightIcon}>{children}</ButtonContent>
    </button>
  );
}

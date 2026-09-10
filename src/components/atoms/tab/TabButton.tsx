import React from "react";
import { Text } from "../text/Text";
import styles from "./TabButton.module.css";

export type TabButtonVariant = "default" | "hover" | "active";

export interface TabButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  variant?: TabButtonVariant;
  className?: string;
}

/**
 * TabButton Atom Component
 * Desktop card tab button supporting inactive, hover (Mint Polar + 2px solid #68E0CC border),
 * and active (Solid Navy) states.
 * Fully accessible with role="tab" and aria-selected.
 * Composes <Text variant="button"> per Typography Composition Law.
 */
export function TabButton({
  children,
  icon,
  active = false,
  variant,
  className = "",
  type = "button",
  ...rest
}: TabButtonProps) {
  const isSelected = variant === "active" || active;
  const isHover = variant === "hover";

  const stateClass = isSelected
    ? styles.active
    : isHover
    ? styles.hover
    : styles.inactive;

  const classes = [styles.tabButton, stateClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      role="tab"
      aria-selected={isSelected}
      className={classes}
      {...rest}
    >
      {icon && (
        <span className={styles.iconWrapper} aria-hidden="true">
          {icon}
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
    </button>
  );
}

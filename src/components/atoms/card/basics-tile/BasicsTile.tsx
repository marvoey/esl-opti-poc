import React from "react";
import { Text } from "../../text/Text";
import styles from "./BasicsTile.module.css";

export type BasicsTileValueSize = "md" | "lg" | "body" | "body-lg";
export type BasicsTileOrder = "callout-first" | "value-first";

export interface BasicsTileProps extends React.HTMLAttributes<HTMLDivElement> {
  callout: string;
  value: string;
  description: string;
  valueSize?: BasicsTileValueSize;
  descriptionVariant?: "caption" | "micro";
  order?: BasicsTileOrder;
  showDivider?: boolean;
  className?: string;
}

/**
 * BasicsTile Atom Component (Figma: "❖ Basics tile")
 * Concise data callout tile featuring a bold callout label, highlighted value/stat,
 * and descriptive copy.
 * 
 * Supports:
 * - valueSize: "lg" | "body-lg" (20px / 28px LH) -> description uses "caption" (14px)
 * - valueSize: "md" | "body" (16px / 24px LH) -> description uses "micro" (12px)
 * - order: "callout-first" (default) | "value-first"
 * - showDivider: optional standalone vertical right border
 */
export function BasicsTile({
  callout,
  value,
  description,
  valueSize = "body",
  descriptionVariant,
  order = "callout-first",
  showDivider = false,
  className = "",
  ...rest
}: BasicsTileProps) {
  const isLg = valueSize === "lg" || valueSize === "body-lg";
  const sizeClass = isLg ? styles.valueLg : styles.valueMd;
  const dividerClass = showDivider ? styles.hasDivider : "";

  const classes = [styles.tile, sizeClass, dividerClass, className]
    .filter(Boolean)
    .join(" ");

  const calloutEl = (
    <Text as="p" variant="caption" color="primary" className={styles.callout}>
      {callout}
    </Text>
  );

  const valueVariant = isLg ? "body-lg" : "body";
  const valueEl = (
    <Text as="p" variant={valueVariant} color="accent" className={styles.value}>
      {value}
    </Text>
  );

  const descVariant = descriptionVariant ?? "micro";
  const descriptionEl = (
    <Text as="p" variant={descVariant} color="secondary" className={styles.description}>
      {description}
    </Text>
  );

  return (
    <div className={classes} {...rest}>
      {order === "value-first" ? (
        <>
          {valueEl}
          {calloutEl}
          {descriptionEl}
        </>
      ) : (
        <>
          {calloutEl}
          {valueEl}
          {descriptionEl}
        </>
      )}
    </div>
  );
}

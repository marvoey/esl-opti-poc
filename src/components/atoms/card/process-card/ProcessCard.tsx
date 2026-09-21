import React from "react";
import Link from "next/link";
import { StepBadge } from "../../step-badge/StepBadge";
import { Text } from "../../text/Text";
import styles from "./ProcessCard.module.css";

export type ProcessCardVariant = "mint" | "neutral" | "inverse";

export interface ProcessCardBaseProps {
  step: number | string;
  title: string;
  description: React.ReactNode;
  variant?: ProcessCardVariant;
  className?: string;
  badgeTextColor?: string;
  badgeBackgroundColor?: string;
}

export type ProcessCardAsLink = ProcessCardBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ProcessCardBaseProps> & {
    href: string;
  };

export type ProcessCardAsDiv = ProcessCardBaseProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof ProcessCardBaseProps> & {
    href?: undefined;
  };

export type ProcessCardProps = ProcessCardAsLink | ProcessCardAsDiv;

/**
 * ProcessCard Component (Figma: "❖ Process")
 * Horizontal process step card featuring a step number badge on the left,
 * bold title, and descriptive text.
 * Implements 2 variants:
 * - "mint": Soft mint surface (#ECFBF8), subtle teal border, and Navy typography.
 * - "neutral": Slate/neutral surface (#B8BFC7), turquoise badge (#68E0CC), and inverted white typography.
 */
export function ProcessCard({
  step,
  title,
  description,
  variant = "mint",
  className = "",
  badgeTextColor,
  badgeBackgroundColor,
  ...rest
}: ProcessCardProps) {
  const variantClass =
    variant === "neutral"
      ? styles.neutral
      : variant === "inverse"
        ? styles.inverse
        : styles.mint;
  const classes = [styles.card, variantClass, className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <StepBadge
        step={step}
        className={styles.badge}
        textColor={badgeTextColor}
        backgroundColor={badgeBackgroundColor}
      />
      <div className={styles.content}>
        <Text as="span" variant="body-lg" weight="bold" color="inherit" className={styles.title}>
          {title}
        </Text>
        <Text as={typeof description === "string" ? "span" : "div"} variant="body-sm" color="inherit" className={styles.description}>
          {description}
        </Text>
      </div>
    </>
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...linkRest } = rest as ProcessCardAsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {content}
      </Link>
    );
  }

  const divRest = rest as ProcessCardAsDiv;
  return (
    <div className={classes} {...divRest}>
      {content}
    </div>
  );
}

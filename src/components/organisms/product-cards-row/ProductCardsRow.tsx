import React from "react";
import { type HeadingLevel, Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { CircleCheck } from "@/components/atoms/circle-check/CircleCheck";
import styles from "./ProductCardsRow.module.css";

export interface ProductCardItem {
  id?: string;
  title: string;
  description: React.ReactNode;
}

export interface ProductCardsRowProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  description?: React.ReactNode;
  items: ProductCardItem[];
  className?: string;
}

export function ProductCardsRow({
  id,
  eyebrow,
  title,
  headingLevel = "h2",
  description,
  items = [],
  className = "",
}: ProductCardsRowProps) {
  if (!items || items.length === 0) return null;

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <div className={styles.container}>
        {(eyebrow || title || description) && (
          <div className={styles.header}>
            {eyebrow && (
              <Text variant="eyebrow" color="accent" className={styles.eyebrow}>
                {eyebrow}
              </Text>
            )}
            {title && (
              <Heading
                level={headingLevel}
                id={id ? `${id}-heading` : undefined}
                className={styles.sectionTitle}
              >
                {title}
              </Heading>
            )}
            {description && (
              <Text
                as={typeof description === "string" ? "p" : "div"}
                variant="body-lg"
                className={styles.description}
              >
                {description}
              </Text>
            )}
          </div>
        )}

        <div className={styles.grid}>
          {items.map((item) => (
            <div key={item.id || item.title} className={styles.card}>
              <CircleCheck
                size={28}
                backgroundColor="var(--color-card-icon-badge-bg)"
                tickColor="var(--color-primary)"
                className={styles.icon}
              />
              <div className={styles.textGroup}>
                <Text as="p" variant="body" weight="bold" className={styles.cardTitle}>
                  {item.title}
                </Text>
                <Text
                  as={typeof item.description === "string" ? "p" : "div"}
                  variant="body"
                  color="secondary"
                  className={styles.cardDescription}
                >
                  {item.description}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

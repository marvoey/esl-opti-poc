import React from "react";
import { type HeadingLevel, Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { IconContentCard } from "@/components/atoms/card/icon-content-card/IconContentCard";
import { Icon, type IconName } from "@/components/atoms/icons";
import styles from "./ProductCardsRowVariant2.module.css";

export interface ProductCardsRowVariant2Item {
  id?: string;
  icon: IconName | React.ReactNode;
  title: string;
  description: React.ReactNode;
  ctaText: string;
  href: string;
}

export interface ProductCardsRowVariant2Props {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  description?: React.ReactNode;
  items: ProductCardsRowVariant2Item[];
  className?: string;
}

export function ProductCardsRowVariant2({
  id,
  eyebrow,
  title,
  headingLevel = "h2",
  description,
  items = [],
  className = "",
}: ProductCardsRowVariant2Props) {
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
            <IconContentCard
              key={item.id || item.title}
              href={item.href}
              icon={
                typeof item.icon === "string" ? (
                  <Icon name={item.icon as IconName} size={24} aria-hidden="true" />
                ) : (
                  item.icon
                )
              }
              title={item.title}
              description={item.description}
              ctaText={item.ctaText}
              variant="default"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

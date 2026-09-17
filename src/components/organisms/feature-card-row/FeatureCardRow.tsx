import React from "react";
import { type HeadingLevel, Heading } from "@/components/atoms/heading/Heading";
import { type IconName, Icon } from "@/components/atoms/icons";
import { Text } from "@/components/atoms/text/Text";
import styles from "./FeatureCardRow.module.css";

export interface FeatureCardItem {
  id?: string;
  icon: IconName | React.ReactNode;
  title: string;
  description: string;
}

export interface FeatureCardRowProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  items?: FeatureCardItem[];
  className?: string;
}

export function FeatureCardRow({
  id,
  eyebrow,
  title,
  headingLevel = "h2",
  items = [],
  className = "",
  ...props
}: FeatureCardRowProps) {
  if (!items || items.length === 0) return null;

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`}
      aria-labelledby={id ? `${id}-heading` : undefined}
      {...props}
    >
      <div className={styles.container}>
        {(eyebrow || title) && (
          <div className={styles.header}>
            {eyebrow && (
              <Text variant="eyebrow" className={styles.eyebrow}>
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
          </div>
        )}
        
        <div className={styles.grid}>
          {items.map((item) => (
            <div key={item.id || item.title} className={styles.card}>
              <div className={styles.iconBadge} aria-hidden="true">
                {typeof item.icon === "string" ? (
                  <Icon name={item.icon as IconName} size={24} aria-hidden="true" />
                ) : (
                  item.icon
                )}
              </div>
              <Heading level="h3" className={styles.cardTitle}>
                {item.title}
              </Heading>
              <Text variant="body-sm" className={styles.cardDescription}>
                {item.description}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

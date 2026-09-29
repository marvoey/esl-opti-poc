import React from "react";
import { type HeadingLevel, Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { IconContentCard } from "@/components/atoms/card/icon-content-card/IconContentCard";
import { Icon, type IconName } from "@/components/atoms/icons";
import styles from "./SplitContentCta.module.css";

export interface SplitContentCtaOption {
  id: string;
  icon: IconName | React.ReactNode;
  title: string;
  description: string;
  ctaText: string;
  href: string;
}

export interface SplitContentCtaProps {
  id?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  description?: string;
  options: SplitContentCtaOption[];
  className?: string;
}

export function SplitContentCta({
  id,
  title,
  headingLevel = "h2",
  description,
  options = [],
  className = "",
}: SplitContentCtaProps) {
  if (!options || options.length === 0) return null;

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`}
      aria-labelledby={title ? `${id ?? "split-content-cta"}-heading` : undefined}
      data-theme="dark"
    >
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.textCol}>
            {title && (
              <Heading
                level={headingLevel}
                id={id ? `${id}-heading` : undefined}
                className={styles.heading}
              >
                {title}
              </Heading>
            )}
            {description && (
              <Text variant="body" color="inverted" className={styles.description}>
                {description}
              </Text>
            )}
          </div>

          <ul className={styles.cardsCol} role="list">
            {options.map((option) => (
              <li key={option.id} className={styles.cardItem}>
                <IconContentCard
                  href={option.href}
                  icon={
                    typeof option.icon === "string" ? (
                      <Icon name={option.icon as IconName} size={24} aria-hidden="true" />
                    ) : (
                      option.icon
                    )
                  }
                  title={option.title}
                  description={option.description}
                  ctaText={option.ctaText}
                  variant="inverse"
                  className={styles.ctaCard}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

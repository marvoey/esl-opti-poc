import React from "react";
import { type HeadingLevel, Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { SimpleLink } from "@/components/atoms/link/SimpleLink";
import { Icon, type IconName } from "@/components/atoms/icons";
import styles from "./IconCardSingleColumnGrid.module.css";

export interface IconCardSingleColumnGridItem {
  id?: string;
  icon?: IconName;
  title: string;
  href?: string;
  target?: string;
  description?: React.ReactNode;
}

export interface IconCardSingleColumnGridProps {
  id?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  items: IconCardSingleColumnGridItem[];
  className?: string;
}

export function IconCardSingleColumnGrid({
  id,
  title,
  headingLevel = "h2",
  items = [],
  className = "",
}: IconCardSingleColumnGridProps) {
  if (!items || items.length === 0) return null;

  const headingId = id && title ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`}
      aria-labelledby={headingId}
      aria-label={headingId ? undefined : title}
    >
      <div className={styles.container}>
        {title && (
          <Heading level={headingLevel} id={headingId} className={styles.title}>
            {title}
          </Heading>
        )}

        <ul className={styles.list}>
          {items.map((item, index) => (
            <li key={item.id ?? item.title} className={styles.row}>
              <div className={styles.label}>
                <Icon
                  name={item.icon ?? "piggy-bank"}
                  size={20}
                  className={styles.icon}
                  aria-hidden="true"
                />
                <h3 className={styles.itemTitle}>
                  {item.href ? (
                    <SimpleLink
                      href={item.href}
                      target={item.target}
                      rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                    >
                      {item.title}
                    </SimpleLink>
                  ) : (
                    <Text as="span" variant="body-sm" weight="semibold" color="inherit">
                      {item.title}
                    </Text>
                  )}
                </h3>
              </div>

              {item.description && (
                <Text
                  as={typeof item.description === "string" ? "p" : "div"}
                  variant="body-sm"
                  color="inherit"
                  className={styles.description}
                >
                  {item.description}
                </Text>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

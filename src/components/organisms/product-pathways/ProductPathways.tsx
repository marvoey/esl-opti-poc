import React, { useId } from "react";
import { Heading, type HeadingLevel } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { SimpleLink } from "@/components/atoms/link/SimpleLink";
import { Icon, type IconName } from "@/components/atoms/icons";
import styles from "./ProductPathways.module.css";

export interface ProductPathwaysRow {
  id?: string;
  icon?: IconName;
  title: string;
  href?: string;
  target?: string;
  description?: React.ReactNode;
}

export interface ProductPathwaysProps {
  id?: string;
  title: string;
  description?: React.ReactNode;
  rows: ProductPathwaysRow[];
  headingLevel?: HeadingLevel;
  className?: string;
}

/**
 * Product Pathways Organism (Figma: "Product Pathways/Default")
 *
 * Bordered card with an inverse header row (title + intro copy) followed by
 * rows that pair an icon link on the left with rich copy on the right.
 * Server Component: no client state. Columns stack on narrow containers.
 */
export function ProductPathways({
  id,
  title,
  description,
  rows = [],
  headingLevel = "h2",
  className = "",
}: ProductPathwaysProps) {
  const autoId = useId();
  if (!title || !rows || rows.length === 0) return null;

  const sectionId = id ?? `product-pathways-${autoId.replace(/:/g, "")}`;
  const headingId = `${sectionId}-heading`;

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={`${styles.section} ${className}`.trim()}
    >
      <div className={styles.container}>
        <div className={styles.card}>
          <header className={styles.header}>
            <Heading level="h3" as={headingLevel} id={headingId} color="inverted" className={styles.title}>
              {title}
            </Heading>
            {description && (
              <Text
                as={typeof description === "string" ? "p" : "div"}
                variant="body"
                color="inverted"
                className={styles.copy}
                data-product-pathways-intro=""
              >
                {description}
              </Text>
            )}
          </header>

          <ul className={styles.list}>
            {rows.map((row, index) => (
              <li key={row.id ?? `${row.title}-${index}`} className={styles.row}>
                <div className={styles.label}>
                  <Icon
                    name={row.icon ?? "piggy-bank"}
                    size={24}
                    className={styles.icon}
                    aria-hidden="true"
                  />
                  {row.href ? (
                    <SimpleLink
                      href={row.href}
                      target={row.target}
                      rel={row.target === "_blank" ? "noopener noreferrer" : undefined}
                      color="primary"
                    >
                      {row.title}
                    </SimpleLink>
                  ) : (
                    <Text as="span" variant="body-sm" weight="bold" color="primary">
                      {row.title}
                    </Text>
                  )}
                </div>

                {row.description && (
                  <Text
                    as={typeof row.description === "string" ? "p" : "div"}
                    variant="body"
                    color="secondary"
                    className={styles.copy}
                  >
                    {row.description}
                  </Text>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

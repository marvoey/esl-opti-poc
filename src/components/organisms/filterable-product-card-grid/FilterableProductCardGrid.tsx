import React, { useId } from "react";
import { type HeadingLevel, Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { FilterableProductCardGridBoard } from "./FilterableProductCardGridBoard";
import styles from "./FilterableProductCardGrid.module.css";

export interface FilterableProductCard {
  id?: string;
  title: string;
  description?: React.ReactNode;
  rate?: string;
  filterTags?: string[];
  href?: string;
  linkLabel?: string;
  target?: string;
}

export interface FilterableProductCardGridProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  description?: React.ReactNode;
  allFilterLabel?: string;
  filters?: string[];
  items: FilterableProductCard[];
  noResultsText?: string;
  className?: string;
}

const EMPTY_FILTERS: string[] = [];
const EMPTY_ITEMS: FilterableProductCard[] = [];

export function FilterableProductCardGrid({
  id,
  eyebrow,
  title,
  headingLevel = "h2",
  description,
  allFilterLabel,
  filters = EMPTY_FILTERS,
  items = EMPTY_ITEMS,
  noResultsText,
  className = "",
}: FilterableProductCardGridProps) {
  const generatedId = useId();
  if (!items || items.length === 0) return null;

  const headingId = title ? `${id || generatedId}-heading` : undefined;

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`}
      aria-labelledby={headingId}
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
              <Heading level={headingLevel} id={headingId} className={styles.title}>
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

        <FilterableProductCardGridBoard
          labelledBy={headingId}
          allFilterLabel={allFilterLabel}
          filters={filters}
          items={items}
          noResultsText={noResultsText}
        />
      </div>
    </section>
  );
}

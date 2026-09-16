"use client";

import React, { useId, useState } from "react";
import { type HeadingLevel, Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { PlusIcon, MinusIcon } from "@/components/atoms/icons";
import styles from "./AccordionCardGrid.module.css";

export interface AccordionCardItem {
  id: string;
  term: string;
  definition: string;
}

export interface AccordionCardGridProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  description?: string;
  items: AccordionCardItem[];
  className?: string;
}

export function AccordionCardGrid({
  id,
  eyebrow,
  title,
  headingLevel = "h2",
  description,
  items = [],
  className = "",
}: AccordionCardGridProps) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  if (!items || items.length === 0) return null;

  function toggleItem(itemId: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`}
      aria-labelledby={title ? `${baseId}-heading` : undefined}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          {eyebrow && (
            <Text variant="eyebrow" color="accent" className={styles.eyebrow}>
              {eyebrow}
            </Text>
          )}
          {title && (
            <Heading
              level={headingLevel}
              id={`${baseId}-heading`}
              className={styles.sectionTitle}
            >
              {title}
            </Heading>
          )}
          {description && (
            <Text variant="body" color="secondary" className={styles.description}>
              {description}
            </Text>
          )}
        </div>

        <div className={styles.grid}>
          {items.map((item) => {
            const isExpanded = expandedIds.has(item.id);
            const triggerId = `${baseId}-trigger-${item.id}`;
            const panelId = `${baseId}-panel-${item.id}`;

            return (
              <div key={item.id} className={styles.card}>
                <h3 className={styles.itemHeading}>
                  <button
                    type="button"
                    id={triggerId}
                    className={styles.trigger}
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => toggleItem(item.id)}
                  >
                    <Text as="span" variant="button" className={styles.term}>
                      {item.term}
                    </Text>
                    <span className={styles.icon} aria-hidden="true">
                      {isExpanded ? <MinusIcon size={20} /> : <PlusIcon size={20} />}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  aria-labelledby={triggerId}
                  aria-hidden={!isExpanded}
                  className={`${styles.panelOuter} ${isExpanded ? styles.expanded : ""}`}
                >
                  <div className={styles.panelInner}>
                    <Text as="p" variant="body" color="secondary" className={styles.definition}>
                      {item.definition}
                    </Text>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

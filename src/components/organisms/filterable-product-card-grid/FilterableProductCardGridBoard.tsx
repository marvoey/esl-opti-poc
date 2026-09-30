"use client";

import React, { useId, useMemo, useState } from "react";
import { Text } from "@/components/atoms/text/Text";
import { FilterChip } from "@/components/atoms/chip/FilterChip";
import { SimpleLink } from "@/components/atoms/link/SimpleLink";
import type { FilterableProductCard } from "./FilterableProductCardGrid";
import styles from "./FilterableProductCardGrid.module.css";

const ALL = "__all__";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export interface FilterableProductCardGridBoardProps {
  labelledBy?: string;
  allFilterLabel?: string;
  filters: string[];
  items: FilterableProductCard[];
  noResultsText?: string;
}

/** Client leaf: the filter chips and the cards they narrow down. */
export function FilterableProductCardGridBoard({
  labelledBy,
  allFilterLabel,
  filters,
  items,
  noResultsText,
}: FilterableProductCardGridBoardProps) {
  const gridId = useId();
  const allLabel = allFilterLabel?.trim() || undefined;

  const chips = useMemo(() => {
    const seen = new Set<string>();
    const result: Array<{ key: string; label: string }> = [];
    for (const raw of filters) {
      const label = raw?.trim();
      if (!label) continue;
      const key = normalize(label);
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({ key, label });
    }
    return result;
  }, [filters]);

  // With an "All" chip the grid starts on it; without one it starts unfiltered (null).
  const [selected, setSelected] = useState<string | null>(allLabel ? ALL : null);

  const visible = useMemo(() => {
    if (!selected || selected === ALL) return items;
    return items.filter((item) => item.filterTags?.some((tag) => normalize(tag) === selected));
  }, [items, selected]);

  const selectChip = (key: string) => {
    if (key === ALL) {
      setSelected(ALL);
    } else if (selected === key) {
      setSelected(allLabel ? ALL : null);
    } else {
      setSelected(key);
    }
  };

  const showChips = chips.length > 0;

  return (
    <div className={styles.board}>
      {showChips && (
        <div role="group" aria-labelledby={labelledBy} className={styles.chips}>
          {allLabel && (
            <FilterChip
              selected={selected === ALL}
              aria-controls={gridId}
              onClick={() => selectChip(ALL)}
            >
              {allLabel}
            </FilterChip>
          )}
          {chips.map((chip) => (
            <FilterChip
              key={chip.key}
              selected={selected === chip.key}
              aria-controls={gridId}
              onClick={() => selectChip(chip.key)}
            >
              {chip.label}
            </FilterChip>
          ))}
        </div>
      )}

      {/* SC 4.1.3: filtering swaps the grid contents with no visual focus change,
          so the new result count has to be announced. */}
      <div className={styles.visuallyHidden} aria-live="polite" aria-atomic="true">
        {visible.length === 1 ? "1 result" : `${visible.length} results`}
      </div>

      {visible.length > 0 ? (
        <ul id={gridId} className={styles.grid}>
          {visible.map((item, index) => (
            <li key={item.id ?? item.title} className={styles.card}>
              <h3 className={styles.cardTitle}>
                <Text as="span" variant="button" weight="semibold" color="inherit">
                  {item.title}
                </Text>
              </h3>
              {item.description && (
                <Text
                  as={typeof item.description === "string" ? "p" : "div"}
                  variant="body-sm"
                  color="inherit"
                  className={styles.cardDescription}
                >
                  {item.description}
                </Text>
              )}
              {item.rate && (
                <Text as="p" variant="subhead" weight="bold" color="inherit" className={styles.cardRate}>
                  {item.rate}
                </Text>
              )}
              {item.href && item.linkLabel && (
                <SimpleLink
                  href={item.href}
                  target={item.target}
                  rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                  className={styles.cardLink}
                >
                  {item.linkLabel}
                </SimpleLink>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div id={gridId}>
          {noResultsText && (
            <Text as="p" variant="body" className={styles.noResults}>
              {noResultsText}
            </Text>
          )}
        </div>
      )}
    </div>
  );
}

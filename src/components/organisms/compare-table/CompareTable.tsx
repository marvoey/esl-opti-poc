import React, { useId } from "react";
import { Heading, type HeadingLevel } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import { ArrowRightIcon } from "@/components/atoms/icons";
import styles from "./CompareTable.module.css";
import { DEFAULT_COMPARE_TABLE_DATA, type CompareTableData } from "./compareTableData";

export interface CompareTableProps {
  /** DOM id; falls back to a useId()-derived id (project idiom, ComparisonCardPair.tsx). */
  id?: string;
  /** Whole-object content. Omit to use DEFAULT_COMPARE_TABLE_DATA. No deep merge. */
  data?: CompareTableData;
  headingLevel?: HeadingLevel;
  className?: string;
}

/**
 * Compare Table Organism
 *
 * Accessible, static, 2-column feature comparison table for the
 * product-family page. See `sdd/compare-table/design` for the full
 * architecture rationale:
 * - Header markup/CSS is owned locally, not imported from
 *   VerticalSelectorHeader (keeps the 50%-width requirement reachable
 *   without `!important`).
 * - thead/tbody/tfoot with `<td>` corner cells (never `<th>`) so
 *   `columnheader`/`rowheader` role counts stay exact.
 * - Column highlight on hover/keyboard-focus is pure CSS via `:has()` —
 *   this component stays a Server Component (no `"use client"`).
 * - Footer CTAs render as anchors (`Button href=...`), not buttons.
 */
export function CompareTable({
  id,
  data = DEFAULT_COMPARE_TABLE_DATA,
  headingLevel = "h2",
  className = "",
}: CompareTableProps) {
  const autoId = useId();
  const sectionId = id ?? `compare-table-${autoId.replace(/:/g, "")}`;
  const headingId = `${sectionId}-heading`;
  const scrollLabelId = `${sectionId}-scroll-label`;

  const {
    eyebrow,
    title,
    description,
    caption,
    scrollRegionLabel,
    columns,
    rows,
    fullComparisonLink,
  } = data;

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className={`${styles.section} ${className}`.trim()}
    >
      <div className={styles.container}>
        <header className={styles.headerRow}>
          <div className={styles.headerContent}>
            {eyebrow && (
              <Text as="span" variant="eyebrow" className={styles.eyebrow}>
                {eyebrow}
              </Text>
            )}
            <Heading level={headingLevel} id={headingId} className={styles.title}>
              {title}
            </Heading>
            {description && (
              <Text as="p" variant="body" className={styles.description}>
                {description}
              </Text>
            )}
          </div>
        </header>

        <div
          className={styles.scrollRegion}
          role="group"
          aria-labelledby={scrollLabelId}
          tabIndex={0}
        >
          <span id={scrollLabelId} className={styles.visuallyHidden}>
            {scrollRegionLabel}
          </span>

          <table className={styles.table}>
            <caption className={styles.visuallyHidden}>{caption}</caption>

            <thead>
              <tr>
                <td className={`${styles.cornerCell} ${styles.cornerCellHeader}`} />
                {columns.map((column, index) => (
                  <th
                    key={column.id}
                    scope="col"
                    className={`${styles.columnHeader} ${
                      index === 0 ? styles.columnA : styles.columnB
                    }`}
                    data-compare-column={column.id}
                  >
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row" className={styles.rowHeader}>
                    {row.label}
                  </th>
                  {columns.map((column, index) => (
                    <td
                      key={column.id}
                      className={`${styles.cell} ${
                        index === 0 ? styles.columnA : styles.columnB
                      }`}
                      data-compare-column={column.id}
                    >
                      {row.values[index]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <td className={styles.cornerCell} />
                {columns.map((column, index) => (
                  <td
                    key={column.id}
                    className={`${styles.ctaCell} ${
                      index === 0 ? styles.columnA : styles.columnB
                    }`}
                    data-compare-column={column.id}
                  >
                    <Button
                      variant="secondary"
                      shape="pill"
                      size="md"
                      fullWidth
                      href={column.cta.href}
                      target={column.cta.external ? "_blank" : undefined}
                      rel={column.cta.external ? "noopener noreferrer" : undefined}
                    >
                      {column.cta.label}
                    </Button>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        <p className={styles.fullComparison}>
          <Button
            variant="link"
            href={fullComparisonLink.href === "#" ? `#${sectionId}` : fullComparisonLink.href}
            rightIcon={<ArrowRightIcon size={18} aria-hidden="true" />}
          >
            {fullComparisonLink.label}
          </Button>
        </p>
      </div>
    </section>
  );
}

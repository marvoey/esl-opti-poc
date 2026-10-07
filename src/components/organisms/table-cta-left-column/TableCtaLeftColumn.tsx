import React, { useId } from "react";
import { Heading, type HeadingLevel } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import styles from "./TableCtaLeftColumn.module.css";
import type {
  TableCtaLeftColumnColumn,
  TableCtaLeftColumnRow,
} from "./tableCtaLeftColumnData";

export interface TableCtaLeftColumnProps {
  id?: string;
  title?: string;
  caption?: string;
  rowLabelHeading?: string;
  columns: TableCtaLeftColumnColumn[];
  rows: TableCtaLeftColumnRow[];
  headingLevel?: HeadingLevel;
  className?: string;
}

/**
 * Table CTA Left Column Organism
 *
 * Comparison table with a navy header row, bold row labels in the left
 * column, free-text cells and a footer row with one pill CTA per column.
 * Server Component: no client state. The table scrolls horizontally inside
 * a focusable, labelled region on narrow containers.
 */
export function TableCtaLeftColumn({
  id,
  title,
  caption,
  rowLabelHeading,
  columns,
  rows,
  headingLevel = "h2",
  className = "",
}: TableCtaLeftColumnProps) {
  const autoId = useId();
  const sectionId = id ?? `table-cta-left-column-${autoId.replace(/:/g, "")}`;
  const headingId = `${sectionId}-heading`;
  const hasCtas = columns.some((column) => column.cta);

  return (
    <section
      id={sectionId}
      aria-labelledby={title ? headingId : undefined}
      className={`${styles.section} ${className}`.trim()}
    >
      <div className={styles.container}>
        {title && (
          <Heading level={headingLevel} id={headingId} className={styles.title}>
            {title}
          </Heading>
        )}

        <div
          className={styles.scrollRegion}
          role="group"
          aria-label={caption || undefined}
          tabIndex={0}
        >
          <table className={styles.table}>
            {caption && <caption className={styles.visuallyHidden}>{caption}</caption>}

            <thead>
              <tr>
                {rowLabelHeading ? (
                  <th scope="col" className={`${styles.headerCell} ${styles.labelColumn}`}>
                    <Text as="span" variant="body-sm" weight="bold" color="inverted">
                      {rowLabelHeading}
                    </Text>
                  </th>
                ) : (
                  <td className={`${styles.headerCell} ${styles.labelColumn}`} />
                )}
                {columns.map((column) => (
                  <th
                    key={column.id}
                    scope="col"
                    className={styles.headerCell}
                    data-table-column={column.id}
                  >
                    <Text as="span" variant="body-sm" weight="bold" color="inverted">
                      {column.title}
                    </Text>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row" className={`${styles.rowHeader} ${styles.labelColumn}`}>
                    <Text as="span" variant="body-sm" weight="bold" color="primary">
                      {row.label}
                    </Text>
                  </th>
                  {columns.map((column, index) => (
                    <td key={column.id} className={styles.cell} data-table-column={column.id}>
                      {row.values[index] && (
                        <Text as="span" variant="body-sm" color="secondary">
                          {row.values[index]}
                        </Text>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

            {hasCtas && (
              <tfoot>
                <tr>
                  <td className={`${styles.ctaCell} ${styles.labelColumn}`} />
                  {columns.map((column) => (
                    <td key={column.id} className={styles.ctaCell} data-table-column={column.id}>
                      {column.cta && (
                        <Button
                          variant="secondary"
                          shape="pill"
                          size="sm"
                          fullWidth
                          href={column.cta.href}
                          target={column.cta.external ? "_blank" : undefined}
                          rel={column.cta.external ? "noopener noreferrer" : undefined}
                        >
                          {column.cta.label}
                        </Button>
                      )}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </section>
  );
}

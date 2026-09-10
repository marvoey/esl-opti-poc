import React from "react";
import styles from "./BasicsTileGrid.module.css";

export type BasicsTileGridLayout = "auto" | "row" | "grid2";

export interface BasicsTileGridProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  layout?: BasicsTileGridLayout;
  children: React.ReactNode;
  className?: string;
}

/**
 * BasicsTileGrid Container Component
 * Orchestrates a set of BasicsTile components with responsive interior dividers.
 * 
 * Layout Modes:
 * - "auto": Responsive. Adapts between 2-column grid (mobile) and single row (desktop).
 * - "row": Explicit horizontal track of tiles with vertical dividers (Desktop - Image 2).
 * - "grid2": Explicit 2-column grid with interior cross borders (Mobile - Image 3).
 */
export function BasicsTileGrid({
  title,
  subtitle,
  layout = "auto",
  children,
  className = "",
  ...rest
}: BasicsTileGridProps) {
  const layoutClass =
    layout === "row"
      ? styles.layoutRow
      : layout === "grid2"
      ? styles.layoutGrid2
      : styles.layoutAuto;

  const containerClasses = [styles.container, className].filter(Boolean).join(" ");

  return (
    <section className={containerClasses} {...rest}>
      {(title || subtitle) && (
        <header className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </header>
      )}

      <div className={`${styles.gridTrack} ${layoutClass}`}>{children}</div>
    </section>
  );
}

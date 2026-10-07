export interface TableCtaLeftColumnCta {
  /** Should name the product so it reads well out of context (WCAG 2.4.4). */
  label: string;
  href: string;
  external?: boolean;
}

export interface TableCtaLeftColumnColumn {
  /** Stable id. Used as React key and emitted as data-table-column. */
  id: string;
  /** Column heading, rendered in <th scope="col">. */
  title: string;
  /** Optional CTA rendered in the footer row under this column. */
  cta?: TableCtaLeftColumnCta;
}

export interface TableCtaLeftColumnRow {
  id: string;
  /** Row label, rendered in <th scope="row"> in the left column. */
  label: string;
  /** Cell values, index-aligned with `columns`. Missing entries render empty. */
  values: string[];
}

export interface TableCtaLeftColumnData {
  title?: string;
  /** Screen-reader-only table caption. Also names the horizontal scroll region. */
  caption?: string;
  /** Heading of the left (row label) column. Empty in the Figma design. */
  rowLabelHeading?: string;
  columns: TableCtaLeftColumnColumn[];
  rows: TableCtaLeftColumnRow[];
}

export const TABLE_CTA_LEFT_COLUMN_DATA: TableCtaLeftColumnData = {
  caption: "Daily Dividend compared with Money Maker savings",
  columns: [
    {
      id: "daily-dividend",
      title: "Best right now",
      cta: { label: "Open Daily Dividend", href: "/savings/daily-dividend" },
    },
    {
      id: "money-maker",
      title: "Which product, and the catch",
      cta: { label: "Open Money Maker", href: "/savings/money-maker" },
    },
  ],
  rows: [
    { id: "rate", label: "Rate / APY", values: ["x.xx% APY", "Up to x.xx% APY — tiered"] },
    { id: "minimum-open", label: "Minimum to open", values: ["$1", "$1"] },
    { id: "minimum-balance", label: "Minimum balance", values: ["None", "$1,000 for the higher tiers"] },
    {
      id: "access",
      label: "Checks & easy access",
      values: ["Transfers and ATM access", "Yes — checks included"],
    },
    {
      id: "best-for",
      label: "Best for",
      values: ["Getting started saving", "Balances that can sit and earn"],
    },
  ],
};

export interface CompareTableCta {
  /** MUST be self-describing out of context (WCAG 2.4.4) — name the product. */
  label: string;
  href: string;
  external?: boolean;
}

export interface CompareTableColumn {
  /** Stable slug. Emitted as data-compare-column; used as React key and test hook. */
  id: string;
  /** Product name — the ONLY content of <th scope="col">. No logo, no price. */
  name: string;
  cta: CompareTableCta;
}

export interface CompareTableRow {
  id: string;
  /** Feature label — renders in <th scope="row">. */
  label: string;
  /** Free text, index-aligned with `columns`. Position 0 -> columns[0]. */
  values: [string, string];
}

export interface CompareTableData {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Screen-reader-only <caption>. Must stand alone in a table list. */
  caption: string;
  /** Accessible name for the horizontal scroll region (role="group"). */
  scrollRegionLabel: string;
  /** Exactly two. Tuple type enforces arity at compile time. */
  columns: [CompareTableColumn, CompareTableColumn];
  /** 5-8 rows for this slice. Not type-enforced; enforced by data + review. */
  rows: CompareTableRow[];
  fullComparisonLink: { label: string; href: string };
}

/** Default anchor target for full comparison section or page. */
export const COMPARE_TABLE_FULL_COMPARISON_HREF = "#compare-table";

export const DEFAULT_COMPARE_TABLE_DATA: CompareTableData = {
  eyebrow: "SIDE BY SIDE",
  title: "The differences that matter.",
  description:
    "Compare Premier and Essential Checking side by side to find the account that fits how you bank.",
  caption: "Premier Checking compared with Essential Checking, feature by feature",
  scrollRegionLabel: "Feature comparison table, scrollable horizontally",
  columns: [
    {
      id: "premier-checking",
      name: "Premier Checking",
      cta: {
        label: "Open Premier Checking",
        href: "/checking/premier",
      },
    },
    {
      id: "essential-checking",
      name: "Essential Checking",
      cta: {
        label: "Open Essential Checking",
        href: "/checking/essential",
      },
    },
  ],
  rows: [
    {
      id: "monthly-fee",
      label: "Monthly maintenance fee",
      values: [
        "$10 — waived with a $1,000 average balance",
        "$0 — no monthly fee, ever",
      ],
    },
    {
      id: "minimum-balance",
      label: "Minimum opening deposit",
      values: ["$100 minimum opening deposit", "$25 minimum opening deposit"],
    },
    {
      id: "atm-network",
      label: "ATM access",
      values: [
        "Free nationwide ATM withdrawals & fee rebates",
        "Access over 30,000 surcharge-free CO-OP ATMs",
      ],
    },
    {
      id: "overdraft-protection",
      label: "Overdraft protection",
      values: ["Included at no extra cost", "None"],
    },
    {
      id: "dividends-apy",
      label: "Dividends (APY)",
      values: ["0.05% APY on all balances", "No dividends offered"],
    },
    {
      id: "mobile-deposit-limit",
      label: "Mobile deposit limit",
      values: [
        "$5,000 per day via mobile deposit",
        "$2,000 per day via mobile deposit",
      ],
    },
  ],
  fullComparisonLink: {
    label: "See the full comparison & all features",
    href: COMPARE_TABLE_FULL_COMPARISON_HREF,
  },
};

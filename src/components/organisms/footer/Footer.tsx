import React from "react";
import type { ButtonVariant } from "@/components/atoms/button/Button";
import { FooterBrand } from "./FooterBrand";
import { FooterNavColumn } from "./FooterNavColumn";
import { FooterLegal } from "./FooterLegal";
import styles from "./Footer.module.css";

export interface FooterLinkItem {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  target?: "_blank" | "_self";
  rel?: string;
}

export interface FooterNavColumn {
  id: string;
  title: string;
  links: FooterLinkItem[];
}

export interface FooterBrandSection {
  /** Optional custom logo element. Defaults to the optimized BrandLogo SVG */
  logo?: React.ReactNode;
  /** Optional custom logo image URL (e.g. from CMS media asset) */
  logoUrl?: string;
  /** Optional alt text for custom logo image */
  logoAlt?: string;
  /** Accessible wordmark name (defaults to ESL) */
  wordmark?: string;
  wordmarkHref?: string;
  text: string;
  button?: {
    label: string;
    href: string;
    variant?: ButtonVariant;
    external?: boolean;
  };
}

export interface FooterProps {
  /** Column 1 Brand configuration: wordmark, copy text, and action button */
  brand?: FooterBrandSection;
  /** Columns 2-5: navigation columns, each with 1 title and its links */
  columns?: FooterNavColumn[];
  /** Row 2 content: address text (defaults to 225 Chestnut Street, Rochester NY 14604) */
  addressText?: string;
  /** Row 2 content: legal links (Privacy Policy, Disclosures, Security) */
  legalLinks?: FooterLinkItem[];
  /** Row 2 content: registered service marks statement */
  serviceMarksText?: string;
  /** Row 2 content: backwards-compatible alias for serviceMarksText */
  disclaimerText?: string;
  /** Row 2 content: optional copyright statement */
  copyrightText?: string;
  /** Custom children or bottom bar overrides */
  bottomContent?: React.ReactNode;
  /** Optional custom class overrides */
  className?: string;
}

/**
 * Footer Organism Component
 * Site-wide navigational and legal closing landmark. Renders a dark brand-gradient
 * section with a 5-column grid on desktop (brand column + 4 nav columns) collapsing
 * to a stacked brand column and a 2x2 nav grid on mobile, followed by a full-width
 * legal/copyright row.
 */
const EMPTY_COLUMNS: FooterNavColumn[] = [];
const EMPTY_LEGAL_LINKS: FooterLinkItem[] = [];

export function Footer({
  brand,
  columns = EMPTY_COLUMNS,
  addressText,
  legalLinks = EMPTY_LEGAL_LINKS,
  serviceMarksText,
  disclaimerText,
  copyrightText,
  bottomContent,
  className = "",
}: FooterProps) {
  const combinedSectionClass = `${styles.footerSection} ${className}`.trim();
  const effectiveServiceMarks = disclaimerText ?? serviceMarksText;

  return (
    <section
      className={combinedSectionClass}
      role="contentinfo"
      aria-label="Site Footer"
    >
      <div className={styles.container}>
        <div className={styles.gridContainer}>
          <div className={styles.row1}>
            {brand ? <FooterBrand brand={brand} /> : null}
            {columns.map((column) => (
              <FooterNavColumn key={column.id} column={column} />
            ))}
          </div>

          <FooterLegal
            addressText={addressText}
            legalLinks={legalLinks}
            serviceMarksText={effectiveServiceMarks}
            copyrightText={copyrightText}
            bottomContent={bottomContent}
          />
        </div>
      </div>
    </section>
  );
}

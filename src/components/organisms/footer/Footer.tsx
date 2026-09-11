import React from "react";
import Link from "next/link";
import { Text } from "@/components/atoms/text/Text";
import { TextLink } from "@/components/atoms/link/TextLink";
import { Button, ButtonVariant } from "@/components/atoms/button/Button";
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
export function Footer({
  brand,
  columns = [],
  addressText,
  legalLinks = [],
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
      <div className="container">
        <div className={styles.gridContainer}>
          <div className={styles.row1}>
            {brand ? (
              <div className={styles.brandCol}>
                {brand.logo || brand.logoUrl ? (
                  <Link
                    href={brand.wordmarkHref || "/"}
                    className={styles.brandLogo}
                    aria-label={brand.wordmark || "ESL"}
                  >
                    {brand.logo ? (
                      brand.logo
                    ) : (
                      <img
                        src={brand.logoUrl}
                        alt={brand.logoAlt || brand.wordmark || "ESL"}
                        className={styles.logoImage}
                      />
                    )}
                  </Link>
                ) : null}
                {brand.text ? (
                  <Text
                    as="p"
                    variant="body-sm"
                    color="inverted"
                    className={styles.brandText}
                  >
                    {brand.text}
                  </Text>
                ) : null}
                {brand.button ? (
                  <Button
                    href={brand.button.href}
                    variant={brand.button.variant || "secondary"}
                    shape="pill"
                    className={styles.brandButton}
                    {...(brand.button.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {brand.button.label}
                  </Button>
                ) : null}
              </div>
            ) : null}

            {columns.map((column) => (
              <nav
                key={column.id}
                aria-label={column.title}
                className={styles.navCol}
              >
                <Text
                  as="h3"
                  variant="footer-title"
                  color="inverted"
                  className={styles.navTitle}
                >
                  {column.title}
                </Text>
                <ul className={styles.navList}>
                  {column.links.map((link) => (
                    <li key={link.id}>
                      <TextLink
                        href={link.href}
                        variant="light"
                        underline="none"
                        textVariant="body"
                        weight="regular"
                        external={link.external}
                        target={link.target}
                        rel={link.rel}
                        className={styles.footerLink}
                      >
                        {link.label}
                      </TextLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {(addressText || (legalLinks && legalLinks.length > 0) || effectiveServiceMarks || copyrightText || bottomContent) ? (
            <div className={styles.row2}>
              {bottomContent ?? (
                <>
                  {(addressText || (legalLinks && legalLinks.length > 0)) ? (
                    <div className={styles.legalFirstRow}>
                      {addressText ? (
                        <Text
                          as="p"
                          variant="body-sm"
                          color="inverted-muted"
                          className={styles.legalAddress}
                        >
                          {addressText}
                        </Text>
                      ) : null}
                      {legalLinks && legalLinks.length > 0 ? (
                        <ul className={styles.legalLinksList} aria-label="Legal Information">
                          {legalLinks.map((link) => (
                            <li key={link.id} className={styles.legalLinkItem}>
                              <Text
                                as="span"
                                variant="body-sm"
                                color="inverted-muted"
                                className={styles.legalPipe}
                                aria-hidden="true"
                              >
                                |
                              </Text>
                              <TextLink
                                href={link.href}
                                variant="light"
                                underline="none"
                                textVariant="body-sm"
                                weight="regular"
                                external={link.external}
                                target={link.target}
                                rel={link.rel}
                                className={styles.legalLink}
                              >
                                {link.label}
                              </TextLink>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : null}
                  {effectiveServiceMarks ? (
                    <Text
                      as="p"
                      variant="body-sm"
                      color="inverted-muted"
                      className={styles.legalServiceMarks}
                    >
                      {effectiveServiceMarks}
                    </Text>
                  ) : null}
                  {copyrightText ? (
                    <Text
                      as="p"
                      variant="body-sm"
                      color="inverted-muted"
                      className={styles.copyrightText}
                    >
                      {copyrightText}
                    </Text>
                  ) : null}
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { Text } from "@/components/atoms/text/Text";
import { TextLink } from "@/components/atoms/link/TextLink";
import type { FooterLinkItem } from "./Footer";
import styles from "./Footer.module.css";

interface FooterLegalProps {
  addressText?: string;
  legalLinks?: FooterLinkItem[];
  serviceMarksText?: string;
  copyrightText?: string;
  bottomContent?: React.ReactNode;
}

function LegalLinksList({ links }: { links: FooterLinkItem[] }) {
  if (links.length === 0) return null;
  return (
    <ul className={styles.legalLinksList} aria-label="Legal Information">
      {links.map((link) => (
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
  );
}

const EMPTY_LEGAL_LINKS: FooterLinkItem[] = [];

export function FooterLegal({
  addressText,
  legalLinks = EMPTY_LEGAL_LINKS,
  serviceMarksText,
  copyrightText,
  bottomContent,
}: FooterLegalProps) {
  const hasLinks = legalLinks.length > 0;
  const hasContent = Boolean(
    addressText ||
    hasLinks ||
    serviceMarksText ||
    copyrightText ||
    bottomContent
  );

  if (!hasContent) return null;

  return (
    <div className={styles.row2}>
      {bottomContent ?? (
        <>
          {(addressText || hasLinks) && (
            <div className={styles.legalFirstRow}>
              {addressText && (
                <Text
                  as="p"
                  variant="body-sm"
                  color="inverted-muted"
                  className={styles.legalAddress}
                >
                  {addressText}
                </Text>
              )}
              <LegalLinksList links={legalLinks} />
            </div>
          )}
          {serviceMarksText && (
            <Text
              as="p"
              variant="body-sm"
              color="inverted-muted"
              className={styles.legalServiceMarks}
            >
              {serviceMarksText}
            </Text>
          )}
          {copyrightText && (
            <Text
              as="p"
              variant="body-sm"
              color="inverted-muted"
              className={styles.copyrightText}
            >
              {copyrightText}
            </Text>
          )}
        </>
      )}
    </div>
  );
}

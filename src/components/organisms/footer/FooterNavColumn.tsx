import React from "react";
import { Text } from "@/components/atoms/text/Text";
import { TextLink } from "@/components/atoms/link/TextLink";
import type { FooterNavColumn as FooterNavColumnType } from "./Footer";
import styles from "./Footer.module.css";

interface FooterNavColumnProps {
  column: FooterNavColumnType;
}

export function FooterNavColumn({ column }: FooterNavColumnProps) {
  return (
    <nav aria-label={column.title} className={styles.navCol}>
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
  );
}

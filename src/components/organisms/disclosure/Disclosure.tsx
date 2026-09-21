import React from "react";
import { Text } from "@/components/atoms/text/Text";
import styles from "./Disclosure.module.css";

export interface DisclosureItem {
  id: string;
  boldText: string;
  regularText?: React.ReactNode;
}

export interface DisclosureProps {
  id?: string;
  heading?: string;
  items: DisclosureItem[];
  className?: string;
}

export function Disclosure({
  id,
  heading = "DISCLOSURES:",
  items = [],
  className = "",
}: DisclosureProps) {
  if (!items || items.length === 0) return null;

  const headingId = id ? `${id}-heading` : "disclosures-heading";

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`}
      aria-labelledby={headingId}
    >
      <div className={styles.container}>
        <Text
          as="h2"
          id={headingId}
          variant="micro"
          color="primary"
          className={styles.heading}
        >
          {heading}
        </Text>
        <div className={styles.content}>
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            <Text as="p" variant="micro" color="primary" weight="bold" className={styles.line}>
              {item.boldText}
            </Text>
            <Text
              as={typeof item.regularText === "string" ? "p" : "div"}
              variant="micro"
              color="primary"
              className={styles.line}
            >
              {item.regularText}
            </Text>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}

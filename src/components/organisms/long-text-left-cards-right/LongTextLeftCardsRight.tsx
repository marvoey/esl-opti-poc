import React from "react";
import Link from "next/link";
import { type HeadingLevel, Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Badge } from "@/components/atoms/badge/Badge";
import { SimpleLink } from "@/components/atoms/link/SimpleLink";
import { CardIcon } from "./longTextLeftCardsRightIcons";
import { type LongTextLeftCardsRightIconName } from "./longTextLeftCardsRightIconNames";
import styles from "./LongTextLeftCardsRight.module.css";

export interface LongTextLeftCardsRightLink {
  label: string;
  href: string;
  target?: string;
}

export interface LongTextLeftCardsRightPromo {
  eyebrow?: string;
  heading?: string;
  description?: React.ReactNode;
  cta?: LongTextLeftCardsRightLink;
}

export interface LongTextLeftCardsRightCard {
  id?: string;
  icon?: LongTextLeftCardsRightIconName;
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  href?: string;
  target?: string;
}

export interface LongTextLeftCardsRightProps {
  id?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  body?: React.ReactNode;
  promo?: LongTextLeftCardsRightPromo;
  items: LongTextLeftCardsRightCard[];
  className?: string;
}

function relFor(target?: string) {
  return target === "_blank" ? "noopener noreferrer" : undefined;
}

function blockTag(node: React.ReactNode) {
  return typeof node === "string" ? "p" : "div";
}

function PromoSection({ promo }: { promo: LongTextLeftCardsRightPromo }) {
  return (
    <div className={styles.promo}>
      {promo.eyebrow && <Badge variant="dark">{promo.eyebrow}</Badge>}
      <h3 className={styles.promoHeading}>
        <Text as="span" variant="subhead" color="inverted">{promo.heading}</Text>
      </h3>
      {promo.description && (
        <Text as={blockTag(promo.description)} variant="body-sm" color="inverted" className={styles.promoDescription}>
          {promo.description}
        </Text>
      )}
      {promo.cta && (
        <SimpleLink href={promo.cta.href} target={promo.cta.target} rel={relFor(promo.cta.target)} className={styles.promoLink}>
          {promo.cta.label}
        </SimpleLink>
      )}
    </div>
  );
}

function CardItem({ item }: { item: LongTextLeftCardsRightCard }) {
  return (
    <li className={styles.card}>
      {item.icon && <CardIcon name={item.icon} size={24} className={styles.cardIcon} />}
      <div className={styles.cardText}>
        {item.eyebrow && (
          <Text as="span" variant="micro" color="inherit">
            {item.eyebrow}
          </Text>
        )}
        <h3 className={styles.cardTitle}>
          {item.href ? (
            <Link href={item.href} target={item.target} rel={relFor(item.target)} className={styles.cardLink}>
              <Text as="span" variant="button" weight="semibold" color="inherit">{item.title}</Text>
            </Link>
          ) : (
            <Text as="span" variant="button" weight="semibold" color="inherit">{item.title}</Text>
          )}
        </h3>
        {item.description && (
          <Text as={blockTag(item.description)} variant="body-sm" color="inherit" className={styles.cardDescription}>
            {item.description}
          </Text>
        )}
      </div>
    </li>
  );
}

export function LongTextLeftCardsRight({
  id,
  title,
  headingLevel = "h2",
  body,
  promo,
  items = [],
  className = "",
}: LongTextLeftCardsRightProps) {
  const hasPromo = Boolean(promo?.heading);
  const hasItems = Boolean(items && items.length > 0);
  if (!title && !body && !hasPromo && !hasItems) return null;

  const headingId = id && title ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`}
      aria-labelledby={headingId}
      aria-label={headingId ? undefined : title}
    >
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.content}>
            {title && (
              <Heading level={headingLevel} id={headingId} className={styles.title}>
                {title}
              </Heading>
            )}

            {body && (
              <Text as={blockTag(body)} variant="body" color="secondary" className={styles.body}>
                {body}
              </Text>
            )}

            {hasPromo && promo && <PromoSection promo={promo} />}
          </div>

          {hasItems && (
            <ul className={styles.cards}>
              {items.map((item) => (
                <CardItem key={item.id ?? item.title} item={item} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

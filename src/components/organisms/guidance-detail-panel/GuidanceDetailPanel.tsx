import React, { useId } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { Text, type TextTag } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import { ArrowRightIcon } from "@/components/atoms/icons";
import { GuidanceIcon } from "./guidanceIcons";
import styles from "./GuidanceDetailPanel.module.css";
import type {
  GuidanceDetailPanelProps,
  GuidanceStartingPoint,
  GuidanceTool,
} from "./guidanceDetailPanelData";

export type {
  GuidanceDetailPanelProps,
  GuidanceDetailPanelLink,
  GuidanceStartingPoint,
  GuidanceTool,
  GuidanceIconName,
} from "./guidanceDetailPanelData";

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

function headingBelow(level: TextTag, steps: number): TextTag {
  const index = HEADING_TAGS.indexOf(level as (typeof HEADING_TAGS)[number]);
  return HEADING_TAGS[Math.min(Math.max(index, 0) + steps, HEADING_TAGS.length - 1)];
}

function externalProps(external?: boolean) {
  return external ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};
}

/**
 * Card title. With an href, the link's ::after stretches over the whole card,
 * so the card is clickable while the link's accessible name stays the title.
 */
function CardTitle({
  as,
  title,
  href,
  external,
}: {
  as: TextTag;
  title: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <Text as={as} variant="body" weight="bold" color="primary" className={styles.cardTitle}>
      {href ? (
        <NextLink href={href} className={styles.cardLink} {...externalProps(external)}>
          {title}
          {external && <span className={styles.visuallyHidden}>(opens in a new tab)</span>}
        </NextLink>
      ) : (
        title
      )}
    </Text>
  );
}

function StartingPointCard({ item, titleTag }: { item: GuidanceStartingPoint; titleTag: TextTag }) {
  return (
    <div className={item.href ? `${styles.card} ${styles.interactive}` : styles.card}>
      <CardTitle as={titleTag} title={item.title} href={item.href} external={item.external} />
      {item.description && (
        <Text as="p" variant="body-sm" color="secondary" className={styles.cardCopy}>
          {item.description}
        </Text>
      )}
    </div>
  );
}

function ToolCard({ item, titleTag }: { item: GuidanceTool; titleTag: TextTag }) {
  return (
    <div
      className={[styles.card, styles.toolCard, item.href ? styles.interactive : null]
        .filter(Boolean)
        .join(" ")}
    >
      {item.icon && <GuidanceIcon name={item.icon} size={22} className={styles.toolIcon} />}
      <div className={styles.toolText}>
        {item.label && (
          <Text as="p" variant="caption" color="secondary" className={styles.toolLabel}>
            {item.label}
          </Text>
        )}
        <CardTitle as={titleTag} title={item.title} href={item.href} external={item.external} />
      </div>
    </div>
  );
}

function CardGroup({
  id,
  heading,
  headingTag,
  children,
}: {
  id: string;
  heading?: string;
  headingTag: TextTag;
  children: React.ReactNode;
}) {
  const headingId = `${id}-heading`;
  const content = (
    <>
      {heading && (
        <Text as={headingTag} variant="eyebrow" color="secondary" id={headingId} className={styles.groupHeading}>
          {heading}
        </Text>
      )}
      <ul className={styles.cardList} role="list">
        {children}
      </ul>
    </>
  );

  return heading ? (
    <section className={styles.group} aria-labelledby={headingId}>
      {content}
    </section>
  ) : (
    <div className={styles.group}>{content}</div>
  );
}

/**
 * Guidance Detail Panel Organism
 * A bordered panel for one guidance topic: an intro (icon badge, title, copy,
 * CTA, supporting note and image), then a group of starting-point cards and a
 * group of tool cards, separated by dividers.
 */
export function GuidanceDetailPanel({
  id,
  icon,
  title,
  headingLevel = "h2",
  description,
  cta,
  note,
  imageSrc,
  imageAlt = "",
  startingPointsHeading,
  startingPoints = [],
  toolsHeading,
  tools = [],
  className = "",
}: GuidanceDetailPanelProps) {
  const autoId = useId();
  if (!title) return null;

  const baseId = id ?? autoId;
  const headingId = `${baseId}-heading`;
  const groupTag = headingBelow(headingLevel, 1);
  const cardTag = headingBelow(headingLevel, 2);

  return (
    <section
      id={id}
      className={[styles.section, className].filter(Boolean).join(" ")}
      aria-labelledby={headingId}
    >
      <div className={styles.container}>
        <div className={styles.panel}>
          <div className={imageSrc ? `${styles.intro} ${styles.hasImage}` : styles.intro}>
            <div className={styles.introText}>
              <div className={styles.titleRow}>
                {icon && (
                  <span className={styles.iconBadge}>
                    <GuidanceIcon name={icon} size={20} />
                  </span>
                )}
                <Text as={headingLevel} variant="eyebrow" color="primary" id={headingId} className={styles.title}>
                  {title}
                </Text>
              </div>

              {description && (
                <Text as="div" variant="body" color="primary" className={styles.description}>
                  {description}
                </Text>
              )}

              {cta?.href && cta.label && (
                <Button
                  variant="primary"
                  shape="pill"
                  href={cta.href}
                  rightIcon={<ArrowRightIcon size={18} />}
                  className={styles.cta}
                  {...externalProps(cta.external)}
                >
                  {cta.label}
                </Button>
              )}

              {note && (
                <Text as="p" variant="body-sm" color="primary" className={styles.note}>
                  {note}
                </Text>
              )}
            </div>

            {imageSrc && (
              <div className={styles.media}>
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className={styles.image}
                />
              </div>
            )}
          </div>

          {startingPoints.length > 0 && (
            <>
              <hr className={styles.divider} />
              <CardGroup id={`${baseId}-starting-points`} heading={startingPointsHeading} headingTag={groupTag}>
                {startingPoints.map((item, index) => (
                  <li key={item.id ?? `${item.title}-${index}`} className={styles.cardItem}>
                    <StartingPointCard item={item} titleTag={cardTag} />
                  </li>
                ))}
              </CardGroup>
            </>
          )}

          {tools.length > 0 && (
            <>
              <hr className={styles.divider} />
              <CardGroup id={`${baseId}-tools`} heading={toolsHeading} headingTag={groupTag}>
                {tools.map((item, index) => (
                  <li key={item.id ?? `${item.title}-${index}`} className={styles.cardItem}>
                    <ToolCard item={item} titleTag={cardTag} />
                  </li>
                ))}
              </CardGroup>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

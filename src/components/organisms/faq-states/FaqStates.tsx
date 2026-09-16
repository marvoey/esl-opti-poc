"use client";

import React, { useId, useState } from "react";
import { type HeadingLevel, Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { TextLink } from "@/components/atoms/link/TextLink";
import { ArrowRightIcon, PlusIcon, MinusIcon } from "@/components/atoms/icons";
import styles from "./FaqStates.module.css";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqStatesProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  description?: string;
  helpLinkLeadIn?: string;
  helpLinkText?: string;
  helpLinkHref?: string;
  items: FaqItem[];
  defaultExpandedId?: string;
  className?: string;
}

export function FaqStates({
  id,
  eyebrow,
  title,
  headingLevel = "h2",
  description,
  helpLinkLeadIn,
  helpLinkText,
  helpLinkHref,
  items = [],
  defaultExpandedId,
  className = "",
}: FaqStatesProps) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(defaultExpandedId ? [defaultExpandedId] : [])
  );

  if (!items || items.length === 0) return null;

  function toggleItem(itemId: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }

  return (
    <section
      id={id}
      className={`${styles.section} ${className}`}
      aria-labelledby={title ? `${baseId}-heading` : undefined}
    >
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.textCol}>
            {eyebrow && (
              <Text variant="eyebrow" color="accent" className={styles.eyebrow}>
                {eyebrow}
              </Text>
            )}
            {title && (
              <Heading
                level={headingLevel}
                id={`${baseId}-heading`}
                className={styles.sectionTitle}
              >
                {title}
              </Heading>
            )}
            {description && (
              <Text variant="body" color="secondary" className={styles.description}>
                {description}
              </Text>
            )}
            {helpLinkText && helpLinkHref && (
              <div className={styles.helpLink}>
                {helpLinkLeadIn && (
                  <Text as="span" variant="body" color="secondary">
                    {helpLinkLeadIn}
                  </Text>
                )}
                <TextLink
                  href={helpLinkHref}
                  variant="dark"
                  weight="bold"
                  textVariant="body"
                >
                  {helpLinkText}
                </TextLink>
                <ArrowRightIcon size={16} aria-hidden="true" />
              </div>
            )}
          </div>

          <div className={styles.accordion}>
            {items.map((item) => {
              const isExpanded = expandedIds.has(item.id);
              const triggerId = `${baseId}-trigger-${item.id}`;
              const panelId = `${baseId}-panel-${item.id}`;

              return (
                <div key={item.id} className={styles.item}>
                  <h3 className={styles.itemHeading}>
                    <button
                      type="button"
                      id={triggerId}
                      className={styles.trigger}
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      onClick={() => toggleItem(item.id)}
                    >
                      <Text as="span" variant="button" className={styles.question}>
                        {item.question}
                      </Text>
                      <span className={styles.icon} aria-hidden="true">
                        {isExpanded ? <MinusIcon size={20} /> : <PlusIcon size={20} />}
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    aria-labelledby={triggerId}
                    aria-hidden={!isExpanded}
                    className={`${styles.panelOuter} ${isExpanded ? styles.expanded : ""}`}
                  >
                    <div className={styles.panelInner}>
                      <Text as="p" variant="body" color="secondary" className={styles.answer}>
                        {item.answer}
                      </Text>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

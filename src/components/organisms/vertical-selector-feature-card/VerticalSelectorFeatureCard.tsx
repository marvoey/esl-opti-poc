"use client";

import React, { useId, useState, useRef, KeyboardEvent } from "react";
import Image from "next/image";
import { Heading, type HeadingLevel } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import { TabButton } from "@/components/atoms/tab/TabButton";
import { ArrowRightIcon } from "@/components/atoms/icons";
import { DEFAULT_VERTICAL_SELECTOR_DATA } from "./verticalSelectorData";
import styles from "./VerticalSelectorFeatureCard.module.css";

export interface FeatureCardCtaData {
  label: string;
  href: string;
  external?: boolean;
}

export interface FeatureCardMediaData {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface FeatureCardContentData {
  title: string;
  description: string;
  image: FeatureCardMediaData;
  cta?: FeatureCardCtaData;
}

export interface VerticalSelectorTabItemData {
  id: string;
  label: string;
  icon?: React.ReactNode;
  feature: FeatureCardContentData;
}

export interface VerticalSelectorFeatureCardProps {
  id?: string;
  eyebrow?: string | null;
  title?: string;
  headingLevel?: HeadingLevel;
  description?: string | null;
  cta?: FeatureCardCtaData | null;
  tabs?: VerticalSelectorTabItemData[];
  defaultActiveId?: string;
  className?: string;
}

/**
 * VerticalSelectorFeatureCard Organism
 * A 2-row editorial discovery organism featuring:
 * 1. Header row identical to CircularImageMetricRow (max-width 585px text on left, bottom-right aligned pill CTA).
 * 2. An interactive 40% - 60% split grid with 24px gap pairing an 8-item vertical TabButton controller
 *    with a synchronized 16px-radius Feature Card (328px image, 24px padding text area, pill CTA).
 */
export function VerticalSelectorFeatureCard({
  id,
  eyebrow = DEFAULT_VERTICAL_SELECTOR_DATA.eyebrow,
  title = DEFAULT_VERTICAL_SELECTOR_DATA.title,
  headingLevel = "h2",
  description = DEFAULT_VERTICAL_SELECTOR_DATA.description,
  cta = DEFAULT_VERTICAL_SELECTOR_DATA.cta,
  tabs = DEFAULT_VERTICAL_SELECTOR_DATA.tabs ?? [],
  defaultActiveId = DEFAULT_VERTICAL_SELECTOR_DATA.defaultActiveId,
  className = "",
}: VerticalSelectorFeatureCardProps) {
  const autoId = useId();
  const headingId = `${id ?? autoId}-heading`;
  const tablistRef = useRef<HTMLDivElement>(null);

  const initialTabId =
    defaultActiveId ?? (tabs.length > 0 ? tabs[0].id : "");
  const [activeTabId, setActiveTabId] = useState<string>(initialTabId);

  const activeTab =
    tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  const sectionClassName = className
    ? `${styles.section} ${className}`
    : styles.section;

  const headerCtaExternalProps = cta?.external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  const featureCtaExternalProps = activeTab?.feature.cta?.external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  // WAI-ARIA Keyboard Navigation for vertical tablist
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!tabs.length) return;
    const currentIndex = tabs.findIndex((t) => t.id === activeTabId);
    let nextIndex = currentIndex;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== currentIndex) {
      const nextTab = tabs[nextIndex];
      setActiveTabId(nextTab.id);
      const buttonToFocus = tablistRef.current?.querySelector<HTMLButtonElement>(
        `#tab-${nextTab.id}`
      );
      buttonToFocus?.focus();
    }
  };

  return (
    <section
      id={id}
      className={sectionClassName}
      aria-labelledby={headingId}
    >
      <div className={styles.container}>
        {/* Row 1: Header Row (Equal to CircularImageMetricRow) */}
        <div className={styles.headerRow}>
          <div className={styles.headerContent}>
            {eyebrow && (
              <Text
                as="span"
                variant="eyebrow"
                color="accent"
                className={styles.eyebrow}
              >
                {eyebrow}
              </Text>
            )}

            {title && (
              <Heading
                level={headingLevel}
                id={headingId}
                className={styles.title}
              >
                {title}
              </Heading>
            )}

            {description && (
              <Text
                as="p"
                variant="body-lg"
                color="primary"
                className={styles.description}
              >
                {description}
              </Text>
            )}
          </div>

          {cta && (
            <div className={styles.headerCta}>
              <Button
                variant="primary"
                shape="pill"
                href={cta.href}
                rightIcon={<ArrowRightIcon size={20} />}
                {...headerCtaExternalProps}
              >
                {cta.label}
              </Button>
            </div>
          )}
        </div>

        {/* Row 2: 40% - 60% Split Grid with 24px Gap */}
        {tabs.length > 0 && activeTab && (
          <div className={styles.selectorGrid}>
            {/* Col 1: Tabs Controller (40%) */}
            <div
              ref={tablistRef}
              className={styles.tabsController}
              role="tablist"
              aria-orientation="vertical"
              aria-label={title || "Solutions navigation"}
              onKeyDown={handleKeyDown}
            >
              {tabs.map((tab) => {
                const isSelected = activeTabId === tab.id;
                return (
                  <TabButton
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls={`tabpanel-${tab.id}`}
                    tabIndex={isSelected ? 0 : -1}
                    active={isSelected}
                    icon={tab.icon}
                    className={styles.tabButton}
                    onClick={() => setActiveTabId(tab.id)}
                  >
                    {tab.label}
                  </TabButton>
                );
              })}
            </div>

            {/* Col 2: Synchronized Feature Card (60%) */}
            <div
              id={`tabpanel-${activeTab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab.id}`}
              className={styles.featureCard}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={activeTab.feature.image.src}
                  alt={activeTab.feature.image.alt}
                  width={activeTab.feature.image.width ?? 720}
                  height={activeTab.feature.image.height ?? 328}
                  className={styles.featureImage}
                />
              </div>

              <div className={styles.textArea}>
                <Heading level="h3" className={styles.featureTitle}>
                  {activeTab.feature.title}
                </Heading>

                <Text
                  as="p"
                  variant="body-lg"
                  color="primary"
                  className={styles.featureDescription}
                >
                  {activeTab.feature.description}
                </Text>

                {activeTab.feature.cta && (
                  <div className={styles.featureAction}>
                    <Button
                      variant="primary"
                      shape="pill"
                      href={activeTab.feature.cta.href}
                      rightIcon={<ArrowRightIcon size={16} />}
                      {...featureCtaExternalProps}
                    >
                      {activeTab.feature.cta.label}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

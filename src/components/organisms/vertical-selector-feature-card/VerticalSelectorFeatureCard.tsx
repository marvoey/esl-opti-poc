"use client";

import React, { useId } from "react";
import { type HeadingLevel } from "@/components/atoms/heading/Heading";
import { DEFAULT_VERTICAL_SELECTOR_DATA } from "./verticalSelectorData";
import { useVerticalTabNavigation } from "./useVerticalTabNavigation";
import { VerticalSelectorHeader } from "./VerticalSelectorHeader";
import { VerticalSelectorTabList } from "./VerticalSelectorTabList";
import { VerticalSelectorFeaturePanel } from "./VerticalSelectorFeaturePanel";
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

const DEFAULT_TABS: VerticalSelectorTabItemData[] =
  DEFAULT_VERTICAL_SELECTOR_DATA.tabs ?? [];

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
  tabs = DEFAULT_TABS,
  defaultActiveId = DEFAULT_VERTICAL_SELECTOR_DATA.defaultActiveId,
  className = "",
}: VerticalSelectorFeatureCardProps) {
  const autoId = useId();
  const headingId = `${id ?? autoId}-heading`;

  const {
    tablistRef,
    activeTabId,
    setActiveTabId,
    activeTab,
    handleKeyDown,
  } = useVerticalTabNavigation({ tabs, defaultActiveId });

  const sectionClassName = className
    ? `${styles.section} ${className}`.trim()
    : styles.section;

  return (
    <section
      id={id}
      className={sectionClassName}
      aria-labelledby={headingId}
    >
      <div className={styles.container}>
        <VerticalSelectorHeader
          eyebrow={eyebrow}
          title={title}
          headingLevel={headingLevel}
          headingId={headingId}
          description={description}
          cta={cta}
        />

        {tabs.length > 0 && activeTab && (
          <div className={styles.selectorGrid}>
            <VerticalSelectorTabList
              tabs={tabs}
              activeTabId={activeTabId}
              tablistRef={tablistRef}
              title={title}
              onSelectTab={setActiveTabId}
              onKeyDown={handleKeyDown}
            />

            <VerticalSelectorFeaturePanel activeTab={activeTab} />
          </div>
        )}
      </div>
    </section>
  );
}

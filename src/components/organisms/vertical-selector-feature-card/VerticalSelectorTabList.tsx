import React, { KeyboardEvent, RefObject } from "react";
import { TabButton } from "@/components/atoms/tab/TabButton";
import type { VerticalSelectorTabItemData } from "./VerticalSelectorFeatureCard";
import styles from "./VerticalSelectorFeatureCard.module.css";

interface VerticalSelectorTabListProps {
  tabs: VerticalSelectorTabItemData[];
  activeTabId: string;
  tablistRef: RefObject<HTMLDivElement | null>;
  title?: string;
  onSelectTab: (id: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
}

export function VerticalSelectorTabList({
  tabs,
  activeTabId,
  tablistRef,
  title,
  onSelectTab,
  onKeyDown,
}: VerticalSelectorTabListProps) {
  return (
    <div
      ref={tablistRef}
      className={styles.tabsController}
      role="tablist"
      aria-orientation="vertical"
      aria-label={title || "Solutions navigation"}
      onKeyDown={onKeyDown}
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
            onClick={() => onSelectTab(tab.id)}
          >
            {tab.label}
          </TabButton>
        );
      })}
    </div>
  );
}

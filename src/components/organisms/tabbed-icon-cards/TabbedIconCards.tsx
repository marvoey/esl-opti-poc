"use client";

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { QuickLinkSimple } from "@/components/atoms/card/quick-link-simple/QuickLinkSimple";
import styles from "./TabbedIconCards.module.css";

export interface TabbedCardItem {
  id: string;
  title: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "default";
}

export interface TabCategory {
  id: string;
  label: string;
  icon?: React.ReactNode;
  /** Dynamically rendered collection of cards for this category */
  cards: TabbedCardItem[];
}

export interface TabbedIconCardsProps {
  /** Section title */
  heading?: string;
  /** Tab categories containing a label and their cards */
  tabs: TabCategory[];
  /** Initially active tab ID (defaults to tabs[0].id) */
  defaultTabId?: string;
  /** Accessible label for the tablist */
  ariaLabel?: string;
  /** Optional wrapper class override */
  className?: string;
  /** Optional callback fired when tab selection changes */
  onTabChange?: (tabId: string) => void;
}

export function TabbedIconCards({
  heading,
  tabs,
  defaultTabId,
  ariaLabel,
  className = "",
  onTabChange,
}: TabbedIconCardsProps) {
  const initialTabId =
    (defaultTabId && tabs.some((tab) => tab.id === defaultTabId)
      ? defaultTabId
      : tabs[0]?.id) ?? "";

  const [activeTabId, setActiveTabId] = useState(initialTabId);
  const tabListRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeIndex = tabs.findIndex((tab) => tab.id === activeTabId);
  const activeTab = tabs[activeIndex] ?? tabs[0];

  const updateIndicatorVars = useCallback(() => {
    const btn0 = tabRefs.current[0];
    const btn1 = tabRefs.current[1];
    if (tabListRef.current && btn0 && btn1) {
      tabListRef.current.style.setProperty(
        "--tab-1-width",
        `${btn0.offsetWidth}px`
      );
      tabListRef.current.style.setProperty(
        "--tab-2-offset",
        `${btn1.offsetLeft}px`
      );
      tabListRef.current.style.setProperty(
        "--tab-2-width",
        `${btn1.offsetWidth}px`
      );
    }
  }, []);

  useLayoutEffect(() => {
    updateIndicatorVars();
    const btn0 = tabRefs.current[0];
    const btn1 = tabRefs.current[1];
    if (!btn0 || !btn1) return;

    const observer = new ResizeObserver(updateIndicatorVars);
    observer.observe(btn0);
    observer.observe(btn1);
    window.addEventListener("resize", updateIndicatorVars);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateIndicatorVars);
    };
  }, [updateIndicatorVars]);

  function activateTab(tabId: string, index: number, shouldFocus = false) {
    setActiveTabId(tabId);
    onTabChange?.(tabId);
    if (shouldFocus) {
      tabRefs.current[index]?.focus({ preventScroll: true });
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    const lastIndex = tabs.length - 1;

    switch (event.key) {
      case "ArrowRight": {
        event.preventDefault();
        const nextIndex = index === lastIndex ? 0 : index + 1;
        activateTab(tabs[nextIndex].id, nextIndex, true);
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        const prevIndex = index === 0 ? lastIndex : index - 1;
        activateTab(tabs[prevIndex].id, prevIndex, true);
        break;
      }
      case "Home": {
        event.preventDefault();
        activateTab(tabs[0].id, 0, true);
        break;
      }
      case "End": {
        event.preventDefault();
        activateTab(tabs[lastIndex].id, lastIndex, true);
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        activateTab(tabs[index].id, index, true);
        break;
      }
      default:
        break;
    }
  }

  if (!activeTab) {
    return null;
  }

  const combinedSectionClass = className
    ? `${styles.section} ${className}`
    : styles.section;

  const headingId = heading ? `tabbed-icon-cards-heading` : undefined;
  const sectionAriaLabel = heading
    ? `${heading} - Tab Panel`
    : (ariaLabel || "Service Categories - Tab Panel");

  return (
    <section
      className={combinedSectionClass}
      aria-label={sectionAriaLabel}
    >
      <div className={styles.container}>
        {heading ? (
          <Heading id={headingId} level="h3" className={styles.heading}>
            {heading}
          </Heading>
        ) : null}

        <div className={styles.tabListWrapper}>
          <div
            ref={tabListRef}
            role="tablist"
            aria-label={ariaLabel || heading || "Service Categories"}
            className={styles.tabList}
          >
            {tabs.map((tab, index) => {
              const isActive = tab.id === activeTabId;
              const tabButtonClass = isActive
                ? `${styles.tabButton} ${styles.tabButtonActive}`
                : `${styles.tabButton} ${styles.tabButtonInactive}`;

              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-controls={`tabpanel-${tab.id}`}
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  className={tabButtonClass}
                  onClick={(event) => {
                    event.preventDefault();
                    activateTab(tab.id, index, false);
                  }}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                >
                  {tab.icon ? (
                    <span className={styles.tabIcon} aria-hidden="true">
                      {tab.icon}
                    </span>
                  ) : null}
                  <Text as="span" variant="subhead" weight="bold" color="inherit">
                    {tab.label}
                  </Text>
                </button>
              );
            })}
            <span aria-hidden="true" className={styles.activeIndicator} />
          </div>
        </div>

        <div
          role="tabpanel"
          id={`tabpanel-${activeTab.id}`}
          aria-labelledby={`tab-${activeTab.id}`}
          tabIndex={0}
          className={styles.panel}
        >
          <ul className={styles.cardGrid}>
            {activeTab.cards.map((card) => (
              <li key={card.id}>
                <QuickLinkSimple
                  title={card.title}
                  href={card.href}
                  icon={card.icon}
                  variant={card.variant ?? "default"}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

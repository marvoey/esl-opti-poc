import { useState, useRef, KeyboardEvent } from "react";
import type { VerticalSelectorTabItemData } from "./VerticalSelectorFeatureCard";

interface UseVerticalTabNavigationProps {
  tabs: VerticalSelectorTabItemData[];
  defaultActiveId?: string;
}

export function useVerticalTabNavigation({
  tabs,
  defaultActiveId,
}: UseVerticalTabNavigationProps) {
  const tablistRef = useRef<HTMLDivElement>(null);
  const initialTabId = defaultActiveId ?? (tabs.length > 0 ? tabs[0].id : "");
  const [activeTabId, setActiveTabId] = useState<string>(initialTabId);

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

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

  return {
    tablistRef,
    activeTabId,
    setActiveTabId,
    activeTab,
    handleKeyDown,
  };
}

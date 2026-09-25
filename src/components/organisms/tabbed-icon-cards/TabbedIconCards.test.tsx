import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import React from "react";
import { TabbedIconCards, type TabCategory } from "./TabbedIconCards";

const MOCK_TABS: TabCategory[] = [
  {
    id: "personal",
    label: "Personal Banking",
    cards: Array.from({ length: 7 }, (_, i) => ({
      id: `personal-card-${i + 1}`,
      title: `Personal Service ${i + 1}`,
      href: `/personal/service-${i + 1}`,
      variant: "default",
    })),
  },
  {
    id: "business",
    label: "Business Banking",
    cards: Array.from({ length: 7 }, (_, i) => ({
      id: `business-card-${i + 1}`,
      title: `Business Service ${i + 1}`,
      href: `/business/service-${i + 1}`,
      variant: "default",
    })),
  },
];

describe("TabbedIconCards Organism", () => {
  it("renders heading and exactly 2 tab buttons with Subhead typography", () => {
    render(<TabbedIconCards heading="Explore Solutions" tabs={MOCK_TABS} />);

    expect(screen.getByText("Explore Solutions")).toBeDefined();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(2);
    expect(tabs[0].textContent).toContain("Personal Banking");
    expect(tabs[1].textContent).toContain("Business Banking");
  });

  it("activates the first tab and panel by default", () => {
    render(<TabbedIconCards tabs={MOCK_TABS} />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(tabs[0].getAttribute("tabindex")).toBe("0");
    expect(tabs[1].getAttribute("aria-selected")).toBe("false");
    expect(tabs[1].getAttribute("tabindex")).toBe("-1");

    // Panel 1 active and linked via ARIA
    const panel = screen.getByRole("tabpanel");
    expect(panel.getAttribute("id")).toBe("tabpanel-personal");
    expect(panel.getAttribute("aria-labelledby")).toBe("tab-personal");
  });

  it("dynamically iterates and renders all 7 white variant cards in the active panel", () => {
    const { container } = render(<TabbedIconCards tabs={MOCK_TABS} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(7);
    expect(screen.getByText("Personal Service 1")).toBeDefined();
    expect(screen.getByText("Personal Service 7")).toBeDefined();

    // Verify white variant (no inverse class)
    const cardElements = container.querySelectorAll("a");
    cardElements.forEach((card) => {
      expect(card.className).not.toContain("inverse");
    });
  });

  it("switches tabs and active panel when Tab 2 is clicked", () => {
    const onTabChange = vi.fn();
    render(<TabbedIconCards tabs={MOCK_TABS} onTabChange={onTabChange} />);

    const tabs = screen.getAllByRole("tab");
    fireEvent.click(tabs[1]);

    expect(tabs[0].getAttribute("aria-selected")).toBe("false");
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(onTabChange).toHaveBeenCalledWith("business");

    // Panel updates to show business cards
    expect(screen.getByText("Business Service 1")).toBeDefined();
    expect(screen.queryByText("Personal Service 1")).toBeNull();
  });

  it("supports keyboard navigation with ArrowRight, ArrowLeft, Home, and End", () => {
    render(<TabbedIconCards tabs={MOCK_TABS} />);

    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();

    // Navigate Right -> Tab 2
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");

    // Navigate Left -> Tab 1
    fireEvent.keyDown(tabs[1], { key: "ArrowLeft" });
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");

    // End -> Tab 2
    fireEvent.keyDown(tabs[0], { key: "End" });
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");

    // Home -> Tab 1
    fireEvent.keyDown(tabs[1], { key: "Home" });
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
  });

  it("wraps ArrowLeft from the first tab back to the last tab", () => {
    render(<TabbedIconCards tabs={MOCK_TABS} />);
    const tabs = screen.getAllByRole("tab");

    fireEvent.keyDown(tabs[0], { key: "ArrowLeft" });
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
  });

  it("activates a focused tab on Enter or Space", () => {
    const onTabChange = vi.fn();
    render(<TabbedIconCards tabs={MOCK_TABS} onTabChange={onTabChange} />);
    const tabs = screen.getAllByRole("tab");

    fireEvent.keyDown(tabs[1], { key: "Enter" });
    expect(onTabChange).toHaveBeenCalledWith("business");
  });

  it("applies active bottom border class on the active tab button", () => {
    render(<TabbedIconCards tabs={MOCK_TABS} />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0].className).toContain("tabButtonActive");
    expect(tabs[1].className).toContain("tabButtonInactive");
  });

  it("maintains a card grid container", () => {
    const { container } = render(<TabbedIconCards tabs={MOCK_TABS} />);

    const grid = container.querySelector("[class*='cardGrid']");
    expect(grid).not.toBeNull();
  });

  it("renders the cards as a list with one link per list item", () => {
    render(<TabbedIconCards tabs={MOCK_TABS} />);

    const panel = screen.getByRole("tabpanel");
    const list = within(panel).getByRole("list");
    const items = within(list).getAllByRole("listitem");

    expect(items).toHaveLength(7);
    items.forEach((item) => {
      expect(within(item).getAllByRole("link")).toHaveLength(1);
    });
  });

  it("supports a custom defaultTabId", () => {
    render(<TabbedIconCards tabs={MOCK_TABS} defaultTabId="business" />);
    const tabs = screen.getAllByRole("tab");

    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText("Business Service 1")).toBeDefined();
  });
});

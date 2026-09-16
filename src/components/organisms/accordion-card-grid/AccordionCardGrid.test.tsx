import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { AccordionCardGrid, type AccordionCardItem } from "./AccordionCardGrid";

const MOCK_ITEMS: AccordionCardItem[] = [
  {
    id: "term-1",
    term: "APY vs. APR",
    definition:
      "APY is what your money can earn in a year, including compounding. APR is the yearly cost of borrowing.",
  },
  {
    id: "term-2",
    term: "Overdraft",
    definition:
      "When a transaction is approved even though your account doesn't have enough to cover it.",
  },
  {
    id: "term-3",
    term: "Membership Share",
    definition:
      "The one-time $1 deposit that makes you an owner of the credit union, not just a customer.",
  },
];

describe("AccordionCardGrid Organism", () => {
  it("renders null when items is empty", () => {
    const { container } = render(<AccordionCardGrid items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders eyebrow, heading, and description", () => {
    render(
      <AccordionCardGrid
        eyebrow="In plain terms"
        title="A few words, defined."
        description="Banking has its own vocabulary."
        items={MOCK_ITEMS}
      />
    );

    expect(screen.getByText("In plain terms")).toBeDefined();
    expect(
      screen.getByRole("heading", { name: "A few words, defined." })
    ).toBeDefined();
    expect(screen.getByText("Banking has its own vocabulary.")).toBeDefined();
  });

  it("renders one trigger button per item, all collapsed by default", () => {
    render(<AccordionCardGrid items={MOCK_ITEMS} />);

    const triggers = screen.getAllByRole("button");
    expect(triggers).toHaveLength(MOCK_ITEMS.length);

    MOCK_ITEMS.forEach((item, index) => {
      expect(triggers[index].textContent).toContain(item.term);
      expect(triggers[index].getAttribute("aria-expanded")).toBe("false");
    });
  });

  it("expands an item's panel and reveals its definition when its trigger is clicked", () => {
    render(<AccordionCardGrid items={MOCK_ITEMS} />);

    const triggers = screen.getAllByRole("button");
    fireEvent.click(triggers[0]);

    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");

    const panelId = triggers[0].getAttribute("aria-controls");
    const panel = document.getElementById(panelId as string);
    expect(panel?.getAttribute("aria-hidden")).toBe("false");
    expect(screen.getByText(MOCK_ITEMS[0].definition)).toBeDefined();
  });

  it("keeps the first card expanded when a second card is expanded (no single-expand behavior)", () => {
    render(<AccordionCardGrid items={MOCK_ITEMS} />);

    const triggers = screen.getAllByRole("button");
    fireEvent.click(triggers[0]);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(triggers[1]);

    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("true");

    const expandedCount = triggers.filter(
      (trigger) => trigger.getAttribute("aria-expanded") === "true"
    ).length;
    expect(expandedCount).toBe(2);
  });
});

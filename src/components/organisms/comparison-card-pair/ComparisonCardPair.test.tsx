import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComparisonCardPair } from "./ComparisonCardPair";

describe("ComparisonCardPair", () => {
  it("renders section with accessible heading and landmark", () => {
    render(<ComparisonCardPair />);
    const section = screen.getByRole("region", {
      name: /Find the right checking account for your needs/i,
    });
    expect(section).toBeDefined();

    expect(screen.getByText("COMPARE OPTIONS")).toBeDefined();
    expect(
      screen.getByText("Find the right checking account for your needs.")
    ).toBeDefined();
  });

  it("renders cards inside an unordered list with role='list' and li elements", () => {
    const { container } = render(<ComparisonCardPair />);

    const list = container.querySelector("ul[class*='cardsGrid']");
    expect(list).not.toBeNull();
    expect(list?.getAttribute("role")).toBe("list");

    const items = list?.querySelectorAll(":scope > li[class*='cardItem']");
    expect(items?.length).toBe(2);
  });

  it("renders two comparison cards with correct details", () => {
    render(<ComparisonCardPair />);

    // Check headings for both cards
    const card1Heading = screen.getByRole("heading", {
      level: 3,
      name: /Premier Checking/i,
    });
    const card2Heading = screen.getByRole("heading", {
      level: 3,
      name: /Essential Checking/i,
    });
    expect(card1Heading).toBeDefined();
    expect(card2Heading).toBeDefined();

    // Check Taxonomy Dark Badges
    expect(screen.getByText("Most Popular")).toBeDefined();
    expect(screen.getByText("Simple Banking")).toBeDefined();

    // Check CTAs
    const cta1 = screen.getByRole("link", { name: /Open Premier Checking/i });
    const cta2 = screen.getByRole("link", { name: /Open Essential Checking/i });
    expect(cta1).toBeDefined();
    expect(cta2).toBeDefined();
    expect(cta1.getAttribute("href")).toBe("/checking/premier");
    expect(cta2.getAttribute("href")).toBe("/checking/essential");
  });

  it("renders 3 feature items per card with correct structure", () => {
    const { container } = render(<ComparisonCardPair />);

    const lists = container.querySelectorAll("ul[class*='featureList']");
    expect(lists.length).toBe(2);

    lists.forEach((list) => {
      const items = list.querySelectorAll("li");
      expect(items.length).toBe(3);
    });

    // Check feature texts
    expect(
      screen.getByText("Free nationwide ATM withdrawals & fee rebates")
    ).toBeDefined();
    expect(
      screen.getByText("Contactless Visa® debit card with instant alerts")
    ).toBeDefined();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ProductCardsRowVariant2 } from "./ProductCardsRowVariant2";
import { DEFAULT_PRODUCT_CARDS_ROW_VARIANT_2_PROPS } from "./productCardsRowVariant2Data";

const items = [
  {
    id: "a",
    icon: "credit-card" as const,
    title: "ESL Visa® Debit Card",
    description: "Tap, swipe, or add it to your digital wallet.",
    ctaText: "About the debit card",
    href: "/personal/checking/debit-card",
  },
  {
    id: "b",
    icon: "piggy-bank" as const,
    title: "Direct Deposit",
    description: "Have your paycheck land in your account automatically.",
    ctaText: "Set up direct deposit",
    href: "/personal/checking/direct-deposit",
  },
];

describe("ProductCardsRowVariant2 Organism", () => {
  it("renders nothing when there are no items", () => {
    const { container } = render(<ProductCardsRowVariant2 items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders eyebrow, heading, and description", () => {
    render(
      <ProductCardsRowVariant2
        id="account-tools"
        eyebrow="WORKS WITH YOUR ACCOUNT"
        title="The everyday tools that come with it."
        description="Whichever account you choose, these come along."
        items={items}
      />
    );

    expect(screen.getByText("WORKS WITH YOUR ACCOUNT")).toBeDefined();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "The everyday tools that come with it.",
      })
    ).toBeDefined();
    expect(
      screen.getByText("Whichever account you choose, these come along.")
    ).toBeDefined();
  });

  it("renders one IconContentCard link per item with title, description, ctaText, and href", () => {
    render(<ProductCardsRowVariant2 items={items} />);

    items.forEach((item) => {
      expect(screen.getByText(item.title)).toBeDefined();
      expect(screen.getByText(item.description)).toBeDefined();
      expect(screen.getByText(item.ctaText)).toBeDefined();

      const link = screen.getByText(item.title).closest("a");
      expect(link).not.toBeNull();
      expect(link?.getAttribute("href")).toBe(item.href);
    });
  });

  it("renders exactly 3 cards with the default data", () => {
    render(<ProductCardsRowVariant2 {...DEFAULT_PRODUCT_CARDS_ROW_VARIANT_2_PROPS} />);

    const links = screen.getAllByRole("link");
    expect(links.length).toBe(3);
  });
});

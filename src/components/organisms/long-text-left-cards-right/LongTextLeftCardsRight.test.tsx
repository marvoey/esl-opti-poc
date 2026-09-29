import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import React from "react";
import { LongTextLeftCardsRight } from "./LongTextLeftCardsRight";
import { CardIcon } from "./longTextLeftCardsRightIcons";
import { LONG_TEXT_LEFT_CARDS_RIGHT_ICON_NAMES } from "./longTextLeftCardsRightIconNames";
import { DEFAULT_LONG_TEXT_LEFT_CARDS_RIGHT_PROPS } from "./longTextLeftCardsRightData";

const items = [
  {
    id: "a",
    icon: "gauge" as const,
    eyebrow: "Tool · 5 min",
    title: "Homebuying readiness check",
    description: "Twelve questions, and an honest read.",
    href: "/tools/readiness",
  },
  {
    id: "b",
    icon: "house-plus" as const,
    eyebrow: "Article · 6 min",
    title: "What lenders look at",
    href: "https://example.com/lenders",
    target: "_blank",
  },
];

const promo = {
  eyebrow: "Something at ESL that helps here",
  heading: "Get pre-approved before you shop",
  description: "A pre-approval puts a real number on your range.",
  cta: { label: "How pre-approval works", href: "/pre-approval" },
};

describe("LongTextLeftCardsRight Organism", () => {
  it("renders nothing when there is no content", () => {
    const { container } = render(<LongTextLeftCardsRight items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the title as an h2 that labels the section, and the body", () => {
    render(
      <LongTextLeftCardsRight
        id="ready"
        title="Am I actually ready to buy?"
        body={<p>Readiness is three things.</p>}
        items={items}
      />
    );

    const heading = screen.getByRole("heading", { level: 2, name: "Am I actually ready to buy?" });
    expect(heading.id).toBe("ready-heading");
    expect(screen.getByRole("region", { name: "Am I actually ready to buy?" })).toBeDefined();
    expect(screen.getByText("Readiness is three things.").tagName).toBe("P");
  });

  it("renders the promo box with badge, h3 heading, description and link", () => {
    render(<LongTextLeftCardsRight title="Title" promo={promo} items={[]} />);

    expect(screen.getByText(promo.eyebrow)).toBeDefined();
    expect(screen.getByRole("heading", { level: 3, name: promo.heading })).toBeDefined();
    expect(screen.getByText(promo.description)).toBeDefined();
    expect(screen.getByRole("link", { name: promo.cta.label }).getAttribute("href")).toBe("/pre-approval");
  });

  it("omits the promo box when it has no heading, and its optional slots when empty", () => {
    const { rerender } = render(
      <LongTextLeftCardsRight title="Title" promo={{ eyebrow: "Badge only" }} items={items} />
    );
    expect(screen.queryByText("Badge only")).toBeNull();

    rerender(<LongTextLeftCardsRight title="Title" promo={{ heading: "Heading only" }} items={items} />);
    expect(screen.getByRole("heading", { level: 3, name: "Heading only" })).toBeDefined();
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("renders one list item per card with an h3 title linked to its href", () => {
    render(<LongTextLeftCardsRight title="Title" items={items} />);

    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);

    const first = screen.getByRole("link", { name: "Homebuying readiness check" });
    expect(first.getAttribute("href")).toBe("/tools/readiness");
    expect(first.closest("h3")).not.toBeNull();
    expect(screen.getByText("Tool · 5 min")).toBeDefined();
    expect(screen.getByText("Twelve questions, and an honest read.")).toBeDefined();

    const external = screen.getByRole("link", { name: "What lenders look at" });
    expect(external.getAttribute("target")).toBe("_blank");
    expect(external.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders a card without href as a plain h3 title", () => {
    render(<LongTextLeftCardsRight title="Title" items={[{ id: "c", title: "Documents to gather" }]} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByRole("heading", { level: 3, name: "Documents to gather" })).toBeDefined();
  });

  it("omits the card list when there are no cards", () => {
    render(<LongTextLeftCardsRight title="Title" items={[]} />);
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("renders decorative icons hidden from assistive technology, and omits missing icons", () => {
    const { container } = render(
      <LongTextLeftCardsRight title="Title" items={[...items, { id: "d", title: "No icon" }]} />
    );
    const svgs = container.querySelectorAll("li svg");
    // two card icons (the no-icon card renders none)
    expect(svgs).toHaveLength(2);
    svgs.forEach((svg) => expect(svg.getAttribute("aria-hidden")).toBe("true"));
  });

  it("renders every supported icon name", () => {
    LONG_TEXT_LEFT_CARDS_RIGHT_ICON_NAMES.forEach((name) => {
      const { container, unmount } = render(<CardIcon name={name} />);
      expect(container.querySelector("svg")).not.toBeNull();
      unmount();
    });
  });

  it("renders the default data: title, promo and three cards", () => {
    render(<LongTextLeftCardsRight {...DEFAULT_LONG_TEXT_LEFT_CARDS_RIGHT_PROPS} />);

    expect(screen.getByRole("heading", { level: 2 })).toBeDefined();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    // promo link + three card links
    expect(screen.getAllByRole("link")).toHaveLength(4);
  });
});

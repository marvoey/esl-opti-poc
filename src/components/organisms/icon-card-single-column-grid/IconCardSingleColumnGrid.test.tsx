import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import React from "react";
import { IconCardSingleColumnGrid } from "./IconCardSingleColumnGrid";
import { DEFAULT_ICON_CARD_SINGLE_COLUMN_GRID_PROPS } from "./iconCardSingleColumnGridData";

const items = [
  {
    id: "a",
    icon: "piggy-bank" as const,
    title: "Checking Accounts",
    href: "/personal/checking",
    description: (
      <>
        <strong>Money you need today.</strong> Free Checking has no monthly fee.
      </>
    ),
  },
  {
    id: "b",
    icon: "vault" as const,
    title: "Savings Accounts",
    href: "https://example.com/savings",
    target: "_blank",
    description: "Opens with a dollar and stays reachable.",
  },
];

describe("IconCardSingleColumnGrid Organism", () => {
  it("renders nothing when there are no items", () => {
    const { container } = render(<IconCardSingleColumnGrid title="Heading" items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the section title as an h2 that labels the section", () => {
    render(<IconCardSingleColumnGrid id="decisions" title="Three decisions" items={items} />);

    const heading = screen.getByRole("heading", { level: 2, name: "Three decisions" });
    expect(heading.id).toBe("decisions-heading");
    expect(screen.getByRole("region", { name: "Three decisions" })).toBeDefined();
  });

  it("omits the heading when no title is given", () => {
    render(<IconCardSingleColumnGrid items={items} />);
    expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
  });

  it("renders one list item per row with an h3 title", () => {
    render(<IconCardSingleColumnGrid title="Three decisions" items={items} />);

    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Checking Accounts",
      "Savings Accounts(opens in a new tab)",
    ]);
  });

  it("links each row title to its href and opens external targets safely", () => {
    render(<IconCardSingleColumnGrid items={items} />);

    const internal = screen.getByRole("link", { name: /^Checking Accounts/ });
    expect(internal.getAttribute("href")).toBe("/personal/checking");
    expect(internal.getAttribute("target")).toBeNull();

    const external = screen.getByRole("link", { name: /^Savings Accounts/ });
    expect(external.getAttribute("target")).toBe("_blank");
    expect(external.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders the title as plain text when a row has no href", () => {
    render(<IconCardSingleColumnGrid items={[{ id: "c", title: "IRAs", description: "Money for retirement." }]} />);

    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByRole("heading", { level: 3, name: "IRAs" })).toBeDefined();
  });

  it("renders rich description content, including the bold lead", () => {
    render(<IconCardSingleColumnGrid items={items} />);

    expect(screen.getByText("Money you need today.").tagName).toBe("STRONG");
    expect(screen.getByText("Opens with a dollar and stays reachable.")).toBeDefined();
  });

  it("omits the description slot when a row has none", () => {
    const { container } = render(
      <IconCardSingleColumnGrid items={[{ id: "c", title: "IRAs", href: "/iras" }]} />
    );
    expect(container.querySelector("li")?.children).toHaveLength(1);
  });

  it("hides decorative icons from assistive technology", () => {
    const { container } = render(<IconCardSingleColumnGrid items={items} />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
    svgs.forEach((svg) => expect(svg.getAttribute("aria-hidden")).toBe("true"));
  });

  it("renders the four rows of the default data", () => {
    render(<IconCardSingleColumnGrid {...DEFAULT_ICON_CARD_SINGLE_COLUMN_GRID_PROPS} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getAllByRole("link")).toHaveLength(4);
  });
});

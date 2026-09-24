import { describe, it, expect } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import React from "react";
import { FilterableProductCardGrid } from "./FilterableProductCardGrid";
import { DEFAULT_FILTERABLE_PRODUCT_CARD_GRID_PROPS } from "./filterableProductCardGridData";

const items = [
  {
    id: "a",
    title: "Daily Dividend",
    description: "No minimum balance.",
    rate: "X.XX% APY",
    filterTags: ["Keeping it simple"],
    href: "/savings/daily-dividend",
    linkLabel: "See Details",
  },
  {
    id: "b",
    title: "Money Maker",
    description: "A tiered rate.",
    rate: "Y.YY% APY",
    filterTags: ["  earning the most  ", "Reaching my money easily"],
    href: "https://example.com/money-maker",
    linkLabel: "See Details",
    target: "_blank",
  },
  {
    id: "c",
    title: "Health Savings Account",
    filterTags: ["Saving for medical costs"],
  },
];

const filters = ["Keeping it simple", "Earning the most", "Reaching my money easily", "Saving for medical costs"];

function cardTitles() {
  return screen.queryAllByRole("heading", { level: 3 }).map((h) => h.textContent);
}

describe("FilterableProductCardGrid Organism", () => {
  it("renders nothing when there are no cards", () => {
    const { container } = render(<FilterableProductCardGrid title="Title" items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders eyebrow, h2 title labelling the section, and description", () => {
    render(
      <FilterableProductCardGrid
        id="save"
        eyebrow="FIND YOUR FIT"
        title="Six ways to save."
        description="Pick what matters most."
        items={items}
      />
    );

    expect(screen.getByText("FIND YOUR FIT")).toBeDefined();
    const heading = screen.getByRole("heading", { level: 2, name: "Six ways to save." });
    expect(screen.getByRole("region", { name: "Six ways to save." })).toBeDefined();
    expect(heading.id).toBeTruthy();
    expect(screen.getByText("Pick what matters most.")).toBeDefined();
  });

  it("renders every card with h3 title, description, rate and link", () => {
    render(<FilterableProductCardGrid title="Title" items={items} />);

    expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(3);
    expect(cardTitles()).toEqual(["Daily Dividend", "Money Maker", "Health Savings Account"]);
    expect(screen.getByText("No minimum balance.")).toBeDefined();
    expect(screen.getByText("X.XX% APY")).toBeDefined();

    const links = screen.getAllByRole("link", { name: /^See Details/ });
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute("href")).toBe("/savings/daily-dividend");
    expect(links[1].getAttribute("target")).toBe("_blank");
    expect(links[1].getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("omits optional card slots when empty", () => {
    render(<FilterableProductCardGrid items={[{ id: "x", title: "Only title" }]} />);
    const card = screen.getByRole("listitem");
    expect(within(card).queryByRole("link")).toBeNull();
    expect(card.querySelectorAll("p")).toHaveLength(0);
  });

  it("renders no chip group when there are no filters", () => {
    render(<FilterableProductCardGrid title="Title" allFilterLabel="All accounts" items={items} />);
    expect(screen.queryByRole("group")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders the All chip selected first, then one chip per filter, labelled by the title", () => {
    render(
      <FilterableProductCardGrid title="Six ways" allFilterLabel="All accounts" filters={filters} items={items} />
    );

    const group = screen.getByRole("group", { name: "Six ways" });
    const chips = within(group).getAllByRole("button");
    expect(chips.map((c) => c.textContent)).toEqual(["All accounts", ...filters]);
    expect(chips[0].getAttribute("aria-pressed")).toBe("true");
    chips.slice(1).forEach((c) => expect(c.getAttribute("aria-pressed")).toBe("false"));

    const gridId = chips[0].getAttribute("aria-controls");
    expect(gridId).toBeTruthy();
    expect(screen.getByRole("list").id).toBe(gridId);
    expect(cardTitles()).toHaveLength(3);
  });

  it("filters cards by tag, ignoring case and surrounding spaces, and returns to all", () => {
    render(
      <FilterableProductCardGrid title="Six ways" allFilterLabel="All accounts" filters={filters} items={items} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Earning the most" }));
    expect(screen.getByRole("button", { name: "Earning the most" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "All accounts" }).getAttribute("aria-pressed")).toBe("false");
    expect(cardTitles()).toEqual(["Money Maker"]);

    fireEvent.click(screen.getByRole("button", { name: "Saving for medical costs" }));
    expect(cardTitles()).toEqual(["Health Savings Account"]);

    fireEvent.click(screen.getByRole("button", { name: "All accounts" }));
    expect(cardTitles()).toHaveLength(3);
  });

  it("without an All label, starts unfiltered and toggles a chip off again", () => {
    render(<FilterableProductCardGrid title="Six ways" filters={filters} items={items} />);

    expect(screen.getAllByRole("button")).toHaveLength(filters.length);
    expect(cardTitles()).toHaveLength(3);

    const chip = screen.getByRole("button", { name: "Keeping it simple" });
    fireEvent.click(chip);
    expect(cardTitles()).toEqual(["Daily Dividend"]);
    fireEvent.click(chip);
    expect(chip.getAttribute("aria-pressed")).toBe("false");
    expect(cardTitles()).toHaveLength(3);
  });

  it("drops empty and duplicate filter labels", () => {
    render(
      <FilterableProductCardGrid
        title="Six ways"
        filters={["Keeping it simple", "  ", "keeping it simple ", "Earning the most"]}
        items={items}
      />
    );
    expect(screen.getAllByRole("button").map((b) => b.textContent)).toEqual([
      "Keeping it simple",
      "Earning the most",
    ]);
  });

  it("shows the no-results text only when a filter matches nothing and the text is set", () => {
    const { rerender } = render(
      <FilterableProductCardGrid title="T" filters={["Unused filter"]} items={items} noResultsText="No accounts match." />
    );
    fireEvent.click(screen.getByRole("button", { name: "Unused filter" }));
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getByText("No accounts match.")).toBeDefined();

    rerender(<FilterableProductCardGrid title="T" filters={["Unused filter"]} items={items} />);
    expect(screen.queryByText("No accounts match.")).toBeNull();
  });

  it("renders the default data: six cards and six chips including All", () => {
    render(<FilterableProductCardGrid {...DEFAULT_FILTERABLE_PRODUCT_CARD_GRID_PROPS} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(6);
    expect(screen.getAllByRole("button")).toHaveLength(6);
    expect(screen.getAllByRole("link")).toHaveLength(6);
  });
});

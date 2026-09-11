import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MediaCardGrid } from "./MediaCardGrid";
import { DEFAULT_MEDIA_CARD_GRID_ITEMS } from "./mediaCardGridData";

describe("MediaCardGrid Organism", () => {
  it("renders default 3-card layout with header elements", () => {
    const { container } = render(<MediaCardGrid />);

    expect(screen.getByText("WHAT'S NEW RIGHT NOW")).toBeDefined();
    expect(
      screen.getByRole("heading", { level: 2, name: "A few offers worth a look." })
    ).toBeDefined();

    expect(screen.getByText("X.XX% APR on new auto loans")).toBeDefined();
    expect(screen.getByText("Earn X.XX% APY on a certificate")).toBeDefined();
    expect(screen.getByText("$XXX when you open checking")).toBeDefined();

    const grid = container.querySelector(`.${stylesGridClass(container, "grid3")}`);
    expect(grid).toBeDefined();
  });

  it("renders 2-card layout applying grid2 modifier class", () => {
    const twoCards = DEFAULT_MEDIA_CARD_GRID_ITEMS.slice(0, 2);
    const { container } = render(<MediaCardGrid cards={twoCards} />);

    expect(screen.getByText("X.XX% APR on new auto loans")).toBeDefined();
    expect(screen.getByText("Earn X.XX% APY on a certificate")).toBeDefined();
    expect(screen.queryByText("$XXX when you open checking")).toBeNull();

    const grid = container.querySelector(`[class*="grid2"]`);
    expect(grid).not.toBeNull();
  });

  it("applies custom id and heading accessibility association", () => {
    const { container } = render(<MediaCardGrid id="special-offers" />);

    const section = container.querySelector("section#special-offers");
    expect(section).not.toBeNull();
    expect(section?.getAttribute("aria-labelledby")).toBe("special-offers-heading");
  });
});

function stylesGridClass(container: HTMLElement, pattern: string) {
  const el = container.querySelector(`[class*="${pattern}"]`);
  return el ? el.className.split(" ")[1] : pattern;
}

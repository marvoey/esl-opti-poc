import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ProductCardsRow } from "./ProductCardsRow";

const items = [
  { id: "a", title: "You keep a healthy balance", description: "Stay above the line and skip the fee." },
  { id: "b", title: "You want your money to earn", description: "Dividends compound monthly." },
];

describe("ProductCardsRow Organism", () => {
  it("renders nothing when there are no items", () => {
    const { container } = render(<ProductCardsRow items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders eyebrow, heading, and description", () => {
    render(
      <ProductCardsRow
        id="product-fit"
        eyebrow="IS THIS RIGHT FOR YOU?"
        title="An honest look at the fit"
        description="Premier isn't for everyone."
        items={items}
      />
    );

    expect(screen.getByText("IS THIS RIGHT FOR YOU?")).toBeDefined();
    expect(
      screen.getByRole("heading", { level: 2, name: "An honest look at the fit" })
    ).toBeDefined();
    expect(screen.getByText("Premier isn't for everyone.")).toBeDefined();
  });

  it("renders one card per item with title and description text", () => {
    render(<ProductCardsRow items={items} />);

    items.forEach((item) => {
      expect(screen.getByText(item.title)).toBeDefined();
      expect(screen.getByText(item.description)).toBeDefined();
    });
  });

  it("renders a circle-check icon per card", () => {
    render(<ProductCardsRow items={items} />);

    const icons = screen.getAllByTestId("circle-check");
    expect(icons.length).toBe(items.length);
  });
});

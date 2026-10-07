import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import React from "react";
import { ProductPathways } from "./ProductPathways";
import { PRODUCT_PATHWAYS_DATA } from "./productPathwaysData";

const rows = [
  {
    id: "a",
    icon: "piggy-bank" as const,
    title: "Open Checking",
    href: "/checking",
    description: (
      <>
        <strong>Money you need today.</strong> Free Checking has no monthly fee.
      </>
    ),
  },
  {
    id: "b",
    icon: "vault" as const,
    title: "Open Savings",
    href: "https://example.com/savings",
    target: "_blank",
    description: "Opens with a dollar and stays reachable.",
  },
];

describe("ProductPathways Organism", () => {
  it("renders nothing without a title or rows", () => {
    const { container: noRows } = render(<ProductPathways title="Manage" rows={[]} />);
    expect(noRows.firstChild).toBeNull();

    const { container: noTitle } = render(<ProductPathways title="" rows={rows} />);
    expect(noTitle.firstChild).toBeNull();
  });

  it("renders the title as an h2 that labels the section", () => {
    render(<ProductPathways id="manage" title="Manage" rows={rows} />);

    const heading = screen.getByRole("heading", { level: 2, name: "Manage" });
    expect(heading.id).toBe("manage-heading");
    expect(screen.getByRole("region", { name: "Manage" })).toBeDefined();
  });

  it("honours a custom heading level", () => {
    render(<ProductPathways title="Manage" headingLevel="h3" rows={rows} />);
    expect(screen.getByRole("heading", { level: 3, name: "Manage" })).toBeDefined();
  });

  it("renders the intro copy in the header and omits it when empty", () => {
    const { rerender } = render(
      <ProductPathways
        title="Manage"
        description={
          <>
            The deciding question: <strong>when?</strong>
          </>
        }
        rows={rows}
      />,
    );
    expect(screen.getByText("when?").tagName).toBe("STRONG");

    rerender(<ProductPathways title="Manage" rows={rows} />);
    expect(document.querySelector("[data-product-pathways-intro]")).toBeNull();
  });

  it("renders one list item per row with link and copy", () => {
    render(<ProductPathways title="Manage" rows={rows} />);

    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(2);

    const first = within(items[0]).getByRole("link", { name: /Open Checking/ });
    expect(first.getAttribute("href")).toBe("/checking");
    expect(within(items[0]).getByText("Money you need today.").tagName).toBe("STRONG");
    expect(within(items[1]).getByText("Opens with a dollar and stays reachable.")).toBeDefined();
  });

  it("opens external rows in a new tab safely", () => {
    render(<ProductPathways title="Manage" rows={rows} />);

    const link = screen.getByRole("link", { name: /Open Savings/ });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders the label without a link when the row has no href", () => {
    render(<ProductPathways title="Manage" rows={[{ id: "x", title: "Coming soon" }]} />);

    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("Coming soon")).toBeDefined();
  });

  it("hides the decorative icons from assistive technology", () => {
    const { container } = render(<ProductPathways title="Manage" rows={rows} />);

    const icons = container.querySelectorAll("li svg");
    expect(icons.length).toBeGreaterThanOrEqual(2);
    expect(icons[0].getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the fixture data", () => {
    render(<ProductPathways {...PRODUCT_PATHWAYS_DATA} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(PRODUCT_PATHWAYS_DATA.rows.length);
  });
});

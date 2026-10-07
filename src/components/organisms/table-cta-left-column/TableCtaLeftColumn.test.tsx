import React from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TableCtaLeftColumn } from "./TableCtaLeftColumn";
import { TABLE_CTA_LEFT_COLUMN_DATA as data } from "./tableCtaLeftColumnData";

describe("TableCtaLeftColumn", () => {
  it("renders a table with column headers, row headers and cells", () => {
    render(<TableCtaLeftColumn {...data} />);

    const table = screen.getByRole("table");
    const columnHeaders = within(table).getAllByRole("columnheader");
    expect(columnHeaders.map((th) => th.textContent)).toEqual([
      "Best right now",
      "Which product, and the catch",
    ]);

    const rowHeaders = within(table).getAllByRole("rowheader");
    expect(rowHeaders.map((th) => th.textContent)).toEqual(data.rows.map((row) => row.label));

    expect(within(table).getByRole("cell", { name: "Up to x.xx% APY — tiered" })).toBeDefined();
    expect(within(table).getByRole("cell", { name: "$1,000 for the higher tiers" })).toBeDefined();
  });

  it("renders one CTA link per column in the footer row", () => {
    render(<TableCtaLeftColumn {...data} />);

    const daily = screen.getByRole("link", { name: "Open Daily Dividend" });
    expect(daily.getAttribute("href")).toBe("/savings/daily-dividend");
    expect(screen.getByRole("link", { name: "Open Money Maker" }).getAttribute("href")).toBe(
      "/savings/money-maker"
    );
    expect(daily.closest("tfoot")).not.toBeNull();
  });

  it("opens external CTAs in a new tab", () => {
    render(
      <TableCtaLeftColumn
        {...data}
        columns={[
          { id: "a", title: "A", cta: { label: "Open A", href: "https://example.com", external: true } },
        ]}
        rows={[{ id: "r", label: "Row", values: ["1"] }]}
      />
    );
    const link = screen.getByRole("link", { name: "Open A" });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("omits the footer row when no column has a CTA", () => {
    const { container } = render(
      <TableCtaLeftColumn
        columns={data.columns.map(({ id, title }) => ({ id, title }))}
        rows={data.rows}
      />
    );
    expect(container.querySelector("tfoot")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("keeps the footer cell for a column without a CTA so the grid stays aligned", () => {
    const { container } = render(
      <TableCtaLeftColumn
        columns={[data.columns[0], { id: "plain", title: "Plain" }]}
        rows={data.rows}
      />
    );
    expect(container.querySelectorAll("tfoot td")).toHaveLength(3);
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("renders the caption and names the scroll region with it", () => {
    render(<TableCtaLeftColumn {...data} />);
    expect(screen.getByRole("table", { name: data.caption })).toBeDefined();
    expect(screen.getByRole("group", { name: data.caption })).toBeDefined();
  });

  it("omits caption, heading and corner label when not provided", () => {
    const { container } = render(<TableCtaLeftColumn columns={data.columns} rows={data.rows} />);
    expect(container.querySelector("caption")).toBeNull();
    expect(screen.queryByRole("heading")).toBeNull();
    expect(screen.getByRole("group").hasAttribute("aria-label")).toBe(false);
    expect(container.querySelector("thead td")?.textContent).toBe("");
  });

  it("renders the optional heading at the default h2 level and labels the section with it", () => {
    render(<TableCtaLeftColumn {...data} title="Compare savings" />);
    const heading = screen.getByRole("heading", { level: 2, name: "Compare savings" });
    expect(screen.getByRole("region", { name: "Compare savings" }).contains(heading)).toBe(true);
  });

  it("honours a custom heading level", () => {
    render(<TableCtaLeftColumn {...data} title="Compare savings" headingLevel="h3" />);
    expect(screen.getByRole("heading", { level: 3, name: "Compare savings" })).toBeDefined();
  });

  it("renders the row label column heading as a column header when provided", () => {
    render(<TableCtaLeftColumn {...data} rowLabelHeading="Feature" />);
    expect(screen.getAllByRole("columnheader")[0].textContent).toBe("Feature");
  });

  it("renders empty cells for missing values", () => {
    const { container } = render(
      <TableCtaLeftColumn columns={data.columns} rows={[{ id: "short", label: "Short", values: ["only one"] }]} />
    );
    const cells = container.querySelectorAll("tbody td");
    expect(cells).toHaveLength(2);
    expect(cells[1].textContent).toBe("");
  });

  it("tags each cell with its column id", () => {
    const { container } = render(<TableCtaLeftColumn {...data} />);
    expect(container.querySelectorAll('[data-table-column="money-maker"]')).toHaveLength(
      data.rows.length + 2
    );
  });
});

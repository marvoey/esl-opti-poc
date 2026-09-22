import React from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { CompareTable } from "./CompareTable";
import {
  DEFAULT_COMPARE_TABLE_DATA,
  COMPARE_TABLE_FULL_COMPARISON_HREF,
  type CompareTableData,
} from "./compareTableData";

const CUSTOM_DATA: CompareTableData = {
  eyebrow: "PICK YOUR PLAN",
  title: "Custom comparison title",
  description: "Custom comparison description sentence.",
  caption: "Custom Plan A compared with Custom Plan B, feature by feature",
  scrollRegionLabel: "Custom scrollable comparison table",
  columns: [
    {
      id: "custom-plan-a",
      name: "Custom Plan A",
      cta: { label: "Open Custom Plan A", href: "/custom/plan-a" },
    },
    {
      id: "custom-plan-b",
      name: "Custom Plan B",
      cta: { label: "Open Custom Plan B", href: "/custom/plan-b" },
    },
  ],
  rows: [
    {
      id: "custom-row-1",
      label: "Custom feature one",
      values: ["Custom value one A", "Custom value one B"],
    },
    {
      id: "custom-row-2",
      label: "Custom feature two",
      values: ["Custom value two A", "Custom value two B"],
    },
  ],
  fullComparisonLink: {
    label: "See the full comparison & all features",
    href: COMPARE_TABLE_FULL_COMPARISON_HREF,
  },
};

describe("CompareTable", () => {
  it("renders with no props using DEFAULT_COMPARE_TABLE_DATA", () => {
    render(<CompareTable />);

    const table = screen.getByRole("table", { name: /compared with/i });
    expect(table).toBeDefined();
  });

  it("renders every provided label and cell value when custom data is passed", () => {
    render(<CompareTable data={CUSTOM_DATA} />);

    expect(screen.getByText("Custom Plan A")).toBeDefined();
    expect(screen.getByText("Custom Plan B")).toBeDefined();
    expect(screen.getByText("Custom feature one")).toBeDefined();
    expect(screen.getByText("Custom feature two")).toBeDefined();
    expect(screen.getByText("Custom value one A")).toBeDefined();
    expect(screen.getByText("Custom value one B")).toBeDefined();
    expect(screen.getByText("Custom value two A")).toBeDefined();
    expect(screen.getByText("Custom value two B")).toBeDefined();
  });

  it("exposes the section as a labelled landmark with the default title", () => {
    render(<CompareTable />);

    const region = screen.getByRole("region", {
      name: /The differences that matter\./i,
    });
    expect(region).toBeDefined();
  });

  it("renders the title as a heading matching headingLevel", () => {
    render(<CompareTable />);

    const heading = screen.getByRole("heading", {
      level: 2,
      name: /The differences that matter\./i,
    });
    expect(heading).toBeDefined();
  });

  it("exposes exactly 2 columnheaders, one per product column", () => {
    render(<CompareTable />);

    const columnHeaders = screen.getAllByRole("columnheader");
    expect(columnHeaders).toHaveLength(2);
    expect(columnHeaders[0].textContent).toContain("Premier Checking");
    expect(columnHeaders[1].textContent).toContain("Essential Checking");
  });

  it("exposes one rowheader per feature row", () => {
    render(<CompareTable />);

    const rowHeaders = screen.getAllByRole("rowheader");
    expect(rowHeaders).toHaveLength(DEFAULT_COMPARE_TABLE_DATA.rows.length);
    expect(rowHeaders[0].textContent).toContain("Monthly maintenance fee");
  });

  it("renders cell values as plain text with no icon elements in the body", () => {
    const { container } = render(<CompareTable />);

    expect(screen.getByText("None")).toBeDefined();
    expect(
      screen.getByText("$10 — waived with a $1,000 average balance")
    ).toBeDefined();

    const tbody = container.querySelector("tbody");
    expect(tbody).not.toBeNull();
    expect(tbody!.querySelectorAll("svg").length).toBe(0);
  });

  it("renders exactly 2 footer CTA links, one per column, scoped to tfoot", () => {
    const { container } = render(<CompareTable />);

    const premierCta = screen.getByRole("link", {
      name: /Open Premier Checking/i,
    });
    const essentialCta = screen.getByRole("link", {
      name: /Open Essential Checking/i,
    });
    expect(premierCta.getAttribute("href")).toBe("/checking/premier");
    expect(essentialCta.getAttribute("href")).toBe("/checking/essential");

    const tfoot = container.querySelector("tfoot");
    expect(tfoot).not.toBeNull();
    const tfootLinks = within(tfoot as HTMLElement).getAllByRole("link");
    expect(tfootLinks).toHaveLength(2);
  });

  it("renders zero button elements — CTAs are anchors, not buttons", () => {
    render(<CompareTable />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("renders a full-comparison link with the placeholder href", () => {
    render(<CompareTable />);

    const link = screen.getByRole("link", { name: /full comparison/i });
    expect(link.getAttribute("href")).toBe(COMPARE_TABLE_FULL_COMPARISON_HREF);
  });

  it("renders no anchor or button inside the header region", () => {
    const { container } = render(<CompareTable />);

    const header = container.querySelector("header");
    expect(header).not.toBeNull();
    expect(header!.querySelectorAll("a, button").length).toBe(0);
  });

  it("degrades gracefully when optional header fields are omitted", () => {
    const dataWithoutOptionalFields: CompareTableData = {
      ...CUSTOM_DATA,
      eyebrow: undefined,
      description: undefined,
    };

    expect(() =>
      render(<CompareTable data={dataWithoutOptionalFields} />)
    ).not.toThrow();

    expect(screen.queryByText("PICK YOUR PLAN")).toBeNull();
    expect(
      screen.queryByText("Custom comparison description sentence.")
    ).toBeNull();
  });

  it("renders a focusable, named scroll region containing the table", () => {
    render(<CompareTable />);

    const group = screen.getByRole("group", { name: /scrollable/i });
    expect(group.getAttribute("tabindex")).toBe("0");

    group.focus();
    expect(document.activeElement).toBe(group);
  });

  it("emits a data-compare-column hook on every cell of a column, including the tfoot CTA cell", () => {
    const { container } = render(<CompareTable />);

    const premierCells = container.querySelectorAll(
      '[data-compare-column="premier-checking"]'
    );
    // 1 columnheader + 6 body cells + 1 tfoot CTA cell
    expect(premierCells).toHaveLength(DEFAULT_COMPARE_TABLE_DATA.rows.length + 2);

    const tfoot = container.querySelector("tfoot");
    const tfootPremierCell = tfoot?.querySelector(
      '[data-compare-column="premier-checking"]'
    );
    expect(tfootPremierCell).not.toBeNull();
  });

  it("keeps the focused CTA within a column ancestor carrying the highlight hook", () => {
    render(<CompareTable />);

    const premierCta = screen.getByRole("link", {
      name: /Open Premier Checking/i,
    });
    premierCta.focus();

    const columnAncestor = document.activeElement?.closest(
      "[data-compare-column]"
    );
    expect(columnAncestor).not.toBeNull();
    expect(columnAncestor!.getAttribute("data-compare-column")).toBe(
      "premier-checking"
    );
  });

  it("renders exactly one table with no viewport-conditional stacking markup", () => {
    const { container } = render(<CompareTable />);

    expect(container.querySelectorAll("table")).toHaveLength(1);
  });

  it("contains zero !important declarations in CompareTable.module.css", () => {
    const cssPath = join(import.meta.dirname, "CompareTable.module.css");
    const css = readFileSync(cssPath, "utf8");

    expect(css).not.toContain("!important");
  });
});

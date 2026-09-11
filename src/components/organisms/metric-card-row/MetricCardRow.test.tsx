import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MetricCardRow } from "./MetricCardRow";
import { DEFAULT_METRIC_CARD_ROW } from "./metricCardRowData";

describe("MetricCardRow Organism", () => {
  it("renders default content: eyebrow, title, description, CTA, and 3 rates cards", () => {
    render(<MetricCardRow {...DEFAULT_METRIC_CARD_ROW} />);

    // Header Content
    expect(screen.getByText("Competitive Rates")).toBeDefined();
    expect(screen.getByText("Rates that work for your goals.")).toBeDefined();
    expect(
      screen.getByText(
        "Explore high-yield savings, auto loans, and mortgages designed to help you keep more of what you earn."
      )
    ).toBeDefined();

    // CTA
    const cta = screen.getByRole("link", { name: /view all rates/i });
    expect(cta).toBeDefined();
    expect(cta.getAttribute("href")).toBe("/rates");

    // 3 Rates Cards
    expect(screen.getByText("Auto loans")).toBeDefined();
    expect(screen.getByText("Mortgages")).toBeDefined();
    expect(screen.getByText("High-Yield Savings")).toBeDefined();
    expect(screen.getByText("1.99")).toBeDefined();
    expect(screen.getByText("5.49")).toBeDefined();
    expect(screen.getByText("4.25")).toBeDefined();
  });

  it("renders custom title, description and cta", () => {
    render(
      <MetricCardRow
        title="Custom Rates Title"
        description="Custom rates description."
        cta={{ label: "Custom CTA", href: "/custom-rates" }}
      />
    );

    expect(screen.getByText("Custom Rates Title")).toBeDefined();
    expect(screen.getByText("Custom rates description.")).toBeDefined();
    expect(screen.getByRole("link", { name: /custom cta/i })).toBeDefined();
  });

  it("renders accessible landmark with aria-labelledby", () => {
    const { container } = render(
      <MetricCardRow id="test-metric-row" {...DEFAULT_METRIC_CARD_ROW} />
    );

    const section = container.querySelector("section");
    expect(section).toBeDefined();
    expect(section?.getAttribute("aria-labelledby")).toBe("test-metric-row-heading");
  });
});

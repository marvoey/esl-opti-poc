import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { RatesCard } from "./RatesCard";

describe("RatesCard Component", () => {
  it("renders default variant with category, rate, title, description, and CTA", () => {
    render(
      <RatesCard
        category="Getting on the road"
        rate="1.99"
        rateUnit="%"
        rateLabel="APR"
        title="Auto loans"
        description="A loan that fits your life, and help finding the right option."
        ctaText="Explore auto loans"
      />
    );

    expect(screen.getByText("Getting on the road")).toBeDefined();
    expect(screen.getByText("1.99")).toBeDefined();
    expect(screen.getByText("%")).toBeDefined();
    expect(screen.getByText("APR")).toBeDefined();
    expect(screen.getByText("Auto loans")).toBeDefined();
    expect(
      screen.getByText("A loan that fits your life, and help finding the right option.")
    ).toBeDefined();
    expect(screen.getByText("Explore auto loans")).toBeDefined();
  });

  it("renders active variant with active class", () => {
    const { container } = render(
      <RatesCard
        category="Getting on the road"
        rate="1.99"
        title="Auto loans"
        description="A loan that fits your life."
        variant="active"
      />
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("active");
  });

  it("renders as interactive link when href is passed", () => {
    render(
      <RatesCard
        category="Getting on the road"
        rate="1.99"
        title="Auto loans"
        description="A loan that fits your life."
        href="/auto-loans"
      />
    );

    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/auto-loans");
  });

  it("renders custom categoryIcon when provided", () => {
    render(
      <RatesCard
        category="Home financing"
        categoryIcon={<span data-testid="custom-icon">🏠</span>}
        rate="5.49"
        title="Mortgages"
        description="Low fixed rates."
      />
    );

    expect(screen.getByTestId("custom-icon")).toBeDefined();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { IconContentCard } from "./IconContentCard";

describe("IconContentCard Atom/Molecule Component", () => {
  it("renders default variant with title, description, CTA and link role", () => {
    render(
      <IconContentCard
        title="Customer Service"
        description="Lorem ipsum if needed here"
        ctaText="CTA here"
        href="/customer-service"
      />
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/customer-service");
    expect(link.className).toContain("default");
    expect(screen.getByText("Customer Service")).toBeDefined();
    expect(screen.getByText("Lorem ipsum if needed here")).toBeDefined();
    expect(screen.getByText("CTA here")).toBeDefined();
  });

  it("renders inverse variant with correct class", () => {
    render(
      <IconContentCard
        title="Customer Service"
        description="Lorem ipsum if needed here"
        href="/customer-service"
        variant="inverse"
      />
    );
    const link = screen.getByRole("link");
    expect(link.className).toContain("inverse");
  });

  it("renders as accessible button when href is omitted", () => {
    render(
      <IconContentCard
        title="Contact Staff"
        ctaText="Chat Now"
        type="button"
      />
    );
    const button = screen.getByRole("button");
    expect(button).toBeDefined();
  });
});

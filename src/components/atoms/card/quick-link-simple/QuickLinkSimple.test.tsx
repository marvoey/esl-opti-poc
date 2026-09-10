import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { QuickLinkSimple } from "./QuickLinkSimple";

describe("QuickLinkSimple Atom Component", () => {
  it("renders default variant with title, link role, and href", () => {
    render(
      <QuickLinkSimple
        title="Customer Service"
        href="/customer-service"
      />
    );
    const link = screen.getByRole("link", { name: /Customer Service/i });
    expect(link.getAttribute("href")).toBe("/customer-service");
    expect(link.className).toContain("default");
  });

  it("renders inverse variant with correct class", () => {
    render(
      <QuickLinkSimple
        title="Customer Service"
        href="/customer-service"
        variant="inverse"
      />
    );
    const link = screen.getByRole("link", { name: /Customer Service/i });
    expect(link.className).toContain("inverse");
  });

  it("renders as accessible button when href is omitted", () => {
    render(
      <QuickLinkSimple
        title="Savings Account"
        type="button"
      />
    );
    const button = screen.getByRole("button", { name: /Savings Account/i });
    expect(button).toBeDefined();
  });
});

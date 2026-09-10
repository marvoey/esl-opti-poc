import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { QuickLink } from "./QuickLink";

describe("QuickLink Component", () => {
  it("renders as button by default with title and placeholder slot", () => {
    render(<QuickLink title="Customer Service" />);
    const btn = screen.getByRole("button", { name: /Customer Service/i });
    expect(btn).not.toBeNull();
    expect(screen.getByText("Customer Service")).not.toBeNull();
  });

  it("renders as Next.js Link when href is provided", () => {
    render(<QuickLink title="Contact Support" href="/support" />);
    const link = screen.getByRole("link", { name: /Contact Support/i });
    expect(link.getAttribute("href")).toBe("/support");
  });
});

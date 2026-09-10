import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Badge } from "./Badge";

describe("Badge Atom Component", () => {
  it("renders with default aqua variant", () => {
    render(<Badge>Limited Time</Badge>);
    const badge = screen.getByText("Limited Time");
    expect(badge.className).toContain("aqua");
  });

  it("renders neutral variant", () => {
    render(<Badge variant="neutral">Standard Tag</Badge>);
    const badge = screen.getByText("Standard Tag");
    expect(badge.className).toContain("neutral");
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { SnipeCta } from "./SnipeCta";

describe("SnipeCta Organism", () => {
  it("renders outer section with container and all 3 elements", () => {
    const { container } = render(<SnipeCta />);

    const section = container.querySelector("section");
    expect(section).toBeDefined();

    const containerDiv = container.querySelector(".container");
    expect(containerDiv).toBeDefined();

    // 1. CircleHelp icon
    const icon = container.querySelector("svg");
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute("aria-hidden")).toBe("true");

    // 2. Text components
    expect(screen.getByText("Can you join?")).toBeDefined();
    expect(
      screen.getByText(
        "If you live, work, worship, or attend school in our region — yes!"
      )
    ).toBeDefined();

    // 3. SimpleLink
    const link = screen.getByRole("link", { name: /check your eligibility/i });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/eligibility");
  });

  it("supports custom props", () => {
    render(
      <SnipeCta
        title="Custom Title"
        description="Custom Description"
        linkLabel="Custom Link"
        linkHref="/custom-path"
      />
    );

    expect(screen.getByText("Custom Title")).toBeDefined();
    expect(screen.getByText("Custom Description")).toBeDefined();
    const link = screen.getByRole("link", { name: /custom link/i });
    expect(link.getAttribute("href")).toBe("/custom-path");
  });
});

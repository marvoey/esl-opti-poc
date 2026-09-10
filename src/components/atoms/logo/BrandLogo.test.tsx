import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrandLogo } from "./BrandLogo";

describe("BrandLogo Atom Component", () => {
  it("renders optimized SVG with default 83x50 dimensions and accessible role", () => {
    render(<BrandLogo data-testid="brand-logo" />);
    const svg = screen.getByTestId("brand-logo");

    expect(svg).toBeDefined();
    expect(svg.getAttribute("width")).toBe("83");
    expect(svg.getAttribute("height")).toBe("50");
    expect(svg.getAttribute("viewBox")).toBe("0 0 83 50");
    expect(svg.getAttribute("role")).toBe("img");
    expect(svg.getAttribute("aria-label")).toBe("ESL Federal Credit Union");
  });

  it("supports custom dimensions and className", () => {
    render(
      <BrandLogo
        width={100}
        height={60}
        className="custom-logo"
        data-testid="custom-logo"
      />
    );
    const svg = screen.getByTestId("custom-logo");

    expect(svg.getAttribute("width")).toBe("100");
    expect(svg.getAttribute("height")).toBe("60");
    expect(svg.getAttribute("class")).toContain("custom-logo");
  });

  it("renders with a custom fill color", () => {
    const { container } = render(<BrandLogo color="#ffffff" />);
    const path = container.querySelector("path");

    expect(path).not.toBeNull();
    expect(path?.getAttribute("fill")).toBe("#ffffff");
  });
});

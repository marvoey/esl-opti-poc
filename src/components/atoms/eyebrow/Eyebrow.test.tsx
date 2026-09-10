import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Eyebrow } from "./Eyebrow";

describe("Eyebrow Atom Component", () => {
  it("renders children as span by default with accent color", () => {
    render(<Eyebrow>Category Tag</Eyebrow>);
    const el = screen.getByText("Category Tag");
    expect(el.tagName.toLowerCase()).toBe("span");
  });

  it("supports custom semantic container", () => {
    render(<Eyebrow as="h3">Eyebrow Subheader</Eyebrow>);
    const el = screen.getByText("Eyebrow Subheader");
    expect(el.tagName.toLowerCase()).toBe("h3");
  });

  it("applies brand color variant", () => {
    render(<Eyebrow color="brand">Brand Eyebrow</Eyebrow>);
    const el = screen.getByText("Brand Eyebrow");
    expect(el.className).toContain("brand");
  });

  it("applies vibrant turquoise color variant", () => {
    render(<Eyebrow color="vibrant">Vibrant Eyebrow</Eyebrow>);
    const el = screen.getByText("Vibrant Eyebrow");
    expect(el.className).toContain("vibrant");
  });

  it("applies inverted color variant", () => {
    render(<Eyebrow color="inverted">Inverted Eyebrow</Eyebrow>);
    const el = screen.getByText("Inverted Eyebrow");
    expect(el.className).toContain("inverted");
  });
});

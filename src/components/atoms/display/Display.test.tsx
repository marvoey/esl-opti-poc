import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Display } from "./Display";

describe("Display Atom Component", () => {
  it("renders children with h1 default semantic tag", () => {
    render(<Display>Hero Headline</Display>);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toBe("Hero Headline");
  });

  it("renders with custom polymorphic tag", () => {
    render(<Display as="h2">Custom H2 Display</Display>);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("Custom H2 Display");
  });
});

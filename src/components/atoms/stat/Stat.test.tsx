import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Stat } from "./Stat";

describe("Stat Atom Component", () => {
  it("renders metric children as span by default", () => {
    render(<Stat>12,480</Stat>);
    const el = screen.getByText("12,480");
    expect(el.tagName.toLowerCase()).toBe("span");
  });

  it("supports div tag", () => {
    render(<Stat as="div">99.9%</Stat>);
    const el = screen.getByText("99.9%");
    expect(el.tagName.toLowerCase()).toBe("div");
  });
});

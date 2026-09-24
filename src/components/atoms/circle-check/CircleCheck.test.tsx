import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { CircleCheck } from "./CircleCheck";

describe("CircleCheck Atom", () => {
  it("renders svg with default dimensions and colors", () => {
    const { getByTestId } = render(<CircleCheck />);
    const svg = getByTestId("circle-check");
    expect(svg).toBeDefined();
    expect(svg.getAttribute("width")).toBe("28");
    expect(svg.getAttribute("height")).toBe("28");

    const circle = svg.querySelector("circle");
    expect(circle?.getAttribute("fill")).toBe("var(--color-primary)");

    const path = svg.querySelector("path");
    expect(path?.getAttribute("stroke")).toBe("var(--color-aqua-300)");
  });

  it("supports custom size, backgroundColor, and tickColor", () => {
    const { getByTestId } = render(
      <CircleCheck
        size={36}
        backgroundColor="#001122"
        tickColor="#AABBCC"
      />
    );
    const svg = getByTestId("circle-check");
    expect(svg.getAttribute("width")).toBe("36");
    expect(svg.getAttribute("height")).toBe("36");

    const circle = svg.querySelector("circle");
    expect(circle?.getAttribute("fill")).toBe("#001122");

    const path = svg.querySelector("path");
    expect(path?.getAttribute("stroke")).toBe("#AABBCC");
  });
});

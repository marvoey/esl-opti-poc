import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { TabButton } from "./TabButton";
import { CoinsIcon } from "../icons";

describe("TabButton Component", () => {
  it("renders with role=tab and aria-selected=false by default", () => {
    render(<TabButton icon={<CoinsIcon />}>Just starting out</TabButton>);
    const tab = screen.getByRole("tab", { name: /Just starting out/i });
    expect(tab.getAttribute("aria-selected")).toBe("false");
    expect(tab.className).toContain("inactive");
  });

  it("renders active state with aria-selected=true", () => {
    render(
      <TabButton icon={<CoinsIcon />} active>
        Just starting out
      </TabButton>
    );
    const tab = screen.getByRole("tab", { name: /Just starting out/i });
    expect(tab.getAttribute("aria-selected")).toBe("true");
    expect(tab.className).toContain("active");
  });

  it("renders hover second variant with hover class", () => {
    render(
      <TabButton icon={<CoinsIcon />} variant="hover">
        Just starting out
      </TabButton>
    );
    const tab = screen.getByRole("tab", { name: /Just starting out/i });
    expect(tab.className).toContain("hover");
  });
});

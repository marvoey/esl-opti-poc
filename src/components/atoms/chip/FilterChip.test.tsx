import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { FilterChip } from "./FilterChip";

describe("FilterChip Component", () => {
  it("renders unselected state by default with aria-pressed=false", () => {
    render(<FilterChip>Keeping it simple</FilterChip>);
    const chip = screen.getByRole("button", { name: "Keeping it simple" });
    expect(chip.getAttribute("aria-pressed")).toBe("false");
    expect(chip.className).toContain("unselected");
  });

  it("renders selected state with aria-pressed=true", () => {
    render(<FilterChip selected>Keeping it simple</FilterChip>);
    const chip = screen.getByRole("button", { name: "Keeping it simple" });
    expect(chip.getAttribute("aria-pressed")).toBe("true");
    expect(chip.className).toContain("selected");
  });

  it("fires onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<FilterChip onClick={handleClick}>Clickable</FilterChip>);
    const chip = screen.getByRole("button", { name: "Clickable" });
    fireEvent.click(chip);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

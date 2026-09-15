import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { HeroCarousel } from "./HeroCarousel";
import { HERO_SLIDES } from "./heroSlides";

describe("HeroCarousel Organism", () => {
  it("renders 3 slides with custom h2 headings and p eyebrow tags", () => {
    render(<HeroCarousel slides={HERO_SLIDES} />);

    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings).toHaveLength(3);
    expect(headings[0].textContent).toContain("Move forward");
    expect(headings[0].textContent).toContain("with confidence.");

    const eyebrows = screen.getAllByText("Banking with guidance");
    expect(eyebrows).toHaveLength(3);
    expect(eyebrows[0].tagName.toLowerCase()).toBe("p");
  });

  it("renders action buttons and navigation controls", () => {
    render(<HeroCarousel slides={HERO_SLIDES} />);

    const memberButtons = screen.getAllByRole("button", { name: /become a member/i });
    expect(memberButtons).toHaveLength(3);

    const signInButtons = screen.getAllByRole("button", { name: /sign in/i });
    expect(signInButtons).toHaveLength(3);

    expect(screen.getByRole("button", { name: /previous slide/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /pause carousel|play carousel/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /next slide/i })).toBeDefined();
  });

  it("does not render image or media area when imageSrc is not provided", () => {
    const slidesWithoutImages = HERO_SLIDES.map((slide) => ({
      ...slide,
      imageSrc: undefined,
    }));
    render(<HeroCarousel slides={slidesWithoutImages} />);
    expect(screen.queryAllByRole("img")).toHaveLength(0);
  });
});

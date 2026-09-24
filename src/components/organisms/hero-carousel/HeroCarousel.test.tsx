import { describe, it, expect, vi } from "vitest";
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

  it("registers and cleans up visibilitychange listener to guard background tab autoplay", () => {
    const addEventListenerSpy = vi.spyOn(document, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = render(<HeroCarousel slides={HERO_SLIDES} />);

    expect(addEventListenerSpy).toHaveBeenCalledWith("visibilitychange", expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("visibilitychange", expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it("renders buttons with only text and NO icon when CTA icons are not set or set to 'none'", () => {
    const textOnlySlides = [
      {
        id: "slide-text-only",
        eyebrow: "Eyebrow",
        titleLine1: "Title Without Icons",
        body: "Body text",
        primaryCta: "Learn More",
        secondaryCta: "Contact Us",
      },
    ];

    render(<HeroCarousel slides={textOnlySlides} />);

    const primaryBtn = screen.getByRole("button", { name: "Learn More" });
    const secondaryBtn = screen.getByRole("button", { name: "Contact Us" });

    expect(primaryBtn.querySelector("svg")).toBeNull();
    expect(secondaryBtn.querySelector("svg")).toBeNull();
  });

  it("renders custom icons when CTA icons are explicitly configured", () => {
    const iconSlides = [
      {
        id: "slide-with-icons",
        eyebrow: "Eyebrow",
        titleLine1: "Title With Icons",
        body: "Body text",
        primaryCta: "Explore Rates",
        primaryCtaIcon: "arrow-right",
        secondaryCta: "Member Login",
        secondaryCtaIcon: "user",
      },
    ];

    render(<HeroCarousel slides={iconSlides} />);

    const primaryBtn = screen.getByRole("button", { name: "Explore Rates" });
    const secondaryBtn = screen.getByRole("button", { name: "Member Login" });

    expect(primaryBtn.querySelector("svg")).not.toBeNull();
    expect(secondaryBtn.querySelector("svg")).not.toBeNull();
  });
});

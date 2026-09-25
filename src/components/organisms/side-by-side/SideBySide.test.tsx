import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { SideBySide } from "./SideBySide";

const BASE_PROPS = {
  eyebrow: "Featured Offer",
  headline: "Save more with a member checking account",
  body: "Open a checking account today and enjoy no monthly fees.",
  ctaLabel: "Learn more",
  ctaUrl: "/checking",
  imageSrc: "/images/checking.jpg",
  imageAlt: "Member reviewing their checking account on a laptop",
};

describe("SideBySide Organism", () => {
  it("renders Variant A (Dark) with correct visual hierarchy and class modifiers", () => {
    const { container } = render(<SideBySide {...BASE_PROPS} variant="dark" />);

    const card = container.querySelector("article");
    expect(card?.className).toContain("cardDark");

    const content = card?.firstElementChild;
    expect(content?.className).toContain("contentOrderFirst");

    const imageColumn = card?.lastElementChild;
    expect(imageColumn?.className).toContain("imageColumnRight");

    expect(
      screen.getByRole("heading", { level: 3, name: BASE_PROPS.headline })
    ).toBeDefined();

    // Eyebrow uses the accent token; the dark shade comes from the [data-theme="dark"] override
    const eyebrow = screen.getByText(BASE_PROPS.eyebrow);
    expect(eyebrow.className).toMatch(/accent/i);
    expect(card?.getAttribute("data-theme")).toBe("dark");
  });

  it("renders Variant B (Light) with mirrored layout and correct typography tokens", () => {
    const { container } = render(<SideBySide {...BASE_PROPS} variant="light" />);

    const card = container.querySelector("article");
    expect(card?.className).toContain("cardLight");

    const content = card?.firstElementChild;
    expect(content?.className).toContain("contentOrderLast");

    const imageColumn = card?.lastElementChild;
    expect(imageColumn?.className).toContain("imageColumnLeft");

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading.className).toContain("headlineLight");

    const eyebrow = screen.getByText(BASE_PROPS.eyebrow);
    expect(eyebrow.className).toMatch(/accent/i);
  });

  it("renders CTA button with correct link href and accessibility labels", () => {
    render(<SideBySide {...BASE_PROPS} ctaLabel="Open an account" ctaUrl="/apply" />);

    const link = screen.getByRole("link", { name: /open an account/i });
    expect(link.getAttribute("href")).toBe("/apply");
  });

  it("renders cover image with alt text and responsive fill attributes", () => {
    const { container } = render(<SideBySide {...BASE_PROPS} />);

    const image = screen.getByAltText(BASE_PROPS.imageAlt);
    expect(image).toBeDefined();
    expect(image.getAttribute("sizes")).toBe("(min-width: 1024px) 50vw, 100vw");

    const imageColumn = container.querySelector("article")?.lastElementChild;
    expect(imageColumn?.contains(image)).toBe(true);
  });

  it("applies section and container classes properly when stacked directly or in wrappers", () => {
    const { container } = render(
      <div>
        <div data-testid="wrapper-1">
          <SideBySide {...BASE_PROPS} variant="dark" />
        </div>
        <div data-testid="wrapper-2">
          <SideBySide {...BASE_PROPS} variant="light" />
        </div>
      </div>
    );

    const sections = container.querySelectorAll("section");
    expect(sections.length).toBe(2);
    sections.forEach((section) => {
      expect(section.className).toMatch(/section/);
      const innerContainer = section.querySelector("div");
      expect(innerContainer?.className).toMatch(/container/);
    });
  });
});


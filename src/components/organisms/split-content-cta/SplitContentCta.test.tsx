import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { SplitContentCta, type SplitContentCtaOption } from "./SplitContentCta";

const MOCK_OPTIONS: SplitContentCtaOption[] = [
  {
    id: "find-a-branch",
    icon: "map-pin",
    title: "Find a branch",
    description: "Lorem ipsum if needed here",
    ctaText: "CTA here",
    href: "/locations",
  },
  {
    id: "contact-us",
    icon: "headphones",
    title: "Contact us",
    description: "Lorem ipsum if needed here",
    ctaText: "CTA here",
    href: "/contact",
  },
];

describe("SplitContentCta Organism", () => {
  it("renders null when options is empty", () => {
    const { container } = render(<SplitContentCta options={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders heading and description", () => {
    render(
      <SplitContentCta
        title="Still weighing it up? Let's talk it through."
        description="Tell us how you bank day to day and we'll help you decide between Premier and Free Checking — no pressure to open today."
        options={MOCK_OPTIONS}
      />
    );

    expect(
      screen.getByRole("heading", {
        name: "Still weighing it up? Let's talk it through.",
      })
    ).toBeDefined();
    expect(
      screen.getByText(
        "Tell us how you bank day to day and we'll help you decide between Premier and Free Checking — no pressure to open today."
      )
    ).toBeDefined();
  });

  it("renders exactly 2 cards as links with correct href, title, description, and CTA text", () => {
    render(<SplitContentCta options={MOCK_OPTIONS} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);

    MOCK_OPTIONS.forEach((option) => {
      const link = screen.getByRole("link", { name: new RegExp(option.title) });
      expect(link.getAttribute("href")).toBe(option.href);
      expect(screen.getByText(option.title)).toBeDefined();
      expect(screen.getAllByText(option.description).length).toBeGreaterThan(0);
      expect(screen.getAllByText(option.ctaText).length).toBeGreaterThan(0);
    });
  });

  it("renders cards inside an unordered list with role='list' and li elements", () => {
    const { container } = render(<SplitContentCta options={MOCK_OPTIONS} />);
    const list = container.querySelector("ul[class*='cardsCol']");
    expect(list).not.toBeNull();
    expect(list?.getAttribute("role")).toBe("list");
    const items = list?.querySelectorAll(":scope > li[class*='cardItem']");
    expect(items?.length).toBe(2);
  });
});

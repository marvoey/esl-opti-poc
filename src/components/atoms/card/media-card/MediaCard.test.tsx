import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MediaCard } from "./MediaCard";

const MOCK_CARD_PROPS = {
  imageSrc: "/images/offers/auto-loan.jpg",
  imageAlt: "Convertible car driving",
  badge: "Limited Time",
  title: "X.XX% APR on new auto loans",
  description: "Switch your everyday banking and we'll help you move everything over.",
  ctaText: "Explore auto loans",
  href: "/auto-loans",
};

describe("MediaCard Atom Component", () => {
  it("renders card content, badge, title, description, and link CTA correctly", () => {
    render(<MediaCard {...MOCK_CARD_PROPS} />);

    expect(screen.getByText("Limited Time")).toBeDefined();
    expect(screen.getByRole("heading", { level: 3, name: "X.XX% APR on new auto loans" })).toBeDefined();
    expect(
      screen.getByText("Switch your everyday banking and we'll help you move everything over.")
    ).toBeDefined();

    const link = screen.getByRole("link", { name: /explore auto loans/i });
    expect(link.getAttribute("href")).toBe("/auto-loans");
  });

  it("renders with external target attributes when external is true", () => {
    render(<MediaCard {...MOCK_CARD_PROPS} external={true} />);

    const link = screen.getByRole("link", { name: /explore auto loans/i });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("omits badge element when badge prop is empty", () => {
    render(<MediaCard {...MOCK_CARD_PROPS} badge="" />);

    expect(screen.queryByText("Limited Time")).toBeNull();
  });

  it("omits CTA link when href is not provided", () => {
    render(<MediaCard {...MOCK_CARD_PROPS} href={undefined} />);

    expect(screen.queryByRole("link")).toBeNull();
  });
});

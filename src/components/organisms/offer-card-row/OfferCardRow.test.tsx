import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import React from "react";
import { OfferCardRow } from "./OfferCardRow";
import { DEFAULT_OFFER_CARDS_6 } from "./offerCardRowData";

describe("OfferCardRow Organism", () => {
  it("renders header row with vibrant eyebrow and white H2 title", async () => {
    await act(async () => {
      render(<OfferCardRow />);
    });

    expect(screen.getByText("WHAT'S NEW RIGHT NOW")).toBeDefined();
    expect(
      screen.getByRole("heading", { level: 2, name: "A few offers worth a look." })
    ).toBeDefined();
  });

  it("renders all 6 offer cards in slides with accessibility labels", async () => {
    await act(async () => {
      render(<OfferCardRow cards={DEFAULT_OFFER_CARDS_6} />);
    });

    expect(screen.getByText("X.XX% APR on new auto loans")).toBeDefined();
    expect(screen.getByText("Earn X.XX% APY on a certificate")).toBeDefined();
    expect(screen.getByText("$XXX when you open checking")).toBeDefined();
    expect(screen.getByText("0% Intro APR on balance transfers")).toBeDefined();
    expect(screen.getByText("Lock in a competitive HELOC rate")).toBeDefined();
    expect(screen.getByText("Earn up to X.XX% APY with Premier Savings")).toBeDefined();

    const slides = screen.getAllByRole("group", { name: /of 6/i });
    expect(slides).toHaveLength(6);
  });

  it("renders accessible previous and next carousel navigation buttons", async () => {
    await act(async () => {
      render(<OfferCardRow />);
    });

    const prevBtn = screen.getByRole("button", { name: /previous offers/i });
    const nextBtn = screen.getByRole("button", { name: /next offers/i });

    expect(prevBtn).toBeDefined();
    expect(nextBtn).toBeDefined();
    expect(prevBtn.getAttribute("aria-controls")).toContain("carousel");
    expect(nextBtn.getAttribute("aria-controls")).toContain("carousel");
  });

  it("associates custom section id with heading and carousel region", async () => {
    let container: HTMLElement;
    await act(async () => {
      const res = render(<OfferCardRow id="featured-offers" />);
      container = res.container;
    });

    const section = container!.querySelector("section#featured-offers");
    expect(section).not.toBeNull();
    expect(section?.getAttribute("aria-labelledby")).toBe("featured-offers-heading");

    const carousel = screen.getByRole("region", { name: "Offers carousel" });
    expect(carousel).toBeDefined();
    expect(carousel.id).toBe("featured-offers-carousel");
  });
});

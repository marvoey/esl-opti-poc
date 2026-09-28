import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import React from "react";
import { LearningHub } from "./LearningHub";
import { DEFAULT_LEARNING_HUB_PROPS } from "./learningHubData";

describe("LearningHub Organism", () => {
  it("renders default eyebrow, heading and description", () => {
    render(<LearningHub {...DEFAULT_LEARNING_HUB_PROPS} />);

    expect(screen.getByText("FINANCIAL WELLNESS")).toBeDefined();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Smart moves for the money you're setting aside.",
      })
    ).toBeDefined();
    expect(
      screen.getByText(
        "Plain-language guides and tools to help you save with a plan — and know which account to use."
      )
    ).toBeDefined();
  });

  it("renders the CTA as a link with the correct href", () => {
    render(<LearningHub {...DEFAULT_LEARNING_HUB_PROPS} />);

    const cta = screen.getByRole("link", {
      name: /explore the financial wellness hub/i,
    });
    expect(cta).toBeDefined();
    expect(cta.getAttribute("href")).toBe("/financial-wellness");
  });

  it("renders all 3 default cards with the correct badge and title", () => {
    render(<LearningHub {...DEFAULT_LEARNING_HUB_PROPS} />);

    expect(screen.getByText("How much should you keep in an emergency fund?")).toBeDefined();
    expect(screen.getByText("Saving for a child's education: where to start")).toBeDefined();
    expect(screen.getByText("Small ways to save a little more each month")).toBeDefined();

    expect(screen.getAllByText("Tool")).toHaveLength(1);
    expect(screen.getAllByText("Article")).toHaveLength(2);
  });

  it("renders cards as accessible link containers without nested interactive elements", () => {
    const { container } = render(<LearningHub {...DEFAULT_LEARNING_HUB_PROPS} />);

    const articles = container.querySelectorAll("article");
    expect(articles).toHaveLength(3);

    articles.forEach((article, index) => {
      const links = article.querySelectorAll("a");
      expect(links).toHaveLength(1);
      expect(links[0].getAttribute("href")).toBe(
        DEFAULT_LEARNING_HUB_PROPS.cards[index].href
      );
      // No interactive element nested inside the link itself.
      expect(links[0].querySelectorAll("a, button")).toHaveLength(0);
    });
  });

  it("renders the cards as a list with one card per list item", () => {
    render(<LearningHub {...DEFAULT_LEARNING_HUB_PROPS} />);

    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");

    expect(items).toHaveLength(DEFAULT_LEARNING_HUB_PROPS.cards.length);
    items.forEach((item) => {
      expect(within(item).getAllByRole("article")).toHaveLength(1);
    });
  });

  it("renders custom title, description and cta", () => {
    render(
      <LearningHub
        title="Custom Learning Title"
        description="Custom learning description."
        cta={{ label: "Custom CTA", href: "/custom-learning" }}
        cards={[
          {
            id: "custom-card",
            imageSrc: "/images/offers/checking.jpg",
            imageAlt: "Custom card image",
            badgeText: "Guide",
            title: "Custom card title",
            href: "/custom-card",
          },
        ]}
      />
    );

    expect(screen.getByText("Custom Learning Title")).toBeDefined();
    expect(screen.getByText("Custom learning description.")).toBeDefined();
    expect(screen.getByRole("link", { name: /custom cta/i })).toBeDefined();
    expect(screen.getByText("Custom card title")).toBeDefined();
  });

  it("renders a card without an href as a non-interactive article (no nested link)", () => {
    const { container } = render(
      <LearningHub
        title="No Link Cards"
        cta={null}
        cards={[
          {
            id: "no-link-card",
            imageSrc: "/images/offers/checking.jpg",
            badgeText: "Article",
            title: "Card without a link",
          },
        ]}
      />
    );

    const article = container.querySelector("article");
    expect(article).not.toBeNull();
    expect(article?.querySelectorAll("a")).toHaveLength(0);
  });

  it("renders accessible landmark with aria-labelledby", () => {
    const { container } = render(
      <LearningHub id="test-learning-hub" {...DEFAULT_LEARNING_HUB_PROPS} />
    );

    const section = container.querySelector("section");
    expect(section).toBeDefined();
    expect(section?.getAttribute("aria-labelledby")).toBe("test-learning-hub-heading");
  });
});

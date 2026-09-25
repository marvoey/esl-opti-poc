import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { SplitContentCards } from "./SplitContentCards";
import { DEFAULT_SPLIT_CONTENT_CARDS_DATA } from "./splitContentCardsData";

describe("SplitContentCards Organism", () => {
  it("renders default content: eyebrow, heading, description, and CTA", () => {
    render(<SplitContentCards />);

    expect(screen.getByText("WHY OUR GUIDANCE IS DIFFERENT")).toBeDefined();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Advice from a bank you own.",
      })
    ).toBeDefined();
    expect(
      screen.getByText(/ESL is member-owned. We don't answer to outside shareholders/i)
    ).toBeDefined();

    const ctaLink = screen.getByRole("link", {
      name: /see how membership works/i,
    });
    expect(ctaLink).toBeDefined();
    expect(ctaLink.getAttribute("href")).toBe("/membership");
  });

  it("renders the hero metric card with subhead, stat, unit, and note", () => {
    render(<SplitContentCards />);

    expect(
      screen.getByText("OWNERS' DIVIDEND, RETURNED TO MEMBERS")
    ).toBeDefined();
    expect(screen.getByText("$XX")).toBeDefined();
    expect(screen.getByText("million")).toBeDefined();
    expect(
      screen.getByText(
        "Money returned to members — because you own a share of the bank."
      )
    ).toBeDefined();
  });

  it("renders both dual stat proof-point cards and star icon on satisfaction metric", () => {
    const { container } = render(<SplitContentCards />);

    expect(screen.getByText("XX")).toBeDefined();
    expect(screen.getByText("years of dividends")).toBeDefined();

    expect(screen.getByText("4.8")).toBeDefined();
    expect(screen.getByText("member satisfaction")).toBeDefined();
    expect(container.querySelector("svg.lucide-star")).not.toBeNull();
  });

  it("groups the hero metric and stat cards into a single semantic list", () => {
    render(<SplitContentCards />);

    expect(screen.getByRole("list")).toBeDefined();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders only the stat cards as list items when the hero metric is absent", () => {
    render(<SplitContentCards heroMetric={null} />);

    expect(screen.getByRole("list")).toBeDefined();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("associates custom section id with heading aria-labelledby", () => {
    const { container } = render(
      <SplitContentCards id="guidance-difference" />
    );

    const section = container.querySelector("section#guidance-difference");
    expect(section).not.toBeNull();
    expect(section?.getAttribute("aria-labelledby")).toBe(
      "guidance-difference-heading"
    );

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Advice from a bank you own.",
    });
    expect(heading.getAttribute("id")).toBe("guidance-difference-heading");
  });

  it("renders custom data props accurately", () => {
    render(
      <SplitContentCards
        eyebrow="LOCAL ADVANTAGE"
        title="Banking Built on Trust"
        headingLevel="h3"
        description="Every dollar stays here to build a stronger community."
        cta={{
          label: "Learn about dividends",
          href: "/dividend",
        }}
        heroMetric={{
          subhead: "RETURNED SINCE INCEPTION",
          value: "$250M+",
          unit: "total",
          description: "Our historic member return.",
        }}
        statCards={[
          { id: "stat-a", value: "30+", label: "consecutive years" },
          { id: "stat-b", value: "99%", label: "retention rate" },
        ]}
      />
    );

    expect(screen.getByText("LOCAL ADVANTAGE")).toBeDefined();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Banking Built on Trust",
      })
    ).toBeDefined();
    expect(
      screen.getByText("Every dollar stays here to build a stronger community.")
    ).toBeDefined();
    expect(screen.getByText("RETURNED SINCE INCEPTION")).toBeDefined();
    expect(screen.getByText("$250M+")).toBeDefined();
    expect(screen.getByText("total")).toBeDefined();
    expect(screen.getByText("30+")).toBeDefined();
    expect(screen.getByText("consecutive years")).toBeDefined();
    expect(screen.getByText("99%")).toBeDefined();
    expect(screen.getByText("retention rate")).toBeDefined();
  });

  it("handles missing optional elements gracefully", () => {
    const { container } = render(
      <SplitContentCards
        eyebrow={null}
        description={null}
        cta={null}
        heroMetric={null}
        statCards={[]}
      />
    );

    expect(container.querySelector("section")).not.toBeNull();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Advice from a bank you own.",
      })
    ).toBeDefined();
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByRole("list")).toBeNull();
  });
});

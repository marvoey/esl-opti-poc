import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import React from "react";
import { VideoStoryCardRow } from "./VideoStoryCardRow";
import { DEFAULT_VIDEO_STORY_CARD_ROW } from "./videoStoryCardRowData";

describe("VideoStoryCardRow Organism", () => {
  it("renders default content: eyebrow, title, description, CTA, and 3 testimonial cards", () => {
    render(<VideoStoryCardRow {...DEFAULT_VIDEO_STORY_CARD_ROW} />);

    // Header Content
    expect(screen.getByText("Member Stories")).toBeDefined();
    expect(screen.getByText("Real stories from members like you.")).toBeDefined();
    expect(
      screen.getByText(
        "See how local families and business owners build their future with personalized financial solutions from ESL."
      )
    ).toBeDefined();

    // CTA
    const cta = screen.getByRole("link", { name: /watch more stories/i });
    expect(cta).toBeDefined();
    expect(cta.getAttribute("href")).toBe("/stories");

    // 3 Testimonial Cards
    expect(screen.getByText("Expanded her business")).toBeDefined();
    expect(screen.getByText("Bought his first home")).toBeDefined();
    expect(screen.getByText("Saved for college")).toBeDefined();
  });

  it("renders custom title, description and cta", () => {
    render(
      <VideoStoryCardRow
        title="Custom Stories Title"
        description="Custom stories description."
        cta={{ label: "Custom CTA", href: "/custom-stories" }}
      />
    );

    expect(screen.getByText("Custom Stories Title")).toBeDefined();
    expect(screen.getByText("Custom stories description.")).toBeDefined();
    expect(screen.getByRole("link", { name: /custom cta/i })).toBeDefined();
  });

  it("renders accessible landmark with aria-labelledby", () => {
    const { container } = render(
      <VideoStoryCardRow id="test-story-row" {...DEFAULT_VIDEO_STORY_CARD_ROW} />
    );

    const section = container.querySelector("section");
    expect(section).toBeDefined();
    expect(section?.getAttribute("aria-labelledby")).toBe("test-story-row-heading");
  });

  it("renders the testimonial cards as a list with one card per list item", () => {
    render(<VideoStoryCardRow {...DEFAULT_VIDEO_STORY_CARD_ROW} />);

    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");

    expect(items).toHaveLength(DEFAULT_VIDEO_STORY_CARD_ROW.cards!.length);
    items.forEach((item) => {
      expect(within(item).getAllByRole("article")).toHaveLength(1);
    });
  });
});

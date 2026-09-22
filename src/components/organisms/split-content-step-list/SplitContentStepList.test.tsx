import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { SplitContentStepList, type StepItem } from "./SplitContentStepList";
import { DEFAULT_SPLIT_CONTENT_STEP_LIST_PROPS } from "./splitContentStepListData";

const MOCK_STEPS: StepItem[] = [
  { id: "step-1", step: 1, title: "Open your new account", description: "Start online or in a branch." },
  { id: "step-2", step: 2, title: "Move your automatic transfers", description: "Point transfers here." },
  { id: "step-3", step: 3, title: "Redirect your deposit split", description: "Send part of each paycheck." },
  { id: "step-4", step: 4, title: "Close your old account", description: "Close the old one." },
];

describe("SplitContentStepList Organism", () => {
  it("renders the eyebrow, heading, and description", () => {
    render(
      <SplitContentStepList
        eyebrow="ALREADY SAVE SOMEWHERE ELSE?"
        title="Moving your savings is simpler than it sounds."
        description="We'll help you move everything."
        steps={MOCK_STEPS}
      />
    );

    expect(screen.getByText("ALREADY SAVE SOMEWHERE ELSE?")).toBeDefined();
    expect(
      screen.getByRole("heading", {
        name: "Moving your savings is simpler than it sounds.",
      })
    ).toBeDefined();
    expect(screen.getByText("We'll help you move everything.")).toBeDefined();
  });

  it("defaults the title to an h2", () => {
    render(
      <SplitContentStepList
        title="Section title"
        description="Section description"
        steps={MOCK_STEPS}
      />
    );

    const heading = screen.getByRole("heading", { name: "Section title" });
    expect(heading.tagName).toBe("H2");
  });

  it("renders the CTA as a link with the trailing arrow icon when provided", () => {
    render(
      <SplitContentStepList
        title="Section title"
        description="Section description"
        cta={{ label: "How to switch", href: "/how-to-switch" }}
        steps={MOCK_STEPS}
      />
    );

    const link = screen.getByRole("link", { name: /How to switch/ });
    expect(link.getAttribute("href")).toBe("/how-to-switch");
  });

  it("omits the CTA when not provided", () => {
    render(
      <SplitContentStepList
        title="Section title"
        description="Section description"
        steps={MOCK_STEPS}
      />
    );

    expect(screen.queryByRole("link")).toBeNull();
  });

  it("renders steps as a semantic ordered list with one item per step", () => {
    render(
      <SplitContentStepList
        title="Section title"
        description="Section description"
        steps={MOCK_STEPS}
      />
    );

    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(MOCK_STEPS.length);

    MOCK_STEPS.forEach((item) => {
      expect(screen.getByText(item.title)).toBeDefined();
      expect(screen.getByText(item.description)).toBeDefined();
    });
  });

  it("renders the default content with 4 steps matching the design reference", () => {
    render(<SplitContentStepList {...DEFAULT_SPLIT_CONTENT_STEP_LIST_PROPS} />);

    expect(
      screen.getByRole("heading", {
        name: "Moving your savings is simpler than it sounds.",
      })
    ).toBeDefined();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(
      screen.getByRole("link", { name: /How to switch/ })
    ).toBeDefined();
  });
});

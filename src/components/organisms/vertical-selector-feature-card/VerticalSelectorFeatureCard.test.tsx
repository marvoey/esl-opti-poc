import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import { VerticalSelectorFeatureCard } from "./VerticalSelectorFeatureCard";
import { DEFAULT_VERTICAL_SELECTOR_DATA } from "./verticalSelectorData";

describe("VerticalSelectorFeatureCard Organism", () => {
  it("renders Row 1 header elements: eyebrow, H2 title, description, and CTA", () => {
    render(<VerticalSelectorFeatureCard />);

    expect(screen.getByText("BANKING FOR EVERY STAGE OF LIFE")).toBeDefined();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Wherever you are, we’ll help you take the next step.",
      })
    ).toBeDefined();
    expect(
      screen.getByText(/Pick the moment that fits your life right now/i)
    ).toBeDefined();

    const headerCta = screen.getByRole("link", {
      name: /explore financial wellness center/i,
    });
    expect(headerCta).toBeDefined();
    expect(headerCta.getAttribute("href")).toBe("/wellness");
  });

  it("renders all 8 TabButton items with icons in the vertical controller", () => {
    const { container } = render(<VerticalSelectorFeatureCard />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(8);
    expect(tabs[0].textContent).toContain("Just starting out");
    expect(tabs[1].textContent).toContain("Fresh start");
    expect(tabs[2].textContent).toContain("Buying a car");
    expect(tabs[3].textContent).toContain("Saving for goals or emergencies");
    expect(tabs[4].textContent).toContain("Buying a home");
    expect(tabs[5].textContent).toContain("Growing a family");
    expect(tabs[6].textContent).toContain("Saving and paying for college");
    expect(tabs[7].textContent).toContain("Planning for retirement");

    // Verify icons are rendered with aria-hidden="true" inside tabs
    const tabIcons = container.querySelectorAll('[role="tab"] svg');
    expect(tabIcons.length).toBe(8);
  });

  it("initially renders default active tab ('Just starting out') feature card content", () => {
    render(<VerticalSelectorFeatureCard defaultActiveId="just-starting-out" />);

    const activeTab = screen.getByRole("tab", { name: /just starting out/i });
    expect(activeTab.getAttribute("aria-selected")).toBe("true");

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Smart Tools for Your First Financial Steps",
      })
    ).toBeDefined();

    expect(
      screen.getByText(/Build credit with confidence, track spending with automated budgeting/i)
    ).toBeDefined();

    const featureCta = screen.getByRole("link", {
      name: /explore starter accounts/i,
    });
    expect(featureCta.getAttribute("href")).toBe("/personal/checking");
  });

  it("synchronously updates feature card content when another tab is clicked", () => {
    render(<VerticalSelectorFeatureCard />);

    const homeTab = screen.getByRole("tab", { name: /buying a home/i });
    act(() => {
      fireEvent.click(homeTab);
    });

    expect(homeTab.getAttribute("aria-selected")).toBe("true");

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Buying a home is a big step — and an exciting one.",
      })
    ).toBeDefined();

    expect(
      screen.getByText(/Whether it’s your first place or room for a growing family/i)
    ).toBeDefined();

    const loanCta = screen.getByRole("link", {
      name: /start your home buying journey/i,
    });
    expect(loanCta.getAttribute("href")).toBe("/personal/mortgages");
  });

  it("supports keyboard navigation with ArrowDown and ArrowUp", () => {
    render(<VerticalSelectorFeatureCard defaultActiveId="just-starting-out" />);

    const tablist = screen.getByRole("tablist", {
      name: "Wherever you are, we’ll help you take the next step.",
    });

    // Currently on 'Just starting out' (index 0). ArrowDown moves to 'Fresh start' (index 1)
    act(() => {
      fireEvent.keyDown(tablist, { key: "ArrowDown" });
    });

    const nextTab = screen.getByRole("tab", { name: /fresh start/i });
    expect(nextTab.getAttribute("aria-selected")).toBe("true");

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "A Clean Slate and Solutions That Rebuild",
      })
    ).toBeDefined();
  });

  it("associates custom section id with heading aria-labelledby", () => {
    const { container } = render(
      <VerticalSelectorFeatureCard id="custom-selector" />
    );

    const section = container.querySelector("section#custom-selector");
    expect(section).not.toBeNull();
    expect(section?.getAttribute("aria-labelledby")).toBe(
      "custom-selector-heading"
    );

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Wherever you are, we’ll help you take the next step.",
    });
    expect(heading.getAttribute("id")).toBe("custom-selector-heading");
  });

  it("handles missing optional elements gracefully", () => {
    render(
      <VerticalSelectorFeatureCard
        eyebrow={null}
        description={null}
        cta={null}
      />
    );

    expect(screen.queryByText("BANKING FOR EVERY STAGE OF LIFE")).toBeNull();
    expect(screen.queryByText(/Explore Financial Wellness Center/i)).toBeNull();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Wherever you are, we’ll help you take the next step.",
      })
    ).toBeDefined();
  });
});

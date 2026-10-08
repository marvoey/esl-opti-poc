import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import React from "react";
import { GuidanceDetailPanel } from "./GuidanceDetailPanel";
import { GUIDANCE_DETAIL_PANEL_FIXTURE } from "./guidanceDetailPanelData";

const fixture = GUIDANCE_DETAIL_PANEL_FIXTURE;

describe("GuidanceDetailPanel Organism", () => {
  it("renders nothing without a title", () => {
    const { container } = render(<GuidanceDetailPanel {...fixture} title="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the title as an h2 that labels the section", () => {
    render(<GuidanceDetailPanel {...fixture} />);

    const heading = screen.getByRole("heading", { level: 2, name: "Buying a home" });
    expect(heading.id).toBe("buying-a-home-heading");
    expect(screen.getByRole("region", { name: "Buying a home" })).toBeDefined();
  });

  it("shifts every heading when a different headingLevel is given", () => {
    render(<GuidanceDetailPanel {...fixture} headingLevel="h3" />);

    expect(screen.getByRole("heading", { level: 3, name: "Buying a home" })).toBeDefined();
    expect(screen.getAllByRole("heading", { level: 4 }).map((h) => h.textContent)).toEqual([
      "Popular starting points",
      "Useful tools",
    ]);
    expect(screen.getAllByRole("heading", { level: 5 })).toHaveLength(6);
  });

  it("renders the description, note and CTA button", () => {
    render(<GuidanceDetailPanel {...fixture} />);

    expect(screen.getByText(/Explore guidance to help you prepare/)).toBeDefined();
    expect(screen.getByText(/The questions worth asking/)).toBeDefined();
    const cta = screen.getByRole("link", { name: "See full guidance" });
    expect(cta.getAttribute("href")).toBe("/guidance/buying-a-home");
  });

  it("renders the image with its alt text", () => {
    render(<GuidanceDetailPanel {...fixture} />);

    const img = screen.getByRole("img", { name: fixture.imageAlt });
    expect(decodeURIComponent(img.getAttribute("src") ?? "")).toContain(
      "/images/guidance/buying-a-home.jpg"
    );
  });

  it("renders the starting points as a list of linked cards with h4 titles", () => {
    render(<GuidanceDetailPanel {...fixture} />);

    const group = screen.getByRole("region", { name: "Popular starting points" });
    const items = within(within(group).getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(within(group).getAllByRole("heading", { level: 4 }).map((h) => h.textContent)).toEqual([
      "Am I ready?",
      "What can I afford?",
      "Understanding mortgages(opens in a new tab)",
    ]);
    expect(within(items[0]).getByRole("link").getAttribute("href")).toBe(
      "/guidance/buying-a-home/am-i-ready"
    );
    expect(within(items[0]).getByText(/Understand the key factors/)).toBeDefined();
  });

  it("opens external card links safely and announces it", () => {
    render(<GuidanceDetailPanel {...fixture} />);

    const link = screen.getByRole("link", { name: /^Understanding mortgages/ });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders the tools with their labels and titles", () => {
    render(<GuidanceDetailPanel {...fixture} />);

    const group = screen.getByRole("region", { name: "Useful tools" });
    const items = within(within(group).getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(within(items[0]).getByText("Calculator")).toBeDefined();
    expect(within(items[2]).getByText("Checklist")).toBeDefined();
    expect(
      within(items[1]).getByRole("link", { name: "Affordability calculator" }).getAttribute("href")
    ).toBe("/tools/affordability-calculator");
  });

  it("renders unlinked cards without a link", () => {
    render(
      <GuidanceDetailPanel
        title="Panel"
        startingPoints={[{ title: "No link card" }]}
        tools={[{ title: "No link tool" }]}
      />
    );

    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByRole("heading", { level: 4, name: "No link card" })).toBeDefined();
    expect(screen.getByRole("heading", { level: 4, name: "No link tool" })).toBeDefined();
  });

  it("omits every optional slot when only the title is given", () => {
    const { container } = render(<GuidanceDetailPanel title="Panel" />);

    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getAllByRole("heading")).toHaveLength(1);
    expect(container.querySelectorAll("hr")).toHaveLength(0);
  });

  it("omits a group heading but keeps its cards when the heading is empty", () => {
    render(<GuidanceDetailPanel {...fixture} startingPointsHeading="" tools={[]} />);

    expect(screen.queryByText("Popular starting points")).toBeNull();
    expect(screen.queryByText("Useful tools")).toBeNull();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("hides decorative icons from assistive technology", () => {
    const { container } = render(<GuidanceDetailPanel {...fixture} />);

    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
    svgs.forEach((svg) => expect(svg.getAttribute("aria-hidden")).toBe("true"));
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ProcessCard } from "./ProcessCard";

describe("ProcessCard Atom Component", () => {
  it("renders mint variant with step number, title, and description", () => {
    render(
      <ProcessCard
        step={1}
        title="Open your new account"
        description="Start online or in a branch — about 10 minutes."
      />
    );
    expect(screen.getByText("1")).toBeDefined();
    expect(screen.getByText("Open your new account")).toBeDefined();
    expect(
      screen.getByText("Start online or in a branch — about 10 minutes.")
    ).toBeDefined();
  });

  it("renders neutral variant with correct class", () => {
    const { container } = render(
      <ProcessCard
        step={1}
        title="Open your new account"
        description="Start online or in a branch — about 10 minutes."
        variant="neutral"
      />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("neutral");
  });

  it("renders as link when href is provided", () => {
    render(
      <ProcessCard
        step={2}
        title="Verify your identity"
        description="Provide standard KYC documents."
        href="/verify"
      />
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/verify");
  });
});

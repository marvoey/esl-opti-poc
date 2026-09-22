import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { FinalCta } from "./FinalCta";
import { DEFAULT_FINAL_CTA_PROPS } from "./finalCtaData";

describe("FinalCta Organism", () => {
  it("renders the default heading and description", () => {
    render(<FinalCta {...DEFAULT_FINAL_CTA_PROPS} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Ready to open your ESL savings account?",
      })
    ).toBeDefined();
    expect(
      screen.getByText(
        "Pick the account that fits what you’re saving for. It takes about 10 minutes and $1 to open — and we’re here if you’d like a hand choosing."
      )
    ).toBeDefined();
  });

  it("renders the primary button as a link with the default href", () => {
    render(<FinalCta {...DEFAULT_FINAL_CTA_PROPS} />);

    const link = screen.getByRole("link", {
      name: /open a savings account/i,
    });
    expect(link.getAttribute("href")).toBe("#");
  });

  it("renders the eligibility note text", () => {
    render(<FinalCta {...DEFAULT_FINAL_CTA_PROPS} />);

    expect(
      screen.getByText(
        "Open to anyone who lives, works, or worships in our community."
      )
    ).toBeDefined();
  });

  it("marks the check icon as decorative with aria-hidden", () => {
    const { container } = render(<FinalCta {...DEFAULT_FINAL_CTA_PROPS} />);

    const icon = container.querySelector("svg");
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders custom heading, description, button and eligibility note", () => {
    render(
      <FinalCta
        heading="Custom heading"
        description="Custom description"
        buttonText="Custom button"
        buttonHref="/custom-href"
        eligibilityNote="Custom eligibility note"
      />
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Custom heading" })
    ).toBeDefined();
    expect(screen.getByText("Custom description")).toBeDefined();
    const link = screen.getByRole("link", { name: /custom button/i });
    expect(link.getAttribute("href")).toBe("/custom-href");
    expect(screen.getByText("Custom eligibility note")).toBeDefined();
  });

  it("applies the default id to the section element", () => {
    const { container } = render(<FinalCta {...DEFAULT_FINAL_CTA_PROPS} />);

    const section = container.querySelector("section");
    expect(section?.id).toBe("final-cta");
  });
});

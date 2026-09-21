import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { SwitchSupport, type SwitchSupportStep } from "./SwitchSupport";

const MOCK_STEPS: SwitchSupportStep[] = [
  {
    id: "step-photo-id",
    step: 1,
    title: "A photo ID",
    description: "A driver's license, state ID, or passport.",
  },
  {
    id: "step-ssn",
    step: 2,
    title: "Your SSN",
    description: "And your date of birth and contact info.",
  },
  {
    id: "step-dollar",
    step: 3,
    title: "$1 to open",
    description: "Your opening deposit and membership share.",
  },
];

describe("SwitchSupport Organism", () => {
  it("renders null when steps is empty", () => {
    const { container } = render(<SwitchSupport steps={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders heading and description", () => {
    render(
      <SwitchSupport
        title="Switching is simpler than it sounds."
        description="Easy Lorem ipsum / what you need:"
        steps={MOCK_STEPS}
      />
    );

    expect(
      screen.getByRole("heading", {
        name: "Switching is simpler than it sounds.",
      })
    ).toBeDefined();
    expect(
      screen.getByText("Easy Lorem ipsum / what you need:")
    ).toBeDefined();
  });

  it("renders one ProcessCard per step", () => {
    render(<SwitchSupport steps={MOCK_STEPS} />);

    MOCK_STEPS.forEach((item) => {
      expect(screen.getByText(item.title)).toBeDefined();
      expect(screen.getByText(item.description as string)).toBeDefined();
    });
  });

  it("renders the CTA button as a link with correct href and label", () => {
    render(
      <SwitchSupport
        steps={MOCK_STEPS}
        ctaLabel="Open a Premier Checking account"
        ctaHref="/personal/checking/open"
      />
    );

    const cta = screen.getByRole("link", {
      name: /Open a Premier Checking account/i,
    });
    expect(cta.getAttribute("href")).toBe("/personal/checking/open");
  });

  it("renders the caption link as a link with correct href and label", () => {
    render(
      <SwitchSupport
        steps={MOCK_STEPS}
        linkLabel="Lorem ipsum if needed"
        linkHref="/help"
      />
    );

    const link = screen.getByRole("link", {
      name: /Lorem ipsum if needed/i,
    });
    expect(link.getAttribute("href")).toBe("/help");
  });

  it("renders eyebrow when provided", () => {
    render(
      <SwitchSupport
        eyebrow="Easy Transition"
        title="Switching is simpler than it sounds."
        steps={MOCK_STEPS}
      />
    );

    expect(screen.getByText("Easy Transition")).toBeDefined();
    expect(
      screen.getByRole("heading", {
        name: "Switching is simpler than it sounds.",
      })
    ).toBeDefined();
  });

  it("renders rich text ReactNode description and step descriptions", () => {
    render(
      <SwitchSupport
        title="Switching is simpler than it sounds."
        description={<div data-testid="custom-desc">Rich description node</div>}
        steps={[
          {
            id: "step-1",
            step: 1,
            title: "Step with rich text",
            description: <span data-testid="step-desc-node">Rich step node</span>,
          },
        ]}
      />
    );

    expect(screen.getByTestId("custom-desc")).toBeDefined();
    expect(screen.getByTestId("step-desc-node")).toBeDefined();
  });
});

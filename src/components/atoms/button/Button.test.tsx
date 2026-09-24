import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Button } from "./Button";
import { UserIcon, ArrowRightIcon } from "../icons";

describe("Button Atom Component", () => {
  it("renders with default primary variant and md size", () => {
    render(<Button>Click Me</Button>);
    const btn = screen.getByRole("button", { name: "Click Me" });
    expect(btn.className).toContain("primary");
    expect(btn.className).toContain("sizeMd");
    expect(btn.className).toContain("pill");
    expect(btn.getAttribute("type")).toBe("button");
  });

  it("renders secondary variant", () => {
    render(<Button variant="secondary">Secondary Action</Button>);
    const btn = screen.getByRole("button", { name: "Secondary Action" });
    expect(btn.className).toContain("secondary");
  });

  it("renders outline variant", () => {
    render(<Button variant="outline">Outline Action</Button>);
    const btn = screen.getByRole("button", { name: "Outline Action" });
    expect(btn.className).toContain("outline");
  });

  it("renders compact sm size for form cards", () => {
    render(<Button size="sm">Form Action</Button>);
    const btn = screen.getByRole("button", { name: "Form Action" });
    expect(btn.className).toContain("sizeSm");
  });

  it("renders left icon slot properly", () => {
    render(
      <Button leftIcon={<UserIcon data-testid="user-icon" />}>
        Sign In
      </Button>
    );
    expect(screen.getByTestId("user-icon")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Sign In" })).not.toBeNull();
  });

  it("renders right icon slot properly and applies hasArrow class", () => {
    render(
      <Button rightIcon={<ArrowRightIcon data-testid="arrow-icon" />}>
        Learn more
      </Button>
    );
    const btn = screen.getByRole("button", { name: "Learn more" });
    expect(screen.getByTestId("arrow-icon")).not.toBeNull();
    expect(btn.className).toContain("hasArrow");
  });

  it("applies alignRight class when align='right' is specified", () => {
    render(
      <Button align="right" rightIcon={<ArrowRightIcon />}>
        Right Aligned
      </Button>
    );
    const btn = screen.getByRole("button", { name: "Right Aligned" });
    expect(btn.className).toContain("alignRight");
    expect(btn.className).toContain("hasArrow");
  });

  it("renders polymorphically as a Next.js Link when href is provided", () => {
    render(
      <Button href="/join" rightIcon={<ArrowRightIcon />}>
        Join ESL
      </Button>
    );
    const link = screen.getByRole("link", { name: "Join ESL" });
    expect(link.getAttribute("href")).toBe("/join");
    expect(link.className).toContain("primary");
  });

  it("renders tertiary variant using outline styles", () => {
    render(<Button variant="tertiary">Tertiary Action</Button>);
    const btn = screen.getByRole("button", { name: "Tertiary Action" });
    expect(btn.className).toMatch(/tertiary|outline/);
  });

  it("supports explicit HTML button types (submit/reset)", () => {
    render(<Button type="submit">Submit Form</Button>);
    const btn = screen.getByRole("button", { name: "Submit Form" });
    expect(btn.getAttribute("type")).toBe("submit");
  });

  it("handles disabled and aria-busy state properly for WCAG accessibility", () => {
    render(<Button disabled isLoading>Submitting</Button>);
    const btn = screen.getByRole("button", { name: "Submitting" }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute("aria-busy")).toBe("true");
  });
});

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Header } from "./Header";
import { NavigationModel } from "@/domain/models/Navigation";

describe("Header Component", () => {
  it("renders the brand logo, default nav items, and Join/Sign in actions", () => {
    render(<Header />);

    const brandLink = screen.getByRole("link", { name: /main navigation/i });
    expect(brandLink).toBeDefined();
    expect(brandLink.getAttribute("href")).toBe("/");

    expect(screen.getByRole("button", { name: /personal/i })).toBeDefined();
    expect(screen.getByRole("link", { name: "Business" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Wealth" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Membership" })).toBeDefined();

    const joinButtons = screen.getAllByRole("link", { name: "Join" });
    expect(joinButtons.length).toBeGreaterThan(0);
    expect(joinButtons[0].getAttribute("href")).toBe("/join");

    const signInButtons = screen.getAllByRole("link", { name: /sign in/i });
    expect(signInButtons.length).toBeGreaterThan(0);
    expect(signInButtons[0].getAttribute("href")).toBe("/sign-in");
  });

  it("supports custom navLinks and action overrides", () => {
    render(
      <Header
        brandHref="/custom-home"
        navLinks={[
          { label: "Products", href: "/products" },
          { label: "About", href: "/about" },
        ]}
        joinText="Get Started"
        joinHref="/get-started"
      />
    );

    const brandLink = screen.getByRole("link", { name: /main navigation/i });
    expect(brandLink.getAttribute("href")).toBe("/custom-home");

    expect(screen.getByRole("link", { name: "Products" })).toBeDefined();
    expect(screen.getByRole("link", { name: "About" })).toBeDefined();
    expect(screen.queryByRole("button", { name: /personal/i })).toBeNull();

    const cta = screen.getAllByRole("link", { name: "Get Started" })[0];
    expect(cta.getAttribute("href")).toBe("/get-started");
  });

  it("supports backward-compatible navigation model prop", () => {
    const mockNav: NavigationModel = {
      brandName: "Enterprise App",
      brandHref: "/app",
      items: [
        { id: "1", label: "Overview", href: "/overview", isExternal: false },
        { id: "2", label: "Documentation", href: "/docs", isExternal: false },
      ],
    };

    render(<Header navigation={mockNav} />);

    expect(screen.getByRole("link", { name: "Overview" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Documentation" })).toBeDefined();
  });

  it("opens the Personal mega menu on trigger click and closes on Escape", () => {
    render(<Header />);

    const trigger = screen.getByRole("button", { name: /personal/i });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Manage")).toBeDefined();
    expect(screen.getByText("Checking Accounts")).toBeDefined();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});

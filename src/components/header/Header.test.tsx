import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Header } from "./Header";
import { NavigationModel } from "@/domain/models/Navigation";

describe("Header Component", () => {
  it("renders default brand logo, navigation links, and explore docs CTA", () => {
    render(<Header />);

    // Brand link with accessible label
    const brandLink = screen.getByRole("link", { name: /main navigation/i });
    expect(brandLink).toBeDefined();
    expect(brandLink.getAttribute("href")).toBe("/");

    // Default nav links
    expect(screen.getByRole("link", { name: "Home" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Features" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Architecture" })).toBeDefined();
    expect(screen.getByRole("link", { name: "FAQ" })).toBeDefined();

    // CTA button
    const ctaButton = screen.getByRole("link", { name: /explore docs/i });
    expect(ctaButton).toBeDefined();
    expect(ctaButton.getAttribute("href")).toBe("https://docs.developers.optimizely.com");
  });

  it("supports custom navLinks and CTA overrides", () => {
    render(
      <Header
        brandHref="/custom-home"
        navLinks={[
          { label: "Products", href: "/products" },
          { label: "About", href: "/about" },
        ]}
        ctaText="Get Started"
        ctaHref="/get-started"
      />
    );

    const brandLink = screen.getByRole("link", { name: /main navigation/i });
    expect(brandLink.getAttribute("href")).toBe("/custom-home");

    expect(screen.getByRole("link", { name: "Products" })).toBeDefined();
    expect(screen.getByRole("link", { name: "About" })).toBeDefined();
    expect(screen.queryByRole("link", { name: "Features" })).toBeNull();

    const cta = screen.getByRole("link", { name: /get started/i });
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
});

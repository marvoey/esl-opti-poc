import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Header } from "./Header";
import { NavigationModel } from "@/domain/models/Navigation";

describe("Header Component", () => {
  it("renders CMS brand logo, navigation links, and explore docs CTA when provided", () => {
    render(
      <Header
        logoUrl="https://cdn.example.com/esl-header-logo.png"
        logoAlt="ESL Federal Credit Union"
        brandHref="/"
        navLinks={[
          { id: "nav-home", label: "Home", href: "/" },
          { id: "nav-features", label: "Features", href: "/#features" },
        ]}
        ctaText="Explore Docs"
        ctaHref="https://docs.developers.optimizely.com"
      />
    );

    // Brand link with CMS logo
    const brandLink = screen.getByRole("link", { name: /esl federal credit union/i });
    expect(brandLink).toBeDefined();
    expect(brandLink.getAttribute("href")).toBe("/");

    const logoImg = screen.getByAltText("ESL Federal Credit Union");
    expect(logoImg).toBeDefined();
    expect(logoImg.getAttribute("src")).toBe("https://cdn.example.com/esl-header-logo.png");

    // Nav links
    expect(screen.getByRole("link", { name: "Home" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Features" })).toBeDefined();

    // CTA button
    const ctaButton = screen.getByRole("link", { name: /explore docs/i });
    expect(ctaButton).toBeDefined();
    expect(ctaButton.getAttribute("href")).toBe("https://docs.developers.optimizely.com");
  });

  it("enforces headless rules: does not render logo or CTA when not provided in CMS (no hardcoded fallback)", () => {
    render(<Header />);

    // No logo image or brand link
    expect(screen.queryByRole("link", { name: /main navigation/i })).toBeNull();
    expect(screen.queryByRole("img")).toBeNull();

    // No nav links
    expect(screen.queryByRole("navigation")).toBeNull();

    // No CTA button
    expect(screen.queryByRole("link", { name: /explore docs/i })).toBeNull();
  });

  it("supports custom navLinks and CTA overrides", () => {
    render(
      <Header
        logoUrl="https://cdn.example.com/logo.svg"
        logoAlt="Custom Logo"
        brandHref="/custom-home"
        navLinks={[
          { label: "Products", href: "/products" },
          { label: "About", href: "/about" },
        ]}
        ctaText="Get Started"
        ctaHref="/get-started"
      />
    );

    const brandLink = screen.getByRole("link", { name: /custom logo/i });
    expect(brandLink.getAttribute("href")).toBe("/custom-home");

    expect(screen.getByRole("link", { name: "Products" })).toBeDefined();
    expect(screen.getByRole("link", { name: "About" })).toBeDefined();
    expect(screen.queryByRole("link", { name: "Features" })).toBeNull();

    const cta = screen.getByRole("link", { name: /get started/i });
    expect(cta.getAttribute("href")).toBe("/get-started");
    expect(cta.getAttribute("target")).toBeNull();
  });

  it("opens CTA in new tab only when ctaTarget is '_blank' or ctaExternal is true", () => {
    render(
      <Header
        ctaText="Explore Docs"
        ctaHref="https://docs.developers.optimizely.com"
        ctaTarget="_blank"
      />
    );

    const ctaButton = screen.getByRole("link", { name: /explore docs/i });
    expect(ctaButton.getAttribute("target")).toBe("_blank");
    expect(ctaButton.getAttribute("rel")).toBe("noopener noreferrer");
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

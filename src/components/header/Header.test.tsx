import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Header } from "./Header";
import { NavigationModel } from "@/domain/models/Navigation";

describe("Header Component", () => {
  it("renders the brand logo, default nav items, and Join/Sign in actions by default", () => {
    render(<Header />);

    const brandLink = screen.getByRole("link", { name: /esl federal credit union/i });
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
    // next/image serves the logo through its optimizer, so the CMS URL is carried
    // in the `url` query param rather than being the src verbatim.
    expect(decodeURIComponent(logoImg.getAttribute("src") ?? "")).toContain(
      "https://cdn.example.com/esl-header-logo.png"
    );

    // Nav links
    expect(screen.getByRole("link", { name: "Home" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Features" })).toBeDefined();

    // CTA button
    const ctaButton = screen.getByRole("link", { name: /explore docs/i });
    expect(ctaButton).toBeDefined();
    expect(ctaButton.getAttribute("href")).toBe("https://docs.developers.optimizely.com");
  });

  it("supports custom navLinks and action overrides", () => {
    render(
      <Header
        logoUrl="https://cdn.example.com/logo.svg"
        logoAlt="Custom Logo"
        brandHref="/custom-home"
        navLinks={[
          { label: "Products", href: "/products" },
          { label: "About", href: "/about" },
        ]}
        joinText="Get Started"
        joinHref="/get-started"
      />
    );

    const brandLink = screen.getByRole("link", { name: /custom logo/i });
    expect(brandLink.getAttribute("href")).toBe("/custom-home");

    expect(screen.getByRole("link", { name: "Products" })).toBeDefined();
    expect(screen.getByRole("link", { name: "About" })).toBeDefined();
    expect(screen.queryByRole("button", { name: /personal/i })).toBeNull();

    const cta = screen.getAllByRole("link", { name: "Get Started" })[0];
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

  it("renders both primary and secondary CTAs when provided", () => {
    render(
      <Header
        ctaText="Apply Now"
        ctaHref="/apply"
        secondaryCtaText="Contact Us"
        secondaryCtaHref="/contact"
        secondaryCtaTarget="_blank"
      />
    );

    const primaryCta = screen.getAllByRole("link", { name: "Apply Now" })[0];
    expect(primaryCta).toBeDefined();
    expect(primaryCta.getAttribute("href")).toBe("/apply");

    const secondaryCta = screen.getAllByRole("link", { name: "Contact Us" })[0];
    expect(secondaryCta).toBeDefined();
    expect(secondaryCta.getAttribute("href")).toBe("/contact");
    expect(secondaryCta.getAttribute("target")).toBe("_blank");
    expect(secondaryCta.getAttribute("rel")).toBe("noopener noreferrer");

    // Default join/sign-in should NOT be present when CMS actions are provided
    expect(screen.queryByRole("link", { name: "Join" })).toBeNull();
  });

  it("renders icons on primary and secondary CTAs when provided", () => {
    const { container } = render(
      <Header
        ctaText="Explore"
        ctaHref="/explore"
        ctaIcon="arrow-right"
        secondaryCtaText="Sign In"
        secondaryCtaHref="/sign-in"
        secondaryCtaIcon="user"
      />
    );

    const primaryCta = screen.getAllByRole("link", { name: /explore/i })[0];
    const secondaryCta = screen.getAllByRole("link", { name: /sign in/i })[0];

    // Both buttons should contain SVG icons
    expect(primaryCta.querySelector("svg")).not.toBeNull();
    expect(secondaryCta.querySelector("svg")).not.toBeNull();
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

  it("renders custom variants for primary and secondary CTA buttons", () => {
    render(
      <Header
        ctaText="Explore"
        ctaHref="/explore"
        ctaVariant="light"
        secondaryCtaText="Sign In"
        secondaryCtaHref="/sign-in"
        secondaryCtaVariant="dark"
      />
    );

    const primaryCta = screen.getAllByRole("link", { name: /explore/i })[0];
    const secondaryCta = screen.getAllByRole("link", { name: /sign in/i })[0];

    // Primary with "light" should have outline class
    expect(primaryCta.className).toContain("outline");
    // Secondary with "dark" should have primary class
    expect(secondaryCta.className).toContain("primary");
  });

  it("supports multiple mega menus that open and toggle independently", () => {
    render(
      <Header
        navLinks={[
          {
            id: "nav-personal",
            label: "Personal",
            href: "/personal",
            megaMenu: {
              viewAllLabel: "View All Personal",
              viewAllHref: "/personal",
              columns: [
                {
                  heading: "Personal Manage",
                  items: [{ icon: "landmark", label: "Checking", href: "/checking" }],
                },
              ],
              promo: {
                eyebrow: "Wellness",
                heading: "Personal Guidance",
                description: "Guidance for you",
                ctaLabel: "Learn more",
                ctaHref: "/personal-guidance",
              },
            },
          },
          {
            id: "nav-business",
            label: "Business",
            href: "/business",
            megaMenu: {
              viewAllLabel: "View All Business",
              viewAllHref: "/business",
              columns: [
                {
                  heading: "Business Growth",
                  items: [{ icon: "store", label: "Merchant Services", href: "/merchants" }],
                },
              ],
              promo: {
                eyebrow: "Enterprise",
                heading: "Business Advisory",
                description: "Guidance for your company",
                ctaLabel: "Get advisory",
                ctaHref: "/business-advisory",
              },
            },
          },
        ]}
      />
    );

    const personalTrigger = screen.getByRole("button", { name: /personal/i });
    const businessTrigger = screen.getByRole("button", { name: /business/i });

    expect(personalTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(businessTrigger.getAttribute("aria-expanded")).toBe("false");

    // Click Personal
    fireEvent.click(personalTrigger);
    expect(personalTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(businessTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByText("Personal Manage")).toBeDefined();

    // Click Business (should switch active menu)
    fireEvent.click(businessTrigger);
    expect(personalTrigger.getAttribute("aria-expanded")).toBe("false");
    expect(businessTrigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Business Growth")).toBeDefined();
  });
});

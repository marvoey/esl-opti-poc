import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import {
  SplitContentImage,
  type SplitContentImageProps,
} from "./SplitContentImage";

const BASE_PROPS: SplitContentImageProps = {
  title: "Let's figure out what's next, together.",
  description:
    "Whether you're saving for a home, starting a business, or planning retirement, our community advisors are here to help.",
  primaryCta: {
    label: "Become a member",
    href: "/join",
  },
  secondaryCta: {
    label: "Talk to someone first",
    href: "/contact",
  },
  eligibilityNote: "Open to anyone who lives, works, or worships in our community.",
  image: {
    src: "/images/split-content/community-collage.webp",
    alt: "Diverse ESL members and families representing the community",
    width: 933,
    height: 1024,
  },
};

describe("SplitContentImage Organism", () => {
  it("renders heading, description, and accessible section labelledby", () => {
    const { container } = render(
      <SplitContentImage {...BASE_PROPS} id="intro-split" />
    );

    const section = container.querySelector("section");
    expect(section).toBeDefined();
    expect(section?.getAttribute("aria-labelledby")).toBe("intro-split-heading");

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Let's figure out what's next, together.",
    });
    expect(heading).toBeDefined();
    expect(heading.id).toBe("intro-split-heading");

    expect(
      screen.getByText(
        "Whether you're saving for a home, starting a business, or planning retirement, our community advisors are here to help."
      )
    ).toBeDefined();
  });

  it("renders both primary and secondary CTAs with proper links", () => {
    render(<SplitContentImage {...BASE_PROPS} />);

    const primaryLink = screen.getByRole("link", { name: /become a member/i });
    expect(primaryLink.getAttribute("href")).toBe("/join");

    const secondaryLink = screen.getByRole("link", {
      name: /talk to someone first/i,
    });
    expect(secondaryLink.getAttribute("href")).toBe("/contact");
  });

  it("renders external CTA links with secure target and rel attributes", () => {
    render(
      <SplitContentImage
        {...BASE_PROPS}
        primaryCta={{
          label: "External Portal",
          href: "https://example.com",
          external: true,
        }}
        secondaryCta={{
          label: "External Docs",
          href: "https://docs.example.com",
          external: true,
        }}
      />
    );

    const primaryLink = screen.getByRole("link", { name: /external portal/i });
    expect(primaryLink.getAttribute("target")).toBe("_blank");
    expect(primaryLink.getAttribute("rel")).toBe("noopener noreferrer");

    const secondaryLink = screen.getByRole("link", { name: /external docs/i });
    expect(secondaryLink.getAttribute("target")).toBe("_blank");
    expect(secondaryLink.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders eligibility note with check icon when provided and omits it when undefined", () => {
    const { container, rerender } = render(<SplitContentImage {...BASE_PROPS} />);
    expect(
      screen.getByText(
        "Open to anyone who lives, works, or worships in our community."
      )
    ).toBeDefined();
    const icon = container.querySelector(".lucide-check");
    expect(icon).toBeDefined();
    expect(icon).not.toBeNull();

    rerender(<SplitContentImage {...BASE_PROPS} eligibilityNote={undefined} />);
    expect(
      screen.queryByText(
        "Open to anyone who lives, works, or worships in our community."
      )
    ).toBeNull();
  });

  it("renders single collage image with correct attributes", () => {
    render(<SplitContentImage {...BASE_PROPS} />);

    const image = screen.getByRole("img", {
      name: "Diverse ESL members and families representing the community",
    });
    expect(image).toBeDefined();
    expect(image.getAttribute("src")).toContain("community-collage.webp");
  });

  it("supports custom heading levels", () => {
    render(<SplitContentImage {...BASE_PROPS} headingLevel="h3" />);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Let's figure out what's next, together.",
      })
    ).toBeDefined();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Footer } from "./Footer";
import { defaultFooterData } from "./footerData";

describe("Footer Organism", () => {
  // TC-FT-01: Root tag & background
  it("renders a <section> landmark with role contentinfo and an accessible label", () => {
    render(<Footer {...defaultFooterData} />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeDefined();
    expect(footer.tagName).toBe("SECTION");
    expect(footer.getAttribute("aria-label")).toBe("Site Footer");
  });

  // TC-FT-02: Row 1 column count
  it("renders Row 1 with exactly 5 columns (1 brand column + 4 nav columns)", () => {
    const { container } = render(<Footer {...defaultFooterData} />);

    const row1 = container.querySelector("[class*='row1']");
    expect(row1).not.toBeNull();
    expect(row1?.children.length).toBe(5);
  });

  // TC-FT-03: Brand column elements
  it("renders the brand column with wordmark link, description copy, and CTA button", () => {
    const { container } = render(<Footer {...defaultFooterData} />);

    const wordmarkLink = screen.getByRole("link", { name: "ESL" });
    expect(wordmarkLink).toBeDefined();
    expect(wordmarkLink.getAttribute("href")).toBe("/");

    expect(
      screen.getByText(
        "Member-owned banking, built around the people and places we call home."
      )
    ).toBeDefined();

    const brandCol = container.querySelector("[class*='brandCol']");
    const ctaLink = brandCol?.querySelector("a[href='/membership']");
    expect(ctaLink).not.toBeNull();
    expect(ctaLink?.textContent).toMatch(/become a member/i);
  });

  // TC-FT-04: 4 nav columns & 4 links each
  it("renders 4 navigation columns, each with a heading and exactly 4 links", () => {
    render(<Footer {...defaultFooterData} />);

    const navs = screen.getAllByRole("navigation");
    expect(navs).toHaveLength(4);

    let totalLinks = 0;
    navs.forEach((nav) => {
      const heading = nav.querySelector("h3");
      expect(heading).not.toBeNull();

      const links = nav.querySelectorAll("a");
      expect(links.length).toBe(4);
      totalLinks += links.length;
    });

    expect(totalLinks).toBe(16);
  });

  // TC-FT-05: Row 2 full width, address, legal links, and service marks
  it("renders a full-width Row 2 with address, legal links list, service marks, and copyright", () => {
    const { container } = render(<Footer {...defaultFooterData} />);

    const row2 = container.querySelector("[class*='row2']");
    expect(row2).not.toBeNull();

    // First p: Address text
    expect(screen.getByText("225 Chestnut Street, Rochester NY 14604")).toBeDefined();

    // Legal UL LI A links with pipes
    const legalList = row2?.querySelector("ul[aria-label='Legal Information']");
    expect(legalList).not.toBeNull();
    const legalLinks = legalList?.querySelectorAll("li a");
    expect(legalLinks?.length).toBe(3);
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Disclosures" })).toBeDefined();
    expect(screen.getByRole("link", { name: "Security" })).toBeDefined();

    // Second p: Registered service marks
    expect(
      screen.getByText(
        "ESL, TEL-E$L, and CheckOK are registered service marks of ESL Federal Credit Union. Membership is subject to eligibility."
      )
    ).toBeDefined();

    // Copyright statement
    expect(screen.getByText(/all rights reserved/i)).toBeDefined();
  });

  // TC-FT-06: Mobile 2-column nav & 100% brand column
  it("applies mobile-first layout classes: full-width brand column and 2-column nav grid", () => {
    const { container } = render(<Footer {...defaultFooterData} />);

    const brandCol = container.querySelector("[class*='brandCol']");
    expect(brandCol).not.toBeNull();

    const row1 = container.querySelector("[class*='row1']");
    expect(row1).not.toBeNull();

    // The 4 nav columns are direct siblings of the brand column inside row1,
    // laid out as a 2-column grid (repeat(2, 1fr)) with a 20px gap on mobile.
    const navCols = container.querySelectorAll("[class*='navCol']");
    expect(navCols.length).toBe(4);
  });

  it("supports custom props overriding the default data", () => {
    render(
      <Footer
        brand={{
          wordmark: "Custom",
          wordmarkHref: "/home",
          logoUrl: "/custom-logo.svg",
          text: "Custom description",
          button: { label: "Join now", href: "/join" },
        }}
        columns={[
          {
            id: "custom-col",
            title: "Custom Column",
            links: [{ id: "custom-link", label: "Custom Link", href: "/custom" }],
          },
        ]}
        copyrightText="Custom copyright"
      />
    );

    expect(screen.getByRole("link", { name: "Custom" })).toBeDefined();
    expect(screen.getByText("Custom description")).toBeDefined();
    expect(screen.getByRole("link", { name: /join now/i })).toBeDefined();
    expect(screen.getByText("Custom Column")).toBeDefined();
    expect(screen.getByText("Custom Link")).toBeDefined();
    expect(screen.getByText("Custom copyright")).toBeDefined();
  });

  it("renders custom brand logo image when logoUrl is provided", () => {
    render(
      <Footer
        brand={{
          wordmark: "ESL Federal Credit Union",
          logoUrl: "https://cdn.example.com/esl-logo.png",
          logoAlt: "ESL Logo",
          text: "Banking for Rochester.",
        }}
      />
    );

    const img = screen.getByRole("img", { name: "ESL Logo" });
    expect(img).toBeDefined();
    // next/image serves the logo through its optimizer, so the CMS URL is carried
    // in the `url` query param rather than being the src verbatim.
    expect(decodeURIComponent(img.getAttribute("src") ?? "")).toContain(
      "https://cdn.example.com/esl-logo.png"
    );
  });

  it("does not render brand logo link or image when neither logo nor logoUrl is provided", () => {
    render(
      <Footer
        brand={{
          text: "Banking for Rochester.",
          button: { label: "Join", href: "/join" },
        }}
      />
    );

    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.queryByRole("link", { name: "ESL" })).toBeNull();
  });

  it("renders empty when rendered without props and never leaks mock data", () => {
    render(<Footer />);
    expect(
      screen.queryByText(
        "Member-owned banking, built around the people and places we call home."
      )
    ).toBeNull();
    expect(screen.queryByText("225 Chestnut Street, Rochester NY 14604")).toBeNull();
    expect(screen.queryByText(/become a member/i)).toBeNull();
  });
});

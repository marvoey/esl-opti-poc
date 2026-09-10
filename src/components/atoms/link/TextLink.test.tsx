import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { TextLink } from "./TextLink";

describe("TextLink Atom Component", () => {
  it("renders dark variant by default with link role, href, and underlineHover", () => {
    render(<TextLink href="/contact">Customer Service</TextLink>);
    const link = screen.getByRole("link", { name: "Customer Service" });
    expect(link.getAttribute("href")).toBe("/contact");
    expect(link.className).toContain("dark");
    expect(link.className).toContain("underlineHover");
  });

  it("renders light variant with correct class and default underlineAlways", () => {
    render(
      <TextLink href="/contact" variant="light">
        Customer Service
      </TextLink>
    );
    const link = screen.getByRole("link", { name: "Customer Service" });
    expect(link.className).toContain("light");
    expect(link.className).toContain("underlineAlways");
  });

  it("supports overriding underline behavior", () => {
    render(
      <TextLink href="/contact" variant="dark" underline="always">
        Underlined Dark Link
      </TextLink>
    );
    const link = screen.getByRole("link", { name: "Underlined Dark Link" });
    expect(link.className).toContain("underlineAlways");
  });

  it("handles external links with rel and target", () => {
    render(
      <TextLink href="https://example.com" external>
        External Help
      </TextLink>
    );
    const link = screen.getByRole("link", { name: "External Help" });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("supports underline='none' without underlineAlways class", () => {
    render(
      <TextLink href="/about" variant="light" underline="none">
        No Underline Link
      </TextLink>
    );
    const link = screen.getByRole("link", { name: "No Underline Link" });
    expect(link.className).toContain("underlineNone");
    expect(link.className).not.toContain("underlineAlways");
  });
});

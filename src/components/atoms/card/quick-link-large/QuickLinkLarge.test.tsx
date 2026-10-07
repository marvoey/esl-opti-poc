import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { QuickLinkLarge } from "./QuickLinkLarge";

describe("QuickLinkLarge Atom Component", () => {
  it("renders default variant with title, link role, and href", () => {
    render(
      <QuickLinkLarge
        title="Customer Service"
        href="/customer-service"
      />
    );
    const link = screen.getByRole("link", { name: /Customer Service/i });
    expect(link.getAttribute("href")).toBe("/customer-service");
    expect(link.className).toContain("default");
  });

  it("renders active variant with correct class", () => {
    render(
      <QuickLinkLarge
        title="Customer Service"
        href="/customer-service"
        variant="active"
      />
    );
    const link = screen.getByRole("link", { name: /Customer Service/i });
    expect(link.className).toContain("active");
  });

  it("renders as accessible button when href is omitted", () => {
    render(
      <QuickLinkLarge
        title="Customer Service"
        type="button"
      />
    );
    const button = screen.getByRole("button", { name: /Customer Service/i });
    expect(button).toBeDefined();
  });

  it("renders image with alt text when imageSrc is provided", () => {
    render(
      <QuickLinkLarge
        title="Customer Service"
        imageSrc="/images/customer-support.png"
        imageAlt="Friendly representative ready to assist"
        href="/customer-service"
      />
    );
    const img = screen.getByRole("img", { name: /Friendly representative ready to assist/i });
    expect(decodeURIComponent(img.getAttribute("src") ?? "")).toContain(
      "/images/customer-support.png"
    );
  });

  it("renders placeholder container when imageSrc is omitted", () => {
    const { container } = render(
      <QuickLinkLarge
        title="Customer Service"
        href="/customer-service"
      />
    );
    expect(container.querySelector('[aria-hidden="true"]')).toBeDefined();
    expect(screen.queryByRole("img")).toBeNull();
  });
});

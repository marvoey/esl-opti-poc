import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Header } from "./Header";
import { NavigationModel } from "@/domain/models/Navigation";

describe("Header Component (Spec Verification)", () => {
  const mockNav: NavigationModel = {
    brandName: "Enterprise App",
    brandHref: "/",
    items: [
      { id: "1", label: "Overview", href: "/overview", isExternal: false },
      { id: "2", label: "Documentation", href: "/docs", isExternal: false },
    ],
  };

  it("renders the brand link and name from the domain model", () => {
    render(<Header navigation={mockNav} />);
    const brandElement = screen.getByText("Enterprise App");
    expect(brandElement).toBeDefined();
  });

  it("renders all navigation items provided by the domain model", () => {
    render(<Header navigation={mockNav} />);
    expect(screen.getByText("Overview")).toBeDefined();
    expect(screen.getByText("Documentation")).toBeDefined();
  });
});

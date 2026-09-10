import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Heading } from "./Heading";

describe("Heading Atom Component", () => {
  it("renders default level as h2 element", () => {
    render(<Heading>Section Title</Heading>);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("Section Title");
  });

  it("decouples semantic tag from visual level for accessibility", () => {
    render(
      <Heading level="h1" as="h3">
        Visual H1 with Semantic H3
      </Heading>
    );
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading.textContent).toBe("Visual H1 with Semantic H3");
  });

  it("renders h4 with correct content", () => {
    render(<Heading level="h4">Small Section Title</Heading>);
    const heading = screen.getByRole("heading", { level: 4 });
    expect(heading.textContent).toBe("Small Section Title");
  });
});

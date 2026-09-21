import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Disclosure } from "./Disclosure";
import { DEFAULT_DISCLOSURE_PROPS } from "./disclosureData";

describe("Disclosure", () => {
  it("renders null when items is empty", () => {
    const { container } = render(<Disclosure items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the heading text", () => {
    render(<Disclosure {...DEFAULT_DISCLOSURE_PROPS} />);
    expect(screen.getByText("DISCLOSURES:")).toBeDefined();
  });

  it("renders each item's bold text and regular text", () => {
    render(<Disclosure {...DEFAULT_DISCLOSURE_PROPS} />);

    DEFAULT_DISCLOSURE_PROPS.items.forEach((item) => {
      expect(screen.getByText(item.boldText)).toBeDefined();
      expect(screen.getByText(item.regularText as string)).toBeDefined();
    });
  });

  it("renders rich text ReactNode in regularText", () => {
    render(
      <Disclosure
        items={[
          {
            id: "test-1",
            boldText: "Notice:",
            regularText: <span data-testid="rich-regular">Custom rich node</span>,
          },
        ]}
      />
    );

    expect(screen.getByText("Notice:")).toBeDefined();
    expect(screen.getByTestId("rich-regular")).toBeDefined();
  });
});

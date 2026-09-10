import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Text, Micro, Caption, ButtonLabel } from "./Text";

describe("Text Atom Component", () => {
  it("renders default variant as p tag", () => {
    render(<Text>Body paragraph text</Text>);
    const el = screen.getByText("Body paragraph text");
    expect(el.tagName.toLowerCase()).toBe("p");
  });

  it("renders label variant as label tag by default", () => {
    render(<Text variant="label">Form Label</Text>);
    const el = screen.getByText("Form Label");
    expect(el.tagName.toLowerCase()).toBe("label");
  });

  it("renders caption variant as small tag by default", () => {
    render(<Text variant="caption">Footnote note</Text>);
    const el = screen.getByText("Footnote note");
    expect(el.tagName.toLowerCase()).toBe("small");
  });

  it("allows custom polymorphic override", () => {
    render(
      <Text variant="subhead" as="span">
        Inline subhead
      </Text>
    );
    const el = screen.getByText("Inline subhead");
    expect(el.tagName.toLowerCase()).toBe("span");
  });

  it("applies semantic color classes correctly", () => {
    const { container } = render(
      <Text variant="micro" color="secondary">
        Secondary text
      </Text>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("colorSecondary");
  });

  it("renders Micro shorthand component correctly", () => {
    render(<Micro color="accent">Micro text</Micro>);
    const el = screen.getByText("Micro text");
    expect(el.tagName.toLowerCase()).toBe("small");
    expect(el.className).toContain("micro");
    expect(el.className).toContain("colorAccent");
  });

  it("renders Caption shorthand and weight prop correctly", () => {
    render(<Caption weight="bold" color="inherit">Caption text</Caption>);
    const el = screen.getByText("Caption text");
    expect(el.tagName.toLowerCase()).toBe("small");
    expect(el.className).toContain("caption");
    expect(el.className).toContain("weightBold");
    expect(el.className).toContain("colorInherit");
  });

  it("renders ButtonLabel shorthand component correctly", () => {
    render(<ButtonLabel color="inherit">Button text</ButtonLabel>);
    const el = screen.getByText("Button text");
    expect(el.tagName.toLowerCase()).toBe("span");
    expect(el.className).toContain("button");
    expect(el.className).toContain("colorInherit");
  });
});

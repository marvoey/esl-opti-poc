import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { InformationalCard } from "./InformationalCard";
import { INFORMATIONAL_CARD_FIXTURE } from "./informationalCardData";

const fixture = INFORMATIONAL_CARD_FIXTURE;

describe("InformationalCard Organism", () => {
  it("renders nothing without a title", () => {
    const { container } = render(<InformationalCard {...fixture} title="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders an article labelled by an h2 title by default", () => {
    render(<InformationalCard {...fixture} />);

    const heading = screen.getByRole("heading", { level: 2, name: "Fixed-rate mortgage" });
    expect(heading.id).toBe("fixed-rate-mortgage-heading");
    expect(screen.getByRole("article", { name: "Fixed-rate mortgage" })).toBeDefined();
  });

  it("uses the given headingLevel", () => {
    render(<InformationalCard {...fixture} headingLevel="h3" />);
    expect(screen.getByRole("heading", { level: 3, name: "Fixed-rate mortgage" })).toBeDefined();
  });

  it("renders the badge, description and note with its bold label", () => {
    render(<InformationalCard {...fixture} />);

    expect(screen.getByText("Borrowing")).toBeDefined();
    expect(screen.getByText(/A payment that does not move/)).toBeDefined();
    const label = screen.getByText("Why it's here:");
    expect(label.tagName).toBe("STRONG");
    expect(label.parentElement?.textContent).toContain("the affordability question");
    expect(screen.getByRole("separator")).toBeDefined();
  });

  it("renders the CTA link and marks the card as interactive", () => {
    const { container } = render(<InformationalCard {...fixture} />);

    const link = screen.getByRole("link", { name: "See the details" });
    expect(link.getAttribute("href")).toBe("/borrowing/mortgages/fixed-rate");
    expect((container.firstChild as HTMLElement).className).toContain("interactive");
  });

  it("opens external links in a new tab", () => {
    render(
      <InformationalCard
        {...fixture}
        cta={{ label: "See the details", href: "https://example.com", external: true }}
      />
    );

    const link = screen.getByRole("link", { name: /^See the details/ });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("omits empty optional slots", () => {
    const { container } = render(<InformationalCard title="Fixed-rate mortgage" />);

    expect(screen.queryByText("Borrowing")).toBeNull();
    expect(screen.queryByRole("separator")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
    expect((container.firstChild as HTMLElement).className).not.toContain("interactive");
  });

  it("renders the note without a label", () => {
    render(<InformationalCard title="Fixed-rate mortgage" note="Plain note." />);

    expect(screen.getByText("Plain note.")).toBeDefined();
    expect(document.querySelector("strong")).toBeNull();
  });
});

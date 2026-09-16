import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { FaqStates, type FaqItem } from "./FaqStates";

const MOCK_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Who can open an ESL checking account?",
    answer: "If you live, work, worship, or attend school in our region, you're eligible to join.",
  },
  {
    id: "faq-2",
    question: "Is there a monthly fee?",
    answer: "No fee as long as your average monthly balance stays at $1,000 or more.",
  },
  {
    id: "faq-3",
    question: "How does the dividend work?",
    answer: "Premier Checking earns a competitive, variable dividend, compounded monthly.",
  },
];

describe("FaqStates Organism", () => {
  it("renders null when items is empty", () => {
    const { container } = render(<FaqStates items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders eyebrow, heading, description, and the help link", () => {
    render(
      <FaqStates
        eyebrow="COMMON QUESTIONS"
        title="Questions, answered simply."
        description="A few things people ask before opening."
        helpLinkLeadIn="More questions?"
        helpLinkText="Go to Help Center"
        helpLinkHref="/help"
        items={MOCK_ITEMS}
      />
    );

    expect(screen.getByText("COMMON QUESTIONS")).toBeDefined();
    expect(
      screen.getByRole("heading", { name: "Questions, answered simply." })
    ).toBeDefined();
    expect(
      screen.getByText("A few things people ask before opening.")
    ).toBeDefined();

    const link = screen.getByRole("link", { name: "Go to Help Center" });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/help");
  });

  it("renders one trigger button per item, all collapsed by default", () => {
    render(<FaqStates items={MOCK_ITEMS} />);

    const triggers = screen.getAllByRole("button");
    expect(triggers).toHaveLength(MOCK_ITEMS.length);

    MOCK_ITEMS.forEach((item, index) => {
      expect(triggers[index].textContent).toContain(item.question);
      expect(triggers[index].getAttribute("aria-expanded")).toBe("false");
    });
  });

  it("expands an item's panel and reveals its answer when its trigger is clicked", () => {
    render(<FaqStates items={MOCK_ITEMS} />);

    const triggers = screen.getAllByRole("button");
    fireEvent.click(triggers[0]);

    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");

    const panelId = triggers[0].getAttribute("aria-controls");
    const panel = document.getElementById(panelId as string);
    expect(panel?.getAttribute("aria-hidden")).toBe("false");
    expect(screen.getByText(MOCK_ITEMS[0].answer)).toBeDefined();
  });

  it("keeps a previously open item open when a second trigger is clicked (independent expand, no accordion close-others)", () => {
    render(<FaqStates items={MOCK_ITEMS} />);

    const triggers = screen.getAllByRole("button");
    fireEvent.click(triggers[0]);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(triggers[1]);

    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("true");
  });

  it("closes an item only when its own trigger is clicked again", () => {
    render(<FaqStates items={MOCK_ITEMS} />);

    const triggers = screen.getAllByRole("button");
    fireEvent.click(triggers[0]);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(triggers[0]);
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
  });
});

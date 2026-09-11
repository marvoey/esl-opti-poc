import { describe, it, expect } from "vitest";
import { MediaCardGridSchema, MediaCardItemSchema } from "./MediaCardGrid";

describe("MediaCardGrid Domain Model", () => {
  const validCard = {
    imageSrc: "/images/offers/auto-loan.jpg",
    title: "X.XX% APR on new auto loans",
    description: "Switch your everyday banking and we'll help you move everything over.",
    href: "/auto-loans",
  };

  it("validates a valid 2-card configuration", () => {
    const data = {
      cards: [
        { ...validCard, id: "card-1" },
        { ...validCard, id: "card-2" },
      ],
    };

    const parsed = MediaCardGridSchema.parse(data);
    expect(parsed.cards).toHaveLength(2);
    expect(parsed.eyebrow).toBe("WHAT'S NEW RIGHT NOW");
    expect(parsed.title).toBe("A few offers worth a look.");
  });

  it("validates a valid 3-card configuration", () => {
    const data = {
      cards: [
        { ...validCard, id: "card-1" },
        { ...validCard, id: "card-2" },
        { ...validCard, id: "card-3" },
      ],
    };

    const parsed = MediaCardGridSchema.parse(data);
    expect(parsed.cards).toHaveLength(3);
  });

  it("rejects less than 2 cards", () => {
    const data = {
      cards: [{ ...validCard, id: "card-1" }],
    };

    expect(() => MediaCardGridSchema.parse(data)).toThrow();
  });

  it("rejects more than 3 cards", () => {
    const data = {
      cards: [
        { ...validCard, id: "card-1" },
        { ...validCard, id: "card-2" },
        { ...validCard, id: "card-3" },
        { ...validCard, id: "card-4" },
      ],
    };

    expect(() => MediaCardGridSchema.parse(data)).toThrow();
  });
});

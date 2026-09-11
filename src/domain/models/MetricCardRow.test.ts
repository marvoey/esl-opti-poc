import { describe, it, expect } from "vitest";
import { MetricCardRowSchema } from "./MetricCardRow";

describe("MetricCardRow Domain Schema", () => {
  const validData = {
    eyebrow: "Competitive Rates",
    title: "Rates that work for your goals.",
    description: "Explore options.",
    cta: {
      label: "View all rates",
      href: "/rates",
    },
    cards: [
      {
        category: "Getting on the road",
        rate: "1.99",
        title: "Auto loans",
        description: "A loan that fits your life.",
        ctaText: "Explore auto loans",
        href: "/auto-loans",
      },
      {
        category: "Home financing",
        rate: "5.49",
        title: "Mortgages",
        description: "Competitive fixed rates.",
        variant: "active" as const,
      },
      {
        category: "Growing your savings",
        rate: "4.25",
        rateLabel: "APY",
        title: "High-Yield Savings",
        description: "Watch your money grow.",
      },
    ],
  };

  it("validates valid metric card row data", () => {
    const result = MetricCardRowSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("requires exactly 3 cards", () => {
    const invalidData = {
      ...validData,
      cards: validData.cards.slice(0, 2),
    };
    const result = MetricCardRowSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("applies default values for missing optional fields", () => {
    const minimalData = {
      cards: [
        {
          category: "Cat 1",
          rate: "1.00",
          title: "Title 1",
          description: "Desc 1",
        },
        {
          category: "Cat 2",
          rate: "2.00",
          title: "Title 2",
          description: "Desc 2",
        },
        {
          category: "Cat 3",
          rate: "3.00",
          title: "Title 3",
          description: "Desc 3",
        },
      ],
    };
    const result = MetricCardRowSchema.safeParse(minimalData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.eyebrow).toBe("Competitive Rates");
      expect(result.data.cards[0].rateUnit).toBe("%");
      expect(result.data.cards[0].rateLabel).toBe("APR");
      expect(result.data.cards[0].variant).toBe("default");
    }
  });
});

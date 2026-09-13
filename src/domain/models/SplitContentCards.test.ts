import { describe, it, expect } from "vitest";
import {
  SplitContentCardsSchema,
  SplitContentCardsHeroMetricSchema,
  SplitContentCardsStatItemSchema,
} from "./SplitContentCards";

describe("SplitContentCards Domain Model", () => {
  it("validates and populates default values correctly", () => {
    const result = SplitContentCardsSchema.parse({});

    expect(result.eyebrow).toBe("WHY OUR GUIDANCE IS DIFFERENT");
    expect(result.title).toBe("Advice from a bank you own.");
    expect(result.description).toContain("ESL is member-owned");
    expect(result.statCards).toEqual([]);
  });

  it("validates hero metric schema defaults and custom inputs", () => {
    const defaultHero = SplitContentCardsHeroMetricSchema.parse({});
    expect(defaultHero.value).toBe("$XX");
    expect(defaultHero.unit).toBe("million");

    const customHero = SplitContentCardsHeroMetricSchema.parse({
      subhead: "ANNUAL DIVIDEND",
      value: "$25",
      unit: "million",
      description: "Distributed back to loyal members.",
    });
    expect(customHero.value).toBe("$25");
    expect(customHero.description).toBe("Distributed back to loyal members.");
  });

  it("validates individual stat item schema requirements", () => {
    const validStat = SplitContentCardsStatItemSchema.parse({
      value: "100+",
      label: "years in Rochester",
    });
    expect(validStat.value).toBe("100+");
    expect(validStat.label).toBe("years in Rochester");

    expect(() =>
      SplitContentCardsStatItemSchema.parse({
        value: "",
        label: "missing value",
      })
    ).toThrow();
  });

  it("parses full model payload successfully", () => {
    const fullPayload = {
      id: "why-different",
      eyebrow: "OUR DIFFERENCE",
      title: "Advice built for you.",
      description: "Banking tailored around member prosperity.",
      cta: {
        label: "Explore membership",
        href: "/about/membership",
      },
      heroMetric: {
        subhead: "COMMUNITY IMPACT",
        value: "$30",
        unit: "million",
        description: "Reinvested directly into our communities.",
      },
      statCards: [
        { id: "stat-1", value: "25", label: "years of dividends" },
        { id: "stat-2", value: "98%", label: "member loyalty" },
      ],
      backgroundImage: "/images/custom-bg.svg",
    };

    const parsed = SplitContentCardsSchema.parse(fullPayload);
    expect(parsed.id).toBe("why-different");
    expect(parsed.statCards).toHaveLength(2);
    expect(parsed.cta?.label).toBe("Explore membership");
  });
});

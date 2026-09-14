import { describe, it, expect } from "vitest";
import {
  VerticalSelectorFeatureCardSchema,
  VerticalSelectorTabItemSchema,
  FeatureCardContentSchema,
} from "./VerticalSelectorFeatureCard";

describe("VerticalSelectorFeatureCard Domain Model", () => {
  const sampleTab = {
    id: "personal-checking",
    label: "Personal Checking",
    feature: {
      title: "Everyday Checking with Real Returns",
      description: "No monthly fees and annual Owners' Dividend returned directly to you.",
      image: {
        src: "/images/offers/checking.jpg",
        alt: "Checking card representation",
      },
      cta: {
        label: "Explore checking",
        href: "/checking",
      },
    },
  };

  it("validates and populates default model fields", () => {
    const result = VerticalSelectorFeatureCardSchema.parse({
      tabs: [sampleTab],
    });

    expect(result.eyebrow).toBe("BANKING FOR EVERY STAGE OF LIFE");
    expect(result.title).toBe("Wherever you are, we’ll help you take the next step.");
    expect(result.description).toContain("Pick the moment that fits your life right now");
    expect(result.tabs).toHaveLength(1);
  });

  it("validates individual tab item schema requirements", () => {
    const tab = VerticalSelectorTabItemSchema.parse(sampleTab);
    expect(tab.id).toBe("personal-checking");
    expect(tab.label).toBe("Personal Checking");
    expect(tab.feature.title).toBe("Everyday Checking with Real Returns");

    expect(() =>
      VerticalSelectorTabItemSchema.parse({
        id: "",
        label: "Missing ID",
      })
    ).toThrow();
  });

  it("validates feature card image default dimensions", () => {
    const content = FeatureCardContentSchema.parse({
      title: "Auto Loans",
      description: "Competitive rates on new and used vehicles.",
      image: {
        src: "/images/offers/auto-loan.jpg",
      },
    });

    expect(content.image.width).toBe(720);
    expect(content.image.height).toBe(328);
    expect(content.image.alt).toBe("Feature representation");
  });

  it("enforces minimum and maximum tab limits (1 to 8)", () => {
    expect(() =>
      VerticalSelectorFeatureCardSchema.parse({
        tabs: [],
      })
    ).toThrow(/At least 1 tab is required/);

    const nineTabs = Array.from({ length: 9 }, (_, i) => ({
      ...sampleTab,
      id: `tab-${i}`,
      label: `Tab ${i}`,
    }));

    expect(() =>
      VerticalSelectorFeatureCardSchema.parse({
        tabs: nineTabs,
      })
    ).toThrow(/Maximum 8 tabs allowed/);
  });
});

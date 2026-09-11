import { describe, it, expect } from "vitest";
import { HomePageSchema } from "./HomePage";
import mockHomeData from "@/infrastructure/cms/mock/data/home-page.json";

describe("HomePage Domain Model & Schema", () => {
  it("successfully validates mock home-page data", () => {
    const parsed = HomePageSchema.parse(mockHomeData);
    expect(parsed.heroSlider.slides.length).toBeGreaterThan(0);
    expect(parsed.snipeCta.title).toBeDefined();
    expect(parsed.tabbedSolutions.tabs.length).toBe(2);
    expect(parsed.sideBySidePromo.eyebrow).toBeDefined();
    expect(parsed.sideBySidePromoSecondary?.variant).toBe("light");
  });

  it("throws validation error when required heroSlider fields are missing", () => {
    const invalidData = {
      ...mockHomeData,
      heroSlider: {},
    };
    expect(() => HomePageSchema.parse(invalidData)).toThrow();
  });
});

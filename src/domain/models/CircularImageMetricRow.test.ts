import { describe, it, expect } from "vitest";
import {
  CircularImageMetricRowSchema,
  MetricItemSchema,
} from "./CircularImageMetricRow";

const VALID_METRIC = {
  image: {
    src: "/images/metrics/volunteers.webp",
    alt: "ESL employees volunteering at a local community center",
  },
  stat: "12,480",
  label: "Hours volunteered by ESL employees across Greater Rochester in 2023.",
};

const VALID_DATA = {
  eyebrow: "In the community",
  title: "Because we live here, too.",
  description:
    "We live and work where our members do. That connection shapes how we show up — in classrooms, on main streets, and at the causes close to home.",
  cta: {
    label: "See our community work",
    href: "/community",
  },
  metrics: [VALID_METRIC, VALID_METRIC, VALID_METRIC],
};

describe("CircularImageMetricRow Domain Model & Schema", () => {
  it("successfully validates a fully populated payload", () => {
    const parsed = CircularImageMetricRowSchema.parse(VALID_DATA);
    expect(parsed.eyebrow).toBe("In the community");
    expect(parsed.metrics).toHaveLength(3);
    expect(parsed.cta.href).toBe("/community");
  });

  it("applies default eyebrow, title, description, and cta when omitted", () => {
    const parsed = CircularImageMetricRowSchema.parse({
      metrics: [VALID_METRIC, VALID_METRIC, VALID_METRIC],
    });

    expect(parsed.eyebrow).toBe("In the community");
    expect(parsed.title).toBe("Because we live here, too.");
    expect(parsed.description).toContain("We live and work where our members do.");
    expect(parsed.cta).toEqual({
      label: "See our community work",
      href: "/community",
      external: false,
    });
  });

  it("defaults metric image alt, width, and height when omitted", () => {
    const parsed = MetricItemSchema.parse({
      image: { src: "/images/metrics/volunteers.webp" },
      stat: "12,480",
      label: "Hours volunteered.",
    });

    expect(parsed.image.alt).toBe("");
    expect(parsed.image.width).toBe(180);
    expect(parsed.image.height).toBe(180);
  });

  it("throws when metrics does not contain exactly 3 items", () => {
    expect(() =>
      CircularImageMetricRowSchema.parse({
        ...VALID_DATA,
        metrics: [VALID_METRIC, VALID_METRIC],
      })
    ).toThrow();

    expect(() =>
      CircularImageMetricRowSchema.parse({
        ...VALID_DATA,
        metrics: [VALID_METRIC, VALID_METRIC, VALID_METRIC, VALID_METRIC],
      })
    ).toThrow();
  });

  it("throws when a metric is missing required stat or label text", () => {
    expect(() =>
      MetricItemSchema.parse({
        image: { src: "/images/metrics/volunteers.webp" },
        stat: "",
        label: "Hours volunteered.",
      })
    ).toThrow();

    expect(() =>
      MetricItemSchema.parse({
        image: { src: "/images/metrics/volunteers.webp" },
        stat: "12,480",
        label: "",
      })
    ).toThrow();
  });

  it("throws when metric image source is missing", () => {
    expect(() =>
      MetricItemSchema.parse({
        image: { src: "" },
        stat: "12,480",
        label: "Hours volunteered.",
      })
    ).toThrow();
  });

  it("throws when cta label or href is missing", () => {
    expect(() =>
      CircularImageMetricRowSchema.parse({
        ...VALID_DATA,
        cta: { label: "", href: "/community" },
      })
    ).toThrow();

    expect(() =>
      CircularImageMetricRowSchema.parse({
        ...VALID_DATA,
        cta: { label: "See our community work", href: "" },
      })
    ).toThrow();
  });
});

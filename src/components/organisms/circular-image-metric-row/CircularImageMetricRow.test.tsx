import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import {
  CircularImageMetricRow,
  type CircularImageMetricRowProps,
} from "./CircularImageMetricRow";
import { DEFAULT_CIRCULAR_IMAGE_METRIC_ROW } from "./circularImageMetricRowData";

const BASE_PROPS: CircularImageMetricRowProps = {
  eyebrow: "In the community",
  title: "Because we live here, too.",
  description:
    "We live and work where our members do. That connection shapes how we show up — in classrooms, on main streets, and at the causes close to home.",
  cta: {
    label: "See our community work",
    href: "/community",
  },
  metrics: [
    {
      id: "metric-1",
      image: {
        src: "/images/metrics/volunteers.webp",
        alt: "ESL employees volunteering at a local community center",
        width: 180,
        height: 180,
      },
      stat: "12,480",
      label: "Hours volunteered by ESL employees across Greater Rochester in 2023.",
    },
    {
      id: "metric-2",
      image: {
        src: "/images/metrics/grants.webp",
        alt: "Local non-profit organization receiving community grant funding",
        width: 180,
        height: 180,
      },
      stat: "$2.4M",
      label: "Invested in local non-profits, youth education, and family stability.",
    },
    {
      id: "metric-3",
      image: {
        src: "/images/metrics/partnerships.webp",
        alt: "Community members participating in an educational financial workshop",
        width: 180,
        height: 180,
      },
      stat: "180+",
      label: "Community organizations and grassroots initiatives supported annually.",
    },
  ],
};

describe("CircularImageMetricRow Organism", () => {
  it("renders eyebrow, heading, and description with correct aria-labelledby wiring", () => {
    const { container } = render(
      <CircularImageMetricRow {...BASE_PROPS} id="community-impact" />
    );

    const section = container.querySelector("section");
    expect(section).toBeDefined();
    expect(section?.getAttribute("aria-labelledby")).toBe(
      "community-impact-heading"
    );

    expect(screen.getByText("In the community")).toBeDefined();

    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Because we live here, too.",
    });
    expect(heading).toBeDefined();
    expect(heading.id).toBe("community-impact-heading");

    expect(
      screen.getByText(
        "We live and work where our members do. That connection shapes how we show up — in classrooms, on main streets, and at the causes close to home."
      )
    ).toBeDefined();
  });

  it("renders the CTA with the correct href", () => {
    render(<CircularImageMetricRow {...BASE_PROPS} />);

    const cta = screen.getByRole("link", { name: /see our community work/i });
    expect(cta).toBeDefined();
    expect(cta.getAttribute("href")).toBe("/community");
    expect(cta.getAttribute("target")).toBeNull();
  });

  it("renders external CTA links with secure target and rel attributes", () => {
    render(
      <CircularImageMetricRow
        {...BASE_PROPS}
        cta={{
          label: "See our community work",
          href: "https://example.com/community",
          external: true,
        }}
      />
    );

    const cta = screen.getByRole("link", { name: /see our community work/i });
    expect(cta.getAttribute("target")).toBe("_blank");
    expect(cta.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders exactly 3 metric cards with correct stat text, label text, and image alt", () => {
    render(<CircularImageMetricRow {...BASE_PROPS} />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);

    expect(screen.getByText("12,480")).toBeDefined();
    expect(screen.getByText("$2.4M")).toBeDefined();
    expect(screen.getByText("180+")).toBeDefined();

    expect(
      screen.getByText(
        "Hours volunteered by ESL employees across Greater Rochester in 2023."
      )
    ).toBeDefined();
    expect(
      screen.getByText(
        "Invested in local non-profits, youth education, and family stability."
      )
    ).toBeDefined();
    expect(
      screen.getByText(
        "Community organizations and grassroots initiatives supported annually."
      )
    ).toBeDefined();

    expect(
      screen.getByAltText("ESL employees volunteering at a local community center")
    ).toBeDefined();
    expect(
      screen.getByAltText("Local non-profit organization receiving community grant funding")
    ).toBeDefined();
    expect(
      screen.getByAltText("Community members participating in an educational financial workshop")
    ).toBeDefined();
  });

  it("uses default content when no props are passed", () => {
    render(<CircularImageMetricRow />);

    expect(
      screen.getByText(DEFAULT_CIRCULAR_IMAGE_METRIC_ROW.eyebrow as string)
    ).toBeDefined();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: DEFAULT_CIRCULAR_IMAGE_METRIC_ROW.title as string,
      })
    ).toBeDefined();

    const link = screen.getByRole("link", {
      name: new RegExp(DEFAULT_CIRCULAR_IMAGE_METRIC_ROW.cta!.label, "i"),
    });
    expect(link.getAttribute("href")).toBe(
      DEFAULT_CIRCULAR_IMAGE_METRIC_ROW.cta!.href
    );

    expect(screen.getAllByRole("img")).toHaveLength(3);
  });

  it("supports custom heading levels", () => {
    render(<CircularImageMetricRow {...BASE_PROPS} headingLevel="h3" />);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Because we live here, too.",
      })
    ).toBeDefined();
  });
});

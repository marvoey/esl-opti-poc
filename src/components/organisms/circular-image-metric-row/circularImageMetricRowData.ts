import { type HeadingLevel } from "@/components/atoms/heading/Heading";

export interface MetricItem {
  id: string;
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  stat: string;
  label: string;
}

export interface CircularImageMetricRowProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  description?: string;
  cta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  metrics?: MetricItem[];
  className?: string;
}

/**
 * Default editorial community/impact content for the Circular Image Metric Row organism.
 */
export const DEFAULT_CIRCULAR_IMAGE_METRIC_ROW: CircularImageMetricRowProps = {
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

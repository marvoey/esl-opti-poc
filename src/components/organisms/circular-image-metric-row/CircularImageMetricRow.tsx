import React, { useId } from "react";
import Image from "next/image";
import { Heading, type HeadingLevel } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import { ArrowRightIcon } from "@/components/atoms/icons";
import styles from "./CircularImageMetricRow.module.css";

export interface MetricItem {
  id?: string;
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

/**
 * Circular Image Metric Row Organism
 * Editorial community/impact section composed of:
 * 1. A header row: constrained text block (eyebrow + h2 + body-lg description, max-width 585px)
 *    paired with a bottom-right aligned pill CTA button on desktop.
 * 2. A metrics row: 3 equal columns, each with a circular portrait image, a large Stat
 *    callout in Teal, and a centered Body label in Deep Navy.
 * Stacks to a single column (CTA below text, metrics stacked) below 768px.
 */
export function CircularImageMetricRow({
  id,
  eyebrow = DEFAULT_CIRCULAR_IMAGE_METRIC_ROW.eyebrow,
  title = DEFAULT_CIRCULAR_IMAGE_METRIC_ROW.title,
  headingLevel = "h2",
  description = DEFAULT_CIRCULAR_IMAGE_METRIC_ROW.description,
  cta = DEFAULT_CIRCULAR_IMAGE_METRIC_ROW.cta!,
  metrics = DEFAULT_CIRCULAR_IMAGE_METRIC_ROW.metrics!,
  className = "",
}: CircularImageMetricRowProps) {
  const autoId = useId();
  const headingId = `${id ?? autoId}-heading`;

  const sectionClassName = className
    ? `${styles.section} ${className}`
    : styles.section;

  const ctaExternalProps = cta.external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <section id={id} className={sectionClassName} aria-labelledby={headingId}>
      <div className={`container ${styles.container}`}>
        {/* Div 1: Header Row (100% Width) */}
        <div className={styles.headerRow}>
          <div className={styles.headerContent}>
            <Text as="span" variant="eyebrow" color="accent" className={styles.eyebrow}>
              {eyebrow}
            </Text>
            <Heading level={headingLevel} id={headingId} className={styles.title}>
              {title}
            </Heading>
            <Text
              as="p"
              variant="body-lg"
              color="primary"
              className={styles.description}
            >
              {description}
            </Text>
          </div>

          <div className={styles.headerCta}>
            <Button
              variant="primary"
              shape="pill"
              href={cta.href}
              rightIcon={<ArrowRightIcon size={20} />}
              {...ctaExternalProps}
            >
              {cta.label}
            </Button>
          </div>
        </div>

        {/* Div 2: Metrics Row (100% Width, Margin-Top: 48px) */}
        <div className={styles.metricsRow}>
          {metrics.map((item, index) => (
            <div key={item.id ?? index} className={styles.metricCard}>
              <div className={styles.imageWrapper}>
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width ?? 180}
                  height={item.image.height ?? 180}
                  className={styles.circleImage}
                />
              </div>
              <Text
                as="span"
                variant="stat"
                color="accent"
                className={styles.stat}
              >
                {item.stat}
              </Text>
              <Text
                as="p"
                variant="body"
                color="primary"
                className={styles.metricLabel}
              >
                {item.label}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

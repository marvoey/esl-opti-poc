import React, { useId } from "react";
import Image from "next/image";
import { Heading, type HeadingLevel } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import { ArrowRightIcon } from "@/components/atoms/icons";
import styles from "./CircularImageMetricRow.module.css";

import {
  type MetricItem,
  type CircularImageMetricRowProps,
  DEFAULT_CIRCULAR_IMAGE_METRIC_ROW,
} from "./circularImageMetricRowData";

export type { MetricItem, CircularImageMetricRowProps };

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
      <div className={styles.container}>
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
              align="right"
              href={cta.href}
              rightIcon={<ArrowRightIcon size={20} />}
              {...ctaExternalProps}
            >
              {cta.label}
            </Button>
          </div>
        </div>

        {/* Div 2: Metrics Row (100% Width, Margin-Top: 48px) */}
        <ul className={styles.metricsRow} role="list">
          {metrics.map((item) => (
            <li key={item.id ?? item.stat} className={styles.metricCard}>
              <div className={styles.imageWrapper}>
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="300px"
                  className={styles.circleImage}
                />
              </div>
              <div className={styles.textContent}>
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

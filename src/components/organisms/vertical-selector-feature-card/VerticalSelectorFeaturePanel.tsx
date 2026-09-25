import React from "react";
import Image from "next/image";
import { Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import { ArrowRightIcon } from "@/components/atoms/icons";
import type { VerticalSelectorTabItemData } from "./VerticalSelectorFeatureCard";
import styles from "./VerticalSelectorFeatureCard.module.css";

interface VerticalSelectorFeaturePanelProps {
  activeTab: VerticalSelectorTabItemData;
}

export function VerticalSelectorFeaturePanel({
  activeTab,
}: VerticalSelectorFeaturePanelProps) {
  const { feature } = activeTab;
  const featureCtaExternalProps = feature.cta?.external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <div
      id={`tabpanel-${activeTab.id}`}
      role="tabpanel"
      aria-labelledby={`tab-${activeTab.id}`}
      tabIndex={0}
      className={styles.featureCard}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={feature.image.src}
          alt={feature.image.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 720px"
          className={styles.featureImage}
        />
      </div>

      <div className={styles.textArea}>
        <Heading level="h3" className={styles.featureTitle}>
          {feature.title}
        </Heading>

        <Text
          as="p"
          variant="body-lg"
          color="primary"
          className={styles.featureDescription}
        >
          {feature.description}
        </Text>

        {feature.cta && (
          <div className={styles.featureAction}>
            <Button
              variant="primary"
              shape="pill"
              href={feature.cta.href}
              rightIcon={<ArrowRightIcon size={20} />}
              {...featureCtaExternalProps}
            >
              {feature.cta.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

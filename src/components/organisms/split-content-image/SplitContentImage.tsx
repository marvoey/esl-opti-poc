import React, { useId } from "react";
import Image from "next/image";
import { Heading, type HeadingLevel } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import { UserIcon, ArrowRightIcon, CheckIcon } from "@/components/atoms/icons";
import styles from "./SplitContentImage.module.css";

export interface SplitContentImageMedia {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface SplitContentImageCta {
  label: string;
  href: string;
  external?: boolean;
}

export interface SplitContentImageProps {
  id?: string;
  title: string;
  headingLevel?: HeadingLevel;
  description: string;
  primaryCta: SplitContentImageCta;
  secondaryCta: SplitContentImageCta;
  eligibilityNote?: string;
  image?: SplitContentImageMedia;
  className?: string;
}

/**
 * SplitContentImage Organism
 * A full-width section with a soft radial-gradient background, split into two columns:
 * text/CTA content on the left, a single optimized portrait collage image on the right.
 * Mobile layout flips the visual order (image on top, content below).
 */
export function SplitContentImage({
  id,
  title,
  headingLevel = "h2",
  description,
  primaryCta,
  secondaryCta,
  eligibilityNote,
  image = {
    src: "/images/split-content/community-collage.webp",
    alt: "Diverse ESL members and families representing the community",
    width: 933,
    height: 1024,
  },
  className = "",
}: SplitContentImageProps) {
  const autoId = useId();
  const headingId = `${id ?? autoId}-heading`;

  const sectionClassName = className
    ? `${styles.section} ${className}`
    : styles.section;

  const primaryExternalProps = primaryCta.external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  const secondaryExternalProps = secondaryCta.external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <section
      id={id}
      className={sectionClassName}
      aria-labelledby={headingId}
    >
      <div className={styles.container}>
        <div className={styles.contentColumn}>
          <Heading
            level={headingLevel}
            id={headingId}
            className={styles.title}
          >
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

          <div className={styles.buttonGroup}>
            <Button
              variant="primary"
              href={primaryCta.href}
              leftIcon={<UserIcon size={20} />}
              {...primaryExternalProps}
            >
              {primaryCta.label}
            </Button>
            <Button
              variant="secondary"
              href={secondaryCta.href}
              rightIcon={<ArrowRightIcon size={20} />}
              {...secondaryExternalProps}
            >
              {secondaryCta.label}
            </Button>
          </div>

          {eligibilityNote && (
            <p className={styles.eligibilityNote}>
              <CheckIcon
                className={styles.checkIcon}
                size={16}
                aria-hidden={true}
              />
              <Text as="span" variant="micro" color="secondary">
                {eligibilityNote}
              </Text>
            </p>
          )}
        </div>

        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width ?? 933}
              height={image.height ?? 1024}
              sizes="(max-width: 1024px) 100vw, 544px"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}


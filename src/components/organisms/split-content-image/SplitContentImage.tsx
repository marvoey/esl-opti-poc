import React, { useId } from "react";
import Image from "next/image";
import { Heading, type HeadingLevel } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { Button } from "@/components/atoms/button/Button";
import { UserIcon, ArrowRightIcon, CheckIcon } from "@/components/atoms/icons";
import styles from "./SplitContentImage.module.css";

export interface PhotoTile {
  src: string;
  alt: string;
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
  photos: PhotoTile[];
  className?: string;
}

/**
 * SplitContentImage Organism
 * A full-width section with a soft radial-gradient background, split into two columns:
 * text/CTA content on the left, a 3x2 staggered photo collage on the right.
 * Mobile layout flips the visual order (image on top, content below) and retains the 3x2 grid.
 */
export function SplitContentImage({
  id,
  title,
  headingLevel = "h2",
  description,
  primaryCta,
  secondaryCta,
  eligibilityNote,
  photos,
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
      <div className={`container ${styles.container}`}>
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
            color="secondary"
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
          <div className={styles.photoGrid}>
            {photos.slice(0, 6).map((photo, index) => (
              <div
                key={`${photo.src}-${index}`}
                className={styles.photoTile}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 767px) 33vw, 16vw"
                  className={styles.photoImage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

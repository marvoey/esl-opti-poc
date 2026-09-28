import React from "react";
import Image from "next/image";
import { Badge, type BadgeVariant } from "@/components/atoms/badge/Badge";
import { Text } from "@/components/atoms/text/Text";
import { ArrowRightIcon } from "@/components/atoms/icons";
import styles from "./MediaCard.module.css";

export interface MediaCardProps {
  id?: string;
  imageSrc: string;
  imageAlt?: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
  title: string;
  description: React.ReactNode | string;
  ctaText?: string;
  href?: string;
  external?: boolean;
  className?: string;
}

/**
 * MediaCard Atom Component
 * Renders an interactive promotional card on a dark surface featuring:
 * - 16:9 media banner thumbnail
 * - "Limited Time" pill badge
 * - White bold card title
 * - Muted white body description
 * - Turquoise action link with animated trailing arrow icon
 */
export function MediaCard({
  id,
  imageSrc,
  imageAlt = "Promotional offer",
  badge = "Limited Time",
  badgeVariant = "dark",
  title,
  description,
  ctaText = "Learn more",
  href,
  external = false,
  className = "",
}: MediaCardProps) {
  const externalProps = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  const cardClasses = [styles.card, className].filter(Boolean).join(" ");

  return (
    <article id={id} className={cardClasses}>
      {/* 1. Media Banner */}
      <div className={styles.mediaWrapper}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={styles.thumbnail}
        />
      </div>

      {/* 2. Card Content */}
      <div className={styles.content}>
        {badge && (
          <div className={styles.badge}>
            <Badge variant={badgeVariant}>{badge}</Badge>
          </div>
        )}

        <h3 className={styles.title}>{title}</h3>

        <Text
          as={typeof description === "string" ? "p" : "div"}
          variant="body"
          color="inverted-muted"
          className={styles.description}
        >
          {description}
        </Text>

        {href && (
          <a href={href} className={styles.cta} {...externalProps}>
            <span>{ctaText}</span>
            <span className={styles.ctaIcon} aria-hidden="true">
              <ArrowRightIcon size={16} />
            </span>
          </a>
        )}
      </div>
    </article>
  );
}

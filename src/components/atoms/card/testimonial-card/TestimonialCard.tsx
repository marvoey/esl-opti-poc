"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { StoreIcon, PlayIcon } from "../../icons";
import { Text } from "../../text/Text";
import styles from "./TestimonialCard.module.css";
import {
  parseVideoSource,
  formatAuthor,
  formatQuote,
  type TestimonialAuthorData,
} from "./parseVideoSource";
import { TestimonialLightbox } from "./TestimonialLightbox";

export type TestimonialAuthorInfo = TestimonialAuthorData;

export interface TestimonialCardProps {
  imageSrc: string;
  imageAlt?: string;
  videoUrl?: string;
  videoTitle?: string;
  /** WebVTT captions for a local video (WCAG 1.2.2, Level A). */
  captionsSrc?: string;
  icon?: React.ReactNode;
  title: string;
  quote: React.ReactNode | string;
  author: TestimonialAuthorInfo | string;
  className?: string;
}

function mediaInteractiveProps(
  hasVideo: boolean,
  videoTitle: string | undefined,
  openLightbox: () => void,
  handleKeyDown: (e: React.KeyboardEvent) => void
): React.HTMLAttributes<HTMLDivElement> {
  if (!hasVideo) return {};
  return {
    onClick: openLightbox,
    role: "button",
    tabIndex: 0,
    "aria-label": videoTitle ? `Play video: ${videoTitle}` : "Play testimonial video",
    onKeyDown: handleKeyDown,
  };
}

/**
 * TestimonialCard Component (Figma: "❖ Testimonial card")
 * High-performance media card optimized with the Facade Pattern:
 * - Loads only an optimized static thumbnail image on initial load (0 iframe / player overhead).
 * - Clicking the play overlay opens an accessible modal lightbox streaming the actual video.
 * - Supports local HTML5 video (mp4/webm) as well as YouTube and Vimeo.
 */
export function TestimonialCard({
  imageSrc,
  imageAlt = "Testimonial video thumbnail",
  videoUrl,
  videoTitle,
  captionsSrc,
  icon,
  title,
  quote,
  author,
  className = "",
}: TestimonialCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const videoSource = parseVideoSource(videoUrl);
  const hasVideo = Boolean(videoSource);

  const openLightbox = useCallback(() => {
    if (hasVideo) setIsOpen(true);
  }, [hasVideo]);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox();
      }
    },
    [openLightbox]
  );

  const cleanQuote = formatQuote(quote);
  const { primary: authorPrimary, meta: authorMeta } = formatAuthor(author);
  const cardClasses = [styles.card, className].filter(Boolean).join(" ");

  return (
    <>
      <article className={cardClasses}>
        {/* Media Thumbnail with Play Overlay */}
        <div
          className={`${styles.mediaWrapper} ${hasVideo ? styles.clickableMedia : ""}`}
          {...mediaInteractiveProps(hasVideo, videoTitle, openLightbox, handleKeyDown)}
        >
          <Image src={imageSrc} alt={imageAlt} fill className={styles.thumbnail} sizes="(max-width: 768px) 100vw, 50vw" />

          {hasVideo && <div className={styles.hoverOverlay} aria-hidden="true" />}

          {hasVideo && (
            <div className={styles.playOverlay}>
              <span className={styles.playCircle} aria-hidden="true">
                <PlayIcon size={20} className={styles.playIcon} />
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.iconWrapper} aria-hidden="true">
              {icon ?? <StoreIcon size={24} />}
            </span>
            <Text as="p" variant="body-sm" weight="bold" color="primary" className={styles.title}>
              {title}
            </Text>
          </div>

          <blockquote className={styles.quoteWrapper}>
            <Text
              as={typeof cleanQuote === "string" ? "p" : "div"}
              variant="body"
              weight="regular"
              color="primary"
              className={styles.quote}
            >
              {typeof cleanQuote === "string" ? `"${cleanQuote}"` : cleanQuote}
            </Text>
          </blockquote>

          <p className={styles.authorRow}>
            <Text as="span" variant="body-sm" weight="bold" color="accent" className={styles.authorPrimary}>
              {authorPrimary}
            </Text>
            {authorMeta && (
              <Text as="span" variant="body-sm" weight="bold" color="primary" className={styles.authorMeta}>
                {" "}· {authorMeta}
              </Text>
            )}
          </p>
        </div>
      </article>

      {/* Accessible Performance-Optimized Video Lightbox */}
      {isOpen && videoSource && (
        <TestimonialLightbox
          isOpen={isOpen}
          onClose={closeLightbox}
          videoSource={videoSource}
          title={title}
          videoTitle={videoTitle}
          captionsSrc={captionsSrc}
        />
      )}
    </>
  );
}

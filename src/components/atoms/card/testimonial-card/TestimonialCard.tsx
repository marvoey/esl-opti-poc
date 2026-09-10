"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { StoreIcon, PlayIcon, CloseIcon } from "../../icons";
import { Text } from "../../text/Text";
import styles from "./TestimonialCard.module.css";

export type VideoType = "youtube" | "vimeo" | "local" | "embed";

export interface VideoSource {
  type: VideoType;
  src: string;
}

export function parseVideoSource(url?: string): VideoSource | null {
  if (!url) return null;
  const trimmed = url.trim();

  // YouTube match
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
    };
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+))/i
  );
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  // Local or direct video file (.mp4, .webm, .ogg, etc.)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed) || trimmed.startsWith("/videos/")) {
    return {
      type: "local",
      src: trimmed,
    };
  }

  // Generic embed
  return {
    type: "embed",
    src: trimmed,
  };
}

export interface TestimonialAuthorInfo {
  name: string;
  role?: string;
  location?: string;
}

export interface TestimonialCardProps {
  imageSrc: string;
  imageAlt?: string;
  videoUrl?: string;
  videoTitle?: string;
  icon?: React.ReactNode;
  title: string;
  quote: string;
  author: TestimonialAuthorInfo | string;
  className?: string;
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
  icon,
  title,
  quote,
  author,
  className = "",
}: TestimonialCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const videoSource = parseVideoSource(videoUrl);
  const hasVideo = Boolean(videoSource);

  const openLightbox = useCallback(() => {
    if (hasVideo) {
      setIsOpen(true);
    }
  }, [hasVideo]);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Keyboard accessibility and body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    // Focus close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeLightbox]);

  // Clean formatted quote
  const cleanQuote = quote.replace(/^["“]|["”]$/g, "");

  // Formatted author
  let authorPrimary = "";
  let authorMeta = "";

  if (typeof author === "string") {
    if (author.includes("·")) {
      const [primary, ...rest] = author.split("·");
      authorPrimary = primary.trim();
      authorMeta = rest.join("·").trim();
    } else {
      authorPrimary = author;
    }
  } else {
    authorPrimary = `${author.name}${author.role ? `, ${author.role}` : ""}`;
    authorMeta = author.location || "";
  }

  const cardClasses = [styles.card, className].filter(Boolean).join(" ");

  return (
    <>
      <article className={cardClasses}>
        {/* Media Thumbnail with Play Overlay */}
        <div
          className={`${styles.mediaWrapper} ${hasVideo ? styles.clickableMedia : ""}`}
          onClick={hasVideo ? openLightbox : undefined}
          role={hasVideo ? "button" : undefined}
          tabIndex={hasVideo ? 0 : undefined}
          aria-label={hasVideo ? (videoTitle ? `Play video: ${videoTitle}` : "Play testimonial video") : undefined}
          onKeyDown={
            hasVideo
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox();
                  }
                }
              : undefined
          }
        >
          <img src={imageSrc} alt={imageAlt} className={styles.thumbnail} />

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
              {icon ?? <StoreIcon size={22} />}
            </span>
            <Text as="p" variant="body-sm" weight="bold" color="primary" className={styles.title}>
              {title}
            </Text>
          </div>

          <blockquote className={styles.quoteWrapper}>
            <Text as="p" variant="body" weight="regular" color="primary" className={styles.quote}>
              &quot;{cleanQuote}&quot;
            </Text>
          </blockquote>

          <div className={styles.authorRow}>
            <Text as="span" variant="body-sm" weight="bold" color="accent" className={styles.authorPrimary}>
              {authorPrimary}
            </Text>
            {authorMeta && (
              <Text as="span" variant="body-sm" weight="medium" color="primary" className={styles.authorMeta}>
                {" "}· {authorMeta}
              </Text>
            )}
          </div>
        </div>
      </article>

      {/* Accessible Performance-Optimized Video Lightbox */}
      {isOpen && videoSource && (
        <div
          className={styles.lightboxBackdrop}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={videoTitle || "Testimonial video player"}
        >
          <div
            className={styles.lightboxContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className={styles.closeButton}
              onClick={closeLightbox}
              aria-label="Close video player"
            >
              <CloseIcon size={24} />
            </button>

            <div className={styles.videoWrapper}>
              {videoSource.type === "local" ? (
                <video
                  src={videoSource.src}
                  controls
                  autoPlay
                  playsInline
                  className={styles.videoElement}
                />
              ) : (
                <iframe
                  src={videoSource.src}
                  title={videoTitle || "Testimonial video player"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={styles.iframeElement}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

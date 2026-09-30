"use client";

import React, { useEffect, useRef } from "react";
import { CloseIcon } from "../../icons";
import type { VideoSource } from "./parseVideoSource";
import styles from "./TestimonialCard.module.css";

export interface TestimonialLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  videoSource: VideoSource;
  title: string;
  videoTitle?: string;
  /**
   * WebVTT captions for a local video. Prerecorded video with audio requires
   * captions (WCAG 1.2.2, Level A), so local sources should always supply this.
   */
  captionsSrc?: string;
  captionsLang?: string;
}

export function TestimonialLightbox({
  isOpen,
  onClose,
  videoSource,
  title,
  videoTitle,
  captionsSrc,
  captionsLang = "en",
}: TestimonialLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    if (typeof document !== "undefined") {
      triggerRef.current = document.activeElement as HTMLElement | null;
    }

    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === dialog) {
        onCloseRef.current();
      }
    };

    dialog?.addEventListener("click", handleBackdropClick);

    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      dialog?.removeEventListener("click", handleBackdropClick);
      if (dialog?.open) {
        dialog.close();
      }
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className={styles.lightboxBackdrop}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      aria-label={videoTitle || "Testimonial video player"}
    >
      <div
        className={styles.lightboxContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.lightboxHeader}>
          <h3 className={styles.lightboxTitle}>
            {videoTitle || title || "Member story"}
          </h3>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close video player"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <div className={styles.videoWrapper}>
          {videoSource.type === "local" ? (
            <video
              src={videoSource.src}
              controls
              playsInline
              className={styles.videoElement}
            >
              {captionsSrc && (
                <track
                  kind="captions"
                  src={captionsSrc}
                  srcLang={captionsLang}
                  label="Captions"
                  default
                />
              )}
            </video>
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
    </dialog>
  );
}

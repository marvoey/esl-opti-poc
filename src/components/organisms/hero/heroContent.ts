import React from "react";
import type { IconName } from "@/components/atoms/icons";

/**
 * Content for the static Hero. Mirrors one HeroCarousel slide minus `id`,
 * which only existed as a list key.
 */
export interface HeroContentItem {
  eyebrow: string;
  titleLine1: string;
  titleLine2?: string;
  body: React.ReactNode;
  primaryCta?: string;
  primaryCtaHref?: string;
  primaryCtaExternal?: boolean;
  primaryCtaVariant?: string;
  primaryCtaIcon?: IconName | "arrow" | "none" | string;
  secondaryCta?: string;
  secondaryCtaHref?: string;
  secondaryCtaExternal?: boolean;
  secondaryCtaVariant?: string;
  secondaryCtaIcon?: IconName | "arrow" | "none" | string;
  imageSrc?: string;
  imageAlt?: string;
  badgeStat?: string;
  badgeLabel?: string;
}

export const DEFAULT_HERO_CONTENT: HeroContentItem = {
  eyebrow: "Banking with guidance",
  titleLine1: "Move forward",
  titleLine2: "with confidence.",
  body: "From your first account to planning for retirement, we're here to help at every step.",
  primaryCta: "Become a member",
  primaryCtaIcon: "user",
  secondaryCta: "Sign In",
  secondaryCtaIcon: "user",
  imageSrc: "/images/hero/family.jpg",
  imageAlt: "Three-generation Hispanic family smiling together outdoors",
  badgeStat: "100%",
  badgeLabel: "Peace of mind",
};

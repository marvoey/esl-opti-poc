import React from "react";

export interface SlideItem {
  id: string;
  eyebrow: string;
  titleLine1: string;
  titleLine2?: string;
  body: React.ReactNode;
  primaryCta: string;
  primaryCtaHref?: string;
  primaryCtaTarget?: string;
  primaryCtaRel?: string;
  secondaryCta: string;
  secondaryCtaHref?: string;
  secondaryCtaTarget?: string;
  secondaryCtaRel?: string;
  imageSrc?: string;
  imageAlt?: string;
  badgeStat: string;
  badgeLabel: string;
}

export const HERO_SLIDES: SlideItem[] = [
  {
    id: "slide-1",
    eyebrow: "Banking with guidance",
    titleLine1: "Move forward",
    titleLine2: "with confidence.",
    body: "From your first account to planning for retirement, we’re here to help at every step.",
    primaryCta: "Become a member",
    secondaryCta: "Sign In",
    imageSrc: "/images/hero/family.jpg",
    imageAlt: "Three-generation Hispanic family smiling together outdoors",
    badgeStat: "100%",
    badgeLabel: "Peace of mind",
  },
  {
    id: "slide-2",
    eyebrow: "Banking with guidance",
    titleLine1: "Move forward",
    titleLine2: "with confidence.",
    body: "From your first account to planning for retirement, we’re here to help at every step.",
    primaryCta: "Become a member",
    secondaryCta: "Sign In",
    imageSrc: "/images/hero/family.jpg",
    imageAlt: "Three-generation Hispanic family smiling together outdoors",
    badgeStat: "100%",
    badgeLabel: "Peace of mind",
  },
  {
    id: "slide-3",
    eyebrow: "Banking with guidance",
    titleLine1: "Move forward",
    titleLine2: "with confidence.",
    body: "From your first account to planning for retirement, we’re here to help at every step.",
    primaryCta: "Become a member",
    secondaryCta: "Sign In",
    imageSrc: "/images/hero/family.jpg",
    imageAlt: "Three-generation Hispanic family smiling together outdoors",
    badgeStat: "100%",
    badgeLabel: "Peace of mind",
  },
];

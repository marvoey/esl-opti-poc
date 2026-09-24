import React from "react";
import type { IconName } from "@/components/atoms/icons";

export interface SlideItem {
  id: string;
  eyebrow: string;
  titleLine1: string;
  titleLine2?: string;
  body: React.ReactNode;
  primaryCta: string;
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

export const HERO_SLIDES: SlideItem[] = [
  {
    id: "slide-1",
    eyebrow: "Banking with guidance",
    titleLine1: "Move forward",
    titleLine2: "with confidence.",
    body: "From your first account to planning for retirement, we’re here to help at every step.",
    primaryCta: "Become a member",
    secondaryCta: "Sign In",
    primaryCtaIcon: "user",
    secondaryCtaIcon: "user",
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
    primaryCtaIcon: "user",
    secondaryCtaIcon: "user",
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
    primaryCtaIcon: "user",
    secondaryCtaIcon: "user",
    imageSrc: "/images/hero/family.jpg",
    imageAlt: "Three-generation Hispanic family smiling together outdoors",
    badgeStat: "100%",
    badgeLabel: "Peace of mind",
  },
];

export const PRODUCT_DETAIL_HERO_SLIDES: SlideItem[] = [
  {
    id: "premier-checking",
    eyebrow: "PREMIER CHECKING",
    titleLine1: "Checking that gives a",
    titleLine2: "little back.",
    body: "Everything you use day to day, plus a balance that earns dividends and our member-only Owners’ Dividend — with no monthly fee when you keep $1,000.",
    primaryCta: "Open a Premier Checking account",
    imageSrc: "/images/hero/premier-checking.jpg",
    imageAlt: "Father and daughter smiling together on sofa at home",
    badgeStat: "$0",
    badgeLabel: "Monthly\nservice fee",
    primaryCtaIcon: "arrow",
  },
];

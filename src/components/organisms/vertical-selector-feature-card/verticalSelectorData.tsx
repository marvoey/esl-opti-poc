import React from "react";
import {
  SproutIcon,
  SparklesIcon,
  CarIcon,
  ShieldCheckIcon,
  HomeIcon,
  BabyIcon,
  GraduationCapIcon,
  SailboatIcon,
} from "@/components/atoms/icons";
import { type VerticalSelectorFeatureCardProps } from "./VerticalSelectorFeatureCard";

export const DEFAULT_VERTICAL_SELECTOR_DATA: VerticalSelectorFeatureCardProps = {
  eyebrow: "BANKING FOR EVERY STAGE OF LIFE",
  title: "Wherever you are, we’ll help you take the next step.",
  description:
    "Pick the moment that fits your life right now — we’ll point you to accounts and next steps that make sense.",
  cta: {
    label: "Explore Financial Wellness Center",
    href: "/wellness",
  },
  defaultActiveId: "buying-a-home",
  tabs: [
    {
      id: "just-starting-out",
      label: "Just starting out",
      icon: <SproutIcon size={20} />,
      feature: {
        title: "Smart Tools for Your First Financial Steps",
        description:
          "Build credit with confidence, track spending with automated budgeting, and earn cash dividends right from day one.",
        image: {
          src: "/images/offers/checking.jpg",
          alt: "Young adult using mobile banking app with ESL checking card",
          width: 720,
          height: 328,
        },
        cta: {
          label: "Explore starter accounts",
          href: "/personal/checking",
        },
      },
    },
    {
      id: "fresh-start",
      label: "Fresh start",
      icon: <SparklesIcon size={20} />,
      feature: {
        title: "A Clean Slate and Solutions That Rebuild",
        description:
          "Overcome past hurdles with dedicated rebuilding checking, secured credit lines, and free one-on-one financial coaching.",
        image: {
          src: "/images/metrics/education.webp",
          alt: "Member discussing credit rebuilding options with an advisor",
          width: 720,
          height: 328,
        },
        cta: {
          label: "Learn about fresh start",
          href: "/personal/rebuild",
        },
      },
    },
    {
      id: "buying-a-car",
      label: "Buying a car",
      icon: <CarIcon size={20} />,
      feature: {
        title: "Low Rates for New and Used Vehicles",
        description:
          "Hit the road with pre-approval confidence, low fixed rates, and flexible financing up to 84 months.",
        image: {
          src: "/images/offers/auto-loan.jpg",
          alt: "Driver happily holding keys beside a new car",
          width: 720,
          height: 328,
        },
        cta: {
          label: "Calculate your payment",
          href: "/personal/auto-loans",
        },
      },
    },
    {
      id: "saving-for-goals",
      label: "Saving for goals or emergencies",
      icon: <ShieldCheckIcon size={20} />,
      feature: {
        title: "High-Yield Savings for What Matters Most",
        description:
          "Build your safety net with competitive dividend rates, customized goal-based sub-accounts, and no monthly fees.",
        image: {
          src: "/images/offers/certificate.jpg",
          alt: "Family reviewing savings growth on digital tablet",
          width: 720,
          height: 328,
        },
        cta: {
          label: "Start saving now",
          href: "/personal/savings",
        },
      },
    },
    {
      id: "buying-a-home",
      label: "Buying a home",
      icon: <HomeIcon size={20} />,
      feature: {
        title: "Buying a home is a big step — and an exciting one.",
        description:
          "Whether it’s your first place or room for a growing family, we’ll help you understand your options and figure out what you can comfortably afford.",
        image: {
          src: "/images/hero/family.jpg",
          alt: "Family enjoying their new home",
          width: 720,
          height: 328,
        },
        cta: {
          label: "Start your home buying journey",
          href: "/personal/mortgages",
        },
      },
    },
    {
      id: "growing-a-family",
      label: "Growing a family",
      icon: <BabyIcon size={20} />,
      feature: {
        title: "Financial Protection as Your Family Expands",
        description:
          "From youth savings accounts and health savings plans to family budget restructuring, we help you prepare for what is ahead.",
        image: {
          src: "/images/metrics/volunteers.webp",
          alt: "ESL volunteers supporting local community garden project",
          width: 720,
          height: 328,
        },
        cta: {
          label: "Explore family solutions",
          href: "/personal/family",
        },
      },
    },
    {
      id: "saving-paying-college",
      label: "Saving and paying for college",
      icon: <GraduationCapIcon size={20} />,
      feature: {
        title: "Invest in Tomorrow with Education Funding",
        description:
          "Fund higher education with competitive student loans, Coverdell ESAs, and flexible 529 college savings accounts.",
        image: {
          src: "/images/metrics/education.webp",
          alt: "Student with laptop researching college financial plans",
          width: 720,
          height: 328,
        },
        cta: {
          label: "Explore college planning",
          href: "/personal/college",
        },
      },
    },
    {
      id: "planning-for-retirement",
      label: "Planning for retirement",
      icon: <SailboatIcon size={20} />,
      feature: {
        title: "Personalized Guidance for Your Next Chapter",
        description:
          "Craft a customized retirement roadmap, optimize Social Security timing, and invest with dedicated fiduciary advisors.",
        image: {
          src: "/images/metrics/partnerships.webp",
          alt: "Couple enjoying retirement near the lake",
          width: 720,
          height: 328,
        },
        cta: {
          label: "Schedule a consultation",
          href: "/wealth/retirement",
        },
      },
    },
  ],
};

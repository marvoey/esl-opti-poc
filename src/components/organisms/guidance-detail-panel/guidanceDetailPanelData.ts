import type React from "react";
import type { HeadingLevel } from "@/components/atoms/heading/Heading";

export type GuidanceIconName =
  | "home"
  | "calculator"
  | "gauge"
  | "list-checks"
  | "piggy-bank"
  | "wallet"
  | "credit-card"
  | "landmark";

export interface GuidanceDetailPanelLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface GuidanceStartingPoint {
  id?: string;
  title: string;
  description?: string;
  href?: string;
  external?: boolean;
}

export interface GuidanceTool {
  id?: string;
  icon?: GuidanceIconName;
  label?: string;
  title: string;
  href?: string;
  external?: boolean;
}

export interface GuidanceDetailPanelProps {
  id?: string;
  icon?: GuidanceIconName;
  title: string;
  headingLevel?: HeadingLevel;
  description?: React.ReactNode;
  cta?: GuidanceDetailPanelLink;
  note?: string;
  imageSrc?: string;
  imageAlt?: string;
  startingPointsHeading?: string;
  startingPoints?: GuidanceStartingPoint[];
  toolsHeading?: string;
  tools?: GuidanceTool[];
  className?: string;
}

/** Sample copy from the Figma frame. Used by tests and previews only. */
export const GUIDANCE_DETAIL_PANEL_FIXTURE: GuidanceDetailPanelProps = {
  id: "buying-a-home",
  icon: "home",
  title: "Buying a home",
  description:
    "Explore guidance to help you prepare, understand your options and navigate the homebuying process from start to finish.",
  cta: { label: "See full guidance", href: "/guidance/buying-a-home" },
  note: "The questions worth asking, what we'd sort out first, the accounts that fit — and someone to talk it through with.",
  imageSrc: "/images/guidance/buying-a-home.jpg",
  imageAlt: "A family playing on the lawn in front of their new home",
  startingPointsHeading: "Popular starting points",
  startingPoints: [
    {
      id: "ready",
      title: "Am I ready?",
      description: "Understand the key factors before starting your homebuying journey.",
      href: "/guidance/buying-a-home/am-i-ready",
    },
    {
      id: "afford",
      title: "What can I afford?",
      description: "Explore budgeting, down payments and monthly homeownership costs.",
      href: "/guidance/buying-a-home/affordability",
    },
    {
      id: "mortgages",
      title: "Understanding mortgages",
      description: "Learn how mortgage options and the financing process work.",
      href: "https://example.com/mortgages",
      external: true,
    },
  ],
  toolsHeading: "Useful tools",
  tools: [
    {
      id: "mortgage-calculator",
      icon: "calculator",
      label: "Calculator",
      title: "Mortgage calculator",
      href: "/tools/mortgage-calculator",
    },
    {
      id: "affordability-calculator",
      icon: "gauge",
      label: "Calculator",
      title: "Affordability calculator",
      href: "/tools/affordability-calculator",
    },
    {
      id: "first-time-buyer-checklist",
      icon: "list-checks",
      label: "Checklist",
      title: "First-time buyer checklist",
      href: "/tools/first-time-buyer-checklist",
    },
  ],
};

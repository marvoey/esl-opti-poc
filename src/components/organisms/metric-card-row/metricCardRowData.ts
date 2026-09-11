import React from "react";
import { type RatesCardVariant } from "@/components/atoms/card/rates-card/RatesCard";

export interface MetricCardItemData {
  id?: string;
  category: string;
  categoryIcon?: React.ReactNode;
  rate: string;
  rateUnit?: string;
  rateLabel?: string;
  title: string;
  description: string;
  ctaText?: string;
  href?: string;
  variant?: RatesCardVariant;
}

export interface MetricCardRowData {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  cta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  cards?: MetricCardItemData[];
}

export const DEFAULT_METRIC_CARD_ROW: MetricCardRowData = {
  eyebrow: "Competitive Rates",
  title: "Rates that work for your goals.",
  description:
    "Explore high-yield savings, auto loans, and mortgages designed to help you keep more of what you earn.",
  cta: {
    label: "View all rates",
    href: "/rates",
  },
  cards: [
    {
      id: "card-auto",
      category: "Getting on the road",
      rate: "1.99",
      rateUnit: "%",
      rateLabel: "APR",
      title: "Auto loans",
      description: "A loan that fits your life, and help finding the right option.",
      ctaText: "Explore auto loans",
      href: "/auto-loans",
      variant: "default",
    },
    {
      id: "card-mortgage",
      category: "Home financing",
      rate: "5.49",
      rateUnit: "%",
      rateLabel: "APR",
      title: "Mortgages",
      description: "Competitive fixed rates and guidance every step of the way.",
      ctaText: "Explore mortgages",
      href: "/mortgages",
      variant: "default",
    },
    {
      id: "card-savings",
      category: "Growing your savings",
      rate: "4.25",
      rateUnit: "%",
      rateLabel: "APY",
      title: "High-Yield Savings",
      description: "Watch your money grow with competitive yields and no monthly fees.",
      ctaText: "Explore savings",
      href: "/savings",
      variant: "default",
    },
  ],
};

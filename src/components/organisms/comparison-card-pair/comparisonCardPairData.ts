export interface ComparisonFeatureItem {
  id: string;
  text: string;
  iconType: "check" | "credit-card";
}

export interface ComparisonCardData {
  id: string;
  title: string;
  badgeText?: string;
  description: string;
  features: [ComparisonFeatureItem, ComparisonFeatureItem, ComparisonFeatureItem];
  cta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  /** Optional second CTA, rendered below the primary button as a secondary-variant button. */
  secondaryCta?: {
    label: string;
    href: string;
    external?: boolean;
  };
}

export interface ComparisonCardPairData {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  cards: [ComparisonCardData, ComparisonCardData];
}

export const DEFAULT_COMPARISON_CARD_PAIR_DATA: ComparisonCardPairData = {
  eyebrow: "COMPARE OPTIONS",
  title: "Find the right checking account for your needs.",
  description:
    "Explore our member-first personal checking tiers. Transparent benefits, zero hidden fees, and full digital access.",
  cards: [
    {
      id: "card-1",
      title: "Premier Checking",
      badgeText: "Most Popular",
      description: "Earn competitive monthly dividends and maximize your everyday savings with premium banking perks.",
      features: [
        { id: "f1-1", text: "Free nationwide ATM withdrawals & fee rebates", iconType: "check" },
        { id: "f1-2", text: "No monthly service fee with qualifying direct deposit", iconType: "check" },
        { id: "f1-3", text: "Contactless Visa® debit card with instant alerts", iconType: "credit-card" },
      ],
      cta: {
        label: "Open Premier Checking",
        href: "/checking/premier",
      },
    },
    {
      id: "card-2",
      title: "Essential Checking",
      badgeText: "Simple Banking",
      description: "Straightforward everyday checking built for effortless budgeting and straightforward financial management.",
      features: [
        { id: "f2-1", text: "Access over 30,000 surcharge-free CO-OP ATMs", iconType: "check" },
        { id: "f2-2", text: "Zero minimum balance requirement after opening", iconType: "check" },
        { id: "f2-3", text: "Visa® debit card with 24/7 fraud protection", iconType: "credit-card" },
      ],
      cta: {
        label: "Open Essential Checking",
        href: "/checking/essential",
      },
      secondaryCta: {
        label: "Learn More",
        href: "/checking/essential/details",
      },
    },
  ],
};

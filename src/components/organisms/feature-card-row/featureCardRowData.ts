import { FeatureCardRowProps } from "./FeatureCardRow";

export const DEFAULT_FEATURE_CARD_ROW_PROPS: FeatureCardRowProps = {
  eyebrow: "WHY PREMIER",
  title: "What you get with Premier Checking.",
  items: [
    {
      id: "feature-keep-more",
      icon: "coins",
      title: "Keep more of your money",
      description:
        "No $10 monthly fee when your average monthly balance stays at $1,000. No fee, nothing to think about.",
    },
    {
      id: "feature-balance-earns",
      icon: "sprout",
      title: "Your balance earns",
      description:
        "Premier earns a competitive, variable dividend, compounded monthly - plus the member-only Owners' Dividend.",
    },
    {
      id: "feature-bank-anywhere",
      icon: "credit-card",
      title: "Bank wherever you are",
      description:
        "Free ESL Visa® Debit Card, online & mobile banking, mobile deposit, and free use of any ESL ATM.",
    },
  ],
};

import { FilterableProductCardGridProps } from "./FilterableProductCardGrid";

const SEE_DETAILS = "See Details";

export const DEFAULT_FILTERABLE_PRODUCT_CARD_GRID_PROPS: FilterableProductCardGridProps = {
  eyebrow: "FIND YOUR FIT",
  title: "Six ways to save. Let’s narrow it down.",
  description: "Pick what matters most and the list narrows to what fits.",
  allFilterLabel: "All accounts",
  filters: [
    "Keeping it simple",
    "Earning the most that I can",
    "Reaching my money easily",
    "Saving for medical costs",
    "Saving for a child’s education",
  ],
  noResultsText: "No accounts match that choice yet.",
  items: [
    {
      id: "daily-dividend",
      title: "Daily Dividend",
      description: "No minimum balance. A competitive variable rate. The simplest place to start.",
      rate: "X.XX% APY",
      filterTags: ["Keeping it simple", "Reaching my money easily"],
      href: "/savings/daily-dividend",
      linkLabel: SEE_DETAILS,
    },
    {
      id: "money-maker",
      title: "Money Maker",
      description: "A tiered rate that beats regular savings, with checks and easy access.",
      rate: "X.XX% APY",
      filterTags: ["Earning the most that I can", "Reaching my money easily"],
      href: "/savings/money-maker",
      linkLabel: SEE_DETAILS,
    },
    {
      id: "premier-money-maker",
      title: "Premier Money Maker",
      description: "Tiered rates for balances of $10,000 or more.",
      rate: "X.XX% APY",
      filterTags: ["Earning the most that I can"],
      href: "/savings/premier-money-maker",
      linkLabel: SEE_DETAILS,
    },
    {
      id: "tiered-savings",
      title: "Tiered Savings Account",
      description: "Earns like a certificate, acts like savings. Higher balance, higher rate.",
      rate: "X.XX% APY",
      filterTags: ["Earning the most that I can"],
      href: "/savings/tiered-savings",
      linkLabel: SEE_DETAILS,
    },
    {
      id: "health-savings",
      title: "Health Savings Account",
      description: "Tax-advantaged saving for qualified medical expenses, with an HSA card.",
      rate: "X.XX% APY",
      filterTags: ["Saving for medical costs"],
      href: "/savings/health-savings",
      linkLabel: SEE_DETAILS,
    },
    {
      id: "coverdell",
      title: "Coverdell Education Savings Account",
      description: "Save ahead for a child’s education, with tax-free qualified withdrawals.",
      rate: "X.XX% APY",
      filterTags: ["Saving for a child’s education"],
      href: "/savings/coverdell-esa",
      linkLabel: SEE_DETAILS,
    },
  ],
};

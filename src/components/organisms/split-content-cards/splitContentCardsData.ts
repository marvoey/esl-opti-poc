import { type SplitContentCardsProps } from "./SplitContentCards";

export const DEFAULT_SPLIT_CONTENT_CARDS_DATA: SplitContentCardsProps = {
  eyebrow: "WHY OUR GUIDANCE IS DIFFERENT",
  title: "Advice from a bank you own.",
  description:
    "ESL is member-owned. We don't answer to outside shareholders — so the advice you get is built around what's right for you. When we do well, that comes back to you.",
  cta: {
    label: "See how membership works",
    href: "/membership",
  },
  heroMetric: {
    subhead: "OWNERS' DIVIDEND, RETURNED TO MEMBERS",
    value: "$XX",
    unit: "million",
    description: "Money returned to members — because you own a share of the bank.",
  },
  statCards: [
    {
      id: "stat-years",
      value: "XX",
      label: "years of dividends",
    },
    {
      id: "stat-satisfaction",
      value: "4.8",
      label: "member satisfaction",
      icon: "star",
    },
  ],
};

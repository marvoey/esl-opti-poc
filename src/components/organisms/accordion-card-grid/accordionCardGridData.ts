import { AccordionCardGridProps } from "./AccordionCardGrid";

export const DEFAULT_ACCORDION_CARD_GRID_PROPS: AccordionCardGridProps = {
  eyebrow: "In plain terms",
  title: "A few words, defined.",
  description:
    "Banking has its own vocabulary. Here's what a few terms on this page actually mean.",
  items: [
    {
      id: "term-apy-vs-apr",
      term: "APY vs. APR",
      definition:
        "APY is what your money can earn in a year, including compounding. APR is the yearly cost of borrowing.",
    },
    {
      id: "term-overdraft",
      term: "Overdraft",
      definition:
        "When a transaction is approved even though your account doesn't have enough to cover it.",
    },
    {
      id: "term-membership-share",
      term: "Membership Share",
      definition:
        "The one-time $1 deposit that makes you an owner of the credit union, not just a customer.",
    },
    {
      id: "term-owners-dividend",
      term: "Owners' Dividend",
      definition:
        "A member-only bonus dividend ESL may pay in years it performs well, on top of your regular dividend.",
    },
    {
      id: "term-courtesy-pay",
      term: "Courtesy Pay",
      definition:
        "One of ESL's overdraft options — covers a shortfall automatically instead of declining the transaction.",
    },
    {
      id: "term-atm-rebate",
      term: "ATM Fee Rebate",
      definition:
        "A refund of the fee another bank's ATM charges you, credited back to your account.",
    },
  ],
};

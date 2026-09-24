import { LongTextLeftCardsRightProps } from "./LongTextLeftCardsRight";

export const DEFAULT_LONG_TEXT_LEFT_CARDS_RIGHT_PROPS: LongTextLeftCardsRightProps = {
  title: "Am I actually ready to buy?",
  body:
    "Readiness is three things, and none of them is a feeling. Steady income you can document, a credit history that has been behaving for a year or so, and enough cash for a down payment plus closing costs without emptying your savings entirely.",
  promo: {
    eyebrow: "Something at ESL that helps here",
    heading: "Get pre-approved before you shop",
    description:
      "A pre-approval puts a real number on your range and tells sellers you are serious. It is free, takes about a day, and does not commit you to a loan.",
    cta: { label: "How pre-approval works", href: "/mortgages/pre-approval" },
  },
  items: [
    {
      id: "card-readiness",
      icon: "gauge",
      eyebrow: "Tool · 5 min",
      title: "Homebuying readiness check",
      description: "Twelve questions, and an honest read on where you are.",
      href: "/mortgages/readiness-check",
    },
    {
      id: "card-lenders",
      icon: "house-plus",
      eyebrow: "Article · 6 min",
      title: "What lenders look at before they approve you",
      description: "Income, credit and the two ratios underwriters weigh most.",
      href: "/learn/what-lenders-look-at",
    },
    {
      id: "card-documents",
      icon: "clipboard-list",
      eyebrow: "Checklist · 8 items",
      title: "Documents to gather before you apply",
      description: "What to have ready, and how far back it needs to go.",
      href: "/learn/mortgage-documents",
    },
  ],
};

import { ProductCardsRowVariant2Props } from "./ProductCardsRowVariant2";

export const DEFAULT_PRODUCT_CARDS_ROW_VARIANT_2_PROPS: ProductCardsRowVariant2Props = {
  eyebrow: "WORKS WITH YOUR ACCOUNT",
  title: "The everyday tools that come with it.",
  description:
    "Whichever account you choose, these come along to make day-to-day banking easier.",
  items: [
    {
      id: "tool-debit-card",
      icon: "credit-card",
      title: "ESL Visa® Debit Card",
      description:
        "Tap, swipe, or add it to your digital wallet — and lock it, set alerts, or change your PIN right in the app.",
      ctaText: "About the debit card",
      href: "/personal/checking/debit-card",
    },
    {
      id: "tool-direct-deposit",
      icon: "piggy-bank",
      title: "Direct Deposit",
      description:
        "Have your paycheck or benefits land in your account automatically, often the same day they're paid.",
      ctaText: "Set up direct deposit",
      href: "/personal/checking/direct-deposit",
    },
    {
      id: "tool-overdraft-options",
      icon: "shield-check",
      title: "Overdraft options",
      description:
        "A few simple ways to cover the unexpected — Cash Reserve, CheckOK, and ESL Courtesy Pay†",
      ctaText: "Compare overdraft options",
      href: "/personal/checking/overdraft-options",
    },
  ],
};

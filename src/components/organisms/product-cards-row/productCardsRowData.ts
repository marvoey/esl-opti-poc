import { ProductCardsRowProps } from "./ProductCardsRow";

export const DEFAULT_PRODUCT_CARDS_ROW_PROPS: ProductCardsRowProps = {
  eyebrow: "IS THIS RIGHT FOR YOU?",
  title: "An honest look at the fit",
  description:
    "Premier isn't for everyone. Here's when it makes sense, and when another account might suit you better.",
  items: [
    {
      id: "fit-balance",
      title: "You usually keep $1,000 or more in checking",
      description: "Stay above the balance line and the $10 monthly fee disappears automatically.",
    },
    {
      id: "fit-earn",
      title: "You want your everyday money to earn",
      description: "Premier pays a competitive, variable dividend on your checking balance, compounded monthly.",
    },
    {
      id: "fit-travel",
      title: "You travel or use non-ESL ATMs often",
      description: "Get ATM fee rebates so cash access away from ESL doesn't cost you extra.",
    },
    {
      id: "fit-membership",
      title: "You're an ESL member, or ready to join",
      description: "Premier Checking is available exclusively to ESL Federal Credit Union members.",
    },
  ],
};

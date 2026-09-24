import { IconCardSingleColumnGridProps } from "./IconCardSingleColumnGrid";

export const DEFAULT_ICON_CARD_SINGLE_COLUMN_GRID_PROPS: IconCardSingleColumnGridProps = {
  title: "Three decisions, in the order most people face them",
  items: [
    {
      id: "decision-checking",
      icon: "piggy-bank",
      title: "Checking Accounts",
      href: "/personal/checking",
      description:
        "Money you need today. Free Checking has no monthly fee and no minimum. Premier pays interest and rebates fees once you keep more on deposit — worth it above roughly a few thousand dollars, not below.",
    },
    {
      id: "decision-savings",
      icon: "piggy-bank",
      title: "Savings Accounts",
      href: "/personal/savings",
      description:
        "Money you might need this year. Opens with a dollar and stays reachable. Money Maker steps up as the balance grows, so it's the one to use when you can't commit to a term.",
    },
    {
      id: "decision-certificates",
      icon: "piggy-bank",
      title: "Certificate Options",
      href: "/personal/certificates",
      description:
        "Money you can leave alone. The highest rate we publish, in exchange for a fixed term and a penalty for early withdrawal. Short terms currently pay more than long ones.",
    },
    {
      id: "decision-iras",
      icon: "piggy-bank",
      title: "IRAs",
      href: "/personal/iras",
      description:
        "Money for retirement. Same mechanics as savings and certificates, with a tax advantage and an annual contribution limit. Traditional defers the tax; Roth pays it now so withdrawals are clean.",
    },
  ],
};

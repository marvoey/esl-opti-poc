import type { IconName } from "@/components/atoms/icons";

export interface ProductPathwaysRowData {
  /** Stable id. Used as React key. */
  id: string;
  icon?: IconName;
  /** Link label in the left column, e.g. "Sign In". */
  title: string;
  href?: string;
  target?: string;
  /** Right column copy. Rich text from the CMS, or plain text. */
  description?: string;
}

export interface ProductPathwaysData {
  title: string;
  description?: string;
  rows: ProductPathwaysRowData[];
}

export const PRODUCT_PATHWAYS_DATA: ProductPathwaysData = {
  title: "Manage",
  description:
    "The deciding question: when will you need this money back? Sooner means liquid and lower-earning. Later means locked up and higher-earning. Everything in this group is a version of that trade.",
  rows: [
    {
      id: "today",
      icon: "piggy-bank",
      title: "Sign In",
      href: "/checking",
      description:
        "Money you need today. Free Checking has no monthly fee and no minimum. Premier pays interest and rebates fees once you keep more on deposit — worth it above roughly a few thousand dollars, not below.",
    },
    {
      id: "this-year",
      icon: "piggy-bank",
      title: "Sign In",
      href: "/savings",
      description:
        "Money you might need this year. Opens with a dollar and stays reachable. Money Maker steps up as the balance grows, so it’s the one to use when you can’t commit to a term.",
    },
    {
      id: "leave-alone",
      icon: "piggy-bank",
      title: "Sign In",
      href: "/certificates",
      description:
        "Money you can leave alone. The highest rate we publish, in exchange for a fixed term and a penalty for early withdrawal. Short terms currently pay more than long ones.",
    },
    {
      id: "retirement",
      icon: "piggy-bank",
      title: "Sign In",
      href: "/retirement",
      description:
        "Money for retirement. Same mechanics as savings and certificates, with a tax advantage and an annual contribution limit. Traditional defers the tax; Roth pays it now so withdrawals are clean.",
    },
  ],
};

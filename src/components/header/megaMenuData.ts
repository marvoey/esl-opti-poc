import type { IconName } from "@/components/atoms/icons";

export interface MegaMenuColumnItem {
  icon: IconName;
  label: string;
  href: string;
}

export interface MegaMenuColumn {
  heading: string;
  items: MegaMenuColumnItem[];
}

export interface MegaMenuPromo {
  eyebrow?: string;
  heading?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface MegaMenuData {
  viewAllLabel: string;
  viewAllHref: string;
  columns: MegaMenuColumn[];
  promo?: MegaMenuPromo;
}

export const PERSONAL_MEGA_MENU: MegaMenuData = {
  viewAllLabel: "View All Personal Banking",
  viewAllHref: "/personal",
  columns: [
    {
      heading: "Manage",
      items: [
        { icon: "landmark", label: "Checking Accounts", href: "/personal/checking" },
        { icon: "piggy-bank", label: "Savings Accounts", href: "/personal/savings" },
        { icon: "award", label: "Certificate Options", href: "/personal/certificates" },
        { icon: "vault", label: "IRAs", href: "/personal/iras" },
        { icon: "smartphone", label: "Mobile & Online Banking", href: "/personal/digital-banking" },
      ],
    },
    {
      heading: "Borrow",
      items: [
        { icon: "hand-coins", label: "Personal Loans", href: "/personal/loans" },
        { icon: "key-round", label: "Mortgage", href: "/personal/mortgage" },
        { icon: "car", label: "Auto & Leisure Vehicles", href: "/personal/auto-loans" },
        { icon: "home", label: "Home Equity", href: "/personal/home-equity" },
      ],
    },
    {
      heading: "Spend",
      items: [
        { icon: "credit-card", label: "Credit Cards", href: "/personal/credit-cards" },
        { icon: "wallet", label: "Debit Cards", href: "/personal/debit-cards" },
        { icon: "shield-alert", label: "Overdraft Services", href: "/personal/overdraft" },
      ],
    },
  ],
  promo: {
    eyebrow: "Financial Wellness Center",
    heading: "Not sure where to start?",
    description: "Explore tools and guidance for every stage of your financial journey.",
    ctaLabel: "Get guidance",
    ctaHref: "/financial-wellness",
  },
};

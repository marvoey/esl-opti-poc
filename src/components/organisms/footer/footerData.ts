import type { FooterBrandSection, FooterNavColumn, FooterLinkItem } from "./Footer";

/**
 * Default mock content for the Footer organism.
 * No brand logo image asset exists in this project yet, so the brand mark
 * renders as a bold text wordmark instead of an <img>/next/image pointing
 * at a nonexistent file.
 */
export const defaultBrand: FooterBrandSection = {
  logoUrl: "/images/esl-logo.svg",
  logoAlt: "ESL",
  wordmark: "ESL",
  wordmarkHref: "/",
  text: "Member-owned banking, built around the people and places we call home.",
  button: {
    label: "Become a member",
    href: "/membership",
    variant: "secondary",
  },
};

export const defaultColumns: FooterNavColumn[] = [
  {
    id: "member-tools",
    title: "Member Tools",
    links: [
      { id: "member-tools-1", label: "Sign in to online banking", href: "/sign-in" },
      { id: "member-tools-2", label: "Find a branch or ATM", href: "/locations" },
      { id: "member-tools-3", label: "Rates at a glance", href: "/rates" },
      { id: "member-tools-4", label: "Become a Member", href: "/membership" },
    ],
  },
  {
    id: "help-support",
    title: "Help & Support",
    links: [
      { id: "help-support-1", label: "Common questions", href: "/help/faq" },
      { id: "help-support-2", label: "How-to guides", href: "/help/guides" },
      { id: "help-support-3", label: "Contact us", href: "/help/contact" },
      { id: "help-support-4", label: "Report fraud", href: "/help/report-fraud" },
    ],
  },
  {
    id: "manage",
    title: "Manage",
    links: [
      { id: "manage-1", label: "Free Checking", href: "/checking" },
      { id: "manage-2", label: "Savings", href: "/savings" },
      { id: "manage-3", label: "Credit Cards", href: "/credit-cards" },
      { id: "manage-4", label: "Mortgages", href: "/mortgages" },
    ],
  },
  {
    id: "about-esl",
    title: "About ESL",
    links: [
      { id: "about-esl-1", label: "Our story", href: "/about" },
      { id: "about-esl-2", label: "Careers", href: "/careers" },
      { id: "about-esl-3", label: "Community", href: "/community" },
      { id: "about-esl-4", label: "Social Channels", href: "/social" },
    ],
  },
];

export const defaultAddressText = "225 Chestnut Street, Rochester NY 14604";

export const defaultLegalLinks: FooterLinkItem[] = [
  { id: "legal-privacy", label: "Privacy Policy", href: "/privacy-policy" },
  { id: "legal-disclosures", label: "Disclosures", href: "/disclosures" },
  { id: "legal-security", label: "Security", href: "/security" },
];

export const defaultServiceMarksText =
  "ESL, TEL-E$L, and CheckOK are registered service marks of ESL Federal Credit Union. Membership is subject to eligibility.";

export const defaultDisclaimerText = defaultServiceMarksText;

export const defaultCopyrightText =
  "© 2026 ESL Federal Credit Union. All rights reserved.";

export const defaultFooterData = {
  brand: defaultBrand,
  columns: defaultColumns,
  addressText: defaultAddressText,
  legalLinks: defaultLegalLinks,
  serviceMarksText: defaultServiceMarksText,
  copyrightText: defaultCopyrightText,
  disclaimerText: defaultDisclaimerText,
};

import { type MediaCardProps } from "@/components/atoms/card/media-card/MediaCard";
import { type HeadingLevel } from "@/components/atoms/heading/Heading";

export type OfferCardItemData = MediaCardProps;

export interface OfferCardRowProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  cards?: OfferCardItemData[];
  className?: string;
}

export const DEFAULT_OFFER_CARDS_6: OfferCardItemData[] = [
  {
    id: "offer-1",
    imageSrc: "/images/offers/auto-loan.jpg",
    imageAlt: "Friends driving a convertible through the city",
    badge: "Limited Time",
    title: "X.XX% APR on new auto loans",
    description: "Get on the road with a rate set in members' favor. Offer ends MM/DD",
    ctaText: "Explore auto loans",
    href: "/auto-loans",
  },
  {
    id: "offer-2",
    imageSrc: "/images/offers/certificate.jpg",
    imageAlt: "Family packing boxes for a new home",
    badge: "Limited Time",
    title: "Earn X.XX% APY on a certificate",
    description: "Put savings to work for a set term, at a rate available until MM/DD.",
    ctaText: "Open a certificate",
    href: "/certificates",
  },
  {
    id: "offer-3",
    imageSrc: "/images/offers/checking.jpg",
    imageAlt: "3D stylized financial cash symbols",
    badge: "Limited Time",
    title: "$XXX when you open checking",
    description: "Switch your everyday banking and we'll help you move everything over.",
    ctaText: "Explore auto loans",
    href: "/checking",
  },
  {
    id: "offer-4",
    imageSrc: "/images/offers/auto-loan.jpg",
    imageAlt: "Digital credit card with rewards and points",
    badge: "Limited Time",
    title: "0% Intro APR on balance transfers",
    description: "Consolidate higher-interest balances and save with zero interest for 12 months.",
    ctaText: "Compare cards",
    href: "/credit-cards",
  },
  {
    id: "offer-5",
    imageSrc: "/images/offers/certificate.jpg",
    imageAlt: "Modern home with renovation improvements",
    badge: "Limited Time",
    title: "Lock in a competitive HELOC rate",
    description: "Tap into your home's equity for renovations, tuition, or major life expenses.",
    ctaText: "Learn about HELOC",
    href: "/home-equity",
  },
  {
    id: "offer-6",
    imageSrc: "/images/offers/checking.jpg",
    imageAlt: "Piggy bank and growing savings chart",
    badge: "Limited Time",
    title: "Earn up to X.XX% APY with Premier Savings",
    description: "Grow your rainy day fund faster with tiered dividend rates and zero monthly fees.",
    ctaText: "Start saving",
    href: "/savings",
  },
];

export const DEFAULT_OFFER_CARD_ROW_PROPS: OfferCardRowProps = {
  eyebrow: "WHAT'S NEW RIGHT NOW",
  title: "A few offers worth a look.",
  cards: DEFAULT_OFFER_CARDS_6,
};

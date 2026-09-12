import { type MediaCardItemData, type MediaCardGridProps } from "./MediaCardGrid";

export const DEFAULT_MEDIA_CARD_GRID_ITEMS: MediaCardItemData[] = [
  {
    id: "offer-1",
    imageSrc: "/images/offers/auto-loan.jpg",
    imageAlt: "Friends joyfully driving a red convertible on sunny street",
    badge: "Limited Time",
    title: "X.XX% APR on new auto loans",
    description: "Switch your everyday banking and we'll help you move everything over.",
    ctaText: "Explore auto loans",
    href: "/auto-loans",
  },
  {
    id: "offer-2",
    imageSrc: "/images/offers/certificate.jpg",
    imageAlt: "Happy family with daughter unpacking moving boxes in new home",
    badge: "Limited Time",
    title: "Earn X.XX% APY on a certificate",
    description: "Put savings to work for a set term, at a rate available until MM/DD.",
    ctaText: "Open a certificate",
    href: "/certificates",
  },
  {
    id: "offer-3",
    imageSrc: "/images/offers/checking.jpg",
    imageAlt: "Modern 3D geometric cubes with embossed white dollar currency sign",
    badge: "Limited Time",
    title: "$XXX when you open checking",
    description: "Switch your everyday banking and we'll help you move everything over.",
    ctaText: "Explore auto loans",
    href: "/checking",
  },
];

export const DEFAULT_MEDIA_CARD_GRID: MediaCardGridProps = {
  eyebrow: "WHAT'S NEW RIGHT NOW",
  title: "A few offers worth a look.",
  cards: DEFAULT_MEDIA_CARD_GRID_ITEMS,
};

export const DEFAULT_MEDIA_CARD_GRID_2_CARDS: MediaCardGridProps = {
  eyebrow: "WHAT'S NEW RIGHT NOW",
  title: "A few offers worth a look.",
  cards: [
    DEFAULT_MEDIA_CARD_GRID_ITEMS[0],
    DEFAULT_MEDIA_CARD_GRID_ITEMS[2],
  ],
};

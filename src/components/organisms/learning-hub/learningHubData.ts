import { type HeadingLevel } from "@/components/atoms/heading/Heading";

export interface LearningHubCardItem {
  id?: string;
  imageSrc: string;
  imageAlt?: string;
  badgeText: string;
  title: string;
  href?: string;
  external?: boolean;
}

export interface LearningHubProps {
  id?: string;
  eyebrow?: string;
  title: string;
  headingLevel?: HeadingLevel;
  description?: string;
  cta?: {
    label: string;
    href: string;
    external?: boolean;
  } | null;
  cards: LearningHubCardItem[];
  className?: string;
}

export const DEFAULT_LEARNING_HUB_PROPS: LearningHubProps = {
  eyebrow: "FINANCIAL WELLNESS",
  title: "Smart moves for the money you're setting aside.",
  description:
    "Plain-language guides and tools to help you save with a plan — and know which account to use.",
  cta: {
    label: "Explore the Financial Wellness Hub",
    href: "/financial-wellness",
  },
  cards: [
    {
      id: "learning-hub-emergency-fund",
      imageSrc: "/images/offers/certificate.jpg",
      imageAlt: "Certificate savings statement illustrating a steady emergency fund",
      badgeText: "Tool",
      title: "How much should you keep in an emergency fund?",
      href: "/financial-wellness/emergency-fund",
    },
    {
      id: "learning-hub-child-education",
      imageSrc: "/images/metrics/education.jpg",
      imageAlt: "Student preparing for the future through education savings",
      badgeText: "Article",
      title: "Saving for a child's education: where to start",
      href: "/financial-wellness/child-education-savings",
    },
    {
      id: "learning-hub-monthly-savings",
      imageSrc: "/images/offers/checking.jpg",
      imageAlt: "Everyday checking account used to track monthly savings",
      badgeText: "Article",
      title: "Small ways to save a little more each month",
      href: "/financial-wellness/small-savings-habits",
    },
  ],
};

import { SplitContentCtaProps } from "./SplitContentCta";

export const DEFAULT_SPLIT_CONTENT_CTA_PROPS: SplitContentCtaProps = {
  title: "Still weighing it up? Let's talk it through.",
  description:
    "Tell us how you bank day to day and we'll help you decide between Premier and Free Checking — no pressure to open today.",
  options: [
    {
      id: "find-a-branch",
      icon: "map-pin",
      title: "Find a branch",
      description: "Lorem ipsum if needed here",
      ctaText: "CTA here",
      href: "/locations",
    },
    {
      id: "contact-us",
      icon: "headphones",
      title: "Contact us",
      description: "Lorem ipsum if needed here",
      ctaText: "CTA here",
      href: "/contact",
    },
  ],
};

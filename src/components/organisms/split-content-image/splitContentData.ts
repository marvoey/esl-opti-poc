import type { SplitContentImageProps } from "./SplitContentImage";

export const DEFAULT_SPLIT_CONTENT: SplitContentImageProps = {
  title: "Let's figure out what's next, together.",
  description:
    "Whether you're looking to buy a home, start a business, or plan for retirement, our community advisors are here to help.",
  primaryCta: {
    label: "Become a member",
    href: "/personal/membership",
  },
  secondaryCta: {
    label: "Talk to someone first",
    href: "/contact",
  },
  eligibilityNote: "Open to anyone who lives, works, or worships in our community.",
  image: {
    src: "/images/split-content/community-collage.webp",
    alt: "Diverse ESL members and families representing the community",
    width: 933,
    height: 1024,
  },
};

import React from "react";
import { type HeadingLevel } from "@/components/atoms/heading/Heading";
import { type TestimonialAuthorInfo } from "@/components/atoms/card/testimonial-card/TestimonialCard";

export interface VideoStoryCardItemData {
  id?: string;
  imageSrc: string;
  imageAlt?: string;
  videoUrl?: string;
  videoTitle?: string;
  icon?: React.ReactNode;
  title: string;
  quote: React.ReactNode | string;
  author: TestimonialAuthorInfo | string;
}

export interface VideoStoryCardRowProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  description?: React.ReactNode | string;
  cta?: {
    label: string;
    href: string;
    external?: boolean;
  } | null;
  cards?: VideoStoryCardItemData[];
  className?: string;
}

export const DEFAULT_VIDEO_STORY_CARD_ROW: VideoStoryCardRowProps = {
  eyebrow: "Member Stories",
  title: "Real stories from members like you.",
  description:
    "See how local families and business owners build their future with personalized financial solutions from ESL.",
  cta: {
    label: "Watch more stories",
    href: "/stories",
  },
  cards: [
    {
      id: "story-1",
      imageSrc: "/images/testimonials/marcia.png",
      imageAlt: "Marcia, café owner in the Finger Lakes",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoTitle: "Marcia's Business Growth Story",
      title: "Expanded her business",
      quote:
        "Their business banking solutions helped me grow my company. Exceptional service and competitive rates.",
      author: {
        name: "Marcia",
        role: "café owner",
        location: "Finger Lakes",
      },
    },
    {
      id: "story-2",
      imageSrc: "/images/metrics/volunteers.jpg",
      imageAlt: "David, proud homeowner in Greater Rochester",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoTitle: "David's First Home Buying Journey",
      title: "Bought his first home",
      quote:
        "The mortgage team made what felt like an impossible dream straightforward and stress-free.",
      author: {
        name: "David",
        role: "homeowner",
        location: "Rochester",
      },
    },
    {
      id: "story-3",
      imageSrc: "/images/metrics/education.jpg",
      imageAlt: "Elena, university student and savings club member",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoTitle: "Elena's Financial Independence Story",
      title: "Saved for college",
      quote:
        "Opening my first student account taught me financial confidence before I even set foot on campus.",
      author: {
        name: "Elena",
        role: "student",
        location: "Brighton",
      },
    },
  ],
};

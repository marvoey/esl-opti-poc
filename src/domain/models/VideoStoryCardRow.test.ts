import { describe, it, expect } from "vitest";
import { VideoStoryCardRowSchema } from "./VideoStoryCardRow";

describe("VideoStoryCardRow Domain Schema", () => {
  const validData = {
    eyebrow: "Member Stories",
    title: "Real stories from members like you.",
    description: "Personalized financial solutions from ESL.",
    cta: {
      label: "Watch more stories",
      href: "/stories",
    },
    cards: [
      {
        imageSrc: "/images/testimonials/marcia.png",
        imageAlt: "Marcia",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoTitle: "Marcia's Story",
        title: "Expanded her business",
        quote: "Their business banking solutions helped me grow.",
        author: {
          name: "Marcia",
          role: "café owner",
          location: "Finger Lakes",
        },
      },
      {
        imageSrc: "/images/metrics/volunteers.jpg",
        imageAlt: "David",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoTitle: "David's Story",
        title: "Bought his first home",
        quote: "The mortgage team made it straightforward and stress-free.",
        author: "David · Homeowner · Rochester",
      },
      {
        imageSrc: "/images/metrics/education.jpg",
        imageAlt: "Elena",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoTitle: "Elena's Story",
        title: "Saved for college",
        quote: "Opening my first student account taught me financial confidence.",
        author: {
          name: "Elena",
          role: "student",
          location: "Brighton",
        },
      },
    ],
  };

  it("validates valid video story card row data", () => {
    const result = VideoStoryCardRowSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("requires exactly 3 cards", () => {
    const invalidData = {
      ...validData,
      cards: validData.cards.slice(0, 2),
    };
    const result = VideoStoryCardRowSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("applies default values for missing optional fields", () => {
    const minimalData = {
      cards: [
        {
          imageSrc: "/images/testimonials/marcia.png",
          title: "Story 1",
          quote: "Quote 1",
          author: "Author 1",
        },
        {
          imageSrc: "/images/metrics/volunteers.jpg",
          title: "Story 2",
          quote: "Quote 2",
          author: "Author 2",
        },
        {
          imageSrc: "/images/metrics/education.jpg",
          title: "Story 3",
          quote: "Quote 3",
          author: "Author 3",
        },
      ],
    };
    const result = VideoStoryCardRowSchema.safeParse(minimalData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.eyebrow).toBe("Member Stories");
      expect(result.data.cta.label).toBe("Watch more stories");
    }
  });

  it("rejects cards with missing required fields", () => {
    const invalidData = {
      cards: [
        {
          // missing imageSrc
          title: "Story 1",
          quote: "Quote 1",
          author: "Author 1",
        },
        {
          imageSrc: "/images/metrics/volunteers.jpg",
          title: "Story 2",
          quote: "Quote 2",
          author: "Author 2",
        },
        {
          imageSrc: "/images/metrics/education.jpg",
          title: "Story 3",
          quote: "Quote 3",
          author: "Author 3",
        },
      ],
    };
    const result = VideoStoryCardRowSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

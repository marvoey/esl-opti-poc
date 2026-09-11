import { z } from "zod";

export const TestimonialAuthorInfoSchema = z.object({
  name: z.string().min(1, "Author name is required"),
  role: z.string().optional(),
  location: z.string().optional(),
});

export const VideoStoryCardItemSchema = z.object({
  id: z.string().optional(),
  imageSrc: z.string().min(1, "Thumbnail image source is required"),
  imageAlt: z.string().optional().default("Testimonial video thumbnail"),
  videoUrl: z.string().optional(),
  videoTitle: z.string().optional(),
  title: z.string().min(1, "Story title is required"),
  quote: z.string().min(1, "Testimonial quote is required"),
  author: z.union([TestimonialAuthorInfoSchema, z.string()]),
});

export const VideoStoryCardRowCtaSchema = z.object({
  label: z.string().min(1, "CTA label is required"),
  href: z.string().min(1, "CTA href is required"),
  external: z.boolean().optional().default(false),
});

export const VideoStoryCardRowSchema = z.object({
  id: z.string().optional(),
  eyebrow: z.string().default("Member Stories"),
  title: z.string().default("Real stories from members like you."),
  description: z.string().default(
    "See how local families and business owners build their future with personalized financial solutions from ESL."
  ),
  cta: VideoStoryCardRowCtaSchema.default({
    label: "Watch more stories",
    href: "/stories",
    external: false,
  }),
  cards: z.array(VideoStoryCardItemSchema).length(3, "Exactly 3 story cards required"),
});

export type TestimonialAuthorInfoModel = z.infer<typeof TestimonialAuthorInfoSchema>;
export type VideoStoryCardItemModel = z.infer<typeof VideoStoryCardItemSchema>;
export type VideoStoryCardRowCtaModel = z.infer<typeof VideoStoryCardRowCtaSchema>;
export type VideoStoryCardRowModel = z.infer<typeof VideoStoryCardRowSchema>;

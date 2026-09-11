import { z } from "zod";

export const MediaCardItemSchema = z.object({
  id: z.string().optional(),
  imageSrc: z.string().min(1, "Banner image source is required"),
  imageAlt: z.string().optional().default("Promotional media card"),
  badge: z.string().optional().default("Limited Time"),
  title: z.string().min(1, "Card title is required"),
  description: z.string().min(1, "Card description is required"),
  ctaText: z.string().optional().default("Explore auto loans"),
  href: z.string().min(1, "CTA href is required"),
  external: z.boolean().optional().default(false),
});

export const MediaCardGridSchema = z.object({
  id: z.string().optional(),
  eyebrow: z.string().default("WHAT'S NEW RIGHT NOW"),
  title: z.string().default("A few offers worth a look."),
  cards: z
    .array(MediaCardItemSchema)
    .min(2, "At least 2 media cards required")
    .max(3, "At most 3 media cards allowed"),
});

export type MediaCardItemModel = z.infer<typeof MediaCardItemSchema>;
export type MediaCardGridModel = z.infer<typeof MediaCardGridSchema>;

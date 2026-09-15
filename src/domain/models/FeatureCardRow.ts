import { z } from "zod";

export const FeatureCardItemSchema = z.object({
  id: z.string().optional(),
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const FeatureCardRowSchema = z.object({
  id: z.string().optional(),
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  items: z.array(FeatureCardItemSchema).min(1).max(6),
});

export type FeatureCardItemModel = z.infer<typeof FeatureCardItemSchema>;
export type FeatureCardRowModel = z.infer<typeof FeatureCardRowSchema>;

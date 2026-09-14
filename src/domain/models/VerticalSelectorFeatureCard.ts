import { z } from "zod";

export const FeatureCardCtaSchema = z.object({
  label: z.string().min(1, "CTA label is required"),
  href: z.string().min(1, "CTA href is required"),
  external: z.boolean().optional().default(false),
});

export const FeatureCardMediaSchema = z.object({
  src: z.string().min(1, "Feature image src is required"),
  alt: z.string().default("Feature representation"),
  width: z.number().optional().default(720),
  height: z.number().optional().default(328),
});

export const FeatureCardContentSchema = z.object({
  title: z.string().min(1, "Feature title is required"),
  description: z.string().min(1, "Feature description is required"),
  image: FeatureCardMediaSchema,
  cta: FeatureCardCtaSchema.optional(),
});

export const VerticalSelectorTabItemSchema = z.object({
  id: z.string().min(1, "Tab id is required"),
  label: z.string().min(1, "Tab label is required"),
  icon: z.string().optional(),
  feature: FeatureCardContentSchema,
});

export const VerticalSelectorFeatureCardSchema = z.object({
  id: z.string().optional(),
  eyebrow: z.string().default("BANKING FOR EVERY STAGE OF LIFE"),
  title: z.string().default("Wherever you are, we’ll help you take the next step."),
  description: z.string().default(
    "Pick the moment that fits your life right now — we’ll point you to accounts and next steps that make sense."
  ),
  cta: z
    .object({
      label: z.string().default("Explore Financial Wellness Center"),
      href: z.string().default("/wellness"),
      external: z.boolean().optional().default(false),
    })
    .optional(),
  tabs: z
    .array(VerticalSelectorTabItemSchema)
    .min(1, "At least 1 tab is required")
    .max(8, "Maximum 8 tabs allowed"),
});

export type FeatureCardCtaModel = z.infer<typeof FeatureCardCtaSchema>;
export type FeatureCardMediaModel = z.infer<typeof FeatureCardMediaSchema>;
export type FeatureCardContentModel = z.infer<typeof FeatureCardContentSchema>;
export type VerticalSelectorTabItemModel = z.infer<typeof VerticalSelectorTabItemSchema>;
export type VerticalSelectorFeatureCardModel = z.infer<typeof VerticalSelectorFeatureCardSchema>;

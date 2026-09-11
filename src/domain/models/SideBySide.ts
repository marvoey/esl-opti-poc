import { z } from "zod";

export const SideBySideVariantSchema = z.enum(["dark", "light"]);

export const SideBySideCtaSchema = z.object({
  label: z.string().min(1, "CTA label is required"),
  url: z.string().min(1, "CTA URL is required"),
  external: z.boolean().optional().default(false),
  target: z.enum(["_blank", "_self"]).optional(),
  rel: z.string().optional(),
});

export const SideBySideImageSchema = z.object({
  src: z.string().min(1, "Image source URL is required"),
  alt: z.string().default(""),
  width: z.number().optional().default(800),
  height: z.number().optional().default(600),
});

export const SideBySideSchema = z.object({
  id: z.string(),
  variant: SideBySideVariantSchema.default("dark"),
  eyebrow: z.string().min(1, "Eyebrow is required"),
  headline: z.string().min(1, "Headline is required"),
  body: z.string().max(300, "Recommended body length 140-160 characters"),
  cta: SideBySideCtaSchema,
  image: SideBySideImageSchema,
});

export type SideBySideVariant = z.infer<typeof SideBySideVariantSchema>;
export type SideBySideCtaModel = z.infer<typeof SideBySideCtaSchema>;
export type SideBySideImageModel = z.infer<typeof SideBySideImageSchema>;
export type SideBySideModel = z.infer<typeof SideBySideSchema>;

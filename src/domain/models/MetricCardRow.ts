import { z } from "zod";

export const RatesCardItemSchema = z.object({
  id: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  rate: z.string().min(1, "Rate value is required"),
  rateUnit: z.string().optional().default("%"),
  rateLabel: z.string().optional().default("APR"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  ctaText: z.string().optional().default("Explore options"),
  href: z.string().optional(),
  variant: z.enum(["default", "active"]).optional().default("default"),
});

export const MetricCardRowCtaSchema = z.object({
  label: z.string().min(1, "CTA label is required"),
  href: z.string().min(1, "CTA href is required"),
  external: z.boolean().optional().default(false),
});

export const MetricCardRowSchema = z.object({
  id: z.string().optional(),
  eyebrow: z.string().default("Competitive Rates"),
  title: z.string().default("Rates that work for your goals."),
  description: z.string().default(
    "Explore high-yield savings, auto loans, and mortgages designed to help you keep more of what you earn."
  ),
  cta: MetricCardRowCtaSchema.default({
    label: "View all rates",
    href: "/rates",
    external: false,
  }),
  cards: z.array(RatesCardItemSchema).length(3, "Exactly 3 rates cards required"),
});

export type RatesCardItemModel = z.infer<typeof RatesCardItemSchema>;
export type MetricCardRowCtaModel = z.infer<typeof MetricCardRowCtaSchema>;
export type MetricCardRowModel = z.infer<typeof MetricCardRowSchema>;

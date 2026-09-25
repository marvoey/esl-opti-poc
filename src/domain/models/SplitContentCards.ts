import { z } from "zod";

export const SplitContentCardsHeroMetricSchema = z.object({
  subhead: z.string().default("OWNERS' DIVIDEND, RETURNED TO MEMBERS"),
  value: z.string().default("$XX"),
  unit: z.string().default("million"),
  description: z.string().default("Money returned to members — because you own a share of the bank."),
});

export const SplitContentCardsStatItemSchema = z.object({
  id: z.string().optional(),
  value: z.string().min(1, "Stat value is required"),
  label: z.string().min(1, "Stat label is required"),
  icon: z.string().optional(),
});

export const SplitContentCardsCtaSchema = z.object({
  label: z.string().default("See how membership works"),
  href: z.string().default("/membership"),
});

export const SplitContentCardsSchema = z.object({
  id: z.string().optional(),
  eyebrow: z.string().default("WHY OUR GUIDANCE IS DIFFERENT"),
  title: z.string().default("Advice from a bank you own."),
  description: z.string().default(
    "ESL is member-owned. We don't answer to outside shareholders — so the advice you get is built around what's right for you. When we do well, that comes back to you."
  ),
  cta: SplitContentCardsCtaSchema.optional(),
  heroMetric: SplitContentCardsHeroMetricSchema.optional(),
  statCards: z.array(SplitContentCardsStatItemSchema).default([]),
  backgroundImage: z.string().optional(),
});

export type SplitContentCardsHeroMetricModel = z.infer<typeof SplitContentCardsHeroMetricSchema>;
export type SplitContentCardsStatItemModel = z.infer<typeof SplitContentCardsStatItemSchema>;
export type SplitContentCardsCtaModel = z.infer<typeof SplitContentCardsCtaSchema>;
export type SplitContentCardsModel = z.infer<typeof SplitContentCardsSchema>;

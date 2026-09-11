import { z } from "zod";

export const HeroSlideSchema = z.object({
  id: z.string(),
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleLine2: z.string().optional(),
  body: z.string(),
  primaryCta: z.string(),
  primaryCtaHref: z.string().optional(),
  primaryCtaTarget: z.string().optional(),
  primaryCtaRel: z.string().optional(),
  secondaryCta: z.string(),
  secondaryCtaHref: z.string().optional(),
  secondaryCtaTarget: z.string().optional(),
  secondaryCtaRel: z.string().optional(),
  imageSrc: z.string().optional(),
  imageAlt: z.string().optional(),
  badgeStat: z.string().optional(),
  badgeLabel: z.string().optional(),
});

export const HeroSliderSchema = z.object({
  slides: z.array(HeroSlideSchema),
});

export const SnipeCtaSchema = z.object({
  title: z.string(),
  description: z.string(),
  linkLabel: z.string(),
  linkHref: z.string(),
  linkTarget: z.string().optional(),
  linkRel: z.string().optional(),
});

export const TabbedCardItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  href: z.string(),
  variant: z.literal("default").optional(),
});

export const TabCategorySchema = z.object({
  id: z.string(),
  label: z.string(),
  cards: z.array(TabbedCardItemSchema),
});

export const TabbedSolutionsSchema = z.object({
  heading: z.string().optional(),
  tabs: z.array(TabCategorySchema),
});

export const SideBySidePromoSchema = z.object({
  variant: z.enum(["dark", "light"]).optional(),
  eyebrow: z.string(),
  headline: z.string(),
  body: z.string(),
  ctaLabel: z.string(),
  ctaUrl: z.string(),
  ctaExternal: z.boolean().optional(),
  imageSrc: z.string(),
  imageAlt: z.string(),
});

export const HomePageSchema = z.object({
  heroSlider: HeroSliderSchema,
  snipeCta: SnipeCtaSchema,
  showExploreSolutions: z.boolean().optional(),
  tabbedSolutions: TabbedSolutionsSchema,
  sideBySidePromo: SideBySidePromoSchema,
  sideBySidePromoSecondary: SideBySidePromoSchema.optional(),
});

export type HeroSlideModel = z.infer<typeof HeroSlideSchema>;
export type SnipeCtaModel = z.infer<typeof SnipeCtaSchema>;
export type TabbedCardItemModel = z.infer<typeof TabbedCardItemSchema>;
export type TabCategoryModel = z.infer<typeof TabCategorySchema>;
export type SideBySidePromoModel = z.infer<typeof SideBySidePromoSchema>;
export type HomePageModel = z.infer<typeof HomePageSchema>;

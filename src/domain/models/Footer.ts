import { z } from "zod";

export const FooterLinkItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
  external: z.boolean().optional(),
  target: z.enum(["_blank", "_self"]).optional(),
  rel: z.string().optional(),
});

export const FooterNavColumnSchema = z.object({
  id: z.string(),
  title: z.string(),
  links: z.array(FooterLinkItemSchema),
});

export const FooterBrandButtonSchema = z.object({
  label: z.string(),
  href: z.string(),
  variant: z.enum(["primary", "secondary", "inverse-primary", "inverse-secondary"]).optional(),
  external: z.boolean().optional(),
});

export const FooterBrandSectionSchema = z.object({
  logoUrl: z.string().optional(),
  logoAlt: z.string().optional(),
  wordmark: z.string().optional(),
  wordmarkHref: z.string().optional(),
  text: z.string(),
  button: FooterBrandButtonSchema.optional(),
});

export const FooterModelSchema = z.object({
  brand: FooterBrandSectionSchema.optional(),
  columns: z.array(FooterNavColumnSchema).max(4).optional(),
  addressText: z.string().optional(),
  legalLinks: z.array(FooterLinkItemSchema).max(3).optional(),
  serviceMarksText: z.string().optional(),
  copyrightText: z.string().optional(),
});

export type FooterLinkItemModel = z.infer<typeof FooterLinkItemSchema>;
export type FooterNavColumnModel = z.infer<typeof FooterNavColumnSchema>;
export type FooterBrandSectionModel = z.infer<typeof FooterBrandSectionSchema>;
export type FooterModel = z.infer<typeof FooterModelSchema>;

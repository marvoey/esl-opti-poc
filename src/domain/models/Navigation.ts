import { z } from "zod";

export const NavItemSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Navigation label is required"),
  href: z.string(),
  isExternal: z.boolean().default(false),
});

export const NavigationSchema = z.object({
  brandName: z.string().min(1),
  brandHref: z.string().default("/"),
  items: z.array(NavItemSchema),
});

export type NavItem = z.infer<typeof NavItemSchema>;
export type NavigationModel = z.infer<typeof NavigationSchema>;

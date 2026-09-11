import { z } from "zod";

export const MetricItemImageSchema = z.object({
  src: z.string().min(1, "Image source is required"),
  alt: z.string().default(""),
  width: z.number().optional().default(180),
  height: z.number().optional().default(180),
});

export const MetricItemSchema = z.object({
  id: z.string().optional(),
  image: MetricItemImageSchema,
  stat: z.string().min(1, "Stat text is required"),
  label: z.string().min(1, "Label text is required"),
});

export const CircularImageMetricRowCtaSchema = z.object({
  label: z.string().min(1, "CTA label is required"),
  href: z.string().min(1, "CTA href is required"),
  external: z.boolean().optional().default(false),
});

export const CircularImageMetricRowSchema = z.object({
  id: z.string().optional(),
  eyebrow: z.string().default("In the community"),
  title: z.string().default("Because we live here, too."),
  description: z.string().default(
    "We live and work where our members do. That connection shapes how we show up — in classrooms, on main streets, and at the causes close to home."
  ),
  cta: CircularImageMetricRowCtaSchema.default({
    label: "See our community work",
    href: "/community",
    external: false,
  }),
  metrics: z.array(MetricItemSchema).length(3, "Exactly 3 metrics required"),
});

export type MetricItemModel = z.infer<typeof MetricItemSchema>;
export type CircularImageMetricRowCtaModel = z.infer<typeof CircularImageMetricRowCtaSchema>;
export type CircularImageMetricRowModel = z.infer<typeof CircularImageMetricRowSchema>;

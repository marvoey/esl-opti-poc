# Component Specification: Side by Side (`<SideBySide>`)

> **Classification**: Organism Component  
> **Target Directory**: `src/components/organisms/side-by-side/`  
> **Status**: Ready for Implementation  
> **Design System Compliance**: Strict 3-Tier Tokens • Responsive 2-Column Grid • Atomic Design • WCAG 2.1 AA Compliance  

---

## 1. Overview & Architectural Intent

The **Side by Side** component is a reusable, two-column promotional banner designed to spotlight featured offers, products, or member services. 

The design provides **two visual layout variants** of the same underlying component:
- **Variant A (Dark)**: Navy background (`--color-navy-900`), text content on the left, full-bleed landscape image on the right.
- **Variant B (Light)**: White surface background (`--color-white`), text content on the right, full-bleed landscape image on the left.

*(Note: The dotted "mirror" indicator connecting both variants in design deliverables is an editorial design annotation indicating the alternating layout pattern, not an interactive or rendered UI element).*

```
Variant A — Dark (Desktop 50/50 Split):
┌──────────────────────────────────────┬──────────────────────────────────────┐
│ [Content Column - Navy Background]   │ [Image Column - Flush Edge-to-Edge]  │
│                                      │                                      │
│  EYEBROW LABEL                       │ ┌──────────────────────────────────┐ │
│  Headline with Key Rate or Value     │ │                                  │ │
│  Body description paragraph.         │ │     800x600 Cover Image          │ │
│  [ Primary CTA Button ]              │ │     Outer Corners: 24px Radius   │ │
│                                      │ │     Inner Edge: Square (0px)     │ │
│  Padding: 40px vert / 48px horiz     │ └──────────────────────────────────┘ │
└──────────────────────────────────────┴──────────────────────────────────────┘
(Outer card radius: 24px on all 4 corners)

Variant B — Light (Desktop 50/50 Split - Mirrored):
┌──────────────────────────────────────┬──────────────────────────────────────┐
│ [Image Column - Flush Edge-to-Edge]  │ [Content Column - White Background]  │
│                                      │                                      │
│ ┌──────────────────────────────────┐ │  EYEBROW LABEL                       │
│ │                                  │ │  Headline with Key Rate or Value     │
│ │     800x600 Cover Image          │ │  Body description paragraph.         │
│ │     Outer Corners: 24px Radius   │ │  [ Primary CTA Button ]              │
│ │     Inner Edge: Square (0px)     │ │                                      │
│ └──────────────────────────────────┘ │  Padding: 40px vert / 48px horiz     │
└──────────────────────────────────────┴──────────────────────────────────────┘
(Outer card radius: 24px on all 4 corners)
```

---

## 2. Layout & Responsive Structure

### 2.1 Section Container
- **Outer Wrapper**: `<section className={styles.section}>` with strict **88px vertical padding block** (`padding-block: 5.5rem;` / `88px`).
- **Inner Constraint**: Standard responsive `.container` (`max-width: 1200px; margin-inline: auto; padding-inline: 15px;`).

### 2.2 Card Shell & Grid
- **Card Wrapper**: `<article className={styles.card}>` with outer border radius: **24px** (`var(--radius-xl)` / `1.5rem`).
- **Layout Model**: 2-column CSS Grid (`grid-template-columns: 1fr 1fr;` at desktop `width >= 1024px`).
- **Stacking Behavior (Mobile)**:
  - Stacks into a single column (`grid-template-columns: 1fr;`).
  - Mobile display order: Content column appears above or below according to content hierarchy (by default: image top, content bottom for visual engagement, or natural DOM order).
- **Corner Radii Integrity**:
  - Desktop: Outer card corners have `border-radius: 24px`.
  - Image Column: Outer corners match the card (24px); the inner vertical edge meeting the content column is square (`0px`).
    - *Variant A (Image Right)*: `border-radius: 0 24px 24px 0;`
    - *Variant B (Image Left)*: `border-radius: 24px 0 0 24px;`
  - Mobile: Image outer top corners: `border-radius: 24px 24px 0 0;`, content bottom corners: `border-radius: 0 0 24px 24px;`.
  - `overflow: hidden;` is applied to the card to guarantee clean clipping.

### 2.3 Content Column
- **Alignment**: Vertically centered (`display: flex; flex-direction: column; justify-content: center;`).
- **Internal Padding**:
  - Desktop: `padding: 40px 48px;` (`2.5rem 3rem`).
  - Mobile: `padding: 32px 24px;` (`2rem 1.5rem`).
- **Text Alignment**: Left-aligned (`text-align: left;`).
- **Vertical Rhythm Gaps**:
  - Eyebrow → Headline: **12px–16px** (`var(--space-sm)` / `0.75rem`–`1rem`).
  - Headline → Body: **16px** (`var(--space-md)` / `1rem`).
  - Body → CTA: **24px** (`var(--space-lg)` / `1.5rem`).

### 2.4 Image Column
- **Dimensions**: Edge-to-edge flush within its column slot (`width: 100%; height: 100%; min-height: 320px;`).
- **Aspect Ratio & Fit**: Next.js `<Image fill priority={false} sizes="(min-width: 1024px) 50vw, 100vw" />` with `object-fit: cover;`.
- **Recommended Asset**: Landscape orientation, minimum 800×600 resolution.

---

## 3. Variant Matrix

| Variant | Card Background | Text Eyebrow | Headline Color | Body Color | CTA Button Variant | Text Col Order | Image Col Order |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **A (Dark)** | `var(--color-navy-900)` (`#00395D`) | `vibrant` (Turquoise `#68E0CC`) | `inverted` (`#FFFFFF`) | `inverted-muted` (White 80%) | `primary` or `secondary` | Col 1 (Left) | Col 2 (Right) |
| **B (Light)** | `var(--color-white)` (`#FFFFFF`) | `accent` (Teal `#00A3A3`) | `primary` (`#00395D`) | `secondary` (`#4E5059`) | `primary` | Col 2 (Right) | Col 1 (Left) |

---

## 4. Content Model & TypeScript Contracts

### 4.1 Domain Schema (`src/domain/models/SideBySide.ts`)

```typescript
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
```

### 4.2 Component Props (`SideBySide.tsx`)

```typescript
export interface SideBySideProps {
  id?: string;
  variant?: "dark" | "light";
  headingLevel?: "h1" | "h2" | "h3" | "h4";
  eyebrow: string;
  headline: React.ReactNode;
  body: string | React.ReactNode;
  ctaLabel: string;
  ctaUrl: string;
  ctaExternal?: boolean;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}
```

---

## 5. Composition Contract (Atomic Integration)

The organism strictly composes existing atom components:

1. **Eyebrow**: `<Eyebrow color={isDark ? "vibrant" : "brand"}>{eyebrow}</Eyebrow>`
   - Automatically handles uppercase transform, tracking (`2.2px`), and Albert Sans bold typography.
2. **Headline**: `<Heading level={headingLevel} color={isDark ? "inverted" : "primary"}>{headline}</Heading>`
   - Defaults to semantic `h3` heading hierarchy with fluid typography scale.
3. **Body**: `<Text as="p" variant="body" color={isDark ? "inverted-muted" : "secondary"}>{body}</Text>`
   - 16px font size with 24px line-height.
4. **CTA Button**: `<Button href={ctaUrl} variant={isDark ? "secondary" : "primary"}>{ctaLabel}</Button>`
   - Fully accessible interactive action with hover transitions and focus ring.
5. **Image**: `<Image src={imageSrc} alt={imageAlt} fill className={styles.image} />`

---

## 6. Accessibility & Compliance (WCAG 2.1 AA)

- **Semantic Landmark**: Uses `<section aria-labelledby={headingId}>` and `<article>`.
- **Heading Hierarchy**: Headline rendered with semantic `<Heading level="h3">` (or configurable tag level).
- **Color Contrast**:
  - Dark variant: Turquoise on Navy (`#68E0CC` on `#00395D`) exceeds **4.5:1** contrast ratio; White text (`#FFFFFF` on `#00395D`) reaches **10.5:1**.
  - Light variant: Navy on White (`#00395D` on `#FFFFFF`) reaches **10.5:1** contrast ratio.
- **Screen Reader Image Handling**: `imageAlt` is strictly enforced. If left empty, `aria-hidden="true"` is applied for decorative treatment.
- **Focus Management**: Focus outlines on CTA button respect `:focus-visible` with `2px solid var(--color-turquoise-400)` and `2px` offset.

---

## 7. Test Scenarios (Vitest & Testing Library)

```typescript
describe("SideBySide Organism", () => {
  it("renders Variant A (Dark) with correct visual hierarchy and class modifiers", () => {
    // Verifies dark card class, text on left, image on right
  });

  it("renders Variant B (Light) with mirrored layout and correct typography tokens", () => {
    // Verifies light card class, text on right, image on left
  });

  it("renders CTA button with correct link href and accessibility labels", () => {
    // Verifies Button link target and text
  });

  it("renders cover image with alt text and responsive fill attributes", () => {
    // Verifies Next.js Image properties and container boundaries
  });
});
```

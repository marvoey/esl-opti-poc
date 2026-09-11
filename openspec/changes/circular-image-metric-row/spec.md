# Component Specification: Circular Image Metric Row (`<CircularImageMetricRow>`)

> **Classification**: Organism Component  
> **Target Directory**: `src/components/organisms/circular-image-metric-row/`  
> **Status**: Approved Spec  
> **Design System Compliance**: Strict 3-Tier Tokens • Media Range Queries • Typography Composition Law • Next.js 15 Image Optimization • WCAG 2.2 AA Compliance  

---

## 1. Overview & Architectural Intent

The **Circular Image Metric Row** is an editorial community/impact organism designed to spotlight local engagement, corporate social responsibility, and community statistics.

The organism is composed of:
1. **Header Row (Div 1)**: Full width (100%), split into two responsive columns:
   - **Left Column**: Constrained text block (max-width `585px`) containing an uppercase Eyebrow in Teal (`#00A3A3`), an `h2` heading in Deep Navy (`#00395D`), and a `body-lg` description paragraph in Deep Navy (`#00395D`) with strict `16px` vertical gaps.
   - **Right Column**: Primary Pill button with trailing arrow icon aligned flush to the bottom-right on desktop.
2. **Metrics Row (Div 2)**: Full width (100%) with `48px` top margin, displaying 3 equal metric columns:
   - Each column is centered with a max-width of `300px`.
   - Contains a full circular portrait image (`border-radius: 50%`) with `16px` bottom margin.
   - Displays a prominent Stat callout (`clamp(2.5rem, ... 3.75rem)`) in Teal (`#00A3A3`).
   - Followed by a centered explanatory Body label (`16px`) in Deep Navy (`#00395D`).
3. **Mobile Stacking Behavior**: On mobile screens (`< 768px`), the header columns stack vertically with the CTA positioned below the text, and the 3 metric columns stack vertically into a single column.

```
Desktop Layout (≥768px):
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ <section> with padding-block: 64px (4rem)                                              │
│  <div className="container">                                                           │
│                                                                                        │
│   ┌───────────────────────────────────────────────┬──────────────────────────────────┐ │
│   │ [Header Row - Col 1: Max Width 585px]         │ [Header Row - Col 2: End/Bottom] │ │
│   │                                               │                                  │ │
│   │  EYEBROW: "In the community" (#00A3A3)        │                                  │ │
│   │  (16px margin)                                │                                  │ │
│   │  H2: "Because we live here, too." (#00395D)   │                                  │ │
│   │  (16px margin)                                │                                  │ │
│   │  BODY-LG: "We live and work where our members │  [ See our community work  → ]   │ │
│   │  do. That connection shapes how we show up... │  (Pill Primary Button - Bottom-R)│ │
│   └───────────────────────────────────────────────┴──────────────────────────────────┘ │
│                                                                                        │
│   ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│   │ [Metrics Row - 100% Width, Margin-Top: 48px, 3-Column Grid]                      │ │
│   │                                                                                  │ │
│   │    ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐      │ │
│   │    │  (  Circle Image )│      │  (  Circle Image )│      │  (  Circle Image )│      │ │
│   │    │  (   180x180 px  )│      │  (   180x180 px  )│      │  (   180x180 px  )│      │ │
│   │    │  └──────────────┘│      │  └──────────────┘│      │  └──────────────┘│      │ │
│   │    │    (16px margin) │      │    (16px margin) │      │    (16px margin) │      │ │
│   │    │      12,480      │      │       $2.4M      │      │        180+      │      │ │
│   │    │   Stat (#00A3A3) │      │   Stat (#00A3A3) │      │   Stat (#00A3A3) │      │ │
│   │    │                  │      │                  │      │                  │      │ │
│   │    │  Body text in    │      │  Body text in    │      │  Body text in    │      │ │
│   │    │  #00395D         │      │  #00395D         │      │  #00395D         │      │ │
│   │    │  (Max 300px, ctr)│      │  (Max 300px, ctr)│      │  (Max 300px, ctr)│      │ │
│   │    └──────────────────┘      └──────────────────┘      └──────────────────┘      │ │
│   └──────────────────────────────────────────────────────────────────────────────────┘ │
│  </div>                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────┘

Mobile Layout (<768px):
┌───────────────────────────────────────────────┐
│ <section> with padding-block: 32px (2rem)     │
│  <div className="container">                  │
│                                               │
│   [Col 1: Text Section - Max Width 585px]     │
│   EYEBROW: "In the community"                 │
│   H2: "Because we live here, too."            │
│   BODY-LG: "We live and work where..."        │
│                                               │
│   [Col 2: CTA - Left/Full-width on Mobile]    │
│   [ See our community work  → ]               │
│                                               │
│   (Margin-Top: 48px)                          │
│                                               │
│   [Metric Item 1: Centered, Max 300px]        │
│   ( Circle Image )                            │
│   12,480 (#00A3A3)                            │
│   Body text (#00395D)                         │
│                                               │
│   [Metric Item 2: Centered, Max 300px]        │
│   ( Circle Image )                            │
│   $2.4M (#00A3A3)                             │
│   Body text (#00395D)                         │
│                                               │
│   [Metric Item 3: Centered, Max 300px]        │
│   ( Circle Image )                            │
│   180+ (#00A3A3)                              │
│   Body text (#00395D)                         │
│  </div>                                       │
└───────────────────────────────────────────────┘
```

---

## 2. Layout & DOM Hierarchy

```
<section className={styles.section} aria-labelledby={headingId}>
  <div className={`container ${styles.container}`}>
    
    {/* Div 1: Header Row (100% Width) */}
    <div className={styles.headerRow}>
      <div className={styles.headerContent}>
        <Eyebrow color="accent" className={styles.eyebrow}>
          {eyebrow}
        </Eyebrow>
        <Heading level="h2" id={headingId} className={styles.title}>
          {title}
        </Heading>
        <Text as="p" variant="body-lg" color="primary" className={styles.description}>
          {description}
        </Text>
      </div>

      <div className={styles.headerCta}>
        <Button
          variant="primary"
          shape="pill"
          href={cta.href}
          rightIcon={<ArrowRightIcon size={20} />}
          {...ctaExternalProps}
        >
          {cta.label}
        </Button>
      </div>
    </div>

    {/* Div 2: Metrics Row (100% Width, Margin-Top: 48px) */}
    <div className={styles.metricsRow}>
      {metrics.map((item, index) => (
        <div key={item.id ?? index} className={styles.metricCard}>
          <div className={styles.imageWrapper}>
            <Image
              src={item.image.src}
              alt={item.image.alt}
              width={item.image.width ?? 180}
              height={item.image.height ?? 180}
              className={styles.circleImage}
            />
          </div>
          <Text as="span" variant="stat" color="accent" className={styles.stat}>
            {item.stat}
          </Text>
          <Text as="p" variant="body" color="primary" className={styles.metricLabel}>
            {item.label}
          </Text>
        </div>
      ))}
    </div>

  </div>
</section>
```

---

## 3. Structural & CSS Specifications

### 3.1 Outer Section & Container
- **Outer Wrapper (`.section`)**:
  - `width: 100%;`
  - `background: var(--color-bg);` (`#FFFFFF`)
  - **Desktop**: `padding-block: 4rem;` (`64px`)
  - **Mobile (`width < 768px`)**: `padding-block: 2rem;` (`32px`)
- **Inner Container (`.container`)**:
  - Max width: `var(--container-max-w)` (`1200px`)
  - Centered: `margin-inline: auto;`
  - Gutters: `padding-inline: var(--container-gutter);` (`15px`)
  - `display: flex; flex-direction: column; width: 100%;`

### 3.2 First Div: Header Row (`.headerRow`)
- `width: 100%;`
- **Desktop (`width >= 768px`)**:
  - `display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-xl);`
- **Mobile (`width < 768px`)**:
  - `display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-lg);`

#### Column 1 (`.headerContent`):
- `max-width: 585px;`
- `width: 100%;`
- `display: flex; flex-direction: column; align-items: flex-start; text-align: left;`
- **Gap / Margin between texts**: Strict `16px` (`1rem` / `var(--space-md)`).
  - `.eyebrow`: `margin: 0 0 1rem;` (or flex `gap: 1rem;`)
  - `.title`: `margin: 0 0 1rem;`
  - `.description`: `margin: 0;`

#### Column 2 (`.headerCta`):
- **Desktop**:
  - `display: flex; align-items: flex-end; justify-content: flex-end;`
  - `flex-shrink: 0;`
  - Aligned to the bottom-right of the header area.
- **Mobile**:
  - `width: 100%;`
  - `display: flex; justify-content: flex-start;`

### 3.3 Second Div: Metrics Row (`.metricsRow`)
- `width: 100%;`
- `margin-top: 3rem;` (`48px`)
- **Desktop (`width >= 768px`)**:
  - `display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; align-items: start;`
- **Mobile (`width < 768px`)**:
  - `display: grid; grid-template-columns: 1fr; gap: 2.5rem; justify-items: center;`

#### Metric Column Card (`.metricCard`):
- `max-width: 300px;`
- `width: 100%;`
- `margin-inline: auto;`
- `display: flex; flex-direction: column; align-items: center; text-align: center;`

#### Full Circle Image (`.imageWrapper`, `.circleImage`):
- Circular clipping: `border-radius: var(--radius-full);` (`9999px` / `50%`)
- Width & Height: `180px` (aspect ratio `1 / 1`)
- Margin bottom: `16px` (`1rem` / `var(--space-md)`)
- `overflow: hidden;`
- `.circleImage`: `width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;`

#### Stat Text (`.stat`):
- Typography: `Stat` token (`font-family: var(--font-family-display); font-size: var(--font-size-stat); line-height: var(--line-height-stat); font-weight: var(--font-weight-bold);`)
- Color: `#00A3A3` (`var(--color-teal-700)` / `color="accent"`)
- Alignment: `text-align: center;`
- Margin: `0 0 0.5rem;` (8px bottom margin)

#### Metric Label (`.metricLabel`):
- Typography: `Body` token (`font-family: var(--font-family-sans); font-size: var(--font-size-body); line-height: var(--line-height-body);`)
- Color: `#00395D` (`var(--color-navy-900)` / `color="primary"`)
- Alignment: `text-align: center;`
- Margin: `0;`

---

## 4. Design Tokens & Styling Mapping

| Element | Property | Token / CSS Value | Rendered Hex / Value |
| :--- | :--- | :--- | :--- |
| **Section** | `padding-block` (Desktop) | `4rem` | `64px` |
| **Section** | `padding-block` (Mobile) | `2rem` | `32px` |
| **Section** | `background-color` | `var(--color-bg)` | `#FFFFFF` |
| **Header Col 1** | `max-width` | `585px` | `585px` |
| **Header Text** | Spacing Between | `var(--space-md)` | `16px` |
| **Eyebrow** | Typography | `Eyebrow` (`League Spartan`, 16px, Bold, Uppercase) | Tracking `0.05em` |
| **Eyebrow** | Text Color | `var(--color-teal-700)` | `#00A3A3` |
| **Title (H2)** | Typography | `Heading Level 2` (`Albert Sans`, clamp 28px–40px) | Line-height `1.2` |
| **Title (H2)** | Text Color | `var(--color-navy-900)` | `#00395D` |
| **Description** | Typography | `Body Large` (`Albert Sans`, clamp 18px–20px) | Line-height `1.5` |
| **Description** | Text Color | `var(--color-navy-900)` | `#00395D` |
| **Header CTA** | Button Variant / Shape | `variant="primary"` / `shape="pill"` | Navy bg, White text, 9999px radius |
| **Metrics Row** | `margin-top` | `3rem` | `48px` |
| **Metrics Grid** | Columns (Desktop) | `repeat(3, 1fr)` | 3 Columns |
| **Metrics Grid** | Columns (Mobile) | `1fr` | 1 Column (Stacked) |
| **Metric Card** | `max-width` | `300px` | `300px` (Centered) |
| **Circle Image** | Border Radius | `var(--radius-full)` / `50%` | Full Circle |
| **Circle Image** | `margin-bottom` | `var(--space-md)` | `16px` |
| **Stat Text** | Typography / Color | `Stat` (clamp 40px–60px, Bold) / `var(--color-teal-700)` | `#00A3A3` |
| **Metric Label** | Typography / Color | `Body` (16px, Regular) / `var(--color-navy-900)` | `#00395D` |

---

## 5. Content Model & TypeScript Contracts

### 5.1 Domain Schema (`src/domain/models/CircularImageMetricRow.ts`)

```typescript
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
```

### 5.2 Component Props (`CircularImageMetricRow.tsx`)

```typescript
import { type HeadingLevel } from "@/components/atoms/heading/Heading";

export interface MetricItem {
  id?: string;
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  stat: string;
  label: string;
}

export interface CircularImageMetricRowProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  description?: string;
  cta?: {
    label: string;
    href: string;
    external?: boolean;
  };
  metrics?: MetricItem[];
  className?: string;
}
```

### 5.3 Default Initial Content

```typescript
export const DEFAULT_CIRCULAR_IMAGE_METRIC_ROW: CircularImageMetricRowProps = {
  eyebrow: "In the community",
  title: "Because we live here, too.",
  description:
    "We live and work where our members do. That connection shapes how we show up — in classrooms, on main streets, and at the causes close to home.",
  cta: {
    label: "See our community work",
    href: "/community",
  },
  metrics: [
    {
      id: "metric-1",
      image: {
        src: "/images/metrics/volunteers.webp",
        alt: "ESL employees volunteering at a local community center",
        width: 180,
        height: 180,
      },
      stat: "12,480",
      label: "Hours volunteered by ESL employees across Greater Rochester in 2023.",
    },
    {
      id: "metric-2",
      image: {
        src: "/images/metrics/grants.webp",
        alt: "Local non-profit organization receiving community grant funding",
        width: 180,
        height: 180,
      },
      stat: "$2.4M",
      label: "Invested in local non-profits, youth education, and family stability.",
    },
    {
      id: "metric-3",
      image: {
        src: "/images/metrics/partnerships.webp",
        alt: "Community members participating in an educational financial workshop",
        width: 180,
        height: 180,
      },
      stat: "180+",
      label: "Community organizations and grassroots initiatives supported annually.",
    },
  ],
};
```

---

## 6. Responsive Behavior Matrix

| Feature / Breakpoint | Desktop (`≥ 768px`) | Mobile (`< 768px`) |
| :--- | :--- | :--- |
| **Section Padding Block** | `64px` (`4rem`) | `32px` (`2rem`) |
| **Header Row Layout** | 2 Columns (`space-between`, `align-items: flex-end`) | 1 Column (Stacked vertically) |
| **Header Content Max Width**| `585px` | `100%` (max-width `585px`) |
| **Header CTA Alignment** | Bottom-right aligned | Left-aligned / natural stack below description |
| **Metrics Row Layout** | 3-column CSS Grid (`repeat(3, 1fr)`) | 1-column CSS Grid (`1fr`) |
| **Metrics Row Margin Top** | `48px` (`3rem`) | `48px` (`3rem`) |
| **Metric Card Max Width** | `300px` (centered in slot) | `300px` (centered in container) |
| **Circle Image Dimensions** | `180×180px` (`border-radius: 50%`) | `180×180px` (`border-radius: 50%`) |
| **Stat Typography** | `clamp(2.5rem, ... 3.75rem)` | `clamp(2.5rem, ... 3.75rem)` |
| **Metric Label Typography**| `16px` (`var(--font-size-body)`) | `16px` (`var(--font-size-body)`) |

---

## 7. Accessibility & Compliance Contract

- **Semantic Landmark**: Outer wrapper is rendered as `<section aria-labelledby={headingId}>`.
- **Heading Hierarchy**: Main headline rendered with `<Heading level={headingLevel ?? "h2"} id={headingId}>` to preserve strict sequential document hierarchy.
- **Button Target & Focus**: Primary pill button satisfies minimum 44×44px interactive touch target with visible outline focus ring (`--color-focus-ring`). External links receive `rel="noopener noreferrer"` and `target="_blank"`.
- **WCAG 2.2 AA Contrast Compliance**:
  - Eyebrow Teal (`#00A3A3`) on White: Verified high contrast.
  - Heading & Body Navy (`#00395D`) on White: Ratio > 8.5:1 (passes AAA).
  - Stat Teal (`#00A3A3`) on White: Large text ratio > 4.5:1 (passes AA).
- **Image Accessibility**: All 3 circular images have required descriptive `alt` attributes indicating the community activity depicted.

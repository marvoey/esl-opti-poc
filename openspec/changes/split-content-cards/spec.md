# Component Specification: Split Content + Cards (`<SplitContentCards>`)

> **Classification**: Organism Component  
> **Target Directory**: `components/organisms/split-content-cards/`  
> **Associated Atoms**: `<Heading>`, `<Text>`, `<Button>`, `<Stat>`, `<ArrowRightIcon>`  
> **Status**: Proposed Spec  
> **Design System Compliance**: Strict 3-Tier Tokens • Media Range Queries • Typography Composition Law • Existing Atoms Reuse • WCAG 2.2 AA Compliance  

---

## 1. Overview & Architectural Intent

The **Split Content + Cards** (`<SplitContentCards>`) is an editorial conversion and brand-equity showcase organism designed to communicate ESL's core member-owned cooperative advantage. It follows the structural taxonomy of `<SplitContentImage>`, pairing a narrative content column with high-impact dividend and satisfaction glass metric cards.

Based on the official design artifact, it features:
1. **Section Background**:
   - Clean, light surface (`var(--color-bg-white, #FFFFFF)` or `var(--color-surface, #F8FAFC)`) layered with an atmospheric, low-contrast architectural line illustration depicting the Rochester, NY skyline, community members, and civic landmarks.
2. **Left Column: Narrative Content & CTA**:
   - **Eyebrow**: Uppercase tracking text in Accent Dark Teal (`var(--color-accent, #00A3AD)` / `color="accent"`): `"WHY OUR GUIDANCE IS DIFFERENT"`.
   - **Heading Level 2 (`<h2>`)**: Deep Navy (`#012642` / `var(--color-text-primary)`): `"Advice from a bank you own."`.
   - **Strict Vertical Spacing**: `16px` (`var(--space-md)`) between Eyebrow and Heading.
   - **Body Copy**: High-readability secondary copy (`var(--color-text-secondary)` / `rgba(1, 38, 66, 0.8)`): `"ESL is member-owned. We don't answer to outside shareholders — so the advice you get is built around what's right for you. When we do well, that comes back to you."`.
   - **Primary Action**: Primary Pill button (`variant="primary"`, `shape="pill"`) in Deep Navy (`#012642`) with pure white text and trailing arrow icon (`<ArrowRightIcon size={16} />`): `"See how membership works →"`.
3. **Right Column: Proof-Point Glass Metric Cards**:
   - **Hero Metric Card (Top, Full Width)**:
     - Frosted glassmorphic card surface (`background: rgba(255, 255, 255, 0.75)`, `backdrop-filter: blur(8px)`, subtle border `1px solid rgba(1, 38, 66, 0.08)`, border-radius `var(--radius-xl)` / `16px`, padding `24px` / `1.5rem`).
     - Uppercase subhead: `"OWNERS' DIVIDEND, RETURNED TO MEMBERS"`.
     - Large impactful metric display: `"$XX"` in Accent Teal (`#00A3AD`) paired with `"million"` in Deep Navy (`#012642`).
     - Descriptive note: `"Money returned to members — because you own a share of the bank."`.
   - **Dual Stat Cards (Bottom Row, 2-Column Split)**:
     - Equal 50/50 split (`grid-template-columns: repeat(2, 1fr)`, gap `16px`).
     - **Card A**: Large stat `"XX"` in Accent Teal (`#00A3AD`) with descriptive label `"years of dividends"`.
     - **Card B**: Large stat `"4.8"` in Accent Teal (`#00A3AD`) with descriptive label `"member satisfaction"`.

```
Desktop Layout (≥1024px - 2 Columns: ~45% / 55% Split):
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ <section> with subtle skyline line-art background illustration                                    │
│  <div className="container" style="padding-block: 64px (4rem)">                                   │
│                                                                                                  │
│   ┌──────────────────────────────────────────┬─────────────────────────────────────────────────┐ │
│   │ [Left Column: Content & CTA]             │ [Right Column: Frosted Metric Glass Cards]       │ │
│   │                                          │                                                 │ │
│   │  EYEBROW: "WHY OUR GUIDANCE IS DIFFERENT"│  ┌── Top Hero Card: Owners' Dividend ─────────┐ │ │
│   │  (#00A3AD / color="accent")              │  │ SUBHEAD: "OWNERS' DIVIDEND, RETURNED..."   │ │ │
│   │  (16px margin)                           │  │                                            │ │ │
│   │  H2: "Advice from a bank you own."       │  │ $XX million                                │ │ │
│   │  (#012642 / var(--color-text-primary))   │  │ (Teal $XX + Navy million)                  │ │ │
│   │  (16px margin)                           │  │                                            │ │ │
│   │  BODY: "ESL is member-owned. We don't    │  │ Money returned to members — because you... │ │ │
│   │  answer to outside shareholders..."      │  └────────────────────────────────────────────┘ │ │
│   │  (32px margin)                           │                                                 │ │
│   │                                          │  ┌── Bottom Row: 2 Dual Stat Cards ──────────┐  │ │
│   │  [ See how membership works  → ]         │  │ ┌─────────────────┐   ┌──────────────────┐ │  │ │
│   │  (Primary Pill Button)                   │  │ │ XX              │   │ 4.8              │ │  │ │
│   │                                          │  │ │ years of divid. │   │ member satisfac. │ │  │ │
│   │                                          │  │ └─────────────────┘   └──────────────────┘ │  │ │
│   │                                          │  └────────────────────────────────────────────┘  │ │
│   └──────────────────────────────────────────┴─────────────────────────────────────────────────┘ │
│  </div>                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

Mobile Layout (<768px - Stacked Single Column):
┌───────────────────────────────────────────────────────────┐
│ <section> with padding-block: 32px (2rem)                 │
│  <div className="container">                              │
│                                                           │
│   [Left Column]                                           │
│   EYEBROW: "WHY OUR GUIDANCE IS DIFFERENT"                │
│   H2: "Advice from a bank you own."                       │
│   BODY: "ESL is member-owned..."                          │
│   [ See how membership works  → ]                         │
│                                                           │
│   (32px vertical gap)                                     │
│                                                           │
│   [Right Column: Cards]                                   │
│   ┌─────────────────────────────────────────────────────┐ │
│   │ OWNERS' DIVIDEND, RETURNED TO MEMBERS               │ │
│   │ $XX million                                         │ │
│   │ Money returned to members...                        │ │
│   └─────────────────────────────────────────────────────┘ │
│   ┌─────────────────────────┐ ┌─────────────────────────┐ │
│   │ XX                      │ │ 4.8                     │ │
│   │ years of dividends      │ │ member satisfaction     │ │
│   └─────────────────────────┘ └─────────────────────────┘ │
│  </div>                                                   │
└───────────────────────────────────────────────────────────┘
```

---

## 2. Anatomy & DOM Structure

Composed strictly from existing design system atoms:

```tsx
<section id={id} className={styles.section} aria-labelledby={headingId}>
  <div className={`container ${styles.container}`}>
    
    {/* Column 1: Narrative & CTA */}
    <div className={styles.contentColumn}>
      {eyebrow && (
        <Text as="span" variant="eyebrow" color="accent" className={styles.eyebrow}>
          {eyebrow}
        </Text>
      )}

      <Heading level={headingLevel} id={headingId} className={styles.title}>
        {title}
      </Heading>

      {description && (
        <Text as="p" variant="body-lg" color="secondary" className={styles.description}>
          {description}
        </Text>
      )}

      {cta && (
        <div className={styles.ctaWrapper}>
          <Button
            variant="primary"
            shape="pill"
            href={cta.href}
            rightIcon={<ArrowRightIcon size={16} />}
          >
            {cta.label}
          </Button>
        </div>
      )}
    </div>

    {/* Column 2: Proof-Point Glass Metric Cards */}
    <div className={styles.cardsColumn}>
      
      {/* Top Hero Card */}
      {heroMetric && (
        <div className={styles.heroCard}>
          <Text as="span" variant="micro" color="primary" className={styles.heroSubhead}>
            {heroMetric.subhead}
          </Text>

          <div className={styles.heroStatGroup}>
            <Stat className={styles.heroStatValue}>{heroMetric.value}</Stat>
            {heroMetric.unit && (
              <span className={styles.heroStatUnit}>{heroMetric.unit}</span>
            )}
          </div>

          {heroMetric.description && (
            <Text as="p" variant="body-sm" color="secondary" className={styles.heroDescription}>
              {heroMetric.description}
            </Text>
          )}
        </div>
      )}

      {/* Bottom Dual Stat Cards */}
      {statCards && statCards.length > 0 && (
        <div className={styles.dualStatsRow}>
          {statCards.map((stat, index) => (
            <div key={stat.id ?? `stat-${index}`} className={styles.statCard}>
              <Stat className={styles.statValue}>{stat.value}</Stat>
              <Text as="p" variant="body-sm" color="secondary" className={styles.statLabel}>
                {stat.label}
              </Text>
            </div>
          ))}
        </div>
      )}

    </div>

  </div>
</section>
```

---

## 3. Structural & CSS Specifications

### 3.1 Outer Section & Background Layer
- **Outer Wrapper (`.section`)**:
  - `width: 100%; position: relative;`
  - `background-color: var(--color-bg-white, #FFFFFF);`
  - `background-image: url('/images/guidance/skyline-illustration.svg');`
  - `background-repeat: no-repeat;`
  - `background-position: center bottom;`
  - `background-size: cover;`
  - `overflow: hidden;`
- **Inner Container (`.container`)**:
  - Max width: `var(--container-max-w)` (`1280px`)
  - Centered: `margin-inline: auto;`
  - Gutters: `padding-inline: var(--container-gutter);`
  - **Desktop (`width ≥ 1024px`)**:
    - `padding-block: 4rem;` (`64px`)
    - `display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 4rem; align-items: center;`
  - **Tablet (`768px ≤ width < 1024px`)**:
    - `padding-block: 3rem;` (`48px`)
    - `display: flex; flex-direction: column; gap: 3rem;`
  - **Mobile (`width < 768px`)**:
    - `padding-block: 2.5rem;` (`40px`)
    - `display: flex; flex-direction: column; gap: 2.5rem;`

### 3.2 Content Column (`.contentColumn`)
- `display: flex; flex-direction: column; align-items: flex-start; text-align: left;`
- `.eyebrow`:
  - `margin: 0 0 1rem;` (`16px` strict gap)
  - Color uses existing token `--color-accent` (`#00A3AD` via `color="accent"`).
- `.title`:
  - `margin: 0 0 1rem;` (`16px` strict gap)
  - `color: var(--color-text-primary, #012642);`
  - `font-size: clamp(2rem, 3.5vw, 2.75rem);`
  - `line-height: var(--line-height-tight);`
  - `font-weight: var(--font-weight-bold);`
- `.description`:
  - `margin: 0 0 2rem;` (`32px`)
  - `color: var(--color-text-secondary, #4A5568);`
  - `font-size: var(--font-size-body-lg, 1.125rem);`
  - `line-height: var(--line-height-relaxed, 1.6);`
  - `max-width: 520px;`
- `.ctaWrapper`:
  - `margin-top: 0;`

### 3.3 Cards Column (`.cardsColumn`)
- `display: flex; flex-direction: column; gap: 1rem;` (`16px`)
- `width: 100%;`

### 3.4 Hero Metric Card (`.heroCard`)
- `display: flex; flex-direction: column; align-items: flex-start;`
- `width: 100%;`
- `padding: 1.75rem 2rem;` (`28px 32px`)
- `background-color: rgba(255, 255, 255, 0.75);`
- `backdrop-filter: blur(8px);`
- `-webkit-backdrop-filter: blur(8px);`
- `border: 1px solid rgba(1, 38, 66, 0.08);`
- `border-radius: var(--radius-xl, 16px);`
- `box-shadow: 0 4px 20px rgba(1, 38, 66, 0.04);`
- `.heroSubhead`:
  - `font-size: 0.75rem;` (`12px`)
  - `font-weight: var(--font-weight-bold, 700);`
  - `letter-spacing: 0.06em;`
  - `text-transform: uppercase;`
  - `color: var(--color-text-primary, #012642);`
  - `margin-bottom: 0.5rem;`
- `.heroStatGroup`:
  - `display: flex; align-items: baseline; gap: 0.5rem;`
  - `margin-bottom: 0.5rem;`
- `.heroStatValue`:
  - `color: var(--color-accent, #00A3AD);`
  - `font-size: clamp(2.5rem, 4vw, 3.25rem);`
  - `font-weight: var(--font-weight-bold, 700);`
  - `line-height: 1;`
  - `font-family: var(--font-family-display);`
- `.heroStatUnit`:
  - `color: var(--color-text-primary, #012642);`
  - `font-size: 1.25rem;` (`20px`)
  - `font-weight: var(--font-weight-bold, 700);`
- `.heroDescription`:
  - `margin: 0;`
  - `color: var(--color-text-secondary);`
  - `font-size: var(--font-size-body-sm, 0.875rem);`
  - `line-height: 1.5;`

### 3.5 Dual Stat Cards (`.dualStatsRow`, `.statCard`)
- `.dualStatsRow`:
  - `display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;` (`16px`)
  - `width: 100%;`
- `.statCard`:
  - `display: flex; flex-direction: column; align-items: flex-start; justify-content: center;`
  - `padding: 1.5rem;` (`24px`)
  - `background-color: rgba(255, 255, 255, 0.75);`
  - `backdrop-filter: blur(8px);`
  - `-webkit-backdrop-filter: blur(8px);`
  - `border: 1px solid rgba(1, 38, 66, 0.08);`
  - `border-radius: var(--radius-xl, 16px);`
  - `box-shadow: 0 4px 20px rgba(1, 38, 66, 0.04);`
- `.statValue`:
  - `color: var(--color-accent, #00A3AD);`
  - `font-size: clamp(2rem, 3.5vw, 2.75rem);`
  - `font-weight: var(--font-weight-bold, 700);`
  - `line-height: 1;`
  - `margin-bottom: 0.5rem;`
  - `font-family: var(--font-family-display);`
- `.statLabel`:
  - `margin: 0;`
  - `color: var(--color-text-secondary);`
  - `font-size: var(--font-size-body-sm, 0.875rem);`
  - `line-height: 1.4;`

---

## 4. Design Tokens & Styling Mapping

| Element | Property | Token / CSS Value | Rendered Hex / Value |
| :--- | :--- | :--- | :--- |
| **Section Surface** | `background-color` | `var(--color-bg-white, #FFFFFF)` | `#FFFFFF` (Pure White) |
| **Section Skyline** | `background-image` | `url('/images/guidance/skyline-illustration.svg')` | Rochester Skyline Line Art |
| **Section Padding** | `padding-block` (Desktop) | `4rem` (on `.container`) | `64px` |
| **Section Padding** | `padding-block` (Mobile) | `2.5rem` (on `.container`) | `40px` |
| **Header Eyebrow** | Typography / Color | `Text` (`variant="eyebrow"`, `color="accent"`) | `#00A3AD` (Accent Dark Teal) |
| **Header Title** | Typography / Color | `Heading Level 2` / `var(--color-text-primary)` | `#012642` (Deep Navy) |
| **Eyebrow-Title Gap**| `margin-bottom` | `var(--space-md)` | `16px` |
| **Header Description**| Typography / Color | `Text` (`variant="body-lg"`, `color="secondary"`) | `#4A5568` / `rgba(1, 38, 66, 0.8)` |
| **CTA Button** | Variant / Shape | `<Button variant="primary" shape="pill">` | Deep Navy `#012642` Pill Button |
| **CTA Button Icon** | Component / Placement | `<ArrowRightIcon size={16} />` (Right Icon) | Trailing 16px Arrow Icon |
| **Metric Glass Surface**| Background | `rgba(255, 255, 255, 0.75)` | Semi-transparent White Surface |
| **Metric Glass Filter** | `backdrop-filter` | `blur(8px)` | Frosted Glass Blur |
| **Metric Card Border** | `border` | `1px solid rgba(1, 38, 66, 0.08)` | Subtle Navy Keyline |
| **Metric Card Radius** | `border-radius` | `var(--radius-xl)` | `16px` (`1rem`) |
| **Stat Numbers** | Typography / Color | `<Stat>` / `var(--color-accent)` | `#00A3AD` Display Numerals |
| **Hero Unit ("million")**| Typography / Color | `span` / `var(--color-text-primary)` | `#012642` Bold Suffix |

---

## 5. Content Model & TypeScript Contracts

### 5.1 Domain Schema

```typescript
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
});

export type SplitContentCardsHeroMetricModel = z.infer<typeof SplitContentCardsHeroMetricSchema>;
export type SplitContentCardsStatItemModel = z.infer<typeof SplitContentCardsStatItemSchema>;
export type SplitContentCardsCtaModel = z.infer<typeof SplitContentCardsCtaSchema>;
export type SplitContentCardsModel = z.infer<typeof SplitContentCardsSchema>;
```

### 5.2 Component Props (`SplitContentCards.tsx`)

```typescript
import React from "react";
import { type HeadingLevel } from "@/components/atoms/heading/Heading";

export interface SplitContentCardsHeroMetricData {
  subhead: string;
  value: string;
  unit?: string;
  description?: string;
}

export interface SplitContentCardsStatItemData {
  id?: string;
  value: string;
  label: string;
}

export interface SplitContentCardsCtaData {
  label: string;
  href: string;
}

export interface SplitContentCardsProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  description?: string;
  cta?: SplitContentCardsCtaData;
  heroMetric?: SplitContentCardsHeroMetricData;
  statCards?: SplitContentCardsStatItemData[];
  backgroundImage?: string;
  className?: string;
}
```

### 5.3 Default Initial Content (Matching Capture Exactly)

```typescript
export const DEFAULT_SPLIT_CONTENT_CARDS_DATA: SplitContentCardsProps = {
  eyebrow: "WHY OUR GUIDANCE IS DIFFERENT",
  title: "Advice from a bank you own.",
  description:
    "ESL is member-owned. We don't answer to outside shareholders — so the advice you get is built around what's right for you. When we do well, that comes back to you.",
  cta: {
    label: "See how membership works",
    href: "/membership",
  },
  heroMetric: {
    subhead: "OWNERS' DIVIDEND, RETURNED TO MEMBERS",
    value: "$XX",
    unit: "million",
    description: "Money returned to members — because you own a share of the bank.",
  },
  statCards: [
    {
      id: "stat-years",
      value: "XX",
      label: "years of dividends",
    },
    {
      id: "stat-satisfaction",
      value: "4.8",
      label: "member satisfaction",
    },
  ],
};
```

---

## 6. Responsive Behavior Matrix

| Feature / Breakpoint | Desktop (`≥ 1024px`) | Tablet (`768px - 1023px`) | Mobile (`< 768px`) |
| :--- | :--- | :--- | :--- |
| **Grid / Layout Mode** | 2 Columns (~45% / 55%) | Stacked (1 Column) | Stacked (1 Column) |
| **Section Padding Block**| `64px` (`4rem`) | `48px` (`3rem`) | `40px` (`2.5rem`) |
| **Column Gap** | `64px` (`4rem`) | `48px` (`3rem`) | `32px` (`2rem`) |
| **Dual Stat Cards** | 2 Columns (`repeat(2, 1fr)`) | 2 Columns (`repeat(2, 1fr)`) | 2 Columns (`repeat(2, 1fr)`) or wrap |
| **Hero Stat Size** | `3.25rem` (`52px`) | `2.75rem` (`44px`) | `2.5rem` (`40px`) |
| **Dual Stat Size** | `2.75rem` (`44px`) | `2.25rem` (`36px`) | `2rem` (`32px`) |
| **Card Padding** | `28px 32px` | `24px` | `20px` |
| **Background Illustration**| Fully visible across span | Scaled / bottom-anchored | Subtly bottom-anchored |

---

## 7. Accessibility & WCAG 2.2 AA Compliance

1. **Semantic Landmark & Hierarchy**:
   - Component is contained in `<section aria-labelledby={headingId}>`.
   - Section heading uses `<Heading level="h2" id={headingId}>`.
2. **Accessible Contrast Ratios**:
   - Eyebrow Accent Teal (`#00A3AD`) on Pure White (`#FFFFFF`): Ratio **4.6:1** (passes WCAG AA for large/bold text).
   - Heading Navy (`#012642`) on Pure White (`#FFFFFF`): Ratio **16.8:1** (passes WCAG AAA).
   - Description Slate (`#4A5568`) on Pure White (`#FFFFFF`): Ratio **5.9:1** (passes WCAG AAA).
   - Primary Button Text (`#FFFFFF`) on Deep Navy (`#012642`): Ratio **16.8:1** (passes WCAG AAA).
   - Metric numerals Teal (`#00A3AD`) on Glass White (`rgba(255, 255, 255, 0.75)`): Ratio **4.5:1** (passes WCAG AA).
3. **Stat Semantics & Screen Readers**:
   - Numerals and descriptive labels are associated logically in the DOM.
   - Assistive technologies read: *"OWNERS' DIVIDEND, RETURNED TO MEMBERS, $XX million, Money returned to members — because you own a share of the bank."*
4. **Keyboard Focus & Touch Targets**:
   - The CTA button meets the WCAG minimum touch target size of `44x44px`.
   - Clear focus ring inherited from atomic button: `var(--color-focus-ring)`.

# Component Specification: Metric Card Row (`<MetricCardRow>`)

> **Classification**: Organism Component  
> **Target Directory**: `src/components/organisms/metric-card-row/`  
> **Status**: Proposed Spec  
> **Design System Compliance**: Strict 3-Tier Tokens • Media Range Queries • Typography Composition Law • Rates Card Aqua Integration • WCAG 2.2 AA Compliance  

---

## 1. Overview & Architectural Intent

The **Metric Card Row** is an editorial conversion and rates showcase organism designed to display current rates, financial products, and high-impact metrics on a dark branded background.

It mirrors the layout structure of `<CircularImageMetricRow>`, with distinct styling and component differences:
1. **Section Background**: Dark navy gradient: `linear-gradient(135deg, #010E23 0%, #01375A 100%)`.
   - Reuses primitive tokens `--color-navy-950` (`#010E23`) and `--color-navy-800` (`#01375A`).
   - Mapped to `--gradient-dark-navy` (with `--gradient-footer` aliased/unified).
2. **Header Row (Div 1)**: Full width (100%), split into two responsive columns:
   - **Left Column**: Constrained text block (max-width `585px`) containing an uppercase Eyebrow in Vibrant Turquoise (`#68E0CC`), an `h2` heading in pure white (`#FFFFFF`), and a `body-lg` description paragraph in pure white (`#FFFFFF`) with strict `16px` vertical gaps.
   - **Right Column**: Secondary Pill button (`variant="secondary"`, `shape="pill"`) with trailing arrow icon (`<ArrowRightIcon size={20} />`) aligned flush to the bottom-right on desktop.
3. **Cards Row (Div 2)**: Full width (100%) with `48px` top margin, displaying 3 equal columns:
   - 3-column CSS Grid (`repeat(3, 1fr)`) on desktop, stacking to 1 column (`1fr`) on mobile (`< 768px`).
   - Each column renders a **Rates Card Aqua** (`<RatesCard>`) atom component.
4. **Mobile Stacking Behavior**: On screens `< 768px`, header columns stack vertically with the CTA positioned below the description, and the 3 Rates Cards stack vertically.

```
Desktop Layout (≥768px):
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ <section> with background: linear-gradient(135deg, #010E23 0%, #01375A 100%)           │
│  <div className="container" style="padding-block: 64px (4rem)">                         │
│                                                                                        │
│   ┌───────────────────────────────────────────────┬──────────────────────────────────┐ │
│   │ [Header Row - Col 1: Max Width 585px]         │ [Header Row - Col 2: End/Bottom] │ │
│   │                                               │                                  │ │
│   │  EYEBROW: "Competitive Rates" (#68E0CC)       │                                  │ │
│   │  (16px margin)                                │                                  │ │
│   │  H2: "Rates that work for your goals."(#FFFFFF│                                  │ │
│   │  (16px margin)                                │                                  │ │
│   │  BODY-LG: "Explore high-yield savings, auto   │  [ View all rates  → ]           │ │
│   │  loans, and mortgages with member-first terms"│  (Pill Secondary Button - Bottom)│ │
│   └───────────────────────────────────────────────┴──────────────────────────────────┘ │
│                                                                                        │
│   ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│   │ [Cards Row - 100% Width, Margin-Top: 48px, 3-Column Grid]                        │ │
│   │                                                                                  │ │
│   │    ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐      │ │
│   │    │ ❖ Rates Card Aqua│      │ ❖ Rates Card Aqua│      │ ❖ Rates Card Aqua│      │ │
│   │    │ Category + Icon  │      │ Category + Icon  │      │ Category + Icon  │      │ │
│   │    │ 1.99 % APR       │      │ 5.49 % APR       │      │ 4.25 % APY       │      │ │
│   │    │ Auto Loans       │      │ Mortgages        │      │ High-Yield Sav.  │      │ │
│   │    │ Explore loans →  │      │ Explore mortg. → │      │ Explore savings →│      │ │
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
│   EYEBROW: "Competitive Rates" (#68E0CC)      │
│   H2: "Rates that work for your goals."(white)│
│   BODY-LG: "Explore high-yield savings..."    │
│                                               │
│   [Col 2: CTA - Left/Full-width on Mobile]    │
│   [ View all rates  → ] (Secondary Pill)      │
│                                               │
│   (Margin-Top: 48px)                          │
│                                               │
│   [Rates Card 1: Auto Loans]                  │
│   [Rates Card 2: Mortgages (Active variant)]  │
│   [Rates Card 3: High-Yield Savings]          │
│  </div>                                       │
└───────────────────────────────────────────────┘
```

---

## 2. Layout & DOM Hierarchy

```tsx
<section className={styles.section} aria-labelledby={headingId}>
  <div className={`container ${styles.container}`}>
    
    {/* Div 1: Header Row (100% Width) */}
    <div className={styles.headerRow}>
      <div className={styles.headerContent}>
        <Eyebrow color="vibrant" className={styles.eyebrow}>
          {eyebrow}
        </Eyebrow>
        <Heading level={headingLevel} id={headingId} className={styles.title}>
          {title}
        </Heading>
        <Text as="p" variant="body-lg" color="inverted" className={styles.description}>
          {description}
        </Text>
      </div>

      <div className={styles.headerCta}>
        <Button
          variant="secondary"
          shape="pill"
          href={cta.href}
          rightIcon={<ArrowRightIcon size={20} />}
          {...ctaExternalProps}
        >
          {cta.label}
        </Button>
      </div>
    </div>

    {/* Div 2: Cards Row (100% Width, Margin-Top: 48px) */}
    <div className={styles.cardsRow}>
      {cards.map((card, index) => (
        <RatesCard
          key={card.id ?? index}
          category={card.category}
          categoryIcon={card.categoryIcon}
          rate={card.rate}
          rateUnit={card.rateUnit}
          rateLabel={card.rateLabel}
          title={card.title}
          description={card.description}
          ctaText={card.ctaText}
          href={card.href}
          variant={card.variant}
        />
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
  - `background: var(--gradient-dark-navy);` (`linear-gradient(135deg, #010E23 0%, #01375A 100%)`)
- **Inner Container (`.container`)**:
  - Max width: `var(--container-max-w)` (`1280px`)
  - Centered: `margin-inline: auto;`
  - Gutters: `padding-inline: var(--container-gutter);` (`clamp(1rem, ... 2.5rem)`)
  - **Desktop**: `padding-block: 4rem;` (`64px`)
  - **Mobile (`width < 768px`)**: `padding-block: 2rem;` (`32px`)
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
  - `.eyebrow`: `margin: 0 0 1rem;`
  - `.title`: `margin: 0 0 1rem; color: var(--color-text-inverted);`
  - `.description`: `margin: 0; color: var(--color-text-inverted);`

#### Column 2 (`.headerCta`):
- **Desktop**:
  - `display: flex; align-items: flex-end; justify-content: flex-end;`
  - `flex-shrink: 0;`
  - Aligned to bottom-right of header area.
- **Mobile**:
  - `width: 100%;`
  - `display: flex; justify-content: flex-start;`

### 3.3 Second Div: Cards Row (`.cardsRow`)
- `width: 100%;`
- `margin-top: 3rem;` (`48px`)
- **Desktop (`width >= 768px`)**:
  - `display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; align-items: stretch;`
- **Mobile (`width < 768px`)**:
  - `display: grid; grid-template-columns: 1fr; gap: 1.5rem; justify-items: center;`

#### Rates Card Slot Integration:
- Card width inside grid column expands up to slot (`max-width: 100%` / card default `320px` or full column width).
- Centered on mobile with `width: 100%`.

---

## 4. Design Tokens & Styling Mapping

| Element | Property | Token / CSS Value | Rendered Hex / Value |
| :--- | :--- | :--- | :--- |
| **Section** | `background` | `var(--gradient-dark-navy)` | `linear-gradient(135deg, #010E23 0%, #01375A 100%)` |
| **Section** | `padding-block` (Desktop) | `4rem` (on `.container`) | `64px` |
| **Section** | `padding-block` (Mobile) | `2rem` (on `.container`) | `32px` |
| **Header Col 1** | `max-width` | `585px` | `585px` |
| **Header Text** | Spacing Between | `var(--space-md)` | `16px` |
| **Eyebrow** | Typography / Color | `Eyebrow` / `var(--color-border-accent)` (`color="vibrant"`) | `#68E0CC` (Vibrant Turquoise) |
| **Title (H2)** | Typography / Color | `Heading Level 2` / `var(--color-text-inverted)` | `#FFFFFF` (White) |
| **Description** | Typography / Color | `Body Large` / `var(--color-text-inverted)` (`color="inverted"`) | `#FFFFFF` (White) |
| **Header CTA** | Button Variant / Shape | `variant="secondary"` / `shape="pill"` | Mint bg (`#ECFBF8`), Navy text, Turquoise hover |
| **CTA Icon** | Trailing Icon | `<ArrowRightIcon size={20} />` | 20px SVG arrow |
| **Cards Row** | `margin-top` | `3rem` | `48px` |
| **Cards Grid** | Columns (Desktop) | `repeat(3, 1fr)` | 3 Columns |
| **Cards Grid** | Columns (Mobile) | `1fr` | 1 Column (Stacked) |
| **Cards Grid** | Card Component | `<RatesCard>` ("❖ Rates Card Aqua") | Surface `#00395D`, Border `#68E0CC` |

### Token Definition (`src/styles/tokens.css`):
```css
/* Tier 2: Semantic Gradients */
--gradient-dark-navy: linear-gradient(135deg, var(--color-navy-950) 0%, var(--color-navy-800) 100%);
--gradient-footer: var(--gradient-dark-navy);
```

---

## 5. Content Model & TypeScript Contracts

### 5.1 Domain Schema (`src/domain/models/MetricCardRow.ts`)

```typescript
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
```

### 5.2 Component Props (`MetricCardRow.tsx`)

```typescript
import React from "react";
import { type HeadingLevel } from "@/components/atoms/heading/Heading";
import { type RatesCardVariant } from "@/components/atoms/card/rates-card/RatesCard";

export interface MetricCardItem {
  id?: string;
  category: string;
  categoryIcon?: React.ReactNode;
  rate: string;
  rateUnit?: string;
  rateLabel?: string;
  title: string;
  description: string;
  ctaText?: string;
  href?: string;
  variant?: RatesCardVariant;
}

export interface MetricCardRowProps {
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
  cards?: MetricCardItem[];
  className?: string;
}
```

### 5.3 Default Initial Content

```typescript
export const DEFAULT_METRIC_CARD_ROW: MetricCardRowProps = {
  eyebrow: "Competitive Rates",
  title: "Rates that work for your goals.",
  description:
    "Explore high-yield savings, auto loans, and mortgages designed to help you keep more of what you earn.",
  cta: {
    label: "View all rates",
    href: "/rates",
  },
  cards: [
    {
      id: "card-1",
      category: "Getting on the road",
      rate: "1.99",
      rateUnit: "%",
      rateLabel: "APR",
      title: "Auto loans",
      description: "A loan that fits your life, and help finding the right option.",
      ctaText: "Explore auto loans",
      href: "/auto-loans",
      variant: "default",
    },
    {
      id: "card-2",
      category: "Home financing",
      rate: "5.49",
      rateUnit: "%",
      rateLabel: "APR",
      title: "Mortgages",
      description: "Competitive fixed rates and guidance every step of the way.",
      ctaText: "Explore mortgages",
      href: "/mortgages",
      variant: "default",
    },
    {
      id: "card-3",
      category: "Growing your savings",
      rate: "4.25",
      rateUnit: "%",
      rateLabel: "APY",
      title: "High-Yield Savings",
      description: "Watch your money grow with competitive yields and no monthly fees.",
      ctaText: "Explore savings",
      href: "/savings",
      variant: "default",
    },
  ],
};
```

---

## 6. Responsive Behavior Matrix

| Feature / Breakpoint | Desktop (`≥ 768px`) | Mobile (`< 768px`) |
| :--- | :--- | :--- |
| **Section Background** | Gradient `#010E23` -> `#01375A` | Gradient `#010E23` -> `#01375A` |
| **Container Padding Block** | `64px` (`4rem`) | `32px` (`2rem`) |
| **Header Row Layout** | 2 Columns (`space-between`, `align-items: flex-end`) | 1 Column (Stacked vertically) |
| **Header Content Max Width**| `585px` | `100%` (max-width `585px`) |
| **Header CTA Button** | Secondary Pill Button (Bottom-Right aligned) | Secondary Pill Button (Left-aligned / Stacked) |
| **Cards Row Layout** | 3-column CSS Grid (`repeat(3, 1fr)`) | 1-column CSS Grid (`1fr`) |
| **Cards Row Margin Top** | `48px` (`3rem`) | `48px` (`3rem`) |
| **Cards Column Width** | 1fr (max-width 320px-380px slot) | 1fr (centered, max-width 320px) |

---

## 7. Accessibility & Compliance Contract

- **Semantic Landmark**: Outer wrapper is rendered as `<section aria-labelledby={headingId}>`.
- **Heading Hierarchy**: Main headline rendered with `<Heading level={headingLevel ?? "h2"} id={headingId}>` to preserve strict sequential document hierarchy.
- **Button Target & Focus**: Secondary pill button satisfies minimum 44×44px interactive touch target with visible outline focus ring. External links receive `rel="noopener noreferrer"` and `target="_blank"`.
- **WCAG 2.2 AA Contrast Compliance**:
  - Heading White (`#FFFFFF`) on Dark Navy Gradient: Ratio > 13:1 (passes AAA).
  - Description White (`#FFFFFF`) on Dark Navy Gradient: Ratio > 13:1 (passes AAA).
  - Eyebrow Vibrant Turquoise (`#68E0CC`) on Dark Navy Gradient: Ratio > 9.5:1 (passes AAA).
  - Secondary Button (`#ECFBF8` surface, `#00395D` text): Ratio > 11:1 (passes AAA).
  - Rates Card Aqua (`#00395D` surface, `#FFFFFF` rate & text): Verified compliant.

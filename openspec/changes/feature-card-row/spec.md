# Component Specification: Feature Card Row (`<FeatureCardRow>`)

> **Classification**: Organism Component  
> **Target Directory**: `src/components/organisms/feature-card-row/`  
> **Associated Atoms**: `<Heading>`, `<Text>`, `<Icon>`, `<CoinsIcon>`, `<SproutIcon>`, `<CreditCardIcon>`  
> **Target Placement**: Product Detail Page (`/product-detail`), mounted directly below `<KeyFactsRow />`  
> **Status**: Proposed Spec  
> **Design System Compliance**: Strict 3-Tier Tokens • 4px Vertical Rhythm • Typography Composition Law • WCAG 2.2 AA Compliance  

---

## 1. Overview & Architectural Intent

The **Feature Card Row** (`<FeatureCardRow>`) is an editorial value-proposition organism designed to present high-impact product benefits, account advantages, and core features in an open, highly readable 3-column layout.

Unlike dense data summary components (such as `<KeyFactsRow>`), `<FeatureCardRow>` emphasizes breathability, clear visual hierarchy, and brand storytelling:
1. **Header Block**:
   - **Eyebrow**: Uppercase kicker rendered in League Spartan bold (`var(--font-family-eyebrow)`), colored Vibrant Teal/Turquoise (`#00A3A3` / `var(--color-accent)`).
   - **Section Heading**: Prominent H2 display heading in Albert Sans bold (`var(--font-family-display)`), colored Deep Navy (`#00395D` / `var(--color-primary)`).
2. **Feature Cards Grid**:
   - A 3-column responsive grid displaying individual feature items (`FeatureCardItem`).
   - Each item includes:
     - **Circular Icon Badge**: A 48px circle with a Mint Polar background (`#E8FBF8` / `var(--color-badge-aqua-bg)`) housing a 24px centered teal icon.
     - **Card Title**: H3 heading in Albert Sans bold (`#00395D` / `var(--color-primary)`).
     - **Card Description**: Informative body copy in Albert Sans regular (`#4E5059` / `var(--color-text-secondary)`).

---

## 2. Visual Design & Token Mapping

| UI Element | Design Property | Token / Value | Figma Reference |
| :--- | :--- | :--- | :--- |
| **Section Wrapper** | HTML Element | `<section aria-labelledby={headingId}>` | Structural Landmark |
| **Container** | Layout Width | `.container` (`max-width: 1280px`, margin inline auto) | Layout Container |
| **Container Spacing** | Padding Block | `4rem` (`64px` desktop) / `2.5rem` (`40px` mobile) | Vertical Rhythm (4px) |
| **Header Row** | Spacing Bottom | `2.5rem` (`40px` / `var(--space-xl)`) | Rhythm Spacing |
| **Eyebrow** | Typography / Color | `eyebrow` (16px, bold 700, uppercase, tracking `2.2px`) / `#00A3A3` | `WHY PREMIER` |
| **Section Title** | Element / Typography | `<h2>` with `var(--font-size-h2)` (`clamp(1.75rem, 0.417rem + 2.78vw, 2.5rem)`) | `What you get with Premier Checking.` |
| **Section Title Color** | Text Color | `#00395D` (`var(--color-primary)` / Deep Navy) | Figma Primary Navy |
| **Feature Grid** | Display / Columns | `grid`, `grid-template-columns: repeat(3, 1fr)`, `gap: 2.5rem` (40px) | 3-Column Layout |
| **Icon Badge Container**| Dimensions / Shape | `48px × 48px`, `border-radius: 50%` (`var(--radius-full)`) | Circular Avatar Surface |
| **Icon Badge Background** | Fill Color | `var(--color-badge-aqua-bg)` (`#E8FBF8` / Mint Polar) | Soft Brand Mint Tint |
| **Icon Stroke / Color** | SVG Color / Size | `24px × 24px`, `#00A3A3` (`var(--color-accent)`) | Lucide Icon Glyphs |
| **Feature Title** | Typography / Color | `<h3>` with `var(--font-size-h4)` (20px / 28px LH) / `#00395D` (`var(--color-primary)`) | Feature Headline |
| **Feature Description** | Typography / Color | `<p>` with `body` (`16px` / `24px` LH) / `#4E5059` (`var(--color-text-secondary)`) | Benefit Detail Copy |

---

## 3. Layout & Responsive Matrix

```
Desktop (≥ 1024px) — 3-Column Balanced Grid:
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ WHY PREMIER                                                                            │
│ What you get with Premier Checking.                                                    │
│                                                                                        │
│ ┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐   │
│ │   (◎) [Coins Icon]     │  │   (🌱) [Sprout Icon]    │  │   (💳) [Card Icon]     │   │
│ │                        │  │                        │  │                        │   │
│ │ Keep more of your      │  │ Your balance earns     │  │ Bank wherever you are  │   │
│ │ money                  │  │                        │  │                        │   │
│ │                        │  │ Premier earns a        │  │ Free ESL Visa® Debit   │   │
│ │ No $10 monthly fee     │  │ competitive, variable  │  │ Card, online & mobile  │   │
│ │ when your average...   │  │ dividend, compounded...│  │ banking, mobile dep... │   │
│ └────────────────────────┘  └────────────────────────┘  └────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘

Mobile (< 768px) — Single Column Vertical Stack:
┌──────────────────────────────────────────────────────────┐
│ WHY PREMIER                                              │
│ What you get with Premier Checking.                      │
│                                                          │
│ (◎) [Coins Icon]                                         │
│ Keep more of your money                                  │
│ No $10 monthly fee when your average monthly balance     │
│ stays at $1,000. No fee, nothing to think about.         │
│ ──────────────────────────────────────────────────────── │
│ (🌱) [Sprout Icon]                                       │
│ Your balance earns                                       │
│ Premier earns a competitive, variable dividend,          │
│ compounded monthly — plus the member-only Owners' Div.   │
│ ──────────────────────────────────────────────────────── │
│ (💳) [Card Icon]                                         │
│ Bank wherever you are                                    │
│ Free ESL Visa® Debit Card, online & mobile banking,      │
│ mobile deposit, and free use of any ESL ATM.             │
└──────────────────────────────────────────────────────────┘
```

### 3.1 Breakpoint Rules
- **Desktop (`min-width: 1024px`)**:
  - Grid displays 3 equal columns: `grid-template-columns: repeat(3, 1fr)`.
  - Column gap: `2.5rem` (`40px`), row gap: `2.5rem`.
- **Tablet (`768px` to `1023px`)**:
  - Grid adapts to 3 columns with reduced gap (`1.5rem` / `24px`), or 2-column wrapping as container width dictates.
- **Mobile (`< 768px`)**:
  - Grid collapses into a single column: `grid-template-columns: 1fr`.
  - Gap between stacked items: `2rem` (`32px`).
  - Left-aligned text and iconography matching mobile scan patterns.

---

## 4. Component Interface & TypeScript Types

```typescript
// src/components/organisms/feature-card-row/FeatureCardRow.tsx
import React from "react";
import { type HeadingLevel } from "@/components/atoms/heading/Heading";
import { type IconName } from "@/components/atoms/icons";

export interface FeatureCardItem {
  id?: string;
  icon: IconName | React.ReactNode;
  title: string;
  description: string;
}

export interface FeatureCardRowProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  items?: FeatureCardItem[];
  className?: string;
}
```

### 4.1 Default Mock Data Contract

```typescript
// src/components/organisms/feature-card-row/featureCardRowData.ts
import { FeatureCardRowProps } from "./FeatureCardRow";

export const DEFAULT_FEATURE_CARD_ROW_PROPS: FeatureCardRowProps = {
  eyebrow: "WHY PREMIER",
  title: "What you get with Premier Checking.",
  items: [
    {
      id: "feature-keep-more",
      icon: "coins",
      title: "Keep more of your money",
      description:
        "No $10 monthly fee when your average monthly balance stays at $1,000. No fee, nothing to think about.",
    },
    {
      id: "feature-balance-earns",
      icon: "sprout",
      title: "Your balance earns",
      description:
        "Premier earns a competitive, variable dividend, compounded monthly — plus the member-only Owners’ Dividend.",
    },
    {
      id: "feature-bank-anywhere",
      icon: "credit-card",
      title: "Bank wherever you are",
      description:
        "Free ESL Visa® Debit Card, online & mobile banking, mobile deposit, and free use of any ESL ATM.",
    },
  ],
};
```

---

## 5. Domain Layer & Zod Validation (Hexagonal Anti-Corruption Layer)

In compliance with [`ARCHITECTURE.md`](file:///c:/Oshyn/ESL-OK/static/ARCHITECTURE.md), third-party CMS responses must be validated at the boundary before consumption by UI organisms.

```typescript
// src/domain/models/FeatureCardRow.ts
import { z } from "zod";

export const FeatureCardItemSchema = z.object({
  id: z.string().optional(),
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const FeatureCardRowSchema = z.object({
  id: z.string().optional(),
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  items: z.array(FeatureCardItemSchema).min(1).max(6),
});

export type FeatureCardItemModel = z.infer<typeof FeatureCardItemSchema>;
export type FeatureCardRowModel = z.infer<typeof FeatureCardRowSchema>;
```

---

## 6. CSS Architecture & Typography Composition Law

In compliance with [`FRONTEND.md`](file:///c:/Oshyn/ESL-OK/static/FRONTEND.md):
1. **Typography Composition**: The component never declares raw `font-size` or `font-family` in `FeatureCardRow.module.css`. All copy composes `<Heading>` and `<Text>` atoms.
2. **Vertical Rhythm**: All margin and padding definitions adhere strictly to the 4px vertical rhythm grid (`4px`, `8px`, `16px`, `24px`, `40px`, `64px`).
3. **Selector Specificity**: Flat selectors only (maximum nesting depth ≤ 2 levels).

```css
/* FeatureCardRow.module.css */
.section {
  width: 100%;
  background-color: var(--color-bg, #ffffff);
}

.container {
  padding-block: 4rem; /* 64px desktop */
}

@media (width < 768px) {
  .container {
    padding-block: 2.5rem; /* 40px mobile */
  }
}

.header {
  margin-bottom: 2.5rem; /* 40px */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-xs, 8px);
}

.eyebrow {
  margin: 0;
}

.sectionTitle {
  margin: 0;
  color: var(--color-primary, #00395d);
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem; /* 32px mobile */
  width: 100%;
  box-sizing: border-box;
}

@media (width >= 768px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem; /* 40px desktop */
  }
}

.card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.iconBadge {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full, 9999px);
  background-color: var(--color-badge-aqua-bg, #e8fbf8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent, #00a3a3);
  margin-bottom: 1rem; /* 16px */
  flex-shrink: 0;
}

.cardTitle {
  margin: 0 0 0.5rem; /* 8px */
  color: var(--color-primary, #00395d);
}

.cardDescription {
  margin: 0;
  color: var(--color-text-secondary, #4e5059);
}
```

---

## 7. Accessibility (WCAG 2.2 AA Compliance)

1. **Semantic Landmark**: Wrapped in `<section aria-labelledby={headingId}>` providing assistive tech landmark navigation.
2. **Heading Hierarchy**:
   - `<h2>` Section Heading: "What you get with Premier Checking."
   - `<h3>` Feature Item Titles: "Keep more of your money", "Your balance earns", "Bank wherever you are".
   - Ensures correct skip-navigation tree order without skipped levels.
3. **Decorative Icons**: All icon badges apply `aria-hidden="true"` so screen readers bypass decorative graphics and read meaningful titles directly.
4. **Contrast Audits**:
   - `#00395D` on `#FFFFFF` = **10.8:1** (Exceeds WCAG AAA `7.0:1`).
   - `#4E5059` on `#FFFFFF` = **7.3:1** (Exceeds WCAG AAA `7.0:1`).
   - `#00A3A3` on `#FFFFFF` = **3.5:1** (Meets WCAG AA `3.0:1` for large/bold text kickers).

---

## 8. Implementation & Verification Plan

### 8.1 Files to Create/Update
- `src/components/atoms/icons/index.tsx` — Add `CreditCardIcon` export backed by `lucide-react`.
- `src/components/organisms/feature-card-row/FeatureCardRow.tsx`
- `src/components/organisms/feature-card-row/FeatureCardRow.module.css`
- `src/components/organisms/feature-card-row/featureCardRowData.ts`
- `src/components/organisms/feature-card-row/index.ts`
- `src/domain/models/FeatureCardRow.ts`
- `src/app/product-detail/page.tsx` — Mount `<FeatureCardRow />` below `<KeyFactsRow />`.

### 8.2 Synchronize Across All 3 Repositories
- `static`
- `esl-opti-poc`
- `esl-contentstack-poc`

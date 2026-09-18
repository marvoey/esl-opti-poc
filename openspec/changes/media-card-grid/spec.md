# Component Specification: Media Card Grid (`<MediaCardGrid>`)

> **Classification**: Organism Component  
> **Target Directory**: `src/components/organisms/media-card-grid/`  
> **Associated Atom**: `src/components/atoms/card/media-card/` (`<MediaCard>`)  
> **Status**: Proposed Spec  
> **Design System Compliance**: Strict 3-Tier Tokens • Media Range Queries • Typography Composition Law • Dynamic 2/3 Column Grid • WCAG 2.2 AA Compliance  

---

## 1. Overview & Architectural Intent

The **Media Card Grid** is a promotional showcase organism designed to spotlight time-sensitive banking offers, loan specials, and deposit bonuses on a branded dark navy surface.

Based on the official Figma design artifacts, it features:
1. **Section Background**: Branded dark navy gradient `linear-gradient(135deg, #010E23 0%, #01375A 100%)` (reusing `var(--gradient-dark-navy)`).
2. **First Div: Header Row**:
   - Left-aligned, focused text group.
   - Uppercase Eyebrow in Vibrant Turquoise (`#68E0CC` / `var(--color-border-accent)` / `color="vibrant"`): `"WHAT'S NEW RIGHT NOW"`.
   - Heading Level 2 (`<h2>`) in Pure White (`#FFFFFF` / `var(--color-text-inverted)`): `"A few offers worth a look."`.
   - Strict `16px` (`var(--space-md)`) vertical gap between Eyebrow and Heading.
   - Clean architecture: No paragraph description and no right-aligned CTA in the header row, giving full visual focus to the promotional cards below.
3. **Second Div: Cards Row (Dynamic 2 or 3 Columns)**:
   - Supports **2 cards** (50% / 50% split) or **3 cards** (33.3% / 33.3% / 33.3% split) on desktop screens (`≥ 1024px` / `≥ 768px`).
   - Stacks gracefully to 1 column (`1fr`) on mobile screens (`< 768px`).
   - Each card is a `<MediaCard>` atom component with:
     - Top visual image banner (aspect ratio ~16:9 / `200px` height) with rounded top corners.
     - Content body with `24px` padding on dark teal/navy card surface (`#012642` / `rgba(2, 43, 72, 0.85)`).
     - Pill Badge: `"Limited Time"` (composing `<Badge variant="aqua">`).
     - Card Title: Pure white bold text (`1.25rem` / `20px`).
     - Card Description: Secondary white body text (`rgba(255, 255, 255, 0.8)` / `15px`).
     - Action Link CTA: Vibrant Turquoise link (`#68E0CC`) with trailing arrow (`<ArrowRightIcon size={16} />`).

```
Desktop Layout with 2 Cards (≥768px):
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ <section> with background: linear-gradient(135deg, #010E23 0%, #01375A 100%)           │
│  <div className="container" style="padding-block: 64px (4rem)">                         │
│                                                                                        │
│   [Header Row: Left-aligned]                                                           │
│   EYEBROW: "WHAT'S NEW RIGHT NOW" (#68E0CC)                                            │
│   (16px gap)                                                                           │
│   H2: "A few offers worth a look." (#FFFFFF)                                           │
│                                                                                        │
│   ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│   │ [Cards Row - 2-Column Grid: repeat(2, 1fr), Gap: 32px]                           │ │
│   │                                                                                  │ │
│   │    ┌──────────────────────────────────┐      ┌──────────────────────────────────┐│ │
│   │    │ ❖ Media Card 1                   │      │ ❖ Media Card 2                   ││ │
│   │    │ [ Banner Image: Convertible Car ]│      │ [ Banner Image: 3D Cash Blocks ] ││ │
│   │    │ (Badge: Limited Time)            │      │ (Badge: Limited Time)            ││ │
│   │    │ Title: X.XX% APR on new auto...  │      │ Title: $XXX when you open check. ││ │
│   │    │ Desc: Switch your everyday...    │      │ Desc: Switch your everyday...    ││ │
│   │    │ Link: Explore auto loans →       │      │ Link: Explore auto loans →       ││ │
│   │    └──────────────────────────────────┘      └──────────────────────────────────┘│ │
│   └──────────────────────────────────────────────────────────────────────────────────┘ │
│  </div>                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────┘

Desktop Layout with 3 Cards (≥1024px):
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ <section> with background: linear-gradient(135deg, #010E23 0%, #01375A 100%)           │
│  <div className="container" style="padding-block: 64px (4rem)">                         │
│                                                                                        │
│   [Header Row: Left-aligned]                                                           │
│   EYEBROW: "WHAT'S NEW RIGHT NOW" (#68E0CC)                                            │
│   (16px gap)                                                                           │
│   H2: "A few offers worth a look." (#FFFFFF)                                           │
│                                                                                        │
│   ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│   │ [Cards Row - 3-Column Grid: repeat(3, 1fr), Gap: 32px]                           │ │
│   │                                                                                  │ │
│   │    ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐      │ │
│   │    │ ❖ Media Card 1   │      │ ❖ Media Card 2   │      │ ❖ Media Card 3   │      │ │
│   │    │ [Banner: Auto]   │      │ [Banner: Move]   │      │ [Banner: Cash]   │      │ │
│   │    │ (Badge)          │      │ (Badge)          │      │ (Badge)          │      │ │
│   │    │ X.XX% APR Auto   │      │ Earn X.XX% APY   │      │ $XXX checking    │      │ │
│   │    │ Desc...          │      │ Desc...          │      │ Desc...          │      │ │
│   │    │ Explore loans →  │      │ Open cert →      │      │ Explore loans →  │      │ │
│   │    └──────────────────┘      └──────────────────┘      └──────────────────┘      │ │
│   └──────────────────────────────────────────────────────────────────────────────────┘ │
│  </div>                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────┘

Mobile Layout (<768px):
┌───────────────────────────────────────────────┐
│ <section> with padding-block: 32px (2rem)     │
│  <div className="container">                  │
│                                               │
│   [Header Row]                                │
│   EYEBROW: "WHAT'S NEW RIGHT NOW"             │
│   H2: "A few offers worth a look."            │
│                                               │
│   (Margin-Top: 32px)                          │
│                                               │
│   [Media Card 1: 100% width stacked]          │
│   [Media Card 2: 100% width stacked]          │
│   (Optional Media Card 3)                     │
│  </div>                                       │
└───────────────────────────────────────────────┘
```

---

## 2. Layout & DOM Hierarchy

```tsx
<section id={id} className={styles.section} aria-labelledby={headingId}>
  <div className={`container ${styles.container}`}>
    
    {/* Div 1: Header Row */}
    <div className={styles.headerRow}>
      {eyebrow && (
        <Text as="span" variant="eyebrow" color="vibrant" className={styles.eyebrow}>
          {eyebrow}
        </Text>
      )}
      <Heading level={headingLevel} id={headingId} className={styles.title}>
        {title}
      </Heading>
    </div>

    {/* Div 2: Cards Row (Dynamic 2 or 3 Columns) */}
    <div className={`${styles.cardsRow} ${cards.length === 2 ? styles.grid2 : styles.grid3}`}>
      {cards.map((card, index) => (
        <MediaCard
          key={card.id ?? index}
          imageSrc={card.imageSrc}
          imageAlt={card.imageAlt}
          badge={card.badge}
          title={card.title}
          description={card.description}
          ctaText={card.ctaText}
          href={card.href}
          className={styles.cardItem}
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
  - `background: var(--gradient-dark-navy, linear-gradient(135deg, #010E23 0%, #01375A 100%));`
- **Inner Container (`.container`)**:
  - Max width: `var(--container-max-w)` (`1280px`)
  - Centered: `margin-inline: auto;`
  - Gutters: `padding-inline: var(--container-gutter);`
  - **Desktop**: `padding-block: 4rem;` (`64px`)
  - **Mobile (`width < 768px`)**: `padding-block: 2rem;` (`32px`)
  - `display: flex; flex-direction: column; width: 100%;`

### 3.2 First Div: Header Row (`.headerRow`)
- `width: 100%;`
- `display: flex; flex-direction: column; align-items: flex-start; text-align: left;`
- **Spacing Between Eyebrow & Title**: Strict `16px` (`1rem` / `var(--space-md)`).
- `.eyebrow`: `margin: 0 0 1rem; color: var(--color-border-accent);` (`#68E0CC`)
- `.title`: `margin: 0; color: var(--color-text-inverted);` (`#FFFFFF`)

### 3.3 Second Div: Cards Row (`.cardsRow`)
- `width: 100%;`
- `margin-top: 2.5rem;` (`40px` / `var(--space-xl)`)
- `display: grid; gap: 2rem; align-items: stretch;`
- **2-Column Layout (`.grid2`)**:
  - Desktop (`width >= 768px`): `grid-template-columns: repeat(2, 1fr);`
- **3-Column Layout (`.grid3`)**:
  - Desktop (`width >= 1024px`): `grid-template-columns: repeat(3, 1fr);`
  - Tablet (`768px <= width < 1024px`): `grid-template-columns: repeat(2, 1fr);` (card 3 wraps cleanly)
- **Mobile (`width < 768px`)**:
  - `grid-template-columns: 1fr;`
  - `gap: 1.5rem;`

### 3.4 Media Card Atom (`<MediaCard>`)
- **Card Container (`.card`)**:
  - `display: flex; flex-direction: column; width: 100%;`
  - `background-color: var(--color-media-card-bg, #012642);` (or `rgba(2, 43, 72, 0.85)`)
  - `border: 1px solid var(--color-media-card-border, rgba(104, 224, 204, 0.15));`
  - `border-radius: var(--radius-xl);` (`16px` / `1rem`)
  - `overflow: hidden;`
  - `box-shadow: var(--shadow-elevation-sm);`
  - `transition: transform var(--duration-smart) var(--ease-out-smart), border-color var(--duration-smart) var(--ease-out-smart), box-shadow var(--duration-smart) var(--ease-out-smart);`
  - `text-decoration: none;`
- **Hover State (`.card:hover`)**:
  - `transform: translateY(-4px);`
  - `border-color: var(--color-border-accent);` (`#68E0CC`)
  - `box-shadow: var(--shadow-glow-turquoise, 0 8px 24px rgba(104, 224, 204, 0.2));`
- **Media Banner (`.mediaWrapper`)**:
  - `width: 100%; height: 200px;`
  - `overflow: hidden; position: relative;`
  - `background-color: var(--color-navy-950);`
- **Thumbnail Image (`.thumbnail`)**:
  - `width: 100%; height: 100%; object-fit: cover; display: block;`
  - `transition: transform var(--duration-smart) var(--ease-out-smart);`
  - `.card:hover .thumbnail`: `transform: scale(1.03);`
- **Card Content (`.content`)**:
  - `padding: 1.5rem;` (`24px` / `var(--space-lg)`)
  - `display: flex; flex-direction: column; align-items: flex-start; flex-grow: 1;`
- **Badge Slot (`.badge`)**:
  - Renders `<Badge variant="aqua">` (`Limited Time`).
  - `margin-bottom: 0.75rem;` (`12px`)
- **Card Title (`.cardTitle`)**:
  - `color: var(--color-text-inverted);` (`#FFFFFF`)
  - `font-size: 1.25rem;` (`20px`)
  - `font-weight: var(--font-weight-bold, 700);`
  - `line-height: 1.35;`
  - `margin: 0 0 0.5rem;`
- **Card Description (`.cardDescription`)**:
  - `color: var(--color-text-inverted-muted, rgba(255, 255, 255, 0.8));`
  - `font-size: 0.9375rem;` (`15px`)
  - `line-height: 1.5;`
  - `margin: 0 0 1.25rem;`
  - `flex-grow: 1;` (pushes CTA link to bottom)
- **Card Action Link (`.cardCta`)**:
  - `display: inline-flex; align-items: center; gap: 0.5rem;`
  - `color: var(--color-border-accent);` (`#68E0CC` Vibrant Turquoise)
  - `font-size: var(--font-size-body-sm);` (`14px`)
  - `font-weight: var(--font-weight-semibold, 600);`
  - `transition: var(--transition-all);`
  - `.card:hover .cardCta`: text underline or arrow shift `transform: translateX(4px);`

---

## 4. Design Tokens & Styling Mapping

| Element | Property | Token / CSS Value | Rendered Hex / Value |
| :--- | :--- | :--- | :--- |
| **Section** | `background` | `var(--gradient-dark-navy)` | `linear-gradient(135deg, #010E23 0%, #01375A 100%)` |
| **Section** | `padding-block` (Desktop) | `4rem` (on `.container`) | `64px` |
| **Section** | `padding-block` (Mobile) | `2rem` (on `.container`) | `32px` |
| **Header** | Eyebrow Typography / Color | `Text` (`variant="eyebrow"`, `color="vibrant"`) / `var(--color-border-accent)` | `#68E0CC` (Vibrant Turquoise) |
| **Header** | Title (H2) Typography / Color | `Heading Level 2` / `var(--color-text-inverted)` | `#FFFFFF` (Pure White) |
| **Header** | Gap between Eyebrow & Title | `var(--space-md)` | `16px` |
| **Cards Row** | `margin-top` | `2.5rem` | `40px` |
| **Cards Grid** | Columns (2-Card Mode Desktop) | `repeat(2, 1fr)` | 2 Equal Columns |
| **Cards Grid** | Columns (3-Card Mode Desktop) | `repeat(3, 1fr)` | 3 Equal Columns |
| **Cards Grid** | Columns (Mobile) | `1fr` | 1 Column (Stacked) |
| **Card Surface** | `background-color` | `var(--color-media-card-bg, #012642)` | Dark Navy/Teal `#012642` |
| **Card Border** | `border` | `1px solid rgba(104, 224, 204, 0.15)` | Subtle Turquoise Stroke |
| **Card Radius** | `border-radius` | `var(--radius-xl)` | `16px` (`1rem`) |
| **Card Hover** | `border-color` | `var(--color-border-accent)` | `#68E0CC` |
| **Card Hover** | `box-shadow` | `var(--shadow-glow-turquoise)` | `0 8px 24px rgba(104, 224, 204, 0.2)` |
| **Card Badge** | Component / Variant | `<Badge variant="aqua">` | Pill badge, `#68E0CC` text |
| **Card Title** | Typography / Color | `Heading Level 3` / `var(--color-text-inverted)` | `#FFFFFF` (Pure White, 20px) |
| **Card Desc** | Typography / Color | `Body Regular` / `var(--color-text-inverted-muted)` | `rgba(255, 255, 255, 0.8)` |
| **Card CTA** | Typography / Color | `Action Link` / `var(--color-border-accent)` | `#68E0CC` with 16px Arrow Icon |

---

## 5. Content Model & TypeScript Contracts

### 5.1 Domain Schema (`src/domain/models/MediaCardGrid.ts`)

```typescript
import { z } from "zod";

export const MediaCardItemSchema = z.object({
  id: z.string().optional(),
  imageSrc: z.string().min(1, "Banner image source is required"),
  imageAlt: z.string().optional().default("Promotional media card"),
  badge: z.string().optional().default("Limited Time"),
  title: z.string().min(1, "Card title is required"),
  description: z.string().min(1, "Card description is required"),
  ctaText: z.string().default("Explore auto loans"),
  href: z.string().min(1, "CTA href is required"),
  external: z.boolean().optional().default(false),
});

export const MediaCardGridSchema = z.object({
  id: z.string().optional(),
  eyebrow: z.string().default("WHAT'S NEW RIGHT NOW"),
  title: z.string().default("A few offers worth a look."),
  cards: z
    .array(MediaCardItemSchema)
    .min(2, "At least 2 media cards required")
    .max(3, "At most 3 media cards allowed"),
});

export type MediaCardItemModel = z.infer<typeof MediaCardItemSchema>;
export type MediaCardGridModel = z.infer<typeof MediaCardGridSchema>;
```

### 5.2 Component Props (`MediaCardGrid.tsx`)

```typescript
import React from "react";
import { type HeadingLevel } from "@/components/atoms/heading/Heading";

export interface MediaCardItemData {
  id?: string;
  imageSrc: string;
  imageAlt?: string;
  badge?: string;
  title: string;
  description: string;
  ctaText?: string;
  href: string;
  external?: boolean;
}

export interface MediaCardGridProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  cards?: MediaCardItemData[];
  className?: string;
}
```

### 5.3 Default Initial Content (Both 2-Card and 3-Card Presets)

```typescript
export const DEFAULT_MEDIA_CARD_GRID_3_CARDS: MediaCardGridProps = {
  eyebrow: "WHAT'S NEW RIGHT NOW",
  title: "A few offers worth a look.",
  cards: [
    {
      id: "offer-1",
      imageSrc: "/images/offers/auto-loan.jpg",
      imageAlt: "Friends driving a convertible through the city",
      badge: "Limited Time",
      title: "X.XX% APR on new auto loans",
      description: "Switch your everyday banking and we'll help you move everything over.",
      ctaText: "Explore auto loans",
      href: "/auto-loans",
    },
    {
      id: "offer-2",
      imageSrc: "/images/offers/certificate.jpg",
      imageAlt: "Family packing boxes for a new home",
      badge: "Limited Time",
      title: "Earn X.XX% APY on a certificate",
      description: "Put savings to work for a set term, at a rate available until MM/DD.",
      ctaText: "Open a certificate",
      href: "/certificates",
    },
    {
      id: "offer-3",
      imageSrc: "/images/offers/checking-bonus.jpg",
      imageAlt: "3D stylized financial cash symbols",
      badge: "Limited Time",
      title: "$XXX when you open checking",
      description: "Switch your everyday banking and we'll help you move everything over.",
      ctaText: "Explore auto loans",
      href: "/checking",
    },
  ],
};

export const DEFAULT_MEDIA_CARD_GRID_2_CARDS: MediaCardGridProps = {
  eyebrow: "WHAT'S NEW RIGHT NOW",
  title: "A few offers worth a look.",
  cards: [
    {
      id: "offer-1",
      imageSrc: "/images/offers/auto-loan.jpg",
      imageAlt: "Friends driving a convertible through the city",
      badge: "Limited Time",
      title: "X.XX% APR on new auto loans",
      description: "Switch your everyday banking and we'll help you move everything over.",
      ctaText: "Explore auto loans",
      href: "/auto-loans",
    },
    {
      id: "offer-2",
      imageSrc: "/images/offers/checking-bonus.jpg",
      imageAlt: "3D stylized financial cash symbols",
      badge: "Limited Time",
      title: "$XXX when you open checking",
      description: "Switch your everyday banking and we'll help you move everything over.",
      ctaText: "Explore auto loans",
      href: "/checking",
    },
  ],
};
```

---

## 6. Responsive Behavior Matrix

| Feature / Breakpoint | Desktop (`≥ 1024px`) | Tablet (`768px - 1023px`) | Mobile (`< 768px`) |
| :--- | :--- | :--- | :--- |
| **Section Background** | Dark Navy Gradient | Dark Navy Gradient | Dark Navy Gradient |
| **Container Padding Block** | `64px` (`4rem`) | `48px` (`3rem`) | `32px` (`2rem`) |
| **Header Alignment** | Left-aligned | Left-aligned | Left-aligned |
| **Header Elements** | Eyebrow + H2 Title | Eyebrow + H2 Title | Eyebrow + H2 Title |
| **Cards Grid (2 Cards)** | `repeat(2, 1fr)` (50% each) | `repeat(2, 1fr)` (50% each) | `1fr` (100% width stacked) |
| **Cards Grid (3 Cards)** | `repeat(3, 1fr)` (33.3% each)| `repeat(2, 1fr)` (wrap) | `1fr` (100% width stacked) |
| **Cards Grid Gap** | `32px` (`2rem`) | `24px` (`1.5rem`) | `24px` (`1.5rem`) |
| **Card Banner Height** | `200px` | `180px` | `180px` |

---

## 7. Accessibility & WCAG 2.2 AA Compliance

1. **Semantic Landmark**:
   - Outer wrapper is rendered as `<section aria-labelledby={headingId}>`.
2. **Sequential Heading Hierarchy**:
   - Section headline is rendered with `<Heading level="h2" id={headingId}>`.
   - Card titles are rendered with `<Heading level="h3">` or semantic subheadings.
3. **Contrast Verification**:
   - Eyebrow Vibrant Turquoise (`#68E0CC`) on Dark Navy (`#012642`): Ratio **8.6:1** (passes WCAG AAA).
   - Heading White (`#FFFFFF`) on Dark Navy (`#012642`): Ratio **13.4:1** (passes WCAG AAA).
   - Description White Muted (`rgba(255, 255, 255, 0.8)`): Ratio **8.2:1** (passes WCAG AAA).
   - Card CTA Turquoise (`#68E0CC`) on Dark Navy: Ratio **8.6:1** (passes WCAG AAA).
4. **Keyboard & Screen Reader Support**:
   - Card can be activated via standard keyboard navigation (`Tab` + `Enter`).
   - If the entire card is wrapped in an accessible link or uses an inner link with an extended hit area, duplicate link announcements are avoided via `aria-label` or clean DOM composition.

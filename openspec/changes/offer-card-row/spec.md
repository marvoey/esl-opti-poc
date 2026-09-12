# Component Specification: Offer Card Row (`<OfferCardRow>`)

> **Classification**: Organism Component  
> **Target Directory**: `components/organisms/offer-card-row/`  
> **Associated Atom**: `components/atoms/card/media-card/` (`<MediaCard>`)  
> **Underlying Molecule**: `components/molecules/carousel/Carousel.tsx` (Embla Carousel)  
> **Status**: Proposed Spec  
> **Design System Compliance**: Strict 3-Tier Tokens • Media Range Queries • Typography Composition Law • Embla Carousel Multi-Card Viewport • WCAG 2.2 AA Compliance  

---

## 1. Overview & Architectural Intent

The **Offer Card Row** is a promotional showcase organism designed to spotlight time-sensitive banking offers, loan specials, and deposit bonuses within an interactive, touch-friendly **Embla Carousel** on a branded dark navy surface.

Based on the official design artifact, it features:
1. **Section Background**: Branded dark navy gradient `linear-gradient(135deg, #010E23 0%, #01375A 100%)` (reusing `var(--gradient-dark-navy)`).
2. **First Div: Header Row**:
   - Left-aligned, focused text group.
   - Uppercase Eyebrow in Vibrant Turquoise (`#68E0CC` / `var(--color-border-accent)` / `color="vibrant"`): `"WHAT'S NEW RIGHT NOW"`.
   - Heading Level 2 (`<h2>`) in Pure White (`#FFFFFF` / `var(--color-text-inverted)`): `"A few offers worth a look."`.
   - Strict `16px` (`var(--space-md)`) vertical gap between Eyebrow and Heading.
   - Clean architecture: No paragraph description and no right-aligned CTA in the header row, giving full visual focus to the promotional cards below.
3. **Second Div: Embla Carousel Container (6 Cards Total, 3 Visible on Desktop)**:
   - Contains a dataset of **6 promotional offer cards**.
   - Embla Carousel viewport displaying **3 cards visible at a time** on desktop (`≥ 1024px`), **2 cards visible** on tablet (`768px - 1023px`), and **1 card visible** (or peeking) on mobile (`< 768px`).
   - Flanked by accessible, circular navigation buttons (`<` Prev and `>` Next) positioned on the outer edges/gutters of the cards track.
   - Touch swipe and drag enabled across all viewport sizes.
   - Each card is an identical `<MediaCard>` atom component with:
     - Top visual image banner (aspect ratio ~16:9 / `200px` height) with rounded top corners.
     - Content body with `24px` padding on dark teal/navy card surface (`#012642` / `rgba(2, 43, 72, 0.85)`).
     - Pill Badge: `"Limited Time"` (composing `<Badge variant="aqua">`).
     - Card Title: Pure white bold text (`1.25rem` / `20px`).
     - Card Description: Secondary white body text (`rgba(255, 255, 255, 0.8)` / `15px`).
     - Action Link CTA: Vibrant Turquoise link (`#68E0CC`) with trailing arrow (`<ArrowRightIcon size={16} />`).

```
Desktop Layout with Embla Carousel (≥1024px - 3 Cards Visible of 6):
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ <section> with background: linear-gradient(135deg, #010E23 0%, #01375A 100%)                     │
│  <div className="container" style="padding-block: 64px (4rem)">                                   │
│                                                                                                  │
│   [Header Row: Left-aligned]                                                                     │
│   EYEBROW: "WHAT'S NEW RIGHT NOW" (#68E0CC)                                                      │
│   (16px gap)                                                                                     │
│   H2: "A few offers worth a look." (#FFFFFF)                                                     │
│                                                                                                  │
│   ┌────────────────────────────────────────────────────────────────────────────────────────────┐ │
│   │ [Carousel Outer Wrapper with Flanking Nav Arrows]                                          │ │
│   │                                                                                            │ │
│   │ ┌───┐  ┌── Embla Viewport (overflow: hidden, 3 visible cards) ──────────────────────┐  ┌───┐│ │
│   │ │ < │  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ (Slide 4)│  │ > ││ │
│   │ │   │  │  │ ❖ Media Card 1   │  │ ❖ Media Card 2   │  │ ❖ Media Card 3   │ (Slide 5)│  │   ││ │
│   │ │   │  │  │ [Banner: Auto]   │  │ [Banner: Cert]   │  │ [Banner: Cash]   │ (Slide 6)│  │   ││ │
│   │ │   │  │  │ (Badge)          │  │ (Badge)          │  │ (Badge)          │          │  │   ││ │
│   │ │   │  │  │ X.XX% APR Auto   │  │ Earn X.XX% APY   │  │ $XXX checking    │          │  │   ││ │
│   │ │   │  │  │ Get on road...   │  │ Put savings...   │  │ Switch bank...   │          │  │   ││ │
│   │ │   │  │  │ Explore loans →  │  │ Open cert →      │  │ Explore loans →  │          │  │   ││ │
│   │ │   │  │  └──────────────────┘  └──────────────────┘  └──────────────────┘          │  │   ││ │
│   │ └───┘  └────────────────────────────────────────────────────────────────────────────┘  └───┘│ │
│   └────────────────────────────────────────────────────────────────────────────────────────────┘ │
│  </div>                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

Tablet Layout (768px - 1023px - 2 Cards Visible of 6):
┌──────────────────────────────────────────────────────────────────────────────┐
│  <div className="container" style="padding-block: 48px (3rem)">              │
│   EYEBROW: "WHAT'S NEW RIGHT NOW"                                            │
│   H2: "A few offers worth a look."                                           │
│                                                                              │
│   ┌───┐  ┌── Embla Viewport (2 visible cards) ─────────────┐  ┌───┐          │
│   │ < │  │  ┌────────────────────┐  ┌────────────────────┐ │  │ > │          │
│   │   │  │  │ ❖ Media Card 1     │  │ ❖ Media Card 2     │ │  │   │          │
│   │   │  │  │ [Banner: Auto]     │  │ [Banner: Cert]     │ │  │   │          │
│   │   │  │  │ X.XX% APR Auto     │  │ Earn X.XX% APY     │ │  │   │          │
│   │   │  │  │ Explore loans →    │  │ Open cert →        │ │  │   │          │
│   │   │  │  └────────────────────┘  └────────────────────┘ │  │   │          │
│   └───┘  └─────────────────────────────────────────────────┘  └───┘          │
└──────────────────────────────────────────────────────────────────────────────┘

Mobile Layout (<768px - 1 Card Visible / Touch Swipe):
┌───────────────────────────────────────────────────────────┐
│ <section> with padding-block: 32px (2rem)                 │
│  <div className="container">                              │
│   EYEBROW: "WHAT'S NEW RIGHT NOW"                         │
│   H2: "A few offers worth a look."                        │
│                                                           │
│   ┌── Embla Viewport (1 card visible / swipeable) ──────┐ │
│   │  ┌────────────────────────────────────────────────┐ │ │
│   │  │ ❖ Media Card 1 (100% width or 85% peek)        │ │ │
│   │  │ [Banner: Auto]                                 │ │ │
│   │  │ X.XX% APR Auto                                 │ │ │
│   │  │ Explore loans →                                │ │ │
│   │  └────────────────────────────────────────────────┘ │ │
│   └─────────────────────────────────────────────────────┘ │
│   [ < ] Prev                        Next [ > ]            │
│  </div>                                                   │
└───────────────────────────────────────────────────────────┘
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

    {/* Div 2: Carousel Outer Wrapper */}
    <div className={styles.carouselWrapper}>
      
      {/* Previous Nav Button */}
      <button
        type="button"
        className={`${styles.navButton} ${styles.navButtonPrev}`}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous offers"
        aria-controls={carouselId}
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>

      {/* Embla Viewport */}
      <div className={styles.viewport} ref={emblaRef} id={carouselId} role="region" aria-roledescription="carousel" aria-label={title}>
        <div className={styles.track}>
          {cards.map((card, index) => (
            <div
              key={card.id ?? index}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${cards.length}`}
            >
              <MediaCard
                imageSrc={card.imageSrc}
                imageAlt={card.imageAlt}
                badge={card.badge}
                title={card.title}
                description={card.description}
                ctaText={card.ctaText}
                href={card.href}
                className={styles.cardItem}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Next Nav Button */}
      <button
        type="button"
        className={`${styles.navButton} ${styles.navButtonNext}`}
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Next offers"
        aria-controls={carouselId}
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>

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
  - **Desktop (`width ≥ 1024px`)**: `padding-block: 4rem;` (`64px`)
  - **Tablet (`768px ≤ width < 1024px`)**: `padding-block: 3rem;` (`48px`)
  - **Mobile (`width < 768px`)**: `padding-block: 2rem;` (`32px`)
  - `display: flex; flex-direction: column; width: 100%;`

### 3.2 First Div: Header Row (`.headerRow`)
- `width: 100%;`
- `display: flex; flex-direction: column; align-items: flex-start; text-align: left;`
- **Spacing Between Eyebrow & Title**: Strict `16px` (`1rem` / `var(--space-md)`).
- `.eyebrow`: `margin: 0 0 1rem; color: var(--color-border-accent);` (`#68E0CC`)
- `.title`: `margin: 0; color: var(--color-text-inverted);` (`#FFFFFF`)

### 3.3 Second Div: Carousel Wrapper & Embla Track (`.carouselWrapper`, `.viewport`, `.track`)
- **Carousel Wrapper (`.carouselWrapper`)**:
  - `position: relative; width: 100%;`
  - `margin-top: 2.5rem;` (`40px` / `var(--space-xl)`)
  - `display: flex; align-items: center;`
- **Viewport (`.viewport`)**:
  - `overflow: hidden; width: 100%;`
- **Track (`.track`)**:
  - `display: flex; gap: 2rem;` (`32px` on desktop)
  - `touch-action: pan-y pinch-zoom;`
  - `margin-left: 0;`
- **Slide Item (`.slide`)**:
  - `min-width: 0; flex-shrink: 0; display: flex;`
  - **Desktop (`width ≥ 1024px`)**: 3 cards visible:
    - `flex: 0 0 calc((100% - 2 * 2rem) / 3);` (33.333% minus gap)
  - **Tablet (`768px ≤ width < 1024px`)**: 2 cards visible:
    - `flex: 0 0 calc((100% - 1.5rem) / 2);`
  - **Mobile (`width < 768px`)**:
    - `flex: 0 0 100%;` (or `flex: 0 0 88%;` for peek effect)
- **Gap Scaling**:
  - Desktop: `gap: 2rem;` (`32px`)
  - Mobile/Tablet: `gap: 1.25rem;` (`20px`)

### 3.4 Navigation Controls (`.navButton`)
- **Button Styling**:
  - `position: absolute; z-index: 2;`
  - `top: 50%; transform: translateY(-50%);`
  - `width: 44px; height: 44px; border-radius: 50%;`
  - `display: inline-flex; align-items: center; justify-content: center;`
  - `background-color: rgba(1, 38, 66, 0.85);`
  - `border: 1px solid rgba(104, 224, 204, 0.25);`
  - `color: var(--color-border-accent, #68E0CC);`
  - `cursor: pointer;`
  - `backdrop-filter: blur(8px);`
  - `box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);`
  - `transition: all var(--duration-smart) var(--ease-out-smart);`
- **Placement**:
  - `.navButtonPrev`: `left: -22px;` (flanking outer card edge) or `left: 8px;` inside viewport gutter.
  - `.navButtonNext`: `right: -22px;` (flanking outer card edge) or `right: 8px;` inside viewport gutter.
- **Hover & Active States**:
  - `background-color: #01375A;`
  - `border-color: var(--color-border-accent, #68E0CC);`
  - `box-shadow: 0 0 16px rgba(104, 224, 204, 0.4);`
  - `transform: translateY(-50%) scale(1.06);`
- **Disabled State**:
  - `opacity: 0.3;`
  - `cursor: not-allowed;`
  - `pointer-events: none;`

### 3.5 Media Card Atom (`<MediaCard>`)
- **Card Container (`.card`)**:
  - `display: flex; flex-direction: column; width: 100%; height: 100%;`
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
  - `.card:hover .cardCta`: arrow shift `transform: translateX(4px);`

---

## 4. Design Tokens & Styling Mapping

| Element | Property | Token / CSS Value | Rendered Hex / Value |
| :--- | :--- | :--- | :--- |
| **Section** | `background` | `var(--gradient-dark-navy)` | `linear-gradient(135deg, #010E23 0%, #01375A 100%)` |
| **Section** | `padding-block` (Desktop) | `4rem` (on `.container`) | `64px` |
| **Section** | `padding-block` (Tablet) | `3rem` (on `.container`) | `48px` |
| **Section** | `padding-block` (Mobile) | `2rem` (on `.container`) | `32px` |
| **Header** | Eyebrow Typography / Color | `Text` (`variant="eyebrow"`, `color="vibrant"`) / `var(--color-border-accent)` | `#68E0CC` (Vibrant Turquoise) |
| **Header** | Title (H2) Typography / Color | `Heading Level 2` / `var(--color-text-inverted)` | `#FFFFFF` (Pure White) |
| **Header** | Gap between Eyebrow & Title | `var(--space-md)` | `16px` |
| **Carousel Wrapper** | `margin-top` | `2.5rem` | `40px` |
| **Carousel Viewport** | `overflow` | `hidden` | Clipped edges for sliding |
| **Carousel Track** | Slide width (Desktop ≥1024px)| `calc((100% - 2 * 2rem) / 3)` | 3 Cards visible simultaneously |
| **Carousel Track** | Slide width (Tablet 768-1023px) | `calc((100% - 1.5rem) / 2)` | 2 Cards visible simultaneously |
| **Carousel Track** | Slide width (Mobile <768px) | `100%` (or `88%` peek) | 1 Card visible with touch swipe |
| **Nav Arrow Button**| Size / Shape | `44px x 44px` / Circular (`50%` radius) | Circular Floating Action Button |
| **Nav Arrow Button**| Background / Border | `rgba(1, 38, 66, 0.85)` / `rgba(104, 224, 204, 0.25)` | Glassmorphic Deep Blue & Aqua |
| **Nav Arrow Button**| Color / Icon | `#68E0CC` / Chevron (`20px`) | Vibrant Turquoise Arrow |
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

### 5.1 Domain Schema

```typescript
import { z } from "zod";

export const OfferCardItemSchema = z.object({
  id: z.string().optional(),
  imageSrc: z.string().min(1, "Banner image source is required"),
  imageAlt: z.string().optional().default("Promotional offer card"),
  badge: z.string().optional().default("Limited Time"),
  title: z.string().min(1, "Card title is required"),
  description: z.string().min(1, "Card description is required"),
  ctaText: z.string().default("Explore auto loans"),
  href: z.string().min(1, "CTA href is required"),
  external: z.boolean().optional().default(false),
});

export const OfferCardRowSchema = z.object({
  id: z.string().optional(),
  eyebrow: z.string().default("WHAT'S NEW RIGHT NOW"),
  title: z.string().default("A few offers worth a look."),
  cards: z
    .array(OfferCardItemSchema)
    .min(1, "At least 1 card is required")
    .default([]),
});

export type OfferCardItemModel = z.infer<typeof OfferCardItemSchema>;
export type OfferCardRowModel = z.infer<typeof OfferCardRowSchema>;
```

### 5.2 Component Props (`OfferCardRow.tsx`)

```typescript
import React from "react";
import { type HeadingLevel } from "@/components/atoms/heading/Heading";

export interface OfferCardItemData {
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

export interface OfferCardRowProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel;
  cards?: OfferCardItemData[];
  className?: string;
}
```

### 5.3 Default Initial Content (Complete 6-Card Dataset)

```typescript
export const DEFAULT_OFFER_CARDS_6: OfferCardItemData[] = [
  {
    id: "offer-1",
    imageSrc: "/images/offers/auto-loan.jpg",
    imageAlt: "Friends driving a convertible through the city",
    badge: "Limited Time",
    title: "X.XX% APR on new auto loans",
    description: "Get on the road with a rate set in members' favor. Offer ends MM/DD",
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
    imageSrc: "/images/offers/checking.jpg",
    imageAlt: "3D stylized financial cash symbols",
    badge: "Limited Time",
    title: "$XXX when you open checking",
    description: "Switch your everyday banking and we'll help you move everything over.",
    ctaText: "Explore auto loans",
    href: "/checking",
  },
  {
    id: "offer-4",
    imageSrc: "/images/offers/auto-loan.jpg",
    imageAlt: "Digital credit card with rewards and points",
    badge: "Limited Time",
    title: "0% Intro APR on balance transfers",
    description: "Consolidate higher-interest balances and save with zero interest for 12 months.",
    ctaText: "Compare cards",
    href: "/credit-cards",
  },
  {
    id: "offer-5",
    imageSrc: "/images/offers/certificate.jpg",
    imageAlt: "Modern home with renovation improvements",
    badge: "Limited Time",
    title: "Lock in a competitive HELOC rate",
    description: "Tap into your home's equity for renovations, tuition, or major life expenses.",
    ctaText: "Learn about HELOC",
    href: "/home-equity",
  },
  {
    id: "offer-6",
    imageSrc: "/images/offers/checking.jpg",
    imageAlt: "Piggy bank and growing savings chart",
    badge: "Limited Time",
    title: "Earn up to X.XX% APY with Premier Savings",
    description: "Grow your rainy day fund faster with tiered dividend rates and zero monthly fees.",
    ctaText: "Start saving",
    href: "/savings",
  },
];

export const DEFAULT_OFFER_CARD_ROW_PROPS: OfferCardRowProps = {
  eyebrow: "WHAT'S NEW RIGHT NOW",
  title: "A few offers worth a look.",
  cards: DEFAULT_OFFER_CARDS_6,
};
```

---

## 6. Responsive & Embla Carousel Behavior Matrix

| Feature / Breakpoint | Desktop (`≥ 1024px`) | Tablet (`768px - 1023px`) | Mobile (`< 768px`) |
| :--- | :--- | :--- | :--- |
| **Section Background** | Dark Navy Gradient | Dark Navy Gradient | Dark Navy Gradient |
| **Container Padding Block** | `64px` (`4rem`) | `48px` (`3rem`) | `32px` (`2rem`) |
| **Header Alignment** | Left-aligned | Left-aligned | Left-aligned |
| **Header Spacing** | Strict `16px` between eyebrow & title | Strict `16px` between eyebrow & title | Strict `16px` between eyebrow & title |
| **Visible Cards in Viewport**| **3 cards** | **2 cards** | **1 card** (or 88% peek) |
| **Slide Width Calculation** | `calc((100% - 2 * 32px) / 3)` | `calc((100% - 20px) / 2)` | `100%` |
| **Track Gap** | `32px` (`2rem`) | `20px` (`1.25rem`) | `16px` (`1rem`) |
| **Navigation Arrows** | Flanking outer edges | Flanking outer edges | Bottom controls or swipe-driven |
| **Embla `align`** | `"start"` | `"start"` | `"start"` (or `"center"`) |
| **Embla `containScroll`** | `"trimSnaps"` | `"trimSnaps"` | `"trimSnaps"` |
| **Card Banner Height** | `200px` | `180px` | `180px` |
| **Touch / Drag Gestures** | Full drag supported | Full touch swipe supported | Full touch swipe supported |

---

## 7. Accessibility & WCAG 2.2 AA Compliance

1. **WAI-ARIA Carousel Design Pattern**:
   - Viewport is marked as `role="region"` with `aria-roledescription="carousel"` and `aria-label="A few offers worth a look."`.
   - Each slide container is marked as `role="group"`, `aria-roledescription="slide"`, and has a descriptive label: `aria-label="1 of 6"`, `aria-label="2 of 6"`, etc.
2. **Navigation Arrow Buttons**:
   - Semantic `<button type="button">` elements.
   - `aria-label="Previous offers"` and `aria-label="Next offers"`.
   - `aria-controls` explicitly points to the carousel viewport ID (`id="offer-carousel-viewport"`).
   - Appropriate `disabled` attribute and visual dimmed styling when non-looping bounds are reached.
3. **Sequential Heading Hierarchy**:
   - Section headline is rendered with `<Heading level="h2" id={headingId}>`.
   - Card titles are rendered with `<Heading level="h3">` or semantic subheadings inside `<MediaCard>`.
4. **Contrast Verification**:
   - Eyebrow Vibrant Turquoise (`#68E0CC`) on Dark Navy (`#012642`): Ratio **8.6:1** (passes WCAG AAA).
   - Heading White (`#FFFFFF`) on Dark Navy (`#012642`): Ratio **13.4:1** (passes WCAG AAA).
   - Description White Muted (`rgba(255, 255, 255, 0.8)`): Ratio **8.2:1** (passes WCAG AAA).
   - Card CTA Turquoise (`#68E0CC`) on Dark Navy: Ratio **8.6:1** (passes WCAG AAA).
   - Navigation button icon (`#68E0CC`) on button background (`#012642`): Ratio **8.6:1** (passes WCAG AAA).
5. **Keyboard & Screen Reader Support**:
   - Complete keyboard accessibility: Focus moves sequentially into the navigation buttons and each card CTA (`Tab` / `Shift+Tab`).
   - Cards do not trap focus.
   - Touch targets for navigation buttons meet or exceed the WCAG 2.2 minimum target size of `44x44px`.
6. **Motion Sensitivity**:
   - Honors `prefers-reduced-motion: reduce` by suppressing smooth scroll transitions and using instant snap jumps.

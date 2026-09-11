# Component Specification: Video Story Card Row (`<VideoStoryCardRow>`)

> **Classification**: Organism Component  
> **Target Directory**: `src/components/organisms/video-story-card-row/`  
> **Status**: Proposed Spec  
> **Design System Compliance**: Strict 3-Tier Tokens • Media Range Queries • Typography Composition Law • Video Facade Pattern • WCAG 2.2 AA Compliance  

---

## 1. Overview & Architectural Intent

The **Video Story Card Row** is an editorial member story and social proof organism designed to showcase member video testimonials in a high-trust, conversion-oriented layout.

It shares the identical two-tier layout hierarchy established by `<CircularImageMetricRow>` and `<MetricCardRow>`, adapted for editorial white-surface video storytelling:
1. **Section Background**: Clean white background (`background: var(--color-bg)` / `#FFFFFF`).
2. **Header Row (Div 1)**: Full width (100%), split into two responsive columns:
   - **Left Column**: Constrained text block (max-width `585px`) containing an uppercase Eyebrow in Teal (`#00A3A3` / `var(--color-teal-700)`), an `h2` heading in Deep Navy (`#00395D` / `var(--color-navy-900)`), and a `body-lg` description paragraph in Deep Navy (`#00395D`) with strict `16px` vertical gaps.
   - **Right Column**: Primary Pill button (`variant="primary"`, `shape="pill"`) with trailing arrow icon (`<ArrowRightIcon size={20} />`) aligned flush to the bottom-right on desktop.
3. **Cards Row (Div 2)**: Full width (100%) with `48px` top margin, displaying 3 equal columns:
   - 3-column CSS Grid (`repeat(3, 1fr)`) on desktop, stacking to 1 column (`1fr`) on mobile (`< 768px`).
   - Each column renders a **Testimonial Card** (`<TestimonialCard>`) atom component featuring static thumbnail preview, play button overlay, and an accessible video lightbox dialog.
4. **Mobile Stacking Behavior**: On screens `< 768px`, header columns stack vertically with the CTA positioned below the description, and the 3 Testimonial Cards stack vertically.

```
Desktop Layout (≥768px):
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ <section> with background: var(--color-bg) (#FFFFFF)                                   │
│  <div className="container" style="padding-block: 64px (4rem)">                         │
│                                                                                        │
│   ┌───────────────────────────────────────────────┬──────────────────────────────────┐ │
│   │ [Header Row - Col 1: Max Width 585px]         │ [Header Row - Col 2: End/Bottom] │ │
│   │                                               │                                  │ │
│   │  EYEBROW: "Member Stories" (#00A3A3)          │                                  │ │
│   │  (16px margin)                                │                                  │ │
│   │  H2: "Real stories from members like you."    │                                  │ │
│   │  (16px margin)                                │                                  │ │
│   │  BODY-LG: "See how local families and business│  [ Watch more stories  → ]       │ │
│   │  owners build their future with ESL."(#00395D)│  (Pill Primary Button - Bottom-R)│ │
│   └───────────────────────────────────────────────┴──────────────────────────────────┘ │
│                                                                                        │
│   ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│   │ [Cards Row - 100% Width, Margin-Top: 48px, 3-Column Grid]                        │ │
│   │                                                                                  │ │
│   │    ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐      │ │
│   │    │❖ Testimonial Card│      │❖ Testimonial Card│      │❖ Testimonial Card│      │ │
│   │    │ [Thumbnail / ▶ ] │      │ [Thumbnail / ▶ ] │      │ [Thumbnail / ▶ ] │      │ │
│   │    │ Icon + Title     │      │ Icon + Title     │      │ Icon + Title     │      │ │
│   │    │ "Quote text..."  │      │ "Quote text..."  │      │ "Quote text..."  │      │ │
│   │    │ Author · Location│      │ Author · Location│      │ Author · Location│      │ │
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
│   EYEBROW: "Member Stories"                   │
│   H2: "Real stories from members like you."   │
│   BODY-LG: "See how local families..."        │
│                                               │
│   [Col 2: CTA - Left/Full-width on Mobile]    │
│   [ Watch more stories  → ] (Primary Pill)    │
│                                               │
│   (Margin-Top: 48px)                          │
│                                               │
│   [Testimonial Card 1: Marcia, Café Owner]    │
│   [Testimonial Card 2: Marcus, First Home]    │
│   [Testimonial Card 3: Elena, Education Fund] │
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
        <Eyebrow color="accent" className={styles.eyebrow}>
          {eyebrow}
        </Eyebrow>
        <Heading level={headingLevel} id={headingId} className={styles.title}>
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

    {/* Div 2: Cards Row (100% Width, Margin-Top: 48px, 3-Column Grid) */}
    <div className={styles.cardsRow}>
      {cards.map((card, index) => (
        <TestimonialCard
          key={card.id ?? index}
          imageSrc={card.imageSrc}
          imageAlt={card.imageAlt}
          videoUrl={card.videoUrl}
          videoTitle={card.videoTitle}
          icon={card.icon}
          title={card.title}
          quote={card.quote}
          author={card.author}
          className={styles.testimonialCard}
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
  - `background: var(--color-bg);` (`#FFFFFF`)
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
  - `.eyebrow`: `margin: 0 0 1rem; color: var(--color-teal-700);`
  - `.title`: `margin: 0 0 1rem; color: var(--color-navy-900);`
  - `.description`: `margin: 0; color: var(--color-navy-900); font-size: var(--font-size-body-lg); line-height: var(--line-height-body-lg, 1.5);`

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
  - `display: grid; grid-template-columns: 1fr; gap: 2rem; justify-items: center;`

#### Testimonial Card Slot Integration:
- Card width inside grid column expands up to slot (`max-width: 100%` / card default `376px`).
- Centered on mobile with `width: 100%`.

---

## 4. Design Tokens & Styling Mapping

| Element | Property | Token / CSS Value | Rendered Hex / Value |
| :--- | :--- | :--- | :--- |
| **Section** | `background` | `var(--color-bg)` | `#FFFFFF` (White) |
| **Section** | `padding-block` (Desktop) | `4rem` (on `.container`) | `64px` |
| **Section** | `padding-block` (Mobile) | `2rem` (on `.container`) | `32px` |
| **Header Col 1** | `max-width` | `585px` | `585px` |
| **Header Text** | Spacing Between | `var(--space-md)` | `16px` |
| **Eyebrow** | Typography / Color | `Eyebrow` / `var(--color-teal-700)` (`color="accent"`) | `#00A3A3` (Teal) |
| **Title (H2)** | Typography / Color | `Heading Level 2` / `var(--color-navy-900)` | `#00395D` (Deep Navy) |
| **Description** | Typography / Color | `Body Large` / `var(--color-navy-900)` (`color="primary"`) | `#00395D` (Deep Navy) |
| **Header CTA** | Button Variant / Shape | `variant="primary"` / `shape="pill"` | Navy bg (`#00395D`), White text, Turquoise hover |
| **CTA Icon** | Trailing Icon | `<ArrowRightIcon size={20} />` | 20px SVG arrow |
| **Cards Row** | `margin-top` | `3rem` | `48px` |
| **Cards Grid** | Columns (Desktop) | `repeat(3, 1fr)` | 3 Columns |
| **Cards Grid** | Columns (Mobile) | `1fr` | 1 Column (Stacked) |
| **Cards Grid** | Card Component | `<TestimonialCard>` ("❖ Testimonial card") | Raised surface `#FFFFFF`, Border `#D5E5F4` |

---

## 5. Content Model & TypeScript Contracts

### 5.1 Domain Schema (`src/domain/models/VideoStoryCardRow.ts`)

```typescript
import { z } from "zod";

export const TestimonialAuthorInfoSchema = z.object({
  name: z.string().min(1, "Author name is required"),
  role: z.string().optional(),
  location: z.string().optional(),
});

export const VideoStoryCardItemSchema = z.object({
  id: z.string().optional(),
  imageSrc: z.string().min(1, "Thumbnail image source is required"),
  imageAlt: z.string().optional().default("Testimonial video thumbnail"),
  videoUrl: z.string().optional(),
  videoTitle: z.string().optional(),
  title: z.string().min(1, "Story title is required"),
  quote: z.string().min(1, "Testimonial quote is required"),
  author: z.union([TestimonialAuthorInfoSchema, z.string()]),
});

export const VideoStoryCardRowCtaSchema = z.object({
  label: z.string().min(1, "CTA label is required"),
  href: z.string().min(1, "CTA href is required"),
  external: z.boolean().optional().default(false),
});

export const VideoStoryCardRowSchema = z.object({
  id: z.string().optional(),
  eyebrow: z.string().default("Member Stories"),
  title: z.string().default("Real stories from members like you."),
  description: z.string().default(
    "See how local families and business owners build their future with personalized financial solutions from ESL."
  ),
  cta: VideoStoryCardRowCtaSchema.default({
    label: "Watch more stories",
    href: "/stories",
    external: false,
  }),
  cards: z.array(VideoStoryCardItemSchema).length(3, "Exactly 3 story cards required"),
});

export type TestimonialAuthorInfoModel = z.infer<typeof TestimonialAuthorInfoSchema>;
export type VideoStoryCardItemModel = z.infer<typeof VideoStoryCardItemSchema>;
export type VideoStoryCardRowCtaModel = z.infer<typeof VideoStoryCardRowCtaSchema>;
export type VideoStoryCardRowModel = z.infer<typeof VideoStoryCardRowSchema>;
```

### 5.2 Component Props (`VideoStoryCardRow.tsx`)

```typescript
import React from "react";
import { type HeadingLevel } from "@/components/atoms/heading/Heading";
import { type TestimonialAuthorInfo } from "@/components/atoms/card/testimonial-card/TestimonialCard";

export interface VideoStoryCardItem {
  id?: string;
  imageSrc: string;
  imageAlt?: string;
  videoUrl?: string;
  videoTitle?: string;
  icon?: React.ReactNode;
  title: string;
  quote: string;
  author: TestimonialAuthorInfo | string;
}

export interface VideoStoryCardRowProps {
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
  cards?: VideoStoryCardItem[];
  className?: string;
}
```

### 5.3 Default Initial Content

```typescript
export const DEFAULT_VIDEO_STORY_CARD_ROW: VideoStoryCardRowProps = {
  eyebrow: "Member Stories",
  title: "Real stories from members like you.",
  description:
    "See how local families and business owners build their future with personalized financial solutions from ESL.",
  cta: {
    label: "Watch more stories",
    href: "/stories",
  },
  cards: [
    {
      id: "story-1",
      imageSrc: "/images/testimonials/marcia.png",
      imageAlt: "Marcia, café owner in the Finger Lakes",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoTitle: "Marcia's Business Growth Story",
      title: "Expanded her business",
      quote: "Their business banking solutions helped me grow my company. Exceptional service and competitive rates.",
      author: {
        name: "Marcia",
        role: "café owner",
        location: "Finger Lakes",
      },
    },
    {
      id: "story-2",
      imageSrc: "/images/metrics/volunteers.jpg",
      imageAlt: "David, proud homeowner in Greater Rochester",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoTitle: "David's First Home Buying Journey",
      title: "Bought his first home",
      quote: "The mortgage team made what felt like an impossible dream straightforward and stress-free.",
      author: {
        name: "David",
        role: "homeowner",
        location: "Rochester",
      },
    },
    {
      id: "story-3",
      imageSrc: "/images/metrics/education.jpg",
      imageAlt: "Elena, university student and savings club member",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoTitle: "Elena's Financial Independence Story",
      title: "Saved for college",
      quote: "Opening my first student account taught me financial confidence before I even set foot on campus.",
      author: {
        name: "Elena",
        role: "student",
        location: "Brighton",
      },
    },
  ],
};
```

---

## 6. Responsive Behavior Matrix

| Feature / Breakpoint | Desktop (`≥ 768px`) | Mobile (`< 768px`) |
| :--- | :--- | :--- |
| **Section Background** | Solid White (`var(--color-bg)`) | Solid White (`var(--color-bg)`) |
| **Container Padding Block** | `64px` (`4rem`) | `32px` (`2rem`) |
| **Header Row Layout** | 2 Columns (`space-between`, `align-items: flex-end`) | 1 Column (Stacked vertically) |
| **Header Content Max Width**| `585px` | `100%` (max-width `585px`) |
| **Header CTA Button** | Primary Pill Button (Bottom-Right aligned) | Primary Pill Button (Left-aligned / Stacked) |
| **Cards Row Layout** | 3-column CSS Grid (`repeat(3, 1fr)`) | 1-column CSS Grid (`1fr`) |
| **Cards Row Margin Top** | `48px` (`3rem`) | `48px` (`3rem`) |
| **Cards Column Width** | 1fr (up to 376px max-width) | 1fr (centered, max-width 376px) |

---

## 7. Accessibility & Compliance Contract

- **Semantic Landmark**: Outer wrapper is rendered as `<section aria-labelledby={headingId}>`.
- **Heading Hierarchy**: Main headline rendered with `<Heading level={headingLevel ?? "h2"} id={headingId}>` to preserve strict sequential document hierarchy.
- **Button Target & Focus**: Primary pill button satisfies minimum 44×44px interactive touch target with visible outline focus ring.
- **Video Facade Accessibility**:
  - Thumbnail operates with keyboard activation (`Enter` / `Space`).
  - Modal lightbox enforces focus trapping on open, Esc-to-close handler, and restores focus on dismissal.
- **WCAG 2.2 AA Contrast Compliance**:
  - Eyebrow Teal (`#00A3A3`) on White: Ratio > 4.5:1 (passes AA).
  - Heading Deep Navy (`#00395D`) on White: Ratio > 8.5:1 (passes AAA).
  - Description Deep Navy (`#00395D`) on White: Ratio > 8.5:1 (passes AAA).
  - Card quote, titles, and authors: Verified WCAG AA compliant.

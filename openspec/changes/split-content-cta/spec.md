# Component Specification: Split Content + CTA (`<SplitContentCta>`)

> **Classification**: Organism Component
> **Target Directory**: `src/components/organisms/split-content-cta/`
> **Status**: Spec Ready for Implementation
> **Reference**: attached screenshot ("Still weighing it up? Let's talk it through.")
> **Reuses**: the existing `IconContentCard` atom's `"inverse"` variant as-is for both cards — no new atom needed

---

## 1. Naming Check (per request)

Two `SplitContent*` organisms already exist in this codebase, but neither matches this pattern closely enough to extend as a numbered variant:

- `SplitContentCards` (`src/components/organisms/split-content-cards/`) — **light** background, left text + single primary CTA button, right side is a hero stat card + a grid of small plain stat blocks (value + label, no icons, no per-card links). Structurally a stats/proof-point showcase, not this.
- `SplitContentImage` (`src/components/organisms/split-content-image/`) — left text + two buttons, right side is a single portrait image. No cards at all.
- No component named `SplitContentCta`/`SplitContentCTA`/`SplitContentAndCta` exists anywhere in the repo.

Since there's no actual name collision, this gets a clean new name — `SplitContentCta` — rather than a numbered suffix. (If you'd rather it read as a sibling of `SplitContentCards` despite the structural difference, say so and it becomes `SplitContentCardsVariant2` instead — trivial rename, no other changes.)

---

## 2. Overview

A dark, full-bleed CTA section: left side is a heading + supporting copy, right side is two `IconContentCard` (`variant="inverse"`) tiles side by side — each a small icon-badge card with a title, description, and its own "CTA here →" link.

```
┌────────────────────────────────────────────────────────────────────────┐
│ background: var(--gradient-dark-navy)                                  │
│  ┌──────────────────────────┐   ┌───────────────┐  ┌───────────────┐   │
│  │ Still weighing it up?    │   │ (icon)         │  │ (icon)         │  │
│  │ Let's talk it through.   │   │ Find a branch  │  │ Contact us     │  │
│  │                          │   │ Lorem ipsum... │  │ Lorem ipsum... │  │
│  │ Tell us how you bank     │   │ CTA here →     │  │ CTA here →     │  │
│  │ day to day and we'll     │   └───────────────┘  └───────────────┘   │
│  │ help you decide between  │                                          │
│  │ Premier and Free         │                                          │
│  │ Checking — no pressure   │                                          │
│  │ to open today.           │                                          │
│  └──────────────────────────┘                                          │
└────────────────────────────────────────────────────────────────────────┘

Mobile/tablet (< 1024px): stacks to a single column — text block, then
the two cards (stacked or 2-up, see Section 6) — matching the same
asymmetric-layout breakpoint convention already used by <SideBySide>
and <SwitchSupport>.
```

---

## 3. Component Composition Contract

| Layer | Atom Used | Purpose |
| :--- | :--- | :--- |
| **Heading** | `<Heading level="h2">` with `color: var(--color-text-inverted)` override | White, "Still weighing it up? Let's talk it through." |
| **Description** | `<Text variant="body" color="inverted">` | Plain white body copy (not muted — matching the correction already applied to `SwitchSupport`'s description this session) |
| **Cards (×2)** | `<IconContentCard variant="inverse">` (existing atom, unmodified) | Already implements exactly this shape: icon badge, bold white title, muted white description, teal "CTA here →" link with arrow |
| **"Find a branch" icon** | `<Icon name="map-pin" />` | **Does not exist in the icon registry today** — add Lucide's `MapPin` to `src/components/atoms/icons/index.tsx`, following the exact pattern already used for `plus`/`minus` earlier this session |
| **"Contact us" icon** | `<Icon name="headphones" />` | Already exists — no change needed |

---

## 4. TypeScript Domain & Component Interface

```typescript
import { type HeadingLevel } from "@/components/atoms/heading/Heading";
import { type IconName } from "@/components/atoms/icons";

export interface SplitContentCtaOption {
  id: string;
  icon: IconName | React.ReactNode;
  title: string;
  description: string;
  ctaText: string;
  href: string;
}

export interface SplitContentCtaProps {
  id?: string;
  title?: string;
  headingLevel?: HeadingLevel; // default "h2"
  description?: string;
  options: SplitContentCtaOption[]; // expects exactly 2 for this layout
  className?: string;
}
```

No `"use client"` needed — static composition, no internal state.

---

## 5. Content — transcribed verbatim from the screenshot

```typescript
export const DEFAULT_SPLIT_CONTENT_CTA_PROPS: SplitContentCtaProps = {
  title: "Still weighing it up? Let's talk it through.",
  description:
    "Tell us how you bank day to day and we'll help you decide between Premier and Free Checking — no pressure to open today.",
  options: [
    {
      id: "find-a-branch",
      icon: "map-pin",
      title: "Find a branch",
      description: "Lorem ipsum if needed here",
      ctaText: "CTA here",
      href: "/locations",
    },
    {
      id: "contact-us",
      icon: "headphones",
      title: "Contact us",
      description: "Lorem ipsum if needed here",
      ctaText: "CTA here",
      href: "/contact",
    },
  ],
};
```

Both cards' `description` ("Lorem ipsum if needed here") and `ctaText` ("CTA here") are literal placeholder copy in the source screenshot — transcribed as-is per this session's established convention; swap in real content before shipping.

---

## 6. Styling, Layout & Design Tokens

### Section / Container
```css
.section {
  width: 100%;
  background: var(--gradient-dark-navy);
  padding-block: 4rem; /* matches the other dark CTA sections built this session */
}

@media (width < 768px) {
  .section {
    padding-block: 2.5rem;
  }
}

.container {
  width: 100%;
  max-width: var(--container-max-w, 1200px);
  margin: 0 auto;
  padding-inline: var(--container-gutter, 2.5rem);
}
```
`--gradient-dark-navy` (`135deg, #010E23 → #01375A`, already used by `MediaCardGrid`/`OfferCardRow`) is used here rather than `SwitchSupport`'s custom one-off gradient, since no exact gradient value was given for this component and this is the closer-fitting existing dark-section token. **Open question**: confirm against Figma whether this should instead match `SwitchSupport`'s literal `138.18deg` gradient for visual consistency between the two dark sections on the same page.

### Two-Column Layout
```css
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (width >= 1024px) {
  .layout {
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 3rem; /* assumption — not dimensioned in the screenshot */
  }
}
```
`1024px` and the equal `1fr 1fr` split are assumed from `SideBySide`'s existing asymmetric-layout precedent, since the screenshot doesn't give an exact ratio (visually the text column looks slightly narrower than half, but not by enough to justify inventing a specific fraction without a measurement).

### Text Column
```css
.textCol {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-md);
  min-width: 0; /* grid item — prevents the min-width:auto overflow bug fixed repeatedly elsewhere this session */
}

.heading {
  color: var(--color-text-inverted);
  margin: 0;
}

.description {
  margin: 0;
}
```

### Cards Column
```css
.cardsCol {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.375rem; /* 22px — the gap value standardized across this entire session */
  width: 100%;
}

@media (width < 480px) {
  .cardsCol {
    grid-template-columns: 1fr; /* assumption — stack the 2 cards on very narrow phones rather than cramming 2 columns */
  }
}
```

---

## 7. Colocated Directory Structure

```
src/components/organisms/split-content-cta/
├── SplitContentCta.tsx
├── SplitContentCta.module.css
├── splitContentCtaData.ts
├── SplitContentCta.test.tsx
└── index.ts
```

---

## 8. Open Questions for Design / Confirmation

1. **Gradient choice** (Section 6) — used the existing `--gradient-dark-navy` token rather than inventing/reusing `SwitchSupport`'s literal one-off gradient; confirm which is correct for visual consistency between the two dark sections.
2. **Column ratio and gap** (`1fr 1fr`, `3rem` gap, `1024px` breakpoint) are assumptions from `SideBySide`'s precedent — not dimensioned in the screenshot.
3. **`map-pin` icon** must be added to the shared icon registry (Lucide already ships `MapPin`; no design work needed, just a registry addition), following the exact pattern used for `plus`/`minus` earlier this session.
4. Both cards' body copy and CTA text are literal placeholders in the source screenshot — real copy needed before shipping.

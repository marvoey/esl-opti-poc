# Component Specification: Accordion Card Grid (`<AccordionCardGrid>`)

> **Classification**: Organism Component
> **Target Directory**: `src/components/organisms/accordion-card-grid/`
> **Status**: Spec Ready for Implementation
> **Reference**: attached screenshot ("APY vs. APR" grid, 6 cards — 1 expanded, 2 hovered, 3 default)
> **Reuses**: `FaqStates`' header typography contract and Plus/Minus icons (`src/components/atoms/icons`), the now-standard `.container`/grid conventions used across this codebase
> **Deliberately differs from `FaqStates`**: the whole card gets a hover treatment (fill + border color), not just the icon — see Section 5.

---

## 1. Overview

A glossary-style section: a full-width header row (eyebrow + h2 + description), followed by a grid of independently-expandable term cards — each a small accordion in its own right (click to reveal a definition), arranged in a multi-column grid rather than a single stacked list like `<FaqStates>`.

```
┌────────────────────────────────────────────────────────────────┐
│ container (max-width: 1200px, centered)                        │
│  EYEBROW (accent, uppercase)          ← 100% width row         │
│  Heading h2 (#00395D)                                            │
│  Description (secondary)                                        │
│                                                                    │
│  ┌───────────────────────┐   ┌───────────────────────┐          │
│  │ APY vs. APR        −  │   │ Overdraft           +  │ default │
│  │ APY is what your money│   └───────────────────────┘          │
│  │ can earn in a year,   │                                      │
│  │ incl. compounding.    │                                      │
│  │ APR is the yearly cost│                                      │
│  │ of borrowing.         │                                      │
│  └───────────────────────┘  expanded: default border/bg,        │
│                              icon swaps to Minus, answer shown   │
│  ┌───────────────────────┐   ┌───────────────────────┐          │
│  │ Membership Share    +  │   │ Courtesy Pay        +  │ default │
│  └───────────────────────┘   └───────────────────────┘          │
│   ↑ hover: mint fill + teal border, icon color unchanged         │
│  ┌───────────────────────┐   ┌───────────────────────┐          │
│  │ Owners' Dividend    +  │   │ ATM Fee Rebate      +  │ hover → │
│  └───────────────────────┘   └───────────────────────┘  mint    │
└────────────────────────────────────────────────────────────────┘

2 columns, not 3 — confirmed by the screenshot (6 cards = 3 rows × 2
columns). Mobile: collapses to 1 column, matching every other card
grid in this codebase.
```

---

## 2. Component Composition Contract

| Layer | Atom Used | Purpose |
| :--- | :--- | :--- |
| **Header eyebrow** | `<Text variant="eyebrow" color="accent">` | `#00A3A3` — **identical typography/color contract to `FaqStates`' header eyebrow** |
| **Header heading** | `<Heading level="h2">` | `#00395D` via `--color-text-primary` (default) — same as `FaqStates` |
| **Header description** | `<Text variant="body" color="secondary">` | `#4E5059` — same `body` size as `FaqStates`' description (not `body-lg`), per the explicit "same as FaqStates" instruction |
| **Card trigger** | `<button aria-expanded aria-controls>` wrapping `<Text variant="button">` + plus/minus icon | One per term; toggles that card's definition independently of the others |
| **Card panel** | `<div aria-labelledby>` wrapping `<Text variant="body" color="secondary">` | Definition copy, revealed only when its card is expanded |
| **Expand/collapse icon** | `<Icon name="plus" />` / `<Icon name="minus" />` | Already exists — added to the icon registry for `FaqStates` in this same codebase; reused as-is, no new icon work needed. **Unlike `FaqStates`, the icon's color never changes** — confirmed by the screenshot (it stays `--color-accent` in the collapsed, expanded, and hover states alike). The hover feedback lives on the card itself instead (Section 5). |

Unlike `<FaqStates>`, there is **no "single expand" constraint** — cards are spatially independent (a 2-column grid, not a stacked list), so each one's expanded/collapsed state is tracked and toggled on its own with no accordion-style "closing the others" behavior.

---

## 3. TypeScript Domain & Component Interface

```typescript
import { type HeadingLevel } from "@/components/atoms/heading/Heading";

export interface AccordionCardItem {
  id: string;
  term: string;
  definition: string;
}

export interface AccordionCardGridProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel; // default "h2"
  description?: string;
  items: AccordionCardItem[];
  className?: string;
}
```

`AccordionCardGrid` is a client component (`"use client"`) — it owns a `Set<string>` of expanded item ids via `useState`, exactly like `FaqStates`, just without the single-expand collapse-others logic.

---

## 4. Accessibility (WAI-ARIA Disclosure Pattern)

Identical contract to `<FaqStates>`, applied per-card instead of per-row:

- Each trigger is a real `<button type="button">` inside an `<h3>` heading wrapper.
- `aria-expanded="true"|"false"` on the trigger; `aria-controls` points to the panel's `id`; the panel has `aria-labelledby` pointing back.
- The panel stays in the DOM, its visibility driven by CSS (grid-rows technique), with `aria-hidden={!isExpanded}` toggled to keep collapsed definitions out of the accessibility tree.
- The plus/× icon is `aria-hidden="true"` — state is communicated via `aria-expanded`, not icon shape.
- Focus-visible ring: `2px solid var(--color-focus-ring)`, `outline-offset: 3px`.
- Keyboard: native `<button>` `Enter`/`Space` toggling; normal `Tab` order between cards (no roving tabindex — this is a disclosure grid, not a tab list).

---

## 5. States (per card — deliberately NOT the same as `FaqStates`)

This is the point of the request: `FaqStates`' hover feedback lives entirely on the icon (text and row background never change). Here, per the screenshot, the **card itself** is what responds — background fill and border color — while the icon and term text stay fixed in every state.

| State | Term text color | Icon | Card background | Card border | Definition panel |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Collapsed (default)** | `var(--color-text-primary)` (`#00395D`) | `+` (Plus), `color: var(--color-accent)` | `var(--color-surface-raised, #FFFFFF)` | `1px solid var(--color-card-stroke)` | `grid-template-rows: 0fr` |
| **Expanded** | unchanged | `−` (Minus) — swapped element, not rotated; color unchanged | unchanged (same white, confirmed by the screenshot — no special "active" card styling) | unchanged | `grid-template-rows: 1fr`, definition (`color: secondary`) revealed |
| **Hover** | unchanged | unchanged shape and color — confirmed by the screenshot (icon stays teal, not navy, in the hovered cards) | `var(--color-surface)` (mint-50 tint) | `var(--color-card-ring-hover)` (teal ring token, same one `IconContentCard` already uses for its own hover state) | unchanged |
| **Focus-visible** | unchanged | unchanged | unchanged | `outline: 2px solid var(--color-focus-ring); outline-offset: 3px;` on the trigger (in addition to, not instead of, the card's own border) | unchanged |

Motion: same `grid-template-rows: 0fr → 1fr` technique as `FaqStates` for the expand animation, plus a `background-color`/`border-color` transition on the card using the same `var(--duration-smart)`/`var(--ease-out-smart)` tokens. Same `prefers-reduced-motion` guard as `FaqStates`.

---

## 6. Styling, Layout & Design Tokens

### Section / Container
- `.section`: plain white background (`background-color: var(--color-bg, #FFFFFF);`).
- `.container`: standard pattern — `max-width: var(--container-max-w, 1200px); margin: 0 auto; padding-inline: var(--container-gutter, 2.5rem); padding-block: 4rem;` (`2.5rem` mobile).

### Header Row (100% width)
```css
.header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-xs);
  margin-bottom: 2.25rem; /* assumption — matches FeatureCardRow/ProductCardsRow header-to-grid spacing scale; not dimensioned by the request */
}
```

### Card Grid
```css
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.375rem; /* 22px — the gap value already standardized across every other card grid touched this session */
  width: 100%;
  margin-top: 1.375rem;
}

@media (width >= 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* confirmed by the screenshot — 2 columns, not 3 */
  }
}
```

### Card
```css
.card {
  background-color: var(--color-surface-raised, #FFFFFF);
  border: 1px solid var(--color-card-stroke);
  border-radius: 0.75rem; /* 12px — matches ProductCardsRow's card radius */
  min-width: 0; /* grid item — prevents the min-width:auto overflow bug fixed repeatedly elsewhere this session */
  transition: background-color var(--duration-smart) var(--ease-out-smart),
    border-color var(--duration-smart) var(--ease-out-smart);
}

.card:hover {
  background-color: var(--color-surface);
  border-color: var(--color-card-ring-hover);
}

.trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem; /* 16px, matching FaqStates' trigger padding */
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: var(--space-md);
}

.panelOuter {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--duration-smart) var(--ease-out-smart);
}

.panelOuter.expanded {
  grid-template-rows: 1fr;
}

.panelInner {
  overflow: hidden;
}

.definition {
  margin: 0;
  padding-inline: 1rem;
  padding-bottom: 1rem;
}
```

---

## 7. Content — transcribed verbatim where given, authored where not

The screenshot repeats one placeholder term ("APY vs. APR") across all 6 cards, but the expanded card reveals its real definition — transcribed verbatim as item 1 below. Items 2–6 are authored to fit the existing vocabulary already established on this page.

```typescript
export const DEFAULT_ACCORDION_CARD_GRID_PROPS: AccordionCardGridProps = {
  eyebrow: "In plain terms",
  title: "A few words, defined.",
  description:
    "Banking has its own vocabulary. Here's what a few terms on this page actually mean.",
  items: [
    {
      id: "term-apy-vs-apr",
      term: "APY vs. APR",
      definition:
        "APY is what your money can earn in a year, including compounding. APR is the yearly cost of borrowing.",
    },
    {
      id: "term-overdraft",
      term: "Overdraft",
      definition:
        "When a transaction is approved even though your account doesn't have enough to cover it.",
    },
    {
      id: "term-membership-share",
      term: "Membership Share",
      definition:
        "The one-time $1 deposit that makes you an owner of the credit union, not just a customer.",
    },
    {
      id: "term-owners-dividend",
      term: "Owners' Dividend",
      definition:
        "A member-only bonus dividend ESL may pay in years it performs well, on top of your regular dividend.",
    },
    {
      id: "term-courtesy-pay",
      term: "Courtesy Pay",
      definition:
        "One of ESL's overdraft options — covers a shortfall automatically instead of declining the transaction.",
    },
    {
      id: "term-atm-rebate",
      term: "ATM Fee Rebate",
      definition:
        "A refund of the fee another bank's ATM charges you, credited back to your account.",
    },
  ],
};
```

The eyebrow, heading, and description are transcribed verbatim from the original request; the "APY vs. APR" term and its definition are transcribed verbatim from the screenshot. Items 2–6 are authored — chosen to define vocabulary already used elsewhere on this same product-detail page (`ProductCardsRow`, `ProductCardsRowVariant2`, `FaqStates`) rather than invented independently, for narrative consistency. Confirm with design/content before shipping.

---

## 8. Colocated Directory Structure

```
src/components/organisms/accordion-card-grid/
├── AccordionCardGrid.tsx          # "use client" — owns per-card expanded state (Set<string>)
├── AccordionCardGrid.module.css
├── accordionCardGridData.ts
├── AccordionCardGrid.test.tsx
└── index.ts
```

---

## 9. Open Questions for Design / Confirmation

1. **Card border-radius, padding, and grid gap** are not precisely measurable from the screenshot alone — specified here as `0.75rem` (12px), `1rem` (16px), and `1.375rem` (22px) respectively, matching the values already standardized across every other card grid on this page. Confirm exact values if design has them dimensioned elsewhere.
2. **Independent expand (no single-expand/accordion-close-others behavior)** — the screenshot shows one card expanded while the rest remain in their own independent states (some hovered, some default), which confirms independence rather than a single-open accordion. No further confirmation needed.
3. Items 2–6 (Overdraft, Membership Share, Owners' Dividend, Courtesy Pay, ATM Fee Rebate) are authored, not transcribed — only "APY vs. APR" (item 1) is real content from the screenshot. Swap in real copy for the rest before shipping.

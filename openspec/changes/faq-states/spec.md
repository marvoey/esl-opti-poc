# Component Specification: FAQ States (`<FaqStates>`)

> **Classification**: Organism Component
> **Target Directory**: `src/components/organisms/faq-states/`
> **Status**: Spec Ready for Implementation
> **Reference**: attached screenshots ("Questions, answered simply." — one collapsed, one with item 1 expanded)
> **New dependency**: requires adding `"plus"` and `"minus"` icons to the shared icon registry (neither exists today)

---

## 1. Overview

A two-column section: a narrow (20%) text column on the left, and a wide (80%) accordion of FAQ items on the right. Named "FAQ States" because the accordion's interaction states (collapsed, expanded, hover, keyboard focus) are the core of this spec.

```
┌──────────────────────────────────────────────────────────────────────┐
│ container (max-width: 1200px, centered)                              │
│  ┌────────────┐  ┌──────────────────────────────────────────────┐    │
│  │ 20%        │  │ 80%                                           │    │
│  │ EYEBROW    │  │ Who can open an ESL checking account?      −  │    │
│  │ (accent)   │  │ If you live, work, worship, or attend school  │    │
│  │            │  │ in our region, you're eligible to join – and  │    │
│  │ Heading h2 │  │ opening takes just a $1 membership share.     │    │
│  │ (2 lines)  │  │ ──────────────────────────────────────────── │    │
│  │            │  │ Who can open an ESL checking account?      +  │    │
│  │ Description│  │ ──────────────────────────────────────────── │    │
│  │ (secondary)│  │ Who can open an ESL checking account?      +  │    │
│  │            │  │ ──────────────────────────────────────────── │    │
│  │ More       │  │ Who can open an ESL checking account?      +  │    │
│  │ questions? │  │ ──────────────────────────────────────────── │    │
│  │ Go to Help │  │                                                │    │
│  │ Center →   │  │                                                │    │
│  └────────────┘  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘

Mobile (< 1024px): stacks to a single column — text block, then the
accordion below it, full width — matching the responsive convention
already used by <SideBySide> for its own asymmetric two-column layout.
```

**Note on the reference screenshots**: two screenshots were provided — one with all 4 items collapsed, one with the first item expanded. All 4 rows share the identical placeholder question ("Who can open an ESL checking account?"); only item 1 has real, visible answer copy (transcribed in Section 7). This is a Figma mock showing the row pattern repeated with one item demonstrating the expanded state, not 4 distinct final questions. Section 7 below transcribes the left column and item 1's Q&A verbatim, and proposes distinct, realistic questions for the remaining items (confirm with design before shipping).

---

## 2. Component Composition Contract

| Layer | Atom Used | Purpose |
| :--- | :--- | :--- |
| **Left column eyebrow** | `<Text variant="eyebrow" color="accent">` | `#00A3A3`, "COMMON QUESTIONS" |
| **Left column heading** | `<Heading level="h2">` | `#00395D` via `--color-text-primary` (default), "Questions, answered simply." |
| **Left column description** | `<Text variant="body" color="secondary">` | `#4E5059`, "A few things people ask before opening — ask us anything else, anytime." (screenshot's description reads at body size, not body-lg, given its visibly smaller/lighter treatment vs. `ProductCardsRowVariant2`'s description — confirm against Figma type spec) |
| **"More questions" link row** | `<Text variant="body-sm" color="secondary">` + `<TextLink href="..." variant="dark" weight="bold">` + `<ArrowRightIcon>` | "More questions? **Go to Help Center →**" — `TextLink` (`src/components/atoms/link/TextLink.tsx`) has no built-in arrow, so the arrow icon is added manually alongside it, the same way `IconContentCard`'s CTA row does it |
| **Accordion item trigger** | `<button aria-expanded aria-controls>` wrapping `<Text variant="button">` + plus/minus icon | One per FAQ entry; toggles that entry's panel |
| **Accordion item panel** | `<div role="region" aria-labelledby>` wrapping `<Text variant="body" color="secondary">` | Answer copy, only revealed when its item is expanded |
| **Expand/collapse icon** | New `<Icon name="plus" />` when collapsed, swapped for `<Icon name="minus" />` when expanded | **Neither exists in `src/components/atoms/icons/index.tsx` today** — confirmed from the expanded-state screenshot: the icon swaps to a plain horizontal "−", not a 45°-rotated "+". Add Lucide's `Plus` and `Minus` to the `IconName` union and `iconRegistry`, plus tree-shakeable `PlusIcon`/`MinusIcon` exports, following the exact pattern of the other 18 icons already in that file. |

No existing accordion/disclosure/FAQ component exists anywhere in this codebase (verified) — this is a new pattern, not a refactor of an existing one.

---

## 3. TypeScript Domain & Component Interface

```typescript
import { type HeadingLevel } from "@/components/atoms/heading/Heading";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqStatesProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel; // default "h2"
  description?: string;
  /** "More questions?" plain-text lead-in before the help link */
  helpLinkLeadIn?: string;
  helpLinkText?: string;
  helpLinkHref?: string;
  items: FaqItem[];
  /** id of the item expanded by default; omit for all-collapsed */
  defaultExpandedId?: string;
  /** true = only one item open at a time (accordion behavior); false = independent toggles */
  singleExpand?: boolean; // default true
  className?: string;
}
```

`FaqStates` is a client component (`"use client"`) — it owns open/closed state per item via `useState`.

---

## 4. Accessibility (WAI-ARIA Disclosure / Accordion Pattern)

Follows the [WAI-ARIA Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/):

- Each trigger is a real `<button type="button">` (not a `<div>` with a click handler), inside a heading-level wrapper (`<h3>`) per WAI-ARIA guidance — `<h3 class="...heading"><button aria-expanded=".." aria-controls="faq-panel-{id}" id="faq-trigger-{id}">...</button></h3>`.
- `aria-expanded="true" | "false"` on the trigger reflects state.
- `aria-controls` on the trigger points to the panel's `id`; the panel has `aria-labelledby` pointing back to the trigger's `id`.
- The panel stays in the DOM with its collapsed/expanded state driven by CSS (grid-rows technique below), not unmount/remount, so screen reader users don't lose place.
- Keyboard: `Enter`/`Space` on a focused trigger toggles it (native `<button>` behavior — no custom key handling needed). `Tab`/`Shift+Tab` moves between triggers normally (no roving tabindex required — accordions, unlike tabs, don't need one).
- The plus/× icon is `aria-hidden="true"` — the state is already communicated via `aria-expanded`, not the icon's shape.
- Focus-visible ring: `2px solid var(--color-focus-ring)`, `outline-offset: 3px`, matching every other interactive element in this codebase (`TabbedIconCards`, `CircleCheck`-based cards, etc.).

---

## 5. States (the core of this spec)

| State | Question text color | Icon | Row bottom border | Answer panel |
| :--- | :--- | :--- | :--- | :--- |
| **Collapsed (default)** | `var(--color-text-primary)` (`#00395D`), `<Text variant="button">` weight | `+` (Plus), `color: var(--color-accent)` | `border-bottom: 1px solid var(--color-border-subtle)` | `grid-template-rows: 0fr` (collapsed) |
| **Expanded** | `var(--color-text-primary)` (`#00395D`) — **unchanged from collapsed**, confirmed by the expanded-state screenshot (the question does not turn teal) | `−` (Minus) — swapped element, not a rotated Plus | unchanged | `grid-template-rows: 1fr`, answer text (`color: secondary`) revealed below the question |
| **Hover** (mouse only, `:hover`) — *not shown in either screenshot; the following is a conventional assumption, not confirmed* | `var(--color-accent)` (`#00A3A3`) | unchanged shape, unchanged color (already accent) | unchanged | unchanged |
| **Focus-visible** (keyboard) | unchanged from current collapsed/expanded color | unchanged | `outline: 2px solid var(--color-focus-ring); outline-offset: 3px;` on the trigger button | unchanged |

Motion: expand/collapse animates via the CSS grid-rows trick (`grid-template-rows: 0fr` → `1fr` on a wrapper, with the actual content inside an `overflow: hidden` child) rather than `height: auto`, so it's animatable without measuring pixel heights in JS. Duration/easing: `var(--duration-smart)` / `var(--ease-out-smart)`, matching `TabbedIconCards`' panel transition. The Plus↔Minus icon swap can crossfade with the same tokens (or swap instantly — a plain swap is visually simpler and defensible given neither screenshot shows an in-between transition frame). Under `@media (prefers-reduced-motion: reduce)`, all transitions/animations become instant (`transition: none`), matching the `TabbedIconCards` precedent.

---

## 6. Styling, Layout & Design Tokens

### Section / Container
- `.section`: plain white background (`background-color: var(--color-bg, #FFFFFF);`), matching `ProductCardsRowVariant2`/`KeyFactsRow`.
- `.container`: the now-standard pattern — `max-width: var(--container-max-w, 1200px); margin: 0 auto; padding-inline: var(--container-gutter, 2.5rem); padding-block: 4rem;` (`2.5rem` mobile via `@media (width < 768px)`).

### Two-Column Grid
```css
.layout {
  display: grid;
  grid-template-columns: 1fr; /* stacked mobile */
  gap: 2rem;
}

@media (width >= 1024px) {
  .layout {
    grid-template-columns: 1fr 4fr; /* 20% / 80% */
    gap: 3rem; /* assumption — not dimensioned in the screenshot; matches SideBySide's editorial column-gap scale */
  }
}
```
- **Left column** (`.textCol`): `display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-xs);` plus a bit more room (`margin-top: var(--space-md)`) before the "More questions" link row, matching the visible gap in the screenshot between the description and the link.
- **Right column** (`.accordion`): `display: flex; flex-direction: column; width: 100%;` — wraps the FAQ item list.

### "More Questions" Link Row
- `.helpLink`: `display: inline-flex; align-items: center; gap: var(--space-3xs); flex-wrap: wrap;`
- Lead-in text (`<Text variant="body-sm" color="secondary">`) and the bold `<TextLink weight="bold">` sit inline; the arrow icon (`ArrowRightIcon`, size 16) follows the link text with a small gap, same composition as `IconContentCard`'s CTA row.

### Accordion Item
- `.item`: `border-bottom: 1px solid var(--color-border-subtle);` (last item: `border-bottom: none`).
- `.trigger`: full-width `<button>`, `display: flex; align-items: center; justify-content: space-between; width: 100%; padding-block: var(--space-md); background: transparent; border: none; cursor: pointer; text-align: left; gap: var(--space-md); transition: color var(--duration-smart) var(--ease-out-smart);`
- `.icon`: `flex-shrink: 0; color: var(--color-accent);` — renders `<PlusIcon>` or `<MinusIcon>` depending on `aria-expanded`, not a single rotated element.
- `.panelOuter` (the `grid-template-rows: 0fr → 1fr` wrapper): `display: grid; transition: grid-template-rows var(--duration-smart) var(--ease-out-smart);`
- `.panelInner` (the `overflow: hidden` child holding the answer): `overflow: hidden;`
- `.answer`: `<Text variant="body" color="secondary">`, `padding-bottom: var(--space-lg);` (24px breathing room before the next item's border).

---

## 7. Content

### Left column — transcribed verbatim from the screenshot
- Eyebrow: `"COMMON QUESTIONS"`
- Heading: `"Questions, answered simply."`
- Description: `"A few things people ask before opening — ask us anything else, anytime."`
- Help link row: lead-in `"More questions? "`, link text `"Go to Help Center"`, trailing arrow.

### Accordion items — item 1 transcribed verbatim (its answer is visible in the expanded-state screenshot); items 2–4 proposed (confirm with design before shipping, since the screenshot repeats the same placeholder question for them)

```typescript
export const DEFAULT_FAQ_STATES_PROPS: FaqStatesProps = {
  eyebrow: "COMMON QUESTIONS",
  title: "Questions, answered simply.",
  description:
    "A few things people ask before opening — ask us anything else, anytime.",
  helpLinkLeadIn: "More questions?",
  helpLinkText: "Go to Help Center",
  helpLinkHref: "/help",
  items: [
    {
      id: "faq-who-can-open",
      question: "Who can open an ESL checking account?",
      answer:
        "If you live, work, worship, or attend school in our region, you're eligible to join – and opening takes just a $1 membership share.",
    },
    {
      id: "faq-fee",
      question: "Is there a monthly fee for Premier Checking?",
      answer:
        "No fee, as long as your average monthly balance stays at $1,000 or more. Dip below that and a $10 fee applies for the month.",
    },
    {
      id: "faq-dividend",
      question: "How does the dividend work?",
      answer:
        "Premier Checking earns a competitive, variable dividend, compounded monthly — plus the member-only Owners' Dividend in years ESL performs well.",
    },
    {
      id: "faq-overdraft",
      question: "What happens if I overdraft?",
      answer:
        "A few simple ways to cover the unexpected — Cash Reserve, CheckOK, and ESL Courtesy Pay†.",
    },
  ],
};
```

---

## 8. Colocated Directory Structure

```
src/components/organisms/faq-states/
├── FaqStates.tsx           # "use client" — owns per-item expanded state
├── FaqStates.module.css
├── faqStatesData.ts
├── FaqStates.test.tsx
└── index.ts
```

---

## 9. Open Questions for Design / Confirmation

1. **Description typography** — screenshot's description reads smaller/lighter than `ProductCardsRowVariant2`'s `body-lg` description; specified here as plain `body` size. Confirm against the Figma type spec.
2. **20/80 column gap** (`3rem`) and the **1024px stacking breakpoint** are assumptions — matched to `SideBySide`'s existing asymmetric two-column precedent since neither was dimensioned in the screenshot.
3. **`singleExpand` default (`true`)** — assumed classic accordion behavior (opening one item closes any other open item). Confirm if independent multi-open toggles are wanted instead.
4. The **`plus` and `minus` icons must be added** to `src/components/atoms/icons/index.tsx` (Lucide already ships both; no design work needed, just a registry addition) before this component can be implemented.
5. Items 2–4 in the screenshots all show identical placeholder text with no visible answer — those 3 questions in Section 7 are authored to fit the existing Premier Checking narrative on this page rather than transcribed from real content. Item 1's Q&A is a verbatim transcription. Swap in real FAQ copy for items 2–4 before shipping.
6. The hover state's teal text color (Section 5) is a conventional assumption — neither screenshot shows a `:hover` frame. Confirm before implementation.

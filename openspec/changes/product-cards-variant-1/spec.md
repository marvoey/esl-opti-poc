# Component Specification: Product Cards Variant 1 (`<ProductCardsRow>`)

> **Classification**: Organism Component
> **Target Directory**: `src/components/organisms/product-cards-row/`
> **Status**: Spec Ready for Implementation
> **Reference**: "Is this right for you?" fit-check section (see attached screenshot)

---

## 1. Overview

A section that presents a header (eyebrow + h2 + body copy) followed by a 2-column grid of small fact cards, each pairing a check icon with a two-line text block (bold statement + supporting description).

```
┌──────────────────────────────────────────────────────────────┐
│ Section background: #F7F9FB                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ container                                               │  │
│  │  EYEBROW (accent, uppercase)                            │  │
│  │  Heading h2 (#00395D)                                   │  │
│  │  Description (Body Large)                               │  │
│  │                                                          │  │
│  │  ┌─────────────────────┐  22px  ┌─────────────────────┐ │  │
│  │  │ (icon) Bold line     │  gap   │ (icon) Bold line     │ │  │
│  │  │        Regular line  │        │        Regular line  │ │  │
│  │  └─────────────────────┘        └─────────────────────┘ │  │
│  │            22px row gap                                 │  │
│  │  ┌─────────────────────┐        ┌─────────────────────┐ │  │
│  │  │ (icon) Bold line     │        │ (icon) Bold line     │ │  │
│  │  │        Regular line  │        │        Regular line  │ │  │
│  │  └─────────────────────┘        └─────────────────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Component Composition Contract

Composes existing atoms, following the pattern established by `<FeatureCardRow>`:

| Layer | Atom Used | Purpose |
| :--- | :--- | :--- |
| **Eyebrow** | `<Text variant="eyebrow" color="accent">` | `#00A3A3` via `--color-accent` |
| **Heading** | `<Heading level="h2">` | `#00395D` via `--color-text-primary` (default, no override needed) |
| **Description** | `<Text variant="body-lg">` | Body Large typography (mobile: 18px/27px, fluid to 20px desktop via `--font-size-body-lg`) |
| **Card Icon** | `<CircleCheck backgroundColor="var(--color-card-icon-badge-bg)" tickColor="var(--color-navy-900)" />` | Mint badge background (`--color-card-icon-badge-bg` → `--color-surface` → `--color-mint-50` = `#ECFBF8`) with navy check (`#00395D`) — an inverted color pairing of `CircleCheck`'s defaults (default: navy circle / turquoise check) |
| **Card Bold Line** | `<Text variant="body" as="p" weight="bold">` | `#00395D` via `--color-text-primary` |
| **Card Regular Line** | `<Text variant="body" as="p">` | `#4E5059` via `--color-text-secondary` (`--color-slate-600`) |

`CircleCheck` (`src/components/atoms/circle-check/CircleCheck.tsx`) already accepts `backgroundColor`/`tickColor` props, so this variant requires no new atom — only different prop values than its default usage.

---

## 3. TypeScript Domain & Component Interface

```typescript
import { type HeadingLevel } from "@/components/atoms/heading/Heading";

export interface ProductCardItem {
  id?: string;
  title: string;       // bold line, e.g. "You usually keep $1,000 or more in checking"
  description: string; // regular line, e.g. "Lorem ipsum ..."
}

export interface ProductCardsRowProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  headingLevel?: HeadingLevel; // default "h2"
  description?: string;
  items: ProductCardItem[]; // expects 4 items for the 2x2 layout
  className?: string;
}
```

---

## 4. Styling, Layout & Design Tokens

### Section / Container
- `.section`: `background-color: #F7F9FB;` full width (matches the existing `FeatureCardRow.module.css` pattern — no dedicated surface token exists for this background yet).
- `.container`: `max-width: var(--container-max-w, 1280px); margin: 0 auto; padding-inline: var(--container-gutter, 2.5rem); padding-block: 4rem;` (2.5rem mobile, `@media (width < 768px)`).

### Header
- `.header`: `display: flex; flex-direction: column; gap: var(--space-xs);` (8px).
- `.eyebrow`: `color: var(--color-accent);` (`#00A3A3`).
- `.sectionTitle`: `color: var(--color-text-primary);` (`#00395D`, inherited default — no override strictly required).
- `.description`: uses `<Text variant="body-lg">` untouched (no color override specified; inherits `--color-text-primary`).

### Cards Grid
- `.grid`:
  ```css
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 50% / 50% */
  column-gap: 1.375rem; /* 22px */
  row-gap: 1.375rem;    /* 22px */
  ```
- Stacks to 1 column below `768px` (`grid-template-columns: 1fr`), switching to `repeat(2, 1fr)` at `@media (width >= 768px)`, matching the responsive convention used across every other organism in this codebase.

### Card
- `.card`:
  ```css
  padding-inline: var(--space-xs); /* 8px */
  padding-block: var(--space-md);  /* 16px */
  background-color: var(--color-surface-raised, #FFFFFF);
  border-radius: 0.75rem; /* 12px */
  display: flex;
  align-items: flex-start;
  gap: var(--space-xs); /* 8px — icon to text */
  ```
- `.card` also needs `min-width: 0;` — as a CSS Grid item it defaults to `min-width: auto`, letting its content's intrinsic width push the track (and therefore the whole `.container`) past its `max-width`.
- `.icon`: `flex-shrink: 0;` (renders `<CircleCheck size={28} />` per the reference SVG).
- `.textGroup`: `display: flex; flex-direction: column; gap: var(--space-xs); min-width: 0;` (8px between the bold and regular lines; `min-width: 0` is needed for the same reason as `.card` — it's a flex item that would otherwise refuse to shrink below its text's intrinsic width).
- `.cardTitle` (bold line): `color: var(--color-text-primary); font-weight: var(--font-weight-bold); margin: 0;`
- `.cardDescription` (regular line): `color: var(--color-text-secondary); font-weight: var(--font-weight-regular); margin: 0;`

---

## 5. Colocated Directory Structure

```
src/components/organisms/product-cards-row/
├── ProductCardsRow.tsx
├── ProductCardsRow.module.css
├── ProductCardsRow.test.tsx
└── index.ts
```

---

## 6. Open Questions for Design

1. Confirm `#F7F9FB` should stay a raw hex (matching the existing `FeatureCardRow` precedent) or be promoted to a `--color-surface-*` token now that a second component uses it.

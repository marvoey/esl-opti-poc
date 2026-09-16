# Component Specification: Switch Support (`<SwitchSupport>`)

> **Classification**: Organism Component
> **Target Directory**: `src/components/organisms/switch-support/`
> **Status**: Spec Ready for Implementation
> **Reference**: attached screenshot ("Switching is simpler than it sounds.")
> **Reuses**: the existing `ProcessCard` atom (`src/components/atoms/card/process-card/`) — needs one new variant, not a new component. See Section 2.

---

## 1. Overview

A full-bleed, dark navy-gradient section with three stacked rows: a centered header (heading + body copy), a 3-column grid of numbered process-step cards, and a centered CTA row (a white pill button + a small checkmark link below it).

```
┌──────────────────────────────────────────────────────────────────────┐
│ background: linear-gradient(138.18deg, #00395D 0%, #001B3D 100%)     │
│  padding-block: 4rem (64px)                                          │
│                                                                        │
│         Switching is simpler than it sounds.        ← h2, white      │
│           Easy Lorem ipsum / what you need:          ← body-lg,      │
│                                                          muted white  │
│                          ↕ 32px / 16px mobile                        │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐     │
│  │ ① A photo ID      │ │ ② Your SSN        │ │ ③ $1 to open      │     │
│  │   A driver's...   │ │   And your...     │ │   Your opening... │     │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘     │
│                          ↕ 32px / 16px mobile                        │
│              ┌─────────────────────────────────────┐                 │
│              │  Open a Premier Checking account →  │  ← white pill  │
│              └─────────────────────────────────────┘                 │
│                          ↕ 32px                                      │
│                    ✓ Lorem ipsum if needed           ← small link    │
└──────────────────────────────────────────────────────────────────────┘

Text alignment: centered on desktop; left-aligned on tablet/mobile.
CTA row: centered on desktop/tablet; the button goes full-width
("block") on mobile.
```

**Content discrepancy to flag**: the request's text says the body copy under the heading should also read "Switching is simpler than it sounds." (identical to the heading), but the screenshot shows different text there — "Easy Lorem ipsum / what you need:". Section 7 transcribes the screenshot's actual visible text; confirm which is correct before shipping.

---

## 2. Component Composition Contract

| Layer | Atom Used | Purpose |
| :--- | :--- | :--- |
| **Heading** | `<Heading level="h2">` with `color: var(--color-text-inverted)` override | White, matches the screenshot |
| **Body copy** | `<Text variant="body-lg" color="inverted-muted">` | Slightly dimmer than pure white, matching the screenshot's subtext |
| **Step cards (×3)** | `<ProcessCard>` (existing atom, `src/components/atoms/card/process-card/ProcessCard.tsx`) | Already implements exactly this shape: numbered circle badge + bold title + description, in a bordered box |
| **CTA button** | `<Button variant="secondary">` | The existing "white pill on dark background" variant — already used this way by `SideBySide` (`variant={isDark ? "secondary" : "primary"}`); no change needed |
| **Caption link** | `<TextLink variant="light" underline="none">` + `<Icon name="check" />` | `TextLink`'s `"light"` variant is already built for white/turquoise text on dark backgrounds |

### `ProcessCard` needs one new variant: `"inverse"`

Read `src/components/atoms/card/process-card/ProcessCard.tsx` and `.module.css` first. It currently supports two variants — `"mint"` (light surface, navy text) and `"neutral"` (opaque slate surface, white text) — neither matches the screenshot's look: a **transparent/bordered box directly on the gradient**, with a **teal badge + white bold title + dimmer muted-white description** (title and description are two different shades of white, which the atom doesn't currently support — see below).

**Required atom changes** (small, additive, doesn't change `mint`/`neutral` behavior):
1. Add `"inverse"` to `ProcessCardVariant`.
2. Add `className={styles.title}` and `className={styles.description}` to the two `<Text>` children in `ProcessCard.tsx` (they currently have no class, only a shared `color={textColor}` prop) — this lets each variant's CSS fully own both text colors, the same pattern `IconContentCard` already uses for its `default`/`inverse` split.
3. Change both `<Text>` children to `color="inherit"` and let CSS drive color per variant (`.mint .title`/`.mint .description`, `.neutral .title`/`.neutral .description` reproduce the current shared-color behavior exactly — this is a non-visual refactor for the existing two variants).
4. New CSS:
   ```css
   .inverse {
     background-color: transparent;
     border: 1.5px solid var(--color-border-inverse-subtle);
   }

   .inverse .badge {
     background-color: var(--color-accent);
     color: var(--color-text-inverted);
   }

   .inverse .title {
     color: var(--color-text-inverted);
   }

   .inverse .description {
     color: var(--color-text-inverted-muted);
   }

   .inverse:hover {
     border-color: var(--color-turquoise-400);
     transform: translateY(-1px);
   }
   ```
   `--color-border-inverse-subtle` and `--color-text-inverted-muted` already exist as tokens (confirmed — used by `Footer` and `HeroCarousel`-adjacent components respectively). The teal badge color (`--color-accent`) is an assumption — the screenshot's badge could plausibly be `--color-turquoise-400` instead; confirm exact shade against Figma.
5. `ProcessCard`'s `.card` has `max-width: 588px` — not a problem for this 3-column grid at the container's `1200px` max-width (each column is well under 588px), so no change needed there, unlike the `IconContentCard` width refactor from earlier — flagged here only so it isn't mistaken for an oversight.

---

## 3. TypeScript Domain & Component Interface

```typescript
export interface SwitchSupportStep {
  id: string;
  step: number;
  title: string;
  description: string;
}

export interface SwitchSupportProps {
  id?: string;
  title?: string;
  description?: string;
  steps: SwitchSupportStep[];
  ctaLabel?: string;
  ctaHref?: string;
  linkLabel?: string;
  linkHref?: string;
  className?: string;
}
```

No `"use client"` needed — this component has no internal state (unlike `FaqStates`/`AccordionCardGrid`), it's a static composition of existing atoms.

---

## 4. Styling, Layout & Design Tokens

### Section / Background
```css
.section {
  width: 100%;
  background: linear-gradient(138.18deg, var(--color-navy-900) 0%, #001B3D 100%);
  padding-block: 4rem; /* 64px, as specified — same on mobile, not reduced like other sections */
}
```
No existing gradient token matches this exactly — `--gradient-dark-navy` (`135deg, #010E23 → #01375A`) is close but has a different angle and different end color. `--color-navy-900` (`#00395D`) exactly matches the requested start color, so that's used via token; `#001B3D` has no matching token and is kept literal, consistent with this codebase's existing precedent of literal one-off background values (e.g. `ProductCardsRow`'s `#F7F9FB`). **Open question**: should `#001B3D` be promoted to a new token (e.g. `--color-navy-1000`) now that a second gradient needs it, or left literal?

### Container
Standard pattern, matching every other section built this session:
```css
.container {
  width: 100%;
  max-width: var(--container-max-w, 1200px);
  margin: 0 auto;
  padding-inline: var(--container-gutter, 2.5rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem; /* 16px mobile row gap */
}

@media (width >= 768px) {
  .container {
    gap: 2rem; /* 32px desktop/tablet row gap, per spec */
  }
}
```
The 3 major rows (header block, card grid, CTA block) are the 3 children of this flex column, so the `gap` above directly implements the requested "32px gap between rows desktop / 16px mobile."

### Header Row
```css
.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* left-aligned: tablet & mobile default */
  text-align: left;
  gap: var(--space-xs);
  width: 100%;
}

.heading {
  color: var(--color-text-inverted);
  margin: 0;
}

.description {
  margin: 0;
}

@media (width >= 1024px) {
  .header {
    align-items: center;
    text-align: center;
  }
}
```
`1024px` is assumed as the desktop-vs-tablet breakpoint (matching `SideBySide`'s asymmetric-layout precedent) since the request says "centered on desktop, left aligned on tablet mobile" without giving an exact breakpoint number — confirm or adjust.

### Card Grid
```css
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem; /* assumption — inter-card gap wasn't specified, only inter-row gap was; matches this section's own mobile row-gap value for visual consistency */
  width: 100%;
}

@media (width >= 768px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.375rem; /* 22px — the standardized card-gap value used everywhere else this session */
  }
}
```

### CTA Row
```css
.ctaRow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem; /* 32px, as specified */
  width: 100%;
}

.button {
  width: 100%; /* "block on mobile" */
}

@media (width >= 768px) {
  .button {
    width: auto; /* natural pill width, centered — desktop & tablet */
  }
}

.link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3xs);
}
```

---

## 5. Content — transcribed verbatim from the screenshot

```typescript
export const DEFAULT_SWITCH_SUPPORT_PROPS: SwitchSupportProps = {
  title: "Switching is simpler than it sounds.",
  description: "Easy Lorem ipsum / what you need:",
  steps: [
    {
      id: "step-photo-id",
      step: 1,
      title: "A photo ID",
      description: "A driver's license, state ID, or passport.",
    },
    {
      id: "step-ssn",
      step: 2,
      title: "Your SSN",
      description: "And your date of birth and contact info.",
    },
    {
      id: "step-dollar",
      step: 3,
      title: "$1 to open",
      description: "Your opening deposit and membership share.",
    },
  ],
  ctaLabel: "Open a Premier Checking account",
  ctaHref: "/personal/checking/open",
  linkLabel: "Lorem ipsum if needed",
  linkHref: "/help",
};
```

The header `description` field and the caption `linkLabel` are both literal placeholder copy in the source screenshot ("Easy Lorem ipsum / what you need:", "Lorem ipsum if needed") — transcribed as-is per this session's established convention of preserving what's actually visible rather than inventing replacement copy; swap in real content before shipping.

---

## 6. Colocated Directory Structure

```
src/components/organisms/switch-support/
├── SwitchSupport.tsx
├── SwitchSupport.module.css
├── switchSupportData.ts
├── SwitchSupport.test.tsx
└── index.ts
```

---

## 7. Open Questions for Design / Confirmation

1. **Header body copy mismatch** (Section 1) — the request's own text and the screenshot disagree on what this line should say. Resolve before implementation.
2. **`ProcessCard`'s new `"inverse"` variant colors** (badge fill, border color) are best-fit assumptions using existing tokens — confirm exact values against Figma if available.
3. **`#001B3D`** has no matching design token — decide whether to add one or keep it literal (Section 4).
4. **Tablet/desktop breakpoint (`1024px`)** for the header's centered-vs-left-aligned switch is assumed from `SideBySide`'s precedent, not given explicitly.
5. **Inter-card gap** within the 3-column grid (`1.375rem` assumed) wasn't specified — only the gap *between* the three major rows was.

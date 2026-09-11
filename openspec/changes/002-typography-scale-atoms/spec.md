# Spec: Typography Scale Spec & Atom Components

## Objective
Implement reusable, accessible, polymorphic typography atom components (`<Display>`, `<Heading>`, `<Text>`, `<Eyebrow>`, `<Stat>`) matching the Desktop and Mobile design specifications and enforced against a 4px vertical rhythm grid.

## Tech Stack
* **Fonts**: Albert Sans (`--font-family-sans`, `--font-family-display`), League Spartan (`--font-family-eyebrow`)
* **Framework**: React 19 / Next.js 16 Server Components
* **Styling**: CSS Modules + Global Design Tokens (`src/styles/tokens.css`)
* **Testing**: Vitest + React Testing Library + JSDOM

## Components Implemented
* `src/components/atoms/display/Display.tsx` (Weight 800, Size 40px-72px, LH 44px-76px, Track -0.4px)
* `src/components/atoms/heading/Heading.tsx` (Levels H1–H4, polymorphic tags, weights 700)
* `src/components/atoms/text/Text.tsx` (Variants: subhead, body-lg, body, body-sm, label, caption, micro)
* `src/components/atoms/eyebrow/Eyebrow.tsx` (League Spartan 700, Track 2.2px, uppercase, LH 20px)
* `src/components/atoms/stat/Stat.tsx` (Weight 700, Size 40px-60px, LH 44px-64px, Track -0.16px)

## 4px Vertical Rhythm Alignment
* Line-height values normalized to exact multiples of 4:
  - Display: 44px (Mobile) ➔ 76px (Desktop)
  - H1: 40px (Mobile) ➔ 60px (Desktop)
  - H2: 36px (Mobile) ➔ 48px (Desktop)
  - H3: 28px (Mobile) ➔ 36px (Desktop)
  - H4: 24px
  - Stat: 44px (Mobile) ➔ 64px (Desktop)
  - Eyebrow: 20px
  - Body Large / Label / Subhead: 28px / 32px

## Boundaries
* **Always**: Use CSS tokens for font sizes, line heights, and colors; maintain flat selectors (≤ 3 levels).
* **Never**: Use hardcoded px values directly in component CSS; use non-divisible line-heights.

## Success Criteria
* [x] All 5 typography atom components implemented with colocated `.module.css`.
* [x] Vitest suites created and passing for all atom components (`15 passed`).
* [x] Main text color `#00395D` active and rendering across typography elements.
* [x] Next.js production build (`npm run build`) succeeds with zero errors.

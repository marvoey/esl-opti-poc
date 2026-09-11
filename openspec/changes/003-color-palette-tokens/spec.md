# Spec: Consolidated 3-Tier Color System & Component Intent Tokens

## Objective
Establish an optimized, non-redundant 3-tier color token system consolidating design primitives, semantic system roles, and component-level intent mappings for multi-color atoms (`<Eyebrow>`, `<Button>`).

## Primitives Consolidations
* `#00395D` (Corporate Navy) ➔ Brand identity, primary text, dark backgrounds
* `#00A3A3` (Deep Teal) ➔ Primary interactive actions, Eyebrow accent
* `#68E0CC` (Vibrant Turquoise) ➔ Borders, strokes, bright highlights
* `#ECFBF8` (Mint Polar) ➔ Soft surface tint, card containers
* `#FFFFFF` (Pure White) ➔ Canvas, light cards, inverted text
* `#000000` (Pure Black) ➔ Shadows and deep contrast
* Alpha steps: 10%, 50%, 80% white + 20% teal (eliminating 11 ad-hoc Figma opacities).

## Component Intents
* **`<Eyebrow>`**: `brand` (`#00395D`), `accent` (`#00A3A3`), `vibrant` (`#68E0CC`), `inverted` (`#FFFFFF`).
* **`<Button>`**: `primary` (Navy/White), `accent` (Teal/White), `outline` (Turquoise border).

## Boundaries
* **Always**: Reference semantic and intent CSS custom properties; keep all button and card padding aligned to the 4px vertical grid.
* **Never**: Use hardcoded hex codes inside component CSS modules.

## Success Criteria
* [x] `src/styles/tokens.css` updated with consolidated 3-Tier color tokens.
* [x] `<Eyebrow>` updated with color prop and verified via Vitest tests.
* [x] `<Button>` atom implemented with 3 variants, 4px line-height, and tested via Vitest.
* [x] Contrast ratio verified against WCAG 2.1 AAA standards.
* [x] `npm test` and `npm run build` pass with 0 errors.

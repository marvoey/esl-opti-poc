# Change Specification: Interactive Navigation & Action Components

- **Change ID**: `005-interactive-components`
- **Status**: Implemented & Verified
- **Standards**: WCAG 2.2 AA (AAA contrast 7:1+), Lucide React Integration, 4px Rhythm Grid

---

## 1. Objectives

1. Replace custom SVG definitions with a scalable, typed **Lucide React** architecture:
   - Universal dispatcher `<Icon name="coins" size={20} />`.
   - Tree-shakeable atomic exports: `<UserIcon />`, `<ArrowRightIcon />`, `<CoinsIcon />`, `<HeadphonesIcon />`.
   - Full `currentColor` CSS inheritance across all themes and hover transitions.
2. Implement the new action and navigation patterns from Figma:
   - **`Simple Link`**: `<Button variant="link">` with zero border/bg and right arrow hover glide.
   - **`FilterChip`**: Selectable pill control with Default, Hover (Turquoise stroke), and Selected (Solid Navy) states (`aria-pressed`).
   - **`TabButton`**: Card tab with Lucide Coins icon, Default, Mint Polar hover, and Active Solid Navy states (`role="tab"`).
   - **`Badge`**: Taxonomy metadata pill with `aqua` and `neutral` variants.
   - **`QuickLink`**: Action row card with left thumbnail image placeholder, label, and trailing arrow with hover elevation.

---

## 2. Accessibility & Verification

- **Contrast**: All components achieve **WCAG AAA** (7.0:1+) contrast against their active backgrounds.
- **ARIA Semantics**: `aria-pressed` on FilterChip, `role="tab"` on TabButton, `aria-hidden="true"` on non-semantic icons.
- **Automated Tests**: 11 test suites and 35 unit tests passing in Vitest.
- **Build**: Statically compiled with Turbopack in Next.js 16 with zero errors.

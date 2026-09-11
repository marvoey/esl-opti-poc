# Change Specification: Reusable Button System (`<Button>`)

- **Change ID**: `004-button-system`
- **Status**: Implemented & Verified
- **Standards**: WCAG 2.2 AA (Exceeds AA, achieves AAA 7:1+), Pragmatic Hexagonal Architecture, Intrinsic Tokens

---

## 1. Objectives

1. Build an enterprise polymorphic button component (`<button>` or Next.js `<Link>`).
2. Implement exact Figma design tokens extracted from inspection:
   - Dynamic intrinsic width hugging (`width: fit-content`).
   - 4px vertical grid line-height and height floors (52px standard, 44px compact).
   - 8px/24px padding ($2\times 4\text{px}$ / $6\times 4\text{px}$).
   - 9999px pill border radius.
   - 300ms ease-out smart animate transition.
   - Elevation shadow: `0 4px 12px 0 rgba(0, 0, 0, 0.10)`.
3. Support zero-dependency SVG icon primitives (`<UserIcon />`, `<ArrowRightIcon />`) utilizing `currentColor` for synchronous hover inversion.
4. Support the complete Figma variant matrix:
   - `primary`: Navy fill (`#00395D`) -> Turquoise hover (`#68E0CC`)
   - `secondary`: Mint Polar fill (`#ECFBF8`) -> Turquoise hover (`#68E0CC`)
   - `outline`: Navy border (`#00395D`) -> Turquoise hover fill (`#68E0CC`)

---

## 2. Accessibility & Quality Gates (WCAG 2.2 AA)

- **SC 1.4.3 / 1.4.6 Contrast Minimum**: All default and hover combinations exceed 7.0:1 (AAA).
- **SC 2.4.11 Focus Appearance**: 2px solid teal outline with 3px offset for keyboard navigation.
- **SC 2.5.8 Target Size**: Exceeds the 24px minimum touch target size (52px / 44px min-height).
- **SC 1.4.4 Resize Text**: Fluid intrinsic layout allows 200% zoom without truncation.

---

## 3. Verification

- Vitest suite: 8 tests passing in `src/components/atoms/button/Button.test.tsx`.
- Turbopack production build: 0 errors.
- DevTools MCP live verification: computed styles match 52px height, 9999px radius, 8px 24px padding.

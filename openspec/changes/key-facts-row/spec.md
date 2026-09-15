# Component Specification: Key Facts Row (`<KeyFactsRow>`)

> **Classification**: Organism Component  
> **Target Directory**: `src/components/organisms/key-facts-row/`  
> **Associated Atoms**: `<BasicsTile>`, `<BasicsTileGrid>`, `<Heading>`, `<Text>`  
> **Target Placement**: Product Detail Page (`/product-detail`), mounted directly below `<SnipeCta />`  
> **Status**: Proposed Spec  
> **Design System Compliance**: Strict 3-Tier Tokens • Container Queries • Typography Composition Law • WCAG 2.2 AA Compliance  

---

## 1. Overview & Architectural Intent

The **Key Facts Row** (`<KeyFactsRow>`) is a high-density, structured summary organism designed to present essential product facts, account features, fee schedules, and rates in a clean, glanceable format.

It implements a two-row responsive layout:
1. **Row 1: Header**:
   - `<h3>` heading: `"Details at a glance"` colored `#00395D` (`var(--color-primary)`).
   - Optional subhead: Body typography colored `#4E5059` (`var(--color-text-secondary)`).
   - Strict `16px` margin-bottom spacing to the tile set.
2. **Row 2: Basics Tile Set (Variant 2 — "Value-First")**:
   - Displays a set of up to 7 data tiles (`BasicsTile`) arranged horizontally on desktop with vertical divider rules between adjacent tiles.
   - On mobile/tablet viewports, automatically transforms into a 2-column grid layout with interior crosshair divider borders (no outer border box).
   - Implements **Variant 2 ("Value-First")**:
     - **Top**: Stat / Rate Value in bold accent color (`#00A3A3` / `var(--color-accent)`).
     - **Middle**: Callout Label in bold deep navy (`#00395D` / `var(--color-primary)`).
     - **Bottom**: Descriptive detail in regular neutral gray (`#4E5059` / `var(--color-text-secondary)`).

---

## 2. Visual Design & Token Mapping

| UI Element | Design Property | Token / Value | Figma Reference |
| :--- | :--- | :--- | :--- |
| **Section Wrapper** | HTML Element | `<section aria-labelledby={headingId}>` | Structural Landmark |
| **Container** | Layout Width | `.container` (`max-width: 1280px`, margin inline auto) | Layout Container |
| **Container Spacing** | Padding Block | `48px` (`3rem` / vertical rhythm grid) | Figma Spec |
| **Header Row** | Spacing Bottom | `16px` (`var(--space-md)` / `1rem`) | Figma Spec |
| **Section Title** | Element / Typography | `<h3>` with `var(--font-size-h3)` (clamp 22px -> 28px) | Details at a glance |
| **Section Title Color** | Text Color | `#00395D` (`var(--color-primary)` / Deep Navy) | Figma Primary Navy |
| **Section Subhead** | Typography / Color | `body` (`16px` / `1rem`) / `#4E5059` (`var(--color-text-secondary)`) | Subhead text |
| **Tile Structure** | Variant | Variant 2: `order="value-first"` | 7 Basics Tile Set |
| **Tile Value** | Size & Color | `1.25rem` (`20px`), Bold, `#00A3A3` (`var(--color-accent)`) | Stat Callout ($0, $1, etc.) |
| **Tile Callout** | Size & Color | `0.875rem` (`14px`), Bold, `#00395D` (`var(--color-primary)`) | Feature Name |
| **Tile Description** | Size & Color | `0.875rem` (`14px`) / `caption`, `#4E5059` (`var(--color-text-secondary)`) | Quick Detail Copy |
| **Interior Dividers** | Border Stroke | `1px solid var(--color-border-card, #e2f0f8)` | Interior dividing lines |

---

## 3. Layout & Responsive Matrix

```
Desktop (≥ 860px / 1024px) — Horizontal Row:
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ Details at a glance                                                                        │
│ [Subhead copy if provided]                                                                 │
│ (16px gap)                                                                                 │
│ ┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬─────────────┐ │
│ │ $0           │ $1           │ 0.050%/0.05% │ 80           │ Free         │ Fully cov.. │ │
│ │ Monthly fee  │ Min to open  │ Dividend APY │ Free Checks  │ ATM Access   │ Overdraft   │ │
│ │ with $1k bal │ Quick desc   │ Quick desc   │ first order  │ 5 free /mo   │ Reserve...  │ │
│ └──────────────┴──────────────┴──────────────┴──────────────┴──────────────┴─────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────┘

Mobile (< 860px) — 2-Column Grid with Interior Crosshair Dividers:
┌──────────────────────────────────────────────┐
│ Details at a glance                          │
│                                              │
│ ┌──────────────────────┬───────────────────┐ │
│ │ $0                   │ $1                │ │
│ │ Monthly service fee  │ Minimum to open   │ │
│ │ with $1k bal..       │ Quick desc        │ │
│ ├──────────────────────┼───────────────────┤ │
│ │ 0.050% / 0.05%       │ 80                │ │
│ │ Dividend rate/APY    │ Free Checks       │ │
│ │ Quick desc           │ with first order  │ │
│ ├──────────────────────┼───────────────────┤ │
│ │ Free                 │ Fully covered     │ │
│ │ ATM Access           │ Overdraft options │ │
│ │ 5 free non-ESL/mo    │ Cash Reserve...   │ │
│ └──────────────────────┴───────────────────┘ │
└──────────────────────────────────────────────┘
```

### 3.1 Breakpoint Rules
- **Desktop (`min-width: 860px`)**:
  - Track displays as a single horizontal flex row (`display: flex; flex-direction: row;`).
  - Each tile expands equally (`flex: 1 1 0; min-width: 0;`).
  - Adjacent tiles have a `1px solid var(--color-border-card)` vertical divider on the right.
  - The final tile has `border-right: none`.
- **Mobile & Tablet (`max-width: 859px`)**:
  - Track displays as a 2-column grid (`display: grid; grid-template-columns: repeat(2, 1fr);`).
  - Odd-numbered tiles (`:nth-child(odd)`) have a vertical right border.
  - All tiles except the last row have a horizontal bottom border.
  - Interior cross borders only — no outer box borders.

---

## 4. Component Interface & TypeScript Types

```typescript
export interface KeyFactsTileItem {
  id?: string;
  value: string;
  callout: string;
  description: string;
}

export interface KeyFactsRowProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  tiles?: KeyFactsTileItem[];
  id?: string;
  className?: string;
}
```

### 4.1 Default Initial Dataset (Premier Checking)

```typescript
export const DEFAULT_KEY_FACTS_TILES: KeyFactsTileItem[] = [
  {
    id: "tile-monthly-fee",
    value: "$0",
    callout: "Monthly service fee",
    description: "with a $1,000 average monthly balance — otherwise $10",
  },
  {
    id: "tile-min-open",
    value: "$1",
    callout: "Minimum to open",
    description: "Descriptive quick content",
  },
  {
    id: "tile-dividend",
    value: "0.050% / 0.05%",
    callout: "Dividend rate/APY",
    description: "Descriptive quick content",
  },
  {
    id: "tile-free-checks",
    value: "80",
    callout: "Free Checks",
    description: "with first order",
  },
  {
    id: "tile-atm-access",
    value: "Free",
    callout: "ATM Access",
    description: "up to 5 free non-ESL withdrawals/mo, then $2.50",
  },
  {
    id: "tile-overdraft",
    value: "Fully covered",
    callout: "Overdraft options",
    description: "Cash Reserve, CheckOK & Courtesy Pay",
  },
  {
    id: "tile-digital-banking",
    value: "$0",
    callout: "Digital Banking",
    description: "Mobile check deposit & bill pay",
  },
];
```

---

## 5. Accessibility & WCAG 2.2 AA Compliance

1. **Semantic Landmark**:
   - Rendered within `<section aria-labelledby={headingId}>` to provide landmark navigation for assistive technologies.
2. **Heading Level**:
   - `<h3>` heading ensures correct logical outline when positioned under page/product `<H1>` and section `<H2>`.
3. **Contrast Verification**:
   - Title `#00395D` on `#FFFFFF`: **11.5:1** (Exceeds WCAG AAA requirement of 7:1).
   - Subhead `#4E5059` on `#FFFFFF`: **7.2:1** (Exceeds WCAG AAA requirement of 7:1).
   - Tile Value `#00A3A3` on `#FFFFFF`: **3.5:1** (Passes WCAG AA for large/bold text ≥ 18px).
   - Tile Callout `#00395D` on `#FFFFFF`: **11.5:1** (Exceeds WCAG AAA requirement of 7:1).
   - Tile Description `#4E5059` on `#FFFFFF`: **7.2:1** (Exceeds WCAG AAA requirement of 7:1).
4. **Layout Safety**:
   - Respects 4px vertical rhythm grid.
   - Text wrapping configured defensively to prevent horizontal overflow on narrow mobile screens (320px).

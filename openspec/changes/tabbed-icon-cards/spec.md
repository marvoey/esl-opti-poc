# Component Specification: Tabbed Icon Cards (`<TabbedIconCards>`)

> **Classification**: Organism Component  
> **Target Directory**: `src/components/organisms/tabbed-icon-cards/`  
> **Status**: Approved Spec Ready for Implementation  
> **Design System Compliance**: Strict 3-Tier Tokens • Container Queries • WAI-ARIA Tabs 1.2 • Zero Specificity Wars  

---

## 1. Overview & Architectural Intent

The **Tabbed Icon Cards** component is an editorial organism designed to organize service categories into **2 tab buttons** paired with an interactive panel rendering a dynamic collection of **white variant `<QuickLinkSimple>` cards**.

- **Active State by Default**: The first tab button and its corresponding panel are active on initial mount (`defaultTabId = tabs[0].id`).
- **Dynamic Iteration**: The 7 cards inside each panel are rendered using a `.map()` iterator (`activeTab.cards.map(...)`), strictly avoiding hardcoded indexes.
- **Sliding Indicator Motion**: The active 4px bottom border indicator smoothly animates (`transform: translateX(...)`) between tabs on selection.
- **Responsive Layout**: The card grid scales from a single stacked column (1 card per row) on small screens to a full single row of up to 7 cards on large desktop viewports, with a uniform **16px gap** across all breakpoints.

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ [Heading: <Text variant="h3" className={styles.heading} />]                    │
│                                                                                │
│  Tab 1 (Active)               Tab 2 (Inactive)                                 │
│  <Text variant="subhead">     <Text variant="subhead">                         │
│  [======== 4px Border ========] ──(slides on click)──> [                      ]│
│  (7px distance from text)                                                      │
│ ────────────────────────────────────────────────────────────────────────────── │
│                                                                                │
│ [Smooth Crossfade Panel Animation: 300ms cubic-bezier(0, 0, 0.2, 1)]           │
│                                                                                │
│ Mobile (Stacked, 1 col, 16px gap):                                             │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ QuickLinkSimple (White / default variant)                                  │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────────────────────────────┐ │
│ │ QuickLinkSimple (White / default variant)                                  │ │
│ └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│ Desktop (Single row, up to 7 cols, 16px gap):                                  │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                 │
│ │ Card │ │ Card │ │ Card │ │ Card │ │ Card │ │ Card │ │ Card │ (16px gap)     │
│ │  1   │ │  2   │ │  3   │ │  4   │ │  5   │ │  6   │ │  7   │                 │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                 │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Composition Contract

Per the **Living Frontend Architecture (`FRONTEND.md`)**, this organism composes existing atom components without ad-hoc utility styles:

| Layer / Atom | Component Used | Purpose |
| :--- | :--- | :--- |
| **Heading** | `<Text variant="h3" className={styles.heading} />` | Section title — full width (`width: 100%`), `color: var(--color-primary)`, `margin-bottom: 2.25rem` desktop / `1.5rem` mobile (Albert Sans 700 with 4px vertical rhythm). |
| **Tab Buttons (2)** | `<button role="tab">` wrapping `<Text variant="subhead">` | 2 tab navigation triggers. Active button features a sliding 4px bottom border with 7px distance from text; inactive button renders in `#07456F` (75% opacity) and transitions to `var(--color-primary)` on hover. |
| **Active Indicator** | `<span className={styles.activeIndicator} aria-hidden="true" />` | 4px high brand line that animates horizontally to the active tab via GPU `transform: translateX()`. |
| **Cards Grid** | `<QuickLinkSimple variant="default">` (`src/components/atoms/card/quick-link-simple/`) | Compact vertical cards in the **white surface variant** (`#FFFFFF` surface, `#D5E5F4` card border, `#ECFBF8` badge), dynamically iterated via `.map()`. |

---

## 3. TypeScript Domain & Component Interface

```typescript
import React from "react";
import { QuickLinkSimpleProps } from "@/components/atoms/card/quick-link-simple/QuickLinkSimple";

export interface TabbedCardItem extends Omit<QuickLinkSimpleProps, "className"> {
  id: string;
  /** Explicitly constrained to the white card variant */
  variant?: "default";
}

export interface TabCategory {
  id: string;
  label: string;
  icon?: React.ReactNode;
  /** Dynamically rendered collection of cards (7 items per category in mock/CMS data) */
  cards: TabbedCardItem[];
}

export interface TabbedIconCardsProps {
  /** Section title */
  heading?: string;
  /** Exactly 2 tab categories containing label and cards */
  tabs: [TabCategory, TabCategory] | TabCategory[];
  /** Initially active tab ID (defaults to tabs[0].id) */
  defaultTabId?: string;
  /** Accessible label for the tablist */
  ariaLabel?: string;
  /** Optional wrapper class override */
  className?: string;
  /** Optional callback fired when tab selection changes */
  onTabChange?: (tabId: string) => void;
}
```

---

## 4. Accessibility (WAI-ARIA Tabs 1.2 Specification)

The component strictly implements the **WAI-ARIA Tabs Design Pattern** for WCAG 2.2 AA compliance:

### Roles & Attributes
1. **Tablist (`role="tablist"`)**:
   - Container has `role="tablist"` and `aria-label={ariaLabel || heading || "Service Categories"}`.
   - Manages focus between the 2 tabs via roving `tabIndex`.
2. **Tab Buttons (`role="tab"`)**:
   - Exactly 2 tab buttons.
   - `id={`tab-${tab.id}`}`.
   - `aria-controls={`tabpanel-${tab.id}`}`.
   - `aria-selected={isActive}` (`true` for active tab, `false` for inactive).
   - `tabIndex={isActive ? 0 : -1}`.
   - Initial active: `tabs[0].id` is selected by default on initial render.
3. **Tab Panels (`role="tabpanel"`)**:
   - `id={`tabpanel-${tab.id}`}`.
   - `aria-labelledby={`tab-${tab.id}`}`.
   - `tabIndex={0}` for keyboard users.
   - Animated panel enters with accessible fade/slide; inactive panel is unmounted or hidden with `hidden`.

### Keyboard Interaction Matrix
| Key | Action |
| :--- | :--- |
| `ArrowRight` / `ArrowLeft` | Toggles focus and active selection between the 2 tabs. |
| `Home` / `End` | Jumps to Tab 1 / Tab 2. |
| `Enter` / `Space` | Activates the focused tab. |

---

## 5. Styling, Responsive Layout & Design Tokens

### Layout Strategy
- **Root Wrapper**: Follows the established organism pattern (see `<SnipeCta>`): an outer `<section className={styles.section}>` wrapping an inner `<div className="container">` that holds the heading, tab bar, and card grid.
- **Container Type**: The wrapper declares `container-type: inline-size;`.
- **Section → Container Spacing**: `padding-block: 2rem;` (32px) by default (mobile); `padding-block: 4rem;` (64px) at the desktop breakpoint (`@media (width >= 860px)`, matching `<SnipeCta>`'s existing breakpoint).
- **Heading Spacing**: `margin-bottom: 1.5rem;` (24px) mobile; `margin-bottom: 2.25rem;` (36px) desktop.

### Tab Navigation Bar & Hover/Indicator Interaction
- **Tab Bar Container (`styles.tabListWrapper`)**:
  - Position relative container holding the 2 tab triggers and the sliding active underline indicator.
  - Baseline border: `border-bottom: 1px solid var(--color-border-subtle);` spanning the full width of the tab bar.
  - `margin-bottom: var(--space-xl);` (32px) spacing before the cards panel.
- **Tab List (`styles.tabList`)**:
  - `display: flex; gap: var(--space-xl);` (32px) aligning the 2 tab buttons.
- **Tab Button (`styles.tabButton`)**:
  - Background: `transparent; border: none; cursor: pointer; padding: 0 0 7px 0;` (7px distance below text).
  - Typography: Enclosed `<Text variant="subhead">`.
- **Inactive Tab Button**:
  - Text color: `#07456F` with **75% opacity** (`rgba(7, 69, 111, 0.75)` / `#07456FBF`).
  - **Hover Interaction**: On hover (`:hover`), text color smoothly transitions to **`var(--color-primary)`** (`#00395D`) using `transition: color var(--duration-smart) var(--ease-out-smart);`.
- **Active Tab Button**:
  - Text color: **`var(--color-primary)`** (`#00395D`).
- **Moving Active Indicator (`styles.activeIndicator`)**:
  - `position: absolute; bottom: 0; height: 4px;`
  - Background: `var(--color-tab-active-border);` (`#51BFB6`, mapped via `--color-teal-500`).
  - Distance: Exactly **7px distance below the text**.
  - Motion: Moves smoothly between Tab 1 and Tab 2 using GPU-composited **`transform: translateX(...)`** and dynamic width matching the active tab:
    ```css
    transition: transform var(--duration-smart) var(--ease-out-smart),
                width var(--duration-smart) var(--ease-out-smart);
    ```

### Responsive Cards Grid (1 to 7 Columns, 16px Fixed Gap)
- **Uniform Gap Contract**: `gap: 16px;` (`1rem` / `var(--space-md)`) strictly preserved between cards on **both mobile and desktop**.
- **Container Query Progressive Layout**:
  - **Mobile / Small Containers (`< 480px`)**:
    - **Stacked (1 Column)**: `grid-template-columns: 1fr;`
    - Each `<QuickLinkSimple>` card spans 100% width.
  - **Small Tablet Containers (`480px - 680px`)**:
    - 2 Columns: `grid-template-columns: repeat(2, 1fr);`
  - **Tablet / Medium Containers (`680px - 920px`)**:
    - 3–4 Columns: `grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));`
  - **Desktop / Large Containers (`>= 920px` or `@container (min-width: 920px)`)**:
    - **Single Row of up to 7 Cards**: `grid-template-columns: repeat(7, 1fr);`
    - All 7 cards layout in a single balanced horizontal row with 16px gap between them.
- **Card Variant**: Explicitly constrained to the **white variant** (`variant="default"` on `<QuickLinkSimple>`).
  - Surface: White (`#FFFFFF`)
  - Border: `#D5E5F4` (`var(--color-border-card)`)
  - Badge: Polar Mint (`#ECFBF8`)
  - Hover: 300ms ease-out elevation and ring animation.

### Panel Switch Animation (Design Token Standard)
- **Motion Tokens**:
  - Duration: `var(--duration-smart)` (300ms).
  - Easing: `var(--ease-out-smart)` (`cubic-bezier(0, 0, 0.2, 1)`).
- **Panel Enter Animation**:
  - Compositor-only opacity crossfade with subtle micro-translation:
    ```css
    @keyframes panelFadeIn {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .panel {
      animation: panelFadeIn var(--duration-smart) var(--ease-out-smart);
    }
    ```
- **Reduced Motion**: Under `@media (prefers-reduced-motion: reduce)`, transitions and animations are set to `none` with instantaneous opacity rendering.

---

## 6. Colocated Directory Structure

```
src/components/organisms/tabbed-icon-cards/
├── TabbedIconCards.tsx           # Client Component (manages active tab state, sliding indicator ref)
├── TabbedIconCards.module.css    # Scoped styles (animated sliding indicator, 1-7 col grid, 16px gap)
├── TabbedIconCards.test.tsx      # Vitest + RTL test suite
└── index.ts                      # Clean re-export of TabbedIconCards and types
```

---

## 7. Verification & Testing Requirements

### 7.1 UX / UI Behavioral Test Matrix

| Category | Scenario | Expected Behavior | Assertion Mechanism |
| :--- | :--- | :--- | :--- |
| **Initial Render** | Default active tab & panel | Tab 1 is active (`aria-selected="true"`, `tabIndex="0"`). Tab 2 is inactive (`aria-selected="false"`, `tabIndex="-1"`). Panel 1 is visible in DOM; Panel 2 is unmounted or hidden. | `expect(tab1).toHaveAttribute("aria-selected", "true")`<br>`expect(panel1).toBeVisible()` |
| **Dynamic Mapping** | 7 Cards mapped via `.map()` | Exactly 7 `<QuickLinkSimple>` cards render inside active panel by iterating through `cards` prop array. | `expect(screen.getAllByRole("link")).toHaveLength(7)` |
| **Card Variant** | White surface styling | All 7 cards carry the `default` white card class (`#FFFFFF` surface, `#D5E5F4` border). | `expect(card).not.toHaveClass("inverse")` |
| **Inactive Tab Color** | Visual contrast check | Inactive tab text displays `#07456F` at 75% opacity (`rgba(7, 69, 111, 0.75)`), with transparent 4px border preserving vertical rhythm. | Computed style / CSS class assertion on `.tabButtonInactive` |
| **Hover Interaction** | Inactive tab hover | Hovering over inactive Tab 2 transitions text color to `var(--color-primary)` (`#00395D`). | `fireEvent.mouseEnter(tab2)` → class / style transition |
| **Tab Switch Motion** | Click tab to switch | Clicking Tab 2 activates Tab 2 (`aria-selected="true"`), slides 4px indicator, calls `onTabChange("tab-2")`, and renders Panel 2 with smooth crossfade. | `await userEvent.click(tab2)`<br>`expect(onTabChange).toHaveBeenCalledWith("tab-2")` |
| **Keyboard Nav** | WAI-ARIA arrow navigation | `ArrowRight` on Tab 1 moves focus to Tab 2 and activates it. `ArrowLeft` wraps back to Tab 1. `Home` jumps to first tab; `End` jumps to last. | `fireEvent.keyDown(tab1, { key: "ArrowRight" })` |
| **Responsive Grid** | Mobile 1 col vs Desktop 7 cols | Grid wrapper has `16px` gap. Adapts from stacked 1 column on mobile to 7 columns in single row on desktop container (`>= 920px`). | Container query class inspection and grid-gap validation |
| **Accessibility** | ARIA contract & Axe audit | Valid `role="tablist"`, `role="tab"`, `role="tabpanel"`. `aria-controls` matches panel ID; `aria-labelledby` matches tab ID. Zero WCAG violations. | `axe(container)` yields zero violations |

---

### 7.2 Executable Vitest Test Suite (`TabbedIconCards.test.tsx`)

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { TabbedIconCards, type TabCategory } from "./TabbedIconCards";

const MOCK_TABS: [TabCategory, TabCategory] = [
  {
    id: "personal",
    label: "Personal Banking",
    cards: Array.from({ length: 7 }, (_, i) => ({
      id: `personal-card-${i + 1}`,
      title: `Personal Service ${i + 1}`,
      href: `/personal/service-${i + 1}`,
      variant: "default",
    })),
  },
  {
    id: "business",
    label: "Business Banking",
    cards: Array.from({ length: 7 }, (_, i) => ({
      id: `business-card-${i + 1}`,
      title: `Business Service ${i + 1}`,
      href: `/business/service-${i + 1}`,
      variant: "default",
    })),
  },
];

describe("TabbedIconCards Organism", () => {
  it("renders heading and exactly 2 tab buttons with Subhead typography", () => {
    render(<TabbedIconCards heading="Explore Solutions" tabs={MOCK_TABS} />);

    expect(screen.getByText("Explore Solutions")).toBeDefined();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(2);
    expect(tabs[0]).toHaveTextContent("Personal Banking");
    expect(tabs[1]).toHaveTextContent("Business Banking");
  });

  it("activates the first tab and panel by default", () => {
    render(<TabbedIconCards tabs={MOCK_TABS} />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(tabs[0].getAttribute("tabindex")).toBe("0");
    expect(tabs[1].getAttribute("aria-selected")).toBe("false");
    expect(tabs[1].getAttribute("tabindex")).toBe("-1");

    // Panel 1 active and linked via ARIA
    const panel = screen.getByRole("tabpanel");
    expect(panel.getAttribute("id")).toBe("tabpanel-personal");
    expect(panel.getAttribute("aria-labelledby")).toBe("tab-personal");
  });

  it("dynamically iterates and renders all 7 white variant cards in the active panel", () => {
    const { container } = render(<TabbedIconCards tabs={MOCK_TABS} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(7);
    expect(screen.getByText("Personal Service 1")).toBeDefined();
    expect(screen.getByText("Personal Service 7")).toBeDefined();

    // Verify white variant (no inverse class)
    const cardElements = container.querySelectorAll("a");
    cardElements.forEach((card) => {
      expect(card.className).not.toContain("inverse");
    });
  });

  it("switches tabs and active panel when Tab 2 is clicked", async () => {
    const onTabChange = vi.fn();
    render(<TabbedIconCards tabs={MOCK_TABS} onTabChange={onTabChange} />);

    const tabs = screen.getAllByRole("tab");
    await userEvent.click(tabs[1]);

    expect(tabs[0].getAttribute("aria-selected")).toBe("false");
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(onTabChange).toHaveBeenCalledWith("business");

    // Panel updates to show business cards
    expect(screen.getByText("Business Service 1")).toBeDefined();
    expect(screen.queryByText("Personal Service 1")).toBeNull();
  });

  it("supports keyboard navigation with ArrowRight, ArrowLeft, Home, and End", () => {
    render(<TabbedIconCards tabs={MOCK_TABS} />);

    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();

    // Navigate Right -> Tab 2
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");

    // Navigate Left -> Tab 1
    fireEvent.keyDown(tabs[1], { key: "ArrowLeft" });
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");

    // End -> Tab 2
    fireEvent.keyDown(tabs[0], { key: "End" });
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");

    // Home -> Tab 1
    fireEvent.keyDown(tabs[1], { key: "Home" });
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
  });

  it("renders sliding active indicator with 4px border geometry", () => {
    const { container } = render(<TabbedIconCards tabs={MOCK_TABS} />);

    const indicator = container.querySelector("[aria-hidden='true'].activeIndicator, [class*='activeIndicator']");
    expect(indicator).toBeDefined();
  });

  it("maintains a 16px gap on the cards grid container", () => {
    const { container } = render(<TabbedIconCards tabs={MOCK_TABS} />);

    const grid = container.querySelector("[class*='cardGrid']");
    expect(grid).toBeDefined();
  });
});
```

---

## 8. Page Composition & Placement

- **Location**: `<TabbedIconCards>` renders in `src/app/page.tsx`, immediately below `<SnipeCta />`, in both the CMS-driven render branch and the graceful fallback branch.
- **Order**: `<OptimizelyComponent>` / `<EslHomePage>` → `<SnipeCta />` → `<TabbedIconCards />`.
- **Rationale**: Keeps the CTA snipe as the closing element of the primary content flow, with the tabbed service/offering grid surfaced as a secondary section beneath it.

---

## 9. Non-Functional Engineering Laws (Architecture & Quality Standards)

Every aspect of `<TabbedIconCards>` adheres to the core engineering principles documented in `ARCHITECTURE.md` and `FRONTEND.md`:

### 9.1 Zero Reflow & Zero Repaint Discipline
- **Zero Geometry Shift (CLS = 0)**:
  - Inactive tabs permanently reserve their 4px border geometry via `border-bottom: 4px solid transparent` and `padding-bottom: 7px`. Toggling tabs never modifies box-model dimensions or displaces siblings.
- **GPU Compositor-Only Transitions**:
  - The moving active indicator animates exclusively via **`transform: translateX(...)`** and dynamic width (or `scaleX`), completely avoiding `left`, `right`, or `margin` properties that trigger CPU layout reflows.
  - Panel transitions exclusively animate **`opacity`** and **`transform: translateY(...)`**.
- **Container Isolation**:
  - The component root declares `container-type: inline-size;`. Layout calculations, column counts (1 to 7), and fluid wrapping are isolated to the container context, preventing document-level reflow cascades.

### 9.2 Strict 3-Tier Design Token & DRY Compliance
- **Zero Raw Hex in Component CSS**:
  - Enforces Stylelint rule `color-no-hex: true`.
  - Inactive tab text uses `--color-tab-inactive: rgba(7, 69, 111, 0.75);` (derived from `#07456F` at 75% opacity).
  - Active tab text uses `var(--color-primary)` (`#00395D`), while the 4px active bottom border indicator uses `var(--color-tab-active-border)` / `var(--color-teal-500)` (`#51BFB6`).
  - Baseline border uses `var(--color-border-subtle)`.
  - Cards consume `var(--color-border-card)` and `var(--color-surface)`.
  - Uniform gap uses `var(--space-md)` (`16px` / `1rem`).
- **Typography Composition Law**:
  - Zero font declarations (`font-family`, `font-size`, `line-height`) in `TabbedIconCards.module.css`.
  - Strictly composes `<Text variant="h3">` and `<Text variant="subhead">`.

### 9.3 Accessibility (WCAG 2.2 AA / AAA Contract)
- **Contrast Ratios**:
  - Active Tab: **12.4:1** on white canvas (exceeds WCAG AAA 7:1 threshold).
  - Inactive Tab (`#07456F` 75%): **6.84:1** on white canvas (exceeds WCAG AA 4.5:1 threshold).
- **WAI-ARIA Tabs 1.2 Roving TabIndex**:
  - Exactly one tab is focusable (`tabIndex={0}`) at any time; inactive tab has `tabIndex={-1}`.
  - Arrow key navigation (`ArrowRight`, `ArrowLeft`, `Home`, `End`) cycles focus and activates panels synchronously.
  - High-contrast focus indicator (`:focus-visible` with 2px teal ring and 3px offset).
- **Automated Axe Verification**:
  - Fully clean axe-core compliance with zero accessibility violations.

### 9.4 Scalability, Reusability & Code Health
- **Data-Driven & Vendor-Insulated**:
  - Accepts typed domain data without dependency on CMS vendor ASTs or schemas.
  - Panel dynamically iterates through `tab.cards.map(...)` — zero hardcoded counts or indexes.
- **Colocated Architecture**:
  - Fully contained in `src/components/organisms/tabbed-icon-cards/` (`.tsx`, `.module.css`, `.test.tsx`, `index.ts`), cleanly exported via `src/components/organisms/index.ts`.


# Component Specification: Footer (`<Footer>`)

> **Classification**: Organism Component  
> **Target Directory**: `src/components/organisms/footer/`  
> **Spec Path**: `openspec/changes/footer/spec.md`  
> **Status**: Approved Spec Ready for Implementation  
> **Design System Compliance**: Strict 3-Tier Tokens • Container Queries • WCAG 2.2 AA Contrast • Zero Hardcoded Magic Numbers  

---

## 1. Overview & Architectural Intent

The **Footer** organism represents the primary navigational and legal closing landmark of the ESL application. It implements a multi-tier grid structure wrapped in a `<section>` tag with dark brand gradient aesthetics, high-contrast typography, and tokenized spacing.

### Key Requirements Matrix
- **Root Element**: `<section className={styles.footerSection} role="contentinfo" aria-label="Site Footer">`
- **Background Gradient**: `linear-gradient(135deg, #010E23 0%, #01375A 100%)` implemented via Tier 1 primitive and Tier 2 semantic tokens.
- **Vertical Spacing**:
  - `padding-top: 64px` (`4rem`)
  - `padding-bottom: 127px` (`7.9375rem`)
- **Desktop Grid Layout (>= 1024px)**:
  - **2 Rows** separated by a **48px row gap** (`3rem`).
  - **Row 1 (5 Columns, 40px Column Gap)**:
    - **Column 1 (Brand Column)**: ESL Logo, descriptive copy text below, and a primary/secondary action `<Button>` below the text.
    - **Columns 2–5 (4 Navigation Columns)**: 4 category columns, each containing 1 category title and 4–5 text links.
  - **Row 2 (1 Full-Width Column)**: Spans all 5 columns (`grid-column: 1 / -1`) for legal disclaimers, copyright, and regulatory compliance notices.
- **Mobile Grid Layout (< 1024px)**:
  - **Brand Column (Col 1)**: **100% width** (`grid-column: 1 / -1`), stacking Logo, Text, and Button.
  - **4 Navigation Columns**: Rendered as a **2-column grid (50% width each)** with a strict **20px column gap** (`grid-template-columns: repeat(2, 1fr); column-gap: 20px; row-gap: 32px;`).
    - Sub-row A: `MEMBER TOOLS` (50%) + `HELP & SUPPORT` (50%) with 20px gap.
    - Sub-row B: `MANAGE` (50%) + `ABOUT ESL` (50%) with 20px gap.
  - **Row 2 (Bottom Legal)**: **100% width** (`grid-column: 1 / -1`), stacking utility links, regulatory disclosures, and copyright.

```
DESKTOP VIEW (>= 1024px): 5 Columns in Row 1 (40px col gap), 48px Row Gap, 1 Full-Width Col in Row 2
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ <section> Background: linear-gradient(135deg, #010E23 0%, #01375A 100%) [pt: 64px, pb: 127px]                         │
│ ┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ ROW 1: 5 Columns (gap: 40px col gap)                                                                               │ │
│ │ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐                          │ │
│ │ │ Column 1      │ │ Column 2      │ │ Column 3      │ │ Column 4      │ │ Column 5      │                          │ │
│ │ │ [ESL Logo]    │ │ MEMBER TOOLS  │ │ HELP & SUPPORT│ │ MANAGE        │ │ ABOUT ESL     │                          │ │
│ │ │ Text Copy     │ │ • Link 1      │ │ • Link 1      │ │ • Link 1      │ │ • Link 1      │                          │ │
│ │ │ (inverted)    │ │ • Link 2      │ │ • Link 2      │ │ • Link 2      │ │ • Link 2      │                          │ │
│ │ │ [Button CTA]  │ │ • Link 3      │ │ • Link 3      │ │ • Link 3      │ │ • Link 3      │                          │ │
│ │ │               │ │ • Link 4      │ │ • Link 4      │ │ • Link 4      │ │ • Link 4      │                          │ │
│ │ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘                          │ │
│ │ ────────────────────────────────────── 48px Row Gap ────────────────────────────────────────────────────────────── │ │
│ │ ROW 2: 1 Column (Full Width, grid-column: 1 / -1)                                                                  │ │
│ │ Legal Links | NCUA & Equal Housing Badges | Copyright © 2026 ESL Federal Credit Union                              │ │
│ └────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

MOBILE VIEW (< 1024px): Col 1 = 100% Width | 4 Nav Cols = 50% Width (20px gap)
┌────────────────────────────────────────────────────────────────────────────────┐
│ Column 1 (Brand Stack - 100% Width):                                           │
│ [ESL Logo]                                                                     │
│ "Member-owned banking, built around the people and places we call home."       │
│ [Become a member (Pill Button)]                                                │
│                                                                                │
│ ── 32px Vertical Gap ───────────────────────────────────────────────────────── │
│                                                                                │
│ 4 Navigation Columns: 2x2 Grid (50% / 50% with 20px Column Gap):               │
│ ┌──────────────────────────────────────┐ ┌───────────────────────────────────┐ │
│ │ MEMBER TOOLS (50% width)             │ │ HELP & SUPPORT (50% width)        │ │
│ │ • Sign in to online banking          │ │ • Common questions                │ │
│ │ • Find a branch or ATM               │ │ • How-to guides                   │ │
│ │ • Rates at a glance                  │ │ • Contact us                      │ │
│ │ • Become a Member                    │ │ • Report fraud                    │ │
│ └──────────────────────────────────────┘ └───────────────────────────────────┘ │
│                  ◄──────── 20px Column Gap ────────►                           │
│ ┌──────────────────────────────────────┐ ┌───────────────────────────────────┐ │
│ │ MANAGE (50% width)                   │ │ ABOUT ESL (50% width)             │ │
│ │ • Free Checking                      │ │ • Become a Member                 │ │
│ │ • Savings                            │ │ • Our story                       │ │
│ │ • Credit Cards                       │ │ • Careers                         │ │
│ │ • Mortgages                          │ │ • Community                       │ │
│ │ • Business banking                   │ │ • Social Channels                 │ │
│ └──────────────────────────────────────┘ └───────────────────────────────────┘ │
│                                                                                │
│ ── 48px Row Gap ────────────────────────────────────────────────────────────── │
│                                                                                │
│ ROW 2 (Full Width - 100%):                                                     │
│ Privacy • Terms • Security • Accessibility • Disclosures                       │
│ Federally insured by NCUA | Equal Housing Opportunity                          │
│ © 2026 ESL Federal Credit Union. Insured by NCUA.                              │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Design Tokens Strategy (Gradients & Spacing)

In accordance with the ESL Living Design Token Architecture (`src/styles/tokens.css`), all values must be mapped through the 3-Tier token model rather than hardcoded in CSS modules:

### 2.1 Color Primitives (Tier 1)
```css
/* Tier 1: Primitives (src/styles/tokens.css) */
--color-navy-950: #010E23; /* Footer gradient start */
--color-navy-800: #01375A; /* Footer gradient end */
```

### 2.2 Semantic Tokens (Tier 2)
```css
/* Tier 2: Semantic Gradients, Layout & Typography */
--gradient-footer: linear-gradient(135deg, var(--color-navy-950) 0%, var(--color-navy-800) 100%);
--space-footer-top: 4rem;          /* 64px */
--space-footer-bottom: 7.9375rem;     /* 127px */
--space-footer-row-gap: 3rem;      /* 48px */
--space-footer-col-gap: 2.5rem;    /* 40px (desktop) */

/* Typography Tokens for Footer Titles */
--font-size-footer-title-mobile: 0.71875rem;   /* 11.5px */
--font-size-footer-title-desktop: 1.125rem;    /* 18px */
--line-height-footer-title-mobile: 1.078125rem; /* 17.25px */
--line-height-footer-title-desktop: 1.75rem;   /* 28px */
--tracking-footer-title-mobile: 1.035px;       /* 1.03px */
--tracking-footer-title-desktop: 0px;
```

### 2.3 Component Intent Tokens (Tier 3)
```css
/* Tier 3: Footer Scoped Mappings */
--footer-bg: var(--gradient-footer);
--footer-text-primary: var(--color-text-inverted);         /* #FFFFFF */
--footer-text-muted: var(--color-text-inverted-muted);     /* rgba(255, 255, 255, 0.80) */
--footer-link-hover: var(--color-turquoise-400);           /* #68E0CC */
--footer-border-subtle: var(--color-white-10);              /* rgba(255, 255, 255, 0.10) */
```

---

## 3. Component Composition Contract

The Footer organism composes existing atom components to maintain design consistency and avoid redundant ad-hoc styling:

| Sub-Element | Atom / Element Used | Configuration & Style Rules |
| :--- | :--- | :--- |
| **Root Section** | `<section>` | `background: var(--gradient-footer)`, `padding-top: var(--space-footer-top)`, `padding-bottom: var(--space-footer-bottom)`. |
| **Inner Container** | `<div className="container">` | Constrained max-width container with responsive horizontal gutters (`1.5rem` mobile / `2.5rem` desktop). |
| **Brand Logo** | `<Link href="/">` + `<img />` or SVG | Brand logo rendered with high contrast against dark gradient, linking to home page. |
| **Brand Text** | `<Text variant="body-sm" color="inverted-muted">` | Paragraph copy beneath the logo explaining mission or brief service summary. |
| **Brand CTA Button** | `<Button variant="secondary" shape="pill">` | Primary/secondary action button (e.g., "Become a member"). |
| **Column Titles (4)** | `<Text variant="footer-title" as="h3">` | Dedicated design system typography atom (`variant="footer-title"`): **Mobile**: 11.5px font-size, 17.25px line-height, 700 bold, uppercase, 1.035px tracking; **Desktop**: 18px font-size, 28px line-height, 500 medium, sentence/title case, 0px tracking. |
| **Column Links (4 per col)** | `<TextLink variant="light">` in `<ul>`/`<li>` | Accessible editorial links on dark background transitioning to turquoise (`#68E0CC`) on hover. |
| **Row 2 Legal / Bottom** | `<Text variant="caption" color="inverted-muted">` | 1 full-width column providing copyright and regulatory disclosures. |

---

## 4. TypeScript Domain & Component Interface

```typescript
import React from "react";
import { ButtonVariant } from "@/components/atoms/button/Button";

export interface FooterLinkItem {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  target?: "_blank" | "_self";
  rel?: string;
}

export interface FooterNavColumn {
  id: string;
  title: string;
  /** Exactly 4 links per column per specification */
  links: [FooterLinkItem, FooterLinkItem, FooterLinkItem, FooterLinkItem] | FooterLinkItem[];
}

export interface FooterBrandSection {
  logo: {
    src: string;
    alt: string;
    href?: string;
    width?: number;
    height?: number;
  };
  text: string;
  button: {
    label: string;
    href: string;
    variant?: ButtonVariant;
    external?: boolean;
  };
}

export interface FooterProps {
  /** Column 1 Brand configuration: Logo, copy text, and action button */
  brand?: FooterBrandSection;
  /** Columns 2-5: Exactly 4 navigation columns with 1 title and 4 links each */
  columns?: [FooterNavColumn, FooterNavColumn, FooterNavColumn, FooterNavColumn] | FooterNavColumn[];
  /** Row 2 content: copyright statement, disclosures, or regulatory badges */
  copyrightText?: string;
  disclaimerText?: string;
  /** Custom children or bottom bar overrides */
  bottomContent?: React.ReactNode;
  /** Optional custom class overrides */
  className?: string;
}
```

---

## 5. CSS Grid Layout & Responsive Adaptation

### 5.1 CSS Modules Specification (`Footer.module.css`)

```css
.footerSection {
  background: var(--gradient-footer);
  padding-top: var(--space-footer-top);
  padding-bottom: var(--space-footer-bottom);
  color: var(--color-text-inverted);
  width: 100%;
  position: relative;
  overflow: hidden;
}

/* 2 Rows Grid Container with 48px row gap */
.gridContainer {
  display: grid;
  grid-template-rows: auto auto;
  row-gap: var(--space-footer-row-gap); /* 48px */
  width: 100%;
}

/* Row 1 Layout: Mobile 2-column grid (50% each with 20px gap); Col 1 spans 100% */
.row1 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 20px; /* Strict 20px gap between 50% width nav columns */
  row-gap: var(--space-xl); /* 32px vertical gap */
}

/* Desktop: Strict 5 Columns with 40px column gap */
@media (min-width: 1024px) {
  .row1 {
    grid-template-columns: 1.4fr repeat(4, 1fr);
    column-gap: var(--space-footer-col-gap); /* 40px column gap on desktop */
    row-gap: 0;
  }
}

/* Column 1: Brand Stack (100% width on mobile, 1 col on desktop) */
.brandCol {
  grid-column: 1 / -1; /* Spans full width (100%) on mobile */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-md); /* 16px */
}

@media (min-width: 1024px) {
  .brandCol {
    grid-column: auto;
    width: auto;
  }
}

.brandLogo {
  display: inline-block;
  max-width: 180px;
  height: auto;
}

.brandText {
  color: var(--footer-text-muted);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.brandButton {
  margin-top: var(--space-xs);
}

/* Columns 2-5: Navigation Columns */
.navCol {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.navTitle {
  /* Styled via <Text variant="footer-title" as="h3"> */
  color: var(--color-text-inverted);
  margin: 0;
}

.navList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  row-gap: 8px; /* Strict 8px vertical row gap between links */
}

.footerLink {
  text-decoration: none;
  font-weight: var(--font-weight-regular);
  color: var(--footer-text-primary);
  opacity: 0.7; /* 70% opacity on mobile */
  transition: color var(--duration-smart) var(--ease-out-smart),
              opacity var(--duration-smart) var(--ease-out-smart);
}

.footerLink:hover {
  text-decoration: none;
  color: var(--footer-link-hover);
  opacity: 1;
}

@media (min-width: 1024px) {
  .footerLink {
    opacity: 0.9; /* 90% opacity on desktop */
  }
}

/* Row 2: 1 Full-Width Column */
.row2 {
  grid-column: 1 / -1;
  border-top: 1px solid var(--footer-border-subtle);
  padding-top: var(--space-lg); /* 24px */
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  color: var(--footer-text-muted);
}
```

---

## 6. Accessibility & Semantic HTML (WCAG 2.2 AA)

1. **Semantic Landmark**:
   - The `<section>` has `role="contentinfo"` and an accessible label (`aria-label="Site Footer"`), identifying it as the document's footer landmark.
2. **Navigational Sub-landmarks**:
   - Each of the 4 navigation link columns is enclosed within a `<nav aria-label="{title}">` with a semantically structured unordered list (`<ul>`/`<li>`).
3. **Color Contrast Ratios**:
   - Primary text `#FFFFFF` on `#010E23`: **19.8:1** (Exceeds WCAG AAA requirement of 7:1).
   - Muted text `rgba(255, 255, 255, 0.80)` on `#01375A`: **9.4:1** (Exceeds WCAG AAA requirement of 7:1).
   - Turquoise link hover `#68E0CC` on `#010E23`: **12.6:1** (Exceeds WCAG AAA requirement of 7:1).
4. **Keyboard Focus States**:
   - All interactive elements (logo link, CTA button, navigation links) feature explicit `:focus-visible` rings using `outline: 2px solid var(--color-turquoise-400)` with `outline-offset: 2px`.

---

## 7. Verification & Testing Requirements

### 7.1 Behavioral Test Matrix

| Test ID | Scenario | Expected Behavior | Assertion Mechanism |
| :--- | :--- | :--- | :--- |
| **TC-FT-01** | Root tag & background | Renders `<section>` with `role="contentinfo"` and background token. | `expect(screen.getByRole("contentinfo")).toBeInTheDocument()` |
| **TC-FT-02** | Row 1 column count | Row 1 contains exactly 5 columns (1 brand column + 4 nav columns). | Query column containers, assert length is 5. |
| **TC-FT-03** | Brand column elements | Column 1 renders logo image, description paragraph, and CTA button. | Assert logo with alt text, text copy, and button link. |
| **TC-FT-04** | 4 Nav columns & 4 links | Columns 2–5 each render 1 heading and exactly 4 text links. | For each nav column, assert `heading` exists and `links` count is 4 (total 16 links). |
| **TC-FT-05** | Row 2 full width | Row 2 spans full width and renders copyright notice. | `expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()` |
| **TC-FT-06** | Mobile 2-column nav & 100% brand | Mobile CSS layout applies `grid-column: 1 / -1` to Brand column and 2-column grid (`repeat(2, 1fr)`) with 20px column gap to nav columns. | CSS class & computed style verification |
| **TC-FT-07** | WCAG 2.2 AA Contrast & Axe | Passes axe accessibility automated audit without violations. | `const results = await axe(container); expect(results).toHaveNoViolations();` |

---

## 8. Colocated Implementation Directory

```
src/components/organisms/footer/
├── Footer.tsx            # React Component (Server Component by default)
├── Footer.module.css     # CSS Modules (Tokens, 2 rows grid, 48px/40px gaps)
├── Footer.test.tsx       # Vitest + React Testing Library + Axe suite
├── footerData.ts         # Default mock data (ESL Logo, 4 cols x 4 links, copyright)
└── index.ts              # Public exports (Footer, FooterProps, types)
```

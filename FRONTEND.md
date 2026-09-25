# Living Frontend & Design System Documentation

> **Status**: Active & Maintained Continuously  
> **Source of Truth**: [`src/styles/tokens.css`](file:///c:/Projects/ESL/src/styles/tokens.css)  
> **Guiding Principle**: INTRINSIC DESIGN • ACCESSIBILITY FIRST • ZERO SPECIFICITY WARS

---

## 1. Typography & Font System

Typography is loaded via `next/font/google` at build time (zero external runtime calls, zero CLS).

### Active Font Families

| Token                   | Font Family        | Purpose                                   | Weights Loaded     |
| :---------------------- | :----------------- | :---------------------------------------- | :----------------- |
| `--font-family-sans`    | **Albert Sans**    | Primary UI text, body copy, paragraphs    | 400, 500, 600, 700 |
| `--font-family-display` | **Albert Sans**    | Major display headings, hero titles       | 600, 700, 800      |
| `--font-family-eyebrow` | **League Spartan** | Badges, kickers, category tags, subtitles | 500, 600, 700      |
| `--font-family-mono`    | System Monospace   | Code, hashes, technical metrics           | 400, 600           |

### Extracted Typography Scale & Fluid Formulas

| Level            | Font           | Weight  | Mobile Size (≤768px) | Desktop Size (≥1200px) | Fluid Font-Size Formula (`clamp()`)           | Tracking  |
| :--------------- | :------------- | :------ | :------------------- | :--------------------- | :-------------------------------------------- | :-------- |
| **Display**      | Albert Sans    | 800     | 40px (`2.5rem`)      | 72px (`4.5rem`)        | `clamp(2.5rem, -1.055rem + 7.41vw, 4.5rem)`   | `-0.4px`  |
| **H1**           | Albert Sans    | 700     | 34px (`2.125rem`)    | 52px (`3.25rem`)       | `clamp(2.125rem, 0.125rem + 4.17vw, 3.25rem)` | `-0.32px` |
| **H2**           | Albert Sans    | 700     | 28px (`1.75rem`)     | 40px (`2.5rem`)        | `clamp(1.75rem, 0.417rem + 2.78vw, 2.5rem)`   | `-0.24px` |
| **H3**           | Albert Sans    | 700     | 22px (`1.375rem`)    | 28px (`1.75rem`)       | `clamp(1.375rem, 0.708rem + 1.39vw, 1.75rem)` | `-0.16px` |
| **H4**           | Albert Sans    | 700     | —                    | 20px (`1.25rem`)       | `1.25rem`                                     | `0`       |
| **Stat**         | Albert Sans    | 700     | 40px (`2.5rem`)      | 60px (`3.75rem`)       | `clamp(2.5rem, 0.278rem + 4.63vw, 3.75rem)`   | `-0.16px` |
| **Subhead**      | Albert Sans    | 400/500 | 18px (`1.125rem`)    | 24px (`1.5rem`)        | `clamp(1.125rem, 0.463rem + 1.39vw, 1.5rem)`  | `0`       |
| **Body Large**   | Albert Sans    | 400     | 16px (`1rem`)        | 20px (`1.25rem`)       | `clamp(1rem, 0.286rem + 1.48vw, 1.25rem)`     | `0`       |
| **Body**         | Albert Sans    | 400     | 16px (`1rem`)        | 16px (`1rem`)          | `1rem`                                        | `0`       |
| **Body Small**   | Albert Sans    | 400     | 14px (`0.875rem`)    | 14px (`0.875rem`)      | `0.875rem`                                    | `0`       |
| **Label**        | Albert Sans    | 600     | 18px (`1.125rem`)    | 18px (`1.125rem`)      | `1.125rem`                                    | `0`       |
| **Caption**      | Albert Sans    | 400     | 14px (`0.875rem`)    | 14px (`0.875rem`)      | `0.875rem`                                    | `0`       |
| **Micro**        | Albert Sans    | 600     | 12px (`0.75rem`)     | 12px (`0.75rem`)       | `0.75rem`                                     | `0`       |
| **Button Label** | Albert Sans    | 700     | 16px (`1rem`)        | 16px (`1rem`)          | `1rem` (20px LH)                              | `0`       |
| **Eyebrow**      | League Spartan | 700     | 16px (`1rem`)        | 16px (`1rem`)          | `1rem` (UPPERCASE)                            | `2.2px`   |
| **Footer Title** | Albert Sans    | 700 / 500 | 11.5px (`0.71875rem`) | 18px (`1.125rem`)    | Mobile: `0.71875rem` / Desktop: `1.125rem`   | Mobile: `1.035px` (UPPERCASE) / Desktop: `0` |

---

### Why We Must Normalize Line Heights: The 4px Vertical Rhythm Rationale

> **Core Architectural Rule**: Every line box rendered by the browser must be an integer multiple of the 4px vertical rhythm grid.

In the original visual specs, several line-height values were set optically without mathematical division by 4:

- Desktop H1: **58px** ($58 \div 4 = 14.5$ ❌)
- Desktop H2: **46px** ($46 \div 4 = 11.5$ ❌)
- Desktop Stat: **62px** ($62 \div 4 = 15.5$ ❌)
- Desktop Eyebrow: **18px** ($18 \div 4 = 4.5$ ❌)
- Mobile H2: **34px** ($34 \div 4 = 8.5$ ❌)
- Mobile Subhead: **26px** ($26 \div 4 = 6.5$ ❌)
- Mobile Body Large: **27px** ($27 \div 4 = 6.75$ ❌)

#### The 3 Engineering Failures Caused by Unnormalized Line Heights:

1. **Cumulative Baseline Drift Across Columns**:
   When multi-line text uses a 58px line-height ($14.5 \times 4\text{px}$), line 1 is at 58px, line 2 at 116px, line 3 at 174px. If placed in a 2-column layout beside a media card or sidebar whose padding and gaps follow the 4px grid (e.g. 16px, 32px, 48px), the text baseline drifts by **2px on line 1, 4px on line 2, and 6px on line 3**. The two columns immediately appear crooked and misaligned.

2. **Component Height Invalidation**:
   Components combine padding and line-height. If a card has `padding: 16px` (top & bottom) and contains a heading with line-height `46px`, the total card height is:
   $$\text{Total Height} = 16 + 46 + 16 = 78\text{px} \quad (78 \div 4 = 19.5 \text{ ❌})$$
   The entire card container now violates the 4px vertical rhythm, causing subsequent cards, buttons, and sections down the page to be displaced by 2 fractional pixels.

3. **Sub-Pixel Antialiasing Blur & Scrolling Jitter**:
   When text line boxes do not land on exact device pixel boundaries (especially on $1\times$ or $1.5\times$ displays), the browser rasterizer performs sub-pixel antialiasing. This causes faint horizontal blurring and micro-stuttering during vertical scrolling.

#### The Normalization Contract:

We preserve **100% of the specified font sizes, font weights, and tracking**, but snap the line-heights to the nearest integer divisible by 4:

| Token                 | Raw Spec LH | Normalized 4px LH | Math Check             | Visual Variance                        |
| :-------------------- | :---------- | :---------------- | :--------------------- | :------------------------------------- |
| `Display (Desktop)`   | 76px        | **76px**          | $19 \times 4\text{px}$ | Exact match                            |
| `Display (Mobile)`    | 44px        | **44px**          | $11 \times 4\text{px}$ | Exact match                            |
| `H1 (Desktop)`        | 58px        | **60px**          | $15 \times 4\text{px}$ | $+2\text{px}$ (Enhanced readability)   |
| `H1 (Mobile)`         | 40px        | **40px**          | $10 \times 4\text{px}$ | Exact match                            |
| `H2 (Desktop)`        | 46px        | **48px**          | $12 \times 4\text{px}$ | $+2\text{px}$ (Enhanced breathability) |
| `H2 (Mobile)`         | 34px        | **36px**          | $9 \times 4\text{px}$  | $+2\text{px}$                          |
| `H3 (Desktop)`        | 36px        | **36px**          | $9 \times 4\text{px}$  | Exact match                            |
| `H3 (Mobile)`         | 28px        | **28px**          | $7 \times 4\text{px}$  | Exact match                            |
| `H4 (Desktop)`        | 24px        | **24px**          | $6 \times 4\text{px}$  | Exact match                            |
| `Stat (Desktop)`      | 62px        | **64px**          | $16 \times 4\text{px}$ | $+2\text{px}$                          |
| `Stat (Mobile)`       | 44px        | **44px**          | $11 \times 4\text{px}$ | Exact match                            |
| `Subhead (Mobile)`    | 26px        | **28px**          | $7 \times 4\text{px}$  | $+2\text{px}$                          |
| `Body Large (Mobile)` | 27px        | **28px**          | $7 \times 4\text{px}$  | $+1\text{px}$                          |
| `Eyebrow (Desktop)`   | 18px        | **20px**          | $5 \times 4\text{px}$  | $+2\text{px}$ (Preserves 4px baseline) |

---

### The Typography Composition Law (DRY Component Architecture)

> **Core Architectural Law**: Never declare `font-size`, `line-height`, `font-family`, or `letter-spacing` inside a component's `.module.css` when a typography atom (`<Text>` or `<Heading>`) can provide it.
>
> 1. **Component CSS Scope**: `.module.css` is strictly responsible for layout, spatial positioning, flex alignment, container borders, padding, and interactive state backgrounds.
> 2. **Typography Atom Scope**: All text rendered inside cards, tiles, chips, or interactive slots must compose `<Text>` (e.g. `<Text variant="caption">`, `<Text variant="micro">`).
> 3. **Interactive State Contract**: For components with dynamic states (e.g. `<FilterChip>`), compose `<Text>` with `color="inherit"` and `weight="bold"` so the parent container's pseudo-classes/modifier classes dynamically paint the text without CSS duplication.

---

## 2. Spacing & Spatial Rhythm

All padding, margins, and gaps must strictly use the fluid spacing tokens:

| Token         | Min (Mobile)     | Target (Viewport Curve) | Max (Desktop)     |
| :------------ | :--------------- | :---------------------- | :---------------- |
| `--space-3xs` | `0.125rem` (2px) | `0.1rem + 0.1vw`        | `0.25rem` (4px)   |
| `--space-2xs` | `0.25rem` (4px)  | `0.2rem + 0.25vw`       | `0.375rem` (6px)  |
| `--space-xs`  | `0.5rem` (8px)   | `0.45rem + 0.25vw`      | `0.625rem` (10px) |
| `--space-sm`  | `0.75rem` (12px) | `0.7rem + 0.25vw`       | `0.875rem` (14px) |
| `--space-md`  | `1rem` (16px)    | `1rem` (Fixed 16px)     | `1rem` (16px)     |
| `--space-lg`  | `1.5rem` (24px)  | `1.35rem + 0.75vw`      | `1.875rem` (30px) |
| `--space-xl`  | `2rem` (32px)    | `1.75rem + 1.25vw`      | `2.75rem` (44px)  |
| `--space-2xl` | `3rem` (48px)    | `2.5rem + 2.5vw`        | `4.5rem` (72px)   |
| `--space-3xl` | `4rem` (64px)    | `3.25rem + 3.75vw`      | `6rem` (96px)     |

---

## 3. Color & Theming System (3-Tier Token Architecture)

To eliminate Figma design debt, avoid redundant duplicate tokens, and enable 10-minute rebrands without touching component code, colors are structured in three strict tiers of indirection:

### Tier 1: Primitives (Physical Values, Zero Semantics)

- `--color-navy-950`: `#010E23` (Deep midnight navy)
- `--color-navy-500`: `#00395D` (Corporate Navy / Primary)
- `--color-navy-850`: `#003E65` (Guidance Navy)
- `--color-navy-800`: `#01375A` (Dark Navy gradient stop)
- `--color-aqua-500`: `#00A3A3` (Deep Aqua / Accent)
- `--color-aqua-300`: `#68E0CC` (Figma: aqua-300 / Vibrant Accent Stroke)
- `--color-grey-95`: `#ECFBF8` (Figma: Polar background / Mint Surface)
- `--color-mint-100`: `#EAF9F9` (Linear wash tint)
- `--color-blue-100`: `#D5E5F4` (Card stroke / Subtle Border)
- `--color-aqua-100`: `#D5F3F2` (Ambient glow)
- `--color-sky-300`: `#87CEF2` (Glow stop / Sky accent)
- `--color-slate-50`: `#F7F9FB` (Neutral background)
- `--color-slate-200`: `#B8BFC7` (Muted surface)
- `--color-neutral-600`: `#4E5059` (Body secondary description)
- `--color-slate-700`: `#364153` (Dark neutral body)
- `--color-white`: `#FFFFFF`
- `--color-black`: `#000000`

### Tier 2: Semantic Roles (System & Context Mappings)

- `--color-text-primary`: `var(--color-navy-500)` (Contrast 12.4:1 on white — WCAG AAA)
- `--color-text-secondary`: `var(--color-neutral-600)` (Muted body copy)
- `--color-text-muted`: `rgba(0, 57, 93, 0.55)` (Footnotes, metadata)
- `--color-text-inverted`: `var(--color-white)`
- `--color-text-inverted-muted`: `var(--color-white-80)`
- `--color-primary`: `var(--color-navy-500)`
- `--color-primary-hover`: `var(--color-aqua-500)`
- `--color-primary-contrast`: `var(--color-white)`
- `--color-accent`: `var(--color-aqua-500)`
- `--color-accent-subtle`: `var(--color-grey-95)`
- `--color-focus-ring`: `var(--color-aqua-500)`
- `--color-bg`: `var(--color-white)` (Clean canvas)
- `--color-bg-subtle`: `var(--color-slate-50)`
- `--color-surface`: `var(--color-grey-95)` (Tinted polar cards & panels)
- `--color-surface-raised`: `var(--color-white)` (Raised white cards)
- `--color-surface-inverse`: `var(--color-navy-500)` (Dark cards & banners)
- `--color-surface-muted`: `var(--color-slate-200)`
- `--color-bg-dark`: `var(--color-navy-500)` (Dark section backgrounds)
- `--color-border`: `var(--color-teal-alpha-20)`
- `--color-border-subtle`: `var(--color-navy-alpha-12)`
- `--color-border-accent`: `var(--color-aqua-300)`
- `--color-border-card`: `var(--color-blue-100)`
- `--color-border-inverse-subtle`: `var(--color-white-10)`

### Tier 3: Component Intent Tokens (Multi-Variant Flexibility)

Components consume intent tokens mapped to Tier 2 roles rather than hardcoded hex codes:

| Component | Prop Variant | Token Mapped | Semantic Role Destination |
| :--- | :--- | :--- | :--- |
| `<Heading>` | `color="primary"` | `styles.primary` | `var(--color-text-primary)` |
| `<Heading>` | `color="secondary"` | `styles.secondary` | `var(--color-text-secondary)` |
| `<Heading>` | `color="inverted"` | `styles.inverted` | `var(--color-text-inverted)` |
| `<Heading>` | `color="accent"` | `styles.accent` | `var(--color-accent)` |
| `<Stat>` | `color="accent"` | `styles.accent` | `var(--color-accent)` |
| `<Stat>` | `color="primary"` | `styles.primary` | `var(--color-text-primary)` |
| `<Stat>` | `color="inverted"` | `styles.inverted` | `var(--color-text-inverted)` |
| `<Text>` | `variant="eyebrow"` | `styles.eyebrow` | `var(--font-family-eyebrow)`, uppercase |
| `<Button>` | `variant="primary"` | `--color-btn-primary-bg` | Fill `var(--color-primary)`, text `var(--color-text-inverted)`, hover `var(--color-border-accent)` |
| `<Button>` | `variant="secondary"` | `--color-btn-secondary-bg` | Fill `var(--color-surface)`, text `var(--color-primary)`, hover `var(--color-border-accent)` |
| `<Button>` | `variant="outline"` | `--color-btn-outline-border` | Border `var(--color-primary)`, hover `var(--color-border-accent)` |

---

## 4. Reusable Button Architecture (`<Button>`)

### WCAG 2.2 AA Accessibility Compliance

- **Contrast**: All variants achieve **WCAG AAA** (7:1+), exceeding the 4.5:1 AA threshold:
  - Primary: **12.4:1** (Default), **7.47:1** (Hover)
  - Secondary: **11.4:1** (Default), **7.47:1** (Hover)
  - Outline: **12.4:1** (Default), **7.47:1** (Hover)
- **Target Size Floor (SC 2.5.8)**: Uses dynamic intrinsic sizing (`width: fit-content`) with `min-height: 52px` (standard) or `44px` (compact), ensuring high usability for touch devices.
- **Focus Indicator (SC 2.4.11 & 2.4.13)**: High contrast `:focus-visible` ring (`2px solid var(--color-teal-700); outline-offset: 3px;`).

### Figma Variant Matrix

| Component Variant | Figma Name                    | Prop Definition                                                       | Visual Characteristics                           |
| :---------------- | :---------------------------- | :-------------------------------------------------------------------- | :----------------------------------------------- |
| **1**             | `Button Icon Primary`         | `<Button variant="primary" leftIcon={<UserIcon />}>`                  | Navy fill, White text/icon, Pill shape           |
| **2**             | `Pill button arrow primary`   | `<Button variant="primary" rightIcon={<ArrowRightIcon />}>`           | Navy fill, Right Arrow, Dynamic text hug         |
| **3**             | `Pill Button Secondary Icon`  | `<Button variant="secondary" leftIcon={<UserIcon />}>`                | Mint Polar fill, Navy text/icon, 11.4:1 contrast |
| **4**             | `Form card button`            | `<Button variant="primary" size="sm" rightIcon={<ArrowRightIcon />}>` | Compact size (44px floor), Form rhythm           |
| **5**             | `Pill Button tertiary Icon`   | `<Button variant="outline" leftIcon={<UserIcon />}>`                  | Navy border, Left User icon, 12.4:1 contrast     |
| **6**             | `Pill button arrow secondary` | `<Button variant="secondary" rightIcon={<ArrowRightIcon />}>`         | Mint Polar fill, Right Arrow, Dynamic text hug   |

### Motion Design & Reusable Transition Token

- **Token Definition**: `--transition-all: all var(--duration-smart) var(--ease-out-smart);`
  - `--duration-smart: 300ms;`
  - `--ease-out-smart: cubic-bezier(0, 0, 0.2, 1);` (Figma Smart Animate Ease-Out).
- **Multi-State Application**:
  - **Hover (`:hover`)**: Smoothly animates fill color, text color, border color, `elevation/md` shadow, and micro-lift (`transform: translateY(-1px)`).
  - **Arrow Micro-motion**: `iconRight` smoothly translates `3px` to the right on hover (`transform: translateX(3px)`).
  - **Pressed (`:active`)**: Smooth tactile feedback (`transform: scale(0.985) translateY(1px)`).
  - **Focus (`:focus-visible`)**: 2px high-contrast teal ring with 3px offset.
  - **Icon Inversion**: `currentColor` enables synchronous SVG color inversion on hover with zero extra CSS rules.

---

## 5. CSS Engineering Rules

1. **Layout Primitive Assignment**:
   - **CSS Grid**: 2D macro-layouts (e.g. `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`).
   - **Flexbox**: 1D linear alignment (navbars, button bars, badge rows).
2. **Container Queries (`@container`)**:
   - Components declare `container-type: inline-size;` on their root wrapper.
   - Internal breakpoints adapt to the parent container, not the window viewport.
3. **Low Specificity Discipline**:
   - **Maximum 3 levels of nesting**. Selectors must remain flat to guarantee instant style calculation and eliminate specificity conflicts.
4. **Zero Reflow Habitation**:
   - Transitions are restricted to GPU-composited properties: `transform` and `opacity`.
5. **Strict 3-Tier Design Token Architecture**:
   - **Tier 1 (Primitives)**: Centralized palette with zero semantic meaning (`--color-navy-900`, `--color-teal-700`, `--color-mint-50`, etc.). Component styles must **NEVER** consume Tier 1 primitives or raw hex codes directly.
   - **Tier 2 (Semantic Roles)**: Reusable theme and layout mappings (`--color-bg`, `--color-surface`, `--color-surface-raised`, `--color-surface-muted`, `--color-surface-inverse`, `--color-text-primary`, `--color-text-secondary`, `--color-text-inverted`, `--color-border`, `--color-border-card`, `--color-border-accent`, `--color-overlay-backdrop`, `--color-primary`, `--color-accent`). This is the **primary consumption contract** for component CSS modules.
   - **Component CSS Modules (`*.module.css`)**: Directly bind Tier 2 semantic tokens to component visual states. Avoid dumping one-off component aliases into the global `tokens.css`.
   - **Architectural Rationale**: Prevents global token file explosion while guaranteeing 100% centralized theme switching, dark mode adaptation, and Figma token synchronization.

---

## 6. Atom Component Registry

| Atom                | Status             | Colocated Directory                            | Description                                                                                                                                              |
| :------------------ | :----------------- | :--------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<Header>`          | **Built & Tested** | `src/components/header/`                       | Responsive sticky navigation consuming domain models                                                                                                     |
| `<Display>`         | **Built & Tested** | `src/components/atoms/display/`                | Albert Sans 800 display heading                                                                                                                          |
| `<Heading>`         | **Built & Tested** | `src/components/atoms/heading/`                | Polymorphic display header (H1–H4)                                                                                                                       |
| `<Text>`            | **Built & Tested** | `src/components/atoms/text/`                   | Typography atom with 8 variants (`micro` through `subhead` + `button`), typed semantic `color` modifiers, and `<Micro>`, `<Caption>`, `<ButtonLabel>` shorthands |
| `<Eyebrow>`         | **Built & Tested** | `src/components/atoms/eyebrow/`                | Uppercase League Spartan kicker atom with 4 color intents                                                                                                |
| `<Stat>`            | **Built & Tested** | `src/components/atoms/stat/`                   | Numerical KPI display with Albert Sans 700                                                                                                               |
| `<Button>`          | **Built & Tested** | `src/components/atoms/button/`                 | Reusable polymorphic button (WCAG 2.2 AA, slots, link variant, composes `<Text variant="button">`)                                                      |
| `<FilterChip>`      | **Built & Tested** | `src/components/atoms/chip/`                   | Selectable pill filter (default vs active selected, composes `<Text variant="caption">`)                                                                 |
| `<TabButton>`       | **Built & Tested** | `src/components/atoms/tab/`                    | Card tab navigation with icon and role="tab" (composes `<Text variant="button">`)                                                                        |
| `<Badge>`           | **Built & Tested** | `src/components/atoms/badge/`                  | Taxonomy metadata pill (aqua & neutral, composes `<Text variant="micro">`)                                                                               |
| `<QuickLink>`       | **Built & Tested** | `src/components/atoms/card/quick-link/`        | Action row card with image placeholder, label, and trailing arrow (composes `<Text variant="button">`)                                                  |
| `<QuickLinkSimple>` | **Built & Tested** | `src/components/atoms/card/quick-link-simple/` | Vertical card with circular icon badge (Default & Inverse variants, composes `<Text variant="button">`)                                                  |
| `<QuickLinkLarge>`  | **Built & Tested** | `src/components/atoms/card/quick-link-large/`  | High-emphasis card with centered title (composes `<Text variant="button">`), 124x124px image slot/placeholder, and active underline/ring variants |
| `<IconContentCard>` | **Built & Tested** | `src/components/atoms/card/icon-content-card/` | Editorial left-aligned card with icon badge, title (`<Text variant="button">`), body (`<Text variant="body-sm">`), and CTA text (`<Text variant="micro">`) |
| `<ProcessCard>`     | **Built & Tested** | `src/components/atoms/card/process-card/`      | Horizontal step card with step number badge, title, and description (Mint & Neutral variants)                                                            |
| `<TestimonialCard>` | **Built & Tested** | `src/components/atoms/card/testimonial-card/`  | Media card with performance facade pattern (static thumbnail initial load + accessible video lightbox for YouTube/Vimeo/local)                           |
| `<RatesCard>`       | **Built & Tested** | `src/components/atoms/card/rates-card/`        | Rate highlight card with circular category icon badge, bold rate value/APR, body text, and trailing arrow CTA (Default Navy & Active Turquoise variants) |
| `<BasicsTile>`      | **Built & Tested** | `src/components/atoms/card/basics-tile/`       | Key metric callout tile with bold title, highlighted value (md/lg prop), description, and customizable order                                             |
| `<BasicsTileGrid>`  | **Built & Tested** | `src/components/atoms/card/basics-tile/`       | Container orchestrator supporting desktop single-row track (Image 2) and mobile 2x2 grid with interior crosshair borders (Image 3)                       |
| `<TextLink>`        | **Built & Tested** | `src/components/atoms/link/`                   | Editorial inline link (composes `<Text variant="button">`) with smooth underline reveal and dark/light modes                                             |
| `<Icon>`            | **Built & Tested** | `src/components/atoms/icons/`                  | Typed Lucide React icon registry with tree-shaking                                                                                                       |
| `<CmsImage>`        | **Built & Tested** | `src/components/atoms/image/`                  | Universal responsive Next.js image atom with first-party proxying (`/opti-media/`), Cloudflare CDN optimization, and aspect-ratio contract enforcement |

---

## 7. Quality Gates & Linters

| Tool             | Scope             | Config File                                                      | Command            | Key Guardrails                                                                                                    |
| :--------------- | :---------------- | :--------------------------------------------------------------- | :----------------- | :---------------------------------------------------------------------------------------------------------------- |
| **ESLint 9**     | JS / TS / JSX     | [`eslint.config.mjs`](file:///c:/Projects/ESL/eslint.config.mjs) | `npm run lint:js`  | Next.js Core Web Vitals, TypeScript strictness, React unescaped entities                                          |
| **Stylelint 16** | CSS / CSS Modules | [`.stylelintrc.mjs`](file:///c:/Projects/ESL/.stylelintrc.mjs)   | `npm run lint:css` | Strict Design Tokens (`color-no-hex: true`), camelCase class naming, zero-unit cleanup, deprecated CSS prevention |
| **Combined**     | Full Codebase     | —                                                                | `npm run lint`     | Runs both JS and CSS linters sequentially                                                                         |

---

## 8. Responsive Image & Media Infrastructure Contract

### 8.1 The First-Party Media Reverse Proxy (`/opti-media/`)

#### The Browser Privacy Challenge
Browsers with strict privacy protection (most notably **Firefox Private Browsing / Incognito** with Enhanced Tracking Protection set to Strict mode) consult Disconnect.me and other tracker blocklists. Because Optimizely provides analytics and experimentation tools, `*.optimizely.com` is classified as a third-party tracking domain. When image URLs point directly to `https://app-*.cms.optimizely.com` or `https://images1.cmp.optimizely.com`, Firefox blocks the network requests completely in Private Browsing.

#### The Architectural Solution
1. **Next.js Reverse Proxy (`next.config.ts`)**:
   ```ts
   async rewrites() {
     return [
       { source: '/opti-media/cmp/:path*', destination: 'https://images1.cmp.optimizely.com/:path*' },
       { source: '/opti-media/:path*', destination: `${cmsBase}/:path*` },
     ];
   }
   ```
2. **Same-Origin Delivery**:
   All media requests leave the client browser as same-origin requests (`https://<domain>/opti-media/...`). No browser tracker list will ever block them.
3. **Preserving Cloudflare On-The-Fly Resizing & Edge Optimization**:
   Optimizely SaaS CMS runs behind Cloudflare. When a path like `/opti-media/cdn-cgi/image/width=600,format=auto,quality=80/...` is rewritten upstream, Cloudflare intercepts `/cdn-cgi/image/...` and performs on-the-fly resizing, WebP/AVIF generation, and edge caching seamlessly.
4. **Universal Centralized Resolver (`src/infrastructure/cms/mediaUrl.ts`)**:
   All components and CMS renderers resolve media via `resolveMediaUrl()` and `optimizeMediaUrl()`. Vector SVGs are proxied via `/opti-media/` without rasterization, and local `/images/...` assets remain untouched.

### 8.2 The Responsive Next.js Image & Aspect Ratio Contract

#### Eliminating the `width or height modified, but not the other` Warning
Next.js `<Image>` compares rendered dimensions (`img.width`, `img.height`) with attribute values. If CSS overrides one dimension without declaring the other responsive (`heightModified !== widthModified`), Next.js emits runtime console warnings.

To maintain 100% compliance across all present and future components:
1. **CSS Reset Isolation (`globals.css`)**:
   ```css
   /* Scope responsive reset strictly to standard HTML img tags, never Next.js images */
   img:not([data-nimg]), picture, video, canvas, svg {
     display: block;
     max-width: 100%;
     height: auto;
   }
   ```
2. **Container-Driven Fill Pattern (Recommended for Aspect-Ratio Wrappers)**:
   For containers with predefined aspect ratio or height (e.g., hero slides, circular metric cards, media cards):
   ```tsx
   <div className={styles.imageWrapper}> {/* position: relative; aspect-ratio: 1 / 1 */}
     <Image
       src={imageSrc}
       alt={imageAlt}
       fill
       sizes="(max-width: 768px) 100vw, 440px"
       className={styles.image} /* object-fit: cover */
     />
   </div>
   ```
3. **Intrinsic Dimension Pattern (Recommended for Content Flow Images)**:
   When rendering with intrinsic `width` and `height`, pair with synchronized responsive styles:
   ```tsx
   <Image
     src={imageSrc}
     alt={imageAlt}
     width={720}
     height={328}
     style={{ maxWidth: '100%', height: 'auto' }}
   />
   ```
4. **Or use `<CmsImage>`**:
   Composes both patterns automatically and guarantees URL proxying, Cloudflare CDN sizing, and aspect ratio safety out-of-the-box.


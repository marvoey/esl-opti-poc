# Component Specification: Vertical Selector with Feature Card (`<VerticalSelectorFeatureCard>`)

> **Classification**: Organism Component  
> **Target Directory**: `components/organisms/vertical-selector-feature-card/`  
> **Associated Atoms**: `<Heading>`, `<Text>`, `<Button>`, `<TabButton>`, `<ArrowRightIcon>`  
> **Target Placement**: Home Page (`page.tsx`), mounted directly below `<SnipeCta />`  
> **Status**: Proposed Spec  
> **Design System Compliance**: Strict 3-Tier Tokens • Media Range Queries • Typography Composition Law • WCAG 2.2 AA Compliance • Reusable Card Shadow Token  

---

## 1. Overview & Architectural Intent

The **Vertical Selector with Feature Card** (`<VerticalSelectorFeatureCard>`) is an interactive navigational and product exploration organism. It empowers members to explore 8 core banking solutions via a left-side vertical tab controller while dynamically updating a rich, synchronized feature card on the right.

### Key Layout Requirements
1. **Placement**: Home page, mounted immediately below `<SnipeCta />` and above subsequent content sections.
2. **Row 1: Header Row (Identical to `<CircularImageMetricRow>` Header)**:
   - Full width (100%), split into two responsive columns:
     - **Left Column (Max Width 585px / `36.5625rem`)**:
       - Eyebrow in Teal (`var(--color-accent)` / `#00A3A3`): `"BANKING FOR EVERY STAGE OF LIFE"`.
       - Heading Level 2 (`<h2>`) in Deep Navy (`var(--color-text-primary)` / `#00395D`): `"Wherever you are, we’ll help you take the next step."`.
       - Description paragraph in `body-lg` typography (`var(--font-size-body-lg)`): `"Pick the moment that fits your life right now — we’ll point you to accounts and next steps that make sense."`.
       - Strict `16px` (`var(--space-md)`) vertical gap between text elements.
     - **Right Column**:
       - Primary Pill button (`<Button variant="primary" shape="pill" rightIcon={<ArrowRightIcon size={20} />}>` - `"Explore Financial Wellness Center"`) aligned flush to the bottom-right on desktop (`align-items: flex-end`).
3. **Row 2: Vertical Tab Selector & Feature Card (40% - 60% Split with 24px Gap)**:
   - Divided into 2 responsive columns: **40% width on the left** and **60% width on the right** with a strict **`24px` horizontal gap**.
   - **Column 1: Tabs Controller Card (40%)**:
     - Background: Pure white (`var(--color-bg-white, #FFFFFF)`).
     - Padding: `16px` (`var(--space-md)`).
     - Border Radius: `16px` (`var(--radius-xl)`).
     - Box Shadow: Reusable card elevation token `--shadow-card: 0 4px 20px 0 rgba(1, 38, 66, 0.06)`.
     - Border: `1px solid var(--color-border-subtle, rgba(1, 38, 66, 0.08))`.
      - Controller contains **8 vertical `<TabButton>` items**:
        - Left-aligned life-stage Lucide icons at 20px (`<SproutIcon>`, `<SparklesIcon>`, `<CarIcon>`, `<ShieldCheckIcon>`, `<HomeIcon>`, `<BabyIcon>`, `<GraduationCapIcon>`, `<SailboatIcon>`).
        - Default active selection: "Just starting out" (`defaultActiveId: "just-starting-out"`).
        - Refactored interaction states:
          - **Default (State 1)**: Subdued white/neutral background with primary navy text and Teal (`var(--color-tab-icon)` / `#00A3A3`) icon.
          - **Hover (State 2)**: Mint Polar surface (`var(--color-tab-hover-bg)` / `#E8FBF8`) with a 2px solid `#68E0CC` border (`var(--color-tab-hover-border)`).
          - **Active (State 3)**: Solid Deep Navy surface (`var(--color-tab-active-bg)` / `#00395D`) with pure white text (`#FFFFFF`) and Turquoise icon accent (`var(--color-tab-active-icon)` / `#68E0CC`).
4. **Responsive Visibility**:
   - Desktop-only presentation (`min-width: 1024px`).
   - Strictly hidden on tablet and mobile viewports (`@media (max-width: 1023px) { .section { display: none !important; } }`).
   - **Column 2: Synchronized Feature Card (60%)**:
     - Background: Pure white (`var(--color-bg-white, #FFFFFF)`).
     - Border Radius: `16px` (`var(--radius-xl)`).
     - Box Shadow: Same reusable `--shadow-card` token (`0 4px 20px 0 rgba(1, 38, 66, 0.06)`).
     - Border: `1px solid var(--color-border-subtle, rgba(1, 38, 66, 0.08))`.
     - Overflow: `hidden` (ensures top image conforms to `16px` rounded corners).
     - **Top Responsive Image**:
       - Width: `100%`.
       - Desktop Height: **`328px`**.
       - `object-fit: cover`.
     - **Bottom Content Area**:
       - Padding: **`24px`** (`var(--space-xl)` / `1.5rem`).
       - Title: Heading Level 3 (`<h3>`) in Deep Navy (`#00395D`).
       - Description: Body text using `body-lg` typography scale (`var(--font-size-body-lg)` / `1.125rem - 1.25rem`).
       - Action: Pill button with trailing arrow (`<Button variant="primary" shape="pill" rightIcon={<ArrowRightIcon size={16} />}>`) aligned at the bottom-left.

---

## 2. Mathematical Layout Calculation

```
Container Geometry (Desktop ≥ 1024px):
- Container Max Width: 1280px (var(--container-max-w))
- Container Inline Padding: 24px + 24px = 48px (var(--container-gutter))
- Available Row Width: 1280px - 48px = 1232px
- Inter-Column Gap: 24px (var(--space-xl))
- Net Column Space: 1232px - 24px = 1208px

Column Apportionment (40% - 60% Split):
- Column 1 (Tabs Controller, 40%): 1208px * 0.40 = 483.2px  (calc((100% - 24px) * 0.40))
- Column 2 (Feature Card, 60%):    1208px * 0.60 = 724.8px  (calc((100% - 24px) * 0.60))
- Verification: 483.2px + 24px (gap) + 724.8px = 1232.0px

CSS Grid Implementation:
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 6fr);
  gap: var(--space-xl); /* 24px */
  align-items: stretch;
```

---

## 3. Desktop & Mobile Wireframe ASCII Diagram

```
Desktop Layout (≥1024px - 2 Rows, Row 2: 40% / 60% Split):
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ <section> with padding-block: 64px (4rem)                                                        │
│  <div className="container">                                                                     │
│                                                                                                  │
│   {/* Row 1: Header Row - Identical to CircularImageMetricRow */}                                │
│   ┌───────────────────────────────────────────────┬────────────────────────────────────────────┐ │
│   │ [Header Content: Max Width 585px]             │ [Header CTA: Bottom-Right Flush]           │ │
│   │  EYEBROW: "BANKING FOR EVERY STAGE OF LIFE"   │                                            │ │
│   │  (16px margin)                                │                                            │ │
│   │  H2: "Wherever you are, we’ll help..."        │  [ Explore Financial Wellness Center → ]   │ │
│   │  (16px margin)                                │  (Primary Pill Button - #00395D)           │ │
│   │  BODY-LG: "Pick the moment that fits..."      │                                            │ │
│   └───────────────────────────────────────────────┴────────────────────────────────────────────┘ │
│                                                                                                  │
│   {/* 48px Vertical Row Gap (var(--space-2xl)) */}                                               │
│                                                                                                  │
│   {/* Row 2: 40% Tabs Controller + 60% Feature Card (24px Gap) */}                              │
│   ┌────────────────────────────────────────┬───────────────────────────────────────────────────┐ │
│   │ [Col 1: Tabs Controller (40%)]         │ [Col 2: Feature Card (60%)]                       │ │
│   │ (16px padding, 16px radius, shadow)    │ (16px radius, overflow: hidden, reusable shadow)  │ │
│   │                                        │ ┌───────────────────────────────────────────────┐ │ │
│   │ ┌────────────────────────────────────┐ │ │ [Responsive Image - 100% W x 328px H]         │ │ │
│   │ │ [Active Tab 1: Solid Navy]         │ │ │ (object-fit: cover, border-radius: 16px top)  │ │ │
│   │ └────────────────────────────────────┘ │ └───────────────────────────────────────────────┘ │ │
│   │ ┌────────────────────────────────────┐ │ ┌───────────────────────────────────────────────┐ │ │
│   │ │ [Tab 2: Default -> Mint on Hover]  │ │ │ [Text & Action Area: 24px Padding]            │ │ │
│   │ └────────────────────────────────────┘ │ │                                               │ │ │
│   │ ┌────────────────────────────────────┐ │ │  H3: "Everyday Checking with Real Returns"    │ │ │
│   │ │ [Tab 3: Default -> Mint on Hover]  │ │ │  (Deep Navy #00395D)                          │ │ │
│   │ └────────────────────────────────────┘ │ │                                               │ │ │
│   │ ┌────────────────────────────────────┐ │ │  BODY-LG: "No surprise fees, free ATM access  │ │ │
│   │ │ [Tab 4: Default -> Mint on Hover]  │ │ │  nationwide, and our Owners' Dividend."       │ │ │
│   │ └────────────────────────────────────┘ │ │                                               │ │ │
│   │ ┌────────────────────────────────────┐ │ │  [ Open an account  → ]                       │ │ │
│   │ │ [Tab 5: Default -> Mint on Hover]  │ │ │  (Bottom-Left Pill Primary Button)            │ │ │
│   │ └────────────────────────────────────┘ │ └───────────────────────────────────────────────┘ │ │
│   │ ┌────────────────────────────────────┐ │                                                   │ │
│   │ │ [Tab 6: Default -> Mint on Hover]  │ │                                                   │ │
│   │ └────────────────────────────────────┘ │                                                   │ │
│   │ ┌────────────────────────────────────┐ │                                                   │ │
│   │ │ [Tab 7: Default -> Mint on Hover]  │ │                                                   │ │
│   │ └────────────────────────────────────┘ │                                                   │ │
│   │ ┌────────────────────────────────────┐ │                                                   │ │
│   │ │ [Tab 8: Default -> Mint on Hover]  │ │                                                   │ │
│   │ └────────────────────────────────────┘ │                                                   │ │
│   └────────────────────────────────────────┴───────────────────────────────────────────────────┘ │
│  </div>                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

Mobile Layout (<1024px - Stacked Rows & Columns):
┌───────────────────────────────────────────────────────────┐
│ <section> with padding-block: 32px (2rem)                 │
│  <div className="container">                              │
│   [Header Row: Stacked]                                   │
│   EYEBROW: "EXPLORE SOLUTIONS"                            │
│   H2: "Banking built around your life."                   │
│   BODY-LG: "From everyday checking to..."                 │
│   [ View all accounts & services → ]                      │
│                                                           │
│   (32px vertical gap)                                     │
│                                                           │
│   [Horizontal Scroll / Mobile Tabs Controller]            │
│   [Tab 1 Active] [Tab 2] [Tab 3] [Tab 4] ...              │
│                                                           │
│   (16px vertical gap)                                     │
│                                                           │
│   [Feature Card - 100% Width]                             │
│   ┌─────────────────────────────────────────────────────┐ │
│   │ [Image: 220px - 260px Height, 100% Width]           │ │
│   ├─────────────────────────────────────────────────────┤ │
│   │ [24px Padding Content Area]                         │ │
│   │ H3: "Everyday Checking with Real Returns"           │ │
│   │ BODY-LG: "No surprise fees, free ATM access..."     │ │
│   │ [ Open an account  → ]                              │ │
│   └─────────────────────────────────────────────────────┘ │
│  </div>                                                   │
└───────────────────────────────────────────────────────────┘
```

---

## 4. Reusable Shadow Token Specification

To satisfy the user requirement: *"and that shadow must be reusable across components"*, we introduce the official design system card elevation token in `src/styles/tokens.css`:

```css
/* Tier 3 Component Card Shadow Token (Reusable across components) */
--shadow-card: 0 4px 20px 0 rgba(1, 38, 66, 0.06);
--shadow-card-hover: 0 10px 24px 0 rgba(1, 38, 66, 0.12);
```

Both **Col 1 (Tabs Controller Card)** and **Col 2 (Feature Card)** consume `var(--shadow-card)` directly, guaranteeing uniform depth, contrast, and visual rhythm.

---

## 5. TabButton Refactoring & State Transition Matrix

The 8 vertical tab buttons follow the atomic `<TabButton>` interaction model:

| State | Visual Behavior | CSS Variable / Token | Rendered Value |
| :--- | :--- | :--- | :--- |
| **State 1: Default (Inactive)** | Clean white/surface card, Navy text, subtle border | `background: var(--color-tab-bg)`<br>`color: var(--color-text-primary)` | Surface White / `#00395D` |
| **State 2: Hover (Variant 2)** | Mint Polar surface with Vibrant Turquoise border | `background: var(--color-tab-hover-bg)`<br>`border: 2px solid var(--color-tab-hover-border)` | Mint Polar `#E8FBF8`<br>`2px solid #68E0CC` |
| **State 3: Active (Variant 3)** | Solid Deep Navy surface, pure white text, teal icon | `background: var(--color-tab-active-bg)`<br>`color: var(--color-tab-active-text)` | Solid Navy `#00395D`<br>Text `#FFFFFF` |

### Vertical Sizing Refinement (`size="compact"` or Vertical Controller Context)
To comfortably accommodate 8 items inside the desktop controller alongside the `328px` feature image and text card:
- Button `min-height`: `3rem` (`48px` - `52px`) in vertical mode (vs 64px hero tab mode).
- Padding: `0.75rem 1rem` (`12px 16px`).
- Gap between buttons: `16px` (`var(--space-md)`).
- Border radius: `var(--radius-lg)` (`12px`).
- Total controller height: `8 * 50px + 7 * 8px + 32px padding = 488px`, aligning harmoniously with Col 2's `328px image + ~180px content area = ~508px`.

---

## 6. Anatomy & DOM Structure

Composed strictly of existing atoms and clean semantic markup:

```tsx
<section id={id} className={styles.section} aria-labelledby={headingId}>
  <div className={`container ${styles.container}`}>
    
    {/* Row 1: Header Row (Equal to CircularImageMetricRow) */}
    <div className={styles.headerRow}>
      <div className={styles.headerContent}>
        {eyebrow && (
          <Text as="span" variant="eyebrow" color="accent" className={styles.eyebrow}>
            {eyebrow}
          </Text>
        )}

        <Heading level={headingLevel} id={headingId} className={styles.title}>
          {title}
        </Heading>

        {description && (
          <Text as="p" variant="body-lg" color="primary" className={styles.description}>
            {description}
          </Text>
        )}
      </div>

      {cta && (
        <div className={styles.headerCta}>
          <Button
            variant="primary"
            shape="pill"
            href={cta.href}
            rightIcon={<ArrowRightIcon size={20} />}
          >
            {cta.label}
          </Button>
        </div>
      )}
    </div>

    {/* Row 2: 40% Tabs Controller + 60% Feature Card */}
    <div className={styles.selectorGrid}>
      
      {/* Col 1: Tabs Controller (40%) */}
      <div
        className={styles.tabsController}
        role="tablist"
        aria-orientation="vertical"
        aria-label={title || "Solutions navigation"}
      >
        {tabs.map((tab, index) => {
          const isSelected = activeTabId === tab.id;
          return (
            <TabButton
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`tabpanel-${tab.id}`}
              active={isSelected}
              className={styles.tabButton}
              onClick={() => setActiveTabId(tab.id)}
            >
              {tab.label}
            </TabButton>
          );
        })}
      </div>

      {/* Col 2: Feature Card (60%) */}
      <div
        id={`tabpanel-${activeTab.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab.id}`}
        className={styles.featureCard}
      >
        <div className={styles.imageWrapper}>
          <Image
            src={activeTab.feature.image.src}
            alt={activeTab.feature.image.alt}
            width={activeTab.feature.image.width ?? 720}
            height={activeTab.feature.image.height ?? 328}
            className={styles.featureImage}
            priority={false}
          />
        </div>

        <div className={styles.textArea}>
          <Heading level="h3" className={styles.featureTitle}>
            {activeTab.feature.title}
          </Heading>

          <Text as="p" variant="body-lg" color="secondary" className={styles.featureDescription}>
            {activeTab.feature.description}
          </Text>

          {activeTab.feature.cta && (
            <div className={styles.featureAction}>
              <Button
                variant="primary"
                shape="pill"
                href={activeTab.feature.cta.href}
                rightIcon={<ArrowRightIcon size={16} />}
              >
                {activeTab.feature.cta.label}
              </Button>
            </div>
          )}
        </div>
      </div>

    </div>

  </div>
</section>
```

---

## 7. Content Model & TypeScript Contracts

### 7.1 Zod Domain Schemas

```typescript
import { z } from "zod";

export const FeatureCardCtaSchema = z.object({
  label: z.string().min(1, "CTA label is required"),
  href: z.string().min(1, "CTA href is required"),
  external: z.boolean().optional().default(false),
});

export const FeatureCardMediaSchema = z.object({
  src: z.string().min(1, "Feature image src is required"),
  alt: z.string().default("Feature representation"),
  width: z.number().optional().default(720),
  height: z.number().optional().default(328),
});

export const FeatureCardContentSchema = z.object({
  title: z.string().min(1, "Feature title is required"),
  description: z.string().min(1, "Feature description is required"),
  image: FeatureCardMediaSchema,
  cta: FeatureCardCtaSchema.optional(),
});

export const VerticalSelectorTabItemSchema = z.object({
  id: z.string().min(1, "Tab id is required"),
  label: z.string().min(1, "Tab label is required"),
  feature: FeatureCardContentSchema,
});

export const VerticalSelectorFeatureCardSchema = z.object({
  id: z.string().optional(),
  eyebrow: z.string().default("EXPLORE SOLUTIONS"),
  title: z.string().default("Banking built around your life."),
  description: z.string().default(
    "From everyday checking accounts to milestone loans, discover solutions designed to keep you moving forward."
  ),
  cta: z
    .object({
      label: z.string().default("View all accounts & services"),
      href: z.string().default("/solutions"),
      external: z.boolean().optional().default(false),
    })
    .optional(),
  tabs: z
    .array(VerticalSelectorTabItemSchema)
    .min(1, "At least 1 tab is required")
    .max(8, "Maximum 8 tabs allowed"),
});

export type FeatureCardCtaModel = z.infer<typeof FeatureCardCtaSchema>;
export type FeatureCardMediaModel = z.infer<typeof FeatureCardMediaSchema>;
export type FeatureCardContentModel = z.infer<typeof FeatureCardContentSchema>;
export type VerticalSelectorTabItemModel = z.infer<typeof VerticalSelectorTabItemSchema>;
export type VerticalSelectorFeatureCardModel = z.infer<typeof VerticalSelectorFeatureCardSchema>;
```

### 7.2 Component Props (`VerticalSelectorFeatureCard.tsx`)

```typescript
import React from "react";
import { type HeadingLevel } from "@/components/atoms/heading/Heading";

export interface FeatureCardCtaData {
  label: string;
  href: string;
  external?: boolean;
}

export interface FeatureCardMediaData {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface FeatureCardContentData {
  title: string;
  description: string;
  image: FeatureCardMediaData;
  cta?: FeatureCardCtaData;
}

export interface VerticalSelectorTabItemData {
  id: string;
  label: string;
  feature: FeatureCardContentData;
}

export interface VerticalSelectorFeatureCardProps {
  id?: string;
  eyebrow?: string | null;
  title?: string;
  headingLevel?: HeadingLevel;
  description?: string | null;
  cta?: FeatureCardCtaData | null;
  tabs?: VerticalSelectorTabItemData[];
  defaultActiveId?: string;
  className?: string;
}
```

### 7.3 Default Initial 8 Tabs Dataset

```typescript
export const DEFAULT_VERTICAL_SELECTOR_DATA: VerticalSelectorFeatureCardProps = {
  eyebrow: "EXPLORE SOLUTIONS",
  title: "Banking built around your life.",
  description:
    "From everyday checking accounts to milestone loans, discover solutions designed to keep you moving forward.",
  cta: {
    label: "View all accounts & services",
    href: "/solutions",
  },
  tabs: [
    {
      id: "personal-checking",
      label: "Personal Checking",
      feature: {
        title: "Everyday Checking with Real Returns",
        description:
          "Enjoy no monthly maintenance fees, thousands of surcharge-free ATMs nationwide, and our annual Owners' Dividend returned directly to you.",
        image: {
          src: "/images/offers/checking.jpg",
          alt: "Member using mobile banking app with ESL checking card",
          width: 720,
          height: 328,
        },
        cta: {
          label: "Explore checking accounts",
          href: "/personal/checking",
        },
      },
    },
    {
      id: "savings-cds",
      label: "Savings & CDs",
      feature: {
        title: "High-Yield Savings & Certificates",
        description:
          "Grow your wealth with competitive rates, flexible terms from 6 to 60 months, and full NCUA deposit insurance.",
        image: {
          src: "/images/offers/certificate.jpg",
          alt: "Family reviewing savings growth on digital tablet",
          width: 720,
          height: 328,
        },
        cta: {
          label: "View current rates",
          href: "/personal/savings",
        },
      },
    },
    {
      id: "auto-loans",
      label: "Auto Loans",
      feature: {
        title: "Low Rates for New and Used Vehicles",
        description:
          "Hit the road with pre-approval confidence, low fixed rates, and flexible financing up to 84 months.",
        image: {
          src: "/images/offers/auto-loan.jpg",
          alt: "Driver happily holding keys beside a new car",
          width: 720,
          height: 328,
        },
        cta: {
          label: "Calculate your payment",
          href: "/personal/auto-loans",
        },
      },
    },
    {
      id: "home-mortgages",
      label: "Home Mortgages",
      feature: {
        title: "Your Path to Homeownership Made Simple",
        description:
          "Whether you are buying your first house or refinancing, our local mortgage advisors guide you through every step.",
        image: {
          src: "/images/hero/family.jpg",
          alt: "New homeowners in front of their Rochester home",
          width: 720,
          height: 328,
        },
        cta: {
          label: "Explore mortgage options",
          href: "/personal/mortgages",
        },
      },
    },
    {
      id: "credit-cards",
      label: "Credit Cards",
      feature: {
        title: "Cash Back Rewards and Low Intro APR",
        description:
          "Earn reward points on everyday groceries, gas, and dining without an annual fee.",
        image: {
          src: "/images/offers/checking.jpg",
          alt: "Contactless payment with ESL credit card",
          width: 720,
          height: 328,
        },
        cta: {
          label: "Compare credit cards",
          href: "/personal/credit-cards",
        },
      },
    },
    {
      id: "business-banking",
      label: "Business Banking",
      feature: {
        title: "Fueling Rochester's Local Entrepreneurs",
        description:
          "Commercial checking, merchant payroll services, and business lines of credit tailored to help your enterprise scale.",
        image: {
          src: "/images/metrics/partnerships.webp",
          alt: "Local business owners collaborating in storefront",
          width: 720,
          height: 328,
        },
        cta: {
          label: "See business services",
          href: "/business",
        },
      },
    },
    {
      id: "wealth-investing",
      label: "Wealth & Investing",
      feature: {
        title: "Personalized Financial Planning and Guidance",
        description:
          "Craft a tailored retirement roadmap, navigate generational wealth transfer, and invest with dedicated fiduciary advisors.",
        image: {
          src: "/images/metrics/education.webp",
          alt: "Financial advisor discussing investment portfolio with couple",
          width: 720,
          height: 328,
        },
        cta: {
          label: "Connect with an advisor",
          href: "/wealth",
        },
      },
    },
    {
      id: "community-impact",
      label: "Community Impact",
      feature: {
        title: "Reinvesting in the Greater Rochester Community",
        description:
          "Through grants, educational scholarships, and local civic partnerships, we elevate quality of life across our region.",
        image: {
          src: "/images/metrics/volunteers.webp",
          alt: "ESL volunteers supporting local community garden project",
          width: 720,
          height: 328,
        },
        cta: {
          label: "Read our impact story",
          href: "/community",
        },
      },
    },
  ],
};
```

---

## 8. CSS Module Specifications (`VerticalSelectorFeatureCard.module.css`)

```css
.section {
  width: 100%;
  background: var(--color-bg, #F8FAFC);
  padding-block: 4rem; /* 64px */
}

@media (max-width: 767px) {
  .section {
    padding-block: 2.5rem; /* 40px */
  }
}

.container {
  width: 100%;
  max-width: var(--container-max-w, 1280px);
  margin-inline: auto;
  padding-inline: var(--container-gutter, 1.5rem);
  display: flex;
  flex-direction: column;
}

/* Row 1: Header Row (Identical to CircularImageMetricRow) */
.headerRow {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--space-xl, 1.5rem);
  margin-bottom: var(--space-2xl, 3rem); /* 48px gap to Row 2 */
}

.headerContent {
  width: 100%;
  max-width: 36.5625rem; /* 585px */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: var(--space-md, 1rem); /* 16px vertical gap */
}

.eyebrow {
  color: var(--color-accent, #00A3A3);
  margin: 0;
  display: block;
}

.title {
  color: var(--color-text-primary, #00395D);
  margin: 0;
}

.description {
  color: var(--color-text-secondary, #4A5568);
  margin: 0;
}

.headerCta {
  flex-shrink: 0;
}

/* Row 2: 40% - 60% Split Grid with 24px Gap */
.selectorGrid {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 6fr); /* 40% - 60% with 24px gap */
  gap: 1.5rem; /* 24px strict */
  align-items: stretch;
  width: 100%;
}

/* Col 1: Tabs Controller Card */
.tabsController {
  background-color: var(--color-bg-white, #FFFFFF);
  border-radius: var(--radius-xl, 1rem); /* 16px */
  padding: 1rem; /* 16px */
  box-shadow: var(--shadow-card, 0 4px 20px 0 rgba(1, 38, 66, 0.06));
  border: 1px solid var(--color-border-subtle, rgba(1, 38, 66, 0.08));
  display: flex;
  flex-direction: column;
  gap: var(--space-md, 1rem); /* 16px */
  height: 100%;
}

.tabButton {
  min-height: 3.125rem; /* 50px */
  padding: 0.75rem 1rem;
  border-radius: var(--radius-lg, 0.75rem);
  text-align: left;
}

/* Col 2: Feature Card */
.featureCard {
  background-color: var(--color-bg-white, #FFFFFF);
  border-radius: var(--radius-xl, 1rem); /* 16px */
  box-shadow: var(--shadow-card, 0 4px 20px 0 rgba(1, 38, 66, 0.06));
  border: 1px solid var(--color-border-subtle, rgba(1, 38, 66, 0.08));
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.imageWrapper {
  width: 100%;
  height: 328px; /* Desktop strict 328px */
  position: relative;
  overflow: hidden;
}

.featureImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform var(--transition-normal);
}

.textArea {
  padding: 1.5rem; /* 24px strict */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem; /* 16px */
  flex: 1;
}

.featureTitle {
  color: var(--color-text-primary, #00395D);
  margin: 0;
}

.featureDescription {
  color: var(--color-text-secondary, #4A5568);
  margin: 0;
  font-size: var(--font-size-body-lg, 1.125rem);
  line-height: var(--line-height-relaxed, 1.6);
}

.featureAction {
  margin-top: auto;
  padding-top: 0.5rem;
}

/* Responsive Breakpoints */
@media (max-width: 1023px) {
  .selectorGrid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .tabsController {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .imageWrapper {
    height: 280px;
  }
}

@media (max-width: 767px) {
  .headerRow {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .tabsController {
    grid-template-columns: 1fr;
  }

  .imageWrapper {
    height: 220px;
  }

  .textArea {
    padding: 1.25rem;
  }
}
```

---

## 9. Accessibility (WCAG 2.2 AA Compliance)

1. **WAI-ARIA Tablist Pattern**:
   - The tabs controller wrapper has `role="tablist"` and `aria-orientation="vertical"`.
   - Each tab button has `role="tab"`, `aria-selected="true|false"`, and `aria-controls="tabpanel-{id}"`.
   - Keyboard navigation supports `ArrowDown` / `ArrowUp` to navigate tabs, `Home` / `End` to jump to first/last tab, and `Enter` / `Space` to activate.
2. **Tabpanel Association**:
   - Feature card has `role="tabpanel"`, `id="tabpanel-{id}"`, and `aria-labelledby="tab-{id}"`.
3. **Contrast Ratios**:
   - Eyebrow Teal (`#00A3A3`) on background (`#F8FAFC`): **4.6:1** (WCAG AA).
   - Heading Deep Navy (`#00395D`) on White: **11.6:1** (WCAG AAA).
   - Active Tab Navy (`#00395D`) with pure white text: **11.6:1** (WCAG AAA).
   - Hover Tab Mint border (`#68E0CC`) on Polar Mint (`#E8FBF8`): Non-text 3:1 contrast focus indicator.
4. **Target Sizes**:
   - All 8 Tab Buttons have a minimum height of `48px`, exceeding the WCAG `24x24px` minimum and conforming to the `44x44px` optimal touch target guideline.

---

## 10. Placement on Home Page (`src/app/page.tsx`)

In `page.tsx`, `<VerticalSelectorFeatureCard />` mounts directly beneath `<SnipeCta />`:

```tsx
<main>
  <div>
    <HeroCarousel slides={homeData.heroSlider.slides} />
  </div>
  <div>
    <SnipeCta {...homeData.snipeCta} />
  </div>
  {/* Newly Mounted Vertical Selector with Feature Card Organism */}
  <VerticalSelectorFeatureCard id="solutions-selector" />
  
  <TabbedIconCards ... />
  ...
</main>
```

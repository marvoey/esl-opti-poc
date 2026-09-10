import React from "react";
import { getNavigationQuery } from "@/application/queries/getNavigationQuery";
import { Header } from "@/components/header/Header";
import {
  Display,
  Heading,
  Text,
  Eyebrow,
  Stat,
  Button,
  UserIcon,
  ArrowRightIcon,
  CoinsIcon,
  FilterChip,
  TabButton,
  Badge,
  QuickLink,
  QuickLinkSimple,
  QuickLinkLarge,
  IconContentCard,
  ProcessCard,
  TestimonialCard,
  RatesCard,
  BasicsTile,
  BasicsTileGrid,
  TextLink,
} from "@/components/atoms";
import styles from "./page.module.css";

export default async function HomePage() {
  // Pure server-side query consuming the Application Port
  const navigation = await getNavigationQuery();

  const pillars = [
    {
      index: "01",
      title: "Anti-Corruption Layer",
      desc: "Simulated CMS adapter today, CMS tomorrow. Domain models and UI components are strictly insulated from vendor payloads.",
    },
    {
      index: "02",
      title: "Intrinsic Design Tokens",
      desc: "Zero media-query fragility. Layouts scale smoothly via CSS Grid, Flexbox, @container queries, and clamp() mathematical curves.",
    },
    {
      index: "03",
      title: "Zero Reflow & Leak Discipline",
      desc: "React Server Components by default. Compositor-only GPU transitions (transform/opacity) and strict lifecycle cleanup.",
    },
    {
      index: "04",
      title: "Spec-Driven Development",
      desc: "Every capability starts with a validated contract in openspec/ and a verified test suite before any application code is touched.",
    },
  ];

  return (
    <div className={styles.mainWrapper}>
      <Header navigation={navigation} />

      <main className={styles.contentContainer}>
        {/* Hero Section using Display, Eyebrow, and Button Atoms */}
        <section className={styles.heroSection}>
          <Eyebrow color="brand">Enterprise Architecture Ready</Eyebrow>
          <Display as="h1">Building products with beautiful, functional systems.</Display>
          <Text variant="subhead" className={styles.heroSubtitle}>
            A decoupled, media-query agnostic, high-performance architecture built for seamless headless CMS integration.
          </Text>
          <div className={styles.buttonGroup}>
            <Button variant="primary" leftIcon={<UserIcon />}>
              Sign In
            </Button>
            <Button variant="primary" rightIcon={<ArrowRightIcon />}>
              Learn more about joining ESL
            </Button>
            <Button variant="outline" leftIcon={<UserIcon />}>
              Become a member
            </Button>
          </div>
        </section>

        {/* Macro Grid using Heading & Text Atoms */}
        <section className={styles.pillarsGrid} aria-label="Architecture Pillars">
          {pillars.map((pillar) => (
            <article key={pillar.index} className={styles.pillarCard}>
              <div className={styles.pillarHeader}>
                <span className={styles.pillarIndex}>{pillar.index}</span>
                <Heading level="h4">{pillar.title}</Heading>
              </div>
              <Text variant="body-sm">{pillar.desc}</Text>
            </article>
          ))}
        </section>

        {/* Unified Live Component Matrix Section (All Figma Variants in One Single Grid) */}
        <section className={styles.specimenSection} aria-label="Figma Button & Component Matrix">
          <div className={styles.specimenHeader}>
            <Eyebrow color="accent">WCAG 2.2 AA Verified Design Tokens</Eyebrow>
            <Heading level="h2">Figma Button & Component Matrix</Heading>
            <Text variant="body">
              All 12 interactive variants from Figma unified in one matrix with dynamic intrinsic hugging, 4px grid rhythm, accessible focus rings, and 300ms ease-out hover motion.
            </Text>
          </div>

          <div className={styles.buttonShowcaseGrid}>
            {/* 1. Button Icon Primary */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA VARIANT 1</Text>
                <Heading level="h4">Button Icon Primary</Heading>
                <Text variant="caption">Primary Navy fill • Left User icon • Pill radius</Text>
              </div>
              <Button variant="primary" leftIcon={<UserIcon />}>
                Sign In
              </Button>
            </div>

            {/* 2. Pill button arrow primary */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA VARIANT 2</Text>
                <Heading level="h4">Pill button arrow primary</Heading>
                <Text variant="caption">Primary Navy fill • Right Arrow icon • Dynamic text hug</Text>
              </div>
              <Button variant="primary" rightIcon={<ArrowRightIcon />}>
                Learn more about joining ESL
              </Button>
            </div>

            {/* 3. Pill Button Secondary Icon */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA VARIANT 3</Text>
                <Heading level="h4">Pill Button Secondary Icon</Heading>
                <Text variant="caption">Secondary Mint Polar fill • Left User icon • 11.4:1 contrast</Text>
              </div>
              <Button variant="secondary" leftIcon={<UserIcon />}>
                Sign In
              </Button>
            </div>

            {/* 4. Form card button */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA VARIANT 4</Text>
                <Heading level="h4">Form card button</Heading>
                <Text variant="caption">Compact size (44px floor) • Right Arrow icon • Form rhythm</Text>
              </div>
              <Button variant="primary" size="sm" rightIcon={<ArrowRightIcon />}>
                Sign In
              </Button>
            </div>

            {/* 5. Pill Button tertiary Icon */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA VARIANT 5</Text>
                <Heading level="h4">Pill Button tertiary Icon</Heading>
                <Text variant="caption">Outline Navy border • Left User icon • 12.4:1 contrast</Text>
              </div>
              <Button variant="outline" leftIcon={<UserIcon />}>
                Become a member
              </Button>
            </div>

            {/* 6. Pill button arrow secondary */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA VARIANT 6</Text>
                <Heading level="h4">Pill button arrow secondary</Heading>
                <Text variant="caption">Secondary Mint Polar fill • Right Arrow icon • Dynamic text hug</Text>
              </div>
              <Button variant="secondary" rightIcon={<ArrowRightIcon />}>
                Learn more about joining ESL
              </Button>
            </div>

            {/* 7. Secondary Button */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA VARIANT 7</Text>
                <Heading level="h4">Secondary Button</Heading>
                <Text variant="caption">Outline Navy border • Pill radius • Hover Turquoise fill</Text>
              </div>
              <Button variant="outline">
                View All Rates
              </Button>
            </div>

            {/* 8. Simple Link */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA VARIANT 8</Text>
                <Heading level="h4">Simple Link</Heading>
                <Text variant="caption">Zero-border text link • Right arrow glide on hover</Text>
              </div>
              <Button variant="link" rightIcon={<ArrowRightIcon />}>
                Sign In
              </Button>
            </div>

            {/* 9. Taxonomy Dark */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA VARIANT 9</Text>
                <Heading level="h4">Taxonomy Dark (Badges)</Heading>
                <Text variant="caption">Aqua tint and neutral metadata indicator pills</Text>
              </div>
              <div className={styles.componentRow}>
                <Badge variant="aqua">Limited Time</Badge>
                <Badge variant="neutral">Limited Time</Badge>
              </div>
            </div>

            {/* 10. Filter chip */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA VARIANT 10</Text>
                <Heading level="h4">Filter Chip</Heading>
                <Text variant="caption">Selectable pill control: Default vs Active Selected</Text>
              </div>
              <div className={styles.componentRow}>
                <FilterChip>Keeping it simple</FilterChip>
                <FilterChip selected>Keeping it simple</FilterChip>
              </div>
            </div>

            {/* 11. Tab Button Desktop */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA VARIANT 11</Text>
                <Heading level="h4">Tab Button Desktop</Heading>
                <Text variant="caption">Card tab: Default Inactive, Hover (2px Turquoise border), and Active</Text>
              </div>
              <div className={styles.componentStack}>
                <TabButton icon={<CoinsIcon />}>Just starting out</TabButton>
                <TabButton icon={<CoinsIcon />} variant="hover">Just starting out</TabButton>
                <TabButton icon={<CoinsIcon />} active>Just starting out</TabButton>
              </div>
            </div>

            {/* 12. Quick Link Aqua Mobile */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA VARIANT 12</Text>
                <Heading level="h4">Quick Link Aqua Mobile</Heading>
                <Text variant="caption">Row card with image placeholder, label, and trailing arrow</Text>
              </div>
              <div className={styles.componentStack}>
                <QuickLink title="Customer Service" href="/customer-service" />
              </div>
            </div>

            {/* 13. Text link dark */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA VARIANT 13</Text>
                <Heading level="h4">Text Link Dark</Heading>
                <Text variant="caption">Navy text on light surface • Smooth underline reveal on hover</Text>
              </div>
              <div className={styles.componentStack}>
                <TextLink href="/customer-service">Customer Service</TextLink>
              </div>
            </div>

            {/* 14. Text link light */}
            <div className={`${styles.buttonCard} ${styles.buttonCardDark}`}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA VARIANT 14</Text>
                <Heading level="h4">Text Link Light</Heading>
                <Text variant="caption">
                  White text on dark surface • Transitions to turquoise on hover
                </Text>
              </div>
              <div className={styles.componentStack}>
                <TextLink href="/customer-service" variant="light">
                  Customer Service
                </TextLink>
              </div>
            </div>

            {/* 15. Quick Link Simple (2 Variants) */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA: QUICK LINK SIMPLE</Text>
                <Heading level="h4">Quick Link Simple (2 Variants)</Heading>
                <Text variant="caption">
                  Vertical card • Default (White) vs Variant2 (Navy/Turquoise ring & glow shadow)
                </Text>
              </div>
              <div className={styles.componentRow}>
                <QuickLinkSimple
                  title="Customer Service"
                  href="/customer-service"
                  variant="default"
                />
                <QuickLinkSimple
                  title="Customer Service"
                  href="/customer-service"
                  variant="inverse"
                />
              </div>
            </div>

            {/* 16. Icon content cards (2 Variants) */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA: ICON CONTENT CARDS</Text>
                <Heading level="h4">Icon Content Cards (2 Variants)</Heading>
                <Text variant="caption">
                  Editorial card with icon badge, title, description, and interactive arrow CTA
                </Text>
              </div>
              <div className={styles.componentRow}>
                <IconContentCard
                  title="Customer Service"
                  description="Lorem ipsum if needed here"
                  ctaText="CTA here"
                  href="/customer-service"
                  variant="default"
                />
                <IconContentCard
                  title="Customer Service"
                  description="Lorem ipsum if needed here"
                  ctaText="CTA here"
                  href="/customer-service"
                  variant="inverse"
                />
              </div>
            </div>

            {/* 17. Quick Link Large (2 Variants) */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA: QUICK LINK LARGE</Text>
                <Heading level="h4">Quick Link Large (2 Variants)</Heading>
                <Text variant="caption">
                  High-emphasis card • Default (White) vs Active (Turquoise ring, glow shadow & title underline)
                </Text>
              </div>
              <div className={styles.componentRow}>
                <QuickLinkLarge
                  title="Customer Service"
                  href="/customer-service"
                  variant="default"
                />
                <QuickLinkLarge
                  title="Customer Service"
                  href="/customer-service"
                  variant="active"
                />
              </div>
            </div>

            {/* 18. Process (2 Variants) */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA: PROCESS</Text>
                <Heading level="h4">Process Step Cards (2 Variants)</Heading>
                <Text variant="caption">
                  Horizontal step card • Mint (Default) vs Neutral (Slate/Turquoise badge)
                </Text>
              </div>
              <div className={styles.componentStack}>
                <ProcessCard
                  step={1}
                  title="Open your new account"
                  description="Start online or in a branch — about 10 minutes."
                  variant="neutral"
                  badgeTextColor="#68E0CC"
                  badgeBackgroundColor="#68E0CC2E"
                />
                <ProcessCard
                  step={1}
                  title="Open your new account"
                  description="Start online or in a branch — about 10 minutes."
                  variant="mint"
                  badgeTextColor="#00A3A3"
                  badgeBackgroundColor="#68E0CC2E"
                />
              </div>
            </div>

            {/* 19. Testimonial Card (Video Lightbox & Static Thumbnail) */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA: TESTIMONIAL CARD</Text>
                <Heading level="h4">Testimonial Card</Heading>
                <Text variant="caption">
                  Performance-optimized facade • Static thumbnail on load with video lightbox on click
                </Text>
              </div>
              <div className={styles.componentStack}>
                <TestimonialCard
                  imageSrc="/images/testimonials/marcia.png"
                  imageAlt="Marcia, café owner"
                  videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  videoTitle="Marcia's Business Growth Story"
                  title="Expanded her business"
                  quote="Their business banking solutions helped me grow my company. Exceptional service and competitive rates."
                  author={{
                    name: "Marcia",
                    role: "café owner",
                    location: "Finger Lakes",
                  }}
                />
              </div>
            </div>

            {/* 20. Rates Card Aqua (2 Variants) */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA: RATES CARD AQUA</Text>
                <Heading level="h4">Rates Card Aqua (2 Variants)</Heading>
                <Text variant="caption">
                  High-impact rate highlight • Default (Navy surface) vs Active (Luminous turquoise border & glow)
                </Text>
              </div>
              <div className={styles.componentRow}>
                <RatesCard
                  category="Getting on the road"
                  rate="1.99"
                  rateUnit="%"
                  rateLabel="APR"
                  title="Auto loans"
                  description="A loan that fits your life, and help finding the right option."
                  ctaText="Explore auto loans"
                  href="/auto-loans"
                  variant="default"
                />
                <RatesCard
                  category="Getting on the road"
                  rate="1.99"
                  rateUnit="%"
                  rateLabel="APR"
                  title="Auto loans"
                  description="A loan that fits your life, and help finding the right option."
                  ctaText="Explore auto loans"
                  href="/auto-loans"
                  variant="active"
                />
              </div>
            </div>

            {/* 21. Basics Tile - Atom Variations (Figma Image 1) */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA: BASICS TILE (ATOM)</Text>
                <Heading level="h4">Basics Tile (Size & Order Props)</Heading>
                <Text variant="caption">
                  Single component configured via props • Large Value (Callout-first) vs Medium Value (Value-first)
                </Text>
              </div>
              <div className={styles.componentRow}>
                <div style={{ maxWidth: 200 }}>
                  <BasicsTile
                    callout="Lorem callout"
                    value="XX"
                    description="Descriptive quick content"
                    valueSize="lg"
                    order="callout-first"
                    showDivider
                  />
                </div>
                <div style={{ maxWidth: 200 }}>
                  <BasicsTile
                    callout="Lorem callout"
                    value="XX"
                    description="Descriptive quick content"
                    valueSize="md"
                    order="value-first"
                    showDivider
                  />
                </div>
              </div>
            </div>

            {/* 22. Basics Tile Set - Desktop Row (Figma Image 2) */}
            <div className={styles.buttonCard} style={{ gridColumn: "1 / -1" }}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA: BASICS TILE SET (DESKTOP)</Text>
                <Heading level="h4">The basics, at a glance (Horizontal Row)</Heading>
                <Text variant="caption">
                  Large set of tiles in a single track with vertical interior dividers
                </Text>
              </div>
              <BasicsTileGrid
                title="The basics, at a glance"
                subtitle="Applies to every savings account"
                layout="row"
              >
                <BasicsTile callout="Lorem callout" value="XX" description="Descriptive quick content" />
                <BasicsTile callout="Lorem callout" value="XX" description="Descriptive quick content" />
                <BasicsTile callout="Lorem callout" value="XX" description="Descriptive quick content" />
                <BasicsTile callout="Lorem callout" value="XX" description="Descriptive quick content" />
                <BasicsTile callout="Lorem callout" value="XX" description="Descriptive quick content" />
                <BasicsTile callout="Lorem callout" value="XX" description="Descriptive quick content" />
              </BasicsTileGrid>
            </div>

            {/* 23. Basics Tile Grid - Mobile 2-Column Approach (Figma Image 3) */}
            <div className={styles.buttonCard}>
              <div className={styles.buttonCardHeader}>
                <Text variant="micro">FIGMA: BASICS TILE GRID (MOBILE)</Text>
                <Heading level="h4">The basics, at a glance (Mobile 2x2 Grid)</Heading>
                <Text variant="caption">
                  2 tiles side-by-side with interior crosshair borders and no outer borders
                </Text>
              </div>
              <div className={styles.mobileFrame}>
                <BasicsTileGrid
                  title="The basics, at a glance"
                  subtitle="Applies to both checking accounts"
                  layout="grid2"
                >
                  <BasicsTile callout="Lorem callout" value="XX" description="Descriptive quick content" />
                  <BasicsTile callout="Lorem callout" value="XX" description="Descriptive quick content" />
                  <BasicsTile callout="Lorem callout" value="XX" description="Descriptive quick content" />
                  <BasicsTile callout="Lorem callout" value="XX" description="Descriptive quick content" />
                </BasicsTileGrid>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Specimen Section verifying exact spec levels */}
        <section className={styles.specimenSection} aria-label="Typography Scale Specimen">
          <div className={styles.specimenHeader}>
            <Eyebrow color="brand">Design System Core</Eyebrow>
            <Heading level="h2">Typography Scale Atoms</Heading>
          </div>

          <div className={styles.specimenCard}>
            <div className={styles.specimenRow}>
              <div className={styles.specimenMeta}>
                <Text variant="micro">H1 DESKTOP / MOBILE</Text>
                <Text variant="micro">Albert Sans 700 • 34px-52px / 40px-60px LH</Text>
              </div>
              <Heading level="h1">The quick brown fox jumps over the lazy dog.</Heading>
            </div>

            <div className={styles.specimenRow}>
              <div className={styles.specimenMeta}>
                <Text variant="micro">H2 DESKTOP / MOBILE</Text>
                <Text variant="micro">Albert Sans 700 • 28px-40px / 36px-48px LH</Text>
              </div>
              <Heading level="h2">Design systems bridge the gap between design & dev.</Heading>
            </div>

            <div className={styles.specimenRow}>
              <div className={styles.specimenMeta}>
                <Text variant="micro">H3 DESKTOP / MOBILE</Text>
                <Text variant="micro">Albert Sans 700 • 22px-28px / 28px-36px LH</Text>
              </div>
              <Heading level="h3">Design systems bridge the gap between design & dev.</Heading>
            </div>

            <div className={styles.specimenRow}>
              <div className={styles.specimenMeta}>
                <Text variant="micro">H4 DESKTOP / MOBILE</Text>
                <Text variant="micro">Albert Sans 700 • 20px / 24px LH</Text>
              </div>
              <Heading level="h4">Design systems bridge the gap between design & dev.</Heading>
            </div>

            <div className={styles.specimenRow}>
              <div className={styles.specimenMeta}>
                <Text variant="micro">STAT VALUE</Text>
                <Text variant="micro">Albert Sans 700 • 40px-60px / 44px-64px LH</Text>
              </div>
              <Stat>12,480</Stat>
            </div>

            <div className={styles.specimenRow}>
              <div className={styles.specimenMeta}>
                <Text variant="micro">SUBHEAD & BODY LARGE</Text>
                <Text variant="micro">Albert Sans 400/500 • 18px-24px / 16px-20px</Text>
              </div>
              <Text variant="subhead">Design systems bridge the gap between design & dev.</Text>
              <Text variant="body-lg">
                A well-defined scale helps maintain rhythm across pages. This body copy demonstrates comfortable line hierarchy and contrast against neutral surfaces.
              </Text>
            </div>

            <div className={styles.specimenRow}>
              <div className={styles.specimenMeta}>
                <Text variant="micro">BODY DESKTOP / MOBILE</Text>
                <Text variant="micro">Albert Sans 400 • 16px / 24px LH</Text>
              </div>
              <Text variant="body">
                A well-defined scale helps maintain rhythm across pages. This body copy demonstrates comfortable line hierarchy and contrast against neutral surfaces.
              </Text>
            </div>

            <div className={styles.specimenRow}>
              <div className={styles.specimenMeta}>
                <Text variant="micro">BODY SMALL DESKTOP / MOBILE</Text>
                <Text variant="micro">Albert Sans 400 • 14px / 20px LH</Text>
              </div>
              <Text variant="body-sm">
                This smaller variation is optimized for sidebars, metadata summaries, nested information blocks, and utility tooltips.
              </Text>
            </div>

            <div className={styles.specimenRow}>
              <div className={styles.specimenMeta}>
                <Text variant="micro">LABEL DESKTOP / MOBILE</Text>
                <Text variant="micro">Albert Sans 600 • 18px / 28px LH</Text>
              </div>
              <Text variant="label">CONFIRM PAYMENT METHOD</Text>
            </div>

            <div className={styles.specimenRow}>
              <div className={styles.specimenMeta}>
                <Text variant="micro">CAPTION DESKTOP / MOBILE</Text>
                <Text variant="micro">Albert Sans 400 • 14px / 16px LH</Text>
              </div>
              <Text variant="caption">Fig 4.2: Typography token mapping on 4px grid increments.</Text>
            </div>

            <div className={styles.specimenRow}>
              <div className={styles.specimenMeta}>
                <Text variant="micro">MICRO DESKTOP / MOBILE</Text>
                <Text variant="micro">Albert Sans 600 • 12px / 16px LH</Text>
              </div>
              <Text variant="micro">Fig 4.2: Typography token mapping on 4px grid increments.</Text>
            </div>

            <div className={styles.specimenRow}>
              <div className={styles.specimenMeta}>
                <Text variant="micro">MULTI-COLOR EYEBROWS</Text>
                <Text variant="micro">League Spartan 700 • Brand, Accent & Vibrant</Text>
              </div>
              <div className={styles.eyebrowGroup}>
                <Eyebrow color="brand">BRAND INTENT (#00395D)</Eyebrow>
                <Eyebrow color="accent">ACCENT INTENT (#00A3A3)</Eyebrow>
                <Eyebrow color="vibrant">VIBRANT INTENT (#68E0CC)</Eyebrow>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footerBar}>
        <Text variant="caption">Built with Next.js App Router • Strict TypeScript • Pure Design Tokens</Text>
      </footer>
    </div>
  );
}

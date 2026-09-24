import React from "react";
import {
  Heading,
  Text,
  QuickLinkSimple,
  QuickLinkLarge,
  IconContentCard,
  ProcessCard,
  TestimonialCard,
  RatesCard,
  BasicsTile,
  BasicsTileGrid,
} from "@/components/atoms";
import styles from "../page.module.css";

export function CardSpecimens() {
  return (
    <>
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
          <div className={styles.iconContentCardDemo}>
            <IconContentCard
              title="Customer Service"
              description="Lorem ipsum if needed here"
              ctaText="CTA here"
              href="/customer-service"
              variant="default"
            />
          </div>
          <div className={styles.iconContentCardDemo}>
            <IconContentCard
              title="Customer Service"
              description="Lorem ipsum if needed here"
              ctaText="CTA here"
              href="/customer-service"
              variant="inverse"
            />
          </div>
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
    </>
  );
}

import type { Metadata } from "next";
import React from "react";
import { HeroCarousel } from "@/components/organisms/hero-carousel/HeroCarousel";
import { PRODUCT_DETAIL_HERO_SLIDES } from "@/components/organisms/hero-carousel/heroSlides";
import { SnipeCta } from "@/components/organisms/snipe-cta/SnipeCta";
import { KeyFactsRow } from "@/components/organisms/key-facts-row";
import { FeatureCardRow } from "@/components/organisms/feature-card-row";
import { DEFAULT_FEATURE_CARD_ROW_PROPS } from "@/components/organisms/feature-card-row/featureCardRowData";
import { ProductCardsRow } from "@/components/organisms/product-cards-row";
import { DEFAULT_PRODUCT_CARDS_ROW_PROPS } from "@/components/organisms/product-cards-row/productCardsRowData";
import { ProductCardsRowVariant2 } from "@/components/organisms/product-cards-row-variant-2";
import { DEFAULT_PRODUCT_CARDS_ROW_VARIANT_2_PROPS } from "@/components/organisms/product-cards-row-variant-2/productCardsRowVariant2Data";
import { FaqStates } from "@/components/organisms/faq-states";
import { DEFAULT_FAQ_STATES_PROPS } from "@/components/organisms/faq-states/faqStatesData";
import { AccordionCardGrid } from "@/components/organisms/accordion-card-grid";
import { DEFAULT_ACCORDION_CARD_GRID_PROPS } from "@/components/organisms/accordion-card-grid/accordionCardGridData";
import { SwitchSupport } from "@/components/organisms/switch-support";
import { DEFAULT_SWITCH_SUPPORT_PROPS } from "@/components/organisms/switch-support/switchSupportData";
import { SplitContentCta } from "@/components/organisms/split-content-cta";
import { DEFAULT_SPLIT_CONTENT_CTA_PROPS } from "@/components/organisms/split-content-cta/splitContentCtaData";
import { Disclosure } from "@/components/organisms/disclosure";
import { DEFAULT_DISCLOSURE_PROPS } from "@/components/organisms/disclosure/disclosureData";
import styles from "./product-detail.module.css";

export const metadata: Metadata = {
  title: "Premier Checking | ESL Federal Credit Union",
  description:
    "Checking that gives a little back. Everything you use day to day, plus a balance that earns dividends and our member-only Owners’ Dividend.",
};

export default function ProductDetailPage() {
  return (
    <main>
      <HeroCarousel
        variant="squared"
        slides={PRODUCT_DETAIL_HERO_SLIDES}
        ariaLabel="Premier Checking product hero"
      />
      <SnipeCta className={styles.snipeCta} />
      <KeyFactsRow
        id="key-facts"
        title="Details at a glance"
        subtitle="Applies to both checking accounts"
      />
      <FeatureCardRow {...DEFAULT_FEATURE_CARD_ROW_PROPS} />
      <ProductCardsRow id="product-fit" {...DEFAULT_PRODUCT_CARDS_ROW_PROPS} />
      <ProductCardsRowVariant2
        id="account-tools"
        {...DEFAULT_PRODUCT_CARDS_ROW_VARIANT_2_PROPS}
      />
      <FaqStates id="faq" {...DEFAULT_FAQ_STATES_PROPS} />
      <AccordionCardGrid id="glossary" {...DEFAULT_ACCORDION_CARD_GRID_PROPS} />
      <SwitchSupport id="switch-support" {...DEFAULT_SWITCH_SUPPORT_PROPS} />
      <SplitContentCta id="split-content-cta" {...DEFAULT_SPLIT_CONTENT_CTA_PROPS} />
      <Disclosure id="disclosure" {...DEFAULT_DISCLOSURE_PROPS} />
    </main>
  );
}


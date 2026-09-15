import type { Metadata } from "next";
import React from "react";
import { HeroCarousel } from "@/components/organisms/hero-carousel/HeroCarousel";
import { PRODUCT_DETAIL_HERO_SLIDES } from "@/components/organisms/hero-carousel/heroSlides";

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
    </main>
  );
}


import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import EmblaCarousel from "embla-carousel";
import type { EmblaOptionsType } from "embla-carousel";
import { REDUCED_MOTION_QUERY, withReducedMotion } from "./emblaMotion";

const emblaOptionsSpy = vi.hoisted(() => vi.fn());

vi.mock("embla-carousel-react", () => ({
  default: (options?: EmblaOptionsType) => {
    emblaOptionsSpy(options);
    return [vi.fn(), undefined];
  },
}));

// vi.mock is hoisted above every import, so the organism receives the spy instead of the real hook.
import { OfferCardRow } from "@/components/organisms/offer-card-row/OfferCardRow";

function mockMatchMedia(matchingQuery: string | null) {
  const original = window.matchMedia;
  window.matchMedia = ((query: string) => ({
    matches: query === matchingQuery,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
  return () => {
    window.matchMedia = original;
  };
}

function createCarouselNode() {
  const root = document.createElement("div");
  const container = document.createElement("div");
  for (let i = 0; i < 3; i++) container.appendChild(document.createElement("div"));
  root.appendChild(container);
  document.body.appendChild(root);
  return root;
}

describe("withReducedMotion", () => {
  let restoreMatchMedia: (() => void) | undefined;

  afterEach(() => {
    restoreMatchMedia?.();
    restoreMatchMedia = undefined;
    document.body.innerHTML = "";
  });

  it("targets the prefers-reduced-motion: reduce media query", () => {
    expect(REDUCED_MOTION_QUERY).toBe("(prefers-reduced-motion: reduce)");
  });

  it("keeps the given options and makes programmatic scrolls instant under reduced motion", () => {
    const options = withReducedMotion({ align: "start", loop: true });

    expect(options.align).toBe("start");
    expect(options.loop).toBe(true);
    expect(options.breakpoints?.[REDUCED_MOTION_QUERY]).toEqual({ duration: 0 });
  });

  it("preserves existing breakpoints", () => {
    const options = withReducedMotion({
      breakpoints: {
        "(min-width: 768px)": { slidesToScroll: 2 },
        [REDUCED_MOTION_QUERY]: { dragFree: true },
      },
    });

    expect(options.breakpoints?.["(min-width: 768px)"]).toEqual({ slidesToScroll: 2 });
    expect(options.breakpoints?.[REDUCED_MOTION_QUERY]).toEqual({ dragFree: true, duration: 0 });
  });

  it("resolves an instant scroll duration in Embla when the user prefers reduced motion", () => {
    restoreMatchMedia = mockMatchMedia(REDUCED_MOTION_QUERY);
    const embla = EmblaCarousel(createCarouselNode(), withReducedMotion({ duration: 25 }));

    expect(embla.internalEngine().options.duration).toBe(0);
    embla.destroy();
  });

  it("keeps the animated scroll duration when the user has no motion preference", () => {
    restoreMatchMedia = mockMatchMedia(null);
    const embla = EmblaCarousel(createCarouselNode(), withReducedMotion({ duration: 25 }));

    expect(embla.internalEngine().options.duration).toBe(25);
    embla.destroy();
  });
});

describe("carousel organisms honor reduced motion", () => {
  afterEach(() => {
    emblaOptionsSpy.mockClear();
  });

  it("OfferCardRow passes the reduced-motion breakpoint to Embla", () => {
    render(<OfferCardRow />);

    const options = emblaOptionsSpy.mock.calls[0][0] as EmblaOptionsType;
    expect(options.breakpoints?.[REDUCED_MOTION_QUERY]).toEqual({ duration: 0 });
  });
});

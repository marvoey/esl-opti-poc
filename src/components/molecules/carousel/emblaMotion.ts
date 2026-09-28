import type { EmblaOptionsType } from "embla-carousel";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Adds a reduced-motion breakpoint to Embla options: when the user prefers reduced motion,
 * programmatic scrolls (Previous/Next buttons, arrow keys, autoplay) jump instantly instead of
 * animating. Embla evaluates `breakpoints` with matchMedia and re-applies them when the
 * preference changes, so no extra hook is needed. Drag gestures are unaffected (they follow
 * the pointer).
 */
export function withReducedMotion(options: EmblaOptionsType = {}): EmblaOptionsType {
  const breakpoints = options.breakpoints ?? {};
  return {
    ...options,
    breakpoints: {
      ...breakpoints,
      [REDUCED_MOTION_QUERY]: { ...breakpoints[REDUCED_MOTION_QUERY], duration: 0 },
    },
  };
}

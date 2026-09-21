# WCAG 2.2 AA Accessibility Audit Report & Resolution Log

**Date:** 2026-09-21  
**Scope:** Design System & Application Frontend Components  
**Standard:** WCAG 2.2 Level AA  
**Status:** All genuine defects resolved. False positives reviewed and closed.

---

## Audit Summary Table

| Issue # | Severity | WCAG 2.2 SC | Issue Summary | Status | Resolution / Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ISSUE-01** | High | **2.4.4 Link Purpose**<br>**4.1.2 Name, Role, Value** | Misleading accessible name on brand logo link (`aria-label="Main Navigation"`) | **RESOLVED** | Updated default to `"ESL Federal Credit Union - Home"`. Tests verified. |
| **ISSUE-02** | High | **1.3.1 Info and Relationships** | Missing semantic headings and unlabelled landmark section in `Disclosure` | **RESOLVED** | Changed heading to `<Text as="h2" variant="micro">` and wired `<section aria-labelledby={headingId}>`. Tests verified. |
| **ISSUE-03** | Medium | **2.4.3 Focus Order**<br>**2.1.2 No Keyboard Trap** | Focus not restored to trigger button after closing video lightbox | **RESOLVED** | Captured `triggerRef` on mount and restored `.focus()` in cleanup hook. Tests verified. |
| **ISSUE-04** | Medium | **2.2.2 Pause, Stop, Hide** | Autoplay rotated slides without checking `prefers-reduced-motion` | **RESOLVED** | Initialized `isPlaying` via lazy matchMedia check and subscribed to OS changes. Lint and tests verified. |
| **ISSUE-05** | N/A | **4.1.3 Status Messages** | Alleged missing live region announcement on FAQ accordion | **CLOSED (False Positive)** | Accordion already strictly adheres to W3C ARIA APG with `aria-expanded` and `aria-controls`. `aria-live` is an anti-pattern here. |
| **ISSUE-06** | N/A | **2.4.4 Link Purpose** | Alleged icon label collision inside QuickLinkSimple card | **CLOSED (False Positive)** | Icon circle wrapper already enforces `aria-hidden="true"`, cleanly excluding SVGs from the accessible name computation. |

---

## Resolution Details

### ISSUE-01: Brand Logo Accessible Name
- **File Updated:** `src/components/header/Header.tsx`
- **Fix:** Changed default fallback from `"Main Navigation"` to `"ESL Federal Credit Union - Home"`. Screen readers now voice: *"ESL Federal Credit Union - Home, link"*.

### ISSUE-02: Disclosure Landmark and Heading Semantics
- **Files Updated:**
  - `src/components/organisms/disclosure/Disclosure.tsx`
- **Fix:** 
  - Rendered `<Text as="h2" id={headingId} variant="micro">`, preserving 100% of micro design tokens while delivering semantic Level 2 heading structure.
  - Linked `<section aria-labelledby={headingId}>` for landmark identification.

### ISSUE-03: Modal Lightbox Focus Restoration
- **Files Updated:**
  - `src/components/atoms/card/testimonial-card/TestimonialLightbox.tsx`
- **Fix:** Added `triggerRef` tracking `document.activeElement`. When the dialog unmounts, focus returns to the initiating play trigger button.

### ISSUE-04: Reduced Motion Preference in Carousel
- **Files Updated:**
  - `src/components/organisms/hero-carousel/HeroCarousel.tsx`
- **Fix:** Checked `window.matchMedia("(prefers-reduced-motion: reduce)")` lazily in state initialization and added runtime change listeners to prevent motion sickness for users requesting reduced motion.

---

## Automated Verification Results
- **Vitest Unit Suite:** 73/73 test suites passed (385 tests).
- **Static Prototype Suite:** All unit test suites passed.
- **ESLint Suite:** 0 errors, 0 warnings.

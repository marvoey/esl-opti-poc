# WCAG 2.2 AA Accessibility Audit

**Scope:** every component under `src/components/` (organisms, atoms, card atoms, molecules, header cluster) — 48 components total.
**Method:** read-only manual review of real source (`.tsx`, `.module.css`, `.test.tsx`) against WCAG 2.2 Level AA success criteria, cross-checked with an automated `eslint`/`jsx-a11y` pass (0 findings — confirming these issues need expert review, not lint). Contrast ratios are computed from the actual hex/rgba values in `src/styles/tokens.css` using the WCAG relative-luminance formula, not estimated.
**No code was modified during this audit.**

## Totals

| Severity | Count |
| :-- | --: |
| Blocker | 2 |
| Serious | 28 |
| Moderate | 30 |
| Minor | 19 |
| **Total** | **79** |

Severity guide: **Blocker** = completely inaccessible to a user group. **Serious** = works but violates a hard AA numeric threshold (contrast ratio, target size, keyboard operability). **Moderate** = works with assistive tech but with real friction/confusion. **Minor** = technically non-compliant, low real-world impact.

---

## The single highest-leverage fix

**~15 of the 28 Serious findings share one root cause.** `--color-accent` (teal-700, `#00A3A3`) is used as *text color* throughout the design system. Against white, near-white, and even dark-navy backgrounds it computes to **2.9–4.1:1** — always under the 4.5:1 minimum required for normal text (the failing text is consistently 14–18px, never reaching the ~18.66px-bold "large text" exemption). It reproduces identically in:

- `AccordionCardGrid`, `FaqStates`, `FeatureCardRow`, `CircularImageMetricRow`, `KeyFactsRow` (eyebrow text)
- `SideBySide` (light-variant eyebrow), `SplitContentCards` (eyebrow + stat value), `SwitchSupport` (eyebrow on dark gradient)
- `metric-card-row`'s `RatesCard` (category label)
- `Badge` (default `aqua` variant), `Button` (`link` variant hover state), `StepBadge` (`mint` variant)
- `BasicsTile` (used in `KeyFactsRow`), `RatesCard`, `TestimonialCard` (author name)
- `Header` (nav-link hover color), `MegaMenu` (promo CTA hover, gradient-position-dependent)

Several `openspec/changes/*/spec.md` files (written earlier this session) explicitly claim this combination "passes AA" — those claims are factually wrong and should be corrected once this is fixed. **One token-level fix** (stop using `--color-accent` for text under ~19px/bold, or introduce a genuinely darker text-safe variant) resolves the majority of this audit's Serious count in a single change, rather than 15 separate component patches.

---

## Blockers (2)

1. ~~**`Carousel` molecule** (`src/components/molecules/carousel/Carousel.tsx`) — **2.1.1 Keyboard**.~~ **FIXED.** `Carousel` now accepts an optional `emblaApi` prop; when supplied it wires `ArrowLeft`/`ArrowRight` keydown handling on the viewport and (unless `showControls={false}`) renders its own accessible Previous/Next `<button>`s with `disabled` states synced to `canScrollPrev()`/`canScrollNext()`. `HeroCarousel` now passes `emblaApi` (keeping its own richer control bar via `showControls={false}`, so no duplicate buttons render). Applied identically across repositories (same original gap, same fix). Verified: lint/typecheck clean in all projects, dev servers return 200.
2. **`StepBadge` `variant="neutral"`** (rendered via `ProcessCard.module.css:72-75`) — **1.4.3 Contrast (Minimum)**. Text color `--color-surface-muted` (slate-200 `#B8BFC7`) on background `--color-border-accent` (turquoise-400 `#68E0CC`) computes to **~1.16:1** — a light-on-light pairing, effectively invisible. *Fix: needs a dark text token on that background, not a contrast tweak.*

---

## Serious (28)

### Contrast — the systemic `--color-accent` text bug (15)
| Component | Element | Computed ratio | Evidence |
| :-- | :-- | :-- | :-- |
| AccordionCardGrid | Eyebrow | 3.10:1 | `AccordionCardGrid.tsx:61` |
| FaqStates | Eyebrow | 3.10:1 | `FaqStates.tsx:73` |
| FeatureCardRow | Eyebrow | 3.10:1 | `FeatureCardRow.tsx:45`, `.module.css:29` |
| CircularImageMetricRow | Eyebrow | 3.10:1 | `CircularImageMetricRow.tsx:53`, `.module.css:51` |
| KeyFactsRow (via BasicsTile) | Value text | 3.10:1 | `KeyFactsRow.tsx:45` → `BasicsTile.tsx:57` |
| SideBySide (light variant) | Eyebrow | 3.10:1 | `SideBySide.tsx:46,80-87` |
| SplitContentCards | Eyebrow | 3.10:1 (spec claimed 4.6:1 using a wrong hex) | `SplitContentCards.tsx:80-89`; spec.md:452 |
| SwitchSupport | Eyebrow on dark gradient | ~4.05:1 at lighter end | `SwitchSupport.tsx:44-51`, `.module.css:3` |
| metric-card-row (RatesCard) | Category label | 3.94–5.71:1 (fails at lighter gradient stop) | `MetricCardRow.module.css:105`, `RatesCard.tsx:57` |
| Badge (default `aqua`) | Badge text | 2.92:1 | `Badge.module.css:16-20` |
| Button (`link` variant, hover) | Link text | 3.10:1 | `Button.module.css:142-148` |
| StepBadge (`mint` variant, via ProcessCard) | Step number | 3.10:1 | `ProcessCard.module.css:46-49` |
| BasicsTile | Value text | 3.10:1 | `BasicsTile.tsx:57` |
| RatesCard (card atom) | Category label | ~3.89:1 | `RatesCard.tsx:57` (semibold, not bold — doesn't qualify as large text) |
| TestimonialCard | Author name | 3.10:1 | `TestimonialCard.tsx:122` |

### Other Serious (13)
- **`tabbed-icon-cards`** — **2.1.1 Keyboard / 4.1.2 Name, Role, Value**: `ArrowRight` never moves DOM focus to the newly-activated tab — the `ArrowRight` case omits the `shouldFocus` argument (defaults `false`) while `ArrowLeft`/`Home`/`End`/`Enter`/`Space` all pass `true`. `aria-selected` updates but keyboard focus/screen-reader announcement stays on the now-inactive button. Not caught by existing tests (they only assert `aria-selected`). Evidence: `TabbedIconCards.tsx:96,111-122`. *Fix: pass `true` as the 3rd arg on line 114.*
- **`tabbed-icon-cards`** — **1.4.11 Non-text Contrast**: active-tab underline indicator (`--color-tab-active-border`, teal-500 `#51BFB6`) on white computes to **2.22:1**, fails 3:1. Evidence: `TabbedIconCards.module.css:66-79`.
- **`hero-carousel`** — **2.4.3 Focus Order**: all slides' CTAs render simultaneously in the Embla track; neither `Carousel.tsx` nor `HeroCarousel.tsx` sets `tabIndex={-1}`/`inert` on off-screen slides. Tabbing from slide 1 moves focus into invisible slide 2/3 buttons with no visible indicator. Evidence: `HeroCarousel.tsx:121-232`. *Fix: apply `tabIndex={-1}`/`inert` to non-active slides via Embla's `slidesInView()`.*
- **`QuickLink`** — **1.4.11 Non-text Contrast**: hover state shows only a `box-shadow` ring (turquoise `#68E0CC` on white), computed **~1.60:1**, far under 3:1. Evidence: `QuickLink.module.css:25-29`.
- **`QuickLinkLarge`** — **1.4.11 Non-text Contrast**: same ring problem, and worse for the **persistent** `.active` state (not just hover) — always-visible sub-threshold indicator. Evidence: `QuickLinkLarge.module.css:76-97`.
- **`MediaCard`** — **2.5.8 Target Size (Minimum)**: `.cta` has no padding/min-height; effective target height ≈20px, under the 24px minimum (standalone block CTA, inline exception doesn't apply). Evidence: `MediaCard.module.css:77-87`.
- **`RatesCard`** (card atom) — **2.5.8 Target Size (Minimum)**: footer `SimpleLink` is the only interactive descendant; `padding: 0` + body-sm text ≈20px target height. Evidence: `SimpleLink.module.css:1-11`, `RatesCard.tsx:83-89`.
- **`Header`** — **1.4.3 Contrast (Minimum)**: `.navLink:hover { color: var(--color-teal-700) }` on white header background = 3.10:1. Default/focus states use navy (12.05:1, fine) — only mouse-hover fails. Evidence: `Header.module.css:96`.

---

## Moderate (30, grouped by pattern)

**`aria-controls`/`aria-labelledby` referencing unmounted elements** (recurring pattern: only the active tab/accordion/panel is ever mounted in the DOM):
- `Header` desktop nav trigger's `aria-controls` references the MegaMenu panel id, which doesn't exist while collapsed (`Header.tsx:187,196-203`).
- `Header` mobile accordion trigger has `aria-expanded` but no `aria-controls` at all, unlike its desktop counterpart (`Header.tsx:291-296,303-325`).
- `tabbed-icon-cards`: only the active tab's `role="tabpanel"` is mounted; inactive tabs' `aria-controls` points at nothing (`TabbedIconCards.tsx:181-226`).
- `vertical-selector-feature-card`: only the active tab's panel is mounted, so 7 of 8 tabs' `aria-controls` reference non-existent ids (`VerticalSelectorFeatureCard.tsx:103-116`, `VerticalSelectorTabList.tsx:40`).

**Missing structural/list semantics:**
- 6 organisms render card grids as plain `<div>`s instead of `<ul>/<li>`: `AccordionCardGrid`, `FaqStates`, `FeatureCardRow`, `CircularImageMetricRow`, `MediaCardGrid`, `KeyFactsRow`. (`Footer`'s own nav/legal columns already use the correct `<ul>/<li>` pattern — the fix is known in-repo.)
- `switch-support`'s 3 numbered process steps render as a plain grid with no `<ol>/<li>` or `role="list"` (`SwitchSupport.tsx:157-167`).
- Mobile mega-menu column headings (`Header.tsx:307-309`) and the standalone `MegaMenu`'s column headings (`MegaMenu.tsx:32`) render as `<p>` despite being visually bold/uppercase section headers — screen-reader heading navigation can't find them.
- `Disclosure`'s `<section>` has no `aria-label`/`aria-labelledby`, and its "DISCLOSURES:" label is a `<Text as="p">`, not a heading (`Disclosure.tsx:27,29`).
- `KeyFactsRow`'s heading is hardcoded `<h3>` with no `headingLevel` prop, unlike every sibling organism (`KeyFactsRow.tsx:31`).

**Focus management:**
- `TestimonialLightbox` never restores focus to the triggering play button on close — no ref to the previously-focused element (`TestimonialLightbox.tsx:27-62`). Contradicts the spec's claim of "restores focus on dismissal."
- `RatesCard` (card atom): the documented `:focus-visible` box-shadow targets the outer `<article>`, which is never focusable (no `tabindex`/`href`) — dead CSS. The real focusable element (footer `SimpleLink`) has zero focus-visible styling and silently falls back to the browser default. Evidence: `RatesCard.module.css:31-33`, `SimpleLink.module.css:1-19`.
- `Header`: sticky header (64–80px tall, `z-index: 100`) with no `scroll-padding-top`/`scroll-margin-top` anywhere in the app — any keyboard/anchor-focused element can land hidden underneath it. **2.4.11 Focus Not Obscured (Minimum) — new in WCAG 2.2.**
- `MegaMenu`: the panel (`role="region"`) has no `aria-label`/`aria-labelledby` — the landmark has no accessible name (`MegaMenu.tsx:15`).

**Other Moderate:**
- `hero-carousel`: badge text ("100%"/"Peace of mind") is wrapped in `aria-hidden="true"`, hiding unique content not restated elsewhere (`HeroCarousel.tsx:220-225`).
- `hero-carousel`: play/pause button combines `aria-label="Pause/Play carousel"` with `aria-pressed`, producing a contradictory announcement when paused ("Play carousel, pressed") (`HeroCarousel.tsx:249-253`).
- `carousel`: `touch-action: pan-y` enables drag-to-scroll with no built-in non-drag alternative — **2.5.7 Dragging Movements (new in 2.2)** compliance depends entirely on the consumer remembering to add controls.
- `offer-card-row`: `.navButton` background is the exact same hex as the gradient's end-stop — the button becomes visually indistinguishable from the page background near that end; only the icon signals it exists (`OfferCardRow.module.css:1-3` vs `:125`).
- `IconContentCard` / `QuickLinkLarge` / `QuickLinkSimple`: shared default 1px card border (`--color-card-stroke`) on white computes to ~1.29:1 — under 3:1 if the border is load-bearing for perceiving the card boundary.
- `TestimonialLightbox` close button: hover-state border (turquoise on mint-50) computes to ~1.50:1.
- `RatesCard`/`MediaCard` grid pattern: `RatesCard`'s title is plain text, not a heading, unlike `MediaCard`'s `<h3>` for the same semantic role in a themed grid — heading-navigation users skip every RatesCard title.
- `RatesCard`: hover/active affordance (border, ring, arrow slide) applies to the whole `<article>`, but only the small footer link is actually operable — perceived vs. actual interactive surface mismatch.
- `FilterChip`: unselected border (`rgba(0,57,93,0.18)` over white) computes to ~1.41:1 against the page background — no visible boundary at rest.
- `TabButton`: inactive-state border computes to ~1.25:1 against white.
- `split-content-cards`: `.heroStatValue`/`.statValue` force `--color-accent` at large-text size — ~3.0–3.1:1 with zero margin, and an optional background-image prop can push it below 3:1 uncontrolled.
- `split-content-cta`, `switch-support`: `aria-labelledby` has no fallback when the `title`/`id` prop is omitted, leaving the section unlabeled (currently dead-code risk — both call sites always pass `id`).
- `BrandLogo`: `{...props}` spreads after the hardcoded `aria-label`, so a caller-supplied `aria-label` would silently override the brand's accessible name (latent risk — no current caller does this).
- `SimpleLink`: no minimum target size enforced — standalone CTA usage at small text sizes can fall under 24×24px.

---

## Minor (19, grouped)

- Focus-ring token (`--color-focus-ring`, teal-700) computes to ~3.10:1 against white — clears the 3:1 non-text-contrast floor by a razor-thin margin, and is the same token that outright fails as text color elsewhere. Affects every light-surface card's focus outline.
- `icons` barrel (`src/components/atoms/index.ts`) only re-exports 9 of ~23 icon components (`CheckIcon`, `SproutIcon`, `MinusIcon`, `ChevronDownIcon`, etc. missing) — inconsistent public surface.
- `SimpleLink` defines no `:focus-visible` rule at all (its sibling `TextLink` has one) — browser default still shows, so not a hard failure, but inconsistent and fragile.
- `TabButton` hover-state icon color computes to ~2.92:1 (icon is `aria-hidden`, so low real-world impact).
- `QuickLinkLarge`: `<img alt="">` (empty, valid) when `imageAlt` is omitted — a consistency nit vs. `QuickLink`'s stricter wrapper-level `aria-hidden` gating, not a failure.
- `TestimonialLightbox`: `CloseIcon` isn't itself `aria-hidden` (harmless since the button's own `aria-label` wins, but inconsistent with sibling patterns); hardcoded `z-index: 9999` with no token backing.
- `product-cards-row` / `product-cards-row-variant-2`: `aria-labelledby` has no `useId()` fallback, so omitting the `id` prop leaves the section with no accessible name.
- `product-cards-row-variant-2`: the `ReactNode` icon branch isn't wrapped in `aria-hidden`, unlike the `IconName` branch.
- `FeatureCardRow`: same missing `useId()` fallback pattern — the only audited organism missing it.
- `MediaCardGrid`: `MediaCard`'s `.cta` has no explicit `:focus-visible` rule (relies on unstyled browser default).
- `split-content-cards`: stat numeral and label/unit are unlinked sibling elements with no `<dl>`/grouping `aria-label`.
- `vertical-selector-feature-card`: hover-state tab icon color (~2.91:1) and hover border (~1.50:1) both under 3:1 — icon is decorative/`aria-hidden`, low impact.
- Non-a11y bugs surfaced in passing (worth separate tickets): `Display` atom references `--font-size-display`, which is never defined in `tokens.css`; `globals.css`/`Menu.module.css` reference two more undefined custom properties (`--font-size-base`, `--line-height-normal`, `--font-size-sm`).
- Three previously-documented "Known Gaps" in card-atom specs were checked against real WCAG SCs and found to **not** be violations: false-affordance hover styling on non-interactive `MediaCard`/`ProcessCard`/`TestimonialCard` (no `role`/`tabindex` added, so screen readers never perceive them as interactive — sighted-mouse-only friction, not an AT-facing SC failure); placeholder `ctaText` copy on `IconContentCard`/`RatesCard` (visible text and accessible name stay in sync, so 2.5.3 isn't violated — a content-quality risk, not a conformance failure); `QuickLinkSimple`'s hover min-height jump (no SC in this checklist governs hover-triggered reflow without new content appearing).

---

## Verified compliant — no findings

To keep this list honest, these were explicitly checked and passed:

- `tabbed-icon-cards`: tablist/tab/tabpanel roles, roving `tabIndex`, `Home`/`End`/`Enter`/`Space` keyboard handling, `prefers-reduced-motion`, decorative-icon hiding, target sizes.
- `AccordionCardGrid`/`FaqStates`: full WAI-ARIA disclosure pattern (keyboard, `aria-expanded`/`aria-controls`/`aria-labelledby`).
- `side-by-side`: image alt/aria-hidden handling, heading hierarchy, dark-variant contrast (≥7:1).
- `split-content-image`: alt text, external-link handling, all contrast pairings pass.
- Navy-500/slate-600 text-on-white pairings across the app: 8:1–12:1+.
- Turquoise-400 on dark-navy backgrounds (e.g. `MediaCardGrid` eyebrow): ~7.7:1 — confirms the systemic bug is specific to teal-700-as-text-on-light, not the accent palette generally.
- `TestimonialLightbox` keyboard trap/Escape: native `<dialog>.showModal()` correctly contains focus, no trap.
- Target sizes: shared `Button` atom enforces 52px (md)/44px (sm) `min-height`; footer nav links exactly 24px; accordion/FAQ triggers ≥52px.
- All `next/image`/`<img>` usages have meaningful alt text (1.1.1).
- `Menu` molecule (`src/components/header/menu/Menu.tsx`) — confirmed **unused dead code**, not rendered anywhere by `Header.tsx`. Audited anyway; markup itself is clean.

---

## Notes on method

- Work was delegated across 6 parallel read-only audits (header/nav cluster, 3 organism batches, simple atoms, card atoms), each computing real contrast ratios from `src/styles/tokens.css` rather than estimating.
- One cross-batch contradiction was caught and resolved by re-reading source directly (see `side-by-side`'s eyebrow-contrast finding, initially reported inconsistently between two agents — confirmed real).
- Every numeric claim in this document (contrast ratio, pixel dimension) is traceable to real code; issues were skipped rather than forced where a criterion didn't clearly apply.

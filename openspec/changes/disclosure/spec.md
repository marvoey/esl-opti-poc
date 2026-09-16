# Component Specification: Disclosure (`<Disclosure>`)

> **Classification**: Organism Component
> **Target Directory**: `src/components/organisms/disclosure/`
> **Status**: Spec Ready for Implementation
> **No reference screenshot** — this spec is built entirely from the written requirements below

---

## 1. Overview

A plain white legal-footnote section: an uppercase "DISCLOSURES:" label followed by one or more disclosure entries, each a bold statement line immediately followed by a regular asterisked footnote line. All text uses the same small `micro` typography and navy `text-primary` color — there is no visual hierarchy between the heading and the body copy beyond bold vs. regular weight.

```
┌────────────────────────────────────────────────────────────┐
│ container (max-width: 1200px, centered)                     │
│  DISCLOSURES:                              ← micro, uppercase│
│  ↕ 10px                                                       │
│  Members must agree to the ESL web         ← micro, bold     │
│  agreement to use mobile banking.                             │
│  ↕ 10px                                                       │
│  *Qualification for the Owners' Dividend   ← micro, regular  │
│  is subject to eligibility requirements.                       │
│  Payment of a Dividend is not guaranteed.                      │
│  ↕ 10px                                                       │
│  Members must agree to the ESL web         ← micro, bold     │
│  agreement to use ESL Mobile Deposit.                          │
│  ↕ 10px                                                       │
│  *Fee of up to $5.00 is charged. ...       ← micro, regular  │
└────────────────────────────────────────────────────────────┘
```

All text — the heading and every line of every disclosure item — is `color: var(--color-text-primary)` (`#00395D`), per the explicit "color text primary" instruction. There is no muted/secondary text anywhere in this component, unlike most other sections built this session.

---

## 2. Component Composition Contract

| Layer | Atom Used | Purpose |
| :--- | :--- | :--- |
| **Heading label** | `<Text variant="micro" color="primary">` | "DISCLOSURES:" — uppercase, `#00395D` |
| **Item bold line** | `<Text variant="micro" color="primary" weight="bold">` | e.g. "Members must agree to the ESL web agreement to use mobile banking." |
| **Item regular line** | `<Text variant="micro" color="primary">` | e.g. "*Qualification for the Owners' Dividend is subject to eligibility requirements..." |

`Text`'s `micro` variant does not include `text-transform: uppercase` by itself (only the `eyebrow` variant does) — the heading's uppercase look comes from the content itself already being typed in caps ("DISCLOSURES:"), reinforced with an explicit `text-transform: uppercase;` in this component's own CSS so it stays uppercase even if the content prop is later passed in mixed case.

`Text`'s `micro` variant defaults to `color: var(--color-text-muted)` — every usage here overrides that with `color="primary"` per the explicit instruction.

No existing organism in this codebase does this "uppercase label + repeating bold/regular line pairs" pattern, so this is a new, simple composition — no new atom needed.

---

## 3. TypeScript Domain & Component Interface

```typescript
export interface DisclosureItem {
  id: string;
  boldText: string;
  regularText: string;
}

export interface DisclosureProps {
  id?: string;
  heading?: string; // default "DISCLOSURES:"
  items: DisclosureItem[];
  className?: string;
}
```

No `"use client"` needed — static composition, no internal state.

---

## 4. Styling, Layout & Design Tokens

### Section / Container
```css
.section {
  width: 100%;
  background-color: var(--color-bg, #FFFFFF);
  padding-block: 30px;
}

.container {
  width: 100%;
  max-width: var(--container-max-w, 1200px);
  margin: 0 auto;
  padding-inline: var(--container-gutter, 2.5rem);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
```
`30px` is used as a literal value (not a `--space-*` token) since it doesn't land on any existing spacing step (`--space-lg` is `~30px` at its fluid maximum but resolves lower at most viewport widths, so it isn't a reliable match) — matches this codebase's established precedent of literal one-off values when no token fits exactly (e.g. `ProductCardsRow`'s `#F7F9FB`).

### Text
```css
.heading {
  margin: 0;
  text-transform: uppercase;
}

.line {
  margin: 0;
}
```
Every direct child of `.container` (the heading and every bold/regular line) participates in the same flex column, so the single `gap: 10px` on `.container` implements "text section must be separated by 10px gap for each text" uniformly — between the heading and the first line, between each bold/regular pair, and between successive disclosure items alike. No nested gap value is needed since there's no visual grouping distinguishing "within an item" spacing from "between items" spacing in the request.

---

## 5. Content — transcribed verbatim from the request

```typescript
export const DEFAULT_DISCLOSURE_PROPS: DisclosureProps = {
  heading: "DISCLOSURES:",
  items: [
    {
      id: "disclosure-mobile-banking",
      boldText:
        "Members must agree to the ESL web agreement to use mobile banking.",
      regularText:
        "*Qualification for the Owners' Dividend is subject to eligibility requirements. Payment of a Dividend is not guaranteed.",
    },
    {
      id: "disclosure-mobile-deposit",
      boldText:
        "Members must agree to the ESL web agreement to use ESL Mobile Deposit.",
      regularText:
        "*Fee of up to $5.00 is charged. The overdraft fee can be imposed on checks, ACH and Bill Pay transactions that exceed the balance in your checking account, and ESL Visa Debit Card transactions, if you have registered. You must bring your account to a positive end-of-day available balance at least once every 10 days. ESL will not pay an overdraft if you do not meet the eligibility requirements.",
    },
  ],
};
```

All copy is transcribed verbatim from the request — nothing authored or assumed here.

---

## 6. Colocated Directory Structure

```
src/components/organisms/disclosure/
├── Disclosure.tsx
├── Disclosure.module.css
├── disclosureData.ts
├── Disclosure.test.tsx
└── index.ts
```

---

## 7. Open Questions for Design / Confirmation

1. **Uniform 10px gap** — applied identically between every line (heading-to-first-line, bold-to-regular within an item, and item-to-item), since the request doesn't distinguish between within-item and between-item spacing. Confirm if item-to-item spacing should differ from bold-to-regular spacing.
2. **`30px` as a literal value** — no exact design token matches; confirm whether it should be promoted to a token now that it's used, or left literal like other one-off values in this codebase.
3. Where does this render on the page? (e.g. last section on `/product-detail`, or specifically directly above/below the `Footer`?) Not specified — will default to "last section before the footer," matching every other component added this session, unless told otherwise.

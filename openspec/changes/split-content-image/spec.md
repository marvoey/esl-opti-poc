# Component Specification: Split Content + Image (`<SplitContentImage>`)

> **Classification**: Organism Component  
> **Target Directory**: `src/components/organisms/split-content-image/`  
> **Status**: Approved Spec & Implemented  
> **Design System Compliance**: Strict 3-Tier Tokens • Media Range Queries • Typography Composition Law • Next.js 15 Image Optimization • WCAG 2.2 AA  

---

## 1. Overview & Architectural Intent

The **Split Content + Image** component is a hero/intro-style editorial organism featuring a full-width container with a soft radial-gradient background, split into two primary columns:
- **Left Column (Content)**: Heading, body description, dual CTA buttons (primary with user icon, secondary with arrow icon), and an optional micro eligibility note with check icon.
- **Right Column (Visual)**: A 3-column × 2-row staggered portrait photo collage (6 image tiles) representing members and community.

### Key Architectural Adaptations (vs. Initial Spec)
1. **Typography Composition Law (`FRONTEND.md`)**: Raw `<h2>` and `<p>` tags with custom font sizes were adapted to design system typography atoms (`<Heading level="h2">`, `<Text variant="body-lg">`, and `<Text variant="micro">`).
2. **3-Tier Design Tokens (`tokens.css`)**: Raw `rgba()` values and unsupported CSS rotation angles were replaced by semantic primitive and composite gradient tokens (`--color-sky-alpha-25`, `--color-aqua-alpha-25`, `--color-white-alpha-25`, and `--gradient-split-radial`).
3. **Button Component Interface**: Adapted external `@/components/ui/Button` to the project's atomic Button (`@/components/atoms/button/Button`), utilizing `leftIcon={<UserIcon />}` and `rightIcon={<ArrowRightIcon />}` with `variant="primary"` and `variant="secondary"`.
4. **Icons Atom (`src/components/atoms/icons/index.tsx`)**: Registered `Check` from `lucide-react` as `CheckIcon`.
5. **Next.js Image Contract**: Added `position: relative` to `.photoTile` to ensure `<Image fill>` scales without layout collapse.

---

## 2. Anatomy & DOM Structure

```
<section className={styles.section} aria-labelledby={headingId}>
  <div className={`container ${styles.container}`}>
    <div className={styles.contentColumn}>
      <Heading level="h2" id={headingId} className={styles.title}>
        {title}
      </Heading>
      <Text as="p" variant="body-lg" color="secondary" className={styles.description}>
        {description}
      </Text>
      <div className={styles.buttonGroup}>
        <Button variant="primary" href={primaryCta.href} leftIcon={<UserIcon size={20} />}>
          {primaryCta.label}
        </Button>
        <Button variant="secondary" href={secondaryCta.href} rightIcon={<ArrowRightIcon size={20} />}>
          {secondaryCta.label}
        </Button>
      </div>
      {eligibilityNote && (
        <p className={styles.eligibilityNote}>
          <CheckIcon className={styles.checkIcon} size={16} aria-hidden="true" />
          <Text as="span" variant="micro" color="secondary">
            {eligibilityNote}
          </Text>
        </p>
      )}
    </div>

    <div className={styles.imageColumn}>
      <div className={styles.photoGrid}>
        {photos.slice(0, 6).map((photo, i) => (
          <div className={styles.photoTile} key={`${photo.src}-${i}`}>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 767px) 33vw, 16vw"
              className={styles.photoImage}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

---

## 3. Design Tokens & Styling

### Tier 1 & Tier 2 Tokens (`src/styles/tokens.css`)

```css
/* Primitives */
--color-sky-alpha-25: rgba(135, 206, 242, 0.25);
--color-aqua-alpha-25: rgba(213, 243, 242, 0.25);
--color-white-alpha-25: rgba(255, 255, 255, 0.25);

/* Composite Radial Gradient */
--gradient-split-radial: radial-gradient(
  69.11% 69.11% at 50.26% 14.87%,
  var(--color-sky-alpha-25) 0%,
  var(--color-aqua-alpha-25) 50%,
  var(--color-white-alpha-25) 100%
);
```

### Module Styling (`SplitContentImage.module.css`)

```css
.section {
  width: 100%;
  background: var(--gradient-split-radial);
  padding-block: 5.5rem; /* 88px */
}

@media (width < 768px) {
  .section {
    padding-block: 2.75rem; /* 44px */
  }
}

.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6.25rem; /* 100px */
  align-items: center;
  width: 100%;
  max-width: var(--container-max-w);
  margin-inline: auto;
  padding-inline: var(--container-gutter);
}

@media (width < 768px) {
  .container {
    grid-template-columns: 1fr;
    gap: 3.125rem; /* 50px */
  }
}

.contentColumn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

@media (width < 768px) {
  .contentColumn {
    order: 2; /* Mobile: content sits below image collage */
  }
}

.title {
  margin: 0 0 var(--space-md);
}

.description {
  margin: 0 0 var(--space-xl);
  max-width: 28.75rem; /* ~460px */
}

.buttonGroup {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.eligibilityNote {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  margin: 0;
}

.checkIcon {
  color: var(--color-teal-700);
  flex-shrink: 0;
}

.imageColumn {
  position: relative;
  width: 100%;
}

@media (width < 768px) {
  .imageColumn {
    order: 1; /* Mobile: image sits on top */
  }
}

.photoGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

/* Stagger outer columns (1 and 3) downward */
.photoGrid > *:nth-child(3n + 1),
.photoGrid > *:nth-child(3n + 3) {
  transform: translateY(0.75rem); /* 12px */
}

.photoTile {
  position: relative;
  border-radius: var(--radius-lg); /* 12px */
  overflow: hidden;
  aspect-ratio: 3 / 4;
}

.photoImage {
  object-fit: cover;
}
```

---

## 4. Component TypeScript API

```ts
export interface PhotoTile {
  src: string;
  alt: string;
}

export interface SplitContentImageCta {
  label: string;
  href: string;
  external?: boolean;
}

export interface SplitContentImageProps {
  id?: string;
  title: string;
  headingLevel?: HeadingLevel;
  description: string;
  primaryCta: SplitContentImageCta;
  secondaryCta: SplitContentImageCta;
  eligibilityNote?: string;
  photos: PhotoTile[];
  className?: string;
}
```

---

## 5. Responsive Behavior Matrix

| Property / Area | Desktop (≥768px) | Mobile (<768px) |
|---|---|---|
| Section Padding-Block | `5.5rem` (88px) | `2.75rem` (44px) |
| Column Gap | `6.25rem` (100px) | `3.125rem` (50px) |
| Layout Order | Content (Left), Image (Right) | Image (`order: 1`), Content (`order: 2`) |
| Grid Columns | 2 columns (`1fr 1fr`) | 1 column (`1fr`) |
| Photo Collage Grid | 3 cols × 2 rows (staggered) | 3 cols × 2 rows (staggered, scaled) |
| Photo Tile Aspect Ratio | `3 / 4` | `3 / 4` |

---

## 6. Accessibility & Compliance Contract

- **Semantic Landmark & Headings**: Section rendered with `aria-labelledby={headingId}` linked directly to `<Heading>`. Real heading level defaults to `h2` and is configurable via `headingLevel`.
- **Keyboard & Links**: CTAs consume atomic `<Button>` with full keyboard navigation, accessible states, and external link security (`target="_blank"` with `rel="noopener noreferrer"`).
- **Decorative Stagger Isolation**: Stagger offset uses GPU CSS `transform: translateY(12px)` which preserves logical DOM tab and reading order.
- **Alt Text Integrity**: Every tile requires non-empty alt text unless verified as purely atmospheric (`alt=""`).
- **Contrast Ratios**: Verified WCAG 2.2 AA compliant against the lightest gradient surface (minimum 4.5:1 for body copy and 3:1 for large text).

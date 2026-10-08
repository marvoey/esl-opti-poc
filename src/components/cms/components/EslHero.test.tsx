import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EslHero from './EslHeroRenderer';
import { EslHeroContentType } from './EslHero';
import type { HeroProps } from '@/components/organisms/hero/Hero';

// Mock Hero organism to inspect the exact props passed to it
vi.mock('@/components/organisms/hero/Hero', () => ({
  Hero: vi.fn(({ content, variant, headingLevel, priority }: HeroProps) => (
    <div
      data-testid="mock-hero"
      data-variant={variant}
      data-heading-level={headingLevel}
      data-priority={String(priority)}
    >
      <span data-testid="hero-eyebrow">{content?.eyebrow}</span>
      <span data-testid="hero-title1">{content?.titleLine1}</span>
      <span data-testid="hero-title2">{content?.titleLine2}</span>
      <div data-testid="hero-body">{content?.body}</div>
      <span data-testid="hero-primary-cta">{content?.primaryCta}</span>
      <span data-testid="hero-primary-href">{content?.primaryCtaHref}</span>
      <span data-testid="hero-primary-external">{String(content?.primaryCtaExternal)}</span>
      <span data-testid="hero-primary-icon">{content?.primaryCtaIcon}</span>
      <span data-testid="hero-secondary-cta">{content?.secondaryCta}</span>
      <span data-testid="hero-secondary-href">{content?.secondaryCtaHref}</span>
      <span data-testid="hero-secondary-external">{String(content?.secondaryCtaExternal)}</span>
      <span data-testid="hero-secondary-icon">{content?.secondaryCtaIcon}</span>
      <span data-testid="hero-image-src">{content?.imageSrc ?? 'no-image'}</span>
      <span data-testid="hero-image-alt">{content?.imageAlt}</span>
      <span data-testid="hero-badge-stat">{content?.badgeStat}</span>
      <span data-testid="hero-badge-label">{content?.badgeLabel}</span>
    </div>
  )),
}));

// Mock RichText from Optimizely CMS SDK
vi.mock('@optimizely/cms-sdk/react/richText', () => ({
  RichText: ({ content }: { content: unknown }) => (
    <div data-testid="sdk-rich-text">{JSON.stringify(content)}</div>
  ),
}));

describe('EslHero CMS Component', () => {
  const sampleContent = {
    heading: 'Move forward. with confidence.',
    eyebrow: 'Banking with guidance',
    body: {
      html: '<p>Here to help at every step.</p>',
      json: {
        type: 'richText' as const,
        children: [{ type: 'paragraph', children: [{ text: 'Here to help at every step.' }] }],
      },
    },
    primaryCtaIcon: 'user',
    primaryCta: {
      text: 'Become a member',
      url: { default: 'https://example.com/join' },
      target: '_blank',
    },
    secondaryCtaIcon: 'arrow-right',
    secondaryCta: {
      text: 'Sign In',
      url: { default: '/sign-in' },
    },
    image: {
      url: { default: 'https://app-fecu01saas6fn6qt001.cms.optimizely.com/assets/hero.jpg' },
    },
    imageAlt: 'Family smiling together outdoors',
    badgeStat: '100%',
    badgeLabel: 'Peace of mind',
  };

  it('exposes correct Optimizely Content Type definition for EslHero', () => {
    expect(EslHeroContentType.key).toBe('EslHero');
    expect(EslHeroContentType.displayName).toBe('ESL Hero');
    expect(EslHeroContentType.baseType).toBe('_component');
    expect(EslHeroContentType.compositionBehaviors).toEqual(['sectionEnabled', 'elementEnabled']);

    const props = EslHeroContentType.properties;
    expect(props).toHaveProperty('variant');
    expect(props).toHaveProperty('eyebrow');
    expect(props).toHaveProperty('heading');
    expect(props).toHaveProperty('body');
    expect(props).toHaveProperty('image');
    expect(props).toHaveProperty('imageAlt');
    expect(props).toHaveProperty('primaryCtaIcon');
    expect(props).toHaveProperty('primaryCta');
    expect(props).toHaveProperty('secondaryCtaIcon');
    expect(props).toHaveProperty('secondaryCta');
    expect(props).toHaveProperty('badgeStat');
    expect(props).toHaveProperty('badgeLabel');

    // Standardized display names
    expect(props.eyebrow.displayName).toBe('Eyebrow');
    expect(props.heading.displayName).toBe('Heading');
    expect(props.body.displayName).toBe('Copy');
    expect(props.image.displayName).toBe('Image');
    expect(props.imageAlt.displayName).toBe('Image Alt Text');
    expect(props.primaryCta.displayName).toBe('Primary CTA Link');
    expect(props.secondaryCta.displayName).toBe('Secondary CTA Link');

    // SelectOne formatting
    expect(props.variant.format).toBe('selectOne');
    expect(props.primaryCtaIcon.format).toBe('selectOne');
    expect(props.secondaryCtaIcon.format).toBe('selectOne');

    // Rich text editor settings
    expect(props.body.type).toBe('richText');
    expect(props.body.editorSettings?.preset).toBe('default');

    // Content reference allowed types
    expect(props.image.type).toBe('contentReference');
    expect(props.image.allowedTypes).toEqual(['_image']);

    // Sort order: Icons appear before CTAs
    expect(props.primaryCtaIcon.sortOrder).toBeLessThan(props.primaryCta.sortOrder);
    expect(props.secondaryCtaIcon.sortOrder).toBeLessThan(props.secondaryCta.sortOrder);
  });

  it('returns null when content is missing or heading is empty', () => {
    const { container: c1 } = render(<EslHero content={null} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<EslHero content={{ heading: '' }} />);
    expect(c2.firstChild).toBeNull();

    const { container: c3 } = render(<EslHero content={{ heading: '   ' }} />);
    expect(c3.firstChild).toBeNull();
  });

  it('maps all fields correctly and splits heading on period', () => {
    render(<EslHero content={sampleContent} />);

    expect(screen.getByTestId('hero-eyebrow').textContent).toBe('Banking with guidance');
    expect(screen.getByTestId('hero-title1').textContent).toBe('Move forward.');
    expect(screen.getByTestId('hero-title2').textContent).toBe('with confidence.');
    expect(screen.getByTestId('sdk-rich-text')).toBeDefined();
    expect(screen.getByTestId('hero-primary-cta').textContent).toBe('Become a member');
    expect(screen.getByTestId('hero-primary-href').textContent).toBe('https://example.com/join');
    expect(screen.getByTestId('hero-primary-external').textContent).toBe('true');
    expect(screen.getByTestId('hero-primary-icon').textContent).toBe('user');
    expect(screen.getByTestId('hero-secondary-cta').textContent).toBe('Sign In');
    expect(screen.getByTestId('hero-secondary-href').textContent).toBe('/sign-in');
    expect(screen.getByTestId('hero-secondary-external').textContent).toBe('false');
    expect(screen.getByTestId('hero-secondary-icon').textContent).toBe('arrow-right');
    expect(screen.getByTestId('hero-badge-stat').textContent).toBe('100%');
    expect(screen.getByTestId('hero-badge-label').textContent).toBe('Peace of mind');
  });

  it('unwraps nested component property when passed from Visual Builder', () => {
    render(<EslHero content={{ component: sampleContent }} />);

    expect(screen.getByTestId('hero-title1').textContent).toBe('Move forward.');
    expect(screen.getByTestId('hero-title2').textContent).toBe('with confidence.');
  });

  it('renders html fallback when rich text json is not present', () => {
    const contentWithHtml = {
      ...sampleContent,
      body: { html: '<p>Custom HTML copy</p>' },
    };
    render(<EslHero content={contentWithHtml} />);

    const bodyEl = screen.getByTestId('hero-body');
    expect(bodyEl.innerHTML).toContain('Custom HTML copy');
  });

  it('does NOT fallback to any project/default image when CMS image is missing', () => {
    const contentWithoutImage = {
      ...sampleContent,
      image: null,
      imageAlt: null,
    };
    render(<EslHero content={contentWithoutImage} />);

    const imageSrc = screen.getByTestId('hero-image-src').textContent;
    expect(imageSrc).toBe('no-image');
    expect(imageSrc).not.toContain('/images/hero/family.jpg');
    expect(imageSrc).not.toContain('/images/');
  });

  it('resolves image through /opti-media/ proxy when CMS image is provided', () => {
    render(<EslHero content={sampleContent} />);

    const imageSrc = screen.getByTestId('hero-image-src').textContent;
    expect(imageSrc).toContain('/opti-media/');
  });

  it('resolves Optimizely CMP DAM images with width parameter', () => {
    const contentWithDam = {
      ...sampleContent,
      image: {
        url: { default: 'https://images1.cmp.optimizely.com/asset-123.jpg' },
      },
    };
    render(<EslHero content={contentWithDam} />);

    const imageSrc = screen.getByTestId('hero-image-src').textContent;
    expect(imageSrc).toContain('/opti-media/cmp/asset-123.jpg?width=600');
  });

  it('defaults to "default" variant and respects "squared" variant from CMS or displaySettings', () => {
    const { rerender } = render(<EslHero content={sampleContent} />);
    expect(screen.getByTestId('mock-hero').getAttribute('data-variant')).toBe('default');

    rerender(<EslHero content={{ ...sampleContent, variant: 'squared' }} />);
    expect(screen.getByTestId('mock-hero').getAttribute('data-variant')).toBe('squared');

    rerender(
      <EslHero
        content={sampleContent}
        displaySettings={{ variant: 'squared' }}
      />
    );
    expect(screen.getByTestId('mock-hero').getAttribute('data-variant')).toBe('squared');
  });
});

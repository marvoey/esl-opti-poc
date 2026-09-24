import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EslHeroSlider from './EslHeroSliderRenderer';
import { EslHeroSlideContentType } from './EslHeroSlide';
import { HeroCarousel } from '@/components/organisms/hero-carousel/HeroCarousel';

// Mock HeroCarousel to inspect the passed variant and slides props
vi.mock('@/components/organisms/hero-carousel/HeroCarousel', () => ({
  HeroCarousel: vi.fn(({ variant, slides }) => (
    <div data-testid="mock-hero-carousel" data-variant={variant}>
      {slides.map((s: { id: string; titleLine1: string; primaryCtaIcon?: string; secondaryCtaIcon?: string }) => (
        <div key={s.id} data-testid="slide-title">
          <span>{s.titleLine1}</span>
          <span data-testid="slide-primary-icon">{s.primaryCtaIcon || 'none'}</span>
          <span data-testid="slide-secondary-icon">{s.secondaryCtaIcon || 'none'}</span>
        </div>
      ))}
    </div>
  )),
}));

describe('EslHeroSlider CMS Component', () => {
  const sampleSlide = {
    heading: 'Banking with Purpose. For Life.',
    eyebrow: 'MEMBER-OWNED',
    primaryCta: {
      text: 'Open an Account',
      url: { default: 'https://example.com/apply' },
    },
  };

  it('exposes correct Optimizely Content Type definition for EslHeroSlide with icons preceding CTAs', () => {
    expect(EslHeroSlideContentType.key).toBe('EslHeroSlide');
    expect(EslHeroSlideContentType.displayName).toBe('ESL Hero Slide');
    expect(EslHeroSlideContentType.baseType).toBe('_component');

    const props = EslHeroSlideContentType.properties;
    expect(props).toHaveProperty('primaryCtaIcon');
    expect(props).toHaveProperty('primaryCta');
    expect(props).toHaveProperty('secondaryCtaIcon');
    expect(props).toHaveProperty('secondaryCta');

    expect(props.primaryCtaIcon.format).toBe('selectOne');
    expect(props.secondaryCtaIcon.format).toBe('selectOne');

    // In the editor, icon must appear BEFORE the CTA link
    expect(props.primaryCtaIcon.sortOrder).toBeLessThan(props.primaryCta.sortOrder);
    expect(props.secondaryCtaIcon.sortOrder).toBeLessThan(props.secondaryCta.sortOrder);
  });

  it('returns null when content is missing or slides array is empty', () => {
    const { container: c1 } = render(<EslHeroSlider content={null} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<EslHeroSlider content={{ slides: [] }} />);
    expect(c2.firstChild).toBeNull();
  });

  it('defaults to "default" (circled) variant when variant is not specified and defaultVariant is omitted', () => {
    render(<EslHeroSlider content={{ slides: [sampleSlide] }} />);
    const carousel = screen.getByTestId('mock-hero-carousel');
    expect(carousel.getAttribute('data-variant')).toBe('default');
  });

  it('uses "squared" variant when defaultVariant="squared" and CMS variant is unset', () => {
    render(
      <EslHeroSlider
        content={{ slides: [sampleSlide] }}
        defaultVariant="squared"
      />
    );
    const carousel = screen.getByTestId('mock-hero-carousel');
    expect(carousel.getAttribute('data-variant')).toBe('squared');
  });

  it('uses "squared" variant when explicitly authored in CMS, regardless of defaultVariant', () => {
    render(
      <EslHeroSlider
        content={{
          variant: 'squared',
          slides: [sampleSlide],
        }}
        defaultVariant="circled"
      />
    );
    const carousel = screen.getByTestId('mock-hero-carousel');
    expect(carousel.getAttribute('data-variant')).toBe('squared');
  });

  it('uses "default" (circled) variant when explicitly authored in CMS, even if defaultVariant="squared"', () => {
    render(
      <EslHeroSlider
        content={{
          variant: 'circled',
          slides: [sampleSlide],
        }}
        defaultVariant="squared"
      />
    );
    const carousel = screen.getByTestId('mock-hero-carousel');
    expect(carousel.getAttribute('data-variant')).toBe('default');
  });

  it('correctly maps slide heading and passes slides to HeroCarousel', () => {
    render(<EslHeroSlider content={{ slides: [sampleSlide] }} />);
    expect(screen.getByText('Banking with Purpose.')).toBeDefined();
  });

  it('correctly maps CTA icons when present, and sets undefined when omitted or "none"', () => {
    render(
      <EslHeroSlider
        content={{
          slides: [
            {
              heading: 'Slide 1',
              primaryCta: { text: 'Apply' },
              primaryCtaIcon: 'arrow-right',
              secondaryCta: { text: 'Login' },
              secondaryCtaIcon: 'user',
            },
            {
              heading: 'Slide 2',
              primaryCta: { text: 'Explore' },
              primaryCtaIcon: 'none',
              secondaryCta: { text: 'Help' },
              // secondaryCtaIcon omitted
            },
          ],
        }}
      />
    );

    const primaryIcons = screen.getAllByTestId('slide-primary-icon');
    const secondaryIcons = screen.getAllByTestId('slide-secondary-icon');

    expect(primaryIcons[0].textContent).toBe('arrow-right');
    expect(secondaryIcons[0].textContent).toBe('user');

    expect(primaryIcons[1].textContent).toBe('none');
    expect(secondaryIcons[1].textContent).toBe('none');
  });
});

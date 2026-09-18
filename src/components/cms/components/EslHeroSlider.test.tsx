import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EslHeroSlider from './EslHeroSliderRenderer';

// Mock HeroCarousel to inspect the passed variant and slides props
vi.mock('@/components/organisms/hero-carousel/HeroCarousel', () => ({
  HeroCarousel: vi.fn(({ variant, slides }) => (
    <div data-testid="mock-hero-carousel" data-variant={variant}>
      {slides.map((s: { id: string; titleLine1: string }) => (
        <div key={s.id} data-testid="slide-title">{s.titleLine1}</div>
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
});

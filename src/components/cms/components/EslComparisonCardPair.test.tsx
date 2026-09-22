import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EslComparisonCardPair from './EslComparisonCardPairRenderer';
import { EslComparisonCardPairContentType } from './EslComparisonCardPair';
import { EslComparisonCardItemContentType } from './EslComparisonCardItem';
import { EslComparisonFeatureItemContentType } from './EslComparisonFeatureItem';

describe('EslComparisonCardPair Content Type & Renderer', () => {
  it('defines EslComparisonCardPair with expected properties and richText description', () => {
    expect(EslComparisonCardPairContentType.key).toBe('EslComparisonCardPair');
    expect(EslComparisonCardPairContentType.displayName).toBe('ESL Comparison Card Pair');
    expect(EslComparisonCardPairContentType.baseType).toBe('_component');
    expect(EslComparisonCardPairContentType.compositionBehaviors).toContain('sectionEnabled');

    const props = EslComparisonCardPairContentType.properties;
    expect(props).toBeDefined();
    expect(props.eyebrow.type).toBe('string');
    expect(props.title.type).toBe('string');
    expect(props.description.type).toBe('richText');
    expect(props.cards.type).toBe('array');
    expect(props.cards.items.type).toBe('component');
  });

  it('defines EslComparisonCardItem with expected properties and richText description', () => {
    expect(EslComparisonCardItemContentType.key).toBe('EslComparisonCardItem');
    expect(EslComparisonCardItemContentType.displayName).toBe('ESL Comparison Card Item');
    expect(EslComparisonCardItemContentType.baseType).toBe('_component');

    const props = EslComparisonCardItemContentType.properties;
    expect(props).toBeDefined();
    expect(props.title.type).toBe('string');
    expect(props.badgeText.type).toBe('string');
    expect(props.description.type).toBe('richText');
    expect(props.features.type).toBe('array');
    expect(props.features.items.type).toBe('component');
    expect(props.cta.type).toBe('link');
    expect(props.secondaryCta.type).toBe('link');
  });

  it('defines EslComparisonFeatureItem with expected properties and selectOne enum', () => {
    expect(EslComparisonFeatureItemContentType.key).toBe('EslComparisonFeatureItem');
    expect(EslComparisonFeatureItemContentType.displayName).toBe('ESL Comparison Feature Item');
    expect(EslComparisonFeatureItemContentType.baseType).toBe('_component');

    const props = EslComparisonFeatureItemContentType.properties;
    expect(props).toBeDefined();
    expect(props.text.type).toBe('string');
    expect(props.iconType.type).toBe('string');
    expect(props.iconType.format).toBe('selectOne');
    expect(props.iconType.enum).toEqual([
      { value: 'check', displayName: 'Check' },
      { value: 'credit-card', displayName: 'Credit Card' },
    ]);
  });

  it('returns null when content is missing or cards are empty (zero hardcoded fallback)', () => {
    const { container: c1 } = render(<EslComparisonCardPair content={undefined} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<EslComparisonCardPair content={null} />);
    expect(c2.firstChild).toBeNull();

    const { container: c3 } = render(<EslComparisonCardPair content={{}} />);
    expect(c3.firstChild).toBeNull();

    const { container: c4 } = render(
      <EslComparisonCardPair
        content={{
          title: 'Compare',
          cards: [],
        }}
      />
    );
    expect(c4.firstChild).toBeNull();
  });

  it('renders section and cards from CMS data with rich text descriptions, features, and CTAs', () => {
    const mockContent = {
      eyebrow: 'COMPARE OPTIONS',
      title: 'Find the right checking account for your needs.',
      description: {
        html: '<p>Explore our member-first personal checking tiers.</p>',
      },
      cards: [
        {
          title: 'Premier Checking',
          badgeText: 'Most Popular',
          description: {
            json: {
              text: 'Earn competitive monthly dividends and maximize savings.',
            },
          },
          features: [
            { text: 'Free nationwide ATM withdrawals', iconType: 'check' },
            { text: 'Contactless Visa debit card', iconType: 'credit-card' },
          ],
          cta: {
            text: 'Open Premier Checking',
            url: { default: '/checking/premier' },
            target: '_blank',
          },
        },
        {
          title: 'Essential Checking',
          badgeText: 'Simple Banking',
          description: {
            html: '<p>Straightforward everyday checking built for effortless budgeting.</p>',
          },
          features: [
            { text: 'Over 30,000 ATMs', iconType: 'check' },
          ],
          cta: {
            text: 'Open Essential Checking',
            url: { default: '/checking/essential' },
          },
          secondaryCta: {
            text: 'Learn More',
            url: { default: '/checking/essential/details' },
          },
        },
      ],
    };

    render(<EslComparisonCardPair content={mockContent} id="test-comparison" />);

    expect(screen.getByText('COMPARE OPTIONS')).toBeDefined();
    expect(screen.getByText('Find the right checking account for your needs.')).toBeDefined();
    expect(
      screen.getByText('Explore our member-first personal checking tiers.')
    ).toBeDefined();

    // Card 1
    expect(screen.getByText('Premier Checking')).toBeDefined();
    expect(screen.getByText('Most Popular')).toBeDefined();
    expect(
      screen.getByText('Earn competitive monthly dividends and maximize savings.')
    ).toBeDefined();
    expect(screen.getByText('Free nationwide ATM withdrawals')).toBeDefined();
    expect(screen.getByText('Contactless Visa debit card')).toBeDefined();
    const premierBtn = screen.getByRole('link', { name: /Open Premier Checking/i });
    expect(premierBtn).toBeDefined();
    expect(premierBtn.getAttribute('href')).toBe('/checking/premier');
    expect(premierBtn.getAttribute('target')).toBe('_blank');

    // Card 2
    expect(screen.getByText('Essential Checking')).toBeDefined();
    expect(screen.getByText('Simple Banking')).toBeDefined();
    expect(
      screen.getByText('Straightforward everyday checking built for effortless budgeting.')
    ).toBeDefined();
    expect(screen.getByText('Over 30,000 ATMs')).toBeDefined();
    const essentialBtn = screen.getByRole('link', { name: /Open Essential Checking/i });
    expect(essentialBtn).toBeDefined();
    expect(essentialBtn.getAttribute('href')).toBe('/checking/essential');
    const learnMoreBtn = screen.getByRole('link', { name: /Learn More/i });
    expect(learnMoreBtn).toBeDefined();
    expect(learnMoreBtn.getAttribute('href')).toBe('/checking/essential/details');
  });

  it('unwraps nested component objects correctly from Optimizely CMS payload', () => {
    const mockContent = {
      component: {
        title: 'Nested Comparison',
        cards: [
          {
            component: {
              title: 'Card One',
              description: 'Plain text description',
              features: [
                {
                  component: {
                    text: 'Nested Feature',
                    iconType: 'check',
                  },
                },
              ],
              cta: {
                text: 'Click Here',
                url: { default: '/click' },
              },
            },
          },
        ],
      },
    };

    render(<EslComparisonCardPair content={mockContent} />);

    expect(screen.getByText('Nested Comparison')).toBeDefined();
    expect(screen.getByText('Card One')).toBeDefined();
    expect(screen.getByText('Plain text description')).toBeDefined();
    expect(screen.getByText('Nested Feature')).toBeDefined();
    expect(screen.getByRole('link', { name: /Click Here/i })).toBeDefined();
  });

  it('does not render any CTA buttons when cta and secondaryCta are not defined', () => {
    const mockContent = {
      title: 'No CTA Comparison',
      cards: [
        {
          title: 'Card Without CTA',
          description: 'Just features and info',
          features: [
            { text: 'Feature A', iconType: 'check' },
          ],
        },
      ],
    };

    render(<EslComparisonCardPair content={mockContent} />);

    expect(screen.getByText('No CTA Comparison')).toBeDefined();
    expect(screen.getByText('Card Without CTA')).toBeDefined();
    expect(screen.getByText('Feature A')).toBeDefined();
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });
});

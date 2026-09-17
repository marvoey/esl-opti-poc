import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EslVerticalSelectorFeatureCard from './EslVerticalSelectorFeatureCardRenderer';
import { EslVerticalSelectorFeatureCardContentType } from './EslVerticalSelectorFeatureCard';

describe('EslVerticalSelectorFeatureCard CMS Component', () => {
  it('exposes correct Optimizely Content Type definition', () => {
    expect(EslVerticalSelectorFeatureCardContentType.key).toBe('EslVerticalSelectorFeatureCard');
    expect(EslVerticalSelectorFeatureCardContentType.displayName).toBe(
      'ESL Vertical Selector Feature Card'
    );
    expect(EslVerticalSelectorFeatureCardContentType.baseType).toBe('_component');
    expect(EslVerticalSelectorFeatureCardContentType.compositionBehaviors).toContain(
      'sectionEnabled'
    );
    expect(EslVerticalSelectorFeatureCardContentType.compositionBehaviors).toContain(
      'elementEnabled'
    );
    expect(EslVerticalSelectorFeatureCardContentType.properties).toHaveProperty(
      'showVerticalSelector'
    );
    expect(EslVerticalSelectorFeatureCardContentType.properties.showVerticalSelector.type).toBe(
      'boolean'
    );
    expect(EslVerticalSelectorFeatureCardContentType.properties).toHaveProperty('heading');
    expect(EslVerticalSelectorFeatureCardContentType.properties.heading.type).toBe('string');
  });

  it('renders default VerticalSelectorFeatureCard when showVerticalSelector is true or undefined', () => {
    render(<EslVerticalSelectorFeatureCard content={{ showVerticalSelector: true }} />);

    expect(screen.getByText('BANKING FOR EVERY STAGE OF LIFE')).toBeDefined();
    expect(
      screen.getByRole('heading', {
        name: 'Wherever you are, we’ll help you take the next step.',
      })
    ).toBeDefined();
    expect(screen.getByRole('tab', { name: /Just starting out/i })).toBeDefined();
  });

  it('returns null and does not render when showVerticalSelector is explicitly false', () => {
    const { container } = render(
      <EslVerticalSelectorFeatureCard content={{ showVerticalSelector: false }} />
    );

    expect(container.innerHTML).toBe('');
  });

  it('allows overriding the title via the heading property', () => {
    render(
      <EslVerticalSelectorFeatureCard
        content={{
          showVerticalSelector: true,
          heading: 'Custom Life Stages & Solutions',
        }}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Custom Life Stages & Solutions' })
    ).toBeDefined();
  });

  it('unwraps component property when nested inside Visual Builder composition node', () => {
    render(
      <EslVerticalSelectorFeatureCard
        content={{
          component: {
            showVerticalSelector: true,
            heading: 'Visual Builder Heading',
          },
        }}
      />
    );

    expect(screen.getByRole('heading', { name: 'Visual Builder Heading' })).toBeDefined();
  });

  it('returns null when nested component has showVerticalSelector: false', () => {
    const { container } = render(
      <EslVerticalSelectorFeatureCard
        content={{
          component: {
            showVerticalSelector: false,
          },
        }}
      />
    );

    expect(container.innerHTML).toBe('');
  });
});

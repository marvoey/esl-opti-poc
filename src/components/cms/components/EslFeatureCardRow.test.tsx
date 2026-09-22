import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EslFeatureCardRow from './EslFeatureCardRowRenderer';
import { EslFeatureCardRowContentType } from './EslFeatureCardRow';

describe('EslFeatureCardRow CMS Component', () => {
  it('defines EslFeatureCardRow with expected properties', () => {
    expect(EslFeatureCardRowContentType.key).toBe('EslFeatureCardRow');
    expect(EslFeatureCardRowContentType.displayName).toBe('ESL Feature Card Row');
    expect(EslFeatureCardRowContentType.baseType).toBe('_component');
    expect(EslFeatureCardRowContentType.compositionBehaviors).toContain('sectionEnabled');
    expect(EslFeatureCardRowContentType.compositionBehaviors).toContain('elementEnabled');

    const props = EslFeatureCardRowContentType.properties;
    expect(props).toBeDefined();
    expect(props.showFeatureCardRow.type).toBe('boolean');
    expect(props.heading.type).toBe('string');
  });

  it('renders default FeatureCardRow when showFeatureCardRow is true or undefined', () => {
    render(<EslFeatureCardRow content={{ showFeatureCardRow: true }} />);
    expect(screen.getByText('WHY PREMIER')).toBeDefined();
    expect(screen.getByText('What you get with Premier Checking.')).toBeDefined();
    expect(screen.getByText('Keep more of your money')).toBeDefined();
    expect(screen.getByText('Your balance earns')).toBeDefined();
    expect(screen.getByText('Bank wherever you are')).toBeDefined();
  });

  it('renders null when showFeatureCardRow is explicitly false', () => {
    const { container } = render(
      <EslFeatureCardRow content={{ showFeatureCardRow: false }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('applies heading override when provided', () => {
    render(
      <EslFeatureCardRow
        content={{
          showFeatureCardRow: true,
          heading: 'Custom Feature Row Heading',
        }}
      />
    );
    expect(screen.getByText('Custom Feature Row Heading')).toBeDefined();
  });

  it('unwraps nested component object correctly', () => {
    render(
      <EslFeatureCardRow
        content={{
          component: {
            showFeatureCardRow: true,
            heading: 'Nested Feature Row Heading',
          },
        }}
      />
    );
    expect(screen.getByText('Nested Feature Row Heading')).toBeDefined();
  });
});

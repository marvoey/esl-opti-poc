import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EslFinalCta from './EslFinalCtaRenderer';
import { EslFinalCtaContentType } from './EslFinalCta';

describe('EslFinalCta CMS Component', () => {
  it('defines EslFinalCta with expected properties and composition behaviors', () => {
    expect(EslFinalCtaContentType.key).toBe('EslFinalCta');
    expect(EslFinalCtaContentType.displayName).toBe('ESL Final CTA');
    expect(EslFinalCtaContentType.baseType).toBe('_component');
    expect(EslFinalCtaContentType.compositionBehaviors).toContain('sectionEnabled');
    expect(EslFinalCtaContentType.compositionBehaviors).toContain('elementEnabled');

    const props = EslFinalCtaContentType.properties;
    expect(props).toBeDefined();
    expect(props.showFinalCta.type).toBe('boolean');
    expect(props.heading.type).toBe('string');
  });

  it('renders default FinalCta when showFinalCta is true or undefined', () => {
    render(<EslFinalCta content={{ showFinalCta: true }} />);
    expect(
      screen.getByText('Ready to open your ESL savings account?')
    ).toBeDefined();
    expect(screen.getByText('Open a savings account')).toBeDefined();
  });

  it('renders null when showFinalCta is explicitly false', () => {
    const { container } = render(
      <EslFinalCta content={{ showFinalCta: false }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('applies heading override when provided', () => {
    render(
      <EslFinalCta
        content={{
          showFinalCta: true,
          heading: 'Custom Final CTA Heading',
        }}
      />
    );
    expect(screen.getByText('Custom Final CTA Heading')).toBeDefined();
  });

  it('unwraps nested component object correctly', () => {
    render(
      <EslFinalCta
        content={{
          component: {
            showFinalCta: true,
            heading: 'Nested Final CTA Heading',
          },
        }}
      />
    );
    expect(screen.getByText('Nested Final CTA Heading')).toBeDefined();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EslSplitContentCta from './EslSplitContentCtaRenderer';
import { EslSplitContentCtaContentType } from './EslSplitContentCta';

describe('EslSplitContentCta CMS Component', () => {
  it('defines EslSplitContentCta with expected properties', () => {
    expect(EslSplitContentCtaContentType.key).toBe('EslSplitContentCta');
    expect(EslSplitContentCtaContentType.displayName).toBe('ESL Split Content CTA');
    expect(EslSplitContentCtaContentType.baseType).toBe('_component');
    expect(EslSplitContentCtaContentType.compositionBehaviors).toContain('sectionEnabled');
    expect(EslSplitContentCtaContentType.compositionBehaviors).toContain('elementEnabled');

    const props = EslSplitContentCtaContentType.properties;
    expect(props).toBeDefined();
    expect(props.showSplitContentCta.type).toBe('boolean');
    expect(props.heading.type).toBe('string');
  });

  it('renders default SplitContentCta when showSplitContentCta is true or undefined', () => {
    render(<EslSplitContentCta content={{ showSplitContentCta: true }} />);
    expect(
      screen.getByText("Still weighing it up? Let's talk it through.")
    ).toBeDefined();
    expect(screen.getByText('Find a branch')).toBeDefined();
    expect(screen.getByText('Contact us')).toBeDefined();
  });

  it('renders null when showSplitContentCta is explicitly false', () => {
    const { container } = render(
      <EslSplitContentCta content={{ showSplitContentCta: false }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('applies heading override when provided', () => {
    render(
      <EslSplitContentCta
        content={{
          showSplitContentCta: true,
          heading: 'Custom Split CTA Heading',
        }}
      />
    );
    expect(screen.getByText('Custom Split CTA Heading')).toBeDefined();
  });

  it('unwraps nested component object correctly', () => {
    render(
      <EslSplitContentCta
        content={{
          component: {
            showSplitContentCta: true,
            heading: 'Nested Split CTA Heading',
          },
        }}
      />
    );
    expect(screen.getByText('Nested Split CTA Heading')).toBeDefined();
  });
});

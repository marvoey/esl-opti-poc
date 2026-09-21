import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EslFaqStates from './EslFaqStatesRenderer';
import { EslFaqStatesContentType } from './EslFaqStates';

describe('EslFaqStates CMS Component', () => {
  it('exposes correct Optimizely Content Type definition', () => {
    expect(EslFaqStatesContentType.key).toBe('EslFaqStates');
    expect(EslFaqStatesContentType.displayName).toBe('ESL FAQ States');
    expect(EslFaqStatesContentType.baseType).toBe('_component');
    expect(EslFaqStatesContentType.compositionBehaviors).toContain('sectionEnabled');
    expect(EslFaqStatesContentType.compositionBehaviors).toContain('elementEnabled');
    expect(EslFaqStatesContentType.properties).toHaveProperty('showFaqStates');
    expect(EslFaqStatesContentType.properties.showFaqStates.type).toBe('boolean');
    expect(EslFaqStatesContentType.properties).toHaveProperty('heading');
    expect(EslFaqStatesContentType.properties.heading.type).toBe('string');
  });

  it('renders default FaqStates when showFaqStates is true or undefined', () => {
    render(<EslFaqStates content={{ showFaqStates: true }} />);

    expect(screen.getByText('COMMON QUESTIONS')).toBeDefined();
    expect(screen.getByRole('heading', { name: 'Questions, answered simply.' })).toBeDefined();
    expect(screen.getByText('Who can open an ESL checking account?')).toBeDefined();
    expect(screen.getByText('Is there a monthly fee for Premier Checking?')).toBeDefined();
  });

  it('returns null and does not render when showFaqStates is explicitly false', () => {
    const { container } = render(<EslFaqStates content={{ showFaqStates: false }} />);

    expect(container.innerHTML).toBe('');
  });

  it('allows overriding the title via the heading property', () => {
    render(
      <EslFaqStates
        content={{
          showFaqStates: true,
          heading: 'Frequently Asked Questions',
        }}
      />
    );

    expect(screen.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeDefined();
  });

  it('unwraps component property when nested inside Visual Builder composition node', () => {
    render(
      <EslFaqStates
        content={{
          component: {
            showFaqStates: true,
            heading: 'Visual Builder FAQ',
          },
        }}
      />
    );

    expect(screen.getByRole('heading', { name: 'Visual Builder FAQ' })).toBeDefined();
  });

  it('returns null when nested component has showFaqStates: false', () => {
    const { container } = render(
      <EslFaqStates
        content={{
          component: {
            showFaqStates: false,
          },
        }}
      />
    );

    expect(container.innerHTML).toBe('');
  });
});

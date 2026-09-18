import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EslKeyFactsRow from './EslKeyFactsRowRenderer';

function mockRichText(text: string, htmlStr?: string) {
  return {
    html: htmlStr || `<p>${text}</p>`,
    json: {
      type: 'richText' as const,
      children: [{ text }],
    },
  };
}

describe('EslKeyFactsRow CMS Component', () => {
  it('returns null when content is undefined or null', () => {
    const { container: c1 } = render(<EslKeyFactsRow content={undefined} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<EslKeyFactsRow content={null} />);
    expect(c2.firstChild).toBeNull();
  });

  it('returns null when facts array is empty', () => {
    const { container } = render(
      <EslKeyFactsRow
        content={{
          title: 'Details at a glance',
          subtitle: 'Applies to both checking accounts',
          facts: [],
        }}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders title, subtitle, and tiles from CMS data', () => {
    render(
      <EslKeyFactsRow
        content={{
          title: 'Premier Details',
          subtitle: 'Specific to checking',
          facts: [
            {
              value: '$0',
              callout: 'Monthly fee',
              description: mockRichText('With $1,000 balance'),
            },
            {
              value: '$1',
              callout: 'Min to open',
              description: mockRichText('Quick content'),
            },
          ],
        }}
      />
    );

    expect(screen.getByText('Premier Details')).toBeDefined();
    expect(screen.getByText('Specific to checking')).toBeDefined();
    expect(screen.getByText('$0')).toBeDefined();
    expect(screen.getByText('Monthly fee')).toBeDefined();
    expect(screen.getByText('With $1,000 balance')).toBeDefined();
    expect(screen.getByText('$1')).toBeDefined();
    expect(screen.getByText('Min to open')).toBeDefined();
  });

  it('extracts rich text description correctly from HTML and JSON payloads', () => {
    render(
      <EslKeyFactsRow
        content={{
          title: 'Rich Text Facts',
          facts: [
            {
              value: 'Free',
              callout: 'ATM Access',
              description: mockRichText('Up to 5 free withdrawals', '<p>Up to <strong>5 free</strong> withdrawals</p>'),
            },
            {
              value: '80',
              callout: 'Free Checks',
              description: {
                html: null,
                json: {
                  type: 'richText' as const,
                  children: [
                    {
                      text: 'With your first order',
                    },
                  ],
                },
              },
            },
          ],
        }}
      />
    );

    expect(screen.getByText('Up to 5 free withdrawals')).toBeDefined();
    expect(screen.getByText('With your first order')).toBeDefined();
  });

  it('unwraps component wrapper when nested in Visual Builder node format', () => {
    render(
      <EslKeyFactsRow
        content={{
          component: {
            title: 'Wrapped Facts',
            facts: [
              {
                component: {
                  value: '100%',
                  callout: 'Satisfaction',
                  description: mockRichText('Guaranteed'),
                },
              },
            ],
          },
        }}
      />
    );

    expect(screen.getByText('Wrapped Facts')).toBeDefined();
    expect(screen.getByText('100%')).toBeDefined();
    expect(screen.getByText('Satisfaction')).toBeDefined();
    expect(screen.getByText('Guaranteed')).toBeDefined();
  });
});

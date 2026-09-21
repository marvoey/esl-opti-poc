import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EslProductCardsRow from './EslProductCardsRowRenderer';
import { EslProductCardsRowContentType } from './EslProductCardsRow';
import { EslProductCardItemContentType } from './EslProductCardItem';

vi.mock('@optimizely/cms-sdk/react/richText', () => ({
  RichText: ({ content }: { content: Record<string, unknown> }) => (
    <div data-testid="mock-rich-text">{JSON.stringify(content)}</div>
  ),
}));

function mockRichText(text: string) {
  return {
    html: `<p>${text}</p>`,
    json: {
      type: 'richText' as const,
      children: [{ text }],
    },
  };
}

describe('EslProductCardsRow Content Type & Renderer', () => {
  it('defines EslProductCardsRow with expected properties', () => {
    expect(EslProductCardsRowContentType.key).toBe('EslProductCardsRow');
    expect(EslProductCardsRowContentType.displayName).toBe('ESL Product Cards Row');
    expect(EslProductCardsRowContentType.baseType).toBe('_component');
    expect(EslProductCardsRowContentType.compositionBehaviors).toContain('sectionEnabled');
    expect(EslProductCardsRowContentType.properties.eyebrow).toBeDefined();
    expect(EslProductCardsRowContentType.properties.title).toBeDefined();
    expect(EslProductCardsRowContentType.properties.description).toBeDefined();
    expect(EslProductCardsRowContentType.properties.description.type).toBe('richText');
    expect(EslProductCardsRowContentType.properties.items).toBeDefined();
    expect(EslProductCardsRowContentType.properties.items.type).toBe('array');
  });

  it('defines EslProductCardItem with expected properties', () => {
    expect(EslProductCardItemContentType.key).toBe('EslProductCardItem');
    expect(EslProductCardItemContentType.displayName).toBe('ESL Product Card Item');
    expect(EslProductCardItemContentType.baseType).toBe('_component');
    expect(EslProductCardItemContentType.compositionBehaviors).toContain('elementEnabled');
    expect(EslProductCardItemContentType.properties.title).toBeDefined();
    expect(EslProductCardItemContentType.properties.description).toBeDefined();
    expect(EslProductCardItemContentType.properties.description.type).toBe('richText');
  });

  it('returns null when content or items is undefined, null, or empty', () => {
    const { container: c1 } = render(<EslProductCardsRow content={undefined} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<EslProductCardsRow content={null} />);
    expect(c2.firstChild).toBeNull();

    const { container: c3 } = render(<EslProductCardsRow content={{}} />);
    expect(c3.firstChild).toBeNull();

    const { container: c4 } = render(<EslProductCardsRow content={{ items: [] }} />);
    expect(c4.firstChild).toBeNull();
  });

  it('renders section with eyebrow, title, rich text description, and product cards', () => {
    render(
      <EslProductCardsRow
        content={{
          eyebrow: 'IS THIS RIGHT FOR YOU?',
          title: 'An honest look at the fit',
          description: mockRichText('Premier is not for everyone.'),
          items: [
            {
              title: 'You usually keep $1,000 or more in checking',
              description: mockRichText('Stay above the balance line and fees disappear.'),
            },
            {
              title: 'You want your everyday money to earn',
              description: 'Premier pays a competitive dividend.',
            },
          ],
        }}
      />
    );

    expect(screen.getByText('IS THIS RIGHT FOR YOU?')).toBeDefined();
    expect(screen.getByText('An honest look at the fit')).toBeDefined();
    expect(screen.getAllByTestId('mock-rich-text').length).toBe(2);
    expect(screen.getByText('You usually keep $1,000 or more in checking')).toBeDefined();
    expect(screen.getByText('You want your everyday money to earn')).toBeDefined();
    expect(screen.getByText('Premier pays a competitive dividend.')).toBeDefined();
  });

  it('handles nested component data structure from Optimizely Graph', () => {
    render(
      <EslProductCardsRow
        content={{
          component: {
            eyebrow: 'FIT CHECK',
            title: 'Card Fit Overview',
            items: [
              {
                component: {
                  title: 'Nested Card Title',
                  description: 'Nested Card Description',
                },
              },
            ],
          },
        }}
      />
    );

    expect(screen.getByText('FIT CHECK')).toBeDefined();
    expect(screen.getByText('Card Fit Overview')).toBeDefined();
    expect(screen.getByText('Nested Card Title')).toBeDefined();
    expect(screen.getByText('Nested Card Description')).toBeDefined();
  });

  it('renders description provided via rowDescription alias', () => {
    render(
      <EslProductCardsRow
        content={{
          rowDescription: mockRichText('Description via rowDescription alias'),
          items: [
            {
              title: 'Card Title',
              description: 'Card Desc',
            },
          ],
        }}
      />
    );

    expect(screen.getByTestId('mock-rich-text')).toBeDefined();
    expect(screen.getByText('Card Title')).toBeDefined();
  });
});

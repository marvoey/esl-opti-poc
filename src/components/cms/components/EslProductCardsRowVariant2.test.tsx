import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EslProductCardsRowVariant2 from './EslProductCardsRowVariant2Renderer';
import { EslProductCardsRowVariant2ContentType } from './EslProductCardsRowVariant2';
import { EslProductCardsRowVariant2ItemContentType } from './EslProductCardsRowVariant2Item';

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

describe('EslProductCardsRowVariant2 Content Type & Renderer', () => {
  it('defines EslProductCardsRowVariant2 with expected properties', () => {
    expect(EslProductCardsRowVariant2ContentType.key).toBe('EslProductCardsRowVariant2');
    expect(EslProductCardsRowVariant2ContentType.displayName).toBe('ESL Product Cards Row Variant 2');
    expect(EslProductCardsRowVariant2ContentType.baseType).toBe('_component');
    expect(EslProductCardsRowVariant2ContentType.compositionBehaviors).toContain('sectionEnabled');
    expect(EslProductCardsRowVariant2ContentType.properties.eyebrow).toBeDefined();
    expect(EslProductCardsRowVariant2ContentType.properties.title).toBeDefined();
    expect(EslProductCardsRowVariant2ContentType.properties.description).toBeDefined();
    expect(EslProductCardsRowVariant2ContentType.properties.description.type).toBe('richText');
    expect(EslProductCardsRowVariant2ContentType.properties.items).toBeDefined();
    expect(EslProductCardsRowVariant2ContentType.properties.items.type).toBe('array');
  });

  it('defines EslProductCardsRowVariant2Item with expected properties', () => {
    expect(EslProductCardsRowVariant2ItemContentType.key).toBe('EslProductCardsRowVariant2Item');
    expect(EslProductCardsRowVariant2ItemContentType.displayName).toBe('ESL Product Cards Row Variant 2 Item');
    expect(EslProductCardsRowVariant2ItemContentType.baseType).toBe('_component');
    expect(EslProductCardsRowVariant2ItemContentType.compositionBehaviors).toContain('elementEnabled');
    expect(EslProductCardsRowVariant2ItemContentType.properties.icon).toBeDefined();
    expect(EslProductCardsRowVariant2ItemContentType.properties.title).toBeDefined();
    expect(EslProductCardsRowVariant2ItemContentType.properties.description).toBeDefined();
    expect(EslProductCardsRowVariant2ItemContentType.properties.description.type).toBe('richText');
    expect(EslProductCardsRowVariant2ItemContentType.properties.link).toBeDefined();
    expect(EslProductCardsRowVariant2ItemContentType.properties.link.type).toBe('link');
  });

  it('returns null when content or items is undefined, null, or empty', () => {
    const { container: c1 } = render(<EslProductCardsRowVariant2 content={undefined} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<EslProductCardsRowVariant2 content={null} />);
    expect(c2.firstChild).toBeNull();

    const { container: c3 } = render(<EslProductCardsRowVariant2 content={{}} />);
    expect(c3.firstChild).toBeNull();

    const { container: c4 } = render(<EslProductCardsRowVariant2 content={{ items: [] }} />);
    expect(c4.firstChild).toBeNull();
  });

  it('renders section with eyebrow, title, rich text description, and tool cards with CTA links', () => {
    render(
      <EslProductCardsRowVariant2
        content={{
          eyebrow: 'WORKS WITH YOUR ACCOUNT',
          title: 'The everyday tools that come with it.',
          description: mockRichText('Whichever account you choose, these come along.'),
          items: [
            {
              icon: 'credit-card',
              title: 'ESL Visa Debit Card',
              description: mockRichText('Tap, swipe, or add to digital wallet.'),
              link: {
                text: 'About the debit card',
                url: { default: '/personal/checking/debit-card' },
              },
            },
            {
              icon: 'piggy-bank',
              title: 'Direct Deposit',
              description: 'Have your paycheck land in your account.',
              link: {
                title: 'Set up direct deposit',
                url: { default: '/personal/checking/direct-deposit' },
              },
            },
          ],
        }}
      />
    );

    expect(screen.getByText('WORKS WITH YOUR ACCOUNT')).toBeDefined();
    expect(screen.getByText('The everyday tools that come with it.')).toBeDefined();
    expect(screen.getAllByTestId('mock-rich-text').length).toBe(2);
    expect(screen.getByText('ESL Visa Debit Card')).toBeDefined();
    expect(screen.getByText('About the debit card')).toBeDefined();
    expect(screen.getByText('Direct Deposit')).toBeDefined();
    expect(screen.getByText('Have your paycheck land in your account.')).toBeDefined();
    expect(screen.getByText('Set up direct deposit')).toBeDefined();

    const links = screen.getAllByRole('link');
    expect(links.some((l) => l.getAttribute('href') === '/personal/checking/debit-card')).toBe(true);
    expect(links.some((l) => l.getAttribute('href') === '/personal/checking/direct-deposit')).toBe(true);
  });

  it('handles nested component data structure from Optimizely Graph', () => {
    render(
      <EslProductCardsRowVariant2
        content={{
          component: {
            eyebrow: 'TOOLS',
            title: 'Everyday Banking',
            items: [
              {
                component: {
                  icon: 'shield-check',
                  title: 'Overdraft options',
                  description: 'A few simple ways to cover the unexpected.',
                  link: {
                    text: 'Compare overdraft options',
                    url: { default: '/personal/checking/overdraft-options' },
                  },
                },
              },
            ],
          },
        }}
      />
    );

    expect(screen.getByText('TOOLS')).toBeDefined();
    expect(screen.getByText('Everyday Banking')).toBeDefined();
    expect(screen.getByText('Overdraft options')).toBeDefined();
    expect(screen.getByText('A few simple ways to cover the unexpected.')).toBeDefined();
    expect(screen.getByText('Compare overdraft options')).toBeDefined();
  });

  it('renders description provided via rowDescription alias', () => {
    render(
      <EslProductCardsRowVariant2
        content={{
          rowDescription: mockRichText('Tools description via rowDescription'),
          items: [
            {
              icon: 'credit-card',
              title: 'Card',
              description: 'Desc',
            },
          ],
        }}
      />
    );

    expect(screen.getByTestId('mock-rich-text')).toBeDefined();
    expect(screen.getByText('Card')).toBeDefined();
  });
});

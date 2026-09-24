import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EslLongTextLeftCardsRight from './EslLongTextLeftCardsRightRenderer';
import { EslLongTextLeftCardsRightContentType } from './EslLongTextLeftCardsRight';
import {
  EslLongTextLeftCardsRightCardContentType,
  LONG_TEXT_LEFT_CARDS_RIGHT_CARD_ICONS,
} from './EslLongTextLeftCardsRightCard';
import { EslLongTextLeftCardsRightPromoContentType } from './EslLongTextLeftCardsRightPromo';
import {
  DEFAULT_LONG_TEXT_LEFT_CARDS_RIGHT_PROPS,
  LONG_TEXT_LEFT_CARDS_RIGHT_ICON_NAMES,
} from '@/components/organisms/long-text-left-cards-right';

vi.mock('@optimizely/cms-sdk/react/richText', () => ({
  RichText: ({ content }: { content: { children?: Array<{ text?: string }> } }) => (
    <div data-testid="mock-rich-text">{content.children?.map((c) => c.text).join('')}</div>
  ),
}));

function mockRichText(text: string) {
  return {
    html: `<p>${text}</p>`,
    json: { type: 'richText' as const, children: [{ text }] },
  };
}

const fullContent = {
  title: '  Am I actually ready to buy?  ',
  body: mockRichText('Readiness is three things.'),
  promo: {
    eyebrow: 'Something at ESL that helps here',
    heading: 'Get pre-approved before you shop',
    description: { html: '<p>A pre-approval puts a real number on your range.</p>' },
    cta: { text: 'How pre-approval works', url: { default: '/pre-approval' } },
  },
  items: [
    {
      icon: 'gauge',
      eyebrow: 'Tool · 5 min',
      title: 'Homebuying readiness check',
      description: { html: '<p>Twelve questions.</p>' },
      link: { url: { default: '/tools/readiness' } },
    },
    {
      icon: 'key-round',
      eyebrow: 'Article · 6 min',
      title: 'What lenders look at',
      link: { url: { default: 'https://example.com/lenders' }, target: '_blank' },
    },
  ],
};

describe('EslLongTextLeftCardsRight Content Type & Renderer', () => {
  it('defines EslLongTextLeftCardsRight as a section with title, body, promo and cards', () => {
    const type = EslLongTextLeftCardsRightContentType;
    expect(type.key).toBe('EslLongTextLeftCardsRight');
    expect(type.displayName).toBe('ESL Long Text Left Cards Right');
    expect(type.baseType).toBe('_component');
    expect(type.compositionBehaviors).toEqual(['sectionEnabled']);
    expect(type.properties.title.type).toBe('string');
    expect(type.properties.body.type).toBe('richText');
    expect(type.properties.promo.type).toBe('component');
    expect(type.properties.promo.contentType).toBe(EslLongTextLeftCardsRightPromoContentType);
    expect(type.properties.items.type).toBe('array');
    expect(type.properties.items.items.type).toBe('component');
    expect(type.properties.items.items.contentType).toBe(EslLongTextLeftCardsRightCardContentType);
  });

  it('defines the card as an element with icon, eyebrow, title, description and link', () => {
    const type = EslLongTextLeftCardsRightCardContentType;
    expect(type.key).toBe('EslLongTextLeftCardsRightCard');
    expect(type.displayName).toBe('ESL Long Text Left Cards Right Card');
    expect(type.baseType).toBe('_component');
    expect(type.compositionBehaviors).toEqual(['elementEnabled']);
    expect(type.properties.icon.type).toBe('string');
    expect(type.properties.icon.format).toBe('selectOne');
    expect(type.properties.eyebrow.type).toBe('string');
    expect(type.properties.title.type).toBe('string');
    expect(type.properties.description.type).toBe('richText');
    expect(type.properties.link.type).toBe('link');
  });

  it('defines the promo with the EslMegaMenuPromo field names', () => {
    const type = EslLongTextLeftCardsRightPromoContentType;
    expect(type.key).toBe('EslLongTextLeftCardsRightPromo');
    expect(type.displayName).toBe('ESL Long Text Left Cards Right Promo');
    expect(type.baseType).toBe('_component');
    expect('compositionBehaviors' in type).toBe(false);
    expect(type.properties.eyebrow.type).toBe('string');
    expect(type.properties.heading.type).toBe('string');
    expect(type.properties.description.type).toBe('richText');
    expect(type.properties.cta.type).toBe('link');
  });

  it('offers exactly the icons the organism can render', () => {
    expect(LONG_TEXT_LEFT_CARDS_RIGHT_CARD_ICONS.map((i) => i.value)).toEqual([
      ...LONG_TEXT_LEFT_CARDS_RIGHT_ICON_NAMES,
    ]);
  });

  it('returns null when content is missing or has neither a title nor cards', () => {
    [
      undefined,
      null,
      {},
      { items: [] },
      { body: mockRichText('Body only') },
      { promo: { heading: 'Promo only' } },
      { items: [{ title: '   ' }, null] },
    ].forEach((content) => {
      const { container, unmount } = render(<EslLongTextLeftCardsRight content={content} />);
      expect(container.firstChild).toBeNull();
      unmount();
    });
  });

  it('maps title, body, promo and cards with links and icons', () => {
    const { container } = render(<EslLongTextLeftCardsRight id="ready" content={fullContent} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Am I actually ready to buy?' })).toBeDefined();
    expect(screen.getByTestId('mock-rich-text').textContent).toBe('Readiness is three things.');

    expect(screen.getByText('Something at ESL that helps here')).toBeDefined();
    expect(screen.getByRole('heading', { level: 3, name: 'Get pre-approved before you shop' })).toBeDefined();
    expect(screen.getByText('A pre-approval puts a real number on your range.')).toBeDefined();
    expect(screen.getByRole('link', { name: 'How pre-approval works' }).getAttribute('href')).toBe('/pre-approval');

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Tool · 5 min')).toBeDefined();
    expect(screen.getByRole('link', { name: 'Homebuying readiness check' }).getAttribute('href')).toBe('/tools/readiness');
    const external = screen.getByRole('link', { name: 'What lenders look at' });
    expect(external.getAttribute('target')).toBe('_blank');
    expect(external.getAttribute('rel')).toBe('noopener noreferrer');
    expect(screen.getByText('Twelve questions.')).toBeDefined();

    expect(container.querySelector('svg.lucide-gauge')).not.toBeNull();
    expect(container.querySelector('svg.lucide-key-round')).not.toBeNull();
  });

  it('unwraps Visual Builder component wrappers on the section, the promo and the cards', () => {
    render(
      <EslLongTextLeftCardsRight
        content={{
          component: {
            title: 'Wrapped title',
            promo: { component: { heading: 'Wrapped promo' } },
            items: [{ component: { title: 'Wrapped card', link: { url: { default: '/wrapped' } } } }],
          },
        }}
      />
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Wrapped title' })).toBeDefined();
    expect(screen.getByRole('heading', { level: 3, name: 'Wrapped promo' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Wrapped card' }).getAttribute('href')).toBe('/wrapped');
  });

  it('hides the promo without a heading, drops untitled cards, unknown icons and label-less promo links', () => {
    const { container } = render(
      <EslLongTextLeftCardsRight
        content={{
          title: 'Title',
          promo: { eyebrow: 'Orphan badge', cta: { url: { default: '/x' } } },
          items: [
            { description: mockRichText('Orphan description') },
            { title: 'Plain card', icon: 'not-an-icon' },
          ],
        }}
      />
    );

    expect(screen.queryByText('Orphan badge')).toBeNull();
    expect(screen.queryByText('Orphan description')).toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.queryByRole('link')).toBeNull();
    expect(container.querySelector('li svg')).toBeNull();
  });

  it('never injects fixture copy when fields are empty', () => {
    const { container } = render(
      <EslLongTextLeftCardsRight content={{ title: '', promo: {}, items: [{ title: 'Card' }] }} />
    );
    const text = container.textContent || '';
    const fixture = DEFAULT_LONG_TEXT_LEFT_CARDS_RIGHT_PROPS;

    [
      fixture.title!,
      String(fixture.body),
      fixture.promo!.eyebrow!,
      fixture.promo!.heading!,
      String(fixture.promo!.description),
      fixture.promo!.cta!.label,
      ...fixture.items.flatMap((item) => [item.title, item.eyebrow!, String(item.description)]),
    ].forEach((copy) => expect(text).not.toContain(copy));
  });
});

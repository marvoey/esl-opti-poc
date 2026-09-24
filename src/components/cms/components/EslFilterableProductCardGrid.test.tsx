import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EslFilterableProductCardGrid from './EslFilterableProductCardGridRenderer';
import { EslFilterableProductCardGridContentType } from './EslFilterableProductCardGrid';
import { EslFilterableProductCardGridItemContentType } from './EslFilterableProductCardGridItem';
import { DEFAULT_FILTERABLE_PRODUCT_CARD_GRID_PROPS } from '@/components/organisms/filterable-product-card-grid';

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
  eyebrow: ' FIND YOUR FIT ',
  title: 'Six ways to save.',
  description: mockRichText('Pick what matters most.'),
  allFilterLabel: 'All accounts',
  filters: ['Keeping it simple', '  ', null, 'Saving for medical costs'],
  noResultsText: 'No accounts match.',
  items: [
    {
      title: 'Daily Dividend',
      description: { html: '<p>No minimum balance.</p>' },
      rate: ' X.XX% APY ',
      filterTags: ['keeping it simple', null],
      link: { text: 'See Details', url: { default: '/savings/daily-dividend' } },
    },
    {
      title: 'Health Savings Account',
      rate: 'Y.YY% APY',
      filterTags: ['Saving for medical costs'],
      link: { text: 'See Details', url: { default: 'https://example.com/hsa' }, target: '_blank' },
    },
  ],
};

function cardTitles() {
  return screen.queryAllByRole('heading', { level: 3 }).map((h) => h.textContent);
}

describe('EslFilterableProductCardGrid Content Type & Renderer', () => {
  it('defines EslFilterableProductCardGrid as a section with header, filters, cards and no-results text', () => {
    const type = EslFilterableProductCardGridContentType;
    expect(type.key).toBe('EslFilterableProductCardGrid');
    expect(type.displayName).toBe('ESL Filterable Product Card Grid');
    expect(type.baseType).toBe('_component');
    expect(type.compositionBehaviors).toEqual(['sectionEnabled']);
    expect(type.properties.eyebrow.type).toBe('string');
    expect(type.properties.title.type).toBe('string');
    expect(type.properties.description.type).toBe('richText');
    expect(type.properties.allFilterLabel.type).toBe('string');
    expect(type.properties.filters.type).toBe('array');
    expect(type.properties.filters.items.type).toBe('string');
    expect(type.properties.items.type).toBe('array');
    expect(type.properties.items.items.type).toBe('component');
    expect(type.properties.items.items.contentType).toBe(EslFilterableProductCardGridItemContentType);
    expect(type.properties.noResultsText.type).toBe('string');
  });

  it('defines the card as an element with title, description, rate, filter tags and link', () => {
    const type = EslFilterableProductCardGridItemContentType;
    expect(type.key).toBe('EslFilterableProductCardGridItem');
    expect(type.displayName).toBe('ESL Filterable Product Card Grid Item');
    expect(type.baseType).toBe('_component');
    expect(type.compositionBehaviors).toEqual(['elementEnabled']);
    expect(type.properties.title.type).toBe('string');
    expect(type.properties.description.type).toBe('richText');
    expect(type.properties.rate.type).toBe('string');
    expect(type.properties.filterTags.type).toBe('array');
    expect(type.properties.filterTags.items.type).toBe('string');
    expect(type.properties.link.type).toBe('link');
  });

  it('returns null when content is missing or has no titled card', () => {
    [
      undefined,
      null,
      {},
      { title: 'Only a title', filters: ['A'] },
      { items: [] },
      { items: [{ title: '  ', rate: '1%' }, null] },
    ].forEach((content) => {
      const { container, unmount } = render(<EslFilterableProductCardGrid content={content} />);
      expect(container.firstChild).toBeNull();
      unmount();
    });
  });

  it('maps header, cleaned filters, cards, rates and links', () => {
    render(<EslFilterableProductCardGrid content={fullContent} />);

    expect(screen.getByText('FIND YOUR FIT')).toBeDefined();
    expect(screen.getByRole('heading', { level: 2, name: 'Six ways to save.' })).toBeDefined();
    expect(screen.getByTestId('mock-rich-text').textContent).toBe('Pick what matters most.');

    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual([
      'All accounts',
      'Keeping it simple',
      'Saving for medical costs',
    ]);

    expect(cardTitles()).toEqual(['Daily Dividend', 'Health Savings Account']);
    expect(screen.getByText('No minimum balance.')).toBeDefined();
    expect(screen.getByText('X.XX% APY')).toBeDefined();

    const [internal, external] = screen.getAllByRole('link', { name: /^See Details/ });
    expect(internal.getAttribute('href')).toBe('/savings/daily-dividend');
    expect(internal.getAttribute('target')).toBeNull();
    expect(external.getAttribute('target')).toBe('_blank');
    expect(external.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('filters the mapped cards through their tags', () => {
    render(<EslFilterableProductCardGrid content={fullContent} />);

    fireEvent.click(screen.getByRole('button', { name: 'Keeping it simple' }));
    expect(cardTitles()).toEqual(['Daily Dividend']);

    fireEvent.click(screen.getByRole('button', { name: 'Saving for medical costs' }));
    expect(cardTitles()).toEqual(['Health Savings Account']);

    fireEvent.click(screen.getByRole('button', { name: 'All accounts' }));
    expect(cardTitles()).toHaveLength(2);
  });

  it('unwraps Visual Builder component wrappers on the section and on cards', () => {
    render(
      <EslFilterableProductCardGrid
        content={{
          component: {
            title: 'Wrapped title',
            items: [{ component: { title: 'Wrapped card', link: { text: 'Go', url: { default: '/wrapped' } } } }],
          },
        }}
      />
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Wrapped title' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Go' }).getAttribute('href')).toBe('/wrapped');
  });

  it('drops untitled cards and links without a label or URL, and omits empty header slots', () => {
    render(
      <EslFilterableProductCardGrid
        content={{
          items: [
            { rate: 'Orphan rate' },
            { title: 'No label', link: { url: { default: '/x' } } },
            { title: 'No url', link: { text: 'See Details' } },
          ],
        }}
      />
    );

    expect(cardTitles()).toEqual(['No label', 'No url']);
    expect(screen.queryByText('Orphan rate')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
    expect(screen.queryByRole('group')).toBeNull();
  });

  it('never injects fixture copy when fields are empty', () => {
    const { container } = render(
      <EslFilterableProductCardGrid
        content={{ eyebrow: '', title: '', allFilterLabel: '', filters: [], items: [{ title: 'Card' }] }}
      />
    );
    const text = container.textContent || '';
    const fixture = DEFAULT_FILTERABLE_PRODUCT_CARD_GRID_PROPS;

    [
      fixture.eyebrow!,
      fixture.title!,
      String(fixture.description),
      fixture.allFilterLabel!,
      fixture.noResultsText!,
      ...fixture.filters!,
      ...fixture.items.flatMap((item) => [item.title, String(item.description), item.rate!, item.linkLabel!]),
    ].forEach((copy) => expect(text).not.toContain(copy));
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EslIconCardSingleColumnGrid from './EslIconCardSingleColumnGridRenderer';
import { EslIconCardSingleColumnGridContentType } from './EslIconCardSingleColumnGrid';
import {
  EslIconCardSingleColumnGridItemContentType,
  ICON_CARD_SINGLE_COLUMN_GRID_ICONS,
} from './EslIconCardSingleColumnGridItem';
import { DEFAULT_ICON_CARD_SINGLE_COLUMN_GRID_PROPS } from '@/components/organisms/icon-card-single-column-grid';
import { Icon } from '@/components/atoms/icons';

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

describe('EslIconCardSingleColumnGrid Content Type & Renderer', () => {
  it('defines EslIconCardSingleColumnGrid as a section component with title and rows', () => {
    const type = EslIconCardSingleColumnGridContentType;
    expect(type.key).toBe('EslIconCardSingleColumnGrid');
    expect(type.displayName).toBe('ESL Icon Card Single Column Grid');
    expect(type.baseType).toBe('_component');
    expect(type.compositionBehaviors).toEqual(['sectionEnabled']);
    expect(type.properties.title.type).toBe('string');
    expect(type.properties.items.type).toBe('array');
    expect(type.properties.items.items.type).toBe('component');
    expect(type.properties.items.items.contentType).toBe(EslIconCardSingleColumnGridItemContentType);
  });

  it('defines EslIconCardSingleColumnGridItem as an element with icon, title, link and description', () => {
    const type = EslIconCardSingleColumnGridItemContentType;
    expect(type.key).toBe('EslIconCardSingleColumnGridItem');
    expect(type.displayName).toBe('ESL Icon Card Single Column Grid Item');
    expect(type.baseType).toBe('_component');
    expect(type.compositionBehaviors).toEqual(['elementEnabled']);
    expect(type.properties.icon.type).toBe('string');
    expect(type.properties.icon.format).toBe('selectOne');
    expect(type.properties.title.type).toBe('string');
    expect(type.properties.link.type).toBe('link');
    expect(type.properties.description.type).toBe('richText');
  });

  it('only offers icons that exist in the Icon atom', () => {
    ICON_CARD_SINGLE_COLUMN_GRID_ICONS.forEach(({ value }) => {
      const { container, unmount } = render(<Icon name={value} />);
      expect(container.querySelector('svg')).not.toBeNull();
      unmount();
    });
  });

  it('returns null when content or rows are missing', () => {
    [undefined, null, {}, { items: [] }, { title: 'Only a title' }].forEach((content) => {
      const { container, unmount } = render(<EslIconCardSingleColumnGrid content={content} />);
      expect(container.firstChild).toBeNull();
      unmount();
    });
  });

  it('returns null when every row lacks a title', () => {
    const { container } = render(
      <EslIconCardSingleColumnGrid
        content={{ title: 'Heading', items: [{ title: '  ', description: mockRichText('Body') }, null] }}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('maps title, rows, icons, links and rich text descriptions', () => {
    const { container } = render(
      <EslIconCardSingleColumnGrid
        id="decisions"
        content={{
          title: '  Three decisions  ',
          items: [
            {
              icon: 'vault',
              title: 'Checking Accounts',
              link: { text: 'ignored label', url: { default: '/personal/checking' } },
              description: mockRichText('Money you need today.'),
            },
            {
              title: 'Savings Accounts',
              link: { url: { default: 'https://example.com/savings' }, target: '_blank' },
              description: { html: '<p><strong>Money you might need.</strong></p>' },
            },
          ],
        }}
      />
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Three decisions' })).toBeDefined();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);

    const checking = screen.getByRole('link', { name: /^Checking Accounts/ });
    expect(checking.getAttribute('href')).toBe('/personal/checking');
    expect(checking.getAttribute('target')).toBeNull();

    const savings = screen.getByRole('link', { name: /^Savings Accounts/ });
    expect(savings.getAttribute('target')).toBe('_blank');
    expect(savings.getAttribute('rel')).toBe('noopener noreferrer');

    expect(screen.getByTestId('mock-rich-text').textContent).toBe('Money you need today.');
    expect(screen.getByText('Money you might need.').tagName).toBe('STRONG');
    expect(container.querySelector('svg.lucide-vault')).not.toBeNull();
  });

  it('unwraps Visual Builder component wrappers on the section and on rows', () => {
    render(
      <EslIconCardSingleColumnGrid
        content={{
          component: {
            title: 'Wrapped heading',
            items: [{ component: { title: 'Wrapped row', link: { url: { default: '/wrapped' } } } }],
          },
        }}
      />
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Wrapped heading' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Wrapped row' }).getAttribute('href')).toBe('/wrapped');
  });

  it('drops untitled rows, and renders rows without a URL or description as plain titles', () => {
    render(
      <EslIconCardSingleColumnGrid
        content={{
          items: [
            { description: mockRichText('Orphan description') },
            { title: 'IRAs', icon: 'not-an-icon' },
          ],
        }}
      />
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByRole('heading', { level: 3, name: 'IRAs' })).toBeDefined();
    expect(screen.queryByText('Orphan description')).toBeNull();
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });

  it('never injects fixture copy when fields are empty', () => {
    const { container } = render(
      <EslIconCardSingleColumnGrid content={{ title: '', items: [{ title: 'Row' }] }} />
    );
    const text = container.textContent || '';

    const fixtureStrings = [
      DEFAULT_ICON_CARD_SINGLE_COLUMN_GRID_PROPS.title!,
      ...DEFAULT_ICON_CARD_SINGLE_COLUMN_GRID_PROPS.items.flatMap((item) => [
        item.title,
        String(item.description),
      ]),
    ];
    fixtureStrings.forEach((copy) => expect(text).not.toContain(copy));
  });
});

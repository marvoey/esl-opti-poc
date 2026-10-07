import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EslProductPathways from './EslProductPathwaysRenderer';
import { EslProductPathwaysContentType } from './EslProductPathways';
import {
  EslProductPathwaysRowContentType,
  PRODUCT_PATHWAYS_ICONS,
} from './EslProductPathwaysRow';
import { PRODUCT_PATHWAYS_DATA } from '@/components/organisms/product-pathways';
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

describe('EslProductPathways Content Type & Renderer', () => {
  it('defines EslProductPathways as a section component with heading, copy and rows', () => {
    const type = EslProductPathwaysContentType;
    expect(type.key).toBe('EslProductPathways');
    expect(type.displayName).toBe('ESL Product Pathways');
    expect(type.baseType).toBe('_component');
    expect(type.compositionBehaviors).toEqual(['sectionEnabled']);
    expect(type.properties.title.type).toBe('string');
    expect(type.properties.title.displayName).toBe('Heading');
    expect(type.properties.description.type).toBe('richText');
    expect(type.properties.description.displayName).toBe('Copy');
    expect(type.properties.items.type).toBe('array');
    expect(type.properties.items.items.type).toBe('component');
    expect(type.properties.items.items.contentType).toBe(EslProductPathwaysRowContentType);
  });

  it('defines EslProductPathwaysRow as an element with icon, title, link and copy', () => {
    const type = EslProductPathwaysRowContentType;
    expect(type.key).toBe('EslProductPathwaysRow');
    expect(type.displayName).toBe('ESL Product Pathways Row');
    expect(type.baseType).toBe('_component');
    expect(type.compositionBehaviors).toEqual(['elementEnabled']);
    expect(type.properties.icon.type).toBe('string');
    expect(type.properties.icon.format).toBe('selectOne');
    expect(type.properties.title.type).toBe('string');
    expect(type.properties.link.type).toBe('link');
    expect(type.properties.link.displayName).toBe('CTA Link');
    expect(type.properties.description.type).toBe('richText');
  });

  it('only offers icons that exist in the Icon atom', () => {
    PRODUCT_PATHWAYS_ICONS.forEach(({ value }) => {
      const { container, unmount } = render(<Icon name={value} />);
      expect(container.querySelector('svg')).not.toBeNull();
      unmount();
    });
  });

  it('returns null when content, heading or rows are missing', () => {
    const row = { title: 'Sign In' };
    [
      undefined,
      null,
      {},
      { title: 'Manage', items: [] },
      { title: 'Manage' },
      { title: '  ', items: [row] },
      { items: [row] },
    ].forEach((content) => {
      const { container, unmount } = render(<EslProductPathways content={content} />);
      expect(container.firstChild).toBeNull();
      unmount();
    });
  });

  it('returns null when every row lacks a label', () => {
    const { container } = render(
      <EslProductPathways
        content={{ title: 'Manage', items: [{ title: '  ', description: mockRichText('Body') }, null] }}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('maps heading, intro copy, rows, icons, links and rich text', () => {
    const { container } = render(
      <EslProductPathways
        id="manage"
        content={{
          title: '  Manage  ',
          description: { html: '<p>The deciding question: <strong>when?</strong></p>' },
          items: [
            {
              icon: 'vault',
              title: 'Open Checking',
              link: { text: 'ignored label', url: { default: '/checking' } },
              description: mockRichText('Money you need today.'),
            },
            {
              title: 'Open Savings',
              link: { url: { default: 'https://example.com/savings' }, target: '_blank' },
            },
          ],
        }}
      />
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Manage' })).toBeDefined();
    expect(screen.getByText('when?').tagName).toBe('STRONG');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);

    const checking = screen.getByRole('link', { name: /^Open Checking/ });
    expect(checking.getAttribute('href')).toBe('/checking');
    expect(checking.getAttribute('target')).toBeNull();

    const savings = screen.getByRole('link', { name: /^Open Savings/ });
    expect(savings.getAttribute('target')).toBe('_blank');
    expect(savings.getAttribute('rel')).toBe('noopener noreferrer');

    expect(screen.getByTestId('mock-rich-text').textContent).toBe('Money you need today.');
    expect(container.querySelector('svg.lucide-vault')).not.toBeNull();
  });

  it('unwraps Visual Builder component wrappers on the section and on rows', () => {
    render(
      <EslProductPathways
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

  it('drops unlabelled rows and omits empty copy slots', () => {
    const { container } = render(
      <EslProductPathways
        content={{
          title: 'Manage',
          description: { html: '   ' },
          items: [
            { description: mockRichText('Orphan copy') },
            { title: 'IRAs', icon: 'not-an-icon', description: {} },
          ],
        }}
      />
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('IRAs')).toBeDefined();
    expect(screen.queryByText('Orphan copy')).toBeNull();
    expect(container.querySelector('[data-product-pathways-intro]')).toBeNull();
  });

  it('never injects fixture copy when fields are empty', () => {
    const { container } = render(
      <EslProductPathways content={{ title: 'Heading', items: [{ title: 'Row' }] }} />
    );
    const text = container.textContent || '';

    const fixtureStrings = [
      PRODUCT_PATHWAYS_DATA.title,
      PRODUCT_PATHWAYS_DATA.description!,
      ...PRODUCT_PATHWAYS_DATA.rows.flatMap((row) => [row.title, row.description!]),
    ];
    fixtureStrings.forEach((copy) => expect(text).not.toContain(copy));
  });
});

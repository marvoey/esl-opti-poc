import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EslTableCtaLeftColumn from './EslTableCtaLeftColumnRenderer';
import { EslTableCtaLeftColumnContentType } from './EslTableCtaLeftColumn';
import { EslTableCtaColumnContentType } from './EslTableCtaColumn';
import { EslTableCtaRowContentType } from './EslTableCtaRow';
import { TABLE_CTA_LEFT_COLUMN_DATA } from '@/components/organisms/table-cta-left-column';

const fullContent = {
  title: ' Compare savings ',
  caption: 'Daily Dividend compared with Money Maker',
  rowLabelHeading: '',
  columns: [
    { title: 'Best right now', cta: { text: 'Open Daily Dividend', url: { default: '/savings/daily-dividend' } } },
    {
      component: {
        title: 'Which product, and the catch',
        cta: { text: 'Open Money Maker', url: { default: 'https://example.com/mm' }, target: '_blank' },
      },
    },
  ],
  rows: [
    { label: 'Rate / APY', values: ['x.xx% APY', ' Up to x.xx% APY — tiered '] },
    { component: { label: 'Minimum to open', values: ['$1', '$1'] } },
    { label: 'Minimum balance', values: [null, '$1,000 for the higher tiers'] },
  ],
};

describe('EslTableCtaLeftColumn Content Type & Renderer', () => {
  it('defines EslTableCtaLeftColumn as a section with heading, caption, corner heading, columns and rows', () => {
    const type = EslTableCtaLeftColumnContentType;
    expect(type.key).toBe('EslTableCtaLeftColumn');
    expect(type.displayName).toBe('ESL Table CTA Left Column');
    expect(type.baseType).toBe('_component');
    expect(type.compositionBehaviors).toEqual(['sectionEnabled']);
    expect(type.properties.title.type).toBe('string');
    expect(type.properties.title.displayName).toBe('Heading');
    expect(type.properties.caption.type).toBe('string');
    expect(type.properties.rowLabelHeading.type).toBe('string');
    expect(type.properties.columns.type).toBe('array');
    expect(type.properties.columns.items.type).toBe('component');
    expect(type.properties.columns.items.contentType).toBe(EslTableCtaColumnContentType);
    expect(type.properties.rows.type).toBe('array');
    expect(type.properties.rows.items.type).toBe('component');
    expect(type.properties.rows.items.contentType).toBe(EslTableCtaRowContentType);
  });

  it('defines the column as an element with heading and CTA link', () => {
    const type = EslTableCtaColumnContentType;
    expect(type.key).toBe('EslTableCtaColumn');
    expect(type.baseType).toBe('_component');
    expect(type.compositionBehaviors).toEqual(['elementEnabled']);
    expect(type.properties.title.type).toBe('string');
    expect(type.properties.title.displayName).toBe('Heading');
    expect(type.properties.cta.type).toBe('link');
    expect(type.properties.cta.displayName).toBe('CTA Link');
  });

  it('defines the row as an element with a label and string cell values', () => {
    const type = EslTableCtaRowContentType;
    expect(type.key).toBe('EslTableCtaRow');
    expect(type.baseType).toBe('_component');
    expect(type.compositionBehaviors).toEqual(['elementEnabled']);
    expect(type.properties.label.type).toBe('string');
    expect(type.properties.values.type).toBe('array');
    expect(type.properties.values.items.type).toBe('string');
  });

  it('maps every field, unwrapping nested component payloads', () => {
    const { container } = render(<EslTableCtaLeftColumn content={fullContent} />);

    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Compare savings');
    expect(screen.getByRole('table', { name: 'Daily Dividend compared with Money Maker' })).toBeDefined();
    expect(screen.getAllByRole('columnheader').map((th) => th.textContent)).toEqual([
      'Best right now',
      'Which product, and the catch',
    ]);
    expect(screen.getAllByRole('rowheader').map((th) => th.textContent)).toEqual([
      'Rate / APY',
      'Minimum to open',
      'Minimum balance',
    ]);
    expect(screen.getByRole('cell', { name: 'Up to x.xx% APY — tiered' })).toBeDefined();

    const minimumBalanceCells = container.querySelectorAll('tbody tr:nth-child(3) td');
    expect(minimumBalanceCells[0].textContent).toBe('');
    expect(minimumBalanceCells[1].textContent).toBe('$1,000 for the higher tiers');
  });

  it('resolves CTA links with their target', () => {
    render(<EslTableCtaLeftColumn content={fullContent} />);
    expect(screen.getByRole('link', { name: 'Open Daily Dividend' }).getAttribute('href')).toBe(
      '/savings/daily-dividend'
    );
    const external = screen.getByRole('link', { name: /^Open Money Maker/ });
    expect(external.getAttribute('target')).toBe('_blank');
  });

  it('unwraps a Visual Builder node wrapper', () => {
    render(<EslTableCtaLeftColumn content={{ component: fullContent }} />);
    expect(screen.getByRole('table')).toBeDefined();
  });

  it('drops columns without a heading and rows without a label', () => {
    render(
      <EslTableCtaLeftColumn
        content={{
          columns: [{ title: '  ' }, { title: 'Only column' }, null],
          rows: [{ label: '', values: ['x'] }, { label: 'Kept', values: ['y'] }, null],
        }}
      />
    );
    expect(screen.getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['Only column']);
    expect(screen.getAllByRole('rowheader').map((th) => th.textContent)).toEqual(['Kept']);
  });

  it('omits CTAs that have no label or no URL', () => {
    const { container } = render(
      <EslTableCtaLeftColumn
        content={{
          columns: [
            { title: 'A', cta: { text: 'No URL' } },
            { title: 'B', cta: { url: { default: '/no-label' } } },
          ],
          rows: [{ label: 'Row', values: ['1', '2'] }],
        }}
      />
    );
    expect(screen.queryByRole('link')).toBeNull();
    expect(container.querySelector('tfoot')).toBeNull();
  });

  it('caps the table at four columns', () => {
    render(
      <EslTableCtaLeftColumn
        content={{
          columns: ['1', '2', '3', '4', '5'].map((title) => ({ title })),
          rows: [{ label: 'Row', values: [] }],
        }}
      />
    );
    expect(screen.getAllByRole('columnheader')).toHaveLength(4);
  });

  it('returns null when columns or rows are missing', () => {
    const { container: noContent } = render(<EslTableCtaLeftColumn content={null} />);
    expect(noContent.innerHTML).toBe('');
    const { container: noRows } = render(
      <EslTableCtaLeftColumn content={{ columns: [{ title: 'A' }], rows: [] }} />
    );
    expect(noRows.innerHTML).toBe('');
    const { container: noColumns } = render(
      <EslTableCtaLeftColumn content={{ columns: [], rows: [{ label: 'Row' }] }} />
    );
    expect(noColumns.innerHTML).toBe('');
  });

  it('omits optional slots and never injects fixture copy', () => {
    const { container } = render(
      <EslTableCtaLeftColumn
        content={{ columns: [{ title: 'Col' }], rows: [{ label: 'Row', values: ['v'] }] }}
      />
    );
    expect(screen.queryByRole('heading')).toBeNull();
    expect(container.querySelector('caption')).toBeNull();

    const html = container.innerHTML;
    const fixtureStrings = [
      TABLE_CTA_LEFT_COLUMN_DATA.caption ?? '',
      ...TABLE_CTA_LEFT_COLUMN_DATA.columns.flatMap((col) => [col.title, col.cta?.label ?? '']),
      ...TABLE_CTA_LEFT_COLUMN_DATA.rows.flatMap((row) => [row.label, ...row.values]),
    ].filter((value) => value.length > 2);
    fixtureStrings.forEach((value) => expect(html).not.toContain(value));
  });
});

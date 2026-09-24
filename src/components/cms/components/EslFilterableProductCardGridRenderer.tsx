import React from 'react';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import {
  FilterableProductCardGrid,
  type FilterableProductCard,
} from '@/components/organisms/filterable-product-card-grid';
import type { EslFilterableProductCardGridData } from './EslFilterableProductCardGrid';
import { resolveLink } from './eslVideoStoryCardRowMapper';

type RichTextNode = Parameters<typeof RichText>[0]['content'];

type RichTextPayload = {
  html?: string | null;
  json?: RichTextNode | null;
  [key: string]: unknown;
};

type LinkPayload = {
  text?: string | null;
  title?: string | null;
  target?: string | null;
  url?: {
    default?: string | null;
    hierarchical?: string | null;
    base?: string | null;
    [key: string]: unknown;
  } | null;
};

type CardFields = {
  _id?: string | null;
  id?: string | null;
  title?: string | null;
  description?: RichTextPayload | string | null;
  rate?: string | null;
  filterTags?: Array<string | null> | null;
  link?: LinkPayload | null;
};

type CardInput = CardFields & { component?: CardFields | null };

export type EslFilterableProductCardGridComponentData = {
  eyebrow?: string | null;
  title?: string | null;
  description?: RichTextPayload | string | null;
  allFilterLabel?: string | null;
  filters?: Array<string | null> | null;
  items?: Array<CardInput | null> | null;
  noResultsText?: string | null;
  component?: EslFilterableProductCardGridComponentData | null;
  [key: string]: unknown;
};

type Props = {
  content?: EslFilterableProductCardGridComponentData | EslFilterableProductCardGridData | null;
  displaySettings?: Record<string, string | boolean> | null;
  id?: string;
};

function renderRichText(content?: RichTextPayload | string | null): React.ReactNode {
  if (!content) return null;
  if (typeof content === 'string') return content.trim() || null;
  if (content.json) {
    return <RichText content={content.json} />;
  }
  if (content.html?.trim()) {
    return <div dangerouslySetInnerHTML={{ __html: content.html }} />;
  }
  return null;
}

function cleanStrings(values?: Array<string | null> | null): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean);
}

function mapCards(rawItems: EslFilterableProductCardGridComponentData['items']): FilterableProductCard[] {
  if (!rawItems || !Array.isArray(rawItems)) return [];

  const cards: FilterableProductCard[] = [];
  rawItems.forEach((rawItem, idx) => {
    if (!rawItem) return;
    const item = (rawItem.component || rawItem) as CardFields;
    const title = item.title?.trim() || '';
    if (!title) return;

    const link = resolveLink(item.link as Parameters<typeof resolveLink>[0]);
    const href = link.href || undefined;
    const linkLabel = link.label.trim() || undefined;

    cards.push({
      id: item.id || item._id || `product-card-${idx + 1}`,
      title,
      description: renderRichText(item.description) || undefined,
      rate: item.rate?.trim() || undefined,
      filterTags: cleanStrings(item.filterTags),
      href: href && linkLabel ? href : undefined,
      linkLabel: href && linkLabel ? linkLabel : undefined,
      target: href && linkLabel && link.external ? '_blank' : undefined,
    });
  });
  return cards;
}

export default function EslFilterableProductCardGrid({ content, id }: Props) {
  if (!content) return null;

  const c = (content && 'component' in content && content.component
    ? content.component
    : content) as EslFilterableProductCardGridComponentData;

  const items = mapCards(c.items);
  if (items.length === 0) return null;

  return (
    <FilterableProductCardGrid
      id={id}
      eyebrow={c.eyebrow?.trim() || undefined}
      title={c.title?.trim() || undefined}
      description={renderRichText(c.description) || undefined}
      allFilterLabel={c.allFilterLabel?.trim() || undefined}
      filters={cleanStrings(c.filters)}
      items={items}
      noResultsText={c.noResultsText?.trim() || undefined}
    />
  );
}

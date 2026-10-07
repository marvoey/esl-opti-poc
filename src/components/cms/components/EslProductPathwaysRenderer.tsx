import React from 'react';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import {
  ProductPathways,
  type ProductPathwaysRow,
} from '@/components/organisms/product-pathways';
import { type IconName } from '@/components/atoms/icons';
import type { EslProductPathwaysData } from './EslProductPathways';
import { PRODUCT_PATHWAYS_ICONS } from './EslProductPathwaysRow';
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

type ProductPathwaysRowFields = {
  _id?: string | null;
  id?: string | null;
  icon?: string | null;
  title?: string | null;
  link?: LinkPayload | null;
  description?: RichTextPayload | string | null;
};

type ProductPathwaysRowInput = ProductPathwaysRowFields & {
  component?: ProductPathwaysRowFields | null;
};

export type EslProductPathwaysComponentData = {
  title?: string | null;
  description?: RichTextPayload | string | null;
  items?: Array<ProductPathwaysRowInput | null> | null;
  component?: EslProductPathwaysComponentData | null;
  [key: string]: unknown;
};

type Props = {
  content?: EslProductPathwaysComponentData | EslProductPathwaysData | null;
  displaySettings?: Record<string, string | boolean> | null;
  id?: string;
};

const ICON_VALUES = new Set<string>(PRODUCT_PATHWAYS_ICONS.map((icon) => icon.value));

function resolveIcon(icon?: string | null): IconName | undefined {
  const key = icon?.trim().toLowerCase();
  return key && ICON_VALUES.has(key) ? (key as IconName) : undefined;
}

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

export default function EslProductPathways({ content, id }: Props) {
  if (!content) return null;

  const effectiveContent = (content && 'component' in content && content.component
    ? content.component
    : content) as EslProductPathwaysComponentData;

  const title = effectiveContent.title?.trim();
  const rawItems = effectiveContent.items;
  if (!title || !Array.isArray(rawItems) || rawItems.length === 0) return null;

  const rows: ProductPathwaysRow[] = [];

  rawItems.forEach((rawItem, idx) => {
    if (!rawItem) return;

    const item = (rawItem.component || rawItem) as ProductPathwaysRowFields;
    const label = item.title?.trim() || '';
    if (!label) return;

    const link = resolveLink(item.link as Parameters<typeof resolveLink>[0]);

    rows.push({
      id: item.id || item._id || `product-pathways-row-${idx + 1}`,
      icon: resolveIcon(item.icon),
      title: label,
      href: link.href || undefined,
      target: link.href && link.external ? '_blank' : undefined,
      description: renderRichText(item.description) || undefined,
    });
  });

  if (rows.length === 0) return null;

  return (
    <ProductPathways
      id={id}
      title={title}
      description={renderRichText(effectiveContent.description) || undefined}
      rows={rows}
    />
  );
}

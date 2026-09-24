import React from 'react';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import {
  IconCardSingleColumnGrid,
  type IconCardSingleColumnGridItem,
} from '@/components/organisms/icon-card-single-column-grid';
import { type IconName } from '@/components/atoms/icons';
import type { EslIconCardSingleColumnGridData } from './EslIconCardSingleColumnGrid';
import { ICON_CARD_SINGLE_COLUMN_GRID_ICONS } from './EslIconCardSingleColumnGridItem';
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

type IconCardSingleColumnGridItemFields = {
  _id?: string | null;
  id?: string | null;
  icon?: string | null;
  title?: string | null;
  link?: LinkPayload | null;
  description?: RichTextPayload | string | null;
};

type IconCardSingleColumnGridItemInput = IconCardSingleColumnGridItemFields & {
  component?: IconCardSingleColumnGridItemFields | null;
};

export type EslIconCardSingleColumnGridComponentData = {
  title?: string | null;
  items?: Array<IconCardSingleColumnGridItemInput | null> | null;
  component?: EslIconCardSingleColumnGridComponentData | null;
  [key: string]: unknown;
};

type Props = {
  content?: EslIconCardSingleColumnGridComponentData | EslIconCardSingleColumnGridData | null;
  displaySettings?: Record<string, string | boolean> | null;
  id?: string;
};

const ICON_VALUES = new Set<string>(ICON_CARD_SINGLE_COLUMN_GRID_ICONS.map((icon) => icon.value));

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

export default function EslIconCardSingleColumnGrid({ content, id }: Props) {
  if (!content) return null;

  const effectiveContent = (content && 'component' in content && content.component
    ? content.component
    : content) as EslIconCardSingleColumnGridComponentData;

  const rawItems = effectiveContent.items;
  if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) return null;

  const items: IconCardSingleColumnGridItem[] = [];

  rawItems.forEach((rawItem, idx) => {
    if (!rawItem) return;

    const item = (rawItem.component || rawItem) as IconCardSingleColumnGridItemFields;
    const title = item.title?.trim() || '';
    if (!title) return;

    const link = resolveLink(item.link as Parameters<typeof resolveLink>[0]);

    items.push({
      id: item.id || item._id || `icon-card-row-${idx + 1}`,
      icon: resolveIcon(item.icon),
      title,
      href: link.href || undefined,
      target: link.href && link.external ? '_blank' : undefined,
      description: renderRichText(item.description) || undefined,
    });
  });

  if (items.length === 0) return null;

  return (
    <IconCardSingleColumnGrid
      id={id}
      title={effectiveContent.title?.trim() || undefined}
      items={items}
    />
  );
}

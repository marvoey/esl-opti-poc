import React from 'react';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import {
  ProductCardsRowVariant2,
  type ProductCardsRowVariant2Item,
} from '@/components/organisms/product-cards-row-variant-2';
import { type IconName } from '@/components/atoms/icons';
import type { EslProductCardsRowVariant2Data } from './EslProductCardsRowVariant2';

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

type ProductCardsRowVariant2ItemInput = {
  _id?: string | null;
  id?: string | null;
  icon?: string | null;
  title?: string | null;
  description?: RichTextPayload | string | null;
  link?: LinkPayload | null;
  component?: {
    _id?: string | null;
    id?: string | null;
    icon?: string | null;
    title?: string | null;
    description?: RichTextPayload | string | null;
    link?: LinkPayload | null;
  } | null;
};

export type EslProductCardsRowVariant2ComponentData = {
  eyebrow?: string | null;
  title?: string | null;
  description?: RichTextPayload | string | null;
  rowDescription?: RichTextPayload | string | null;
  items?: Array<ProductCardsRowVariant2ItemInput | null> | null;
  component?: EslProductCardsRowVariant2ComponentData | null;
  [key: string]: unknown;
};

type Props = {
  content?: EslProductCardsRowVariant2ComponentData | EslProductCardsRowVariant2Data | null;
  id?: string;
};

function renderRichText(content?: RichTextPayload | string | null): React.ReactNode {
  if (!content) return null;
  if (typeof content === 'string') return content;
  if (content.json) {
    return <RichText content={content.json} />;
  }
  if (content.html) {
    return <div dangerouslySetInnerHTML={{ __html: content.html }} />;
  }
  return null;
}

function mapProps(content: Props['content']): {
  eyebrow?: string;
  title?: string;
  description: React.ReactNode;
  items: ProductCardsRowVariant2Item[];
} | null {
  if (!content) return null;

  const effectiveContent = (content && 'component' in content && content.component
    ? content.component
    : content) as EslProductCardsRowVariant2ComponentData;

  const eyebrow = effectiveContent.eyebrow?.trim() || undefined;
  const title = effectiveContent.title?.trim() || undefined;
  const description = renderRichText(
    effectiveContent.rowDescription || effectiveContent.description
  );
  const rawItems = effectiveContent.items;

  if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
    return null;
  }

  const mappedItems: ProductCardsRowVariant2Item[] = [];

  for (let idx = 0; idx < rawItems.length; idx++) {
    const rawItem = rawItems[idx];
    if (!rawItem) continue;

    const item = (rawItem && 'component' in rawItem && rawItem.component
      ? rawItem.component
      : rawItem) as ProductCardsRowVariant2ItemInput;

    const cardTitle = item.title?.trim() || '';
    const cardDescription = renderRichText(item.description);

    if (!cardTitle && !cardDescription) continue;

    const iconKey = (item.icon?.trim() as IconName) || 'credit-card';
    const ctaText =
      item.link?.text?.trim() || item.link?.title?.trim() || 'Learn more';
    const href =
      item.link?.url?.default || item.link?.url?.hierarchical || '#';

    mappedItems.push({
      id: item.id || item._id || `tool-card-${idx + 1}`,
      icon: iconKey,
      title: cardTitle,
      description: cardDescription,
      ctaText,
      href,
    });
  }

  if (mappedItems.length === 0) {
    return null;
  }

  return { eyebrow, title, description, items: mappedItems };
}

export default function EslProductCardsRowVariant2({
  content,
  id = 'account-tools',
}: Props) {
  const props = mapProps(content);
  if (!props) return null;

  return (
    <ProductCardsRowVariant2
      id={id}
      eyebrow={props.eyebrow}
      title={props.title}
      description={props.description}
      items={props.items}
    />
  );
}

import React from 'react';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import {
  ProductCardsRow,
  type ProductCardItem,
} from '@/components/organisms/product-cards-row';
import type { EslProductCardsRowData } from './EslProductCardsRow';

type RichTextNode = Parameters<typeof RichText>[0]['content'];

type RichTextPayload = {
  html?: string | null;
  json?: RichTextNode | null;
  [key: string]: unknown;
};

type ProductCardItemInput = {
  _id?: string | null;
  id?: string | null;
  title?: string | null;
  description?: RichTextPayload | string | null;
  component?: {
    _id?: string | null;
    id?: string | null;
    title?: string | null;
    description?: RichTextPayload | string | null;
  } | null;
};

export type EslProductCardsRowComponentData = {
  eyebrow?: string | null;
  title?: string | null;
  description?: RichTextPayload | string | null;
  rowDescription?: RichTextPayload | string | null;
  items?: Array<ProductCardItemInput | null> | null;
  component?: EslProductCardsRowComponentData | null;
  [key: string]: unknown;
};

type Props = {
  content?: EslProductCardsRowComponentData | EslProductCardsRowData | null;
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
  items: ProductCardItem[];
} | null {
  if (!content) return null;

  const effectiveContent = (content && 'component' in content && content.component
    ? content.component
    : content) as EslProductCardsRowComponentData;

  const eyebrow = effectiveContent.eyebrow?.trim() || undefined;
  const title = effectiveContent.title?.trim() || undefined;
  const description = renderRichText(
    effectiveContent.rowDescription || effectiveContent.description
  );
  const rawItems = effectiveContent.items;

  if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
    return null;
  }

  const mappedItems: ProductCardItem[] = [];

  for (let idx = 0; idx < rawItems.length; idx++) {
    const rawItem = rawItems[idx];
    if (!rawItem) continue;

    const item = (rawItem && 'component' in rawItem && rawItem.component
      ? rawItem.component
      : rawItem) as ProductCardItemInput;

    const cardTitle = item.title?.trim() || '';
    const cardDescription = renderRichText(item.description);

    if (!cardTitle && !cardDescription) continue;

    mappedItems.push({
      id: item.id || item._id || `product-card-${idx + 1}`,
      title: cardTitle,
      description: cardDescription,
    });
  }

  if (mappedItems.length === 0) {
    return null;
  }

  return { eyebrow, title, description, items: mappedItems };
}

export default function EslProductCardsRow({
  content,
  id = 'product-fit',
}: Props) {
  const props = mapProps(content);
  if (!props) return null;

  return (
    <ProductCardsRow
      id={id}
      eyebrow={props.eyebrow}
      title={props.title}
      description={props.description}
      items={props.items}
    />
  );
}

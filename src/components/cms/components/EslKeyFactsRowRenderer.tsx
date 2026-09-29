import React from 'react';
import { KeyFactsRow, type KeyFactsTileItem } from '@/components/organisms/key-facts-row';
import type { EslKeyFactsRowData } from './EslKeyFactsRow';

type RichTextPayload = {
  html?: string | null;
  json?: Record<string, unknown> | null;
  [key: string]: unknown;
};

type FactItemInput = {
  _id?: string | null;
  id?: string | null;
  value?: string | null;
  callout?: string | null;
  description?: RichTextPayload | string | null;
  component?: {
    _id?: string | null;
    id?: string | null;
    value?: string | null;
    callout?: string | null;
    description?: RichTextPayload | string | null;
  } | null;
};

export type EslKeyFactsRowComponentData = {
  title?: string | null;
  subtitle?: string | null;
  facts?: Array<FactItemInput | null> | null;
  component?: EslKeyFactsRowComponentData | null;
  [key: string]: unknown;
};

type Props = {
  content?: EslKeyFactsRowComponentData | EslKeyFactsRowData | null;
  displaySettings?: Record<string, string | boolean> | null;
  id?: string;
};

function renderRichTextToString(desc?: RichTextPayload | string | null): string {
  if (!desc) return '';
  if (typeof desc === 'string') return desc.trim();
  if (desc.html) {
    return desc.html.replace(/<[^>]*>/g, '').trim();
  }
  if (desc.json) {
    const extractText = (node: Record<string, unknown>): string => {
      if (typeof node.text === 'string') return node.text;
      if (Array.isArray(node.children)) {
        return node.children
          .map((c) => extractText(c as Record<string, unknown>))
          .filter(Boolean)
          .join(' ');
      }
      return '';
    };
    return extractText(desc.json).trim();
  }
  return '';
}

function mapProps(content: Props['content']): {
  title?: string;
  subtitle?: string;
  tiles: KeyFactsTileItem[];
} | null {
  const effectiveContent = (content && 'component' in content && content.component
    ? content.component
    : content) as EslKeyFactsRowComponentData | undefined;

  const rawFacts = effectiveContent?.facts;

  if (!rawFacts || !Array.isArray(rawFacts) || rawFacts.length === 0) {
    return null;
  }

  const mappedTiles: KeyFactsTileItem[] = [];

  for (let idx = 0; idx < rawFacts.length; idx++) {
    const rawItem = rawFacts[idx];
    if (!rawItem) continue;

    const item = rawItem.component || rawItem;
    const value = item.value?.trim() || '';
    const callout = item.callout?.trim() || '';
    const description = renderRichTextToString(item.description);

    if (!value && !callout && !description) {
      continue;
    }

    mappedTiles.push({
      id: item.id || item._id || `key-fact-${idx + 1}`,
      value,
      callout,
      description,
    });
  }

  if (mappedTiles.length === 0) {
    return null;
  }

  return {
    title: effectiveContent?.title?.trim() || undefined,
    subtitle: effectiveContent?.subtitle?.trim() || undefined,
    tiles: mappedTiles,
  };
}

export default function EslKeyFactsRow({ content, id = 'key-facts' }: Props) {
  const props = mapProps(content);
  if (!props) return null;

  return (
    <KeyFactsRow
      id={id}
      title={props.title}
      subtitle={props.subtitle}
      tiles={props.tiles}
    />
  );
}

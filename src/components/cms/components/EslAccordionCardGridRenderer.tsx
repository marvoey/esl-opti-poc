import React from 'react';
import {
  AccordionCardGrid,
  type AccordionCardItem,
} from '@/components/organisms/accordion-card-grid';
import type { EslAccordionCardGridData } from './EslAccordionCardGrid';

type RichTextPayload = {
  html?: string | null;
  json?: unknown | null;
  [key: string]: unknown;
};

type AccordionCardItemInput = {
  _id?: string | null;
  id?: string | null;
  term?: string | null;
  definition?: RichTextPayload | string | null;
  component?: {
    _id?: string | null;
    id?: string | null;
    term?: string | null;
    definition?: RichTextPayload | string | null;
  } | null;
};

export type EslAccordionCardGridComponentData = {
  eyebrow?: string | null;
  title?: string | null;
  description?: RichTextPayload | string | null;
  accordionDescription?: RichTextPayload | string | null;
  items?: Array<AccordionCardItemInput | null> | null;
  component?: EslAccordionCardGridComponentData | null;
  [key: string]: unknown;
};

type Props = {
  content?: EslAccordionCardGridComponentData | EslAccordionCardGridData | null;
  id?: string;
};

function extractTextFromJson(node: unknown): string {
  if (!node || typeof node !== 'object') return '';
  const obj = node as Record<string, unknown>;
  let result = '';
  if (typeof obj.text === 'string') {
    result += obj.text;
  }
  if (Array.isArray(obj.children)) {
    for (const child of obj.children) {
      result += extractTextFromJson(child);
    }
  }
  if (Array.isArray(obj.content)) {
    for (const item of obj.content) {
      result += extractTextFromJson(item);
    }
  }
  return result;
}

export function extractPlainText(
  val?: RichTextPayload | string | null
): string {
  if (!val) return '';
  if (typeof val === 'string') return val.trim();
  if (typeof val === 'object' && val !== null) {
    if (typeof val.html === 'string' && val.html.trim()) {
      return val.html.replace(/<[^>]*>/g, '').trim();
    }
    if (val.json && typeof val.json === 'object') {
      return extractTextFromJson(val.json).trim();
    }
  }
  return '';
}

export default function EslAccordionCardGrid({
  content,
  id = 'glossary',
}: Props) {
  if (!content) return null;

  const effectiveContent = (content && 'component' in content && content.component
    ? content.component
    : content) as EslAccordionCardGridComponentData;

  const eyebrow = effectiveContent.eyebrow?.trim() || undefined;
  const title = effectiveContent.title?.trim() || undefined;
  const rawDescription =
    effectiveContent.accordionDescription || effectiveContent.description;
  const description = extractPlainText(rawDescription) || undefined;

  const rawItems = effectiveContent.items;
  if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
    return null;
  }

  const mappedItems: AccordionCardItem[] = [];

  for (let idx = 0; idx < rawItems.length; idx++) {
    const rawItem = rawItems[idx];
    if (!rawItem) continue;

    const item = (rawItem && 'component' in rawItem && rawItem.component
      ? rawItem.component
      : rawItem) as AccordionCardItemInput;

    const term = item.term?.trim() || '';
    const definition = extractPlainText(item.definition);

    if (!term && !definition) continue;

    mappedItems.push({
      id: item.id || item._id || `term-${idx + 1}`,
      term,
      definition,
    });
  }

  if (mappedItems.length === 0) {
    return null;
  }

  return (
    <AccordionCardGrid
      id={id}
      eyebrow={eyebrow}
      title={title}
      description={description}
      items={mappedItems}
    />
  );
}

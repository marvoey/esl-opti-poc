import React from 'react';
import {
  AccordionCardGrid,
  type AccordionCardItem,
} from '@/components/organisms/accordion-card-grid';
import type { EslAccordionCardGridData } from './EslAccordionCardGrid';
import { extractPlainText, type RichTextPayload } from '@/components/cms/utils/cmsRichText';

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


function mapProps(content: Props['content']): {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: AccordionCardItem[];
} | null {
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

  return { eyebrow, title, description, items: mappedItems };
}

export default function EslAccordionCardGrid({
  content,
  id = 'glossary',
}: Props) {
  const props = mapProps(content);
  if (!props) return null;

  return (
    <AccordionCardGrid
      id={id}
      eyebrow={props.eyebrow}
      title={props.title}
      description={props.description}
      items={props.items}
    />
  );
}

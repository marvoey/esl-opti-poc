import React from 'react';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import { Disclosure, type DisclosureItem } from '@/components/organisms/disclosure';
import type { EslDisclosureData } from './EslDisclosure';

type RichTextNode = Parameters<typeof RichText>[0]['content'];

type RichTextPayload = {
  html?: string | null;
  json?: RichTextNode | null;
  [key: string]: unknown;
};

type DisclosureItemInput = {
  _id?: string | null;
  id?: string | null;
  boldText?: string | null;
  regularText?: RichTextPayload | string | null;
  component?: {
    _id?: string | null;
    id?: string | null;
    boldText?: string | null;
    regularText?: RichTextPayload | string | null;
  } | null;
};

export type EslDisclosureComponentData = {
  heading?: string | null;
  items?: Array<DisclosureItemInput | null> | null;
  component?: EslDisclosureComponentData | null;
  [key: string]: unknown;
};

type Props = {
  content?: EslDisclosureComponentData | EslDisclosureData | null;
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
  heading?: string;
  items: DisclosureItem[];
} | null {
  if (!content) return null;

  const effectiveContent = (content && 'component' in content && content.component
    ? content.component
    : content) as EslDisclosureComponentData;

  const heading = effectiveContent.heading?.trim() || undefined;
  const rawItems = effectiveContent.items;

  if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
    return null;
  }

  const mappedItems: DisclosureItem[] = [];

  for (let idx = 0; idx < rawItems.length; idx++) {
    const rawItem = rawItems[idx];
    if (!rawItem) continue;

    const item = (rawItem && 'component' in rawItem && rawItem.component
      ? rawItem.component
      : rawItem) as DisclosureItemInput;

    const boldText = item.boldText?.trim() || '';
    const regularText = renderRichText(item.regularText);

    if (!boldText && !regularText) continue;

    mappedItems.push({
      id: item.id || item._id || `disclosure-item-${idx + 1}`,
      boldText,
      regularText,
    });
  }

  if (mappedItems.length === 0) {
    return null;
  }

  return { heading, items: mappedItems };
}

export default function EslDisclosure({ content, id = 'disclosure' }: Props) {
  const props = mapProps(content);
  if (!props) return null;

  return (
    <Disclosure
      id={id}
      heading={props.heading}
      items={props.items}
    />
  );
}

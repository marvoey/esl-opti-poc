import React from 'react';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import {
  LongTextLeftCardsRight,
  isLongTextLeftCardsRightIconName,
  type LongTextLeftCardsRightCard,
  type LongTextLeftCardsRightLink,
  type LongTextLeftCardsRightPromo,
} from '@/components/organisms/long-text-left-cards-right';
import type { EslLongTextLeftCardsRightData } from './EslLongTextLeftCardsRight';
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
  icon?: string | null;
  eyebrow?: string | null;
  title?: string | null;
  description?: RichTextPayload | string | null;
  link?: LinkPayload | null;
};

type CardInput = CardFields & { component?: CardFields | null };

type PromoFields = {
  eyebrow?: string | null;
  heading?: string | null;
  description?: RichTextPayload | string | null;
  cta?: LinkPayload | null;
};

export type EslLongTextLeftCardsRightComponentData = {
  title?: string | null;
  body?: RichTextPayload | string | null;
  promo?: (PromoFields & { component?: PromoFields | null }) | null;
  items?: Array<CardInput | null> | null;
  component?: EslLongTextLeftCardsRightComponentData | null;
  [key: string]: unknown;
};

type Props = {
  content?: EslLongTextLeftCardsRightComponentData | EslLongTextLeftCardsRightData | null;
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

function mapLink(link?: LinkPayload | null): { href?: string; target?: string; label: string } {
  const resolved = resolveLink(link as Parameters<typeof resolveLink>[0]);
  return {
    href: resolved.href || undefined,
    target: resolved.href && resolved.external ? '_blank' : undefined,
    label: resolved.label.trim(),
  };
}

function mapPromo(raw: EslLongTextLeftCardsRightComponentData['promo']): LongTextLeftCardsRightPromo | undefined {
  if (!raw) return undefined;
  const promo = (raw.component || raw) as PromoFields;
  const heading = promo.heading?.trim();
  if (!heading) return undefined;

  const link = mapLink(promo.cta);
  const cta: LongTextLeftCardsRightLink | undefined =
    link.href && link.label ? { label: link.label, href: link.href, target: link.target } : undefined;

  return {
    eyebrow: promo.eyebrow?.trim() || undefined,
    heading,
    description: renderRichText(promo.description) || undefined,
    cta,
  };
}

function mapCards(rawItems: EslLongTextLeftCardsRightComponentData['items']): LongTextLeftCardsRightCard[] {
  if (!rawItems || !Array.isArray(rawItems)) return [];

  const cards: LongTextLeftCardsRightCard[] = [];
  rawItems.forEach((rawItem, idx) => {
    if (!rawItem) return;
    const item = (rawItem.component || rawItem) as CardFields;
    const title = item.title?.trim() || '';
    if (!title) return;

    const icon = item.icon?.trim().toLowerCase() || '';
    const link = mapLink(item.link);

    cards.push({
      id: item.id || item._id || `long-text-card-${idx + 1}`,
      icon: isLongTextLeftCardsRightIconName(icon) ? icon : undefined,
      eyebrow: item.eyebrow?.trim() || undefined,
      title,
      description: renderRichText(item.description) || undefined,
      href: link.href,
      target: link.target,
    });
  });
  return cards;
}

export default function EslLongTextLeftCardsRight({ content, id }: Props) {
  if (!content) return null;

  const c = (content && 'component' in content && content.component
    ? content.component
    : content) as EslLongTextLeftCardsRightComponentData;

  const title = c.title?.trim() || undefined;
  const items = mapCards(c.items);
  if (!title && items.length === 0) return null;

  return (
    <LongTextLeftCardsRight
      id={id}
      title={title}
      body={renderRichText(c.body) || undefined}
      promo={mapPromo(c.promo)}
      items={items}
    />
  );
}

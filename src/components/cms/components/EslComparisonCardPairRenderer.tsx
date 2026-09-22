import React from 'react';
import {
  ComparisonCardPair,
  type ComparisonCardPairProps,
} from '@/components/organisms/comparison-card-pair/ComparisonCardPair';
import type {
  ComparisonCardData,
  ComparisonFeatureItem,
} from '@/components/organisms/comparison-card-pair/comparisonCardPairData';
import type { EslComparisonCardPairData } from './EslComparisonCardPair';

type RichTextPayload = {
  html?: string | null;
  json?: unknown | null;
  [key: string]: unknown;
};

type CmsLink = {
  text?: string | null;
  title?: string | null;
  target?: string | null;
  url?: {
    default?: string | null;
    [key: string]: unknown;
  } | null;
};

type ComparisonFeatureItemInput = {
  _id?: string | null;
  id?: string | null;
  text?: string | null;
  iconType?: string | null;
  component?: {
    _id?: string | null;
    id?: string | null;
    text?: string | null;
    iconType?: string | null;
  } | null;
};

type ComparisonCardItemInput = {
  _id?: string | null;
  id?: string | null;
  title?: string | null;
  badgeText?: string | null;
  description?: RichTextPayload | string | null;
  cardDescription?: RichTextPayload | string | null;
  features?: Array<ComparisonFeatureItemInput | null> | null;
  cta?: CmsLink | null;
  secondaryCta?: CmsLink | null;
  component?: {
    _id?: string | null;
    id?: string | null;
    title?: string | null;
    badgeText?: string | null;
    description?: RichTextPayload | string | null;
    cardDescription?: RichTextPayload | string | null;
    features?: Array<ComparisonFeatureItemInput | null> | null;
    cta?: CmsLink | null;
    secondaryCta?: CmsLink | null;
  } | null;
};

export type EslComparisonCardPairComponentData = {
  eyebrow?: string | null;
  title?: string | null;
  description?: RichTextPayload | string | null;
  comparisonDescription?: RichTextPayload | string | null;
  cards?: Array<ComparisonCardItemInput | null> | null;
  component?: EslComparisonCardPairComponentData | null;
  [key: string]: unknown;
};

type Props = {
  content?: EslComparisonCardPairComponentData | EslComparisonCardPairData | null;
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

export default function EslComparisonCardPair({
  content,
  id = 'family-comparison-card-pair',
}: Props) {
  if (!content) return null;

  const effectiveContent = (content && 'component' in content && content.component
    ? content.component
    : content) as EslComparisonCardPairComponentData;

  const eyebrow = effectiveContent.eyebrow?.trim() || undefined;
  const title = effectiveContent.title?.trim() || '';
  const rawDescription =
    effectiveContent.comparisonDescription || effectiveContent.description;
  const description = extractPlainText(rawDescription) || undefined;

  const rawCards = effectiveContent.cards;
  if (!rawCards || !Array.isArray(rawCards) || rawCards.length === 0) {
    return null;
  }

  const mappedCards: ComparisonCardData[] = [];

  for (let cIdx = 0; cIdx < rawCards.length; cIdx++) {
    const rawCard = rawCards[cIdx];
    if (!rawCard) continue;

    const card = (rawCard && 'component' in rawCard && rawCard.component
      ? rawCard.component
      : rawCard) as ComparisonCardItemInput;

    const cardTitle = card.title?.trim() || '';
    const badgeText = card.badgeText?.trim() || undefined;
    const cardDesc = extractPlainText(card.cardDescription || card.description);

    const rawFeatures = card.features;
    const mappedFeatures: ComparisonFeatureItem[] = [];

    if (rawFeatures && Array.isArray(rawFeatures)) {
      for (let fIdx = 0; fIdx < rawFeatures.length; fIdx++) {
        const rawFeature = rawFeatures[fIdx];
        if (!rawFeature) continue;

        const feature = (rawFeature && 'component' in rawFeature && rawFeature.component
          ? rawFeature.component
          : rawFeature) as ComparisonFeatureItemInput;

        const text = feature.text?.trim() || '';
        if (!text) continue;

        const iconType: 'check' | 'credit-card' =
          feature.iconType === 'credit-card' ? 'credit-card' : 'check';

        mappedFeatures.push({
          id: feature.id || feature._id || `feature-${cIdx + 1}-${fIdx + 1}`,
          text,
          iconType,
        });
      }
    }

    let cta: ComparisonCardData['cta'] = undefined;
    const ctaLabel = card.cta?.text?.trim() || card.cta?.title?.trim();
    const ctaHref = card.cta?.url?.default?.trim();

    if (ctaLabel || ctaHref) {
      cta = {
        label: ctaLabel || '',
        href: ctaHref || '#',
        external: card.cta?.target === '_blank',
      };
    }

    let secondaryCta: ComparisonCardData['secondaryCta'] = undefined;
    const secLabel = card.secondaryCta?.text?.trim() || card.secondaryCta?.title?.trim();
    const secHref = card.secondaryCta?.url?.default?.trim();
    if (secLabel && secHref) {
      secondaryCta = {
        label: secLabel,
        href: secHref,
        external: card.secondaryCta?.target === '_blank',
      };
    }

    mappedCards.push({
      id: card.id || card._id || `card-${cIdx + 1}`,
      title: cardTitle,
      badgeText,
      description: cardDesc,
      features: mappedFeatures as [ComparisonFeatureItem, ComparisonFeatureItem, ComparisonFeatureItem],
      cta,
      secondaryCta,
    });
  }

  if (mappedCards.length === 0) {
    return null;
  }

  return (
    <ComparisonCardPair
      id={id}
      eyebrow={eyebrow}
      title={title}
      description={description}
      cards={mappedCards}
    />
  );
}

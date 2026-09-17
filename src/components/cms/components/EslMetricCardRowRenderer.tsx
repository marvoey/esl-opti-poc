import React from 'react';
import { MetricCardRow } from '@/components/organisms/metric-card-row/MetricCardRow';
import type { MetricCardItemData } from '@/components/organisms/metric-card-row/metricCardRowData';
import {
  type EslMetricCardRowData,
  type CardContent,
  resolveCategoryIcon,
} from './EslMetricCardRow';

type Props = {
  content?: (EslMetricCardRowData & { component?: EslMetricCardRowData }) | null;
};

type LinkContent = NonNullable<CardContent['cta']>;

function resolveLink(linkObj?: LinkContent | null) {
  if (!linkObj) return { label: '', href: '', external: false };
  const label = linkObj.text || linkObj.title || '';
  const rawUrl =
    linkObj.url?.default ||
    linkObj.url?.hierarchical ||
    linkObj.url?.base ||
    '';
  const href = rawUrl.trim();
  const rawTarget = linkObj.target?.trim().toLowerCase() || '';
  const external = rawTarget === '_blank';

  return { label, href, external };
}

export default function EslMetricCardRow({ content }: Props) {
  if (!content) return null;

  const effectiveContent = content.component || content;

  const eyebrow = effectiveContent.eyebrow?.trim() || '';
  const title = effectiveContent.title?.trim() || '';
  const description = effectiveContent.description?.trim() || '';
  const rowCtaResolved = resolveLink(effectiveContent.cta);

  const rawCards = effectiveContent.cards;
  const cards: MetricCardItemData[] = Array.isArray(rawCards)
    ? rawCards
        .filter((c): c is CardContent => Boolean(c))
        .map((card, index) => {
          const cardCta = resolveLink(card.cta);
          const category = card.category?.trim() || '';
          const rate = card.rate?.trim() || '';
          const rateUnit = card.rateUnit?.trim() || '%';
          const rateLabel = card.rateLabel?.trim() || 'APR';
          const cardTitle = card.title?.trim() || '';
          const cardDesc = card.description?.trim() || '';
          const variant = card.variant === 'active' ? 'active' : 'default';
          const categoryIcon = resolveCategoryIcon(card.categoryIcon, category);

          return {
            id: `metric-card-${index + 1}`,
            category,
            categoryIcon,
            rate,
            rateUnit,
            rateLabel,
            title: cardTitle,
            description: cardDesc,
            ctaText: cardCta.label || 'Explore options',
            href: cardCta.href || undefined,
            variant,
          };
        })
    : [];

  const hasContent = Boolean(title || eyebrow || description || cards.length > 0 || rowCtaResolved.label);
  if (!hasContent) return null;

  const rowCta = rowCtaResolved.label && rowCtaResolved.href
    ? {
        label: rowCtaResolved.label,
        href: rowCtaResolved.href,
        external: rowCtaResolved.external,
      }
    : undefined;

  return (
    <MetricCardRow
      eyebrow={eyebrow}
      title={title || undefined}
      description={description}
      cta={rowCta}
      cards={cards}
    />
  );
}

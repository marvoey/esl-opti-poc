import React from 'react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { MetricCardRow } from '@/components/organisms/metric-card-row/MetricCardRow';
import type { MetricCardItemData } from '@/components/organisms/metric-card-row/metricCardRowData';
import {
  CarIcon,
  HomeIcon,
  PiggyBankIcon,
  CoinsIcon,
  CreditCardIcon,
} from '@/components/atoms/icons';
import { EslRatesCardContentType } from './EslRatesCard';

export const EslMetricCardRowContentType = contentType({
  key: 'EslMetricCardRow',
  displayName: 'ESL Metric Card Row',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    eyebrow: {
      type: 'string',
      displayName: 'Eyebrow Text',
      group: 'content',
      sortOrder: 10,
    },
    title: {
      type: 'string',
      displayName: 'Title',
      group: 'content',
      sortOrder: 20,
    },
    description: {
      type: 'string',
      displayName: 'Description Copy',
      group: 'content',
      sortOrder: 30,
    },
    cta: {
      type: 'link',
      displayName: 'Call to Action (Button)',
      group: 'content',
      sortOrder: 40,
    },
    cards: {
      type: 'array',
      displayName: 'Rates Cards',
      group: 'content',
      sortOrder: 50,
      items: {
        type: 'component',
        contentType: EslRatesCardContentType,
      },
    },
  },
});

type EslRatesCardData = Partial<ContentProps<typeof EslRatesCardContentType>>;

type EslMetricCardRowData = Omit<Partial<ContentProps<typeof EslMetricCardRowContentType>>, 'cards'> & {
  cards?: (EslRatesCardData | null)[] | null;
};

type Props = {
  content?: (EslMetricCardRowData & { component?: EslMetricCardRowData }) | null;
};

type CardContent = EslRatesCardData;
type LinkContent = NonNullable<EslMetricCardRowData['cta']>;

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

export function resolveCategoryIcon(
  iconKey?: string | null,
  category?: string | null
): React.ReactNode {
  const normalizedKey = iconKey?.trim().toLowerCase();
  if (normalizedKey === 'car') return <CarIcon size={16} />;
  if (normalizedKey === 'home') return <HomeIcon size={16} />;
  if (normalizedKey === 'piggy-bank') return <PiggyBankIcon size={16} />;
  if (normalizedKey === 'coins') return <CoinsIcon size={16} />;
  if (normalizedKey === 'credit-card') return <CreditCardIcon size={16} />;

  // Smart inference based on category title
  const cat = (category || '').toLowerCase();
  if (cat.includes('road') || cat.includes('car') || cat.includes('auto') || cat.includes('vehicle')) {
    return <CarIcon size={16} />;
  }
  if (cat.includes('home') || cat.includes('mortgage') || cat.includes('house')) {
    return <HomeIcon size={16} />;
  }
  if (cat.includes('saving') || cat.includes('yield') || cat.includes('bank')) {
    return <PiggyBankIcon size={16} />;
  }
  if (cat.includes('coin')) {
    return <CoinsIcon size={16} />;
  }
  if (cat.includes('credit') || cat.includes('card')) {
    return <CreditCardIcon size={16} />;
  }

  return <CarIcon size={16} />;
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

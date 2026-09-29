import React from 'react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
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
      displayName: 'Eyebrow',
      group: 'content',
      sortOrder: 10,
    },
    title: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 20,
    },
    description: {
      type: 'string',
      displayName: 'Copy',
      group: 'content',
      sortOrder: 30,
    },
    cta: {
      type: 'link',
      displayName: 'CTA Link',
      group: 'content',
      sortOrder: 40,
    },
    cards: {
      type: 'array',
      displayName: 'Metric / Rates Cards',
      group: 'content',
      sortOrder: 50,
      items: {
        type: 'component',
        contentType: EslRatesCardContentType,
      },
    },
  },
});

export type EslRatesCardData = Partial<ContentProps<typeof EslRatesCardContentType>>;
export type EslMetricCardRowData = Omit<
  Partial<ContentProps<typeof EslMetricCardRowContentType>>,
  'cards'
> & {
  cards?: (EslRatesCardData | null)[] | null;
};
export type CardContent = EslRatesCardData;

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

import React from 'react';
import {
  FeatureCardRow,
} from '@/components/organisms/feature-card-row';
import { DEFAULT_FEATURE_CARD_ROW_PROPS } from '@/components/organisms/feature-card-row/featureCardRowData';
import type { EslFeatureCardRowData } from './EslFeatureCardRow';

type Props = {
  content?: (EslFeatureCardRowData & { component?: EslFeatureCardRowData }) | null;
  id?: string;
};

export default function EslFeatureCardRow({
  content,
  id = 'feature-card-row',
}: Props) {
  const effectiveContent = content?.component || content;

  // If explicitly unchecked, hide the component cleanly
  if (effectiveContent?.showFeatureCardRow === false) {
    return null;
  }

  const titleOverride = effectiveContent?.heading?.trim();

  return (
    <FeatureCardRow
      id={id}
      {...DEFAULT_FEATURE_CARD_ROW_PROPS}
      title={titleOverride || DEFAULT_FEATURE_CARD_ROW_PROPS.title}
    />
  );
}

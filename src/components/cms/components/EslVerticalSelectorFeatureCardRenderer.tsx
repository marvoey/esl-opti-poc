import React from 'react';
import {
  VerticalSelectorFeatureCard,
  DEFAULT_VERTICAL_SELECTOR_DATA,
} from '@/components/organisms/vertical-selector-feature-card';
import type { EslVerticalSelectorFeatureCardData } from './EslVerticalSelectorFeatureCard';

type Props = {
  content?: (EslVerticalSelectorFeatureCardData & {
    component?: EslVerticalSelectorFeatureCardData;
  }) | null;
};

export default function EslVerticalSelectorFeatureCard({ content }: Props) {
  const effectiveContent = content?.component || content;

  // If explicitly unchecked, hide the component cleanly
  if (effectiveContent?.showVerticalSelector === false) {
    return null;
  }

  const titleOverride = effectiveContent?.heading?.trim();

  return (
    <VerticalSelectorFeatureCard
      id="solutions-selector"
      title={titleOverride || DEFAULT_VERTICAL_SELECTOR_DATA.title}
    />
  );
}

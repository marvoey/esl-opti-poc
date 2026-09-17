import React from 'react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import {
  VerticalSelectorFeatureCard,
  DEFAULT_VERTICAL_SELECTOR_DATA,
} from '@/components/organisms/vertical-selector-feature-card';

export const EslVerticalSelectorFeatureCardContentType = contentType({
  key: 'EslVerticalSelectorFeatureCard',
  displayName: 'ESL Vertical Selector Feature Card',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    showVerticalSelector: {
      type: 'boolean',
      displayName: 'Show Vertical Selector Feature Card',
      group: 'content',
      sortOrder: 10,
    },
    heading: {
      type: 'string',
      displayName: 'Heading (Optional override)',
      group: 'content',
      sortOrder: 20,
    },
  },
});

type EslVerticalSelectorFeatureCardData = Partial<
  ContentProps<typeof EslVerticalSelectorFeatureCardContentType>
>;

type Props = {
  content?: (EslVerticalSelectorFeatureCardData & {
    component?: EslVerticalSelectorFeatureCardData;
  }) | null;
};

export default function EslVerticalSelectorFeatureCard({ content }: Props) {
  const effectiveContent = content?.component || content;

  // If explicitly unchecked in CMS, hide the component cleanly
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

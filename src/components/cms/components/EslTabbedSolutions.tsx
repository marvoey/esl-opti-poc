import React from 'react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import {
  TabbedIconCards,
  defaultTabbedSolutionsData,
} from '@/components/organisms/tabbed-icon-cards';

export const EslTabbedSolutionsContentType = contentType({
  key: 'EslTabbedSolutions',
  displayName: 'ESL Explore Solutions',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    showExploreSolutions: {
      type: 'boolean',
      displayName: 'Show Explore Our Solutions',
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

type EslTabbedSolutionsData = Partial<ContentProps<typeof EslTabbedSolutionsContentType>>;

type Props = {
  content?: (EslTabbedSolutionsData & { component?: EslTabbedSolutionsData }) | null;
};

export default function EslTabbedSolutions({ content }: Props) {
  const effectiveContent = content?.component || content;

  // If explicitly unchecked, hide the component
  if (effectiveContent?.showExploreSolutions === false) {
    return null;
  }

  return (
    <TabbedIconCards
      heading={effectiveContent?.heading || defaultTabbedSolutionsData.heading}
      tabs={defaultTabbedSolutionsData.tabs}
    />
  );
}

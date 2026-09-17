import React from 'react';
import {
  TabbedIconCards,
  defaultTabbedSolutionsData,
} from '@/components/organisms/tabbed-icon-cards';
import type { EslTabbedSolutionsData } from './EslTabbedSolutions';

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

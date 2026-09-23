import React from 'react';
import {
  CompareTable,
  DEFAULT_COMPARE_TABLE_DATA,
} from '@/components/organisms/compare-table';
import type { EslCompareTableData } from './EslCompareTable';

type Props = {
  content?: (EslCompareTableData & { component?: EslCompareTableData }) | null;
  id?: string;
};

export default function EslCompareTable({
  content,
  id = 'compare-table',
}: Props) {
  const effectiveContent = content?.component || content;

  // If explicitly unchecked, hide the component cleanly
  if (effectiveContent?.showCompareTable === false) {
    return null;
  }

  const titleOverride = effectiveContent?.heading?.trim();
  const tableData = titleOverride
    ? {
        ...DEFAULT_COMPARE_TABLE_DATA,
        title: titleOverride,
      }
    : DEFAULT_COMPARE_TABLE_DATA;

  return <CompareTable id={id} data={tableData} />;
}

import React from 'react';
import {
  TableCtaLeftColumn,
  type TableCtaLeftColumnColumn,
  type TableCtaLeftColumnRow,
} from '@/components/organisms/table-cta-left-column';
import type { EslTableCtaLeftColumnData } from './EslTableCtaLeftColumn';
import { resolveLink } from './eslVideoStoryCardRowMapper';

const MAX_COLUMNS = 4;

type LinkPayload = {
  text?: string | null;
  title?: string | null;
  target?: string | null;
  url?: {
    default?: string | null;
    hierarchical?: string | null;
    base?: string | null;
    [key: string]: unknown;
  } | null;
};

type ColumnFields = {
  _id?: string | null;
  title?: string | null;
  cta?: LinkPayload | null;
};

type RowFields = {
  _id?: string | null;
  label?: string | null;
  values?: Array<string | null> | null;
};

type ColumnInput = ColumnFields & { component?: ColumnFields | null };
type RowInput = RowFields & { component?: RowFields | null };

export type EslTableCtaLeftColumnComponentData = {
  title?: string | null;
  caption?: string | null;
  rowLabelHeading?: string | null;
  columns?: Array<ColumnInput | null> | null;
  rows?: Array<RowInput | null> | null;
  component?: EslTableCtaLeftColumnComponentData | null;
  [key: string]: unknown;
};

type Props = {
  content?: EslTableCtaLeftColumnComponentData | EslTableCtaLeftColumnData | null;
  displaySettings?: Record<string, string | boolean> | null;
  id?: string;
};

function mapColumns(rawColumns: EslTableCtaLeftColumnComponentData['columns']): TableCtaLeftColumnColumn[] {
  if (!Array.isArray(rawColumns)) return [];

  const columns: TableCtaLeftColumnColumn[] = [];
  rawColumns.forEach((rawColumn, idx) => {
    if (!rawColumn) return;
    const column = (rawColumn.component || rawColumn) as ColumnFields;
    const title = column.title?.trim() || '';
    if (!title) return;

    const link = resolveLink(column.cta as Parameters<typeof resolveLink>[0]);
    const label = link.label.trim();

    columns.push({
      id: column._id || `table-column-${idx + 1}`,
      title,
      cta: link.href && label ? { label, href: link.href, external: link.external } : undefined,
    });
  });
  return columns.slice(0, MAX_COLUMNS);
}

function mapRows(rawRows: EslTableCtaLeftColumnComponentData['rows']): TableCtaLeftColumnRow[] {
  if (!Array.isArray(rawRows)) return [];

  const rows: TableCtaLeftColumnRow[] = [];
  rawRows.forEach((rawRow, idx) => {
    if (!rawRow) return;
    const row = (rawRow.component || rawRow) as RowFields;
    const label = row.label?.trim() || '';
    if (!label) return;

    // Keep empty entries: values are index-aligned with the columns.
    const values = Array.isArray(row.values)
      ? row.values.map((value) => (typeof value === 'string' ? value.trim() : ''))
      : [];

    rows.push({ id: row._id || `table-row-${idx + 1}`, label, values });
  });
  return rows;
}

export default function EslTableCtaLeftColumn({ content, id }: Props) {
  if (!content) return null;

  const c = (content && 'component' in content && content.component
    ? content.component
    : content) as EslTableCtaLeftColumnComponentData;

  const columns = mapColumns(c.columns);
  const rows = mapRows(c.rows);
  if (columns.length === 0 || rows.length === 0) return null;

  return (
    <TableCtaLeftColumn
      id={id}
      title={c.title?.trim() || undefined}
      caption={c.caption?.trim() || undefined}
      rowLabelHeading={c.rowLabelHeading?.trim() || undefined}
      columns={columns}
      rows={rows}
    />
  );
}

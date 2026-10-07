import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslTableCtaColumnContentType } from './EslTableCtaColumn';
import { EslTableCtaRowContentType } from './EslTableCtaRow';

export const EslTableCtaLeftColumnContentType = contentType({
  key: 'EslTableCtaLeftColumn',
  displayName: 'ESL Table CTA Left Column',
  baseType: '_component',
  // Section only: `columns` and `rows` are arrays of components, which the CMS
  // refuses on an elementEnabled type.
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    title: {
      type: 'string',
      displayName: 'Heading',
      description: 'Optional heading above the table.',
      group: 'content',
      sortOrder: 10,
    },
    caption: {
      type: 'string',
      displayName: 'Table Caption',
      description: 'Read by screen readers only. Describe what is compared, e.g. "Daily Dividend compared with Money Maker".',
      group: 'content',
      sortOrder: 20,
    },
    rowLabelHeading: {
      type: 'string',
      displayName: 'Row Label Column Heading',
      description: 'Heading of the left column in the navy header row. Leave empty for a blank corner.',
      group: 'content',
      sortOrder: 30,
    },
    columns: {
      type: 'array',
      displayName: 'Columns',
      description: 'Product columns, left to right (up to 4).',
      isRequired: true,
      maxItems: 4,
      group: 'content',
      sortOrder: 40,
      items: {
        type: 'component',
        contentType: EslTableCtaColumnContentType,
      },
    },
    rows: {
      type: 'array',
      displayName: 'Rows',
      isRequired: true,
      group: 'content',
      sortOrder: 50,
      items: {
        type: 'component',
        contentType: EslTableCtaRowContentType,
      },
    },
  },
});

export type EslTableCtaLeftColumnData = Partial<
  ContentProps<typeof EslTableCtaLeftColumnContentType>
>;

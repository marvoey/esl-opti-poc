import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslTableCtaRowContentType = contentType({
  key: 'EslTableCtaRow',
  displayName: 'ESL Table CTA Row',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    label: {
      type: 'string',
      displayName: 'Row Label',
      description: 'Bold label in the left column, e.g. "Minimum to open". Rows without a label are not shown.',
      isRequired: true,
      group: 'content',
      sortOrder: 10,
    },
    values: {
      type: 'array',
      displayName: 'Cell Values',
      description: 'One value per column, in column order. Leave an entry empty for a blank cell.',
      group: 'content',
      sortOrder: 20,
      items: {
        type: 'string',
      },
    },
  },
});

export type EslTableCtaRowData = Partial<
  ContentProps<typeof EslTableCtaRowContentType>
>;

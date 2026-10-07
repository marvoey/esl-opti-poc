import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslTableCtaColumnContentType = contentType({
  key: 'EslTableCtaColumn',
  displayName: 'ESL Table CTA Column',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    title: {
      type: 'string',
      displayName: 'Heading',
      description: 'Column heading in the navy header row. Columns without a heading are not shown.',
      isRequired: true,
      group: 'content',
      sortOrder: 10,
    },
    cta: {
      type: 'link',
      displayName: 'CTA Link',
      description: 'Button under this column. The link text is the label; name the product, e.g. "Open Money Maker".',
      group: 'content',
      sortOrder: 20,
    },
  },
});

export type EslTableCtaColumnData = Partial<
  ContentProps<typeof EslTableCtaColumnContentType>
>;

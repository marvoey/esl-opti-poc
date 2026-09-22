import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslComparisonFeatureItemContentType = contentType({
  key: 'EslComparisonFeatureItem',
  displayName: 'ESL Comparison Feature Item',
  baseType: '_component',
  properties: {
    text: {
      type: 'string',
      displayName: 'Feature Text',
      group: 'content',
      sortOrder: 10,
    },
    iconType: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Icon Type',
      group: 'content',
      sortOrder: 20,
      enum: [
        { value: 'check', displayName: 'Check' },
        { value: 'credit-card', displayName: 'Credit Card' },
      ],
    },
  },
});

export type EslComparisonFeatureItemData = Partial<
  ContentProps<typeof EslComparisonFeatureItemContentType>
>;

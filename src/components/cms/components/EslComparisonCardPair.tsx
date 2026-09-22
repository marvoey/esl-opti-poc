import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslComparisonCardItemContentType } from './EslComparisonCardItem';

export const EslComparisonCardPairContentType = contentType({
  key: 'EslComparisonCardPair',
  displayName: 'ESL Comparison Card Pair',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    eyebrow: {
      type: 'string',
      displayName: 'Eyebrow Text',
      group: 'content',
      sortOrder: 10,
    },
    title: {
      type: 'string',
      displayName: 'Title',
      group: 'content',
      sortOrder: 20,
    },
    description: {
      type: 'richText',
      displayName: 'Description',
      group: 'content',
      sortOrder: 30,
    },
    cards: {
      type: 'array',
      displayName: 'Comparison Cards',
      group: 'content',
      sortOrder: 40,
      items: {
        type: 'component',
        contentType: EslComparisonCardItemContentType,
      },
    },
  },
});

export type EslComparisonCardPairData = Partial<
  ContentProps<typeof EslComparisonCardPairContentType>
>;

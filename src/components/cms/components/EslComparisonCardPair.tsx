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
      displayName: 'Eyebrow',
      group: 'content',
      sortOrder: 10,
    },
    title: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 20,
    },
    description: {
      type: 'richText',
      displayName: 'Copy',
      group: 'content',
      sortOrder: 30,
      editorSettings: {
        preset: 'default',
      },
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

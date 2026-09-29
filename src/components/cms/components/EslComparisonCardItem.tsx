import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslComparisonFeatureItemContentType } from './EslComparisonFeatureItem';

export const EslComparisonCardItemContentType = contentType({
  key: 'EslComparisonCardItem',
  displayName: 'ESL Comparison Card Item',
  baseType: '_component',
  properties: {
    title: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 10,
    },
    badgeText: {
      type: 'string',
      displayName: 'Eyebrow',
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
    features: {
      type: 'array',
      displayName: 'Features List',
      group: 'content',
      sortOrder: 40,
      items: {
        type: 'component',
        contentType: EslComparisonFeatureItemContentType,
      },
    },
    cta: {
      type: 'link',
      displayName: 'Primary CTA Link',
      group: 'content',
      sortOrder: 50,
    },
    secondaryCta: {
      type: 'link',
      displayName: 'Secondary CTA Link',
      group: 'content',
      sortOrder: 60,
    },
  },
});

export type EslComparisonCardItemData = Partial<
  ContentProps<typeof EslComparisonCardItemContentType>
>;

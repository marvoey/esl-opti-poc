import { contentType } from '@optimizely/cms-sdk';
import { EslStatCardContentType } from './EslStatCard';

export const EslSplitContentCardsContentType = contentType({
  key: 'EslSplitContentCards',
  displayName: 'ESL Split Content Cards',
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
    cta: {
      type: 'link',
      displayName: 'CTA Link',
      group: 'content',
      sortOrder: 40,
    },
    backgroundImage: {
      type: 'contentReference',
      displayName: 'Background Illustration',
      group: 'content',
      sortOrder: 50,
      allowedTypes: ['_image'],
    },
    heroMetricSubhead: {
      type: 'string',
      displayName: 'Subheading',
      group: 'content',
      sortOrder: 60,
    },
    heroMetricValue: {
      type: 'string',
      displayName: 'Hero Metric Value (e.g. $XX)',
      group: 'content',
      sortOrder: 70,
    },
    heroMetricUnit: {
      type: 'string',
      displayName: 'Hero Metric Unit (e.g. million)',
      group: 'content',
      sortOrder: 80,
    },
    heroMetricDescription: {
      type: 'string',
      displayName: 'Copy',
      group: 'content',
      sortOrder: 90,
    },
    statCards: {
      type: 'array',
      displayName: 'Stat Cards',
      group: 'content',
      sortOrder: 100,
      items: {
        type: 'component',
        contentType: EslStatCardContentType,
      },
    },
  },
});

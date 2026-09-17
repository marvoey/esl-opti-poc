import { contentType } from '@optimizely/cms-sdk';
import { EslCircularImageMetricItemContentType } from './EslCircularImageMetricItem';

export const EslCircularImageMetricRowContentType = contentType({
  key: 'EslCircularImageMetricRow',
  displayName: 'ESL Circular Image Metric Row',
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
      displayName: 'Heading Title',
      group: 'content',
      sortOrder: 20,
    },
    description: {
      type: 'richText',
      displayName: 'Description Copy (Rich Text)',
      group: 'content',
      sortOrder: 30,
      editorSettings: {
        preset: 'default',
      },
    },
    cta: {
      type: 'link',
      displayName: 'Call to Action Button',
      group: 'content',
      sortOrder: 40,
    },
    metrics: {
      type: 'array',
      displayName: 'Metric Items',
      group: 'content',
      sortOrder: 50,
      items: {
        type: 'component',
        contentType: EslCircularImageMetricItemContentType,
      },
    },
  },
});

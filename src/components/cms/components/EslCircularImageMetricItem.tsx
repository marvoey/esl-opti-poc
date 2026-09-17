import { contentType } from '@optimizely/cms-sdk';

export const EslCircularImageMetricItemContentType = contentType({
  key: 'EslCircularImageMetricItem',
  displayName: 'ESL Circular Image Metric Item',
  baseType: '_component',
  properties: {
    image: {
      type: 'contentReference',
      displayName: 'Circular Image',
      group: 'content',
      sortOrder: 10,
      allowedTypes: ['_image'],
    },
    imageAlt: {
      type: 'string',
      displayName: 'Image Alt Text',
      group: 'content',
      sortOrder: 20,
    },
    stat: {
      type: 'string',
      displayName: 'Stat Callout (e.g. 12,480, $2.4M, 180+)',
      group: 'content',
      sortOrder: 30,
    },
    label: {
      type: 'string',
      displayName: 'Stat Label Description',
      group: 'content',
      sortOrder: 40,
    },
  },
});

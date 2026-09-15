import { contentType } from '@optimizely/cms-sdk';

export const EslStatCardContentType = contentType({
  key: 'EslStatCard',
  displayName: 'ESL Stat Card',
  baseType: '_component',
  properties: {
    value: {
      type: 'string',
      displayName: 'Stat Value (e.g. XX, 4.8)',
      group: 'content',
      sortOrder: 10,
    },
    label: {
      type: 'string',
      displayName: 'Stat Label (e.g. years of dividends)',
      group: 'content',
      sortOrder: 20,
    },
  },
});

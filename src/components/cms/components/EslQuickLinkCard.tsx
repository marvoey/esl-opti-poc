import { contentType } from '@optimizely/cms-sdk';

export const EslQuickLinkCardContentType = contentType({
  key: 'EslQuickLinkCard',
  displayName: 'ESL Quick Link Card',
  baseType: '_component',
  properties: {
    title: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
    },
    url: {
      type: 'string',
      displayName: 'Card URL',
      group: 'content',
    },
  },
});

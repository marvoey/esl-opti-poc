import { contentType } from '@optimizely/cms-sdk';

export const EslFooterNavColumnContentType = contentType({
  key: 'EslFooterNavColumn',
  displayName: 'ESL Footer Navigation Column',
  baseType: '_component',
  properties: {
    title: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 10,
    },
    links: {
      type: 'array',
      displayName: 'Column Links',
      group: 'content',
      sortOrder: 20,
      items: {
        type: 'link',
      },
    },
  },
});

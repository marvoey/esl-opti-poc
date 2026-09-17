import { contentType } from '@optimizely/cms-sdk';
import { EslFooterContentType } from '@/components/cms/components/EslFooter';

export const EslStartPageContentType = contentType({
  key: 'EslStartPage',
  displayName: 'ESL Start Page',
  baseType: '_page',
  mayContainTypes: ['*'],
  properties: {
    title: {
      type: 'string',
      displayName: 'Site Title',
      group: 'content',
      sortOrder: 10,
    },
    footer: {
      type: 'component',
      contentType: EslFooterContentType,
      displayName: 'Footer Content',
      group: 'footer',
      sortOrder: 20,
    },
  },
});

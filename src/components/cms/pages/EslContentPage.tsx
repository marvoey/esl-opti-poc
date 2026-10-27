import { contentType } from '@optimizely/cms-sdk';
import { EslSeoContract } from '@/components/cms/shared/EslSeoContract';

export const EslContentPageContentType = contentType({
  key: 'EslContentPage',
  displayName: 'ESL Content Page',
  baseType: '_page',
  extends: [EslSeoContract],
  mayContainTypes: ['EslContentPage'],
  properties: {
    title: {
      type: 'string',
      displayName: 'Title',
      group: 'content',
      sortOrder: 10,
    },
    intro: {
      type: 'string',
      displayName: 'Intro',
      group: 'content',
      sortOrder: 20,
    },
    body: {
      type: 'richText',
      displayName: 'Body',
      group: 'content',
      sortOrder: 30,
    },
  },
});

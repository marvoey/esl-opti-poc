import { contentType } from '@optimizely/cms-sdk';
import { EslHeaderContentType } from '@/components/cms/components/EslHeader';
import { EslFooterContentType } from '@/components/cms/components/EslFooter';
import { EslSeoContract } from '@/components/cms/shared/EslSeoContract';

export const EslStartPageContentType = contentType({
  key: 'EslStartPage',
  displayName: 'ESL Start Page',
  baseType: '_page',
  extends: [EslSeoContract],
  mayContainTypes: ['EslHomeExperience', 'EslHomePage'],
  properties: {
    title: {
      type: 'string',
      displayName: 'Site Title',
      group: 'content',
      sortOrder: 10,
    },
    header: {
      type: 'component',
      contentType: EslHeaderContentType,
      displayName: 'Header Content',
      group: 'header',
      sortOrder: 15,
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

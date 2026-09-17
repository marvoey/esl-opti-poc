import { contentType } from '@optimizely/cms-sdk';
import { EslFooterContentType } from '@/components/cms/components/EslFooter';

export const EslSiteSettingsContentType = contentType({
  key: 'EslSiteSettings',
  displayName: 'ESL Site Settings',
  baseType: '_page',
  properties: {
    footer: {
      type: 'component',
      contentType: EslFooterContentType,
      displayName: 'Footer Content',
      group: 'footer',
      sortOrder: 10,
    },
  },
});

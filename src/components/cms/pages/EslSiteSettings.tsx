import { contentType } from '@optimizely/cms-sdk';
import { EslHeaderContentType } from '@/components/cms/components/EslHeader';
import { EslFooterContentType } from '@/components/cms/components/EslFooter';

export const EslSiteSettingsContentType = contentType({
  key: 'EslSiteSettings',
  displayName: 'ESL Site Settings',
  baseType: '_page',
  properties: {
    header: {
      type: 'component',
      contentType: EslHeaderContentType,
      displayName: 'Header Content',
      group: 'header',
      sortOrder: 5,
    },
    footer: {
      type: 'component',
      contentType: EslFooterContentType,
      displayName: 'Footer Content',
      group: 'footer',
      sortOrder: 10,
    },
  },
});

import React from 'react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
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

type Props = {
  content?: Partial<ContentProps<typeof EslSiteSettingsContentType>>;
};

export default function EslSiteSettings({ content }: Props) {
  return (
    <div>
      <h1>ESL Site Settings</h1>
      <p>Site-wide global configuration for layout, navigation, and footer.</p>
    </div>
  );
}

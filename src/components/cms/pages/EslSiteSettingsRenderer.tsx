import React from 'react';
import type { ContentProps } from '@optimizely/cms-sdk';
import type { EslSiteSettingsContentType } from './EslSiteSettings';

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

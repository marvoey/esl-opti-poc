import React from 'react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
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

type Props = {
  content?: Partial<ContentProps<typeof EslStartPageContentType>>;
};

export default function EslStartPage({ content }: Props) {
  return (
    <div>
      <h1>{content?.title || 'ESL Site Root'}</h1>
      <p>ESL Start Page site root container.</p>
    </div>
  );
}

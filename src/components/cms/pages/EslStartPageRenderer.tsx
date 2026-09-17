import React from 'react';
import type { ContentProps } from '@optimizely/cms-sdk';
import type { EslStartPageContentType } from './EslStartPage';

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

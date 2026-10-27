import React from 'react';
import type { ContentProps } from '@optimizely/cms-sdk';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import { Heading } from '@/components/atoms/heading/Heading';
import { Text } from '@/components/atoms/text/Text';
import type { EslContentPageContentType } from './EslContentPage';
import styles from './EslContentPage.module.css';

type Props = {
  content?: Partial<ContentProps<typeof EslContentPageContentType>>;
};

export default function EslContentPage({ content }: Props) {
  const bodyJson = content?.body?.json;

  return (
    <article className={styles.page}>
      <Heading level="h1">{content?.title || 'Untitled page'}</Heading>
      {content?.intro ? <Text variant="body-lg">{content.intro}</Text> : null}
      {bodyJson ? <RichText content={bodyJson} /> : null}
    </article>
  );
}

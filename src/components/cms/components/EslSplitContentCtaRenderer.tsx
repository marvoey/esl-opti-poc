import React from 'react';
import {
  SplitContentCta,
} from '@/components/organisms/split-content-cta';
import { DEFAULT_SPLIT_CONTENT_CTA_PROPS } from '@/components/organisms/split-content-cta/splitContentCtaData';
import type { EslSplitContentCtaData } from './EslSplitContentCta';

type Props = {
  content?: (EslSplitContentCtaData & { component?: EslSplitContentCtaData }) | null;
  id?: string;
};

export default function EslSplitContentCta({
  content,
  id = 'split-content-cta',
}: Props) {
  const effectiveContent = content?.component || content;

  // If explicitly unchecked, hide the component cleanly
  if (effectiveContent?.showSplitContentCta === false) {
    return null;
  }

  const titleOverride = effectiveContent?.heading?.trim();

  return (
    <SplitContentCta
      id={id}
      {...DEFAULT_SPLIT_CONTENT_CTA_PROPS}
      title={titleOverride || DEFAULT_SPLIT_CONTENT_CTA_PROPS.title}
    />
  );
}

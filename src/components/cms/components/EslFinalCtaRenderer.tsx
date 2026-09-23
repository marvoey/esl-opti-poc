import React from 'react';
import {
  FinalCta,
  DEFAULT_FINAL_CTA_PROPS,
} from '@/components/organisms/final-cta';
import type { EslFinalCtaData } from './EslFinalCta';

type Props = {
  content?: (EslFinalCtaData & { component?: EslFinalCtaData }) | null;
  id?: string;
};

export default function EslFinalCta({
  content,
  id = 'final-cta',
}: Props) {
  const effectiveContent = content?.component || content;

  // If explicitly unchecked, hide the component cleanly
  if (effectiveContent?.showFinalCta === false) {
    return null;
  }

  const headingOverride = effectiveContent?.heading?.trim();

  return (
    <FinalCta
      id={id}
      {...DEFAULT_FINAL_CTA_PROPS}
      heading={headingOverride || DEFAULT_FINAL_CTA_PROPS.heading}
    />
  );
}

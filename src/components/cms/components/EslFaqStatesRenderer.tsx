import React from 'react';
import {
  FaqStates,
  DEFAULT_FAQ_STATES_PROPS,
} from '@/components/organisms/faq-states';
import type { EslFaqStatesData } from './EslFaqStates';

type Props = {
  content?: (EslFaqStatesData & { component?: EslFaqStatesData }) | null;
};

export default function EslFaqStates({ content }: Props) {
  const effectiveContent = content?.component || content;

  // If explicitly unchecked, hide the component
  if (effectiveContent?.showFaqStates === false) {
    return null;
  }

  const titleOverride = effectiveContent?.heading?.trim();

  return (
    <FaqStates
      id="faq"
      {...DEFAULT_FAQ_STATES_PROPS}
      title={titleOverride || DEFAULT_FAQ_STATES_PROPS.title}
    />
  );
}

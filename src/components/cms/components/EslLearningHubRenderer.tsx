import React from 'react';
import {
  LearningHub,
  DEFAULT_LEARNING_HUB_PROPS,
} from '@/components/organisms/learning-hub';
import type { EslLearningHubData } from './EslLearningHub';

type Props = {
  content?: (EslLearningHubData & { component?: EslLearningHubData }) | null;
  id?: string;
};

export default function EslLearningHub({
  content,
  id = 'learning-hub',
}: Props) {
  const effectiveContent = content?.component || content;

  // If explicitly unchecked, hide the component cleanly
  if (effectiveContent?.showLearningHub === false) {
    return null;
  }

  const titleOverride = effectiveContent?.heading?.trim();

  return (
    <LearningHub
      id={id}
      {...DEFAULT_LEARNING_HUB_PROPS}
      title={titleOverride || DEFAULT_LEARNING_HUB_PROPS.title}
    />
  );
}

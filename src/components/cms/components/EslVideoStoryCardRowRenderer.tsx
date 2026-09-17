import React from 'react';
import { VideoStoryCardRow } from '@/components/organisms/video-story-card-row/VideoStoryCardRow';
import {
  mapVideoStoryCardRowProps,
  type EslVideoStoryCardRowData,
} from './eslVideoStoryCardRowMapper';

type Props = {
  content?: (EslVideoStoryCardRowData & { component?: EslVideoStoryCardRowData }) | null;
};

export default function EslVideoStoryCardRowRenderer({ content }: Props) {
  if (!content) return null;

  const effectiveContent = content.component || content;
  const { hasContent, props } = mapVideoStoryCardRowProps(effectiveContent);

  if (!hasContent) return null;

  return <VideoStoryCardRow {...props} />;
}

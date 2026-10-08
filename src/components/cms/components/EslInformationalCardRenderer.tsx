import React from 'react';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import { InformationalCard } from '@/components/organisms/informational-card';
import type { EslInformationalCardData } from './EslInformationalCard';
import { resolveLink } from './eslVideoStoryCardRowMapper';

type RichTextNode = Parameters<typeof RichText>[0]['content'];

type RichTextPayload = {
  html?: string | null;
  json?: RichTextNode | null;
  [key: string]: unknown;
};

type LinkPayload = {
  text?: string | null;
  title?: string | null;
  target?: string | null;
  url?: {
    default?: string | null;
    hierarchical?: string | null;
    base?: string | null;
    [key: string]: unknown;
  } | null;
};

export type EslInformationalCardComponentData = {
  badge?: string | null;
  title?: string | null;
  description?: RichTextPayload | string | null;
  noteLabel?: string | null;
  note?: string | null;
  cta?: LinkPayload | null;
  component?: EslInformationalCardComponentData | null;
  [key: string]: unknown;
};

type Props = {
  content?: EslInformationalCardComponentData | EslInformationalCardData | null;
  displaySettings?: Record<string, string | boolean> | null;
  id?: string;
};

function hasRichTextContent(json: RichTextNode): boolean {
  const node = json as { text?: unknown; children?: unknown };
  if (typeof node.text === 'string' && node.text.trim()) return true;
  return Array.isArray(node.children) && node.children.some((c) => hasRichTextContent(c as RichTextNode));
}

function renderRichText(content?: RichTextPayload | string | null): React.ReactNode {
  if (!content) return null;
  if (typeof content === 'string') return content.trim() || null;
  if (content.json && hasRichTextContent(content.json)) return <RichText content={content.json} />;
  if (content.html?.replace(/<[^>]*>/g, '').trim()) {
    return <div dangerouslySetInnerHTML={{ __html: content.html }} />;
  }
  return null;
}

export default function EslInformationalCard({ content, id }: Props) {
  if (!content) return null;

  const effectiveContent = (content && 'component' in content && content.component
    ? content.component
    : content) as EslInformationalCardComponentData;

  const title = effectiveContent.title?.trim();
  if (!title) return null;

  const { label, href, external } = resolveLink(effectiveContent.cta as Parameters<typeof resolveLink>[0]);
  const ctaLabel = label.trim();

  return (
    <InformationalCard
      id={id}
      badge={effectiveContent.badge?.trim() || undefined}
      title={title}
      description={renderRichText(effectiveContent.description) || undefined}
      noteLabel={effectiveContent.noteLabel?.trim() || undefined}
      note={effectiveContent.note?.trim() || undefined}
      cta={href && ctaLabel ? { label: ctaLabel, href, external } : undefined}
    />
  );
}

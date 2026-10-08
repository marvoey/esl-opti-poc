import React from 'react';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import {
  GuidanceDetailPanel,
  type GuidanceIconName,
  type GuidanceStartingPoint,
  type GuidanceTool,
} from '@/components/organisms/guidance-detail-panel';
import { resolveMediaUrl, type ImageRefContent } from '@/infrastructure/cms/mediaUrl';
import type { EslGuidanceDetailPanelData } from './EslGuidanceDetailPanel';
import { GUIDANCE_ICON_CHOICES } from './EslGuidanceToolItem';
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

type StartingPointFields = {
  _id?: string | null;
  id?: string | null;
  title?: string | null;
  description?: string | null;
  link?: LinkPayload | null;
};

type ToolFields = {
  _id?: string | null;
  id?: string | null;
  icon?: string | null;
  label?: string | null;
  title?: string | null;
  link?: LinkPayload | null;
};

type Wrapped<T> = T & { component?: T | null };

export type EslGuidanceDetailPanelComponentData = {
  icon?: string | null;
  title?: string | null;
  description?: RichTextPayload | string | null;
  cta?: LinkPayload | null;
  note?: string | null;
  image?: ImageRefContent | null;
  imageAlt?: string | null;
  startingPointsHeading?: string | null;
  startingPoints?: Array<Wrapped<StartingPointFields> | null> | null;
  toolsHeading?: string | null;
  tools?: Array<Wrapped<ToolFields> | null> | null;
  component?: EslGuidanceDetailPanelComponentData | null;
  [key: string]: unknown;
};

type Props = {
  content?: EslGuidanceDetailPanelComponentData | EslGuidanceDetailPanelData | null;
  displaySettings?: Record<string, string | boolean> | null;
  id?: string;
};

const ICON_VALUES = new Set<string>(GUIDANCE_ICON_CHOICES.map((icon) => icon.value));

function resolveIcon(icon?: string | null): GuidanceIconName | undefined {
  const key = icon?.trim().toLowerCase();
  return key && ICON_VALUES.has(key) ? (key as GuidanceIconName) : undefined;
}

function renderRichText(content?: RichTextPayload | string | null): React.ReactNode {
  if (!content) return null;
  if (typeof content === 'string') return content.trim() || null;
  if (content.json) return <RichText content={content.json} />;
  if (content.html?.trim()) return <div dangerouslySetInnerHTML={{ __html: content.html }} />;
  return null;
}

function mapLink(link?: LinkPayload | null) {
  const { label, href, external } = resolveLink(link as Parameters<typeof resolveLink>[0]);
  return { label: label.trim(), href, external };
}

function mapStartingPoints(
  raw: EslGuidanceDetailPanelComponentData['startingPoints']
): GuidanceStartingPoint[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((rawItem, idx) => {
    if (!rawItem) return [];
    const item = (rawItem.component || rawItem) as StartingPointFields;
    const title = item.title?.trim();
    if (!title) return [];
    const link = mapLink(item.link);
    return [
      {
        id: item.id || item._id || `starting-point-${idx + 1}`,
        title,
        description: item.description?.trim() || undefined,
        href: link.href || undefined,
        external: link.href ? link.external : undefined,
      },
    ];
  });
}

function mapTools(raw: EslGuidanceDetailPanelComponentData['tools']): GuidanceTool[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((rawItem, idx) => {
    if (!rawItem) return [];
    const item = (rawItem.component || rawItem) as ToolFields;
    const title = item.title?.trim();
    if (!title) return [];
    const link = mapLink(item.link);
    return [
      {
        id: item.id || item._id || `tool-${idx + 1}`,
        icon: resolveIcon(item.icon),
        label: item.label?.trim() || undefined,
        title,
        href: link.href || undefined,
        external: link.href ? link.external : undefined,
      },
    ];
  });
}

export default function EslGuidanceDetailPanel({ content, id }: Props) {
  if (!content) return null;

  const effectiveContent = (content && 'component' in content && content.component
    ? content.component
    : content) as EslGuidanceDetailPanelComponentData;

  const title = effectiveContent.title?.trim();
  if (!title) return null;

  const cta = mapLink(effectiveContent.cta);
  const imageSrc = resolveMediaUrl(effectiveContent.image, {
    width: 720,
    quality: 80,
    format: 'auto',
  });

  return (
    <GuidanceDetailPanel
      id={id}
      icon={resolveIcon(effectiveContent.icon)}
      title={title}
      description={renderRichText(effectiveContent.description) || undefined}
      cta={cta.href && cta.label ? cta : undefined}
      note={effectiveContent.note?.trim() || undefined}
      imageSrc={imageSrc || undefined}
      imageAlt={effectiveContent.imageAlt?.trim() || ''}
      startingPointsHeading={effectiveContent.startingPointsHeading?.trim() || undefined}
      startingPoints={mapStartingPoints(effectiveContent.startingPoints)}
      toolsHeading={effectiveContent.toolsHeading?.trim() || undefined}
      tools={mapTools(effectiveContent.tools)}
    />
  );
}

import React from 'react';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import { Hero, type HeroContentItem } from '@/components/organisms/hero/Hero';
import { resolveMediaUrl, type ImageRefContent } from '@/infrastructure/cms/mediaUrl';
import type { EslHeroData } from './EslHero';

export type CtaLinkContent = {
  text?: string | null;
  title?: string | null;
  target?: string | null;
  url?: {
    default?: string | null;
    hierarchical?: string | null;
    base?: string | null;
    [key: string]: unknown;
  } | null;
} | null;

export type EslHeroComponentData = Omit<
  EslHeroData,
  'body' | 'image' | 'primaryCta' | 'secondaryCta'
> & {
  body?: {
    html?: string | null;
    json?: Parameters<typeof RichText>[0]['content'] | null;
  } | string | null;
  image?: ImageRefContent | null;
  primaryCta?: CtaLinkContent;
  secondaryCta?: CtaLinkContent;
};

type Props = {
  content?: (EslHeroComponentData & { component?: EslHeroComponentData }) | null;
  displaySettings?: Record<string, string | boolean> | null;
  defaultVariant?: 'circled' | 'squared';
};

type LinkContent = CtaLinkContent;
type RichTextPayload = NonNullable<EslHeroComponentData>['body'];

function splitHeading(headingStr?: string | null): { titleLine1: string; titleLine2?: string } {
  if (!headingStr) return { titleLine1: '' };
  const trimmed = headingStr.trim();
  if (trimmed.includes('\n')) {
    const parts = trimmed.split('\n');
    return {
      titleLine1: parts[0].trim(),
      titleLine2: parts.slice(1).join(' ').trim() || undefined,
    };
  }
  if (trimmed.includes('.')) {
    const parts = trimmed.split('.');
    return {
      titleLine1: parts[0] + '.',
      titleLine2: parts.slice(1).join('.').trim() || undefined,
    };
  }
  return { titleLine1: trimmed };
}

function renderBody(bodyContent?: RichTextPayload): React.ReactNode {
  if (!bodyContent) return null;
  if (typeof bodyContent === 'string') {
    const trimmed = bodyContent.trim();
    return trimmed || null;
  }
  if (bodyContent.json) {
    return <RichText content={bodyContent.json} />;
  }
  if (bodyContent.html) {
    const trimmed = bodyContent.html.trim();
    if (!trimmed || trimmed === '<p></p>') return null;
    return <div dangerouslySetInnerHTML={{ __html: trimmed }} />;
  }
  return null;
}

function resolveMediaAlt(content?: EslHeroComponentData | null, fallback: string = ''): string {
  const directAlt = content?.imageAlt?.trim();
  if (directAlt) return directAlt;

  const item = content?.image?.item as { AltText?: string | null; Title?: string | null } | null | undefined;
  if (item?.AltText) return item.AltText;
  if (item?.Title) return item.Title;
  return fallback;
}

function resolveLink(linkObj?: LinkContent | null): {
  text: string;
  url?: string;
  target?: '_blank';
  rel?: 'noopener noreferrer';
} | null {
  if (!linkObj) return null;
  const text = (linkObj.text || linkObj.title || '').trim();
  const rawUrl =
    linkObj.url?.default ||
    linkObj.url?.hierarchical ||
    linkObj.url?.base ||
    '';
  const url = rawUrl.trim() || undefined;
  if (!text && !url) return null;

  const rawTarget = linkObj.target?.trim().toLowerCase() || '';
  const isBlank = rawTarget === '_blank';
  const target = isBlank ? ('_blank' as const) : undefined;
  const rel = isBlank ? ('noopener noreferrer' as const) : undefined;

  return { text, url, target, rel };
}

export default function EslHero({
  content,
  displaySettings,
  defaultVariant = 'circled',
}: Props) {
  if (!content) return null;

  const effectiveContent = content.component || content;
  if (!effectiveContent) return null;

  const rawHeading = effectiveContent.heading?.trim();
  // No hardcoded content: if required content (heading) is not present in CMS, do not render
  if (!rawHeading) return null;

  const { titleLine1, titleLine2 } = splitHeading(rawHeading);
  const eyebrow = effectiveContent.eyebrow?.trim() || '';
  const body = renderBody(effectiveContent.body as RichTextPayload);

  const rawImageSrc = resolveMediaUrl(
    effectiveContent.image as ImageRefContent | null | undefined,
    { width: 600, quality: 80, format: 'auto' }
  );
  // Strict rule: if no image in CMS, pass undefined so no project/fallback image renders
  const imageSrc = rawImageSrc || undefined;
  const imageAlt = imageSrc ? resolveMediaAlt(effectiveContent, rawHeading) : undefined;

  const primaryCtaResolved = resolveLink(effectiveContent.primaryCta);
  const secondaryCtaResolved = resolveLink(effectiveContent.secondaryCta);

  const primaryCtaIcon =
    effectiveContent.primaryCtaIcon && effectiveContent.primaryCtaIcon.trim() !== 'none'
      ? effectiveContent.primaryCtaIcon.trim()
      : undefined;

  const secondaryCtaIcon =
    effectiveContent.secondaryCtaIcon && effectiveContent.secondaryCtaIcon.trim() !== 'none'
      ? effectiveContent.secondaryCtaIcon.trim()
      : undefined;

  const badgeStat = effectiveContent.badgeStat?.trim() || undefined;
  const badgeLabel = effectiveContent.badgeLabel?.trim() || undefined;

  const rawVariant = effectiveContent.variant;
  const settingVariant = (displaySettings?.variant || displaySettings?.defaultVariant || defaultVariant) as string | undefined;
  const resolvedVariant: 'default' | 'squared' =
    rawVariant === 'squared' || settingVariant === 'squared'
      ? 'squared'
      : 'default';

  const heroContent: HeroContentItem = {
    eyebrow,
    titleLine1,
    titleLine2,
    body,
    primaryCta: primaryCtaResolved?.text || undefined,
    primaryCtaHref: primaryCtaResolved?.url,
    primaryCtaExternal: primaryCtaResolved?.target === '_blank',
    primaryCtaIcon,
    secondaryCta: secondaryCtaResolved?.text || undefined,
    secondaryCtaHref: secondaryCtaResolved?.url,
    secondaryCtaExternal: secondaryCtaResolved?.target === '_blank',
    secondaryCtaIcon,
    imageSrc,
    imageAlt,
    badgeStat,
    badgeLabel,
  };

  return <Hero content={heroContent} variant={resolvedVariant} headingLevel="h1" priority={true} />;
}

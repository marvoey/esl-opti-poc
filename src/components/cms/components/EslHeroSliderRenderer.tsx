import React from 'react';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import { HeroCarousel } from '@/components/organisms/hero-carousel/HeroCarousel';
import { resolveMediaUrl, type ImageRefContent } from '@/infrastructure/cms/mediaUrl';

export type HeroSlideItem = {
  eyebrow?: string | null;
  heading?: string | null;
  body?: {
    html?: string | null;
    json?: Parameters<typeof RichText>[0]['content'] | null;
  } | string | null;
  image?: ImageRefContent | null;
  imageAlt?: string | null;
  primaryCtaIcon?: string | null;
  primaryCta?: {
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
  secondaryCtaIcon?: string | null;
  secondaryCta?: {
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
  badgeStat?: string | null;
  badgeLabel?: string | null;
  [key: string]: unknown;
};

export type EslHeroSliderComponentData = {
  variant?: 'circled' | 'squared' | string | null;
  slides?: HeroSlideItem[] | null;
  [key: string]: unknown;
};

type Props = {
  content?: (EslHeroSliderComponentData & { component?: EslHeroSliderComponentData }) | null;
  displaySettings?: Record<string, string | boolean> | null;
  defaultVariant?: 'circled' | 'squared';
};

type LinkContent = HeroSlideItem['primaryCta'];
type RichTextContent = HeroSlideItem['body'];

function splitHeading(headingStr?: string | null) {
  if (!headingStr) return { titleLine1: '', titleLine2: '' };
  if (headingStr.includes('.')) {
    const parts = headingStr.split('.');
    return {
      titleLine1: parts[0] + '.',
      titleLine2: parts.slice(1).join('.').trim(),
    };
  }
  return { titleLine1: headingStr, titleLine2: '' };
}

function renderBody(bodyContent?: RichTextContent | string | null) {
  if (!bodyContent) return '';
  if (typeof bodyContent === 'string') return bodyContent;
  if (bodyContent.json) {
    return <RichText content={bodyContent.json} />;
  }
  if (bodyContent.html) {
    return <div dangerouslySetInnerHTML={{ __html: bodyContent.html }} />;
  }
  return '';
}

function resolveMediaAlt(slide?: HeroSlideItem | null, fallback: string = ''): string {
  const directAlt = slide?.imageAlt?.trim();
  if (directAlt) return directAlt;

  const item = slide?.image?.item as { AltText?: string | null; Title?: string | null } | null | undefined;
  if (item?.AltText) return item.AltText;
  if (item?.Title) return item.Title;
  return fallback;
}

function resolveLink(linkObj?: LinkContent | null) {
  if (!linkObj) return { text: '', url: undefined, target: undefined, rel: undefined };
  const text = linkObj.text || linkObj.title || '';
  const rawUrl =
    linkObj.url?.default ||
    linkObj.url?.hierarchical ||
    linkObj.url?.base ||
    '';
  const url = rawUrl.trim() ? rawUrl.trim() : undefined;

  const rawTarget = linkObj.target?.trim().toLowerCase() || '';
  const isBlank = rawTarget === '_blank';
  const target = isBlank ? '_blank' : undefined;
  const rel = isBlank ? 'noopener noreferrer' : undefined;

  return { text, url, target, rel };
}

export default function EslHeroSlider({
  content,
  displaySettings,
  defaultVariant = 'circled',
}: Props) {
  const effectiveContent = content?.component || content;
  const sliderSlides = effectiveContent?.slides;

  // Contextual default: squared for Product Detail, circled for Home
  const contextDefault =
    (displaySettings?.defaultVariant as 'circled' | 'squared' | undefined) || defaultVariant;

  const rawVariant = effectiveContent?.variant;
  const resolvedVariant: 'default' | 'squared' =
    rawVariant === 'squared'
      ? 'squared'
      : rawVariant === 'circled'
      ? 'default'
      : contextDefault === 'squared'
      ? 'squared'
      : 'default';

  const customSlides = Array.isArray(sliderSlides)
    ? sliderSlides.map((slide, idx) => {
        const { titleLine1: t1, titleLine2: t2 } = splitHeading(slide.heading);
        const imageSrc = resolveMediaUrl(
          slide.image as ImageRefContent | null | undefined,
          { width: 600, quality: 80, format: 'auto' }
        );
        const imageAlt = imageSrc ? resolveMediaAlt(slide, slide.heading || '') : '';
        const primaryCtaResolved = resolveLink(slide.primaryCta);
        const secondaryCtaResolved = resolveLink(slide.secondaryCta);
        const primaryCtaIcon =
          slide.primaryCtaIcon && slide.primaryCtaIcon.trim() !== 'none'
            ? slide.primaryCtaIcon.trim()
            : undefined;
        const secondaryCtaIcon =
          slide.secondaryCtaIcon && slide.secondaryCtaIcon.trim() !== 'none'
            ? slide.secondaryCtaIcon.trim()
            : undefined;

        return {
          id: `slide-${idx + 1}`,
          eyebrow: slide.eyebrow || '',
          titleLine1: t1 || '',
          titleLine2: t2 || '',
          body: renderBody(slide.body),
          primaryCta: primaryCtaResolved.text,
          primaryCtaHref: primaryCtaResolved.url,
          primaryCtaTarget: primaryCtaResolved.target,
          primaryCtaRel: primaryCtaResolved.rel,
          primaryCtaIcon,
          secondaryCta: secondaryCtaResolved.text,
          secondaryCtaHref: secondaryCtaResolved.url,
          secondaryCtaTarget: secondaryCtaResolved.target,
          secondaryCtaRel: secondaryCtaResolved.rel,
          secondaryCtaIcon,
          imageSrc,
          imageAlt,
          badgeStat: slide.badgeStat || '',
          badgeLabel: slide.badgeLabel || '',
        };
      })
    : [];

  // No hardcoded content: if no slides are in the CMS, do not render
  if (customSlides.length === 0) {
    return null;
  }

  return <HeroCarousel variant={resolvedVariant} slides={customSlides} headingLevel="h1" />;
}

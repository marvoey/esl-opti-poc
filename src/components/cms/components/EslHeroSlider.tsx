import React from 'react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import { HeroCarousel } from '@/components/organisms/hero-carousel/HeroCarousel';
import { EslHeroSlideContentType } from './EslHeroSlide';

export const EslHeroSliderContentType = contentType({
  key: 'EslHeroSlider',
  displayName: 'ESL Hero Slider',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    slides: {
      type: 'array',
      displayName: 'Slides',
      group: 'content',
      items: {
        type: 'component',
        contentType: EslHeroSlideContentType,
      },
    },
  },
});

type EslHeroSliderData = Partial<ContentProps<typeof EslHeroSliderContentType>>;

type Props = {
  content?: (EslHeroSliderData & { component?: EslHeroSliderData }) | null;
};

type HeroSlideContent = NonNullable<EslHeroSliderData['slides']>[number];
type LinkContent = NonNullable<HeroSlideContent['primaryCta']>;
type RichTextContent = NonNullable<HeroSlideContent['body']>;
type ImageRefContent = NonNullable<HeroSlideContent['image']>;

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

function resolveMediaUrl(imageRef?: ImageRefContent | null): string {
  if (!imageRef) return '';

  const url =
    imageRef.item?.Url ||
    imageRef.url?.default ||
    imageRef.url?.hierarchical ||
    imageRef.url?.graph ||
    imageRef.url?.base ||
    '';

  if (!url) return '';

  if (url.startsWith('/') && !url.startsWith('/images/')) {
    const cmsBase = process.env.OPTIMIZELY_CMS_URL || '';
    return cmsBase ? `${cmsBase.replace(/\/$/, '')}${url}` : url;
  }

  return url;
}

function resolveMediaAlt(slide?: HeroSlideContent | null, fallback: string = ''): string {
  const directAlt = slide?.imageAlt?.trim();
  if (directAlt) return directAlt;

  const item = slide?.image?.item;
  if (item && 'AltText' in item && item.AltText) return item.AltText;
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

export default function EslHeroSlider({ content }: Props) {
  const effectiveContent = content?.component || content;
  const sliderSlides = effectiveContent?.slides;
  const customSlides = Array.isArray(sliderSlides)
    ? sliderSlides.map((slide, idx) => {
        const { titleLine1: t1, titleLine2: t2 } = splitHeading(slide.heading);
        const imageSrc = resolveMediaUrl(slide.image);
        const imageAlt = imageSrc ? resolveMediaAlt(slide, slide.heading || '') : '';
        const primaryCtaResolved = resolveLink(slide.primaryCta);
        const secondaryCtaResolved = resolveLink(slide.secondaryCta);
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
          secondaryCta: secondaryCtaResolved.text,
          secondaryCtaHref: secondaryCtaResolved.url,
          secondaryCtaTarget: secondaryCtaResolved.target,
          secondaryCtaRel: secondaryCtaResolved.rel,
          imageSrc,
          imageAlt,
          badgeStat: slide.badgeStat || '',
          badgeLabel: slide.badgeLabel || '',
        };
      })
    : [];

  return <HeroCarousel slides={customSlides.length > 0 ? customSlides : undefined} />;
}

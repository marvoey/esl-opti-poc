import React from 'react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import { HeroCarousel } from '@/components/organisms/hero-carousel/HeroCarousel';
import { SnipeCta } from '@/components/organisms/snipe-cta/SnipeCta';
import {
  TabbedIconCards,
  defaultTabbedSolutionsData,
} from '@/components/organisms/tabbed-icon-cards';
import { EslHeroSliderContentType } from '@/components/cms/components/EslHeroSlider';
import { EslSnipeCtaContentType } from '@/components/cms/components/EslSnipeCta';

export const EslHomePageContentType = contentType({
  key: 'EslHomePage',
  displayName: 'ESL Home Page',
  baseType: '_page',
  mayContainTypes: ['*'],
  properties: {
    heroSlider: {
      type: 'component',
      contentType: EslHeroSliderContentType,
      displayName: 'Content',
      group: 'heroSlider',
      sortOrder: 10,
    },
    snipeCta: {
      type: 'component',
      contentType: EslSnipeCtaContentType,
      displayName: 'Snipe CTA Banner',
      group: 'content',
      sortOrder: 20,
    },
    showExploreSolutions: {
      type: 'boolean',
      displayName: 'Show Explore Our Solutions',
      group: 'content',
      sortOrder: 30,
    },
  },
});

type Props = {
  content?: Partial<ContentProps<typeof EslHomePageContentType>>;
};

type HeroSliderContent = NonNullable<NonNullable<Props['content']>['heroSlider']>;
type HeroSlideContent = NonNullable<HeroSliderContent['slides']>[number];
type SnipeCtaContent = NonNullable<NonNullable<Props['content']>['snipeCta']>;
type LinkContent = NonNullable<HeroSlideContent['primaryCta']>;
type RichTextContent = NonNullable<HeroSlideContent['body']>;
type ImageRefContent = NonNullable<HeroSlideContent['image']>;

export default function EslHomePage({ content = {} }: Props) {
  const { pa } = getPreviewUtils(content as ContentProps<typeof EslHomePageContentType>);

  const splitHeading = (headingStr?: string | null) => {
    if (!headingStr) return { titleLine1: '', titleLine2: '' };
    if (headingStr.includes('.')) {
      const parts = headingStr.split('.');
      return {
        titleLine1: parts[0] + '.',
        titleLine2: parts.slice(1).join('.').trim(),
      };
    }
    return { titleLine1: headingStr, titleLine2: '' };
  };

  const renderBody = (bodyContent?: RichTextContent | string | null) => {
    if (!bodyContent) return '';
    if (typeof bodyContent === 'string') return bodyContent;
    if (bodyContent.json) {
      return <RichText content={bodyContent.json} />;
    }
    if (bodyContent.html) {
      return <div dangerouslySetInnerHTML={{ __html: bodyContent.html }} />;
    }
    return '';
  };

  const resolveMediaUrl = (imageRef?: ImageRefContent | null): string => {
    if (!imageRef) return '';

    const url =
      imageRef.item?.Url ||
      imageRef.url?.default ||
      imageRef.url?.hierarchical ||
      imageRef.url?.graph ||
      imageRef.url?.base ||
      '';

    if (!url) return '';

    // If relative path from CMS, prefix with CMS base URL if available
    if (url.startsWith('/') && !url.startsWith('/images/')) {
      const cmsBase = process.env.OPTIMIZELY_CMS_URL || '';
      return cmsBase ? `${cmsBase.replace(/\/$/, '')}${url}` : url;
    }

    return url;
  };

  const resolveMediaAlt = (slide?: HeroSlideContent | null, fallback: string = ''): string => {
    const directAlt = slide?.imageAlt?.trim();
    if (directAlt) return directAlt;

    const item = slide?.image?.item;
    if (item && 'AltText' in item && item.AltText) return item.AltText;
    if (item?.Title) return item.Title;
    return fallback;
  };

  const resolveLink = (linkObj?: LinkContent | null) => {
    if (!linkObj) return { text: '', url: undefined, target: undefined, rel: undefined };
    const text = linkObj.text || linkObj.title || '';
    const rawUrl =
      linkObj.url?.default ||
      linkObj.url?.hierarchical ||
      linkObj.url?.base ||
      '';
    const url = rawUrl.trim() ? rawUrl.trim() : undefined;

    // Optimizely CMS Link Dialog target resolution:
    // - If set to open in a new tab (e.g. '_blank') -> target="_blank" and rel="noopener noreferrer"
    // - If set to same page ('_top', '_self'), not set (null/undefined), or empty -> open in current tab (no _blank)
    const rawTarget = linkObj.target?.trim().toLowerCase() || '';
    const isBlank = rawTarget === '_blank';
    const target = isBlank ? '_blank' : undefined;
    const rel = isBlank ? 'noopener noreferrer' : undefined;

    return { text, url, target, rel };
  };

  const sliderSlides = content.heroSlider?.slides;
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

  const snipeCta: SnipeCtaContent | null | undefined = content.snipeCta;
  const snipeLink = resolveLink(snipeCta?.link);
  const hasSnipeCta = Boolean(
    snipeCta && (snipeCta.title || snipeCta.description || snipeLink.text || snipeLink.url)
  );

  return (
    <>
      {/* Front-end Developer's Real Hero Carousel Component with full styling & animations */}
      <div {...pa('heroSlider')}>
        <HeroCarousel slides={customSlides.length > 0 ? customSlides : undefined} />
      </div>

      {/* Headless Snipe CTA Organism - dynamically driven by CMS content */}
      {hasSnipeCta && (
        <div {...pa('snipeCta')}>
          <SnipeCta
            title={snipeCta?.title ?? undefined}
            description={snipeCta?.description ?? undefined}
            linkLabel={snipeLink.text}
            linkHref={snipeLink.url}
            linkTarget={snipeLink.target}
            linkRel={snipeLink.rel}
          />
        </div>
      )}

      {/* Explore Our Solutions Organism - visibility controlled by CMS toggle, static POC content */}
      {content.showExploreSolutions !== false && (
        <div {...pa('showExploreSolutions')}>
          <TabbedIconCards
            heading={defaultTabbedSolutionsData.heading}
            tabs={defaultTabbedSolutionsData.tabs}
          />
        </div>
      )}
    </>
  );
}

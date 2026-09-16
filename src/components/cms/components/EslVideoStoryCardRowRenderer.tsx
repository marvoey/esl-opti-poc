import React from 'react';
import type { ContentProps } from '@optimizely/cms-sdk';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import { VideoStoryCardRow } from '@/components/organisms/video-story-card-row/VideoStoryCardRow';
import type { VideoStoryCardItemData } from '@/components/organisms/video-story-card-row/videoStoryCardRowData';
import {
  StoreIcon,
  HomeIcon,
  GraduationCapIcon,
  PiggyBankIcon,
} from '@/components/atoms/icons';
import { EslVideoStoryCardRowContentType } from './EslVideoStoryCardRow';
import { EslVideoStoryCardContentType } from './EslVideoStoryCard';

type EslVideoStoryCardData = Omit<
  Partial<ContentProps<typeof EslVideoStoryCardContentType>>,
  'quote'
> & {
  quote?: Partial<NonNullable<ContentProps<typeof EslVideoStoryCardContentType>['quote']>> | string | null;
};

type EslVideoStoryCardRowData = Omit<
  Partial<ContentProps<typeof EslVideoStoryCardRowContentType>>,
  'cards' | 'description'
> & {
  cards?: (EslVideoStoryCardData | null)[] | null;
  description?: Partial<NonNullable<ContentProps<typeof EslVideoStoryCardRowContentType>['description']>> | string | null;
};

type Props = {
  content?: (EslVideoStoryCardRowData & { component?: EslVideoStoryCardRowData }) | null;
};

type LinkContent = NonNullable<EslVideoStoryCardRowData['cta']>;
type ImageRefContent = NonNullable<EslVideoStoryCardData['image']>;
type RichTextContent =
  | NonNullable<EslVideoStoryCardRowData['description']>
  | NonNullable<EslVideoStoryCardData['quote']>;

function renderRichText(content?: RichTextContent | string | null): React.ReactNode {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (
    content.json &&
    Array.isArray((content.json as { children?: unknown[] }).children) &&
    (content.json as { children?: unknown[] }).children!.length > 0
  ) {
    return <RichText content={content.json} />;
  }
  if (content.html) {
    return <div dangerouslySetInnerHTML={{ __html: content.html }} />;
  }
  if (content.json) {
    return <RichText content={content.json} />;
  }
  return '';
}

function resolveCategoryIcon(iconKey?: string | null): React.ReactNode {
  const normalized = iconKey?.trim().toLowerCase();
  if (normalized === 'store') return <StoreIcon size={22} />;
  if (normalized === 'home') return <HomeIcon size={22} />;
  if (normalized === 'graduation-cap' || normalized === 'student' || normalized === 'college') {
    return <GraduationCapIcon size={22} />;
  }
  if (normalized === 'piggy-bank' || normalized === 'savings') {
    return <PiggyBankIcon size={22} />;
  }
  return <StoreIcon size={22} />;
}

function resolveLink(linkObj?: LinkContent | null) {
  if (!linkObj) return { label: '', href: '', external: false };
  const label = linkObj.text || linkObj.title || '';
  const rawUrl =
    linkObj.url?.default ||
    linkObj.url?.hierarchical ||
    linkObj.url?.base ||
    '';
  const href = rawUrl.trim();
  const rawTarget = linkObj.target?.trim().toLowerCase() || '';
  const external = rawTarget === '_blank';

  return { label, href, external };
}

function resolveMediaUrl(imageRef?: ImageRefContent | null): string {
  if (!imageRef) return '';

  const url =
    (imageRef as { item?: { Url?: string } }).item?.Url ||
    imageRef.url?.default ||
    imageRef.url?.hierarchical ||
    imageRef.url?.base ||
    '';

  if (!url) return '';

  if (url.startsWith('/') && !url.startsWith('/images/')) {
    const cmsBase = process.env.OPTIMIZELY_CMS_URL || '';
    return cmsBase ? `${cmsBase.replace(/\/$/, '')}${url}` : url;
  }

  return url;
}

export default function EslVideoStoryCardRowRenderer({ content }: Props) {
  if (!content) return null;

  const effectiveContent = content.component || content;

  const eyebrow = effectiveContent.eyebrow?.trim() || '';
  const title = effectiveContent.title?.trim() || '';
  const description = renderRichText(effectiveContent.description);

  const ctaResolved = resolveLink(effectiveContent.cta);
  const cta =
    ctaResolved.label && ctaResolved.href
      ? {
          label: ctaResolved.label,
          href: ctaResolved.href,
          external: ctaResolved.external,
        }
      : undefined;

  const rawCards = effectiveContent.cards;
  const cards: VideoStoryCardItemData[] = Array.isArray(rawCards)
    ? rawCards
        .filter((c): c is EslVideoStoryCardData => Boolean(c))
        .map((card, index): VideoStoryCardItemData | null => {
          const imageSrc = resolveMediaUrl(card.image);
          // Strict Rule: All images must resolve from CMS media.
          // Incomplete cards without a CMS image are omitted (no local fallback).
          if (!imageSrc) return null;

          const cardTitle = card.title?.trim() || '';
          const quote = renderRichText(card.quote);
          const imageAlt = card.imageAlt?.trim() || cardTitle || 'Testimonial story video thumbnail';
          const videoUrl = card.videoUrl?.trim() || undefined;
          const videoTitle = card.videoTitle?.trim() || cardTitle || undefined;
          const icon = resolveCategoryIcon(card.categoryIcon);

          const authorName = card.authorName?.trim() || '';
          const authorRole = card.authorRole?.trim() || '';
          const authorLocation = card.authorLocation?.trim() || '';

          const author = authorName
            ? {
                name: authorName,
                role: authorRole || undefined,
                location: authorLocation || undefined,
              }
            : '';

          return {
            id: `story-card-${index + 1}`,
            imageSrc,
            imageAlt,
            videoUrl,
            videoTitle,
            icon,
            title: cardTitle,
            quote,
            author,
          };
        })
        .filter((c): c is VideoStoryCardItemData => c !== null)
    : [];

  const hasContent = Boolean(title || eyebrow || description || cta || cards.length > 0);
  if (!hasContent) return null;

  return (
    <VideoStoryCardRow
      eyebrow={eyebrow || ''}
      title={title || ''}
      description={description || ''}
      cta={cta ?? null}
      cards={cards}
    />
  );
}

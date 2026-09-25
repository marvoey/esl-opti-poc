import React from 'react';
import type { ContentProps } from '@optimizely/cms-sdk';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import type { VideoStoryCardItemData } from '@/components/organisms/video-story-card-row/videoStoryCardRowData';
import { resolveMediaUrl } from '@/infrastructure/cms/mediaUrl';
import {
  StoreIcon,
  CarIcon,
  HomeIcon,
  PiggyBankIcon,
} from '@/components/atoms/icons';
import { EslVideoStoryCardRowContentType } from './EslVideoStoryCardRow';
import { EslVideoStoryCardContentType } from './EslVideoStoryCard';

export type EslVideoStoryCardData = Omit<
  Partial<ContentProps<typeof EslVideoStoryCardContentType>>,
  'quote'
> & {
  quote?:
    | Partial<NonNullable<ContentProps<typeof EslVideoStoryCardContentType>['quote']>>
    | { html?: string; json?: unknown }
    | string
    | null;
};

export type EslVideoStoryCardRowData = Omit<
  Partial<ContentProps<typeof EslVideoStoryCardRowContentType>>,
  'cards' | 'description'
> & {
  cards?: (EslVideoStoryCardData | null)[] | null;
  description?: Partial<NonNullable<ContentProps<typeof EslVideoStoryCardRowContentType>['description']>> | string | null;
  videoStoryDescription?: Partial<NonNullable<ContentProps<typeof EslVideoStoryCardRowContentType>['description']>> | string | null;
};

type LinkContent = NonNullable<EslVideoStoryCardRowData['cta']>;
type RichTextContent =
  | Partial<NonNullable<ContentProps<typeof EslVideoStoryCardRowContentType>['description']>>
  | { html?: string | null; json?: unknown }
  | string;

const ICON_MAP: Record<string, React.ReactNode> = {
  car: <CarIcon size={16} />,
  home: <HomeIcon size={16} />,
  'piggy-bank': <PiggyBankIcon size={16} />,
};

export function resolveCategoryIcon(iconKey?: string | null): React.ReactNode {
  const key = iconKey?.trim().toLowerCase();
  return (key && ICON_MAP[key]) || <StoreIcon size={16} />;
}

export function renderRichText(richTextObj?: RichTextContent | null): React.ReactNode {
  if (!richTextObj) return '';
  if (typeof richTextObj === 'string') return richTextObj;
  if ('json' in richTextObj && richTextObj.json) {
    return <RichText content={richTextObj.json as Parameters<typeof RichText>[0]['content']} />;
  }
  if ('html' in richTextObj && richTextObj.html) {
    return <div dangerouslySetInnerHTML={{ __html: richTextObj.html }} />;
  }
  return '';
}

export function resolveLink(linkObj?: LinkContent | null) {
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

function getAuthorInfo(card: EslVideoStoryCardData) {
  const authorName = card.authorName?.trim();
  if (!authorName) return '';
  return {
    name: authorName,
    role: card.authorRole?.trim() || undefined,
    location: card.authorLocation?.trim() || undefined,
  };
}

export function mapStoryCard(card: EslVideoStoryCardData, index: number): VideoStoryCardItemData | null {
  const imageSrc = resolveMediaUrl(card.image, { width: 500, quality: 80, format: 'auto' });
  if (!imageSrc) return null;

  const cardTitle = card.title?.trim() || '';
  const quote = renderRichText(card.quote);
  const imageAlt = card.imageAlt?.trim() || cardTitle || 'Testimonial story video thumbnail';

  return {
    id: `story-card-${index + 1}`,
    imageSrc,
    imageAlt,
    videoUrl: card.videoUrl?.trim() || undefined,
    videoTitle: card.videoTitle?.trim() || cardTitle || undefined,
    icon: resolveCategoryIcon(card.categoryIcon),
    title: cardTitle,
    quote,
    author: getAuthorInfo(card),
  };
}

export function mapVideoStoryCardRowProps(content: EslVideoStoryCardRowData) {
  const eyebrow = content.eyebrow?.trim() || '';
  const title = content.title?.trim() || '';
  const description = renderRichText(content.description || content.videoStoryDescription);

  const ctaResolved = resolveLink(content.cta);
  const cta =
    ctaResolved.label && ctaResolved.href
      ? {
          label: ctaResolved.label,
          href: ctaResolved.href,
          external: ctaResolved.external,
        }
      : null;

  const rawCards = content.cards;
  const cards: VideoStoryCardItemData[] = Array.isArray(rawCards)
    ? rawCards
        .filter((c): c is EslVideoStoryCardData => Boolean(c))
        .map(mapStoryCard)
        .filter((c): c is VideoStoryCardItemData => c !== null)
    : [];

  const hasContent = Boolean(title || eyebrow || description || cta || cards.length > 0);

  return {
    hasContent,
    props: {
      eyebrow,
      title,
      description: description || '',
      cta,
      cards,
    },
  };
}

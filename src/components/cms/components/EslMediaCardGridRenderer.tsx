import React from 'react';
import type { ContentProps } from '@optimizely/cms-sdk';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import {
  MediaCardGrid,
  type MediaCardItemData,
} from '@/components/organisms/media-card-grid/MediaCardGrid';
import type { BadgeVariant } from '@/components/atoms/badge/Badge';
import { resolveMediaUrl } from '@/infrastructure/cms/mediaUrl';
import { EslMediaCardGridContentType } from './EslMediaCardGrid';
import { EslMediaCardContentType } from './EslMediaCard';

type EslMediaCardData = Omit<
  Partial<ContentProps<typeof EslMediaCardContentType>>,
  'description'
> & {
  description?: Partial<NonNullable<ContentProps<typeof EslMediaCardContentType>['description']>> | string | null;
  mediaDescription?: Partial<NonNullable<ContentProps<typeof EslMediaCardContentType>['description']>> | string | null;
};

type EslMediaCardGridData = Omit<
  Partial<ContentProps<typeof EslMediaCardGridContentType>>,
  'cards'
> & {
  cards?: (EslMediaCardData | null)[] | null;
};

type Props = {
  content?: (EslMediaCardGridData & { component?: EslMediaCardGridData }) | null;
};

type LinkContent = NonNullable<EslMediaCardData['cta']>;
type RichTextContent = NonNullable<EslMediaCardData['description']>;

function renderDescription(descContent?: RichTextContent | string | null): React.ReactNode {
  if (!descContent) return '';
  if (typeof descContent === 'string') return descContent;
  if (
    descContent.json &&
    Array.isArray((descContent.json as { children?: unknown[] }).children) &&
    (descContent.json as { children?: unknown[] }).children!.length > 0
  ) {
    return <RichText content={descContent.json} />;
  }
  if (descContent.html) {
    return <div dangerouslySetInnerHTML={{ __html: descContent.html }} />;
  }
  if (descContent.json) {
    return <RichText content={descContent.json} />;
  }
  return '';
}

const VALID_BADGE_VARIANTS: readonly BadgeVariant[] = ['dark', 'aqua', 'neutral', 'teal-outline'];

function resolveBadgeVariant(variant?: string | null): BadgeVariant {
  if (variant && (VALID_BADGE_VARIANTS as readonly string[]).includes(variant)) {
    return variant as BadgeVariant;
  }
  return 'dark';
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


export default function EslMediaCardGridRenderer({ content }: Props) {
  if (!content) return null;

  const effectiveContent = content.component || content;

  const eyebrow = effectiveContent.eyebrow?.trim() || '';
  const title = effectiveContent.title?.trim() || '';

  const rawCards = effectiveContent.cards;
  const cards: MediaCardItemData[] = Array.isArray(rawCards)
    ? rawCards
        .filter((c): c is EslMediaCardData => Boolean(c))
        .map((card, index): MediaCardItemData | null => {
          const imageSrc = resolveMediaUrl(card.image, { width: 500, quality: 80, format: 'auto' });
          // Rule 4: All images are media assets from the CMS.
          // If no image is returned, do not fall back to local assets; do not show the card.
          if (!imageSrc) return null;

          const cardTitle = card.title?.trim() || '';
          const cardDesc = renderDescription(card.description || card.mediaDescription);
          const imageAlt = card.imageAlt?.trim() || cardTitle || 'Promotional offer';
          const badge = card.badge?.trim() ? card.badge.trim() : '';
          const badgeVariant = resolveBadgeVariant(card.badgeVariant);

          const ctaResolved = resolveLink(card.cta);
          const href = ctaResolved.href || undefined;
          const ctaText = href ? ctaResolved.label || 'Learn more' : undefined;
          const external = ctaResolved.external;

          return {
            id: `media-card-${index + 1}`,
            imageSrc,
            imageAlt,
            badge,
            badgeVariant,
            title: cardTitle,
            description: cardDesc,
            ctaText,
            href,
            external,
          };
        })
        .filter((c): c is MediaCardItemData => c !== null)
    : [];

  const hasContent = Boolean(title || eyebrow || cards.length > 0);
  if (!hasContent) return null;

  return (
    <MediaCardGrid
      eyebrow={eyebrow || ''}
      title={title || ''}
      cards={cards}
    />
  );
}

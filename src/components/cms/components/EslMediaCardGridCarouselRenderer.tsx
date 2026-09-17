import React from 'react';
import type { ContentProps } from '@optimizely/cms-sdk';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import {
  OfferCardRow,
  type OfferCardItemData,
} from '@/components/organisms/offer-card-row/OfferCardRow';
import type { BadgeVariant } from '@/components/atoms/badge/Badge';
import { resolveMediaUrl } from '@/infrastructure/cms/mediaUrl';
import { EslMediaCardGridCarouselContentType } from './EslMediaCardGridCarousel';
import { EslMediaCardContentType } from './EslMediaCard';

type EslMediaCardData = Omit<
  Partial<ContentProps<typeof EslMediaCardContentType>>,
  'description'
> & {
  description?: Partial<NonNullable<ContentProps<typeof EslMediaCardContentType>['description']>> | string | null;
  mediaDescription?: Partial<NonNullable<ContentProps<typeof EslMediaCardContentType>['description']>> | string | null;
};

type EslMediaCardGridCarouselData = Omit<
  Partial<ContentProps<typeof EslMediaCardGridCarouselContentType>>,
  'cards'
> & {
  cards?: (EslMediaCardData | null)[] | null;
};

type Props = {
  content?: (EslMediaCardGridCarouselData & { component?: EslMediaCardGridCarouselData }) | null;
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

export default function EslMediaCardGridCarouselRenderer({ content }: Props) {
  if (!content) return null;

  const effectiveContent = content.component || content;

  const eyebrow = effectiveContent.eyebrow?.trim() || '';
  const title = effectiveContent.title?.trim() || '';

  const rawCards = effectiveContent.cards;
  const cards: OfferCardItemData[] = Array.isArray(rawCards)
    ? rawCards
        .filter((c): c is EslMediaCardData => Boolean(c))
        .map((card, index): OfferCardItemData | null => {
          const imageSrc = resolveMediaUrl(card.image, { width: 500, quality: 80, format: 'auto' });
          // Rule 7: All images are media assets from the CMS.
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
            id: `media-card-carousel-${index + 1}`,
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
        .filter((c): c is OfferCardItemData => c !== null)
    : [];

  // If no cards are authored in CMS with valid media assets, do not show the component
  if (cards.length === 0) return null;

  return (
    <OfferCardRow
      eyebrow={eyebrow}
      title={title}
      cards={cards}
    />
  );
}

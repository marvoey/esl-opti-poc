import React from 'react';
import type { ContentProps } from '@optimizely/cms-sdk';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import { SplitContentCards } from '@/components/organisms/split-content-cards/SplitContentCards';
import type {
  SplitContentCardsHeroMetricData,
  SplitContentCardsStatItemData,
} from '@/components/organisms/split-content-cards/SplitContentCards';
import { resolveMediaUrl } from '@/infrastructure/cms/mediaUrl';
import { EslSplitContentCardsContentType } from './EslSplitContentCards';
import { EslStatCardContentType } from './EslStatCard';

type EslStatCardData = Partial<ContentProps<typeof EslStatCardContentType>>;

type EslSplitContentCardsData = Omit<
  Partial<ContentProps<typeof EslSplitContentCardsContentType>>,
  'statCards' | 'description'
> & {
  statCards?: (EslStatCardData | null)[] | null;
  description?: Partial<NonNullable<ContentProps<typeof EslSplitContentCardsContentType>['description']>> | string | null;
  splitDescription?: Partial<NonNullable<ContentProps<typeof EslSplitContentCardsContentType>['description']>> | string | null;
};

type Props = {
  content?: (EslSplitContentCardsData & { component?: EslSplitContentCardsData }) | null;
};

type LinkContent = NonNullable<EslSplitContentCardsData['cta']>;
type RichTextContent = NonNullable<EslSplitContentCardsData['description']>;

function renderDescription(descContent?: RichTextContent | string | null): React.ReactNode {
  if (!descContent) return null;
  if (typeof descContent === 'string') {
    const trimmed = descContent.trim();
    return trimmed ? trimmed : null;
  }
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
  return null;
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


export default function EslSplitContentCardsRenderer({ content }: Props) {
  if (!content) return null;

  const effectiveContent = content.component || content;

  const eyebrow = effectiveContent.eyebrow?.trim() || null;
  const title = effectiveContent.title?.trim() || '';
  const descriptionNode = renderDescription(effectiveContent.description || effectiveContent.splitDescription);
  const ctaResolved = resolveLink(effectiveContent.cta);
  const bgImageUrl = resolveMediaUrl(effectiveContent.backgroundImage, { width: 800, quality: 80, format: 'auto' });

  // Top Hero Metric Card
  const heroSubhead = effectiveContent.heroMetricSubhead?.trim() || '';
  const heroValue = effectiveContent.heroMetricValue?.trim() || '';
  const heroUnit = effectiveContent.heroMetricUnit?.trim() || '';
  const heroDescription = effectiveContent.heroMetricDescription?.trim() || '';

  const heroMetric: SplitContentCardsHeroMetricData | null =
    heroValue || heroSubhead || heroDescription
      ? {
          subhead: heroSubhead,
          value: heroValue,
          unit: heroUnit || undefined,
          description: heroDescription || undefined,
        }
      : null;

  // Bottom Dual Stat Cards
  const rawStatCards = effectiveContent.statCards;
  const statCards: SplitContentCardsStatItemData[] = Array.isArray(rawStatCards)
    ? rawStatCards
        .filter((s): s is EslStatCardData => Boolean(s))
        .map((stat, index) => ({
          id: `stat-card-${index + 1}`,
          value: stat.value?.trim() || '',
          label: stat.label?.trim() || '',
        }))
    : [];

  const cta =
    ctaResolved.label && ctaResolved.href
      ? {
          label: ctaResolved.label,
          href: ctaResolved.href,
          external: ctaResolved.external,
        }
      : null;

  const hasContent = Boolean(
    title ||
      eyebrow ||
      descriptionNode ||
      cta ||
      heroMetric ||
      statCards.length > 0 ||
      bgImageUrl
  );

  if (!hasContent) return null;

  return (
    <SplitContentCards
      eyebrow={eyebrow}
      title={title || undefined}
      description={descriptionNode}
      cta={cta}
      heroMetric={heroMetric}
      statCards={statCards}
      backgroundImage={bgImageUrl || undefined}
    />
  );
}

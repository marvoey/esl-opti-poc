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

function buildHeroMetric(content: EslSplitContentCardsData): SplitContentCardsHeroMetricData | null {
  const subhead = content.heroMetricSubhead?.trim() || '';
  const value = content.heroMetricValue?.trim() || '';
  const unit = content.heroMetricUnit?.trim() || '';
  const description = content.heroMetricDescription?.trim() || '';

  if (!value && !subhead && !description) {
    return null;
  }

  return {
    subhead,
    value,
    unit: unit || undefined,
    description: description || undefined,
  };
}

function buildStatCards(rawStatCards?: (EslStatCardData | null)[] | null): SplitContentCardsStatItemData[] {
  if (!Array.isArray(rawStatCards)) return [];
  return rawStatCards
    .filter((s): s is EslStatCardData => Boolean(s))
    .map((stat, index) => ({
      id: `stat-card-${index + 1}`,
      value: stat.value?.trim() || '',
      label: stat.label?.trim() || '',
      icon: (stat as { icon?: string | null })?.icon ?? (/satisfaction/i.test(stat.label ?? '') ? 'star' : undefined),
    }));
}

function buildCta(ctaContent?: LinkContent | null) {
  const resolved = resolveLink(ctaContent);
  if (!resolved.label || !resolved.href) return null;
  return resolved;
}

function mapSplitContentCardsProps(content: EslSplitContentCardsData) {
  const eyebrow = content.eyebrow?.trim() || null;
  const title = content.title?.trim() || '';
  const descriptionNode = renderDescription(content.description || content.splitDescription);
  const cta = buildCta(content.cta);
  const bgImageUrl = resolveMediaUrl(content.backgroundImage, { width: 800, quality: 80, format: 'auto' });
  const heroMetric = buildHeroMetric(content);
  const statCards = buildStatCards(content.statCards);

  const hasContent = Boolean(
    title ||
      eyebrow ||
      descriptionNode ||
      cta ||
      heroMetric ||
      statCards.length > 0 ||
      bgImageUrl
  );

  return {
    hasContent,
    props: {
      eyebrow,
      title: title || undefined,
      description: descriptionNode,
      cta,
      heroMetric,
      statCards,
      backgroundImage: bgImageUrl || undefined,
    },
  };
}

export default function EslSplitContentCardsRenderer({ content }: Props) {
  if (!content) return null;

  const effectiveContent = content.component || content;
  const { hasContent, props } = mapSplitContentCardsProps(effectiveContent);

  if (!hasContent) return null;

  return <SplitContentCards {...props} />;
}

import React from 'react';
import type { ContentProps } from '@optimizely/cms-sdk';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import {
  CircularImageMetricRow,
  type MetricItem,
} from '@/components/organisms/circular-image-metric-row/CircularImageMetricRow';
import { resolveMediaUrl } from '@/infrastructure/cms/mediaUrl';
import { EslCircularImageMetricRowContentType } from './EslCircularImageMetricRow';
import { EslCircularImageMetricItemContentType } from './EslCircularImageMetricItem';

type EslCircularImageMetricItemData = Partial<
  ContentProps<typeof EslCircularImageMetricItemContentType>
>;

type EslCircularImageMetricRowData = Omit<
  Partial<ContentProps<typeof EslCircularImageMetricRowContentType>>,
  'metrics' | 'description'
> & {
  metrics?: (EslCircularImageMetricItemData | null)[] | null;
  description?: Partial<NonNullable<ContentProps<typeof EslCircularImageMetricRowContentType>['description']>> | string | null;
  circularDescription?: Partial<NonNullable<ContentProps<typeof EslCircularImageMetricRowContentType>['description']>> | string | null;
};

type Props = {
  content?: (EslCircularImageMetricRowData & {
    component?: EslCircularImageMetricRowData;
  }) | null;
};

type LinkContent = NonNullable<EslCircularImageMetricRowData['cta']>;
type RichTextContent = NonNullable<EslCircularImageMetricRowData['description']>;

function extractPlainText(node: unknown): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) {
    return node.map(extractPlainText).join(' ').trim();
  }
  if (typeof node === 'object' && node !== null) {
    const obj = node as { text?: string; children?: unknown[] };
    if (typeof obj.text === 'string') return obj.text;
    if (Array.isArray(obj.children)) {
      return obj.children.map(extractPlainText).join(' ').trim();
    }
  }
  return '';
}

function renderRichText(descContent?: RichTextContent | string | null): React.ReactNode {
  if (!descContent) return '';
  if (typeof descContent === 'string') return descContent;
  if (descContent.json) {
    const plain = extractPlainText(descContent.json);
    if (plain) return plain;
    return <RichText content={descContent.json} />;
  }
  if (descContent.html) {
    const stripped = descContent.html.replace(/<\/?p[^>]*>/gi, '').trim();
    if (stripped) return stripped;
    return <div dangerouslySetInnerHTML={{ __html: descContent.html }} />;
  }
  return '';
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

export default function EslCircularImageMetricRowRenderer({ content }: Props) {
  if (!content) return null;

  const effectiveContent = content.component || content;

  const eyebrow = effectiveContent.eyebrow?.trim() || '';
  const title = effectiveContent.title?.trim() || '';
  const descriptionNode = renderRichText(
    effectiveContent.description || effectiveContent.circularDescription
  );

  const rawMetrics = effectiveContent.metrics;
  const metrics: MetricItem[] = Array.isArray(rawMetrics)
    ? rawMetrics
        .filter((item): item is EslCircularImageMetricItemData => Boolean(item))
        .map((item, index): MetricItem | null => {
          const imageSrc = resolveMediaUrl(item.image, {
            width: 360,
            quality: 80,
            format: 'auto',
          });
          // Strict Rule: Images must resolve from CMS media.
          // Incomplete items without an image are omitted.
          if (!imageSrc) return null;

          const stat = item.stat?.trim();
          const label = item.label?.trim();
          if (!stat || !label) return null;

          const imageAlt = item.imageAlt?.trim() || label || `Metric ${index + 1}`;

          return {
            id: `metric-${index + 1}`,
            image: {
              src: imageSrc,
              alt: imageAlt,
              width: 180,
              height: 180,
            },
            stat,
            label,
          };
        })
        .filter((item): item is MetricItem => item !== null)
    : [];

  // Strict Rule 3: No hardcoded content. If content is not present in CMS, do not show component.
  const hasContent = Boolean(
    (title || eyebrow || descriptionNode) && metrics.length > 0
  );
  if (!hasContent) return null;

  const ctaResolved = resolveLink(effectiveContent.cta);
  const cta =
    ctaResolved.label && ctaResolved.href
      ? {
          label: ctaResolved.label,
          href: ctaResolved.href,
          external: ctaResolved.external,
        }
      : undefined;

  return (
    <CircularImageMetricRow
      eyebrow={eyebrow}
      title={title}
      description={descriptionNode as unknown as string}
      cta={cta}
      metrics={metrics}
    />
  );
}

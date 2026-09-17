import React from 'react';
import type { ContentProps } from '@optimizely/cms-sdk';
import {
  SplitContentImage,
  type SplitContentImageCta,
} from '@/components/organisms/split-content-image/SplitContentImage';
import { resolveMediaUrl } from '@/infrastructure/cms/mediaUrl';
import { EslSplitContentImageContentType } from './EslSplitContentImage';

type EslSplitContentImageData = Omit<
  Partial<ContentProps<typeof EslSplitContentImageContentType>>,
  'description'
> & {
  description?: Partial<NonNullable<ContentProps<typeof EslSplitContentImageContentType>['description']>> | string | null;
  splitImageDescription?: Partial<NonNullable<ContentProps<typeof EslSplitContentImageContentType>['description']>> | string | null;
};

type Props = {
  content?: (EslSplitContentImageData & {
    component?: EslSplitContentImageData;
  }) | null;
};

type LinkContent = NonNullable<EslSplitContentImageData['primaryCta']>;
type RichTextContent = NonNullable<EslSplitContentImageData['description']>;

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

function renderDescription(descContent?: RichTextContent | string | null): string {
  if (!descContent) return '';
  if (typeof descContent === 'string') return descContent.trim();
  if (descContent.json) {
    const plain = extractPlainText(descContent.json);
    if (plain) return plain;
  }
  if (descContent.html) {
    const stripped = descContent.html.replace(/<\/?p[^>]*>/gi, '').trim();
    if (stripped) return stripped;
  }
  return '';
}

function resolveLink(linkObj?: LinkContent | null): SplitContentImageCta | null {
  if (!linkObj) return null;
  const label = (linkObj.text || linkObj.title || '').trim();
  const rawUrl =
    linkObj.url?.default ||
    linkObj.url?.hierarchical ||
    linkObj.url?.base ||
    '';
  const href = rawUrl.trim();
  if (!label || !href) return null;

  const rawTarget = linkObj.target?.trim().toLowerCase() || '';
  const external = rawTarget === '_blank';

  return { label, href, external };
}

export default function EslSplitContentImageRenderer({ content }: Props) {
  if (!content) return null;

  const effectiveContent = content.component || content;

  const title = effectiveContent.title?.trim() || '';
  const description = renderDescription(
    effectiveContent.description || effectiveContent.splitImageDescription
  );

  const primaryCta = resolveLink(effectiveContent.primaryCta);
  const secondaryCta = resolveLink(effectiveContent.secondaryCta);

  const imageSrc = resolveMediaUrl(effectiveContent.image, {
    width: 933,
    quality: 80,
    format: 'auto',
  });

  // Strict Rule 3: No hardcoded content. If required content is not present in CMS, do not show component.
  if (!title || !description || !primaryCta || !secondaryCta || !imageSrc) {
    return null;
  }

  const imageAlt =
    effectiveContent.imageAlt?.trim() ||
    title ||
    'Diverse ESL members and families representing the community';

  const eligibilityNote = effectiveContent.eligibilityNote?.trim() || undefined;

  return (
    <SplitContentImage
      id="split-content-image"
      title={title}
      description={description}
      primaryCta={primaryCta}
      secondaryCta={secondaryCta}
      eligibilityNote={eligibilityNote}
      image={{
        src: imageSrc,
        alt: imageAlt,
        width: 933,
        height: 1024,
      }}
    />
  );
}

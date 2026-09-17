import React from 'react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import { SideBySide } from '@/components/organisms/side-by-side/SideBySide';
import { resolveMediaUrl } from '@/infrastructure/cms/mediaUrl';
import styles from './EslSideBySide.module.css';

export const EslSideBySideContentType = contentType({
  key: 'EslSideBySide',
  displayName: 'ESL Side By Side',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    eyebrow: {
      type: 'string',
      displayName: 'Eyebrow Text',
      group: 'content',
      sortOrder: 10,
    },
    headline: {
      type: 'string',
      displayName: 'Headline',
      group: 'content',
      sortOrder: 20,
    },
    body: {
      type: 'richText',
      displayName: 'Body Copy',
      group: 'content',
      sortOrder: 30,
      editorSettings: {
        preset: 'default',
      },
    },
    image: {
      type: 'contentReference',
      displayName: 'Image',
      group: 'content',
      sortOrder: 40,
      allowedTypes: ['_image'],
    },
    imageAlt: {
      type: 'string',
      displayName: 'Image Alt Text',
      group: 'content',
      sortOrder: 45,
    },
    cta: {
      type: 'link',
      displayName: 'Call to Action (Button)',
      group: 'content',
      sortOrder: 50,
    },
    imagePosition: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Image Position',
      group: 'content',
      sortOrder: 60,
      enum: [
        { value: 'right', displayName: 'Right' },
        { value: 'left', displayName: 'Left' },
      ],
    },
    colorVariant: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Color Variant',
      group: 'content',
      sortOrder: 70,
      enum: [
        { value: 'dark', displayName: 'Dark (Navy)' },
        { value: 'light', displayName: 'Light (White)' },
      ],
    },
  },
});

type EslSideBySideData = Partial<ContentProps<typeof EslSideBySideContentType>>;

type Props = {
  content?: (EslSideBySideData & { component?: EslSideBySideData }) | null;
};

type LinkContent = NonNullable<EslSideBySideData>['cta'];
type RichTextContent = NonNullable<EslSideBySideData>['body'];

function renderBody(bodyContent?: RichTextContent | string | null): React.ReactNode {
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

function resolveMediaAlt(
  content: EslSideBySideData,
  fallback: string = ''
): string {
  const directAlt = content.imageAlt?.trim();
  if (directAlt) return directAlt;

  const item = content.image?.item;
  if (item && 'AltText' in item && typeof item.AltText === 'string' && item.AltText) {
    return item.AltText;
  }
  if (item?.Title) return item.Title;
  return fallback;
}

function resolveLink(linkObj?: LinkContent | null) {
  if (!linkObj) return { text: '', url: '', isExternal: false };
  const text = linkObj.text || linkObj.title || '';
  const rawUrl =
    linkObj.url?.default ||
    linkObj.url?.hierarchical ||
    linkObj.url?.base ||
    '';
  const url = rawUrl.trim();

  const rawTarget = linkObj.target?.trim().toLowerCase() || '';
  const isExternal = rawTarget === '_blank';

  return { text, url, isExternal };
}

export default function EslSideBySide({ content }: Props) {
  if (!content) return null;

  const effectiveContent = content.component || content;

  const headline = effectiveContent.headline?.trim() || '';
  const eyebrow = effectiveContent.eyebrow?.trim() || '';
  const body = renderBody(effectiveContent.body);
  const imageSrc = resolveMediaUrl(effectiveContent.image, { width: 700, quality: 80, format: 'auto' });
  const imageAlt = resolveMediaAlt(effectiveContent, headline);
  const { text: ctaLabel, url: ctaUrl, isExternal: ctaExternal } = resolveLink(
    effectiveContent.cta
  );

  // Require minimum viable content or return null cleanly
  const hasContent = Boolean(headline || eyebrow || body || ctaLabel || imageSrc);
  if (!hasContent) return null;

  // Independent color theme:
  // - "light": White background, dark text
  // - "dark": Navy background, white text (default)
  const isLight = effectiveContent.colorVariant === 'light';
  const resolvedVariant: 'dark' | 'light' = isLight ? 'light' : 'dark';

  // Independent visual layout (image position):
  // - "left": image on the left, text on the right
  // - "right": image on the right, text on the left (default)
  const isImageLeft = effectiveContent.imagePosition === 'left';
  const positionClass = isImageLeft ? styles.imageLeft : styles.imageRight;

  return (
    <SideBySide
      eyebrow={eyebrow}
      headline={headline}
      body={body}
      ctaLabel={ctaLabel}
      ctaUrl={ctaUrl}
      ctaExternal={ctaExternal}
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      variant={resolvedVariant}
      className={positionClass}
    />
  );
}

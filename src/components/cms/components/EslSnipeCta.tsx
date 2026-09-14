import React from 'react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { SnipeCta } from '@/components/organisms/snipe-cta/SnipeCta';

export const EslSnipeCtaContentType = contentType({
  key: 'EslSnipeCta',
  displayName: 'ESL Snipe CTA',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    title: {
      type: 'string',
      displayName: 'Title',
      group: 'content',
      sortOrder: 10,
    },
    description: {
      type: 'string',
      displayName: 'Description',
      group: 'content',
      sortOrder: 20,
    },
    link: {
      type: 'link',
      displayName: 'Link',
      group: 'content',
      sortOrder: 30,
    },
  },
});

type EslSnipeCtaData = Partial<ContentProps<typeof EslSnipeCtaContentType>>;

type Props = {
  content?: (EslSnipeCtaData & { component?: EslSnipeCtaData }) | null;
};

type LinkContent = NonNullable<EslSnipeCtaData>['link'];

function resolveLink(linkObj?: LinkContent | null) {
  if (!linkObj) return { text: '', url: undefined, target: undefined, rel: undefined };
  const text = linkObj.text || linkObj.title || '';
  const rawUrl =
    linkObj.url?.default ||
    linkObj.url?.hierarchical ||
    linkObj.url?.base ||
    '';
  const url = rawUrl.trim() ? rawUrl.trim() : undefined;

  const rawTarget = linkObj.target?.trim().toLowerCase() || '';
  const isBlank = rawTarget === '_blank';
  const target = isBlank ? '_blank' : undefined;
  const rel = isBlank ? 'noopener noreferrer' : undefined;

  return { text, url, target, rel };
}

export default function EslSnipeCta({ content }: Props) {
  if (!content) return null;

  const effectiveContent = content.component || content;
  const snipeLink = resolveLink(effectiveContent.link);
  const hasContent = Boolean(
    effectiveContent.title || effectiveContent.description || snipeLink.text || snipeLink.url
  );

  if (!hasContent) return null;

  return (
    <SnipeCta
      title={effectiveContent.title ?? undefined}
      description={effectiveContent.description ?? undefined}
      linkLabel={snipeLink.text}
      linkHref={snipeLink.url}
      linkTarget={snipeLink.target}
      linkRel={snipeLink.rel}
    />
  );
}

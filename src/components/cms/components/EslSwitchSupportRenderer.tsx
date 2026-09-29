import React from 'react';
import { RichText } from '@optimizely/cms-sdk/react/richText';
import { SwitchSupport, type SwitchSupportStep } from '@/components/organisms/switch-support';
import type { EslSwitchSupportData } from './EslSwitchSupport';

type RichTextNode = Parameters<typeof RichText>[0]['content'];

type RichTextPayload = {
  html?: string | null;
  json?: RichTextNode | null;
  [key: string]: unknown;
};

type StepItemInput = {
  _id?: string | null;
  id?: string | null;
  step?: number | null;
  title?: string | null;
  description?: RichTextPayload | string | null;
  component?: {
    _id?: string | null;
    id?: string | null;
    step?: number | null;
    title?: string | null;
    description?: RichTextPayload | string | null;
  } | null;
};

type LinkPayload = {
  text?: string | null;
  title?: string | null;
  target?: string | null;
  url?: {
    default?: string | null;
    hierarchical?: string | null;
    base?: string | null;
    [key: string]: unknown;
  } | null;
};

export type EslSwitchSupportComponentData = {
  eyebrow?: string | null;
  title?: string | null;
  description?: RichTextPayload | string | null;
  switchDescription?: RichTextPayload | string | null;
  steps?: Array<StepItemInput | null> | null;
  cta?: LinkPayload | null;
  link?: LinkPayload | null;
  component?: EslSwitchSupportComponentData | null;
  [key: string]: unknown;
};

type Props = {
  content?: EslSwitchSupportComponentData | EslSwitchSupportData | null;
  id?: string;
};

function renderRichText(content?: RichTextPayload | string | null): React.ReactNode {
  if (!content) return null;
  if (typeof content === 'string') return content;
  if (content.json) {
    return <RichText content={content.json} />;
  }
  if (content.html) {
    return <div dangerouslySetInnerHTML={{ __html: content.html }} />;
  }
  return null;
}

function resolveLink(linkObj?: LinkPayload | null) {
  if (!linkObj) return { text: '', url: '' };
  const text = linkObj.text || linkObj.title || '';
  const rawUrl =
    linkObj.url?.default ||
    linkObj.url?.hierarchical ||
    linkObj.url?.base ||
    '';
  return { text: text.trim(), url: rawUrl.trim() };
}

function mapProps(content: Props['content']): {
  eyebrow?: string;
  title?: string;
  description?: React.ReactNode;
  steps: SwitchSupportStep[];
  ctaLabel?: string;
  ctaHref?: string;
  linkLabel?: string;
  linkHref?: string;
} | null {
  if (!content) return null;

  const effectiveContent = (content && 'component' in content && content.component
    ? content.component
    : content) as EslSwitchSupportComponentData;

  const eyebrow = effectiveContent.eyebrow?.trim() || undefined;
  const title = effectiveContent.title?.trim() || undefined;
  const description =
    renderRichText(effectiveContent.description || effectiveContent.switchDescription) || undefined;

  const rawSteps = effectiveContent.steps;
  const mappedSteps: SwitchSupportStep[] = [];

  if (Array.isArray(rawSteps)) {
    for (let idx = 0; idx < rawSteps.length; idx++) {
      const rawStep = rawSteps[idx];
      if (!rawStep) continue;

      const item = (rawStep && 'component' in rawStep && rawStep.component
        ? rawStep.component
        : rawStep) as StepItemInput;

      const stepNumber = typeof item.step === 'number' ? item.step : idx + 1;
      const stepTitle = item.title?.trim() || '';
      const stepDesc = renderRichText(item.description) || '';

      if (!stepTitle && !stepDesc) continue;

      mappedSteps.push({
        id: item.id || item._id || `switch-step-${idx + 1}`,
        step: stepNumber,
        title: stepTitle,
        description: stepDesc,
      });
    }
  }

  const { text: ctaLabel, url: ctaHref } = resolveLink(effectiveContent.cta);
  const { text: linkLabel, url: linkHref } = resolveLink(effectiveContent.link);

  const hasContent = Boolean(
    eyebrow ||
    title ||
    description ||
    mappedSteps.length > 0 ||
    (ctaLabel && ctaHref) ||
    (linkLabel && linkHref)
  );

  if (!hasContent) {
    return null;
  }

  return {
    eyebrow,
    title,
    description,
    steps: mappedSteps,
    ctaLabel: ctaLabel || undefined,
    ctaHref: ctaHref || undefined,
    linkLabel: linkLabel || undefined,
    linkHref: linkHref || undefined,
  };
}

export default function EslSwitchSupport({ content, id = 'switch-support' }: Props) {
  const props = mapProps(content);
  if (!props) return null;

  return (
    <SwitchSupport
      id={id}
      eyebrow={props.eyebrow}
      title={props.title}
      description={props.description}
      steps={props.steps}
      ctaLabel={props.ctaLabel}
      ctaHref={props.ctaHref}
      linkLabel={props.linkLabel}
      linkHref={props.linkHref}
    />
  );
}

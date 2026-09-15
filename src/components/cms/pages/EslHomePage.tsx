import React from 'react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import {
  OptimizelyComposition,
  getPreviewUtils,
  type ComponentContainerProps,
} from '@optimizely/cms-sdk/react/server';
import EslHeroSlider, { EslHeroSliderContentType } from '@/components/cms/components/EslHeroSlider';
import EslSnipeCta, { EslSnipeCtaContentType } from '@/components/cms/components/EslSnipeCta';
import EslTabbedSolutions, { EslTabbedSolutionsContentType } from '@/components/cms/components/EslTabbedSolutions';

function ExperienceComponentWrapper({ children, node, displaySettings }: ComponentContainerProps) {
  const { pa } = getPreviewUtils(node);
  const componentType = node.component?.__typename || node.type || '';
  const childrenWithProps =
    React.isValidElement<{ displaySettings?: Record<string, string | boolean> }>(children) && displaySettings
      ? React.cloneElement(children, { displaySettings })
      : children;

  return (
    <div
      {...pa(node)}
      data-component-type={componentType}
      style={{ width: '100%', display: 'block' }}
    >
      {childrenWithProps}
    </div>
  );
}

// 1. The new Visual Builder Experience
export const EslHomePageContentType = contentType({
  key: 'EslHomeExperience',
  displayName: 'ESL Home Experience',
  baseType: '_experience',
  mayContainTypes: [
    'EslHeroSlider',
    'EslSnipeCta',
    'EslTabbedSolutions',
    'EslSideBySide',
    'EslMetricCardRow',
    'EslSplitContentCards',
  ],
});

// 2. Legacy fallback definition so existing CMS page previews never 404
export const LegacyEslHomePageContentType = contentType({
  key: 'EslHomePage',
  displayName: 'ESL Home Page (Legacy)',
  baseType: '_page',
  mayContainTypes: ['*'],
});

type Props = {
  content?: ContentProps<typeof EslHomePageContentType> & {
    heroSlider?: ContentProps<typeof EslHeroSliderContentType>;
    snipeCta?: ContentProps<typeof EslSnipeCtaContentType>;
    showExploreSolutions?: boolean;
  };
};

export default function EslHomePage({ content }: Props) {
  const nodes = content?.composition?.nodes;

  // 1. If Visual Builder composition nodes are present, render them in visual order
  if (nodes && nodes.length > 0) {
    return (
      <>
        <OptimizelyComposition nodes={nodes} ComponentWrapper={ExperienceComponentWrapper} />
      </>
    );
  }

  // 2. Graceful fallback for empty experience or legacy data
  return (
    <>
      <EslHeroSlider content={content?.heroSlider ? { slides: content.heroSlider.slides } : undefined} />
      <EslSnipeCta
        content={
          content?.snipeCta || {
            title: 'Can you join?',
            description: 'If you live, work, worship or attend school in our region - yes!',
            link: {
              text: 'Check your eligibility',
              url: { type: null, graph: null, default: '/eligibility', hierarchical: null, base: null, internal: null },
              target: '_top',
              title: null,
            },
          }
        }
      />
      {content?.showExploreSolutions !== false && (
        <EslTabbedSolutions content={{ showExploreSolutions: true }} />
      )}
    </>
  );
}

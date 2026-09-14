import React from 'react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComposition } from '@optimizely/cms-sdk/react/server';
import EslHeroSlider, { EslHeroSliderContentType } from '@/components/cms/components/EslHeroSlider';
import EslSnipeCta, { EslSnipeCtaContentType } from '@/components/cms/components/EslSnipeCta';
import EslTabbedSolutions, { EslTabbedSolutionsContentType } from '@/components/cms/components/EslTabbedSolutions';

// 1. The new Visual Builder Experience
export const EslHomePageContentType = contentType({
  key: 'EslHomeExperience',
  displayName: 'ESL Home Experience',
  baseType: '_experience',
  mayContainTypes: [
    'EslHeroSlider',
    'EslSnipeCta',
    'EslTabbedSolutions',
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
        <OptimizelyComposition nodes={nodes} />
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

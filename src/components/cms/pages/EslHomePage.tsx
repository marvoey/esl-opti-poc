import React from 'react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import {
  OptimizelyComposition,
  getPreviewUtils,
  type ComponentContainerProps,
} from '@optimizely/cms-sdk/react/server';

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

// 1. The Visual Builder Experience
export const EslHomeExperienceContentType = contentType({
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
    'EslMediaCardGrid',
    'EslVideoStoryCardRow',
    'EslVerticalSelectorFeatureCard',
    'EslCircularImageMetricRow',
    'EslSplitContentImage',
    'EslMediaCardGridCarousel',
  ],
});


type Props = {
  content?: ContentProps<typeof EslHomeExperienceContentType>;
};

export default function EslHomeExperience({ content }: Props) {
  const nodes = content?.composition?.nodes;

  if (!nodes || nodes.length === 0) {
    return null;
  }

  return (
    <OptimizelyComposition nodes={nodes} ComponentWrapper={ExperienceComponentWrapper} />
  );
}

export { EslHomeExperience as EslHomePage };


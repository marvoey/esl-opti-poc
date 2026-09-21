import { contentType } from '@optimizely/cms-sdk';

export const EslHomeExperienceContentType = contentType({
  key: 'EslHomeExperience',
  displayName: 'ESL Home Experience',
  baseType: '_experience',
  mayContainTypes: [
    'EslProductDetailExperience',
    'EslProductFamilyExperience',
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

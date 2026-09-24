import { contentType } from '@optimizely/cms-sdk';

export const EslHomeExperienceContentType = contentType({
  key: 'EslHomeExperience',
  displayName: 'ESL Home Experience',
  baseType: '_experience',
  mayContainTypes: [
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

export const EslHomePageContentType = contentType({
  key: 'EslHomePage',
  displayName: 'ESL Home Page (Legacy)',
  baseType: '_page',
  mayContainTypes: ['*'],
});

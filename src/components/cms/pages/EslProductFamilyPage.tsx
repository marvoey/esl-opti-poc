import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslProductFamilyExperienceContentType = contentType({
  key: 'EslProductFamilyExperience',
  displayName: 'ESL Product Family Experience',
  baseType: '_experience',
  mayContainTypes: [
    'EslHeroSlider',
    'EslSnipeCta',
    'EslKeyFactsRow',
  ],
});

export type EslProductFamilyExperienceData = Partial<ContentProps<typeof EslProductFamilyExperienceContentType>>;

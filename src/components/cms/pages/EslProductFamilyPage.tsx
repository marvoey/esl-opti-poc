import { contentType } from '@optimizely/cms-sdk';

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

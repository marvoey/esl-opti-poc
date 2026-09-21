import { contentType } from '@optimizely/cms-sdk';

export const EslProductDetailExperienceContentType = contentType({
  key: 'EslProductDetailExperience',
  displayName: 'ESL Product Detail Experience',
  baseType: '_experience',
  mayContainTypes: [
    'EslHeroSlider',
    'EslSnipeCta',
    'EslKeyFactsRow',
    'EslProductCardsRow',
    'EslProductCardsRowVariant2',
    'EslSwitchSupport',
    'EslDisclosure',
    'EslFaqStates',
  ],
});

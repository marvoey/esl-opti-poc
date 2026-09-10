import { buildConfig } from '@optimizely/cms-sdk';

export default buildConfig({
  components: ['./src/components/cms/**/*.tsx'],
  propertyGroups: [
    {
      key: 'heroSlider',
      displayName: 'Hero Slider',
      sortOrder: 10,
    },
    {
      key: 'snipeCta',
      displayName: 'Snipe CTA Banner',
      sortOrder: 20,
    },
  ],
});

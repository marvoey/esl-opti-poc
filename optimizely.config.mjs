import { buildConfig } from '@optimizely/cms-sdk';

export default buildConfig({
  components: [
    './src/components/cms/**/*.tsx',
    '!./src/components/cms/**/*.test.tsx',
    '!./src/components/cms/**/*Renderer.tsx',
  ],
  propertyGroups: [
    {
      key: 'heroSlider',
      displayName: 'Hero Slider',
      sortOrder: -10,
    },
    {
      key: 'header',
      displayName: 'Header',
      sortOrder: 10,
    },
    {
      key: 'footer',
      displayName: 'Footer',
      sortOrder: 20,
    },
    {
      key: 'seo',
      displayName: 'SEO',
      sortOrder: 30,
    },
  ],
});

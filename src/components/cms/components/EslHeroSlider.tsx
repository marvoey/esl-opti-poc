import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslHeroSlideContentType } from './EslHeroSlide';

export const EslHeroSliderContentType = contentType({
  key: 'EslHeroSlider',
  displayName: 'ESL Hero Slider',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    slides: {
      type: 'array',
      displayName: 'Slides',
      group: 'content',
      items: {
        type: 'component',
        contentType: EslHeroSlideContentType,
      },
    },
  },
});

export type EslHeroSliderData = Partial<ContentProps<typeof EslHeroSliderContentType>>;

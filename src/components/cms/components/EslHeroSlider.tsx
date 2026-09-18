import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslHeroSlideContentType } from './EslHeroSlide';

export const EslHeroSliderContentType = contentType({
  key: 'EslHeroSlider',
  displayName: 'ESL Hero Slider',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    variant: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Variant',
      group: 'content',
      sortOrder: 10,
      enum: [
        { value: 'circled', displayName: 'Circled' },
        { value: 'squared', displayName: 'Squared' },
      ],
    },
    slides: {
      type: 'array',
      displayName: 'Slides',
      group: 'content',
      sortOrder: 20,
      items: {
        type: 'component',
        contentType: EslHeroSlideContentType,
      },
    },
  },
});

export type EslHeroSliderData = Partial<ContentProps<typeof EslHeroSliderContentType>>;

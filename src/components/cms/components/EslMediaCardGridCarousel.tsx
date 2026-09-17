import { contentType } from '@optimizely/cms-sdk';
import { EslMediaCardContentType } from './EslMediaCard';

export const EslMediaCardGridCarouselContentType = contentType({
  key: 'EslMediaCardGridCarousel',
  displayName: 'ESL Media Card Grid Carousel',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    eyebrow: {
      type: 'string',
      displayName: 'Eyebrow Text',
      group: 'content',
      sortOrder: 10,
    },
    title: {
      type: 'string',
      displayName: 'Heading Title',
      group: 'content',
      sortOrder: 20,
    },
    cards: {
      type: 'array',
      displayName: 'Media Cards',
      group: 'content',
      sortOrder: 30,
      items: {
        type: 'component',
        contentType: EslMediaCardContentType,
      },
    },
  },
});

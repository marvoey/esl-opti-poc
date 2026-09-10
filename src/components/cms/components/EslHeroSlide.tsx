import { contentType } from '@optimizely/cms-sdk';

export const EslHeroSlideContentType = contentType({
  key: 'EslHeroSlide',
  displayName: 'ESL Hero Slide',
  baseType: '_component',
  properties: {
    eyebrow: {
      type: 'string',
      displayName: 'Eyebrow Text',
      group: 'content',
      sortOrder: 10,
    },
    heading: {
      type: 'string',
      displayName: 'Slide Heading',
      group: 'content',
      sortOrder: 20,
    },
    body: {
      type: 'richText',
      displayName: 'Body Copy',
      group: 'content',
      sortOrder: 30,
      editorSettings: {
        preset: 'default',
      },
    },
    image: {
      type: 'contentReference',
      displayName: 'Slide Image',
      group: 'content',
      sortOrder: 35,
      allowedTypes: ['_image'],
    },
    imageAlt: {
      type: 'string',
      displayName: 'Image Alt Text',
      group: 'content',
      sortOrder: 36,
    },
    primaryCta: {
      type: 'link',
      displayName: 'Primary CTA Link',
      group: 'content',
      sortOrder: 40,
    },
    secondaryCta: {
      type: 'link',
      displayName: 'Secondary CTA Link',
      group: 'content',
      sortOrder: 50,
    },
    badgeStat: {
      type: 'string',
      displayName: 'Badge Stat (e.g. 100%)',
      group: 'content',
      sortOrder: 60,
    },
    badgeLabel: {
      type: 'string',
      displayName: 'Badge Label (e.g. Peace of mind)',
      group: 'content',
      sortOrder: 70,
    },
  },
});

import { contentType } from '@optimizely/cms-sdk';

export const EslMediaCardContentType = contentType({
  key: 'EslMediaCard',
  displayName: 'ESL Media Card',
  baseType: '_component',
  properties: {
    image: {
      type: 'contentReference',
      displayName: 'Card Media Image',
      group: 'content',
      sortOrder: 10,
      allowedTypes: ['_image'],
    },
    imageAlt: {
      type: 'string',
      displayName: 'Image Alt Text',
      group: 'content',
      sortOrder: 15,
    },
    badge: {
      type: 'string',
      displayName: 'Eyebrow',
      group: 'content',
      sortOrder: 20,
    },
    badgeVariant: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Badge Variant',
      group: 'content',
      sortOrder: 25,
      enum: [
        { value: 'dark', displayName: 'Dark (Navy Surface)' },
        { value: 'aqua', displayName: 'Aqua' },
        { value: 'neutral', displayName: 'Neutral' },
        { value: 'teal-outline', displayName: 'Teal Outline' },
      ],
    },
    title: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 30,
    },
    description: {
      type: 'richText',
      displayName: 'Copy',
      group: 'content',
      sortOrder: 40,
      editorSettings: {
        preset: 'default',
      },
    },
    cta: {
      type: 'link',
      displayName: 'CTA Link',
      group: 'content',
      sortOrder: 50,
    },
  },
});

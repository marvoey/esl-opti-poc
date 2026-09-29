import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslSideBySideContentType = contentType({
  key: 'EslSideBySide',
  displayName: 'ESL Side By Side',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    eyebrow: {
      type: 'string',
      displayName: 'Eyebrow',
      group: 'content',
      sortOrder: 10,
    },
    headline: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 20,
    },
    body: {
      type: 'richText',
      displayName: 'Copy',
      group: 'content',
      sortOrder: 30,
      editorSettings: {
        preset: 'default',
      },
    },
    image: {
      type: 'contentReference',
      displayName: 'Image',
      group: 'content',
      sortOrder: 40,
      allowedTypes: ['_image'],
    },
    imageAlt: {
      type: 'string',
      displayName: 'Image Alt Text',
      group: 'content',
      sortOrder: 45,
    },
    cta: {
      type: 'link',
      displayName: 'CTA Link',
      group: 'content',
      sortOrder: 50,
    },
    imagePosition: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Image Position',
      group: 'content',
      sortOrder: 60,
      enum: [
        { value: 'right', displayName: 'Right' },
        { value: 'left', displayName: 'Left' },
      ],
    },
    colorVariant: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Color Variant',
      group: 'content',
      sortOrder: 70,
      enum: [
        { value: 'dark', displayName: 'Dark (Navy)' },
        { value: 'light', displayName: 'Light (White)' },
      ],
    },
  },
});

export type EslSideBySideData = Partial<ContentProps<typeof EslSideBySideContentType>>;

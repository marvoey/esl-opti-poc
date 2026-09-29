import { contentType } from '@optimizely/cms-sdk';

export const EslSplitContentImageContentType = contentType({
  key: 'EslSplitContentImage',
  displayName: 'ESL Split Content Image',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    title: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 10,
    },
    description: {
      type: 'richText',
      displayName: 'Copy',
      group: 'content',
      sortOrder: 20,
      editorSettings: {
        preset: 'default',
      },
    },
    primaryCta: {
      type: 'link',
      displayName: 'Primary CTA Link',
      group: 'content',
      sortOrder: 30,
    },
    secondaryCta: {
      type: 'link',
      displayName: 'Secondary CTA Link',
      group: 'content',
      sortOrder: 40,
    },
    eligibilityNote: {
      type: 'string',
      displayName: 'Eligibility Note (Optional)',
      group: 'content',
      sortOrder: 50,
    },
    image: {
      type: 'contentReference',
      displayName: 'Collage / Banner Image',
      group: 'content',
      sortOrder: 60,
      allowedTypes: ['_image'],
    },
    imageAlt: {
      type: 'string',
      displayName: 'Image Alt Text',
      group: 'content',
      sortOrder: 70,
    },
  },
});

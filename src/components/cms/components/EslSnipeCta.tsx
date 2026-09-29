import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslSnipeCtaContentType = contentType({
  key: 'EslSnipeCta',
  displayName: 'ESL Snipe CTA',
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
      type: 'string',
      displayName: 'Copy',
      group: 'content',
      sortOrder: 20,
    },
    link: {
      type: 'link',
      displayName: 'CTA Link',
      group: 'content',
      sortOrder: 30,
    },
  },
});

export type EslSnipeCtaData = Partial<ContentProps<typeof EslSnipeCtaContentType>>;

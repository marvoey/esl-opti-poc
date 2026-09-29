import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslFinalCtaContentType = contentType({
  key: 'EslFinalCta',
  displayName: 'ESL Final CTA',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    showFinalCta: {
      type: 'boolean',
      displayName: 'Show Final CTA',
      group: 'content',
      sortOrder: 10,
    },
    heading: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 20,
    },
  },
});

export type EslFinalCtaData = Partial<
  ContentProps<typeof EslFinalCtaContentType>
>;

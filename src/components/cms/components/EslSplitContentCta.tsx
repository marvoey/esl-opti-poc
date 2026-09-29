import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslSplitContentCtaContentType = contentType({
  key: 'EslSplitContentCta',
  displayName: 'ESL Split Content CTA',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    showSplitContentCta: {
      type: 'boolean',
      displayName: 'Show Split Content CTA',
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

export type EslSplitContentCtaData = Partial<
  ContentProps<typeof EslSplitContentCtaContentType>
>;

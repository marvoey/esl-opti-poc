import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslFeatureCardRowContentType = contentType({
  key: 'EslFeatureCardRow',
  displayName: 'ESL Feature Card Row',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    showFeatureCardRow: {
      type: 'boolean',
      displayName: 'Show Feature Card Row',
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

export type EslFeatureCardRowData = Partial<
  ContentProps<typeof EslFeatureCardRowContentType>
>;

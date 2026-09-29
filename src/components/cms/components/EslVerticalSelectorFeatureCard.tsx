import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslVerticalSelectorFeatureCardContentType = contentType({
  key: 'EslVerticalSelectorFeatureCard',
  displayName: 'ESL Vertical Selector Feature Card',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    showVerticalSelector: {
      type: 'boolean',
      displayName: 'Show Vertical Selector Feature Card',
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

export type EslVerticalSelectorFeatureCardData = Partial<
  ContentProps<typeof EslVerticalSelectorFeatureCardContentType>
>;

import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslLearningHubContentType = contentType({
  key: 'EslLearningHub',
  displayName: 'ESL Learning Hub',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    showLearningHub: {
      type: 'boolean',
      displayName: 'Show Learning Hub',
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

export type EslLearningHubData = Partial<
  ContentProps<typeof EslLearningHubContentType>
>;

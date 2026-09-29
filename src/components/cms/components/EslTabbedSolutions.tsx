import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslTabbedSolutionsContentType = contentType({
  key: 'EslTabbedSolutions',
  displayName: 'ESL Explore Solutions',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    showExploreSolutions: {
      type: 'boolean',
      displayName: 'Show Explore Our Solutions',
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

export type EslTabbedSolutionsData = Partial<ContentProps<typeof EslTabbedSolutionsContentType>>;

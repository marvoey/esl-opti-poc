import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslFaqStatesContentType = contentType({
  key: 'EslFaqStates',
  displayName: 'ESL FAQ States',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    showFaqStates: {
      type: 'boolean',
      displayName: 'Show FAQ States',
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

export type EslFaqStatesData = Partial<ContentProps<typeof EslFaqStatesContentType>>;

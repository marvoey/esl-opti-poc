import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslCompareTableContentType = contentType({
  key: 'EslCompareTable',
  displayName: 'ESL Compare Table',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    showCompareTable: {
      type: 'boolean',
      displayName: 'Show Compare Table',
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

export type EslCompareTableData = Partial<
  ContentProps<typeof EslCompareTableContentType>
>;

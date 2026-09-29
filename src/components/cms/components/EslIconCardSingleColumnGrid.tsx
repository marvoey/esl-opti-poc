import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslIconCardSingleColumnGridItemContentType } from './EslIconCardSingleColumnGridItem';

export const EslIconCardSingleColumnGridContentType = contentType({
  key: 'EslIconCardSingleColumnGrid',
  displayName: 'ESL Icon Card Single Column Grid',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    title: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 10,
    },
    items: {
      type: 'array',
      displayName: 'Rows',
      group: 'content',
      sortOrder: 20,
      items: {
        type: 'component',
        contentType: EslIconCardSingleColumnGridItemContentType,
      },
    },
  },
});

export type EslIconCardSingleColumnGridData = Partial<
  ContentProps<typeof EslIconCardSingleColumnGridContentType>
>;

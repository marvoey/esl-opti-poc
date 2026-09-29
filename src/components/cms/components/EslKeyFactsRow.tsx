import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslKeyFactItemContentType } from './EslKeyFactItem';

export const EslKeyFactsRowContentType = contentType({
  key: 'EslKeyFactsRow',
  displayName: 'ESL Key Facts Row',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    title: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 10,
    },
    subtitle: {
      type: 'string',
      displayName: 'Subheading',
      group: 'content',
      sortOrder: 20,
    },
    facts: {
      type: 'array',
      displayName: 'Key Facts Tiles',
      group: 'content',
      sortOrder: 30,
      items: {
        type: 'component',
        contentType: EslKeyFactItemContentType,
      },
    },
  },
});

export type EslKeyFactsRowData = Partial<ContentProps<typeof EslKeyFactsRowContentType>>;

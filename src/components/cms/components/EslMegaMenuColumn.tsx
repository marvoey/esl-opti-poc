import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslMegaMenuColumnItemContentType } from './EslMegaMenuColumnItem';

export const EslMegaMenuColumnContentType = contentType({
  key: 'EslMegaMenuColumn',
  displayName: 'ESL Mega Menu Column',
  baseType: '_component',
  properties: {
    heading: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 10,
    },
    items: {
      type: 'array',
      displayName: 'Column Items',
      group: 'content',
      sortOrder: 20,
      items: {
        type: 'component',
        contentType: EslMegaMenuColumnItemContentType,
      },
    },
  },
});

export type EslMegaMenuColumnData = Partial<
  ContentProps<typeof EslMegaMenuColumnContentType>
>;

import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslProductCardItemContentType } from './EslProductCardItem';

export const EslProductCardsRowContentType = contentType({
  key: 'EslProductCardsRow',
  displayName: 'ESL Product Cards Row',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    eyebrow: {
      type: 'string',
      displayName: 'Eyebrow',
      group: 'content',
      sortOrder: 10,
    },
    title: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 20,
    },
    description: {
      type: 'richText',
      displayName: 'Copy',
      group: 'content',
      sortOrder: 30,
      editorSettings: {
        preset: 'default',
      },
    },
    items: {
      type: 'array',
      displayName: 'Product Cards',
      group: 'content',
      sortOrder: 40,
      items: {
        type: 'component',
        contentType: EslProductCardItemContentType,
      },
    },
  },
});

export type EslProductCardsRowData = Partial<ContentProps<typeof EslProductCardsRowContentType>>;

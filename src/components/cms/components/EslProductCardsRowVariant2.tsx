import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslProductCardsRowVariant2ItemContentType } from './EslProductCardsRowVariant2Item';

export const EslProductCardsRowVariant2ContentType = contentType({
  key: 'EslProductCardsRowVariant2',
  displayName: 'ESL Product Cards Row Variant 2',
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
      displayName: 'Everyday Tools Cards',
      group: 'content',
      sortOrder: 40,
      items: {
        type: 'component',
        contentType: EslProductCardsRowVariant2ItemContentType,
      },
    },
  },
});

export type EslProductCardsRowVariant2Data = Partial<
  ContentProps<typeof EslProductCardsRowVariant2ContentType>
>;

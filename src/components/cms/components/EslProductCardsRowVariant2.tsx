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
      displayName: 'Eyebrow Text',
      group: 'content',
      sortOrder: 10,
    },
    title: {
      type: 'string',
      displayName: 'Title',
      group: 'content',
      sortOrder: 20,
    },
    description: {
      type: 'richText',
      displayName: 'Section Description',
      group: 'content',
      sortOrder: 30,
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

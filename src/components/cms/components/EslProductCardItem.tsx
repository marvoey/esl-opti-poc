import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslProductCardItemContentType = contentType({
  key: 'EslProductCardItem',
  displayName: 'ESL Product Card Item',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    title: {
      type: 'string',
      displayName: 'Card Title',
      group: 'content',
      sortOrder: 10,
    },
    description: {
      type: 'richText',
      displayName: 'Card Description',
      group: 'content',
      sortOrder: 20,
    },
  },
});

export type EslProductCardItemData = Partial<ContentProps<typeof EslProductCardItemContentType>>;

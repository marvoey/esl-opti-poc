import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslProductCardsRowVariant2ItemContentType = contentType({
  key: 'EslProductCardsRowVariant2Item',
  displayName: 'ESL Product Cards Row Variant 2 Item',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    icon: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Icon',
      group: 'content',
      sortOrder: 10,
      enum: [
        { value: 'credit-card', displayName: 'Credit Card' },
        { value: 'piggy-bank', displayName: 'Piggy Bank' },
        { value: 'shield-check', displayName: 'Shield Check' },
        { value: 'coins', displayName: 'Coins' },
        { value: 'home', displayName: 'Home' },
        { value: 'car', displayName: 'Car' },
        { value: 'store', displayName: 'Store' },
        { value: 'user', displayName: 'User' },
      ],
    },
    title: {
      type: 'string',
      displayName: 'Card Title',
      group: 'content',
      sortOrder: 20,
    },
    description: {
      type: 'richText',
      displayName: 'Card Description',
      group: 'content',
      sortOrder: 30,
    },
    link: {
      type: 'link',
      displayName: 'Link / Call to Action',
      group: 'content',
      sortOrder: 40,
    },
  },
});

export type EslProductCardsRowVariant2ItemData = Partial<
  ContentProps<typeof EslProductCardsRowVariant2ItemContentType>
>;

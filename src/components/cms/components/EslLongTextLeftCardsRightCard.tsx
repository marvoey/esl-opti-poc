import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const LONG_TEXT_LEFT_CARDS_RIGHT_CARD_ICONS = [
  { value: 'gauge', displayName: 'Gauge' },
  { value: 'house-plus', displayName: 'House Plus' },
  { value: 'clipboard-list', displayName: 'Clipboard List' },
  { value: 'piggy-bank', displayName: 'Piggy Bank' },
  { value: 'home', displayName: 'Home' },
  { value: 'key-round', displayName: 'Key' },
  { value: 'landmark', displayName: 'Landmark' },
  { value: 'wallet', displayName: 'Wallet' },
  { value: 'credit-card', displayName: 'Credit Card' },
  { value: 'shield-check', displayName: 'Shield Check' },
  { value: 'coins', displayName: 'Coins' },
] as const;

export const EslLongTextLeftCardsRightCardContentType = contentType({
  key: 'EslLongTextLeftCardsRightCard',
  displayName: 'ESL Long Text Left Cards Right Card',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    icon: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Icon',
      description: 'Icon shown at the top left of the card. Leave empty for no icon.',
      group: 'content',
      sortOrder: 10,
      enum: [...LONG_TEXT_LEFT_CARDS_RIGHT_CARD_ICONS],
    },
    eyebrow: {
      type: 'string',
      displayName: 'Eyebrow',
      description: 'Short line above the title, e.g. "Tool · 5 min".',
      group: 'content',
      sortOrder: 20,
    },
    title: {
      type: 'string',
      displayName: 'Heading',
      description: 'Cards without a title are not shown.',
      group: 'content',
      sortOrder: 30,
    },
    description: {
      type: 'richText',
      displayName: 'Copy',
      group: 'content',
      sortOrder: 40,
      editorSettings: {
        preset: 'default',
      },
    },
    link: {
      type: 'link',
      displayName: 'CTA Link',
      description: 'Destination of the whole card.',
      group: 'content',
      sortOrder: 50,
    },
  },
});

export type EslLongTextLeftCardsRightCardData = Partial<
  ContentProps<typeof EslLongTextLeftCardsRightCardContentType>
>;

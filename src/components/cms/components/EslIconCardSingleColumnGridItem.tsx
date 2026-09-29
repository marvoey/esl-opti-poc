import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import type { IconName } from '@/components/atoms/icons';

export const ICON_CARD_SINGLE_COLUMN_GRID_ICONS = [
  { value: 'piggy-bank', displayName: 'Piggy Bank' },
  { value: 'coins', displayName: 'Coins' },
  { value: 'vault', displayName: 'Vault' },
  { value: 'landmark', displayName: 'Landmark' },
  { value: 'wallet', displayName: 'Wallet' },
  { value: 'hand-coins', displayName: 'Hand Coins' },
  { value: 'credit-card', displayName: 'Credit Card' },
  { value: 'home', displayName: 'Home' },
  { value: 'car', displayName: 'Car' },
  { value: 'graduation-cap', displayName: 'Graduation Cap' },
  { value: 'shield-check', displayName: 'Shield Check' },
  { value: 'sprout', displayName: 'Sprout' },
] as const satisfies ReadonlyArray<{ value: IconName; displayName: string }>;

export const EslIconCardSingleColumnGridItemContentType = contentType({
  key: 'EslIconCardSingleColumnGridItem',
  displayName: 'ESL Icon Card Single Column Grid Item',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    icon: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Icon',
      description: 'Icon shown before the row title. Defaults to Piggy Bank.',
      group: 'content',
      sortOrder: 10,
      enum: [...ICON_CARD_SINGLE_COLUMN_GRID_ICONS],
    },
    title: {
      type: 'string',
      displayName: 'Heading',
      description: 'Rows without a title are not shown.',
      group: 'content',
      sortOrder: 20,
    },
    link: {
      type: 'link',
      displayName: 'CTA Link',
      description: 'Destination of the row title. Without a URL the title shows without an arrow.',
      group: 'content',
      sortOrder: 30,
    },
    description: {
      type: 'richText',
      displayName: 'Copy',
      description: 'Start with a bold lead sentence, as in the design.',
      group: 'content',
      sortOrder: 40,
      editorSettings: {
        preset: 'default',
      },
    },
  },
});

export type EslIconCardSingleColumnGridItemData = Partial<
  ContentProps<typeof EslIconCardSingleColumnGridItemContentType>
>;

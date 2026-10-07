import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import type { IconName } from '@/components/atoms/icons';

export const PRODUCT_PATHWAYS_ICONS = [
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

export const EslProductPathwaysRowContentType = contentType({
  key: 'EslProductPathwaysRow',
  displayName: 'ESL Product Pathways Row',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    icon: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Icon',
      description: 'Icon shown before the link label. Defaults to Piggy Bank.',
      group: 'content',
      sortOrder: 10,
      enum: [...PRODUCT_PATHWAYS_ICONS],
    },
    title: {
      type: 'string',
      displayName: 'Heading',
      description: 'Link label in the left column. Name the destination, e.g. "Open Checking", so it reads well on its own. Rows without a label are not shown.',
      isRequired: true,
      group: 'content',
      sortOrder: 20,
    },
    link: {
      type: 'link',
      displayName: 'CTA Link',
      description: 'Destination of the label. Without a URL the label shows without an arrow.',
      group: 'content',
      sortOrder: 30,
    },
    description: {
      type: 'richText',
      displayName: 'Copy',
      description: 'Right column copy. Start with a bold lead sentence, as in the design.',
      group: 'content',
      sortOrder: 40,
      editorSettings: {
        preset: 'default',
      },
    },
  },
});

export type EslProductPathwaysRowData = Partial<
  ContentProps<typeof EslProductPathwaysRowContentType>
>;

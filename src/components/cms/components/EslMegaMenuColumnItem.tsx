import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslMegaMenuColumnItemContentType = contentType({
  key: 'EslMegaMenuColumnItem',
  displayName: 'ESL Mega Menu Column Item',
  baseType: '_component',
  properties: {
    icon: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Icon',
      group: 'content',
      sortOrder: 10,
      enum: [
        { value: 'landmark', displayName: 'Landmark / Checking' },
        { value: 'piggy-bank', displayName: 'Piggy Bank / Savings' },
        { value: 'award', displayName: 'Award / Certificate' },
        { value: 'vault', displayName: 'Vault / IRA' },
        { value: 'smartphone', displayName: 'Smartphone / Digital Banking' },
        { value: 'hand-coins', displayName: 'Hand Coins / Personal Loans' },
        { value: 'key-round', displayName: 'Key / Mortgage' },
        { value: 'car', displayName: 'Car / Auto Loans' },
        { value: 'home', displayName: 'Home / Home Equity' },
        { value: 'credit-card', displayName: 'Credit Card' },
        { value: 'wallet', displayName: 'Wallet / Debit Cards' },
        { value: 'shield-alert', displayName: 'Shield Alert / Overdraft' },
        { value: 'coins', displayName: 'Coins' },
        { value: 'shield-check', displayName: 'Shield Check' },
        { value: 'user', displayName: 'User' },
      ],
    },
    link: {
      type: 'link',
      displayName: 'CTA Link',
      group: 'content',
      sortOrder: 20,
    },
  },
});

export type EslMegaMenuColumnItemData = Partial<
  ContentProps<typeof EslMegaMenuColumnItemContentType>
>;

import { contentType } from '@optimizely/cms-sdk';

export const EslRatesCardContentType = contentType({
  key: 'EslRatesCard',
  displayName: 'ESL Rates Card',
  baseType: '_component',
  properties: {
    categoryIcon: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Category Icon',
      group: 'content',
      sortOrder: 10,
      enum: [
        { value: 'car', displayName: 'Car (Auto Loans)' },
        { value: 'home', displayName: 'Home (Mortgages)' },
        { value: 'piggy-bank', displayName: 'Piggy Bank (Savings)' },
        { value: 'coins', displayName: 'Coins' },
        { value: 'credit-card', displayName: 'Credit Card' },
      ],
    },
    category: {
      type: 'string',
      displayName: 'Category Label (e.g. Getting on the road)',
      group: 'content',
      sortOrder: 15,
    },
    rate: {
      type: 'string',
      displayName: 'Rate Value (e.g. 1.99)',
      group: 'content',
      sortOrder: 20,
    },
    rateUnit: {
      type: 'string',
      displayName: 'Rate Unit (e.g. %)',
      group: 'content',
      sortOrder: 25,
    },
    rateLabel: {
      type: 'string',
      displayName: 'Rate Label (e.g. APR, APY)',
      group: 'content',
      sortOrder: 30,
    },
    title: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 40,
    },
    description: {
      type: 'string',
      displayName: 'Copy',
      group: 'content',
      sortOrder: 50,
    },
    cta: {
      type: 'link',
      displayName: 'CTA Link',
      group: 'content',
      sortOrder: 60,
    },
    variant: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Card Variant',
      group: 'content',
      sortOrder: 70,
      enum: [
        { value: 'default', displayName: 'Default (Navy Surface)' },
        { value: 'active', displayName: 'Active (Turquoise Glow)' },
      ],
    },
  },
});

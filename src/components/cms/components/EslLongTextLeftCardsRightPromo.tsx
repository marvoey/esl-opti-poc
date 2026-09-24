import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslLongTextLeftCardsRightPromoContentType = contentType({
  key: 'EslLongTextLeftCardsRightPromo',
  displayName: 'ESL Long Text Left Cards Right Promo',
  baseType: '_component',
  properties: {
    eyebrow: {
      type: 'string',
      displayName: 'Promo Badge',
      description: 'Pill text, e.g. "Something at ESL that helps here".',
      group: 'content',
      sortOrder: 10,
    },
    heading: {
      type: 'string',
      displayName: 'Promo Heading',
      description: 'The promo box is hidden when this is empty.',
      group: 'content',
      sortOrder: 20,
    },
    description: {
      type: 'richText',
      displayName: 'Promo Description',
      group: 'content',
      sortOrder: 30,
    },
    cta: {
      type: 'link',
      displayName: 'Promo Link',
      group: 'content',
      sortOrder: 40,
    },
  },
});

export type EslLongTextLeftCardsRightPromoData = Partial<
  ContentProps<typeof EslLongTextLeftCardsRightPromoContentType>
>;

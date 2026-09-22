import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslMegaMenuPromoContentType = contentType({
  key: 'EslMegaMenuPromo',
  displayName: 'ESL Mega Menu Promo Card',
  baseType: '_component',
  properties: {
    eyebrow: {
      type: 'string',
      displayName: 'Promo Eyebrow',
      group: 'content',
      sortOrder: 10,
    },
    heading: {
      type: 'string',
      displayName: 'Promo Heading',
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
      displayName: 'Promo Call to Action Link',
      group: 'content',
      sortOrder: 40,
    },
  },
});

export type EslMegaMenuPromoData = Partial<
  ContentProps<typeof EslMegaMenuPromoContentType>
>;

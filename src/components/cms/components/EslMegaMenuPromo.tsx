import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslMegaMenuPromoContentType = contentType({
  key: 'EslMegaMenuPromo',
  displayName: 'ESL Mega Menu Promo Card',
  baseType: '_component',
  properties: {
    eyebrow: {
      type: 'string',
      displayName: 'Eyebrow',
      group: 'content',
      sortOrder: 10,
    },
    heading: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 20,
    },
    description: {
      type: 'richText',
      displayName: 'Copy',
      group: 'content',
      sortOrder: 30,
      editorSettings: {
        preset: 'default',
      },
    },
    cta: {
      type: 'link',
      displayName: 'CTA Link',
      group: 'content',
      sortOrder: 40,
    },
  },
});

export type EslMegaMenuPromoData = Partial<
  ContentProps<typeof EslMegaMenuPromoContentType>
>;

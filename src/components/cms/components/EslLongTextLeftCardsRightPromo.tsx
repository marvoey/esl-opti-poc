import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslLongTextLeftCardsRightPromoContentType = contentType({
  key: 'EslLongTextLeftCardsRightPromo',
  displayName: 'ESL Long Text Left Cards Right Promo',
  baseType: '_component',
  properties: {
    eyebrow: {
      type: 'string',
      displayName: 'Eyebrow',
      description: 'Pill text, e.g. "Something at ESL that helps here".',
      group: 'content',
      sortOrder: 10,
    },
    heading: {
      type: 'string',
      displayName: 'Heading',
      description: 'The promo box is hidden when this is empty.',
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

export type EslLongTextLeftCardsRightPromoData = Partial<
  ContentProps<typeof EslLongTextLeftCardsRightPromoContentType>
>;

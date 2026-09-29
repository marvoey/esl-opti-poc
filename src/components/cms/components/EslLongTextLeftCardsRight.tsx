import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslLongTextLeftCardsRightCardContentType } from './EslLongTextLeftCardsRightCard';
import { EslLongTextLeftCardsRightPromoContentType } from './EslLongTextLeftCardsRightPromo';

export const EslLongTextLeftCardsRightContentType = contentType({
  key: 'EslLongTextLeftCardsRight',
  displayName: 'ESL Long Text Left Cards Right',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    title: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 10,
    },
    body: {
      type: 'richText',
      displayName: 'Copy',
      group: 'content',
      sortOrder: 20,
      editorSettings: {
        preset: 'default',
      },
    },
    promo: {
      type: 'component',
      contentType: EslLongTextLeftCardsRightPromoContentType,
      displayName: 'Promo Box',
      group: 'content',
      sortOrder: 30,
    },
    items: {
      type: 'array',
      displayName: 'Cards',
      group: 'content',
      sortOrder: 40,
      items: {
        type: 'component',
        contentType: EslLongTextLeftCardsRightCardContentType,
      },
    },
  },
});

export type EslLongTextLeftCardsRightData = Partial<
  ContentProps<typeof EslLongTextLeftCardsRightContentType>
>;

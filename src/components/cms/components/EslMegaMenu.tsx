import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslMegaMenuColumnContentType } from './EslMegaMenuColumn';
import { EslMegaMenuPromoContentType } from './EslMegaMenuPromo';

export const EslMegaMenuContentType = contentType({
  key: 'EslMegaMenu',
  displayName: 'ESL Mega Menu',
  baseType: '_component',
  properties: {
    navLabel: {
      type: 'string',
      displayName: 'Navigation Trigger Label (e.g. Personal)',
      group: 'content',
      sortOrder: 5,
    },
    cta: {
      type: 'link',
      displayName: 'CTA Link',
      group: 'content',
      sortOrder: 10,
    },
    columns: {
      type: 'array',
      displayName: 'Mega Menu Columns',
      group: 'content',
      sortOrder: 30,
      items: {
        type: 'component',
        contentType: EslMegaMenuColumnContentType,
      },
    },
    promo: {
      type: 'component',
      contentType: EslMegaMenuPromoContentType,
      displayName: 'Promo Card',
      group: 'content',
      sortOrder: 40,
    },
  },
});

export type EslMegaMenuData = Partial<
  ContentProps<typeof EslMegaMenuContentType>
>;

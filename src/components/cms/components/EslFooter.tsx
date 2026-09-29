import { contentType } from '@optimizely/cms-sdk';
import { EslFooterNavColumnContentType } from './EslFooterNavColumn';

export const EslFooterContentType = contentType({
  key: 'ESLFooter',
  displayName: 'ESL Footer',
  baseType: '_component',
  properties: {
    brandLogo: {
      type: 'contentReference',
      displayName: 'Brand Logo Image',
      group: 'content',
      sortOrder: 5,
      allowedTypes: ['_image'],
    },
    brandLogoAlt: {
      type: 'string',
      displayName: 'Brand Logo Alt Text',
      group: 'content',
      sortOrder: 6,
    },
    brandText: {
      type: 'string',
      displayName: 'Brand Description',
      group: 'content',
      sortOrder: 10,
    },
    brandCta: {
      type: 'link',
      displayName: 'CTA Link',
      group: 'content',
      sortOrder: 20,
    },
    columns: {
      type: 'array',
      displayName: 'Navigation Columns',
      group: 'content',
      sortOrder: 30,
      maxItems: 4,
      items: {
        type: 'component',
        contentType: EslFooterNavColumnContentType,
      },
    },
    addressText: {
      type: 'string',
      displayName: 'Address Text',
      group: 'content',
      sortOrder: 40,
    },
    legalLinks: {
      type: 'array',
      displayName: 'Legal Links',
      group: 'content',
      sortOrder: 50,
      maxItems: 3,
      items: {
        type: 'link',
      },
    },
    serviceMarksText: {
      type: 'string',
      displayName: 'Service Marks Statement',
      group: 'content',
      sortOrder: 60,
    },
    copyrightText: {
      type: 'string',
      displayName: 'Copyright Statement',
      group: 'content',
      sortOrder: 70,
    },
  },
});

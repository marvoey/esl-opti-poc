import { contentType } from '@optimizely/cms-sdk';
import { EslMegaMenuContentType } from './EslMegaMenu';

export const EslHeaderContentType = contentType({
  key: 'ESLHeader',
  displayName: 'ESL Header',
  baseType: '_component',
  properties: {
    brandLogo: {
      type: 'contentReference',
      displayName: 'Brand Logo Image',
      group: 'content',
      sortOrder: 10,
      allowedTypes: ['_image'],
    },
    brandLogoAlt: {
      type: 'string',
      displayName: 'Brand Logo Alt Text',
      group: 'content',
      sortOrder: 15,
    },
    brandHref: {
      type: 'string',
      displayName: 'Brand Logo Link URL',
      group: 'content',
      sortOrder: 20,
    },
    megaMenu: {
      type: 'component',
      contentType: EslMegaMenuContentType,
      displayName: 'Mega Menu (e.g. Personal)',
      group: 'content',
      sortOrder: 25,
    },
    navLinks: {
      type: 'array',
      displayName: 'Navigation Links',
      group: 'content',
      sortOrder: 30,
      items: {
        type: 'link',
      },
    },
    cta: {
      type: 'link',
      displayName: 'Explore Docs CTA Button',
      group: 'content',
      sortOrder: 40,
    },
  },
});

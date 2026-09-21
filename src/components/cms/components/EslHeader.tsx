import { contentType } from '@optimizely/cms-sdk';

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

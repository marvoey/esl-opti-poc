import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslDisclosureItemContentType } from './EslDisclosureItem';

export const EslDisclosureContentType = contentType({
  key: 'EslDisclosure',
  displayName: 'ESL Disclosure',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    heading: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 10,
    },
    items: {
      type: 'array',
      displayName: 'Disclosure Items',
      group: 'content',
      sortOrder: 20,
      items: {
        type: 'component',
        contentType: EslDisclosureItemContentType,
      },
    },
  },
});

export type EslDisclosureData = Partial<ContentProps<typeof EslDisclosureContentType>>;

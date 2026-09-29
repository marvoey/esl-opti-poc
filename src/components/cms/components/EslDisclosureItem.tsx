import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslDisclosureItemContentType = contentType({
  key: 'EslDisclosureItem',
  displayName: 'ESL Disclosure Item',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    boldText: {
      type: 'string',
      displayName: 'Bold Text',
      group: 'content',
      sortOrder: 10,
    },
    regularText: {
      type: 'richText',
      displayName: 'Copy',
      group: 'content',
      sortOrder: 20,
      editorSettings: {
        preset: 'default',
      },
    },
  },
});

export type EslDisclosureItemData = Partial<ContentProps<typeof EslDisclosureItemContentType>>;

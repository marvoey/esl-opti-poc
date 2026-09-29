import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslKeyFactItemContentType = contentType({
  key: 'EslKeyFactItem',
  displayName: 'ESL Key Fact Item',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    value: {
      type: 'string',
      displayName: 'Stat / Value (e.g. $0, Free)',
      group: 'content',
      sortOrder: 10,
    },
    callout: {
      type: 'string',
      displayName: 'Callout Label (e.g. Monthly service fee)',
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
  },
});

export type EslKeyFactItemData = Partial<ContentProps<typeof EslKeyFactItemContentType>>;

import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslAccordionCardItemContentType = contentType({
  key: 'EslAccordionCardItem',
  displayName: 'ESL Accordion Card Item',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    term: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 10,
    },
    definition: {
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

export type EslAccordionCardItemData = Partial<
  ContentProps<typeof EslAccordionCardItemContentType>
>;

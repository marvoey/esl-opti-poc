import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslAccordionCardItemContentType = contentType({
  key: 'EslAccordionCardItem',
  displayName: 'ESL Accordion Card Item',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    term: {
      type: 'string',
      displayName: 'Term / Heading',
      group: 'content',
      sortOrder: 10,
    },
    definition: {
      type: 'richText',
      displayName: 'Definition / Content',
      group: 'content',
      sortOrder: 20,
    },
  },
});

export type EslAccordionCardItemData = Partial<
  ContentProps<typeof EslAccordionCardItemContentType>
>;

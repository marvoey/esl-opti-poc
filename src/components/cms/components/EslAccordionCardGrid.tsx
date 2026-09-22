import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslAccordionCardItemContentType } from './EslAccordionCardItem';

export const EslAccordionCardGridContentType = contentType({
  key: 'EslAccordionCardGrid',
  displayName: 'ESL Accordion Card Grid',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    eyebrow: {
      type: 'string',
      displayName: 'Eyebrow Text',
      group: 'content',
      sortOrder: 10,
    },
    title: {
      type: 'string',
      displayName: 'Title',
      group: 'content',
      sortOrder: 20,
    },
    description: {
      type: 'richText',
      displayName: 'Section Description',
      group: 'content',
      sortOrder: 30,
    },
    items: {
      type: 'array',
      displayName: 'Accordion Items',
      group: 'content',
      sortOrder: 40,
      items: {
        type: 'component',
        contentType: EslAccordionCardItemContentType,
      },
    },
  },
});

export type EslAccordionCardGridData = Partial<
  ContentProps<typeof EslAccordionCardGridContentType>
>;

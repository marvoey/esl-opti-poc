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
      displayName: 'Eyebrow',
      group: 'content',
      sortOrder: 10,
    },
    title: {
      type: 'string',
      displayName: 'Heading',
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

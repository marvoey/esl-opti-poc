import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslInformationalCardContentType = contentType({
  key: 'EslInformationalCard',
  displayName: 'ESL Informational Card',
  baseType: '_component',
  // Flat properties only, so the card can sit in a section grid or on its own.
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    badge: {
      type: 'string',
      displayName: 'Badge',
      description: 'Short taxonomy label in the pill above the heading. Leave empty to hide it.',
      group: 'content',
      sortOrder: 10,
    },
    title: {
      type: 'string',
      displayName: 'Heading',
      description: 'The card is not shown without a heading.',
      isRequired: true,
      group: 'content',
      sortOrder: 20,
    },
    description: {
      type: 'richText',
      displayName: 'Copy',
      group: 'content',
      sortOrder: 30,
    },
    noteLabel: {
      type: 'string',
      displayName: 'Note Label',
      description: 'Bold lead-in of the note, for example "Why it\'s here:".',
      group: 'content',
      sortOrder: 40,
    },
    note: {
      type: 'string',
      displayName: 'Note',
      description: 'Shown under a divider. Leave empty to hide the divider and note.',
      group: 'content',
      sortOrder: 50,
    },
    cta: {
      type: 'link',
      displayName: 'CTA Link',
      description: 'Makes the whole card clickable.',
      group: 'content',
      sortOrder: 60,
    },
  },
});

export type EslInformationalCardData = Partial<
  ContentProps<typeof EslInformationalCardContentType>
>;

import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslFilterableProductCardGridItemContentType } from './EslFilterableProductCardGridItem';

export const EslFilterableProductCardGridContentType = contentType({
  key: 'EslFilterableProductCardGrid',
  displayName: 'ESL Filterable Product Card Grid',
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
    allFilterLabel: {
      type: 'string',
      displayName: '"All" Filter Label',
      description: 'Label of the chip that shows every card, e.g. "All accounts". Leave empty for no such chip.',
      group: 'content',
      sortOrder: 40,
    },
    filters: {
      type: 'array',
      displayName: 'Filters',
      description: 'Chip labels, in order. Cards opt in through their Filter Tags.',
      group: 'content',
      sortOrder: 50,
      items: {
        type: 'string',
      },
    },
    items: {
      type: 'array',
      displayName: 'Cards',
      group: 'content',
      sortOrder: 60,
      items: {
        type: 'component',
        contentType: EslFilterableProductCardGridItemContentType,
      },
    },
    noResultsText: {
      type: 'string',
      displayName: 'No Results Text',
      description: 'Shown when a filter matches no card. Leave empty to show nothing.',
      group: 'content',
      sortOrder: 70,
    },
  },
});

export type EslFilterableProductCardGridData = Partial<
  ContentProps<typeof EslFilterableProductCardGridContentType>
>;

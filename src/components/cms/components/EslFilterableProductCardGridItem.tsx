import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslFilterableProductCardGridItemContentType = contentType({
  key: 'EslFilterableProductCardGridItem',
  displayName: 'ESL Filterable Product Card Grid Item',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    title: {
      type: 'string',
      displayName: 'Card Title',
      description: 'Cards without a title are not shown.',
      group: 'content',
      sortOrder: 10,
    },
    description: {
      type: 'richText',
      displayName: 'Card Description',
      group: 'content',
      sortOrder: 20,
    },
    rate: {
      type: 'string',
      displayName: 'Rate',
      description: 'Shown as written, e.g. "X.XX% APY".',
      group: 'content',
      sortOrder: 30,
    },
    filterTags: {
      type: 'array',
      displayName: 'Filter Tags',
      description:
        'Filters that show this card. Each tag must match one of the section filter labels (case is ignored).',
      group: 'content',
      sortOrder: 40,
      items: {
        type: 'string',
      },
    },
    link: {
      type: 'link',
      displayName: 'Card Link',
      description: 'The link text is the label, e.g. "See Details".',
      group: 'content',
      sortOrder: 50,
    },
  },
});

export type EslFilterableProductCardGridItemData = Partial<
  ContentProps<typeof EslFilterableProductCardGridItemContentType>
>;

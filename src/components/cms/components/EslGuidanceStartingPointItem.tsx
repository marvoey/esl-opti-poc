import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslGuidanceStartingPointItemContentType = contentType({
  key: 'EslGuidanceStartingPointItem',
  displayName: 'ESL Guidance Starting Point Item',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    title: {
      type: 'string',
      displayName: 'Heading',
      description: 'Cards without a heading are not shown.',
      group: 'content',
      sortOrder: 10,
    },
    description: {
      type: 'string',
      displayName: 'Copy',
      group: 'content',
      sortOrder: 20,
    },
    link: {
      type: 'link',
      displayName: 'CTA Link',
      description: 'Makes the whole card clickable.',
      group: 'content',
      sortOrder: 30,
    },
  },
});

export type EslGuidanceStartingPointItemData = Partial<
  ContentProps<typeof EslGuidanceStartingPointItemContentType>
>;

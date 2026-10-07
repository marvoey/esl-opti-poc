import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslProductPathwaysRowContentType } from './EslProductPathwaysRow';

export const EslProductPathwaysContentType = contentType({
  key: 'EslProductPathways',
  displayName: 'ESL Product Pathways',
  baseType: '_component',
  // Section only: `items` is an array of components, which the CMS refuses on
  // an elementEnabled type.
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    title: {
      type: 'string',
      displayName: 'Heading',
      description: 'Title in the navy header row, e.g. "Manage". The component is hidden without it.',
      isRequired: true,
      group: 'content',
      sortOrder: 10,
    },
    description: {
      type: 'richText',
      displayName: 'Copy',
      description: 'Intro copy to the right of the heading in the navy header row.',
      group: 'content',
      sortOrder: 20,
      editorSettings: {
        preset: 'default',
      },
    },
    items: {
      type: 'array',
      displayName: 'Rows',
      isRequired: true,
      group: 'content',
      sortOrder: 30,
      items: {
        type: 'component',
        contentType: EslProductPathwaysRowContentType,
      },
    },
  },
});

export type EslProductPathwaysData = Partial<
  ContentProps<typeof EslProductPathwaysContentType>
>;

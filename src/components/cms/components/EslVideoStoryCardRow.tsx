import { contentType } from '@optimizely/cms-sdk';
import { EslVideoStoryCardContentType } from './EslVideoStoryCard';

export const EslVideoStoryCardRowContentType = contentType({
  key: 'EslVideoStoryCardRow',
  displayName: 'ESL Video Story Card Row',
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
    cta: {
      type: 'link',
      displayName: 'CTA Link',
      group: 'content',
      sortOrder: 40,
    },
    cards: {
      type: 'array',
      displayName: 'Story Cards',
      group: 'content',
      sortOrder: 50,
      items: {
        type: 'component',
        contentType: EslVideoStoryCardContentType,
      },
    },
  },
});

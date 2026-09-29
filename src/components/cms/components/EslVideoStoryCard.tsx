import { contentType } from '@optimizely/cms-sdk';

export const EslVideoStoryCardContentType = contentType({
  key: 'EslVideoStoryCard',
  displayName: 'ESL Video Story Card',
  baseType: '_component',
  properties: {
    image: {
      type: 'contentReference',
      displayName: 'Thumbnail Image',
      group: 'content',
      sortOrder: 10,
      allowedTypes: ['_image'],
    },
    imageAlt: {
      type: 'string',
      displayName: 'Image Alt Text',
      group: 'content',
      sortOrder: 15,
    },
    videoUrl: {
      type: 'string',
      displayName: 'Video URL (YouTube)',
      group: 'content',
      sortOrder: 20,
    },
    videoTitle: {
      type: 'string',
      displayName: 'Video Accessible Title',
      group: 'content',
      sortOrder: 25,
    },
    categoryIcon: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Category Icon',
      group: 'content',
      sortOrder: 30,
      enum: [
        { value: 'store', displayName: 'Store / Business' },
        { value: 'home', displayName: 'Home / Mortgage' },
        { value: 'graduation-cap', displayName: 'Graduation / Student' },
        { value: 'piggy-bank', displayName: 'Piggy Bank / Savings' },
      ],
    },
    title: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 35,
    },
    quote: {
      type: 'richText',
      displayName: 'Copy',
      group: 'content',
      sortOrder: 40,
      editorSettings: {
        preset: 'default',
      },
    },
    authorName: {
      type: 'string',
      displayName: 'Author Name',
      group: 'content',
      sortOrder: 50,
    },
    authorRole: {
      type: 'string',
      displayName: 'Author Role',
      group: 'content',
      sortOrder: 55,
    },
    authorLocation: {
      type: 'string',
      displayName: 'Author Location',
      group: 'content',
      sortOrder: 60,
    },
  },
});

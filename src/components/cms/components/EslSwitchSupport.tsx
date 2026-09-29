import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslSwitchSupportStepContentType } from './EslSwitchSupportStep';

export const EslSwitchSupportContentType = contentType({
  key: 'EslSwitchSupport',
  displayName: 'ESL Switch Support',
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
    steps: {
      type: 'array',
      displayName: 'Process Steps',
      group: 'content',
      sortOrder: 40,
      items: {
        type: 'component',
        contentType: EslSwitchSupportStepContentType,
      },
    },
    cta: {
      type: 'link',
      displayName: 'Primary CTA Link',
      group: 'content',
      sortOrder: 50,
    },
    link: {
      type: 'link',
      displayName: 'Secondary CTA Link',
      group: 'content',
      sortOrder: 60,
    },
  },
});

export type EslSwitchSupportData = Partial<ContentProps<typeof EslSwitchSupportContentType>>;

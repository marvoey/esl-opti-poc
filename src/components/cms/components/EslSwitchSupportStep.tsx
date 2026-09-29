import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslSwitchSupportStepContentType = contentType({
  key: 'EslSwitchSupportStep',
  displayName: 'ESL Switch Support Step',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    step: {
      type: 'integer',
      displayName: 'Step Number',
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
  },
});

export type EslSwitchSupportStepData = Partial<ContentProps<typeof EslSwitchSupportStepContentType>>;

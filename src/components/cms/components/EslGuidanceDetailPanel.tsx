import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { EslGuidanceStartingPointItemContentType } from './EslGuidanceStartingPointItem';
import { EslGuidanceToolItemContentType, GUIDANCE_ICON_CHOICES } from './EslGuidanceToolItem';

export const EslGuidanceDetailPanelContentType = contentType({
  key: 'EslGuidanceDetailPanel',
  displayName: 'ESL Guidance Detail Panel',
  baseType: '_component',
  // Section only: the card arrays are component properties, which the CMS
  // refuses on an elementEnabled type.
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    icon: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Icon',
      description: 'Icon in the round badge before the heading. Leave empty to hide the badge.',
      group: 'content',
      sortOrder: 10,
      enum: [...GUIDANCE_ICON_CHOICES],
    },
    title: {
      type: 'string',
      displayName: 'Heading',
      description: 'The panel is not shown without a heading.',
      group: 'content',
      sortOrder: 20,
      isRequired: true,
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
    note: {
      type: 'string',
      displayName: 'Supporting Note',
      description: 'Short line shown under the button.',
      group: 'content',
      sortOrder: 50,
    },
    image: {
      type: 'contentReference',
      allowedTypes: ['_image'],
      displayName: 'Image',
      group: 'content',
      sortOrder: 60,
    },
    imageAlt: {
      type: 'string',
      displayName: 'Image Alt Text',
      description: 'Leave empty for a decorative image.',
      group: 'content',
      sortOrder: 70,
    },
    startingPointsHeading: {
      type: 'string',
      displayName: 'Starting Points Heading',
      group: 'content',
      sortOrder: 80,
    },
    startingPoints: {
      type: 'array',
      displayName: 'Starting Points',
      group: 'content',
      sortOrder: 90,
      items: {
        type: 'component',
        contentType: EslGuidanceStartingPointItemContentType,
      },
    },
    toolsHeading: {
      type: 'string',
      displayName: 'Tools Heading',
      group: 'content',
      sortOrder: 100,
    },
    tools: {
      type: 'array',
      displayName: 'Tools',
      group: 'content',
      sortOrder: 110,
      items: {
        type: 'component',
        contentType: EslGuidanceToolItemContentType,
      },
    },
  },
});

export type EslGuidanceDetailPanelData = Partial<
  ContentProps<typeof EslGuidanceDetailPanelContentType>
>;

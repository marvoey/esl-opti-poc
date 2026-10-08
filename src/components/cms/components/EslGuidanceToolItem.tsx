import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import type { GuidanceIconName } from '@/components/organisms/guidance-detail-panel';

export const GUIDANCE_ICON_CHOICES = [
  { value: 'home', displayName: 'Home' },
  { value: 'calculator', displayName: 'Calculator' },
  { value: 'gauge', displayName: 'Gauge' },
  { value: 'list-checks', displayName: 'Checklist' },
  { value: 'piggy-bank', displayName: 'Piggy Bank' },
  { value: 'wallet', displayName: 'Wallet' },
  { value: 'credit-card', displayName: 'Credit Card' },
  { value: 'landmark', displayName: 'Landmark' },
] as const satisfies ReadonlyArray<{ value: GuidanceIconName; displayName: string }>;

export const EslGuidanceToolItemContentType = contentType({
  key: 'EslGuidanceToolItem',
  displayName: 'ESL Guidance Tool Item',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    icon: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Icon',
      description: 'Leave empty to show no icon.',
      group: 'content',
      sortOrder: 10,
      enum: [...GUIDANCE_ICON_CHOICES],
    },
    label: {
      type: 'string',
      displayName: 'Eyebrow',
      description: 'Small label above the heading, e.g. "Calculator".',
      group: 'content',
      sortOrder: 20,
    },
    title: {
      type: 'string',
      displayName: 'Heading',
      description: 'Tools without a heading are not shown.',
      group: 'content',
      sortOrder: 30,
    },
    link: {
      type: 'link',
      displayName: 'CTA Link',
      description: 'Makes the whole card clickable.',
      group: 'content',
      sortOrder: 40,
    },
  },
});

export type EslGuidanceToolItemData = Partial<ContentProps<typeof EslGuidanceToolItemContentType>>;

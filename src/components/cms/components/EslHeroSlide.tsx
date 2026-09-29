import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const HERO_CTA_ICONS = [
  { value: 'none', displayName: 'None (Text only)' },
  { value: 'arrow-right', displayName: 'Arrow Right' },
  { value: 'user', displayName: 'User' },
  { value: 'credit-card', displayName: 'Credit Card' },
  { value: 'check', displayName: 'Check' },
  { value: 'sparkles', displayName: 'Sparkles' },
  { value: 'landmark', displayName: 'Landmark / Checking' },
  { value: 'wallet', displayName: 'Wallet / Debit Cards' },
  { value: 'piggy-bank', displayName: 'Piggy Bank' },
  { value: 'shield-check', displayName: 'Shield Check' },
  { value: 'coins', displayName: 'Coins' },
  { value: 'home', displayName: 'Home' },
  { value: 'car', displayName: 'Car' },
  { value: 'key-round', displayName: 'Key / Mortgage' },
  { value: 'smartphone', displayName: 'Smartphone' },
] as const;

export const EslHeroSlideContentType = contentType({
  key: 'EslHeroSlide',
  displayName: 'ESL Hero Slide',
  baseType: '_component',
  properties: {
    eyebrow: {
      type: 'string',
      displayName: 'Eyebrow',
      group: 'content',
      sortOrder: 10,
    },
    heading: {
      type: 'string',
      displayName: 'Heading',
      group: 'content',
      sortOrder: 20,
    },
    body: {
      type: 'richText',
      displayName: 'Copy',
      group: 'content',
      sortOrder: 30,
      editorSettings: {
        preset: 'default',
      },
    },
    image: {
      type: 'contentReference',
      displayName: 'Slide Image',
      group: 'content',
      sortOrder: 35,
      allowedTypes: ['_image'],
    },
    imageAlt: {
      type: 'string',
      displayName: 'Image Alt Text',
      group: 'content',
      sortOrder: 36,
    },
    primaryCtaIcon: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Primary CTA Icon',
      description: 'Optional icon for the primary button. If not set, only the button text will show.',
      group: 'content',
      sortOrder: 38,
      enum: [...HERO_CTA_ICONS],
    },
    primaryCta: {
      type: 'link',
      displayName: 'Primary CTA Link',
      group: 'content',
      sortOrder: 40,
    },
    secondaryCtaIcon: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Secondary CTA Icon',
      description: 'Optional icon for the secondary button. If not set, only the button text will show.',
      group: 'content',
      sortOrder: 48,
      enum: [...HERO_CTA_ICONS],
    },
    secondaryCta: {
      type: 'link',
      displayName: 'Secondary CTA Link',
      group: 'content',
      sortOrder: 50,
    },
    badgeStat: {
      type: 'string',
      displayName: 'Badge Stat (e.g. 100%)',
      group: 'content',
      sortOrder: 60,
    },
    badgeLabel: {
      type: 'string',
      displayName: 'Badge Label (e.g. Peace of mind)',
      group: 'content',
      sortOrder: 70,
    },
  },
});

export type EslHeroSlideData = Partial<ContentProps<typeof EslHeroSlideContentType>>;


export type AllowedSectionItem = {
  key: string;
  displayName: string;
};

export const KNOWN_COMPONENT_NAMES: Record<string, string> = {
  EslHeroSlider: 'ESL Hero Slider',
  EslSnipeCta: 'ESL Snipe CTA',
  EslTabbedSolutions: 'ESL Explore Solutions',
  EslSideBySide: 'ESL Side By Side',
  EslMetricCardRow: 'ESL Metric Card Row',
  EslSplitContentCards: 'ESL Split Content Cards',
  EslMediaCardGrid: 'ESL Media Card Grid',
  EslVideoStoryCardRow: 'ESL Video Story Card Row',
  EslVerticalSelectorFeatureCard: 'ESL Vertical Selector Feature Card',
  EslCircularImageMetricRow: 'ESL Circular Image Metric Row',
  EslSplitContentImage: 'ESL Split Content Image',
  EslMediaCardGridCarousel: 'ESL Media Card Grid Carousel',
  EslKeyFactsRow: 'ESL Key Facts Row',
  EslSwitchSupport: 'ESL Switch Support',
  EslDisclosure: 'ESL Disclosure',
  EslFaqStates: 'ESL FAQ States',
  EslProductCardsRow: 'ESL Product Cards Row',
  EslProductCardsRowVariant2: 'ESL Product Cards Row Variant 2',
  EslAccordionCardGrid: 'ESL Accordion Card Grid',
  EslSplitContentCta: 'ESL Split Content CTA',
  EslFeatureCardRow: 'ESL Feature Card Row',
  EslComparisonCardPair: 'ESL Comparison Card Pair',
  EslCompareTable: 'ESL Compare Table',
  EslFinalCta: 'ESL Final CTA',
  EslLearningHub: 'ESL Learning Hub',
  EslIconCardSingleColumnGrid: 'ESL Icon Card Single Column Grid',
  EslProductDetailExperience: 'ESL Product Detail Experience',
  EslProductFamilyExperience: 'ESL Product Family Experience',
  EslHomeExperience: 'ESL Home Experience',
  EslHomePage: 'ESL Home Page (Legacy)',
  EslLongTextLeftCardsRight: 'ESL Long Text Left Cards Right',
  EslFilterableProductCardGrid: 'ESL Filterable Product Card Grid',
  EslTableCtaLeftColumn: 'ESL Table CTA Left Column',
  EslProductPathways: 'ESL Product Pathways',
};

export function getAllowedSectionsFromContentType(
  ct: {
    mayContainTypes?:
      | readonly (string | { key?: string })[]
      | (string | { key?: string })[]
      | null;
  },
  nameLookup: Record<string, string> = KNOWN_COMPONENT_NAMES
): { allowedKeys: Set<string>; allowedSections: AllowedSectionItem[] } {
  const rawList = ct.mayContainTypes || [];
  const keys = rawList
    .map((item) => (typeof item === 'string' ? item : item?.key))
    .filter((k): k is string => typeof k === 'string' && k.length > 0 && k !== '_self');

  return {
    allowedKeys: new Set<string>(keys),
    allowedSections: keys.map((key) => ({
      key,
      displayName: nameLookup[key] || key,
    })),
  };
}

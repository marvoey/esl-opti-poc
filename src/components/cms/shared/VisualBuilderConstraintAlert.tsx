import React from 'react';

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

export type VisualBuilderConstraintAlertProps = {
  componentType: string;
  componentDisplayName?: string;
  pageDisplayName: string;
  allowedTypes: readonly AllowedSectionItem[];
};

export function VisualBuilderConstraintAlert({
  componentType,
  componentDisplayName,
  pageDisplayName,
  allowedTypes,
}: VisualBuilderConstraintAlertProps) {
  const displayTitle = componentDisplayName || componentType;

  return (
    <div
      role="alert"
      data-testid="visual-builder-constraint-alert"
      style={{
        margin: '24px auto',
        maxWidth: '1200px',
        padding: '20px 24px',
        borderRadius: '8px',
        backgroundColor: '#fffbeb',
        border: '2px dashed #f59e0b',
        color: '#78350f',
        fontFamily: 'var(--font-family-sans, system-ui, -apple-system, sans-serif)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px' }} aria-hidden="true">
          ⚠️
        </span>
        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#92400e' }}>
          Visual Builder Constraint: Unallowed Section
        </h4>
      </div>
      <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: 1.5, color: '#92400e' }}>
        The section <strong>&ldquo;{displayTitle}&rdquo;</strong> is not permitted on{' '}
        <strong>{pageDisplayName}</strong>.
      </p>
      <div style={{ fontSize: '13px', lineHeight: 1.4, color: '#78350f' }}>
        <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>Allowed sections for this page:</p>
        <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px' }}>
          {allowedTypes.map((item) => (
            <li key={item.key}>{item.displayName}</li>
          ))}
        </ul>
        <p style={{ margin: 0, fontStyle: 'italic', color: '#b45309' }}>
          To resolve this warning, please delete this section from the Visual Builder outline. This
          unallowed section will not be displayed on the live public website.
        </p>
      </div>
    </div>
  );
}

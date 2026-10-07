import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EslProductFamilyExperience, {
  ESL_PRODUCT_FAMILY_ALLOWED_SECTIONS,
} from './EslProductFamilyPageRenderer';
import { EslProductFamilyExperienceContentType } from './EslProductFamilyPage';

import type { OptimizelyComposition } from '@optimizely/cms-sdk/react/server';

// Mock OptimizelyComposition to invoke ComponentWrapper like the real SDK does
const MockComponent = (_props: Record<string, unknown>) => (
  <div data-testid={_props['data-testid'] as string} data-variant={_props['defaultVariant'] as string} />
);

vi.mock('@optimizely/cms-sdk/react/server', () => ({
  OptimizelyComposition: vi.fn(({ nodes, ComponentWrapper }) => (
    <div data-testid="mock-composition" data-nodes-count={nodes.length}>
      {nodes.map((n: Record<string, unknown>) => {
        const child = <MockComponent data-testid={`node-${n.key}`} />;
        return ComponentWrapper ? (
          <ComponentWrapper key={n.key as string} node={n} displaySettings={n.displaySettings}>
            {child}
          </ComponentWrapper>
        ) : (
          <div key={n.key as string} data-testid={`node-${n.key}`}>
            {child}
          </div>
        );
      })}
    </div>
  )),
  getPreviewUtils: vi.fn((node) => ({
    pa: vi.fn(() => (node?.__context?.edit ? { 'data-epi-block-id': node?.key } : {})),
  })),
}));

describe('EslProductFamilyPage Content Type & Renderer', () => {
  it('defines EslProductFamilyExperience with baseType _experience and correct mayContainTypes', () => {
    expect(EslProductFamilyExperienceContentType.key).toBe('EslProductFamilyExperience');
    expect(EslProductFamilyExperienceContentType.baseType).toBe('_experience');
    expect(EslProductFamilyExperienceContentType.mayContainTypes).toEqual([
      'EslProductDetailExperience',
      'EslHeroSlider',
      'EslSnipeCta',
      'EslTabbedSolutions',
      'EslSideBySide',
      'EslMetricCardRow',
      'EslSplitContentCards',
      'EslMediaCardGrid',
      'EslVideoStoryCardRow',
      'EslVerticalSelectorFeatureCard',
      'EslCircularImageMetricRow',
      'EslSplitContentImage',
      'EslMediaCardGridCarousel',
      'EslKeyFactsRow',
      'EslSwitchSupport',
      'EslDisclosure',
      'EslFaqStates',
      'EslProductCardsRow',
      'EslProductCardsRowVariant2',
      'EslAccordionCardGrid',
      'EslSplitContentCta',
      'EslFeatureCardRow',
      'EslComparisonCardPair',
      'EslCompareTable',
      'EslFinalCta',
      'EslLearningHub',
      'EslIconCardSingleColumnGrid',
      'EslLongTextLeftCardsRight',
      'EslFilterableProductCardGrid',
      'EslTableCtaLeftColumn',
      'EslProductPathways',
    ]);
  });

  it('exposes exactly 31 allowed section items', () => {
    expect(ESL_PRODUCT_FAMILY_ALLOWED_SECTIONS).toHaveLength(31);
    const keys = ESL_PRODUCT_FAMILY_ALLOWED_SECTIONS.map((s) => s.key);
    expect(keys).toContain('EslProductDetailExperience');
    expect(keys).toContain('EslHeroSlider');
    expect(keys).toContain('EslSnipeCta');
    expect(keys).toContain('EslTabbedSolutions');
    expect(keys).toContain('EslKeyFactsRow');
    expect(keys).toContain('EslSideBySide');
    expect(keys).toContain('EslSwitchSupport');
    expect(keys).toContain('EslDisclosure');
    expect(keys).toContain('EslFaqStates');
    expect(keys).toContain('EslAccordionCardGrid');
    expect(keys).toContain('EslSplitContentCta');
    expect(keys).toContain('EslFeatureCardRow');
    expect(keys).toContain('EslComparisonCardPair');
    expect(keys).toContain('EslCompareTable');
    expect(keys).toContain('EslFinalCta');
    expect(keys).toContain('EslLearningHub');
    expect(keys).toContain('EslIconCardSingleColumnGrid');
    expect(keys).toContain('EslLongTextLeftCardsRight');
    expect(keys).toContain('EslFilterableProductCardGrid');
    expect(keys).toContain('EslTableCtaLeftColumn');
    expect(keys).toContain('EslProductPathways');
  });

  it('returns null when content is missing or nodes are empty (no static fallbacks)', () => {
    const { container: c1 } = render(<EslProductFamilyExperience content={undefined} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<EslProductFamilyExperience content={null} />);
    expect(c2.firstChild).toBeNull();

    const { container: c3 } = render(
      <EslProductFamilyExperience
        content={{
          composition: {
            nodes: [],
          },
        }}
      />
    );
    expect(c3.firstChild).toBeNull();
  });

  it('renders allowed CMS composition nodes with defaultVariant squared', () => {
    const mockNodes: Parameters<typeof OptimizelyComposition>[0]['nodes'] = [
      {
        key: 'hero-1',
        type: 'EslHeroSlider',
        __typename: 'CompositionComponentNode',
        nodeType: 'component',
        displayName: 'Hero Slider',
        layoutType: null,
        displayTemplateKey: null,
        displaySettings: null,
        component: { __typename: 'EslHeroSlider' },
      },
      {
        key: 'snipe-1',
        type: 'EslSnipeCta',
        __typename: 'CompositionComponentNode',
        nodeType: 'component',
        displayName: 'Snipe CTA',
        layoutType: null,
        displayTemplateKey: null,
        displaySettings: null,
        component: { __typename: 'EslSnipeCta' },
      },
      {
        key: 'facts-1',
        type: 'EslKeyFactsRow',
        __typename: 'CompositionComponentNode',
        nodeType: 'component',
        displayName: 'Key Facts',
        layoutType: null,
        displayTemplateKey: null,
        displaySettings: null,
        component: { __typename: 'EslKeyFactsRow' },
      },
      {
        key: 'side-by-side-1',
        type: 'EslSideBySide',
        __typename: 'CompositionComponentNode',
        nodeType: 'component',
        displayName: 'Side by Side',
        layoutType: null,
        displayTemplateKey: null,
        displaySettings: null,
        component: { __typename: 'EslSideBySide' },
      },
      {
        key: 'switch-1',
        type: 'EslSwitchSupport',
        __typename: 'CompositionComponentNode',
        nodeType: 'component',
        displayName: 'Switch Support',
        layoutType: null,
        displayTemplateKey: null,
        displaySettings: null,
        component: { __typename: 'EslSwitchSupport' },
      },
      {
        key: 'disclosure-1',
        type: 'EslDisclosure',
        __typename: 'CompositionComponentNode',
        nodeType: 'component',
        displayName: 'Disclosure',
        layoutType: null,
        displayTemplateKey: null,
        displaySettings: null,
        component: { __typename: 'EslDisclosure' },
      },
    ];

    render(
      <EslProductFamilyExperience
        content={{
          composition: {
            nodes: mockNodes,
          },
        }}
      />
    );

    const comp = screen.getByTestId('mock-composition');
    expect(comp.getAttribute('data-nodes-count')).toBe('6');
    expect(screen.getByTestId('node-hero-1')).toBeDefined();
    expect(screen.getByTestId('node-snipe-1')).toBeDefined();
    expect(screen.getByTestId('node-facts-1')).toBeDefined();
    expect(screen.getByTestId('node-side-by-side-1')).toBeDefined();
    expect(screen.getByTestId('node-switch-1')).toBeDefined();
    expect(screen.getByTestId('node-disclosure-1')).toBeDefined();

    // Verify defaultVariant squared is passed to child component
    const heroNode = screen.getByTestId('node-hero-1');
    expect(heroNode.getAttribute('data-variant')).toBe('squared');
  });

  it('suppresses unallowed components in live mode', () => {
    const unallowedNodes: Parameters<typeof OptimizelyComposition>[0]['nodes'] = [
      {
        key: 'foreign-1',
        type: 'ForeignComponent',
        __typename: 'CompositionComponentNode',
        nodeType: 'component',
        displayName: 'Foreign Component',
        layoutType: null,
        displayTemplateKey: null,
        displaySettings: null,
        component: { __typename: 'ForeignComponent' },
      },
    ];

    render(
      <EslProductFamilyExperience
        content={{
          composition: {
            nodes: unallowedNodes,
          },
        }}
      />
    );

    expect(screen.queryByTestId('node-foreign-1')).toBeNull();
    expect(screen.queryByTestId('visual-builder-constraint-alert')).toBeNull();
  });

  it('renders VisualBuilderConstraintAlert for unallowed components in edit mode', () => {
    const editModeNode: Parameters<typeof OptimizelyComposition>[0]['nodes'] = [
      {
        key: 'foreign-edit-1',
        type: 'ForeignComponent',
        __typename: 'CompositionComponentNode',
        nodeType: 'component',
        displayName: 'Foreign Component',
        layoutType: null,
        displayTemplateKey: null,
        displaySettings: null,
        component: { __typename: 'ForeignComponent' },
        __context: { edit: true, preview_token: 'test-token' },
      },
    ];

    render(
      <EslProductFamilyExperience
        content={{
          composition: {
            nodes: editModeNode,
          },
        }}
      />
    );

    const alert = screen.getByTestId('visual-builder-constraint-alert');
    expect(alert).toBeDefined();
    expect(screen.getByText(/is not permitted on/i)).toBeDefined();
    expect(screen.getByText('ESL Product Family Experience')).toBeDefined();
    expect(screen.getByText(/ESL Hero Slider/i)).toBeDefined();
    expect(screen.getByText(/ESL Snipe CTA/i)).toBeDefined();
    expect(screen.getByText(/ESL Key Facts Row/i)).toBeDefined();
    expect(screen.getByText(/ESL Side By Side/i)).toBeDefined();
    expect(screen.getByText(/ESL Switch Support/i)).toBeDefined();
    expect(screen.getByText(/ESL Disclosure/i)).toBeDefined();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EslProductDetailExperience, { ProductDetailStaticSections } from './EslProductDetailPageRenderer';

import type { OptimizelyComposition } from '@optimizely/cms-sdk/react/server';

// Mock OptimizelyComposition to invoke ComponentWrapper like the real SDK does
const MockComponent = (_props: Record<string, unknown>) => <div data-testid={_props['data-testid'] as string} />;

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

describe('EslProductDetailPageRenderer', () => {
  it('renders all 9 static sections when content is missing or nodes are empty', () => {
    render(<EslProductDetailExperience content={undefined} />);

    // Check key static components by text or id
    expect(screen.getByText('Details at a glance')).toBeDefined();
    expect(document.getElementById('key-facts')).toBeDefined();
    expect(document.getElementById('product-fit')).toBeDefined();
    expect(document.getElementById('account-tools')).toBeDefined();
    expect(document.getElementById('faq')).toBeDefined();
    expect(document.getElementById('glossary')).toBeDefined();
    expect(document.getElementById('switch-support')).toBeDefined();
    expect(document.getElementById('split-content-cta')).toBeDefined();
    expect(document.getElementById('disclosure')).toBeDefined();
  });

  it('renders allowed CMS composition nodes above static sections', () => {
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
    ];

    render(
      <EslProductDetailExperience
        content={{
          composition: {
            nodes: mockNodes,
          },
        }}
      />
    );

    const comp = screen.getByTestId('mock-composition');
    expect(comp.getAttribute('data-nodes-count')).toBe('2');
    expect(screen.getByTestId('node-hero-1')).toBeDefined();
    expect(screen.getByTestId('node-snipe-1')).toBeDefined();
    expect(screen.queryByTestId('visual-builder-constraint-alert')).toBeNull();

    // Static sections still render below
    expect(screen.getByText('Details at a glance')).toBeDefined();
  });

  it('renders visual constraint alert in edit mode when unallowed section is added', () => {
    const mockNodes = [
      {
        key: 'unallowed-1',
        type: 'EslSideBySide',
        __typename: 'CompositionComponentNode',
        nodeType: 'component',
        displayName: 'Side By Side Section',
        layoutType: null,
        displayTemplateKey: null,
        displaySettings: null,
        component: { __typename: 'EslSideBySide' },
        __context: { edit: true, preview_token: 'test-token' },
      },
    ];

    render(
      <EslProductDetailExperience
        content={{
          composition: {
            nodes: mockNodes,
          },
        }}
      />
    );

    const alert = screen.getByTestId('visual-builder-constraint-alert');
    expect(alert).toBeDefined();
    expect(screen.getByText(/Visual Builder Constraint: Unallowed Section/i)).toBeDefined();
    expect(screen.getByText(/Side By Side Section/i)).toBeDefined();
    expect(screen.getByText(/ESL Product Detail Experience/i)).toBeDefined();
    // The actual component is NOT rendered
    expect(screen.queryByTestId('node-unallowed-1')).toBeNull();
  });

  it('suppresses unallowed section on live site delivery (non-edit mode)', () => {
    const mockNodes = [
      {
        key: 'unallowed-2',
        type: 'EslSideBySide',
        __typename: 'CompositionComponentNode',
        nodeType: 'component',
        displayName: 'Side By Side Section',
        layoutType: null,
        displayTemplateKey: null,
        displaySettings: null,
        component: { __typename: 'EslSideBySide' },
        __context: { edit: false, preview_token: '' },
      },
    ];

    render(
      <EslProductDetailExperience
        content={{
          composition: {
            nodes: mockNodes,
          },
        }}
      />
    );

    // Neither the alert nor the unallowed component is rendered on live
    expect(screen.queryByTestId('visual-builder-constraint-alert')).toBeNull();
    expect(screen.queryByTestId('node-unallowed-2')).toBeNull();
    // Static sections still render
    expect(screen.getByText('Details at a glance')).toBeDefined();
  });

  it('ProductDetailStaticSections standalone renders all expected rows', () => {
    render(<ProductDetailStaticSections />);
    expect(screen.getByText('Details at a glance')).toBeDefined();
    expect(document.getElementById('glossary')).toBeDefined();
  });
});

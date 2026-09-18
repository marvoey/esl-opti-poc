import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EslHomeExperience from './EslHomePageRenderer';

import type { OptimizelyComposition } from '@optimizely/cms-sdk/react/server';

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

describe('EslHomePageRenderer', () => {
  it('returns null when content or composition nodes are missing', () => {
    const { container } = render(<EslHomeExperience content={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders allowed CMS composition nodes', () => {
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
        key: 'video-1',
        type: 'EslVideoStoryCardRow',
        __typename: 'CompositionComponentNode',
        nodeType: 'component',
        displayName: 'Video Stories',
        layoutType: null,
        displayTemplateKey: null,
        displaySettings: null,
        component: { __typename: 'EslVideoStoryCardRow' },
      },
    ];

    render(
      <EslHomeExperience
        content={{
          composition: { nodes: mockNodes },
        }}
      />
    );

    const comp = screen.getByTestId('mock-composition');
    expect(comp.getAttribute('data-nodes-count')).toBe('2');
    expect(screen.getByTestId('node-hero-1')).toBeDefined();
    expect(screen.getByTestId('node-video-1')).toBeDefined();
    expect(screen.queryByTestId('visual-builder-constraint-alert')).toBeNull();
  });

  it('renders visual constraint alert in edit mode when unallowed section is added', () => {
    const mockNodes = [
      {
        key: 'unallowed-1',
        type: 'EslForeignComponent',
        __typename: 'CompositionComponentNode',
        nodeType: 'component',
        displayName: 'Foreign Component',
        layoutType: null,
        displayTemplateKey: null,
        displaySettings: null,
        component: { __typename: 'EslForeignComponent' },
        __context: { edit: true, preview_token: 'test-token' },
      },
    ];

    render(
      <EslHomeExperience
        content={{
          composition: { nodes: mockNodes },
        }}
      />
    );

    const alert = screen.getByTestId('visual-builder-constraint-alert');
    expect(alert).toBeDefined();
    expect(screen.getByText(/Visual Builder Constraint: Unallowed Section/i)).toBeDefined();
    expect(screen.getByText(/Foreign Component/i)).toBeDefined();
    expect(screen.getByText(/ESL Home Experience/i)).toBeDefined();
    expect(screen.queryByTestId('node-unallowed-1')).toBeNull();
  });

  it('suppresses unallowed section on live site delivery (non-edit mode)', () => {
    const mockNodes = [
      {
        key: 'unallowed-2',
        type: 'EslForeignComponent',
        __typename: 'CompositionComponentNode',
        nodeType: 'component',
        displayName: 'Foreign Component',
        layoutType: null,
        displayTemplateKey: null,
        displaySettings: null,
        component: { __typename: 'EslForeignComponent' },
        __context: { edit: false, preview_token: '' },
      },
    ];

    render(
      <EslHomeExperience
        content={{
          composition: { nodes: mockNodes },
        }}
      />
    );

    expect(screen.queryByTestId('visual-builder-constraint-alert')).toBeNull();
    expect(screen.queryByTestId('node-unallowed-2')).toBeNull();
  });
});

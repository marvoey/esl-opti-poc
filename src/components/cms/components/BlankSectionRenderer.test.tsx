import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { ComponentContainerProps, StructureContainerProps } from '@optimizely/cms-sdk/react/server';
import BlankSection from './BlankSectionRenderer';

type GridProps = {
  nodes: Array<Record<string, unknown>>;
  row: React.ComponentType<StructureContainerProps>;
  column: React.ComponentType<StructureContainerProps>;
  ComponentWrapper: React.ComponentType<ComponentContainerProps>;
};

// Minimal stand-in for the SDK grid: section > row > column > element.
function MockGrid({ nodes, row: Row, column: Column, ComponentWrapper }: GridProps): React.ReactElement {
  return (
    <>
      {nodes.map((node) => {
        const key = node.key as string;
        if (node.nodeType === 'component') {
          return (
            <ComponentWrapper key={key} node={node as unknown as ComponentContainerProps['node']}>
              <span data-testid={`element-${key}`} />
            </ComponentWrapper>
          );
        }
        const Container = node.nodeType === 'row' ? Row : Column;
        return (
          <Container key={key} node={node as unknown as StructureContainerProps['node']}>
            <MockGrid
              nodes={(node.nodes as Array<Record<string, unknown>>) ?? []}
              row={Row}
              column={Column}
              ComponentWrapper={ComponentWrapper}
            />
          </Container>
        );
      })}
    </>
  );
}

vi.mock('@optimizely/cms-sdk/react/server', () => ({
  OptimizelyGridSection: vi.fn((props: GridProps) => <MockGrid {...props} />),
  getPreviewUtils: vi.fn((content) => ({
    pa: vi.fn((node) => (content?.__context?.edit ? { 'data-epi-block-id': node?.key } : {})),
  })),
}));

type SectionContent = React.ComponentProps<typeof BlankSection>['content'];

const edit = { __context: { edit: true } };

const section = {
  ...edit,
  key: 'section-1',
  nodes: [
    {
      ...edit,
      key: 'row-1',
      nodeType: 'row',
      nodes: [
        {
          ...edit,
          key: 'column-1',
          nodeType: 'column',
          nodes: [{ ...edit, key: 'element-1', nodeType: 'component' }],
        },
      ],
    },
  ],
} as unknown as SectionContent;

describe('BlankSectionRenderer', () => {
  it('returns null without content', () => {
    const { container } = render(<BlankSection content={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders rows, columns and elements', () => {
    render(<BlankSection content={section} />);
    expect(screen.getByTestId('element-element-1')).toBeTruthy();
  });

  it('marks section, row, column and element as selectable in edit mode', () => {
    const { container } = render(<BlankSection content={section} />);
    const ids = Array.from(container.querySelectorAll('[data-epi-block-id]')).map((el) =>
      el.getAttribute('data-epi-block-id')
    );
    expect(ids).toEqual(['section-1', 'row-1', 'column-1', 'element-1']);
  });

  it('renders nothing for an empty section outside edit mode', () => {
    const { container } = render(
      <BlankSection content={{ key: 'section-1', nodes: [] } as unknown as SectionContent} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('keeps an empty section in edit mode', () => {
    const { container } = render(
      <BlankSection content={{ ...edit, key: 'section-1', nodes: [] } as unknown as SectionContent} />
    );
    expect(container.querySelector('[data-epi-block-id="section-1"]')).not.toBeNull();
  });

  it('adds no preview attributes outside edit mode', () => {
    const { container } = render(
      <BlankSection
        content={{ key: 'section-1', nodes: [{ key: 'element-1', nodeType: 'component' }] } as unknown as SectionContent}
      />
    );
    expect(container.querySelector('[data-epi-block-id]')).toBeNull();
  });
});

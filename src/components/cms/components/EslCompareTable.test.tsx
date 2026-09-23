import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EslCompareTable from './EslCompareTableRenderer';
import { EslCompareTableContentType } from './EslCompareTable';

describe('EslCompareTable CMS Component', () => {
  it('defines EslCompareTable with expected properties and composition behaviors', () => {
    expect(EslCompareTableContentType.key).toBe('EslCompareTable');
    expect(EslCompareTableContentType.displayName).toBe('ESL Compare Table');
    expect(EslCompareTableContentType.baseType).toBe('_component');
    expect(EslCompareTableContentType.compositionBehaviors).toContain('sectionEnabled');
    expect(EslCompareTableContentType.compositionBehaviors).toContain('elementEnabled');

    const props = EslCompareTableContentType.properties;
    expect(props).toBeDefined();
    expect(props.showCompareTable.type).toBe('boolean');
    expect(props.heading.type).toBe('string');
  });

  it('renders default CompareTable when showCompareTable is true or undefined', () => {
    render(<EslCompareTable content={{ showCompareTable: true }} />);
    expect(
      screen.getByText('The differences that matter.')
    ).toBeDefined();
    expect(screen.getByText('SIDE BY SIDE')).toBeDefined();
  });

  it('renders null when showCompareTable is explicitly false', () => {
    const { container } = render(
      <EslCompareTable content={{ showCompareTable: false }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('applies heading override when provided', () => {
    render(
      <EslCompareTable
        content={{
          showCompareTable: true,
          heading: 'Custom Compare Table Heading',
        }}
      />
    );
    expect(screen.getByText('Custom Compare Table Heading')).toBeDefined();
  });

  it('unwraps nested component object correctly', () => {
    render(
      <EslCompareTable
        content={{
          component: {
            showCompareTable: true,
            heading: 'Nested Compare Table Heading',
          },
        }}
      />
    );
    expect(screen.getByText('Nested Compare Table Heading')).toBeDefined();
  });
});

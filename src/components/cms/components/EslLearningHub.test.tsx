import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EslLearningHub from './EslLearningHubRenderer';
import { EslLearningHubContentType } from './EslLearningHub';

describe('EslLearningHub CMS Component', () => {
  it('defines EslLearningHub with expected properties and composition behaviors', () => {
    expect(EslLearningHubContentType.key).toBe('EslLearningHub');
    expect(EslLearningHubContentType.displayName).toBe('ESL Learning Hub');
    expect(EslLearningHubContentType.baseType).toBe('_component');
    expect(EslLearningHubContentType.compositionBehaviors).toContain('sectionEnabled');
    expect(EslLearningHubContentType.compositionBehaviors).toContain('elementEnabled');

    const props = EslLearningHubContentType.properties;
    expect(props).toBeDefined();
    expect(props.showLearningHub.type).toBe('boolean');
    expect(props.heading.type).toBe('string');
  });

  it('renders default LearningHub when showLearningHub is true or undefined', () => {
    render(<EslLearningHub content={{ showLearningHub: true }} />);
    expect(
      screen.getByText("Smart moves for the money you're setting aside.")
    ).toBeDefined();
    expect(screen.getByText('FINANCIAL WELLNESS')).toBeDefined();
    expect(screen.getByText('Explore the Financial Wellness Hub')).toBeDefined();
  });

  it('renders null when showLearningHub is explicitly false', () => {
    const { container } = render(
      <EslLearningHub content={{ showLearningHub: false }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('applies heading override when provided', () => {
    render(
      <EslLearningHub
        content={{
          showLearningHub: true,
          heading: 'Custom Learning Hub Heading',
        }}
      />
    );
    expect(screen.getByText('Custom Learning Hub Heading')).toBeDefined();
  });

  it('unwraps nested component object correctly', () => {
    render(
      <EslLearningHub
        content={{
          component: {
            showLearningHub: true,
            heading: 'Nested Learning Hub Heading',
          },
        }}
      />
    );
    expect(screen.getByText('Nested Learning Hub Heading')).toBeDefined();
  });
});

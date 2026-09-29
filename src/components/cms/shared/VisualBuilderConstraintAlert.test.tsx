import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VisualBuilderConstraintAlert } from './VisualBuilderConstraintAlert';
import { getAllowedSectionsFromContentType, type AllowedSectionItem } from './visualBuilderConstraintUtils';

describe('VisualBuilderConstraintAlert', () => {
  const mockAllowedTypes: readonly AllowedSectionItem[] = [
    { key: 'EslHeroSlider', displayName: 'ESL Hero Slider' },
    { key: 'EslSnipeCta', displayName: 'ESL Snipe CTA' },
  ];

  it('renders alert with component type and page name', () => {
    render(
      <VisualBuilderConstraintAlert
        componentType="EslTabbedSolutions"
        pageDisplayName="ESL Product Detail Experience"
        allowedTypes={mockAllowedTypes}
      />
    );

    const alert = screen.getByRole('alert');
    expect(alert).toBeDefined();
    expect(screen.getByText(/Visual Builder Constraint: Unallowed Section/i)).toBeDefined();
    expect(screen.getByText(/EslTabbedSolutions/i)).toBeDefined();
    expect(screen.getByText(/ESL Product Detail Experience/i)).toBeDefined();
  });

  it('renders componentDisplayName when provided', () => {
    render(
      <VisualBuilderConstraintAlert
        componentType="EslTabbedSolutions"
        componentDisplayName="Custom Solutions Block"
        pageDisplayName="ESL Product Detail Experience"
        allowedTypes={mockAllowedTypes}
      />
    );

    expect(screen.getByText(/Custom Solutions Block/i)).toBeDefined();
  });

  it('lists all allowed section items', () => {
    render(
      <VisualBuilderConstraintAlert
        componentType="EslSideBySide"
        pageDisplayName="ESL Product Detail Experience"
        allowedTypes={mockAllowedTypes}
      />
    );

    expect(screen.getByText('ESL Hero Slider')).toBeDefined();
    expect(screen.getByText('ESL Snipe CTA')).toBeDefined();
  });

  describe('getAllowedSectionsFromContentType', () => {
    it('extracts keys and friendly display names from mayContainTypes array', () => {
      const mockContentType = {
        key: 'TestPage',
        displayName: 'Test Page',
        mayContainTypes: ['EslHeroSlider', 'EslSnipeCta', 'CustomUnknownBlock'],
      };

      const result = getAllowedSectionsFromContentType(mockContentType);

      expect(result.allowedKeys.has('EslHeroSlider')).toBe(true);
      expect(result.allowedKeys.has('EslSnipeCta')).toBe(true);
      expect(result.allowedKeys.has('CustomUnknownBlock')).toBe(true);
      expect(result.allowedKeys.has('NotAllowedBlock')).toBe(false);

      expect(result.allowedSections).toEqual([
        { key: 'EslHeroSlider', displayName: 'ESL Hero Slider' },
        { key: 'EslSnipeCta', displayName: 'ESL Snipe CTA' },
        { key: 'CustomUnknownBlock', displayName: 'CustomUnknownBlock' },
      ]);
    });

    it('handles empty or undefined mayContainTypes safely', () => {
      const result = getAllowedSectionsFromContentType({ mayContainTypes: undefined });
      expect(result.allowedKeys.size).toBe(0);
      expect(result.allowedSections).toEqual([]);
    });

    it('filters out _self keyword and empty strings', () => {
      const result = getAllowedSectionsFromContentType({
        mayContainTypes: ['_self', '', 'EslHeroSlider'],
      });
      expect(result.allowedKeys.has('_self')).toBe(false);
      expect(result.allowedKeys.has('EslHeroSlider')).toBe(true);
      expect(result.allowedSections.length).toBe(1);
    });
  });
});

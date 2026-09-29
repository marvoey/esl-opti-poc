import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EslStartPageContentType } from './EslStartPage';
import EslStartPage from './EslStartPageRenderer';
import { getAllowedSectionsFromContentType } from '../shared/visualBuilderConstraintUtils';

describe('EslStartPage', () => {
  it('defines EslStartPageContentType with baseType _page and mayContainTypes limited to ESL Home Experience and ESL Home Legacy', () => {
    expect(EslStartPageContentType.key).toBe('EslStartPage');
    expect(EslStartPageContentType.displayName).toBe('ESL Start Page');
    expect(EslStartPageContentType.baseType).toBe('_page');
    expect(EslStartPageContentType.mayContainTypes).toEqual([
      'EslHomeExperience',
      'EslHomePage',
    ]);
  });

  it('resolves exactly 2 allowed section types with friendly display names', () => {
    const { allowedKeys, allowedSections } = getAllowedSectionsFromContentType(EslStartPageContentType);
    expect(allowedKeys.size).toBe(2);
    expect(allowedKeys.has('EslHomeExperience')).toBe(true);
    expect(allowedKeys.has('EslHomePage')).toBe(true);
    expect(allowedKeys.has('EslProductDetailExperience')).toBe(false);
    expect(allowedKeys.has('EslProductFamilyExperience')).toBe(false);

    expect(allowedSections).toEqual([
      { key: 'EslHomeExperience', displayName: 'ESL Home Experience' },
      { key: 'EslHomePage', displayName: 'ESL Home Page (Legacy)' },
    ]);
  });

  it('renders default site root container when content is empty', () => {
    render(<EslStartPage content={undefined} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('ESL Site Root');
    expect(screen.getByText('ESL Start Page site root container.')).toBeDefined();
  });

  it('renders configured title when content is provided', () => {
    render(<EslStartPage content={{ title: 'Custom Site Title' }} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Custom Site Title');
  });
});

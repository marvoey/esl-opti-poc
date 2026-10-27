import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EslContentPageContentType } from './EslContentPage';
import EslContentPage from './EslContentPageRenderer';

describe('EslContentPage', () => {
  it('defines EslContentPageContentType with baseType _page', () => {
    expect(EslContentPageContentType.key).toBe('EslContentPage');
    expect(EslContentPageContentType.baseType).toBe('_page');
  });

  it('renders a fallback heading when content is empty', () => {
    render(<EslContentPage content={undefined} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Untitled page');
  });

  it('renders title and intro', () => {
    render(<EslContentPage content={{ title: 'Hello', intro: 'Welcome' }} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Hello');
    expect(screen.getByText('Welcome')).toBeDefined();
  });
});

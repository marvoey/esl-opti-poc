import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EslSwitchSupport from './EslSwitchSupportRenderer';
import { EslSwitchSupportContentType } from './EslSwitchSupport';
import { EslSwitchSupportStepContentType } from './EslSwitchSupportStep';

vi.mock('@optimizely/cms-sdk/react/richText', () => ({
  RichText: ({ content }: { content: Record<string, unknown> }) => (
    <div data-testid="mock-rich-text">{JSON.stringify(content)}</div>
  ),
}));

function mockRichText(text: string) {
  return {
    html: `<p>${text}</p>`,
    json: {
      type: 'richText' as const,
      children: [{ text }],
    },
  };
}

describe('EslSwitchSupport Content Type & Renderer', () => {
  it('defines EslSwitchSupport with expected properties', () => {
    expect(EslSwitchSupportContentType.key).toBe('EslSwitchSupport');
    expect(EslSwitchSupportContentType.displayName).toBe('ESL Switch Support');
    expect(EslSwitchSupportContentType.baseType).toBe('_component');
    expect(EslSwitchSupportContentType.properties.eyebrow).toBeDefined();
    expect(EslSwitchSupportContentType.properties.title).toBeDefined();
    expect(EslSwitchSupportContentType.properties.steps).toBeDefined();
    expect(EslSwitchSupportContentType.properties.cta).toBeDefined();
    expect(EslSwitchSupportContentType.properties.link).toBeDefined();
  });

  it('defines EslSwitchSupportStep with expected properties', () => {
    expect(EslSwitchSupportStepContentType.key).toBe('EslSwitchSupportStep');
    expect(EslSwitchSupportStepContentType.displayName).toBe('ESL Switch Support Step');
    expect(EslSwitchSupportStepContentType.baseType).toBe('_component');
    expect(EslSwitchSupportStepContentType.properties.step).toBeDefined();
    expect(EslSwitchSupportStepContentType.properties.title).toBeDefined();
    expect(EslSwitchSupportStepContentType.properties.description).toBeDefined();
  });

  it('returns null when content is undefined or empty', () => {
    const { container: c1 } = render(<EslSwitchSupport content={undefined} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<EslSwitchSupport content={null} />);
    expect(c2.firstChild).toBeNull();

    const { container: c3 } = render(<EslSwitchSupport content={{}} />);
    expect(c3.firstChild).toBeNull();
  });

  it('renders full section with eyebrow, title, rich text description, steps, and CTAs', () => {
    render(
      <EslSwitchSupport
        content={{
          eyebrow: 'Simple Transition',
          title: 'Switching is simpler than it sounds.',
          description: mockRichText('Easy steps to get started'),
          steps: [
            {
              step: 1,
              title: 'A photo ID',
              description: mockRichText('Driver license or passport'),
            },
            {
              step: 2,
              title: 'Your SSN',
              description: mockRichText('And date of birth'),
            },
          ],
          cta: {
            text: 'Open Account',
            url: { default: '/open' },
          },
          link: {
            text: 'Switch checklist',
            url: { default: '/checklist' },
          },
        }}
      />
    );

    expect(screen.getByText('Simple Transition')).toBeDefined();
    expect(screen.getByText('Switching is simpler than it sounds.')).toBeDefined();
    expect(screen.getByText('A photo ID')).toBeDefined();
    expect(screen.getByText('Your SSN')).toBeDefined();
    expect(screen.getByRole('link', { name: /Open Account/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /Switch checklist/i })).toBeDefined();
  });

  it('omits eyebrow gracefully when not provided in CMS', () => {
    render(
      <EslSwitchSupport
        content={{
          title: 'Switching is simpler than it sounds.',
          steps: [
            {
              step: 1,
              title: 'A photo ID',
              description: 'Plain description',
            },
          ],
        }}
      />
    );

    expect(screen.getByText('Switching is simpler than it sounds.')).toBeDefined();
    expect(screen.queryByText('Simple Transition')).toBeNull();
    expect(screen.getByText('A photo ID')).toBeDefined();
  });

  it('renders rich text description when provided via switchDescription alias', () => {
    render(
      <EslSwitchSupport
        content={{
          title: 'Switching is simpler than it sounds.',
          switchDescription: mockRichText('Aliased description text'),
          steps: [
            {
              step: 1,
              title: 'A photo ID',
              description: 'Step 1 description',
            },
          ],
        }}
      />
    );

    expect(screen.getByText('Switching is simpler than it sounds.')).toBeDefined();
    expect(screen.getByTestId('mock-rich-text')).toBeDefined();
  });
});

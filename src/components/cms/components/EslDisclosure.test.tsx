import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EslDisclosure from './EslDisclosureRenderer';
import { EslDisclosureContentType } from './EslDisclosure';
import { EslDisclosureItemContentType } from './EslDisclosureItem';

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

describe('EslDisclosure Content Type & Renderer', () => {
  it('defines EslDisclosure with expected properties', () => {
    expect(EslDisclosureContentType.key).toBe('EslDisclosure');
    expect(EslDisclosureContentType.displayName).toBe('ESL Disclosure');
    expect(EslDisclosureContentType.baseType).toBe('_component');
    expect(EslDisclosureContentType.properties.heading).toBeDefined();
    expect(EslDisclosureContentType.properties.items).toBeDefined();
  });

  it('defines EslDisclosureItem with expected properties', () => {
    expect(EslDisclosureItemContentType.key).toBe('EslDisclosureItem');
    expect(EslDisclosureItemContentType.displayName).toBe('ESL Disclosure Item');
    expect(EslDisclosureItemContentType.baseType).toBe('_component');
    expect(EslDisclosureItemContentType.properties.boldText).toBeDefined();
    expect(EslDisclosureItemContentType.properties.regularText).toBeDefined();
    expect(EslDisclosureItemContentType.properties.regularText.type).toBe('richText');
  });

  it('returns null when content is undefined or empty', () => {
    const { container: c1 } = render(<EslDisclosure content={undefined} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<EslDisclosure content={null} />);
    expect(c2.firstChild).toBeNull();

    const { container: c3 } = render(<EslDisclosure content={{}} />);
    expect(c3.firstChild).toBeNull();

    const { container: c4 } = render(<EslDisclosure content={{ items: [] }} />);
    expect(c4.firstChild).toBeNull();
  });

  it('renders section with heading, bold text, and rich text regular text', () => {
    render(
      <EslDisclosure
        content={{
          heading: 'IMPORTANT DISCLOSURES:',
          items: [
            {
              boldText: 'Online Banking Agreement.',
              regularText: mockRichText('Subject to terms and conditions.'),
            },
            {
              boldText: 'Deposit Insurance.',
              regularText: 'Federally insured by NCUA.',
            },
          ],
        }}
      />
    );

    expect(screen.getByText('IMPORTANT DISCLOSURES:')).toBeDefined();
    expect(screen.getByText('Online Banking Agreement.')).toBeDefined();
    expect(screen.getByTestId('mock-rich-text')).toBeDefined();
    expect(screen.getByText('Deposit Insurance.')).toBeDefined();
    expect(screen.getByText('Federally insured by NCUA.')).toBeDefined();
  });

  it('uses default heading when heading is omitted in CMS', () => {
    render(
      <EslDisclosure
        content={{
          items: [
            {
              boldText: 'Notice:',
              regularText: 'Terms apply.',
            },
          ],
        }}
      />
    );

    expect(screen.getByText('DISCLOSURES:')).toBeDefined();
    expect(screen.getByText('Notice:')).toBeDefined();
    expect(screen.getByText('Terms apply.')).toBeDefined();
  });
});

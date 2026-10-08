import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EslInformationalCard from './EslInformationalCardRenderer';
import { EslInformationalCardContentType } from './EslInformationalCard';
import { INFORMATIONAL_CARD_FIXTURE } from '@/components/organisms/informational-card';

vi.mock('@optimizely/cms-sdk/react/richText', () => ({
  RichText: ({ content }: { content: { children?: Array<{ text?: string }> } }) => (
    <div data-testid="mock-rich-text">{content.children?.map((c) => c.text).join('')}</div>
  ),
}));

function mockRichText(text: string) {
  return {
    html: `<p>${text}</p>`,
    json: { type: 'richText' as const, children: [{ text }] },
  };
}

function link(text: string, url: string, target = '') {
  return { text, title: '', target, url: { default: url } };
}

const fullContent = {
  badge: ' Borrowing ',
  title: 'Fixed-rate mortgage',
  description: mockRichText('A payment that does not move for the life of the loan.'),
  noteLabel: "Why it's here:",
  note: 'the affordability question is easier to answer.',
  cta: link('See the details', '/borrowing/fixed-rate'),
};

describe('EslInformationalCard Content Type & Renderer', () => {
  it('defines EslInformationalCard as a flat section and element component', () => {
    const type = EslInformationalCardContentType;
    expect(type.key).toBe('EslInformationalCard');
    expect(type.displayName).toBe('ESL Informational Card');
    expect(type.baseType).toBe('_component');
    expect(type.compositionBehaviors).toEqual(['sectionEnabled', 'elementEnabled']);
    const p = type.properties;
    expect(p.badge.type).toBe('string');
    expect(p.title.type).toBe('string');
    expect(p.title.isRequired).toBe(true);
    expect(p.title.displayName).toBe('Heading');
    expect(p.description.type).toBe('richText');
    expect(p.description.displayName).toBe('Copy');
    expect(p.noteLabel.type).toBe('string');
    expect(p.note.type).toBe('string');
    expect(p.cta.type).toBe('link');
    expect(p.cta.displayName).toBe('CTA Link');
  });

  it('maps every field', () => {
    render(<EslInformationalCard content={fullContent} />);

    expect(screen.getByText('Borrowing')).toBeDefined();
    expect(screen.getByRole('heading', { level: 2, name: 'Fixed-rate mortgage' })).toBeDefined();
    expect(screen.getByTestId('mock-rich-text').textContent).toBe(
      'A payment that does not move for the life of the loan.'
    );
    expect(screen.getByText("Why it's here:").tagName).toBe('STRONG');
    expect(screen.getByText(/the affordability question/)).toBeDefined();
    const cta = screen.getByRole('link', { name: 'See the details' });
    expect(cta.getAttribute('href')).toBe('/borrowing/fixed-rate');
  });

  it('unwraps the Visual Builder component wrapper', () => {
    render(<EslInformationalCard content={{ component: fullContent }} />);
    expect(screen.getByRole('heading', { name: 'Fixed-rate mortgage' })).toBeDefined();
  });

  it('opens a _blank link in a new tab', () => {
    render(
      <EslInformationalCard
        content={{ ...fullContent, cta: link('See the details', 'https://example.com', '_blank') }}
      />
    );
    const cta = screen.getByRole('link', { name: /^See the details/ });
    expect(cta.getAttribute('target')).toBe('_blank');
  });

  it('falls back to html when rich text has no json', () => {
    const { container } = render(
      <EslInformationalCard
        content={{ ...fullContent, description: { html: '<p>Html copy</p>', json: null } }}
      />
    );
    expect(container.querySelector('p')?.textContent).toBe('Html copy');
  });

  it('returns null without a title', () => {
    const { container } = render(<EslInformationalCard content={{ ...fullContent, title: '  ' }} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null for empty content', () => {
    const { container } = render(<EslInformationalCard content={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('omits empty optional slots and drops a link without a label or url', () => {
    render(
      <EslInformationalCard
        content={{
          title: 'Only a title',
          badge: '',
          description: { html: '<p></p>', json: { type: 'richText', children: [{ text: '' }] } },
          note: ' ',
          cta: link('', '/x'),
        }}
      />
    );
    expect(screen.queryByTestId('mock-rich-text')).toBeNull();
    expect(screen.queryByRole('separator')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('never injects fixture copy when fields are empty', () => {
    const { container } = render(<EslInformationalCard content={{ title: 'Only a title' }} />);
    const text = container.textContent ?? '';
    const fixture = INFORMATIONAL_CARD_FIXTURE;
    for (const value of [fixture.badge, fixture.noteLabel, fixture.note, fixture.cta?.label]) {
      expect(text).not.toContain(value);
    }
  });
});

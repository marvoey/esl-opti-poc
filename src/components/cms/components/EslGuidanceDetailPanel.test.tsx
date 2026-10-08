import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EslGuidanceDetailPanel from './EslGuidanceDetailPanelRenderer';
import { EslGuidanceDetailPanelContentType } from './EslGuidanceDetailPanel';
import { EslGuidanceStartingPointItemContentType } from './EslGuidanceStartingPointItem';
import { EslGuidanceToolItemContentType, GUIDANCE_ICON_CHOICES } from './EslGuidanceToolItem';
import {
  GUIDANCE_DETAIL_PANEL_FIXTURE,
  GUIDANCE_ICON_NAMES,
} from '@/components/organisms/guidance-detail-panel';

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
  icon: 'home',
  title: 'Buying a home',
  description: mockRichText('Explore guidance to help you prepare.'),
  cta: link('See full guidance', '/guidance/buying-a-home'),
  note: 'The questions worth asking.',
  image: { key: 'img', url: { default: 'https://cms.example.com/globalassets/family.jpg' } },
  imageAlt: 'A family in front of their home',
  startingPointsHeading: 'Popular starting points',
  startingPoints: [
    { title: 'Am I ready?', description: 'Understand the key factors.', link: link('', '/ready') },
    { component: { title: 'What can I afford?', description: 'Explore budgeting.' } },
    { title: 'Understanding mortgages', link: link('', 'https://example.com/m', '_blank') },
  ],
  toolsHeading: 'Useful tools',
  tools: [
    { icon: 'calculator', label: 'Calculator', title: 'Mortgage calculator', link: link('', '/calc') },
    { icon: 'gauge', label: 'Calculator', title: 'Affordability calculator' },
    { icon: 'list-checks', label: 'Checklist', title: 'First-time buyer checklist' },
  ],
};

describe('EslGuidanceDetailPanel Content Type & Renderer', () => {
  it('defines EslGuidanceDetailPanel as a section component with two card arrays', () => {
    const type = EslGuidanceDetailPanelContentType;
    expect(type.key).toBe('EslGuidanceDetailPanel');
    expect(type.displayName).toBe('ESL Guidance Detail Panel');
    expect(type.baseType).toBe('_component');
    expect(type.compositionBehaviors).toEqual(['sectionEnabled']);
    const p = type.properties;
    expect(p.icon.type).toBe('string');
    expect(p.icon.format).toBe('selectOne');
    expect(p.title.type).toBe('string');
    expect(p.title.isRequired).toBe(true);
    expect(p.description.type).toBe('richText');
    expect(p.cta.type).toBe('link');
    expect(p.note.type).toBe('string');
    expect(p.image.type).toBe('contentReference');
    expect(p.image.allowedTypes).toEqual(['_image']);
    expect(p.imageAlt.type).toBe('string');
    expect(p.startingPointsHeading.type).toBe('string');
    expect(p.startingPoints.type).toBe('array');
    expect(p.startingPoints.items.type).toBe('component');
    expect(p.startingPoints.items.contentType).toBe(EslGuidanceStartingPointItemContentType);
    expect(p.toolsHeading.type).toBe('string');
    expect(p.tools.type).toBe('array');
    expect(p.tools.items.contentType).toBe(EslGuidanceToolItemContentType);
  });

  it('defines both child items as elements with flat properties', () => {
    const sp = EslGuidanceStartingPointItemContentType;
    expect(sp.key).toBe('EslGuidanceStartingPointItem');
    expect(sp.compositionBehaviors).toEqual(['elementEnabled']);
    expect(sp.properties.title.type).toBe('string');
    expect(sp.properties.description.type).toBe('string');
    expect(sp.properties.link.type).toBe('link');

    const tool = EslGuidanceToolItemContentType;
    expect(tool.key).toBe('EslGuidanceToolItem');
    expect(tool.compositionBehaviors).toEqual(['elementEnabled']);
    expect(tool.properties.icon.format).toBe('selectOne');
    expect(tool.properties.label.type).toBe('string');
    expect(tool.properties.title.type).toBe('string');
    expect(tool.properties.link.type).toBe('link');
  });

  it('only offers icons the organism can render', () => {
    expect(GUIDANCE_ICON_CHOICES.map((c) => c.value).sort()).toEqual([...GUIDANCE_ICON_NAMES].sort());
  });

  it('returns null when content or the heading is missing', () => {
    [undefined, null, {}, { title: '   ' }, { description: mockRichText('Body only') }].forEach(
      (content) => {
        const { container, unmount } = render(<EslGuidanceDetailPanel content={content} />);
        expect(container.firstChild).toBeNull();
        unmount();
      }
    );
  });

  it('maps every field of a full payload', () => {
    render(<EslGuidanceDetailPanel id="panel" content={fullContent} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Buying a home' })).toBeDefined();
    expect(screen.getByTestId('mock-rich-text').textContent).toBe('Explore guidance to help you prepare.');
    expect(screen.getByRole('link', { name: 'See full guidance' }).getAttribute('href')).toBe(
      '/guidance/buying-a-home'
    );
    expect(screen.getByText('The questions worth asking.')).toBeDefined();
    const img = screen.getByRole('img', { name: 'A family in front of their home' });
    expect(decodeURIComponent(img.getAttribute('src') ?? '')).toContain('family.jpg');

    const startingPoints = screen.getByRole('region', { name: 'Popular starting points' });
    expect(within(startingPoints).getAllByRole('listitem')).toHaveLength(3);
    expect(within(startingPoints).getByRole('link', { name: 'Am I ready?' }).getAttribute('href')).toBe(
      '/ready'
    );
    const external = within(startingPoints).getByRole('link', { name: /^Understanding mortgages/ });
    expect(external.getAttribute('target')).toBe('_blank');

    const tools = screen.getByRole('region', { name: 'Useful tools' });
    expect(within(tools).getAllByRole('listitem')).toHaveLength(3);
    expect(within(tools).getAllByText('Calculator')).toHaveLength(2);
    expect(within(tools).getByRole('link', { name: 'Mortgage calculator' }).getAttribute('href')).toBe(
      '/calc'
    );
  });

  it('unwraps the Visual Builder component wrapper', () => {
    render(<EslGuidanceDetailPanel content={{ component: { title: 'Wrapped panel' } }} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Wrapped panel' })).toBeDefined();
  });

  it('falls back to rich text html and accepts plain strings', () => {
    const { unmount } = render(
      <EslGuidanceDetailPanel content={{ title: 'Panel', description: { html: '<p>From html</p>' } }} />
    );
    expect(screen.getByText('From html')).toBeDefined();
    unmount();

    render(<EslGuidanceDetailPanel content={{ title: 'Panel', description: 'Plain copy' }} />);
    expect(screen.getByText('Plain copy')).toBeDefined();
  });

  it('drops empty cards, unknown icons and a CTA without a URL or label', () => {
    const { container } = render(
      <EslGuidanceDetailPanel
        content={{
          title: 'Panel',
          description: { html: '   ' },
          cta: link('See full guidance', ''),
          startingPoints: [null, { title: ' ' }, { title: 'Kept card' }],
          tools: [{ icon: 'not-an-icon', title: 'Kept tool' }, { label: 'No title' }],
        }}
      />
    );

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByText('See full guidance')).toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByText('No title')).toBeNull();
    expect(container.querySelectorAll('li svg')).toHaveLength(0);
  });

  it('never injects fixture copy when fields are empty', () => {
    const { container } = render(<EslGuidanceDetailPanel content={{ title: 'Only a heading' }} />);
    const text = container.textContent ?? '';
    const fixture = GUIDANCE_DETAIL_PANEL_FIXTURE;
    [
      fixture.description as string,
      fixture.note,
      fixture.cta?.label,
      fixture.startingPointsHeading,
      fixture.toolsHeading,
      ...(fixture.startingPoints ?? []).map((s) => s.title),
      ...(fixture.tools ?? []).map((t) => t.title),
    ].forEach((copy) => expect(text).not.toContain(copy));
    expect(screen.queryByRole('img')).toBeNull();
  });
});

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EslSplitContentCardsContentType } from './EslSplitContentCards';
import EslSplitContentCards from './EslSplitContentCardsRenderer';
import { EslStatCardContentType } from './EslStatCard';

function mockUrl(url: string) {
  return {
    type: null,
    default: url,
    hierarchical: null,
    internal: null,
    graph: null,
    base: null,
  };
}

function mockLink(text: string, href: string, target: string | null = null) {
  return {
    text,
    title: null,
    target,
    url: mockUrl(href),
  };
}

function mockImageRef(url: string) {
  return {
    key: 'img-line-illustration',
    url: mockUrl(url),
    item: null,
  };
}

function mockRichText(text: string) {
  return {
    html: `<p>${text}</p>`,
    json: {
      type: 'richText' as const,
      children: [
        {
          type: 'paragraph',
          children: [{ text }],
        },
      ],
    },
  };
}

describe('EslSplitContentCards CMS Component', () => {
  it('exposes correct Optimizely Content Type definitions', () => {
    expect(EslSplitContentCardsContentType.key).toBe('EslSplitContentCards');
    expect(EslSplitContentCardsContentType.displayName).toBe('ESL Split Content Cards');
    expect(EslSplitContentCardsContentType.baseType).toBe('_component');
    expect(EslSplitContentCardsContentType.compositionBehaviors).toEqual(['sectionEnabled']);

    expect(EslSplitContentCardsContentType.properties).toHaveProperty('eyebrow');
    expect(EslSplitContentCardsContentType.properties).toHaveProperty('title');
    expect(EslSplitContentCardsContentType.properties.description.type).toBe('richText');
    expect(EslSplitContentCardsContentType.properties).toHaveProperty('cta');
    expect(EslSplitContentCardsContentType.properties).toHaveProperty('backgroundImage');
    expect(EslSplitContentCardsContentType.properties).toHaveProperty('heroMetricSubhead');
    expect(EslSplitContentCardsContentType.properties).toHaveProperty('heroMetricValue');
    expect(EslSplitContentCardsContentType.properties).toHaveProperty('heroMetricUnit');
    expect(EslSplitContentCardsContentType.properties).toHaveProperty('heroMetricDescription');
    expect(EslSplitContentCardsContentType.properties).toHaveProperty('statCards');

    expect(EslStatCardContentType.key).toBe('EslStatCard');
    expect(EslStatCardContentType.displayName).toBe('ESL Stat Card');
    expect(EslStatCardContentType.baseType).toBe('_component');
    expect(EslStatCardContentType.properties).toHaveProperty('value');
    expect(EslStatCardContentType.properties).toHaveProperty('label');
  });

  it('renders full split content section with narrative, hero metric, and stat cards', () => {
    const mockData = {
      eyebrow: 'WHY OUR GUIDANCE IS DIFFERENT',
      title: 'Advice from a bank you own.',
      description: mockRichText(
        'ESL is member-owned. We do not answer to outside shareholders — so the advice you get is built around what is right for you.'
      ),
      cta: mockLink('See how membership works', '/membership'),
      backgroundImage: mockImageRef('/images/line-drawing.svg'),
      heroMetricSubhead: "OWNERS' DIVIDEND, RETURNED TO MEMBERS",
      heroMetricValue: '$XX',
      heroMetricUnit: 'million',
      heroMetricDescription: 'Money returned to members — because you own a share of the bank.',
      statCards: [
        { value: 'XX', label: 'years of dividends' },
        { value: '4.8', label: 'member satisfaction' },
      ],
    };

    render(<EslSplitContentCards content={mockData} />);

    expect(screen.getByText('WHY OUR GUIDANCE IS DIFFERENT')).toBeDefined();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Advice from a bank you own.' })
    ).toBeDefined();
    expect(
      screen.getByText(
        'ESL is member-owned. We do not answer to outside shareholders — so the advice you get is built around what is right for you.'
      )
    ).toBeDefined();

    const ctaBtn = screen.getByRole('link', { name: /see how membership works/i });
    expect(ctaBtn.getAttribute('href')).toBe('/membership');

    expect(screen.getByText("OWNERS' DIVIDEND, RETURNED TO MEMBERS")).toBeDefined();
    expect(screen.getByText('$XX')).toBeDefined();
    expect(screen.getByText('million')).toBeDefined();
    expect(
      screen.getByText('Money returned to members — because you own a share of the bank.')
    ).toBeDefined();

    expect(screen.getByText('XX')).toBeDefined();
    expect(screen.getByText('years of dividends')).toBeDefined();
    expect(screen.getByText('4.8')).toBeDefined();
    expect(screen.getByText('member satisfaction')).toBeDefined();
  });

  it('unwraps component property when nested inside composition node', () => {
    const mockNested = {
      component: {
        eyebrow: 'MEMBER IMPACT',
        title: 'Owned by members like you.',
        description: mockRichText('Every dollar stays local.'),
        cta: mockLink('Learn More', '/about'),
        heroMetricSubhead: 'TOTAL DIVIDENDS',
        heroMetricValue: '$100M+',
        statCards: [{ value: '500k', label: 'Active members' }],
      },
    };

    render(<EslSplitContentCards content={mockNested} />);

    expect(screen.getByText('MEMBER IMPACT')).toBeDefined();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Owned by members like you.' })
    ).toBeDefined();
    expect(screen.getByText('TOTAL DIVIDENDS')).toBeDefined();
    expect(screen.getByText('$100M+')).toBeDefined();
    expect(screen.getByText('500k')).toBeDefined();
    expect(screen.getByText('Active members')).toBeDefined();
  });

  it('renders section without stat cards and without hero metric when omitted, without falling back to mock data', () => {
    const mockMinimal = {
      eyebrow: 'MINIMAL SECTION',
      title: 'Only Narrative Here',
      description: mockRichText('No stats attached.'),
      statCards: [],
    };

    const { container } = render(<EslSplitContentCards content={mockMinimal} />);

    expect(screen.getByText('MINIMAL SECTION')).toBeDefined();
    expect(screen.getByText('Only Narrative Here')).toBeDefined();

    // Verify default mock values do not appear
    expect(screen.queryByText('$XX')).toBeNull();
    expect(screen.queryByText('years of dividends')).toBeNull();
    expect(screen.queryByText('member satisfaction')).toBeNull();
    expect(screen.queryByText('See how membership works')).toBeNull();
    expect(container.querySelectorAll('.statCard')).toHaveLength(0);
  });

  it('renders rich text HTML description correctly', () => {
    const mockRichTextData = {
      title: 'Rich Text Section',
      description: {
        html: '<p>Member-owned means <strong>stronger communities</strong> and real dividends.</p>',
      },
    };

    render(<EslSplitContentCards content={mockRichTextData} />);

    expect(screen.getByText('Rich Text Section')).toBeDefined();
    expect(screen.getByText(/Member-owned means/i)).toBeDefined();
    expect(screen.getByText('stronger communities')).toBeDefined();
  });

  it('returns null cleanly when content is null or completely empty', () => {
    const { container: container1 } = render(<EslSplitContentCards content={null} />);
    expect(container1.firstChild).toBeNull();

    const { container: container2 } = render(<EslSplitContentCards content={{}} />);
    expect(container2.firstChild).toBeNull();
  });
});

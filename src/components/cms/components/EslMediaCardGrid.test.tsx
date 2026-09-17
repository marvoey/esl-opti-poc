import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EslMediaCardGridContentType } from './EslMediaCardGrid';
import { EslMediaCardContentType } from './EslMediaCard';
import EslMediaCardGrid from './EslMediaCardGridRenderer';

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
    key: 'img-promo',
    url: mockUrl(url),
    item: null,
  };
}

describe('EslMediaCardGrid CMS Component', () => {
  it('exposes correct Optimizely Content Type definitions for grid and card', () => {
    expect(EslMediaCardGridContentType.key).toBe('EslMediaCardGrid');
    expect(EslMediaCardGridContentType.displayName).toBe('ESL Media Card Grid');
    expect(EslMediaCardGridContentType.baseType).toBe('_component');
    expect(EslMediaCardGridContentType.compositionBehaviors).toEqual(['sectionEnabled']);

    expect(EslMediaCardGridContentType.properties).toHaveProperty('eyebrow');
    expect(EslMediaCardGridContentType.properties).toHaveProperty('title');
    expect(EslMediaCardGridContentType.properties).toHaveProperty('cards');

    expect(EslMediaCardContentType.key).toBe('EslMediaCard');
    expect(EslMediaCardContentType.displayName).toBe('ESL Media Card');
    expect(EslMediaCardContentType.baseType).toBe('_component');
    expect(EslMediaCardContentType.properties).toHaveProperty('image');
    expect(EslMediaCardContentType.properties).toHaveProperty('imageAlt');
    expect(EslMediaCardContentType.properties).toHaveProperty('badge');
    expect(EslMediaCardContentType.properties).toHaveProperty('badgeVariant');
    expect(EslMediaCardContentType.properties).toHaveProperty('title');
    expect(EslMediaCardContentType.properties.description.type).toBe('richText');
    expect(EslMediaCardContentType.properties).toHaveProperty('cta');
  });

  it('renders a 3-column grid when 3 promotional cards are authored in CMS', () => {
    const mockData = {
      eyebrow: "WHAT'S NEW RIGHT NOW",
      title: 'A few offers worth a look.',
      cards: [
        {
          image: mockImageRef('https://cms.esl.org/media/auto-loan.jpg'),
          imageAlt: 'Auto loan promotion banner',
          badge: 'Limited Time',
          badgeVariant: 'dark',
          title: '4.99% APR on new auto loans',
          description: 'Switch your auto loan and save money.',
          cta: mockLink('Explore auto loans', '/auto-loans'),
        },
        {
          image: mockImageRef('https://cms.esl.org/media/certificate.jpg'),
          imageAlt: 'Certificate deposit banner',
          badge: 'High Yield',
          badgeVariant: 'aqua',
          title: 'Earn 5.10% APY on a certificate',
          description: 'Put savings to work for a set term.',
          cta: mockLink('Open a certificate', '/certificates'),
        },
        {
          image: mockImageRef('https://cms.esl.org/media/checking.jpg'),
          imageAlt: 'Checking bonus banner',
          badge: 'Bonus',
          badgeVariant: 'neutral',
          title: '$200 when you open checking',
          description: 'Open a checking account with direct deposit.',
          cta: mockLink('Explore checking', '/checking', '_blank'),
        },
      ],
    };

    const { container } = render(<EslMediaCardGrid content={mockData} />);

    expect(screen.getByText("WHAT'S NEW RIGHT NOW")).toBeDefined();
    expect(
      screen.getByRole('heading', { level: 2, name: 'A few offers worth a look.' })
    ).toBeDefined();

    // Verify all 3 cards render with CMS text
    expect(screen.getByText('4.99% APR on new auto loans')).toBeDefined();
    expect(screen.getByText('Earn 5.10% APY on a certificate')).toBeDefined();
    expect(screen.getByText('$200 when you open checking')).toBeDefined();

    // Verify external link attributes
    const checkingLink = screen.getByRole('link', { name: /explore checking/i });
    expect(checkingLink.getAttribute('target')).toBe('_blank');
    expect(checkingLink.getAttribute('rel')).toContain('noopener');

    // Verify 3-column class (grid3) is dynamically applied for 3 cards
    const cardsRow = container.querySelector('[class*="cardsRow"]');
    expect(cardsRow?.className).toContain('grid3');
    expect(cardsRow?.className).not.toContain('grid2');
    expect(container.querySelectorAll('article')).toHaveLength(3);
  });

  it('renders a dynamic 2-column grid when exactly 2 cards are authored in CMS', () => {
    const mock2Cards = {
      eyebrow: 'EXCLUSIVE DEALS',
      title: 'Featured 2 Column Layout',
      cards: [
        {
          image: mockImageRef('https://cms.esl.org/media/card1.jpg'),
          title: 'Card One Title',
          description: 'First card description copy.',
          cta: mockLink('View One', '/one'),
        },
        {
          image: mockImageRef('https://cms.esl.org/media/card2.jpg'),
          title: 'Card Two Title',
          description: 'Second card description copy.',
          cta: mockLink('View Two', '/two'),
        },
      ],
    };

    const { container } = render(<EslMediaCardGrid content={mock2Cards} />);

    expect(screen.getByText('EXCLUSIVE DEALS')).toBeDefined();
    expect(screen.getByRole('heading', { level: 2, name: 'Featured 2 Column Layout' })).toBeDefined();

    // Verify 2 cards rendered
    expect(container.querySelectorAll('article')).toHaveLength(2);

    // Verify 2-column class (grid2) is dynamically applied when cards.length === 2
    const cardsRow = container.querySelector('[class*="cardsRow"]');
    expect(cardsRow?.className).toContain('grid2');
    expect(cardsRow?.className).not.toContain('grid3');
  });

  it('unwraps component property when nested inside Visual Builder composition node', () => {
    const mockNested = {
      component: {
        eyebrow: 'VISUAL BUILDER EYEBROW',
        title: 'Visual Builder Title',
        cards: [
          {
            image: mockImageRef('https://cms.esl.org/media/vb-card.jpg'),
            title: 'VB Card Title',
            description: 'VB Card description.',
            cta: mockLink('VB CTA', '/vb'),
          },
        ],
      },
    };

    render(<EslMediaCardGrid content={mockNested} />);

    expect(screen.getByText('VISUAL BUILDER EYEBROW')).toBeDefined();
    expect(screen.getByRole('heading', { level: 2, name: 'Visual Builder Title' })).toBeDefined();
    expect(screen.getByText('VB Card Title')).toBeDefined();
  });

  it('strictly excludes cards without CMS images and does not fall back to local project assets', () => {
    const mockCardsWithMissingImage = {
      title: 'Section with One Valid and One Incomplete Card',
      cards: [
        {
          // Valid image from CMS
          image: mockImageRef('https://cms.esl.org/media/valid.jpg'),
          title: 'Valid Card With Image',
          description: 'This card has an image.',
          cta: mockLink('Read more', '/valid'),
        },
        {
          // No image returned from CMS
          image: null,
          title: 'Invalid Card Without Image',
          description: 'This card should NOT appear because it has no image in the CMS.',
          cta: mockLink('Read more', '/invalid'),
        },
      ],
    };

    const { container } = render(<EslMediaCardGrid content={mockCardsWithMissingImage} />);

    // Only the card with the CMS image should render
    expect(screen.getByText('Valid Card With Image')).toBeDefined();
    expect(screen.queryByText('Invalid Card Without Image')).toBeNull();
    expect(container.querySelectorAll('article')).toHaveLength(1);

    // Ensure no fallback local asset path (/images/offers/...) was used
    const images = container.querySelectorAll('img');
    images.forEach((img) => {
      expect(img.getAttribute('src')).not.toContain('/images/offers/');
    });
  });

  it('suppresses organism hardcoded defaults when CMS fields are empty', () => {
    const mockMinimal = {
      title: 'Custom Title Only',
      // eyebrow is omitted
      cards: [
        {
          image: mockImageRef('https://cms.esl.org/media/minimal.jpg'),
          title: 'Minimal Card',
          description: 'Minimal copy.',
          // badge is omitted
          cta: mockLink('Click', '/click'),
        },
      ],
    };

    render(<EslMediaCardGrid content={mockMinimal} />);

    // Organism default eyebrow "WHAT'S NEW RIGHT NOW" must NOT appear
    expect(screen.queryByText("WHAT'S NEW RIGHT NOW")).toBeNull();

    // Organism default badge "Limited Time" must NOT appear when omitted
    expect(screen.queryByText('Limited Time')).toBeNull();

    expect(screen.getByText('Custom Title Only')).toBeDefined();
    expect(screen.getByText('Minimal Card')).toBeDefined();
  });

  it('renders rich text HTML and JSON in card description correctly', () => {
    const mockRichTextCardData = {
      title: 'Rich Text Cards',
      cards: [
        {
          image: mockImageRef('https://cms.esl.org/media/rt1.jpg'),
          title: 'HTML Card',
          description: {
            html: '<p>Switch banking and <strong>earn high dividend</strong> rewards.</p>',
          },
          cta: mockLink('Read more', '/rt1'),
        },
        {
          image: mockImageRef('https://cms.esl.org/media/rt2.jpg'),
          title: 'JSON Card',
          description: {
            json: {
              type: 'richText' as const,
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'Put savings to work for a guaranteed return.' }],
                },
              ],
            },
          },
          cta: mockLink('Read more', '/rt2'),
        },
      ],
    };

    render(<EslMediaCardGrid content={mockRichTextCardData} />);

    expect(screen.getByText(/Switch banking and/i)).toBeDefined();
    expect(screen.getByText('earn high dividend')).toBeDefined();
    expect(screen.getByText('Put savings to work for a guaranteed return.')).toBeDefined();
  });

  it('returns null cleanly when content is null, undefined, or empty', () => {
    const { container: container1 } = render(<EslMediaCardGrid content={null} />);
    expect(container1.firstChild).toBeNull();

    const { container: container2 } = render(<EslMediaCardGrid content={{}} />);
    expect(container2.firstChild).toBeNull();

    const { container: container3 } = render(
      <EslMediaCardGrid content={{ cards: [] }} />
    );
    expect(container3.firstChild).toBeNull();
  });

  it('omits CTA link on card when CTA is not set in CMS', () => {
    const mockCardNoCta = {
      title: 'No CTA Section',
      cards: [
        {
          image: mockImageRef('https://cms.esl.org/media/no-cta.jpg'),
          title: 'Card Without CTA',
          description: 'Description without link.',
          cta: null,
        },
      ],
    };

    render(<EslMediaCardGrid content={mockCardNoCta} />);

    expect(screen.getByText('Card Without CTA')).toBeDefined();
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByText('Learn more')).toBeNull();
  });
});

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { EslMediaCardGridCarouselContentType } from './EslMediaCardGridCarousel';
import { EslMediaCardContentType } from './EslMediaCard';
import EslMediaCardGridCarouselRenderer from './EslMediaCardGridCarouselRenderer';

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

describe('EslMediaCardGridCarousel CMS Component', () => {
  it('exposes correct Optimizely Content Type definitions for carousel and card', () => {
    expect(EslMediaCardGridCarouselContentType.key).toBe('EslMediaCardGridCarousel');
    expect(EslMediaCardGridCarouselContentType.displayName).toBe('ESL Media Card Grid Carousel');
    expect(EslMediaCardGridCarouselContentType.baseType).toBe('_component');
    expect(EslMediaCardGridCarouselContentType.compositionBehaviors).toEqual(['sectionEnabled']);

    expect(EslMediaCardGridCarouselContentType.properties).toHaveProperty('eyebrow');
    expect(EslMediaCardGridCarouselContentType.properties).toHaveProperty('title');
    expect(EslMediaCardGridCarouselContentType.properties).toHaveProperty('cards');

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

  it('renders carousel when promotional cards are authored in CMS', async () => {
    const mockData = {
      eyebrow: "WHAT'S NEW RIGHT NOW",
      title: 'A few offers worth a look.',
      cards: [
        {
          image: mockImageRef('https://cms.esl.org/media/auto-loan.jpg'),
          imageAlt: 'Friends driving a convertible through the city',
          badge: 'Limited Time',
          badgeVariant: 'dark',
          title: '4.99% APR on new auto loans',
          description: 'Get on the road with a rate set in members favor.',
          cta: mockLink('Explore auto loans', '/auto-loans'),
        },
        {
          image: mockImageRef('https://cms.esl.org/media/certificate.jpg'),
          imageAlt: 'Family packing boxes for a new home',
          badge: 'High Yield',
          badgeVariant: 'aqua',
          title: 'Earn 5.10% APY on a certificate',
          description: 'Put savings to work for a set term.',
          cta: mockLink('Open a certificate', '/certificates'),
        },
        {
          image: mockImageRef('https://cms.esl.org/media/checking.jpg'),
          imageAlt: '3D stylized financial cash symbols',
          badge: 'Bonus',
          badgeVariant: 'neutral',
          title: '$200 when you open checking',
          description: 'Switch your everyday banking.',
          cta: mockLink('Explore checking', '/checking', '_blank'),
        },
      ],
    };

    await act(async () => {
      render(<EslMediaCardGridCarouselRenderer content={mockData} />);
    });

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

    // Verify carousel elements
    expect(screen.getByRole('button', { name: /previous offers/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /next offers/i })).toBeDefined();
    const slides = screen.getAllByRole('group', { name: /of 3/i });
    expect(slides).toHaveLength(3);
  });

  it('unwraps component property when nested inside Visual Builder composition node', async () => {
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

    await act(async () => {
      render(<EslMediaCardGridCarouselRenderer content={mockNested} />);
    });

    expect(screen.getByText('VISUAL BUILDER EYEBROW')).toBeDefined();
    expect(screen.getByRole('heading', { level: 2, name: 'Visual Builder Title' })).toBeDefined();
    expect(screen.getByText('VB Card Title')).toBeDefined();
  });

  it('strictly excludes cards without CMS images and does not fall back to local project assets', async () => {
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

    let container: HTMLElement;
    await act(async () => {
      const res = render(<EslMediaCardGridCarouselRenderer content={mockCardsWithMissingImage} />);
      container = res.container;
    });

    // Only the card with the CMS image should render
    expect(screen.getByText('Valid Card With Image')).toBeDefined();
    expect(screen.queryByText('Invalid Card Without Image')).toBeNull();
    expect(container!.querySelectorAll('article')).toHaveLength(1);

    // Ensure no fallback local asset path (/images/offers/...) was used
    const images = container!.querySelectorAll('img');
    images.forEach((img) => {
      expect(img.getAttribute('src')).not.toContain('/images/offers/');
    });
  });

  it('renders rich text HTML and JSON in card description correctly', async () => {
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

    await act(async () => {
      render(<EslMediaCardGridCarouselRenderer content={mockRichTextCardData} />);
    });

    expect(screen.getByText(/Switch banking and/i)).toBeDefined();
    expect(screen.getByText('earn high dividend')).toBeDefined();
    expect(screen.getByText('Put savings to work for a guaranteed return.')).toBeDefined();
  });

  it('returns null cleanly when content is null, undefined, or has 0 cards', async () => {
    let container1: HTMLElement;
    await act(async () => {
      const res = render(<EslMediaCardGridCarouselRenderer content={null} />);
      container1 = res.container;
    });
    expect(container1!.firstChild).toBeNull();

    let container2: HTMLElement;
    await act(async () => {
      const res = render(<EslMediaCardGridCarouselRenderer content={{}} />);
      container2 = res.container;
    });
    expect(container2!.firstChild).toBeNull();

    let container3: HTMLElement;
    await act(async () => {
      const res = render(<EslMediaCardGridCarouselRenderer content={{ cards: [] }} />);
      container3 = res.container;
    });
    expect(container3!.firstChild).toBeNull();
  });

  it('renders correctly via EslMediaCardGridCarouselRenderer', async () => {
    const mockData = {
      title: 'Wrapper Carousel Title',
      cards: [
        {
          image: mockImageRef('https://cms.esl.org/media/wrapper-card.jpg'),
          title: 'Wrapper Card',
          description: 'Wrapper description.',
          cta: mockLink('Learn more', '/wrapper'),
        },
      ],
    };

    await act(async () => {
      render(<EslMediaCardGridCarouselRenderer content={mockData} />);
    });

    expect(screen.getByText('Wrapper Carousel Title')).toBeDefined();
    expect(screen.getByText('Wrapper Card')).toBeDefined();
  });

  it('omits CTA link on card when CTA is not set in CMS', async () => {
    const mockCardNoCta = {
      title: 'No CTA Carousel Section',
      cards: [
        {
          image: mockImageRef('https://cms.esl.org/media/no-cta.jpg'),
          title: 'Card Without CTA',
          description: 'Description without link.',
          cta: null,
        },
      ],
    };

    await act(async () => {
      render(<EslMediaCardGridCarouselRenderer content={mockCardNoCta} />);
    });

    expect(screen.getByText('Card Without CTA')).toBeDefined();
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByText('Learn more')).toBeNull();
  });
});

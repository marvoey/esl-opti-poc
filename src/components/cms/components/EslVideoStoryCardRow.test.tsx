import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EslVideoStoryCardRowContentType } from './EslVideoStoryCardRow';
import { EslVideoStoryCardContentType } from './EslVideoStoryCard';
import EslVideoStoryCardRow from './EslVideoStoryCardRowRenderer';

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
    key: 'img-story',
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

describe('EslVideoStoryCardRow CMS Component', () => {
  it('exposes correct Optimizely Content Type definitions for row and card', () => {
    expect(EslVideoStoryCardRowContentType.key).toBe('EslVideoStoryCardRow');
    expect(EslVideoStoryCardRowContentType.displayName).toBe('ESL Video Story Card Row');
    expect(EslVideoStoryCardRowContentType.baseType).toBe('_component');
    expect(EslVideoStoryCardRowContentType.compositionBehaviors).toEqual(['sectionEnabled']);

    expect(EslVideoStoryCardRowContentType.properties).toHaveProperty('eyebrow');
    expect(EslVideoStoryCardRowContentType.properties).toHaveProperty('title');
    expect(EslVideoStoryCardRowContentType.properties.description.type).toBe('richText');
    expect(EslVideoStoryCardRowContentType.properties).toHaveProperty('cta');
    expect(EslVideoStoryCardRowContentType.properties).toHaveProperty('cards');

    expect(EslVideoStoryCardContentType.key).toBe('EslVideoStoryCard');
    expect(EslVideoStoryCardContentType.displayName).toBe('ESL Video Story Card');
    expect(EslVideoStoryCardContentType.baseType).toBe('_component');
    expect(EslVideoStoryCardContentType.properties).toHaveProperty('image');
    expect(EslVideoStoryCardContentType.properties).toHaveProperty('imageAlt');
    expect(EslVideoStoryCardContentType.properties).toHaveProperty('videoUrl');
    expect(EslVideoStoryCardContentType.properties).toHaveProperty('videoTitle');
    expect(EslVideoStoryCardContentType.properties).toHaveProperty('categoryIcon');
    expect(EslVideoStoryCardContentType.properties).toHaveProperty('title');
    expect(EslVideoStoryCardContentType.properties.quote.type).toBe('richText');
    expect(EslVideoStoryCardContentType.properties).toHaveProperty('authorName');
    expect(EslVideoStoryCardContentType.properties).toHaveProperty('authorRole');
    expect(EslVideoStoryCardContentType.properties).toHaveProperty('authorLocation');
  });

  it('renders full section with narrative, CTA button, and video testimonial cards', () => {
    const mockData = {
      eyebrow: 'Member Stories',
      title: 'Real stories from members like you.',
      description: mockRichText(
        'See how local families and business owners build their future with personalized financial solutions from ESL.'
      ),
      cta: mockLink('Watch more stories', '/stories'),
      cards: [
        {
          image: mockImageRef('https://cms.esl.org/media/marcia.png'),
          imageAlt: 'Marcia, café owner in the Finger Lakes',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoTitle: "Marcia's Business Growth Story",
          categoryIcon: 'store',
          title: 'Expanded her business',
          quote: mockRichText('Their business banking solutions helped me grow my company.'),
          authorName: 'Marcia',
          authorRole: 'café owner',
          authorLocation: 'Finger Lakes',
        },
        {
          image: mockImageRef('https://cms.esl.org/media/david.jpg'),
          imageAlt: 'David, proud homeowner in Greater Rochester',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoTitle: "David's Home Journey",
          categoryIcon: 'home',
          title: 'Bought his first home',
          quote: mockRichText('The mortgage team made an impossible dream straightforward.'),
          authorName: 'David',
          authorRole: 'homeowner',
          authorLocation: 'Rochester',
        },
      ],
    };

    const { container } = render(<EslVideoStoryCardRow content={mockData} />);

    expect(screen.getByText('Member Stories')).toBeDefined();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Real stories from members like you.' })
    ).toBeDefined();
    expect(
      screen.getByText(/See how local families and business owners build their future/i)
    ).toBeDefined();

    const ctaBtn = screen.getByRole('link', { name: /watch more stories/i });
    expect(ctaBtn.getAttribute('href')).toBe('/stories');

    // Cards content
    expect(screen.getByText('Expanded her business')).toBeDefined();
    expect(screen.getByText(/Their business banking solutions helped me grow my company/i)).toBeDefined();
    expect(screen.getByText('Marcia, café owner')).toBeDefined();
    expect(screen.getByText(/Finger Lakes/)).toBeDefined();

    expect(screen.getByText('Bought his first home')).toBeDefined();
    expect(screen.getByText(/The mortgage team made an impossible dream straightforward/i)).toBeDefined();
    expect(screen.getByText('David, homeowner')).toBeDefined();
    expect(screen.getByText(/Rochester/)).toBeDefined();

    // Verify 2 cards rendered
    expect(container.querySelectorAll('article')).toHaveLength(2);
  });

  it('unwraps component property when nested inside Visual Builder composition node', () => {
    const mockNested = {
      component: {
        eyebrow: 'COMMUNITY VOICES',
        title: 'Voices of Rochester',
        cards: [
          {
            image: mockImageRef('https://cms.esl.org/media/community.jpg'),
            title: 'Local Impact',
            quote: mockRichText('ESL reinvests in our neighborhoods.'),
            authorName: 'Sarah',
          },
        ],
      },
    };

    render(<EslVideoStoryCardRow content={mockNested} />);

    expect(screen.getByText('COMMUNITY VOICES')).toBeDefined();
    expect(screen.getByRole('heading', { level: 2, name: 'Voices of Rochester' })).toBeDefined();
    expect(screen.getByText('Local Impact')).toBeDefined();
    expect(screen.getByText(/ESL reinvests in our neighborhoods/i)).toBeDefined();
  });

  it('renders rich text HTML in row description and card quote correctly', () => {
    const mockRichTextData = {
      title: 'HTML Rich Text Section',
      description: {
        html: '<p>Empowering members with <strong>trusted advice</strong> and local roots.</p>',
      },
      cards: [
        {
          image: mockImageRef('https://cms.esl.org/media/quote-card.jpg'),
          title: 'Financial Growth',
          quote: {
            html: '<p>I saved <em>thousands</em> on my mortgage refinancing.</p>',
          },
          authorName: 'Alex',
        },
      ],
    };

    render(<EslVideoStoryCardRow content={mockRichTextData} />);

    expect(screen.getByText('HTML Rich Text Section')).toBeDefined();
    expect(screen.getByText('trusted advice')).toBeDefined();
    expect(screen.getByText('thousands')).toBeDefined();
  });

  it('strictly excludes cards without CMS images and does not fall back to local assets', () => {
    const mockCardsWithMissingImage = {
      title: 'Section with One Valid and One Incomplete Card',
      cards: [
        {
          image: mockImageRef('https://cms.esl.org/media/valid.jpg'),
          title: 'Valid Story Card',
          quote: mockRichText('I loved the service.'),
          authorName: 'Valid Author',
        },
        {
          image: null,
          title: 'Card Without Image',
          quote: mockRichText('This card must NOT be shown.'),
          authorName: 'Missing Image Author',
        },
      ],
    };

    const { container } = render(<EslVideoStoryCardRow content={mockCardsWithMissingImage} />);

    expect(screen.getByText('Valid Story Card')).toBeDefined();
    expect(screen.queryByText('Card Without Image')).toBeNull();
    expect(container.querySelectorAll('article')).toHaveLength(1);

    const images = container.querySelectorAll('img');
    images.forEach((img) => {
      expect(img.getAttribute('src')).not.toContain('/images/testimonials/');
    });
  });

  it('suppresses organism hardcoded defaults when CMS fields are empty', () => {
    const mockMinimal = {
      title: 'Only Custom Title',
      cards: [
        {
          image: mockImageRef('https://cms.esl.org/media/story.jpg'),
          title: 'Minimal Card',
          quote: mockRichText('Quote here.'),
          authorName: 'Author',
        },
      ],
    };

    render(<EslVideoStoryCardRow content={mockMinimal} />);

    // Organism default eyebrow "Member Stories" must not appear if omitted
    expect(screen.queryByText('Member Stories')).toBeNull();
    // Organism default CTA "Watch more stories" must not appear if omitted
    expect(screen.queryByText('Watch more stories')).toBeNull();

    expect(screen.getByText('Only Custom Title')).toBeDefined();
  });

  it('returns null cleanly when content is null, undefined, or empty', () => {
    const { container: container1 } = render(<EslVideoStoryCardRow content={null} />);
    expect(container1.firstChild).toBeNull();

    const { container: container2 } = render(<EslVideoStoryCardRow content={{}} />);
    expect(container2.firstChild).toBeNull();

    const { container: container3 } = render(
      <EslVideoStoryCardRow content={{ cards: [] }} />
    );
    expect(container3.firstChild).toBeNull();
  });
});

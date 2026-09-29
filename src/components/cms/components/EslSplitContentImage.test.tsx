import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EslSplitContentImageContentType } from './EslSplitContentImage';
import EslSplitContentImage from './EslSplitContentImageRenderer';

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
    key: 'img-split',
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

const VALID_CONTENT = {
  title: "Let's figure out what's next, together.",
  description: mockRichText(
    'Whether you are saving for a home, starting a business, or planning retirement, our community advisors are here to help.'
  ),
  primaryCta: mockLink('Become a member', '/join'),
  secondaryCta: mockLink('Talk to someone first', '/contact'),
  eligibilityNote: 'Open to anyone who lives, works, or worships in our community.',
  image: mockImageRef('https://res.cloudinary.com/demo/image/upload/community-collage.webp'),
  imageAlt: 'Diverse ESL members and families representing the community',
};

describe('EslSplitContentImage CMS Component', () => {
  it('exposes correct Optimizely Content Type definitions', () => {
    expect(EslSplitContentImageContentType.key).toBe('EslSplitContentImage');
    expect(EslSplitContentImageContentType.displayName).toBe('ESL Split Content Image');
    expect(EslSplitContentImageContentType.baseType).toBe('_component');
    expect(EslSplitContentImageContentType.compositionBehaviors).toEqual(['sectionEnabled', 'elementEnabled']);

    expect(EslSplitContentImageContentType.properties).toHaveProperty('title');
    expect(EslSplitContentImageContentType.properties.description.type).toBe('richText');
    expect(EslSplitContentImageContentType.properties).toHaveProperty('primaryCta');
    expect(EslSplitContentImageContentType.properties).toHaveProperty('secondaryCta');
    expect(EslSplitContentImageContentType.properties).toHaveProperty('eligibilityNote');
    expect(EslSplitContentImageContentType.properties.image.type).toBe('contentReference');
    expect(EslSplitContentImageContentType.properties).toHaveProperty('imageAlt');
  });

  it('returns null when content is null, empty, or missing required fields (strict Rule 3)', () => {
    const { container: c1 } = render(<EslSplitContentImage content={null} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<EslSplitContentImage content={{}} />);
    expect(c2.firstChild).toBeNull();

    // Missing image
    const { container: c3 } = render(
      <EslSplitContentImage
        content={{
          ...VALID_CONTENT,
          image: null,
        }}
      />
    );
    expect(c3.firstChild).toBeNull();

    // Missing primary CTA
    const { container: c4 } = render(
      <EslSplitContentImage
        content={{
          ...VALID_CONTENT,
          primaryCta: null,
        }}
      />
    );
    expect(c4.firstChild).toBeNull();

    // Missing secondary CTA
    const { container: c5 } = render(
      <EslSplitContentImage
        content={{
          ...VALID_CONTENT,
          secondaryCta: null,
        }}
      />
    );
    expect(c5.firstChild).toBeNull();

    // Missing title
    const { container: c6 } = render(
      <EslSplitContentImage
        content={{
          ...VALID_CONTENT,
          title: '',
        }}
      />
    );
    expect(c6.firstChild).toBeNull();
  });

  it('renders full section with title, rich text description, dual CTAs, eligibility note, and image', () => {
    render(<EslSplitContentImage content={VALID_CONTENT} />);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: "Let's figure out what's next, together.",
      })
    ).toBeDefined();

    expect(
      screen.getByText(
        'Whether you are saving for a home, starting a business, or planning retirement, our community advisors are here to help.'
      )
    ).toBeDefined();

    const primaryLink = screen.getByRole('link', { name: /Become a member/i });
    expect(primaryLink.getAttribute('href')).toBe('/join');

    const secondaryLink = screen.getByRole('link', { name: /Talk to someone first/i });
    expect(secondaryLink.getAttribute('href')).toBe('/contact');

    expect(
      screen.getByText('Open to anyone who lives, works, or worships in our community.')
    ).toBeDefined();

    const img = screen.getByRole('img', {
      name: 'Diverse ESL members and families representing the community',
    });
    expect(img.getAttribute('src')).toContain('community-collage.webp');
  });

  it('renders external links with target="_blank" and secure rel attribute', () => {
    const externalContent = {
      ...VALID_CONTENT,
      primaryCta: mockLink('External Join', 'https://example.com/join', '_blank'),
      secondaryCta: mockLink('External Contact', 'https://example.com/contact', '_blank'),
    };

    render(<EslSplitContentImage content={externalContent} />);

    const primaryLink = screen.getByRole('link', { name: /External Join/i });
    expect(primaryLink.getAttribute('target')).toBe('_blank');
    expect(primaryLink.getAttribute('rel')).toBe('noopener noreferrer');

    const secondaryLink = screen.getByRole('link', { name: /External Contact/i });
    expect(secondaryLink.getAttribute('target')).toBe('_blank');
    expect(secondaryLink.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('supports wrapped composition node structure (content.component)', () => {
    const wrappedContent = {
      component: VALID_CONTENT,
    };

    render(<EslSplitContentImage content={wrappedContent} />);

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: "Let's figure out what's next, together.",
      })
    ).toBeDefined();
  });
});

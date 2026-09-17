import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EslSideBySide from './EslSideBySideRenderer';
import { EslSideBySideContentType } from './EslSideBySide';

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

function mockHierarchicalUrl(url: string) {
  return {
    type: null,
    default: null,
    hierarchical: url,
    internal: null,
    graph: null,
    base: null,
  };
}

function mockRichText(text: string) {
  return {
    html: `<p>${text}</p>`,
    json: {
      type: 'richText' as const,
      children: [],
    },
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

function mockImageRef(url: string, isHierarchical: boolean = false) {
  return {
    key: 'img-key',
    url: isHierarchical ? mockHierarchicalUrl(url) : mockUrl(url),
    item: null,
  };
}

describe('EslSideBySide CMS Component', () => {
  it('exposes correct Optimizely Content Type definition with selectOne format', () => {
    expect(EslSideBySideContentType.key).toBe('EslSideBySide');
    expect(EslSideBySideContentType.displayName).toBe('ESL Side By Side');
    expect(EslSideBySideContentType.baseType).toBe('_component');
    expect(EslSideBySideContentType.properties).toHaveProperty('eyebrow');
    expect(EslSideBySideContentType.properties).toHaveProperty('headline');
    expect(EslSideBySideContentType.properties).toHaveProperty('body');
    expect(EslSideBySideContentType.properties).toHaveProperty('image');
    expect(EslSideBySideContentType.properties).toHaveProperty('imageAlt');
    expect(EslSideBySideContentType.properties).toHaveProperty('cta');
    expect(EslSideBySideContentType.properties.imagePosition.format).toBe('selectOne');
    expect(EslSideBySideContentType.properties.colorVariant.format).toBe('selectOne');
  });

  it('renders Variant A: Dark background with image on the right', () => {
    const { container } = render(
      <EslSideBySide
        content={{
          eyebrow: 'Member savings',
          headline: 'Earn more with a Share Certificate',
          body: mockRichText('Lock in a guaranteed rate and watch your savings grow.'),
          cta: mockLink('Explore certificates', '/certificates'),
          image: mockImageRef('https://cdn.optimizely.com/assets/certificates.jpg'),
          imageAlt: 'Family reviewing certificates',
          imagePosition: 'right',
          colorVariant: 'dark',
        }}
      />
    );

    const section = container.querySelector('section');
    expect(section?.className).toContain('imageRight');

    const card = container.querySelector('article');
    expect(card?.className).toContain('cardDark');

    expect(screen.getByText('Member savings')).toBeDefined();
    expect(screen.getByRole('heading', { name: 'Earn more with a Share Certificate' })).toBeDefined();

    const link = screen.getByRole('link', { name: 'Explore certificates' });
    expect(link.getAttribute('href')).toBe('/certificates');
  });

  it('renders Variant B: Light background with image on the left', () => {
    const { container } = render(
      <EslSideBySide
        content={{
          eyebrow: 'Checking & debit',
          headline: 'Banking that fits your life and your goals',
          body: mockRichText('Open a checking account today with no monthly service fees.'),
          cta: mockLink('Open an account', '/checking', '_blank'),
          image: mockImageRef('https://cdn.optimizely.com/assets/checking.jpg'),
          imagePosition: 'left',
          colorVariant: 'light',
        }}
      />
    );

    const section = container.querySelector('section');
    expect(section?.className).toContain('imageLeft');

    const card = container.querySelector('article');
    expect(card?.className).toContain('cardLight');

    const link = screen.getByRole('link', { name: 'Open an account' });
    expect(link.getAttribute('href')).toBe('/checking');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('supports independent orthogonal combination: Light background WITH image on the right', () => {
    const { container } = render(
      <EslSideBySide
        content={{
          eyebrow: 'Special Offer',
          headline: 'Light card with image right',
          body: mockRichText('Testing independent layout controls.'),
          cta: mockLink('Learn more', '/learn'),
          image: mockImageRef('https://cdn.optimizely.com/assets/sample.jpg'),
          imagePosition: 'right',
          colorVariant: 'light',
        }}
      />
    );

    const section = container.querySelector('section');
    expect(section?.className).toContain('imageRight');

    const card = container.querySelector('article');
    expect(card?.className).toContain('cardLight');
  });

  it('supports independent orthogonal combination: Dark background WITH image on the left', () => {
    const { container } = render(
      <EslSideBySide
        content={{
          eyebrow: 'Special Offer',
          headline: 'Dark card with image left',
          body: mockRichText('Testing independent layout controls.'),
          cta: mockLink('Learn more', '/learn'),
          image: mockImageRef('https://cdn.optimizely.com/assets/sample.jpg'),
          imagePosition: 'left',
          colorVariant: 'dark',
        }}
      />
    );

    const section = container.querySelector('section');
    expect(section?.className).toContain('imageLeft');

    const card = container.querySelector('article');
    expect(card?.className).toContain('cardDark');
  });

  it('resolves image URL strictly from CMS without fallback to static images', () => {
    render(
      <EslSideBySide
        content={{
          eyebrow: 'Offers',
          headline: 'Special Offer',
          body: mockRichText('Exclusive rates for members.'),
          cta: mockLink('Apply now', '/apply'),
          image: mockImageRef('https://cdn.optimizely.com/cms-media/offer.webp', true),
          imageAlt: 'Special offer banner',
        }}
      />
    );

    const img = screen.getByAltText('Special offer banner');
    expect(img.getAttribute('src')).toContain('offer.webp');
    expect(img.getAttribute('src')).not.toContain('/images/hero/family.jpg');
  });

  it('handles wrapped composition component structure: content.component', () => {
    render(
      <EslSideBySide
        content={{
          component: {
            eyebrow: 'Savings',
            headline: 'Nested Component',
            body: mockRichText('Nested component inside composition node.'),
            cta: mockLink('Learn more', '/nested'),
            image: mockImageRef('https://cdn.optimizely.com/assets/nested.jpg'),
            imageAlt: 'Nested alt',
          },
        }}
      />
    );

    expect(screen.getByText('Savings')).toBeDefined();
    expect(screen.getByRole('heading', { name: 'Nested Component' })).toBeDefined();
  });

  it('returns null when content is empty or incomplete', () => {
    const { container: c1 } = render(<EslSideBySide content={null} />);
    expect(c1.innerHTML).toBe('');

    const { container: c2 } = render(<EslSideBySide content={{}} />);
    expect(c2.innerHTML).toBe('');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { CmsImage } from './CmsImage';

describe('CmsImage Atom', () => {
  it('renders fill image with automatic sizes and style attributes', () => {
    render(
      <div style={{ position: 'relative', width: 400, height: 400 }}>
        <CmsImage
          src="/images/hero/family.jpg"
          alt="Family test image"
          fill
        />
      </div>
    );

    const img = screen.getByRole('img', { name: 'Family test image' });
    expect(img).toBeDefined();
    const decodedSrc = decodeURIComponent(img.getAttribute('src') || '');
    expect(decodedSrc).toContain('/images/hero/family.jpg');
    // In fill mode, next/image renders style with position: absolute
    expect(img.getAttribute('style')).toContain('position: absolute');
  });

  it('routes Optimizely CMS images through first-party /opti-media/ proxy with Cloudflare cdn-cgi options', () => {
    render(
      <CmsImage
        src="https://app-fecu01saas6fn6qt001.cms.optimizely.com/globalassets/family.jpg"
        alt="CMS image"
        width={600}
        height={400}
      />
    );

    const img = screen.getByRole('img', { name: 'CMS image' });
    const decodedSrc = decodeURIComponent(img.getAttribute('src') || '');
    expect(decodedSrc).toContain('/opti-media/cdn-cgi/image/');
    expect(decodedSrc).toContain('globalassets/family.jpg');
  });

  it('routes CMP DAM images through /opti-media/cmp/ proxy', () => {
    render(
      <CmsImage
        src="https://images1.cmp.optimizely.com/Zz00OTg4ODhmMmIwNjkxMWYxOGE0NTc2N2U2ZDA3YWY2Yw=="
        alt="CMP image"
        width={700}
        height={350}
      />
    );

    const img = screen.getByRole('img', { name: 'CMP image' });
    const decodedSrc = decodeURIComponent(img.getAttribute('src') || '');
    expect(decodedSrc).toContain('/opti-media/cmp/');
    expect(decodedSrc).toContain('width=700');
  });

  it('preserves local static /images/... paths without proxying', () => {
    render(
      <CmsImage
        src="/images/esl-logo.svg"
        alt="Local logo"
        width={83}
        height={50}
      />
    );

    const img = screen.getByRole('img', { name: 'Local logo' });
    const decodedSrc = decodeURIComponent(img.getAttribute('src') || '');
    expect(decodedSrc).toContain('/images/esl-logo.svg');
  });

  it('applies responsive aspect-ratio style contract (maxWidth 100%, height auto) for fixed dimension mode', () => {
    render(
      <CmsImage
        src="/images/hero/family.jpg"
        alt="Responsive image"
        width={720}
        height={328}
      />
    );

    const img = screen.getByRole('img', { name: 'Responsive image' });
    const style = img.getAttribute('style') || '';
    expect(style).toContain('max-width: 100%');
    expect(style).toContain('height: auto');
  });
});

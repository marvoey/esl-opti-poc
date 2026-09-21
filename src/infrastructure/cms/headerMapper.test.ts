import { describe, it, expect } from 'vitest';
import {
  mapCmsHeaderToProps,
  hasCmsHeaderContent,
  type RawCmsHeader,
} from './headerMapper';

describe('headerMapper', () => {
  describe('hasCmsHeaderContent', () => {
    it('returns false for null, undefined, or empty object', () => {
      expect(hasCmsHeaderContent(null)).toBe(false);
      expect(hasCmsHeaderContent(undefined)).toBe(false);
      expect(hasCmsHeaderContent({})).toBe(false);
      expect(
        hasCmsHeaderContent({
          brandLogoAlt: '',
          brandHref: '',
          navLinks: [],
        })
      ).toBe(false);
    });

    it('returns true when brandLogo is present', () => {
      expect(
        hasCmsHeaderContent({
          brandLogo: { url: { default: 'https://cdn.example.com/header-logo.png' } },
        })
      ).toBe(true);
    });

    it('returns true when brandLogoAlt is present', () => {
      expect(hasCmsHeaderContent({ brandLogoAlt: 'ESL Federal Credit Union' })).toBe(true);
    });

    it('returns true when brandHref is present', () => {
      expect(hasCmsHeaderContent({ brandHref: '/custom-home' })).toBe(true);
    });

    it('returns true when navLinks has items', () => {
      expect(
        hasCmsHeaderContent({
          navLinks: [{ text: 'Home', url: { default: '/' } }],
        })
      ).toBe(true);
    });

    it('returns true when cta is present', () => {
      expect(
        hasCmsHeaderContent({
          cta: { text: 'Explore Docs', url: { default: 'https://docs.developers.optimizely.com' } },
        })
      ).toBe(true);
    });
  });

  describe('mapCmsHeaderToProps', () => {
    it('returns null when raw CMS header is null, undefined, or empty (zero hardcoded fallback)', () => {
      expect(mapCmsHeaderToProps(null)).toBeNull();
      expect(mapCmsHeaderToProps(undefined)).toBeNull();
      expect(mapCmsHeaderToProps({})).toBeNull();
    });

    it('maps CMS brand logo asset and does not use any hardcoded fallback image', () => {
      const rawCms: RawCmsHeader = {
        brandLogo: {
          url: { default: 'https://cdn.example.com/esl-header-logo.svg' },
        },
        brandLogoAlt: 'ESL Banking',
        brandHref: '/portal',
      };

      const result = mapCmsHeaderToProps(rawCms);
      expect(result).not.toBeNull();
      expect(result?.logoUrl).toBe('https://cdn.example.com/esl-header-logo.svg');
      expect(result?.logoAlt).toBe('ESL Banking');
      expect(result?.brandHref).toBe('/portal');
    });

    it('leaves logoUrl undefined when brandLogo is not set (no project image fallback)', () => {
      const rawCms: RawCmsHeader = {
        brandHref: '/',
        navLinks: [{ text: 'Checking', url: { default: '/checking' } }],
      };

      const result = mapCmsHeaderToProps(rawCms);
      expect(result).not.toBeNull();
      expect(result?.logoUrl).toBeUndefined();
      expect(result?.navLinks).toHaveLength(1);
    });

    it('maps navigation links in a single row of link references', () => {
      const rawCms: RawCmsHeader = {
        navLinks: [
          { text: 'Personal', url: { default: '/personal' } },
          { text: 'Business', url: { default: '/business' } },
          { text: 'About', target: '_blank', url: { default: 'https://esl.org/about' } },
        ],
      };

      const result = mapCmsHeaderToProps(rawCms);
      expect(result).not.toBeNull();
      expect(result?.navLinks).toHaveLength(3);
      expect(result?.navLinks?.[0]).toEqual({
        id: 'link-personal',
        label: 'Personal',
        href: '/personal',
        isExternal: false,
      });
      expect(result?.navLinks?.[2]).toEqual({
        id: 'link-about',
        label: 'About',
        href: 'https://esl.org/about',
        isExternal: true,
      });
    });

    it('maps CTA as a distinct button, not part of navLinks', () => {
      const rawCms: RawCmsHeader = {
        navLinks: [{ text: 'Rates', url: { default: '/rates' } }],
        cta: {
          text: 'Explore Docs',
          url: { default: 'https://docs.developers.optimizely.com' },
          target: '_blank',
        },
      };

      const result = mapCmsHeaderToProps(rawCms);
      expect(result).not.toBeNull();
      expect(result?.navLinks).toHaveLength(1);
      expect(result?.ctaText).toBe('Explore Docs');
      expect(result?.ctaHref).toBe('https://docs.developers.optimizely.com');
      expect(result?.ctaTarget).toBe('_blank');
      expect(result?.ctaExternal).toBe(true);
    });

    it('respects target="_self" or null on CTA so it does not open in a new tab', () => {
      const rawCms: RawCmsHeader = {
        cta: {
          text: 'Explore Docs',
          url: { default: 'https://docs.developers.optimizely.com' },
          target: '_self',
        },
      };

      const result = mapCmsHeaderToProps(rawCms);
      expect(result).not.toBeNull();
      expect(result?.ctaTarget).toBeUndefined();
      expect(result?.ctaExternal).toBe(false);
    });
  });
});

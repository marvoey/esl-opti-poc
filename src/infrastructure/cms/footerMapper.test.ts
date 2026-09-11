import { describe, it, expect } from 'vitest';
import {
  mapCmsFooterToProps,
  resolveCmsLink,
  hasCmsFooterContent,
  type RawCmsFooter,
} from './footerMapper';

describe('footerMapper', () => {
  describe('resolveCmsLink', () => {
    it('returns fallback descriptor when link object is null or undefined', () => {
      const link = resolveCmsLink(null, 'Fallback Label', '/fallback');
      expect(link.label).toBe('Fallback Label');
      expect(link.href).toBe('/fallback');
      expect(link.target).toBeUndefined();
      expect(link.rel).toBeUndefined();
    });

    it('resolves link with target="_blank" and rel="noopener noreferrer"', () => {
      const link = resolveCmsLink({
        text: 'External Resource',
        target: '_blank',
        url: { default: 'https://example.com' },
      });
      expect(link.label).toBe('External Resource');
      expect(link.href).toBe('https://example.com');
      expect(link.target).toBe('_blank');
      expect(link.rel).toBe('noopener noreferrer');
      expect(link.external).toBe(true);
    });

    it('resolves internal link without _blank', () => {
      const link = resolveCmsLink({
        title: 'Checking',
        target: '_self',
        url: { default: '/checking' },
      });
      expect(link.label).toBe('Checking');
      expect(link.href).toBe('/checking');
      expect(link.target).toBeUndefined();
      expect(link.external).toBe(false);
    });
  });

  describe('hasCmsFooterContent', () => {
    it('returns false for null, undefined, or empty object', () => {
      expect(hasCmsFooterContent(null)).toBe(false);
      expect(hasCmsFooterContent(undefined)).toBe(false);
      expect(hasCmsFooterContent({})).toBe(false);
      expect(
        hasCmsFooterContent({
          brandText: '',
          addressText: '',
          columns: [],
          legalLinks: [],
        })
      ).toBe(false);
    });

    it('returns true when at least one field has content', () => {
      expect(hasCmsFooterContent({ brandText: 'Hello' })).toBe(true);
      expect(
        hasCmsFooterContent({
          columns: [{ title: 'Col 1', links: [] }],
        })
      ).toBe(true);
      expect(hasCmsFooterContent({ addressText: '225 Chestnut' })).toBe(true);
      expect(
        hasCmsFooterContent({
          brandLogo: { url: { default: 'https://cdn.example.com/logo.png' } },
        })
      ).toBe(true);
      expect(hasCmsFooterContent({ brandLogoAlt: 'ESL Federal Credit Union' })).toBe(true);
    });
  });

  describe('mapCmsFooterToProps', () => {
    it('returns null when raw CMS footer is null, undefined, or empty', () => {
      expect(mapCmsFooterToProps(null)).toBeNull();
      expect(mapCmsFooterToProps(undefined)).toBeNull();
      expect(mapCmsFooterToProps({})).toBeNull();
    });

    it('strictly caps navigation columns at a maximum of 4', () => {
      const rawCms: RawCmsFooter = {
        columns: [
          { title: 'Col 1', links: [] },
          { title: 'Col 2', links: [] },
          { title: 'Col 3', links: [] },
          { title: 'Col 4', links: [] },
          { title: 'Col 5 - Excess', links: [] },
          { title: 'Col 6 - Excess', links: [] },
        ],
      };

      const result = mapCmsFooterToProps(rawCms);
      expect(result).not.toBeNull();
      expect(result?.columns).toHaveLength(4);
      expect(result?.columns?.[0].title).toBe('Col 1');
      expect(result?.columns?.[3].title).toBe('Col 4');
    });

    it('strictly caps legal links at a maximum of 3', () => {
      const rawCms: RawCmsFooter = {
        legalLinks: [
          { text: 'Privacy Policy', url: { default: '/privacy-policy' } },
          { text: 'Disclosures', url: { default: '/disclosures' } },
          { text: 'Security', url: { default: '/security' } },
          { text: 'Excess Link 4', url: { default: '/terms' } },
        ],
      };

      const result = mapCmsFooterToProps(rawCms);
      expect(result).not.toBeNull();
      expect(result?.legalLinks).toHaveLength(3);
      expect(result?.legalLinks?.[0].label).toBe('Privacy Policy');
      expect(result?.legalLinks?.[1].label).toBe('Disclosures');
      expect(result?.legalLinks?.[2].label).toBe('Security');
    });

    it('maps brand text and brand CTA button cleanly', () => {
      const rawCms: RawCmsFooter = {
        brandText: 'Custom brand description text.',
        brandCta: {
          text: 'Join Us Today',
          url: { default: '/join-now' },
        },
      };

      const result = mapCmsFooterToProps(rawCms);
      expect(result).not.toBeNull();
      expect(result?.brand?.text).toBe('Custom brand description text.');
      expect(result?.brand?.button?.label).toBe('Join Us Today');
      expect(result?.brand?.button?.href).toBe('/join-now');
    });

    it('maps brand logo and alt text cleanly', () => {
      const rawCms: RawCmsFooter = {
        brandLogo: {
          url: { default: 'https://cdn.example.com/logo.svg' },
        },
        brandLogoAlt: 'ESL Official Logo',
      };

      const result = mapCmsFooterToProps(rawCms);
      expect(result).not.toBeNull();
      expect(result?.brand?.logoUrl).toBe('https://cdn.example.com/logo.svg');
      expect(result?.brand?.logoAlt).toBe('ESL Official Logo');
    });

    it('maps custom address, service marks, and copyright strings', () => {
      const rawCms: RawCmsFooter = {
        addressText: '100 Main Street, Rochester NY',
        serviceMarksText: 'Custom service marks statement.',
        copyrightText: '© 2026 ESL Federal Credit Union.',
      };

      const result = mapCmsFooterToProps(rawCms);
      expect(result).not.toBeNull();
      expect(result?.addressText).toBe('100 Main Street, Rochester NY');
      expect(result?.serviceMarksText).toBe('Custom service marks statement.');
      expect(result?.copyrightText).toBe('© 2026 ESL Federal Credit Union.');
    });
  });
});

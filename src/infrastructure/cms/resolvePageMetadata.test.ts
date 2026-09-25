import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  buildPageSeo,
  resolveStartPageSeo,
  resolvePageMetadata,
} from './resolvePageMetadata';
import { getGraphClient } from './graphClient';

vi.mock('./graphClient', () => ({
  getGraphClient: vi.fn(),
}));

describe('resolvePageMetadata & buildPageSeo', () => {
  const origin = 'https://www.esl.org';
  const siteTitle = 'ESL Federal Credit Union';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('buildPageSeo - Two-Tier Hierarchical Fallback', () => {
    it('uses all 11 fields when explicitly authored on the page', () => {
      const pageContent = {
        _metadata: { displayName: 'Checking Accounts' },
        metaTitle: 'Best Checking Accounts in Rochester | ESL',
        metaDescription: 'Open a high-yield checking account with no hidden fees.',
        canonicalUrl: 'https://www.esl.org/checking/',
        noIndex: true,
        noFollow: true,
        ogTitle: 'ESL Premier Checking',
        ogDescription: 'Experience banking made simple with ESL Premier Checking.',
        ogImage: '/images/checking-og.jpg',
        aeoQuickAnswer: 'ESL checking accounts offer zero monthly fees with qualifying direct deposit.',
        geoSchemaType: 'FinancialProduct',
        jsonLdOverride: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BankOrCreditUnion',
          name: 'ESL Custom Schema',
        }),
      };

      const startPageSeo = {
        metaTitle: 'Global Site Fallback Title',
        metaDescription: 'Global Site Description',
        noIndex: false,
        noFollow: false,
        ogTitle: 'Global OG Title',
        geoSchemaType: 'WebPage',
      };

      const { metadata, jsonLd } = buildPageSeo({
        pageContent,
        startPageSeo,
        siteOrigin: origin,
        pathname: '/checking',
        siteTitle,
      });

      expect(metadata.title).toEqual({ absolute: 'Best Checking Accounts in Rochester | ESL' });
      expect(metadata.alternates?.canonical).toBe('https://www.esl.org/checking/');
      expect(metadata.robots).toEqual({
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
          'max-video-preview': -1,
          'max-image-preview': 'none',
          'max-snippet': -1,
        },
      });
      expect(metadata.openGraph?.description).toBe('Experience banking made simple with ESL Premier Checking.');
      expect(metadata.openGraph?.images).toEqual([{ url: 'https://www.esl.org/images/checking-og.jpg' }]);
      expect(metadata.other?.abstract).toBe(
        'ESL checking accounts offer zero monthly fees with qualifying direct deposit.'
      );

      // Custom JSON-LD override applied
      expect(jsonLd).toEqual({
        '@context': 'https://schema.org',
        '@type': 'BankOrCreditUnion',
        name: 'ESL Custom Schema',
      });
    });

    it('falls back to Start Page defaults when page properties are missing or blank', () => {
      const pageContent = {
        _metadata: { displayName: 'Auto Loans' },
        metaTitle: '', // blank, should fall back
        metaDescription: undefined,
        canonicalUrl: undefined,
        noIndex: undefined,
        noFollow: undefined,
        ogTitle: '',
        ogDescription: '',
        ogImage: undefined,
        aeoQuickAnswer: '',
        geoSchemaType: '',
        jsonLdOverride: '',
      };

      const startPageSeo = {
        metaDescription: 'ESL Federal Credit Union provides trusted banking and lending solutions.',
        noIndex: false,
        noFollow: false,
        ogTitle: 'ESL Banking Solutions',
        ogDescription: 'Trusted Rochester credit union since 1920.',
        ogImage: 'https://assets.optimizely.com/global/brand-share.png',
        aeoQuickAnswer: 'ESL is a member-owned financial institution serving Greater Rochester.',
        geoSchemaType: 'FinancialService',
      };

      const { metadata, jsonLd } = buildPageSeo({
        pageContent,
        startPageSeo,
        siteOrigin: origin,
        pathname: '/loans/auto',
        siteTitle,
      });

      // Falls back to page displayName for title
      expect(metadata.title).toBe('Auto Loans');
      // Inherits metaDescription from Start Page
      expect(metadata.description).toBe('ESL Federal Credit Union provides trusted banking and lending solutions.');
      // Auto-computes canonical URL from route
      expect(metadata.alternates?.canonical).toBe('https://www.esl.org/loans/auto/');
      // Robots default: indexable & followable
      expect(metadata.robots).toEqual({
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      });
      // OpenGraph falls back to Start Page values
      expect(metadata.openGraph?.description).toBe('Trusted Rochester credit union since 1920.');
      expect(metadata.openGraph?.images).toEqual([
        { url: 'https://assets.optimizely.com/global/brand-share.png' },
      ]);
      // AEO Quick Answer inherited
      expect(metadata.other?.abstract).toBe(
        'ESL is a member-owned financial institution serving Greater Rochester.'
      );

      // Auto-generated Schema.org JSON-LD with Start Page GEO type
      expect(jsonLd).toEqual({
        '@context': 'https://schema.org',
        '@type': 'FinancialService',
        name: 'Auto Loans',
        url: 'https://www.esl.org/loans/auto/',
        description: 'Trusted Rochester credit union since 1920.',
        image: 'https://assets.optimizely.com/global/brand-share.png',
        abstract: 'ESL is a member-owned financial institution serving Greater Rochester.',
      });
    });

    it('prioritizes Start Page ogTitle and ogImage on the home route over generic Home displayName', () => {
      const pageContent = {
        _metadata: { displayName: 'Home' },
      };

      const startPageSeo = {
        metaTitle: 'ESL Federal Credit Union | Banking, Loans & Mortgages',
        ogTitle: 'ESL Federal Credit Union — Banking Made Simple',
        ogImage: {
          key: '/globalassets/brand-logo-navy.svg',
        },
      };

      const { metadata, jsonLd } = buildPageSeo({
        pageContent,
        startPageSeo,
        siteOrigin: origin,
        pathname: '/',
        siteTitle,
      });

      expect(metadata.title).toEqual({
        absolute: 'ESL Federal Credit Union | Banking, Loans & Mortgages',
      });
      expect(metadata.openGraph?.title).toBe('ESL Federal Credit Union — Banking Made Simple');
      expect(metadata.twitter?.title).toBe('ESL Federal Credit Union — Banking Made Simple');
      expect(metadata.openGraph?.images).toEqual([
        { url: 'https://www.esl.org/opti-media/globalassets/brand-logo-navy.svg' },
      ]);
      expect((metadata.twitter as { card?: string })?.card).toBe('summary_large_image');
      expect((jsonLd as Record<string, unknown>)?.name).toBe(
        'ESL Federal Credit Union — Banking Made Simple'
      );
      expect((jsonLd as Record<string, unknown>)?.image).toBe(
        'https://www.esl.org/opti-media/globalassets/brand-logo-navy.svg'
      );
    });

    it('falls back gracefully to built-in platform defaults when everything is omitted', () => {
      const pageContent = {
        _metadata: { displayName: 'Contact Us' },
      };

      const { metadata, jsonLd } = buildPageSeo({
        pageContent,
        startPageSeo: null,
        siteOrigin: origin,
        pathname: '/contact',
        siteTitle,
      });

      expect(metadata.title).toBe('Contact Us');
      expect(metadata.description).toBeUndefined();
      expect(metadata.alternates?.canonical).toBe('https://www.esl.org/contact/');
      expect(metadata.robots).toEqual({
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      });
      expect(metadata.openGraph?.title).toBe('Contact Us');
      expect(metadata.openGraph?.images).toBeUndefined();
      expect(metadata.other).toBeUndefined();

      expect(jsonLd).toEqual({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Contact Us',
        url: 'https://www.esl.org/contact/',
      });
    });

    it('handles relative canonical URLs and converts them to absolute', () => {
      const pageContent = {
        _metadata: { displayName: 'Mortgages' },
        canonicalUrl: '/mortgages/rates',
      };

      const { metadata } = buildPageSeo({
        pageContent,
        startPageSeo: null,
        siteOrigin: origin,
        pathname: '/mortgages',
        siteTitle,
      });

      expect(metadata.alternates?.canonical).toBe('https://www.esl.org/mortgages/rates');
    });

    it('gracefully handles malformed JSON-LD override without throwing', () => {
      const pageContent = {
        _metadata: { displayName: 'Checking' },
        jsonLdOverride: '{ not valid json: true }',
      };

      const { jsonLd } = buildPageSeo({
        pageContent,
        startPageSeo: null,
        siteOrigin: origin,
        pathname: '/checking',
        siteTitle,
      });

      // Falls back to standard auto-generated schema instead of crashing
      expect(jsonLd).toEqual({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Checking',
        url: 'https://www.esl.org/checking/',
      });
    });
  });

  describe('resolveStartPageSeo', () => {
    it('queries EslStartPage and returns SEO fields', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        EslStartPage: {
          items: [
            {
              title: 'ESL Federal Credit Union',
              metaTitle: 'ESL Federal Credit Union | Banking, Loans & Mortgages',
              metaDescription: 'Experience banking made simple in Rochester, NY.',
              noIndex: false,
              noFollow: false,
              geoSchemaType: 'FinancialService',
            },
          ],
        },
      });

      vi.mocked(getGraphClient).mockReturnValue({
        request: mockRequest,
      } as unknown as ReturnType<typeof getGraphClient>);

      const result = await resolveStartPageSeo(origin);

      expect(mockRequest).toHaveBeenCalledWith(
        expect.stringContaining('GetStartPageSeo'),
        { host: origin },
        undefined,
        true
      );
      expect(result?.metaTitle).toBe('ESL Federal Credit Union | Banking, Loans & Mortgages');
      expect(result?.geoSchemaType).toBe('FinancialService');
    });

    it('returns null and does not throw when Graph request fails', async () => {
      const mockRequest = vi.fn().mockRejectedValue(new Error('Network error'));

      vi.mocked(getGraphClient).mockReturnValue({
        request: mockRequest,
      } as unknown as ReturnType<typeof getGraphClient>);

      const result = await resolveStartPageSeo(origin);
      expect(result).toBeNull();
    });
  });

  describe('resolvePageMetadata end-to-end integration helper', () => {
    it('resolves metadata end-to-end combining start page SEO query and page data', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        EslStartPage: {
          items: [
            {
              metaDescription: 'Global fallback description',
            },
          ],
        },
      });

      vi.mocked(getGraphClient).mockReturnValue({
        request: mockRequest,
      } as unknown as ReturnType<typeof getGraphClient>);

      const { metadata } = await resolvePageMetadata(
        { _metadata: { displayName: 'Certificates' } },
        origin,
        '/certificates',
        siteTitle
      );

      expect(metadata.title).toBe('Certificates');
      expect(metadata.description).toBe('Global fallback description');
      expect(metadata.alternates?.canonical).toBe('https://www.esl.org/certificates/');
    });
  });
});

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

    it('returns true when secondaryCta is present', () => {
      expect(
        hasCmsHeaderContent({
          secondaryCta: { text: 'Sign In', url: { default: '/sign-in' } },
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

    it('maps secondaryCta alongside primary cta', () => {
      const rawCms: RawCmsHeader = {
        cta: {
          text: 'Apply Now',
          url: { default: '/apply' },
        },
        ctaIcon: 'arrow-right',
        secondaryCta: {
          text: 'Sign In',
          url: { default: '/login' },
          target: '_blank',
        },
        secondaryCtaIcon: 'user',
      };

      const result = mapCmsHeaderToProps(rawCms);
      expect(result).not.toBeNull();
      expect(result?.ctaText).toBe('Apply Now');
      expect(result?.ctaHref).toBe('/apply');
      expect(result?.ctaIcon).toBe('arrow-right');
      expect(result?.secondaryCtaText).toBe('Sign In');
      expect(result?.secondaryCtaHref).toBe('/login');
      expect(result?.secondaryCtaTarget).toBe('_blank');
      expect(result?.secondaryCtaExternal).toBe(true);
      expect(result?.secondaryCtaIcon).toBe('user');
    });

    it('maps "none" or invalid icon strings to undefined', () => {
      const rawCms: RawCmsHeader = {
        cta: { text: 'Apply', url: { default: '/apply' } },
        ctaIcon: 'none',
        secondaryCta: { text: 'Sign In', url: { default: '/login' } },
        secondaryCtaIcon: 'nonexistent-icon-123',
      };

      const result = mapCmsHeaderToProps(rawCms);
      expect(result?.ctaIcon).toBeUndefined();
      expect(result?.secondaryCtaIcon).toBeUndefined();
    });

    it('maps ctaVariant and secondaryCtaVariant correctly', () => {
      const rawCms: RawCmsHeader = {
        cta: { text: 'Apply', url: { default: '/apply' } },
        ctaVariant: 'light',
        secondaryCta: { text: 'Sign In', url: { default: '/login' } },
        secondaryCtaVariant: 'dark',
      };

      const result = mapCmsHeaderToProps(rawCms);
      expect(result?.ctaVariant).toBe('light');
      expect(result?.secondaryCtaVariant).toBe('dark');
    });

    it('maps megaMenu into Personal navigation item with columns, items, and promo', () => {
      const rawCms: RawCmsHeader = {
        navLinks: [
          { text: 'Home', url: { default: '/' } },
          { text: 'Product Family', url: { default: '/product-family' } },
          { text: 'Product Detail', url: { default: '/product-detail' } },
        ],
        megaMenu: {
          navLabel: 'Personal',
          cta: { text: 'View All Personal Banking', url: { default: '/personal' } },
          columns: [
            {
              heading: 'MANAGE',
              items: [
                {
                  icon: 'landmark',
                  link: { text: 'Checking Accounts', url: { default: '/personal/checking' } },
                },
                {
                  icon: 'piggy-bank',
                  link: { text: 'Savings Accounts', url: { default: '/personal/savings' } },
                },
              ],
            },
            {
              heading: 'BORROW',
              items: [
                {
                  icon: 'hand-coins',
                  link: { text: 'Personal Loans', url: { default: '/personal/loans' } },
                },
              ],
            },
          ],
          promo: {
            eyebrow: 'FINANCIAL WELLNESS CENTER',
            heading: 'Not sure where to start?',
            description: {
              html: '<p>Explore tools and guidance for every stage of your financial journey.</p>',
            },
            cta: {
              text: 'Get guidance',
              url: { default: '/financial-wellness' },
            },
          },
        },
      };

      const result = mapCmsHeaderToProps(rawCms);
      expect(result).not.toBeNull();
      // Should have Personal prepended + 3 regular links = 4 links total
      expect(result?.navLinks).toHaveLength(4);

      const personalLink = result?.navLinks?.[0];
      expect(personalLink?.label).toBe('Personal');
      expect(personalLink?.href).toBe('/personal');
      expect(personalLink?.megaMenu).toBeDefined();
      expect(personalLink?.megaMenu?.viewAllLabel).toBe('View All Personal Banking');
      expect(personalLink?.megaMenu?.viewAllHref).toBe('/personal');
      expect(personalLink?.megaMenu?.columns).toHaveLength(2);
      expect(personalLink?.megaMenu?.columns[0].heading).toBe('MANAGE');
      expect(personalLink?.megaMenu?.columns[0].items).toHaveLength(2);
      expect(personalLink?.megaMenu?.columns[0].items[0]).toEqual({
        icon: 'landmark',
        label: 'Checking Accounts',
        href: '/personal/checking',
      });
      expect(personalLink?.megaMenu?.promo).toEqual({
        eyebrow: 'FINANCIAL WELLNESS CENTER',
        heading: 'Not sure where to start?',
        description: 'Explore tools and guidance for every stage of your financial journey.',
        ctaLabel: 'Get guidance',
        ctaHref: '/financial-wellness',
      });

      // Subsequent links remain intact
      expect(result?.navLinks?.[1].label).toBe('Home');
      expect(result?.navLinks?.[2].label).toBe('Product Family');
      expect(result?.navLinks?.[3].label).toBe('Product Detail');
    });

    it('supports backwards compatibility with legacy viewAllLabel/viewAllLink and item label', () => {
      const rawCms: RawCmsHeader = {
        megaMenu: {
          navLabel: 'Personal',
          viewAllLabel: 'Legacy View All',
          viewAllLink: { url: { default: '/legacy-all' } },
          columns: [
            {
              heading: 'ACCOUNTS',
              items: [
                {
                  icon: 'landmark',
                  label: 'Legacy Checking',
                  link: { url: { default: '/legacy-checking' } },
                },
              ],
            },
          ],
        },
      };

      const result = mapCmsHeaderToProps(rawCms);
      expect(result?.navLinks?.[0].megaMenu?.viewAllLabel).toBe('Legacy View All');
      expect(result?.navLinks?.[0].megaMenu?.viewAllHref).toBe('/legacy-all');
      expect(result?.navLinks?.[0].megaMenu?.columns[0].items[0].label).toBe('Legacy Checking');
    });

    it('attaches megaMenu to existing Personal link if present in navLinks', () => {
      const rawCms: RawCmsHeader = {
        navLinks: [
          { text: 'Personal', url: { default: '/personal' } },
          { text: 'Business', url: { default: '/business' } },
        ],
        megaMenu: {
          navLabel: 'Personal',
          cta: { text: 'View All Personal Banking', url: { default: '/personal' } },
          columns: [],
          promo: {
            heading: 'Promo',
            description: 'Plain text description',
          },
        },
      };

      const result = mapCmsHeaderToProps(rawCms);
      expect(result?.navLinks).toHaveLength(2);
      expect(result?.navLinks?.[0].label).toBe('Personal');
      expect(result?.navLinks?.[0].megaMenu).toBeDefined();
      expect(result?.navLinks?.[0].megaMenu?.promo?.description).toBe('Plain text description');
    });

    it('does not default promo to hardcoded content when promo is not set in CMS', () => {
      const rawCms: RawCmsHeader = {
        megaMenus: [
          {
            navLabel: 'Business',
            cta: { text: 'All Business', url: { default: '/business' } },
            columns: [
              {
                heading: 'COMMERCIAL',
                items: [{ icon: 'store', link: { text: 'Loans', url: { default: '/loans' } } }],
              },
            ],
            // No promo authored
          },
        ],
      };

      const result = mapCmsHeaderToProps(rawCms);
      expect(result?.navLinks?.[0].megaMenu?.promo).toBeUndefined();
    });

    it('places multiple unanchored megaMenus together at the front in authored order before regular nav links', () => {
      const rawCms: RawCmsHeader = {
        navLinks: [
          { text: 'Home', url: { default: '/' } },
          { text: 'Product Family', url: { default: '/product-family' } },
          { text: 'Product Detail', url: { default: '/product-detail' } },
        ],
        megaMenus: [
          {
            navLabel: 'Personal',
            columns: [{ heading: 'MANAGE', items: [] }],
          },
          {
            navLabel: 'Business',
            columns: [{ heading: 'GROWTH', items: [] }],
          },
        ],
      };

      const result = mapCmsHeaderToProps(rawCms);
      expect(result?.navLinks).toHaveLength(5);
      // Personal and Business must be together at the front, followed by the regular links
      expect(result?.navLinks?.[0].label).toBe('Personal');
      expect(result?.navLinks?.[0].megaMenu).toBeDefined();
      expect(result?.navLinks?.[1].label).toBe('Business');
      expect(result?.navLinks?.[1].megaMenu).toBeDefined();
      expect(result?.navLinks?.[2].label).toBe('Home');
      expect(result?.navLinks?.[3].label).toBe('Product Family');
      expect(result?.navLinks?.[4].label).toBe('Product Detail');
    });

    it('maps multiple megaMenus into separate navigation items (e.g. Personal and Business)', () => {
      const rawCms: RawCmsHeader = {
        navLinks: [
          { text: 'Personal', url: { default: '/personal' } },
          { text: 'Business', url: { default: '/business' } },
          { text: 'Wealth', url: { default: '/wealth' } },
        ],
        megaMenus: [
          {
            navLabel: 'Personal',
            cta: { text: 'All Personal', url: { default: '/personal' } },
            columns: [
              {
                heading: 'ACCOUNTS',
                items: [{ icon: 'landmark', link: { text: 'Checking', url: { default: '/checking' } } }],
              },
            ],
          },
          {
            navLabel: 'Business',
            cta: { text: 'All Business', url: { default: '/business' } },
            columns: [
              {
                heading: 'COMMERCIAL',
                items: [{ icon: 'store', link: { text: 'Business Loans', url: { default: '/biz-loans' } } }],
              },
            ],
          },
        ],
      };

      const result = mapCmsHeaderToProps(rawCms);
      expect(result).not.toBeNull();
      expect(result?.navLinks).toHaveLength(3);

      const personalLink = result?.navLinks?.[0];
      expect(personalLink?.label).toBe('Personal');
      expect(personalLink?.megaMenu).toBeDefined();
      expect(personalLink?.megaMenu?.columns[0].heading).toBe('ACCOUNTS');

      const businessLink = result?.navLinks?.[1];
      expect(businessLink?.label).toBe('Business');
      expect(businessLink?.megaMenu).toBeDefined();
      expect(businessLink?.megaMenu?.columns[0].heading).toBe('COMMERCIAL');

      const wealthLink = result?.navLinks?.[2];
      expect(wealthLink?.label).toBe('Wealth');
      expect(wealthLink?.megaMenu).toBeUndefined();
    });
  });
});

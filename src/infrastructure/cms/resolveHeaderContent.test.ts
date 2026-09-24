import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveHeaderContent } from './resolveHeaderContent';
import * as graphClientModule from './graphClient';

vi.mock('./graphClient');

describe('resolveHeaderContent', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns null if graph client is not available', async () => {
    vi.spyOn(graphClientModule, 'getGraphClient').mockReturnValue(null);

    const result = await resolveHeaderContent();
    expect(result).toBeNull();
  });

  it('resolves header content from EslStartPage query response', async () => {
    const mockRequest = vi.fn().mockResolvedValue({
      EslStartPage: {
        items: [
          {
            header: {
              brandLogo: { url: { default: 'https://cdn.example.com/logo.svg' } },
              brandLogoAlt: 'ESL Federal Credit Union',
              brandHref: '/',
              navLinks: [{ text: 'Banking', url: { default: '/banking' } }],
              cta: { text: 'Explore Docs', url: { default: 'https://docs.developers.optimizely.com' } },
            },
          },
        ],
      },
    });

    vi.spyOn(graphClientModule, 'getGraphClient').mockReturnValue({
      request: mockRequest,
      getContentByPath: vi.fn(),
    } as unknown as NonNullable<ReturnType<typeof graphClientModule.getGraphClient>>);

    const result = await resolveHeaderContent();
    expect(result).not.toBeNull();
    expect(result?.logoUrl).toBe('https://cdn.example.com/logo.svg');
    expect(result?.logoAlt).toBe('ESL Federal Credit Union');
    expect(result?.navLinks).toHaveLength(1);
    expect(result?.ctaText).toBe('Explore Docs');
  });

  it('resolves header content from EslSiteSettings if EslStartPage has no header', async () => {
    const mockRequest = vi.fn().mockResolvedValue({
      EslStartPage: {
        items: [],
      },
      EslSiteSettings: {
        items: [
          {
            header: {
              brandLogo: { url: { default: 'https://cdn.example.com/site-settings-logo.svg' } },
              brandLogoAlt: 'Site Settings Logo',
              navLinks: [{ text: 'Rates', url: { default: '/rates' } }],
            },
          },
        ],
      },
    });

    vi.spyOn(graphClientModule, 'getGraphClient').mockReturnValue({
      request: mockRequest,
      getContentByPath: vi.fn(),
    } as unknown as NonNullable<ReturnType<typeof graphClientModule.getGraphClient>>);

    const result = await resolveHeaderContent();
    expect(result).not.toBeNull();
    expect(result?.logoUrl).toBe('https://cdn.example.com/site-settings-logo.svg');
    expect(result?.logoAlt).toBe('Site Settings Logo');
    expect(result?.navLinks).toHaveLength(1);
  });

  it('falls back to getContentByPath for /site-settings if graph query yields no header', async () => {
    const mockRequest = vi.fn().mockResolvedValue({
      EslStartPage: { items: [] },
      EslSiteSettings: { items: [] },
    });
    const mockGetContentByPath = vi.fn().mockResolvedValue([
      {
        header: {
          brandHref: '/fallback',
          navLinks: [{ text: 'Help', url: { default: '/help' } }],
        },
      },
    ]);

    vi.spyOn(graphClientModule, 'getGraphClient').mockReturnValue({
      request: mockRequest,
      getContentByPath: mockGetContentByPath,
    } as unknown as NonNullable<ReturnType<typeof graphClientModule.getGraphClient>>);

    const result = await resolveHeaderContent();
    expect(result).not.toBeNull();
    expect(result?.brandHref).toBe('/fallback');
    expect(result?.navLinks?.[0].label).toBe('Help');
  });

  it('returns null if no header content exists anywhere (zero hardcoded fallback)', async () => {
    const mockRequest = vi.fn().mockResolvedValue({
      EslStartPage: { items: [] },
      EslSiteSettings: { items: [] },
    });
    const mockGetContentByPath = vi.fn().mockResolvedValue([]);

    vi.spyOn(graphClientModule, 'getGraphClient').mockReturnValue({
      request: mockRequest,
      getContentByPath: mockGetContentByPath,
    } as unknown as NonNullable<ReturnType<typeof graphClientModule.getGraphClient>>);

    const result = await resolveHeaderContent();
    expect(result).toBeNull();
  });

  it('resolves multiple megaMenus authored on EslStartPage', async () => {
    const mockRequest = vi.fn().mockResolvedValue({
      EslStartPage: {
        items: [
          {
            header: {
              brandHref: '/',
              navLinks: [
                { text: 'Personal', url: { default: '/personal' } },
                { text: 'Business', url: { default: '/business' } },
              ],
              megaMenus: [
                {
                  navLabel: 'Personal',
                  cta: { text: 'All Personal', url: { default: '/personal' } },
                  columns: [
                    {
                      heading: 'MANAGE',
                      items: [{ icon: 'landmark', link: { text: 'Checking', url: { default: '/checking' } } }],
                    },
                  ],
                },
                {
                  navLabel: 'Business',
                  cta: { text: 'All Business', url: { default: '/business' } },
                  columns: [
                    {
                      heading: 'GROWTH',
                      items: [{ icon: 'store', link: { text: 'Merchant Services', url: { default: '/merchants' } } }],
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    });

    vi.spyOn(graphClientModule, 'getGraphClient').mockReturnValue({
      request: mockRequest,
      getContentByPath: vi.fn(),
    } as unknown as NonNullable<ReturnType<typeof graphClientModule.getGraphClient>>);

    const result = await resolveHeaderContent();
    expect(result).not.toBeNull();
    expect(result?.navLinks).toHaveLength(2);
    expect(result?.navLinks?.[0].label).toBe('Personal');
    expect(result?.navLinks?.[0].megaMenu?.columns[0].heading).toBe('MANAGE');
    expect(result?.navLinks?.[1].label).toBe('Business');
    expect(result?.navLinks?.[1].megaMenu?.columns[0].heading).toBe('GROWTH');
  });
});

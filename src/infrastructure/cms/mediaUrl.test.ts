import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  optimizeMediaUrl,
  resolveMediaUrl,
  type ImageRefContent,
} from './mediaUrl';

describe('mediaUrl', () => {
  const originalEnv = process.env.OPTIMIZELY_CMS_URL;

  beforeEach(() => {
    process.env.OPTIMIZELY_CMS_URL = 'https://app-fecu01saas6fn6qt001.cms.optimizely.com';
  });

  afterEach(() => {
    process.env.OPTIMIZELY_CMS_URL = originalEnv;
  });

  describe('optimizeMediaUrl', () => {
    it('returns empty string for null, undefined, or empty inputs', () => {
      expect(optimizeMediaUrl(null)).toBe('');
      expect(optimizeMediaUrl(undefined)).toBe('');
      expect(optimizeMediaUrl('')).toBe('');
      expect(optimizeMediaUrl('   ')).toBe('');
    });

    it('preserves SVG files without transforming them but routes them through proxy', () => {
      const svgUrl = 'https://app-fecu01saas6fn6qt001.cms.optimizely.com/globalassets/skyline-illustration.svg';
      expect(optimizeMediaUrl(svgUrl, { width: 600 })).toBe(
        '/opti-media/globalassets/skyline-illustration.svg'
      );

      const svgWithQuery = 'https://app-fecu01saas6fn6qt001.cms.optimizely.com/globalassets/logo.svg?v=1';
      expect(optimizeMediaUrl(svgWithQuery, { width: 600 })).toBe(
        '/opti-media/globalassets/logo.svg?v=1'
      );
    });

    it('does not re-wrap URLs that already contain /cdn-cgi/image/ and routes through proxy', () => {
      const alreadyOptimized =
        'https://app-fecu01saas6fn6qt001.cms.optimizely.com/cdn-cgi/image/width=600,format=auto,quality=80/globalassets/family.jpg';
      expect(optimizeMediaUrl(alreadyOptimized, { width: 400 })).toBe(
        '/opti-media/cdn-cgi/image/width=600,format=auto,quality=80/globalassets/family.jpg'
      );
    });

    it('preserves local static /images/ paths untouched', () => {
      const local = '/images/hero-fallback.jpg';
      expect(optimizeMediaUrl(local, { width: 500 })).toBe(local);
    });

    it('transforms Optimizely CMS URLs using Cloudflare CDN-CGI syntax via first-party proxy', () => {
      const raw = 'https://app-fecu01saas6fn6qt001.cms.optimizely.com/globalassets/family.jpg';
      const result = optimizeMediaUrl(raw, { width: 600, format: 'auto', quality: 80 });
      expect(result).toBe(
        '/opti-media/cdn-cgi/image/width=600,format=auto,quality=80/globalassets/family.jpg'
      );
    });

    it('transforms Optimizely CMP DAM URLs correctly via first-party proxy', () => {
      const raw = 'https://images1.cmp.optimizely.com/Zz00OTg4ODhmMmIwNjkxMWYxOGE0NTc2N2U2ZDA3YWY2Yw==';
      const result = optimizeMediaUrl(raw, { width: 700 });
      expect(result).toBe(
        '/opti-media/cmp/Zz00OTg4ODhmMmIwNjkxMWYxOGE0NTc2N2U2ZDA3YWY2Yw==?width=700'
      );
    });

    it('leaves non-Optimizely external URLs untouched', () => {
      const external = 'https://images.unsplash.com/photo-12345';
      expect(optimizeMediaUrl(external, { width: 600 })).toBe(external);
    });

    it('resolves and transforms relative CMS paths', () => {
      const relative = '/globalassets/family.jpg';
      const result = optimizeMediaUrl(relative, { width: 600 });
      expect(result).toBe(
        '/opti-media/cdn-cgi/image/width=600,format=auto,quality=80/globalassets/family.jpg'
      );
    });
  });

  describe('resolveMediaUrl', () => {
    it('returns empty string when imageRef is null or undefined', () => {
      expect(resolveMediaUrl(null)).toBe('');
      expect(resolveMediaUrl(undefined)).toBe('');
    });

    it('extracts URL from url.default and optimizes it', () => {
      const ref: ImageRefContent = {
        url: {
          default: 'https://app-fecu01saas6fn6qt001.cms.optimizely.com/globalassets/loan.jpg',
        },
      };
      const result = resolveMediaUrl(ref, { width: 500 });
      expect(result).toBe(
        '/opti-media/cdn-cgi/image/width=500,format=auto,quality=80/globalassets/loan.jpg'
      );
    });

    it('extracts URL from item.Url fallback and optimizes it', () => {
      const ref: ImageRefContent = {
        item: {
          Url: 'https://app-fecu01saas6fn6qt001.cms.optimizely.com/globalassets/wealth.jpg',
        },
      };
      const result = resolveMediaUrl(ref, { width: 500 });
      expect(result).toBe(
        '/opti-media/cdn-cgi/image/width=500,format=auto,quality=80/globalassets/wealth.jpg'
      );
    });
  });
});

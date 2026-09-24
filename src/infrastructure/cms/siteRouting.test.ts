import { describe, it, expect } from 'vitest';
import {
  canonicalPublicPath,
  cmsPathCandidates,
  getSites,
  publicPathFromCmsPath,
  resolveSiteByKey,
  resolveSiteByOrigin,
  resolveSiteForHost,
  sitePath,
} from './siteRouting';

const env = {
  OPTIMIZELY_APP_HOST: 'http://localhost:5002',
  OPTIMIZELY_SITE_HOSTS: 'https://brand-a.example, https://brand-b.example/',
};

describe('siteRouting', () => {
  describe('sites', () => {
    it('lists the default site first, then OPTIMIZELY_SITE_HOSTS without duplicates', () => {
      expect(getSites({ ...env, OPTIMIZELY_SITE_HOSTS: `${env.OPTIMIZELY_SITE_HOSTS},http://localhost:5002` })).toEqual([
        { key: 'localhost_5002', origin: 'http://localhost:5002' },
        { key: 'brand-a.example', origin: 'https://brand-a.example' },
        { key: 'brand-b.example', origin: 'https://brand-b.example' },
      ]);
    });

    it('falls back to http://localhost:5002 when nothing is configured', () => {
      expect(getSites({})).toEqual([{ key: 'localhost_5002', origin: 'http://localhost:5002' }]);
    });

    it('ignores invalid origins', () => {
      expect(getSites({ OPTIMIZELY_SITE_HOSTS: 'not a url,,' })).toHaveLength(1);
    });

    it('resolves the site for a request host, case-insensitively', () => {
      expect(resolveSiteForHost('Brand-A.example', env).origin).toBe('https://brand-a.example');
      expect(resolveSiteForHost('localhost:5002', env).origin).toBe('http://localhost:5002');
    });

    it('serves unknown or missing hosts as the default site', () => {
      expect(resolveSiteForHost('my-branch.vercel.app', env).origin).toBe('http://localhost:5002');
      expect(resolveSiteForHost(null, env).origin).toBe('http://localhost:5002');
    });

    it('resolves a site by route key or origin, and rejects unknown ones', () => {
      expect(resolveSiteByKey('brand-b.example', env)?.origin).toBe('https://brand-b.example');
      expect(resolveSiteByKey('evil.example', env)).toBeNull();
      expect(resolveSiteByOrigin('https://brand-a.example/some/page', env)?.key).toBe('brand-a.example');
      expect(resolveSiteByOrigin('https://other.example', env)).toBeNull();
    });
  });

  describe('public path -> CMS path', () => {
    it('serves the Home experience at /', () => {
      expect(cmsPathCandidates('/')).toEqual(['/home/']);
    });

    it('tries the page under Home first, then the path as-is', () => {
      expect(cmsPathCandidates('/product-family')).toEqual(['/home/product-family/', '/product-family/']);
      expect(cmsPathCandidates('/product-family/checking/')).toEqual([
        '/home/product-family/checking/',
        '/product-family/checking/',
      ]);
    });
  });

  describe('CMS path -> public path', () => {
    it.each([
      ['/home/', '/'],
      ['/home', '/'],
      ['/home/product-family/', '/product-family'],
      ['/home/product-family/checking/', '/product-family/checking'],
      ['/accounts/savings/', '/accounts/savings'],
      ['https://brand-a.example/home/product-detail/', '/product-detail'],
      ['/homeowners/', '/homeowners'],
    ])('%s -> %s', (cmsUrl, expected) => {
      expect(publicPathFromCmsPath(cmsUrl)).toBe(expected);
    });

    it('returns null for the start page, which holds site settings rather than a page', () => {
      expect(publicPathFromCmsPath('/')).toBeNull();
      expect(publicPathFromCmsPath('https://brand-a.example/')).toBeNull();
    });
  });

  it('strips the /home prefix from request paths, and only that prefix', () => {
    expect(canonicalPublicPath('/home')).toBe('/');
    expect(canonicalPublicPath('/home/')).toBe('/');
    expect(canonicalPublicPath('/home/product-family')).toBe('/product-family');
    expect(canonicalPublicPath('/homeowners')).toBe('/homeowners');
    expect(canonicalPublicPath('/product-family')).toBe('/product-family');
  });

  it('builds the internal route for a public path', () => {
    const site = { key: 'brand-a.example', origin: 'https://brand-a.example' };
    expect(sitePath(site, '/')).toBe('/sites/brand-a.example');
    expect(sitePath(site, '/product-family/')).toBe('/sites/brand-a.example/product-family');
  });
});

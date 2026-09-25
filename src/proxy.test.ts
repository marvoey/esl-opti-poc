import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy, config } from './proxy';

describe('proxy', () => {
  const original = {
    appHost: process.env.OPTIMIZELY_APP_HOST,
    siteHosts: process.env.OPTIMIZELY_SITE_HOSTS,
  };

  beforeEach(() => {
    process.env.OPTIMIZELY_APP_HOST = 'http://localhost:5002';
    process.env.OPTIMIZELY_SITE_HOSTS = 'https://brand-a.example';
  });

  afterEach(() => {
    process.env.OPTIMIZELY_APP_HOST = original.appHost;
    process.env.OPTIMIZELY_SITE_HOSTS = original.siteHosts;
  });

  const rewriteOf = (url: string, headers?: Record<string, string>) =>
    proxy(new NextRequest(url, { headers })).headers.get('x-middleware-rewrite');

  it('rewrites a page request to the site that owns the host, keeping the query', () => {
    expect(rewriteOf('https://brand-a.example/product-family/checking?x=1')).toBe(
      'https://brand-a.example/sites/brand-a.example/product-family/checking?x=1'
    );
    expect(rewriteOf('http://localhost:5002/')).toBe('http://localhost:5002/sites/localhost_5002');
  });

  it('prefers x-forwarded-host', () => {
    expect(rewriteOf('http://localhost:5002/rates', { 'x-forwarded-host': 'brand-a.example' })).toBe(
      'http://localhost:5002/sites/brand-a.example/rates'
    );
  });

  it('serves unknown hosts as the default site', () => {
    expect(rewriteOf('https://my-branch.vercel.app/rates')).toBe(
      'https://my-branch.vercel.app/sites/localhost_5002/rates'
    );
  });

  it('redirects CMS /home links to the public URL', () => {
    const res = proxy(new NextRequest('http://localhost:5002/home/product-family?x=1'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:5002/product-family?x=1');

    expect(proxy(new NextRequest('http://localhost:5002/home')).headers.get('location')).toBe(
      'http://localhost:5002/'
    );
  });

  it('does not run for route handlers, Next internals or files', () => {
    const matcher = new RegExp(`^${config.matcher[0]}$`);
    expect(matcher.test('/product-family')).toBe(true);
    expect(matcher.test('/preview')).toBe(true);
    expect(matcher.test('/')).toBe(true);
    expect(matcher.test('/api/revalidate')).toBe(false);
    expect(matcher.test('/_next/static/chunk.js')).toBe(false);
    expect(matcher.test('/opti-media/globalassets/photo.jpg')).toBe(false);
    expect(matcher.test('/favicon.ico')).toBe(false);
    expect(matcher.test('/robots.txt')).toBe(false);
  });
});

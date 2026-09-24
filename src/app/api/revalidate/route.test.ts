import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST, HEAD, OPTIONS } from './route';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/infrastructure/cms/graphClient', () => ({
  getGraphClient: vi.fn(),
}));

import { revalidatePath } from 'next/cache';
import { getGraphClient } from '@/infrastructure/cms/graphClient';

describe('On-Demand Revalidation Route Handler (/api/revalidate)', () => {
  const originalKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY;
  const mockSecret = 'test-optimizely-graph-key-12345';
  const originalAppHost = process.env.OPTIMIZELY_APP_HOST;
  const originalSiteHosts = process.env.OPTIMIZELY_SITE_HOSTS;
  // Pages are served from /sites/<site key>/... (see src/proxy.ts); revalidatePath gets that route.
  const SITE = '/sites/localhost_5002';

  beforeEach(() => {
    process.env.OPTIMIZELY_GRAPH_SINGLE_KEY = mockSecret;
    process.env.OPTIMIZELY_APP_HOST = 'http://localhost:5002';
    delete process.env.OPTIMIZELY_SITE_HOSTS;
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.OPTIMIZELY_GRAPH_SINGLE_KEY = originalKey;
    process.env.OPTIMIZELY_APP_HOST = originalAppHost;
    process.env.OPTIMIZELY_SITE_HOSTS = originalSiteHosts;
  });

  it('responds with 200 ready for readiness checks (without revalidating) when secret is missing on GET', async () => {
    const req = new NextRequest('http://localhost:5002/api/revalidate');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.status).toBe('ready');
    expect(data.revalidated).toBe(false);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('responds with 200 ready for readiness checks (without revalidating) when secret is invalid on GET', async () => {
    const req = new NextRequest('http://localhost:5002/api/revalidate?secret=wrong-secret');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.status).toBe('ready');
    expect(data.revalidated).toBe(false);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('successfully revalidates default path (/) via GET query param ?secret=', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`);
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/');
    expect(revalidatePath).toHaveBeenCalledWith(SITE, 'layout');
  });

  it('successfully revalidates via Optimizely Graph convention ?cg_webhook_secret=', async () => {
    const req = new NextRequest(
      `http://localhost:5002/api/revalidate?cg_webhook_secret=${mockSecret}&path=/product-detail`
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/product-detail');
    expect(revalidatePath).toHaveBeenCalledWith(`${SITE}/product-detail`);
  });

  it('authenticates via x-revalidate-secret header', async () => {
    const req = new NextRequest('http://localhost:5002/api/revalidate', {
      headers: {
        'x-revalidate-secret': mockSecret,
      },
    });
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(revalidatePath).toHaveBeenCalledWith(SITE, 'layout');
  });

  it('authenticates via Authorization Bearer header', async () => {
    const req = new NextRequest('http://localhost:5002/api/revalidate', {
      headers: {
        authorization: `Bearer ${mockSecret}`,
      },
    });
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(revalidatePath).toHaveBeenCalledWith(SITE, 'layout');
  });

  it('authenticates via Optimizely CMS SaaS callback-secret header', async () => {
    const req = new NextRequest('http://localhost:5002/api/revalidate', {
      headers: {
        'callback-secret': mockSecret,
      },
    });
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(revalidatePath).toHaveBeenCalledWith(SITE, 'layout');
  });

  it('responds with 200 ready for verification probes without secret (empty body or ping event)', async () => {
    const pingReq = new NextRequest('http://localhost:5002/api/revalidate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'ping' }),
    });
    const pingRes = await POST(pingReq);
    const pingData = await pingRes.json();

    expect(pingRes.status).toBe(200);
    expect(pingData.status).toBe('ready');
    expect(pingData.message).toContain('verified successfully');

    const emptyReq = new NextRequest('http://localhost:5002/api/revalidate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });
    const emptyRes = await POST(emptyReq);
    const emptyData = await emptyRes.json();

    expect(emptyRes.status).toBe(200);
    expect(emptyData.status).toBe('ready');
  });

  it('responds with 401 when non-probe POST request is sent with missing or invalid secret', async () => {
    const req = new NextRequest('http://localhost:5002/api/revalidate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: '/product-detail' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.message).toContain('Invalid or missing authorization secret');
  });

  it('successfully handles POST request with JSON body when authorized via cg_webhook_secret', async () => {
    const req = new NextRequest(
      `http://localhost:5002/api/revalidate?cg_webhook_secret=${mockSecret}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ path: '/custom-article' }),
      }
    );

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/custom-article');
    expect(revalidatePath).toHaveBeenCalledWith(`${SITE}/custom-article`);
  });

  it('handles Content Graph docId for non-published events by returning 200 with no action taken', async () => {
    const req = new NextRequest(
      `http://localhost:5002/api/revalidate?cg_webhook_secret=${mockSecret}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          data: {
            docId: 'c249a405-3e28-4e11-9a76-13a529e8c339_en_Draft',
          },
        }),
      }
    );

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(false);
    expect(data.message).toContain('not in Published status');
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('handles Content Graph docId for Published events by resolving via GraphQL client', async () => {
    const mockRequestFn = vi.fn().mockResolvedValue({
      _Content: {
        items: [
          {
            _metadata: {
              displayName: 'Premier Checking',
              url: {
                default: '/product-detail',
                hierarchical: '/product-detail',
                type: 'SIMPLE',
              },
              types: ['EslProductDetailPage'],
            },
          },
        ],
      },
    });

    vi.mocked(getGraphClient).mockReturnValue({
      request: mockRequestFn,
    } as unknown as ReturnType<typeof getGraphClient>);

    const req = new NextRequest(
      `http://localhost:5002/api/revalidate?cg_webhook_secret=${mockSecret}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          data: {
            docId: 'c249a405-3e28-4e11-9a76-13a529e8c339_en_Published',
          },
        }),
      }
    );

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/product-detail');
    expect(data.source).toBe('docId');
    expect(mockRequestFn).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith(`${SITE}/product-detail`);
  });

  it('revalidates only the published page from Optimizely nested webhook payload (data.url)', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        event: 'content.published',
        data: {
          url: '/product-detail',
          types: ['EslProductDetailPage'],
        },
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/product-detail');
    expect(revalidatePath).toHaveBeenCalledWith(`${SITE}/product-detail`);
  });

  it('normalizes /home to root path (/) and revalidates layout', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        data: {
          path: '/home',
        },
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/');
    expect(revalidatePath).toHaveBeenCalledWith(SITE, 'layout');
  });

  it('revalidates product-detail when Optimizely sends Graph url object ({ default: "/product-detail/" })', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        data: {
          url: {
            default: '/product-detail/',
            hierarchical: '/product-detail/',
          },
        },
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/product-detail');
    expect(revalidatePath).toHaveBeenCalledWith(`${SITE}/product-detail`);
  });

  it('evicts the whole site when a page type ("EslProductDetailExperience") arrives without a URL', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        type: { subject: 'doc', action: 'updated' },
        data: {
          contentType: 'EslProductDetailExperience',
          types: ['EslProductDetailExperience', '_Experience', '_Page'],
        },
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/');
    expect(data.source).toBe('contentType');
    expect(revalidatePath).toHaveBeenCalledWith(SITE, 'layout');
  });

  it('evicts the whole site when Optimizely sends contentType "EslHomeExperience"', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        type: { subject: 'doc', action: 'updated' },
        data: {
          contentType: 'EslHomeExperience',
          types: ['EslHomeExperience', '_Experience', '_Page'],
        },
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/');
    expect(revalidatePath).toHaveBeenCalledWith(SITE, 'layout');
  });

  it('safely skips revalidation and does NOT invalidate home when an unmapped item is published', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        type: { subject: 'doc', action: 'updated' },
        data: {
          contentType: 'EslMediaAsset',
          name: 'hero-banner.jpg',
        },
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(false);
    expect(data.message).toContain('Skipped cache eviction');
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('evicts the whole site when a page type ("EslProductFamilyExperience") arrives without a URL', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        type: { subject: 'doc', action: 'updated' },
        data: {
          contentType: 'EslProductFamilyExperience',
        },
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/');
    expect(data.source).toBe('contentType');
    expect(revalidatePath).toHaveBeenCalledWith(SITE, 'layout');
  });

  it('HEAD and OPTIONS return 200 OK for standard requests', async () => {
    const headRes = await HEAD();
    expect(headRes.status).toBe(200);

    const optionsRes = await OPTIONS();
    expect(optionsRes.status).toBe(200);
    expect(optionsRes.headers.get('Allow')).toContain('POST');
    expect(optionsRes.headers.get('WebHook-Allowed-Origin')).toBeNull();
  });

  it('handles CloudEvents / Azure Event Grid webhook validation handshake via OPTIONS', async () => {
    const origin = 'https://app-fecu01saas6fn6qt001.cms.optimizely.com';
    const req = new NextRequest('http://localhost:5002/api/revalidate', {
      method: 'OPTIONS',
      headers: {
        'WebHook-Request-Origin': origin,
      },
    });

    const res = await OPTIONS(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('WebHook-Allowed-Origin')).toBe(origin);
    expect(res.headers.get('WebHook-Allowed-Rate')).toBe('120');
    expect(res.headers.get('Allow')).toContain('POST');
  });

  it('handles webhook validation handshake case-insensitively via OPTIONS', async () => {
    const origin = 'https://app-fecu01saas6fn6qt001.cms.optimizely.com';
    const req = new NextRequest('http://localhost:5002/api/revalidate', {
      method: 'OPTIONS',
      headers: {
        'webhook-request-origin': origin,
      },
    });

    const res = await OPTIONS(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('WebHook-Allowed-Origin')).toBe(origin);
    expect(res.headers.get('WebHook-Allowed-Rate')).toBe('120');
  });

  it('normalizes Optimizely hierarchical /home/product-detail/ to /product-detail', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        data: {
          publicUrl: 'https://opti-1920.move-esl-forward.org/home/product-detail/',
        },
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/product-detail');
    expect(revalidatePath).toHaveBeenCalledWith(`${SITE}/product-detail`);
  });

  it('normalizes Optimizely hierarchical /home/product-family/ to /product-family', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        data: {
          url: '/home/product-family/',
        },
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/product-family');
    expect(revalidatePath).toHaveBeenCalledWith(`${SITE}/product-family`);
  });

  it('evicts the whole site when contentTypeName has spaces ("ESL Product Detail Experience") and no URL', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        type: 'contentVersion:preview1:published',
        data: {
          contentTypeName: 'ESL Product Detail Experience',
        },
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/');
    expect(data.source).toBe('contentType');
    expect(revalidatePath).toHaveBeenCalledWith(SITE, 'layout');
  });

  it('revalidates only Product Detail Page A when Page A is published, not touching Page B', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        type: 'contentVersion:preview1:published',
        data: {
          publicUrl: 'https://opti-1920.move-esl-forward.org/accounts/premier-checking/',
          contentTypeName: 'ESL Product Detail Experience',
        },
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/accounts/premier-checking');
    expect(revalidatePath).toHaveBeenCalledWith(`${SITE}/accounts/premier-checking`);
    expect(revalidatePath).not.toHaveBeenCalledWith(`${SITE}/loans/auto-loans`);
    expect(revalidatePath).not.toHaveBeenCalledWith(`${SITE}/product-detail`);
  });

  it('revalidates only Product Detail Page B when Page B is published, not touching Page A', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        type: 'contentVersion:preview1:published',
        data: {
          publicUrl: 'https://opti-1920.move-esl-forward.org/loans/auto-loans/',
          contentTypeName: 'ESL Product Detail Experience',
        },
      }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/loans/auto-loans');
    expect(revalidatePath).toHaveBeenCalledWith(`${SITE}/loans/auto-loans`);
    expect(revalidatePath).not.toHaveBeenCalledWith(`${SITE}/accounts/premier-checking`);
  });

  it('handles Optimizely CMS SaaS webhook event object format ({ version, key }) resolving via Content Graph', async () => {
    const mockRequestFn = vi.fn().mockResolvedValue({
      _Content: {
        items: [
          {
            _metadata: {
              url: {
                default: '/home/product-detail/',
                hierarchical: '/home/product-detail/',
              },
              types: ['EslProductDetailPage'],
            },
          },
        ],
      },
    });

    vi.mocked(getGraphClient).mockReturnValue({
      request: mockRequestFn,
    } as unknown as ReturnType<typeof getGraphClient>);

    const req = new NextRequest(
      `http://localhost:5002/api/revalidate?cg_webhook_secret=${mockSecret}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type: 'contentVersion:preview1:published',
          data: {
            version: '184',
            key: 'd7ff5161-6e71-4632-878d-797c915eb355',
          },
        }),
      }
    );

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/product-detail');
    expect(data.paths).toContain('/product-detail');
    expect(data.source).toBe('guid');
    expect(mockRequestFn).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith(`${SITE}/product-detail`);
  });

  it('handles unwrapped Optimizely sample format ({ version, key }) resolving via Content Graph', async () => {
    const mockRequestFn = vi.fn().mockResolvedValue({
      _Content: {
        items: [
          {
            _metadata: {
              url: {
                default: '/accounts/custom-checking',
                hierarchical: '/accounts/custom-checking',
              },
              types: ['EslProductDetailPage'],
            },
          },
        ],
      },
    });

    vi.mocked(getGraphClient).mockReturnValue({
      request: mockRequestFn,
    } as unknown as ReturnType<typeof getGraphClient>);

    const req = new NextRequest(
      `http://localhost:5002/api/revalidate?cg_webhook_secret=${mockSecret}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          version: '184',
          key: 'd7ff51616e714632878d797c915eb355',
        }),
      }
    );

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/accounts/custom-checking');
    expect(data.source).toBe('guid');
    expect(mockRequestFn).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith(`${SITE}/accounts/custom-checking`);
  });

  describe('multiple sites', () => {
    const BRAND = '/sites/brand.example';

    beforeEach(() => {
      process.env.OPTIMIZELY_SITE_HOSTS = 'https://brand.example';
    });

    it('evicts only the site that owns an absolute URL', async () => {
      const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ data: { publicUrl: 'https://brand.example/home/product-family/' } }),
      });

      const data = await (await POST(req)).json();

      expect(data.path).toBe('/product-family');
      expect(data.routes).toEqual([`${BRAND}/product-family`]);
      expect(revalidatePath).not.toHaveBeenCalledWith(`${SITE}/product-family`);
    });

    it('evicts the page on every site when the URL names no site', async () => {
      const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ data: { url: '/home/product-family/' } }),
      });

      const data = await (await POST(req)).json();

      expect(data.routes).toEqual([`${SITE}/product-family`, `${BRAND}/product-family`]);
    });

    it('limits a GUID lookup to the site in Graph url.base', async () => {
      vi.mocked(getGraphClient).mockReturnValue({
        request: vi.fn().mockResolvedValue({
          _Content: {
            items: [
              {
                _metadata: {
                  url: { default: '/home/checking/', base: 'https://brand.example' },
                  types: ['EslProductDetailExperience'],
                },
              },
            ],
          },
        }),
      } as unknown as ReturnType<typeof getGraphClient>);

      const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ data: { key: 'd7ff51616e714632878d797c915eb355' } }),
      });

      const data = await (await POST(req)).json();

      expect(data.source).toBe('guid');
      expect(data.routes).toEqual([`${BRAND}/checking`]);
    });

    it('evicts the whole site layout when its start page (header and footer) is published', async () => {
      const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ data: { publicUrl: 'https://brand.example/' } }),
      });

      await POST(req);

      expect(revalidatePath).toHaveBeenCalledWith(BRAND, 'layout');
      expect(revalidatePath).not.toHaveBeenCalledWith(SITE, 'layout');
    });
  });

  describe('nested page hierarchy and global component revalidation', () => {
    it('correctly revalidates Home page with layout, Home page tag, and public root', async () => {
      const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ data: { url: '/home/' } }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.revalidated).toBe(true);
      expect(data.path).toBe('/');
      // Verifies both the Next.js layout pattern tag and the page-level home route
      expect(revalidatePath).toHaveBeenCalledWith('/sites/[site]', 'layout');
      expect(revalidatePath).toHaveBeenCalledWith(SITE);
      expect(revalidatePath).toHaveBeenCalledWith(SITE, 'layout');
      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
    });

    it('correctly revalidates nested child: Product 1 under Product Family without affecting Product 1 under Product Family 2', async () => {
      const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          data: {
            publicUrl: 'http://localhost:5002/home/product-family/product-1/',
          },
        }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.revalidated).toBe(true);
      expect(data.path).toBe('/product-family/product-1');
      expect(revalidatePath).toHaveBeenCalledWith(`${SITE}/product-family/product-1`);
      expect(revalidatePath).not.toHaveBeenCalledWith(`${SITE}/product-family-2/product-1`);
    });

    it('correctly revalidates nested child: Product 1 under Product Family 2 without affecting Product 1 under Product Family', async () => {
      const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          data: {
            publicUrl: 'http://localhost:5002/home/product-family-2/product-1/',
          },
        }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.revalidated).toBe(true);
      expect(data.path).toBe('/product-family-2/product-1');
      expect(revalidatePath).toHaveBeenCalledWith(`${SITE}/product-family-2/product-1`);
      expect(revalidatePath).not.toHaveBeenCalledWith(`${SITE}/product-family/product-1`);
    });

    it('correctly revalidates Product Details under Product Family', async () => {
      const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          data: {
            url: '/home/product-family/product-details/',
          },
        }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.revalidated).toBe(true);
      expect(data.path).toBe('/product-family/product-details');
      expect(revalidatePath).toHaveBeenCalledWith(`${SITE}/product-family/product-details`);
    });

    it('evicts the site layout and home page when EslHeader is published', async () => {
      const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type: { subject: 'doc', action: 'updated' },
          data: {
            contentType: 'EslHeader',
            types: ['EslHeader', '_Component'],
          },
        }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.revalidated).toBe(true);
      expect(data.source).toBe('contentType');
      expect(revalidatePath).toHaveBeenCalledWith('/sites/[site]', 'layout');
      expect(revalidatePath).toHaveBeenCalledWith(SITE);
    });

    it('evicts the site layout and home page when EslFooter is published', async () => {
      const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type: 'contentVersion:preview1:published',
          data: {
            contentTypeName: 'ESL Footer',
          },
        }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.revalidated).toBe(true);
      expect(data.source).toBe('contentType');
      expect(revalidatePath).toHaveBeenCalledWith('/sites/[site]', 'layout');
    });

    it('evicts the site layout and home page when EslMegaMenu is published', async () => {
      const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type: 'contentVersion:preview1:published',
          data: {
            contentTypeName: 'ESL Mega Menu',
          },
        }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.revalidated).toBe(true);
      expect(data.source).toBe('contentType');
      expect(revalidatePath).toHaveBeenCalledWith('/sites/[site]', 'layout');
    });

    it('evicts the site layout and home page when EslStartPage is resolved by GUID without URL', async () => {
      vi.mocked(getGraphClient).mockReturnValue({
        request: vi.fn().mockResolvedValue({
          _Content: {
            items: [
              {
                _metadata: {
                  url: null,
                  types: ['EslStartPage', '_Page'],
                },
              },
            ],
          },
        }),
      } as unknown as ReturnType<typeof getGraphClient>);

      const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ data: { key: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' } }),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.revalidated).toBe(true);
      expect(data.source).toBe('guid');
      expect(revalidatePath).toHaveBeenCalledWith('/sites/[site]', 'layout');
      expect(revalidatePath).toHaveBeenCalledWith(SITE);
    });
  });
});

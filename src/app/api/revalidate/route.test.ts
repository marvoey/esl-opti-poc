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

  beforeEach(() => {
    process.env.OPTIMIZELY_GRAPH_SINGLE_KEY = mockSecret;
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.OPTIMIZELY_GRAPH_SINGLE_KEY = originalKey;
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
    expect(revalidatePath).toHaveBeenCalledWith('/', 'page');
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
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
    expect(revalidatePath).toHaveBeenCalledWith('/product-detail', 'page');
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
    expect(revalidatePath).toHaveBeenCalledWith('/', 'page');
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
    expect(revalidatePath).toHaveBeenCalledWith('/', 'page');
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
    expect(revalidatePath).toHaveBeenCalledWith('/', 'page');
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
    expect(revalidatePath).toHaveBeenCalledWith('/custom-article', 'page');
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
    expect(revalidatePath).toHaveBeenCalledWith('/product-detail', 'page');
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
    expect(revalidatePath).toHaveBeenCalledWith('/product-detail', 'page');
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
    expect(revalidatePath).toHaveBeenCalledWith('/', 'page');
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
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
    expect(revalidatePath).toHaveBeenCalledWith('/product-detail', 'page');
  });

  it('revalidates product-detail when Optimizely sends contentType "EslProductDetailExperience"', async () => {
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
    expect(data.path).toBe('/product-detail');
    expect(revalidatePath).toHaveBeenCalledWith('/product-detail', 'page');
  });

  it('revalidates home when Optimizely sends contentType "EslHomeExperience"', async () => {
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
    expect(revalidatePath).toHaveBeenCalledWith('/', 'page');
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
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

  it('revalidates /product-family when Optimizely sends contentType "EslProductFamilyExperience"', async () => {
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
    expect(data.path).toBe('/product-family');
    expect(revalidatePath).toHaveBeenCalledWith('/product-family', 'page');
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
});

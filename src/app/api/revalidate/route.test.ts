import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { revalidatePath } from 'next/cache';

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

  it('successfully revalidates default path (/) via GET query param', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`);
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/');
    expect(revalidatePath).toHaveBeenCalledWith('/', 'page');
  });

  it('successfully revalidates custom path via GET query param', async () => {
    const req = new NextRequest(
      `http://localhost:5002/api/revalidate?secret=${mockSecret}&path=/product-detail`
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

  it('successfully handles POST request with JSON body', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ path: '/custom-article' }),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/custom-article');
    expect(revalidatePath).toHaveBeenCalledWith('/custom-article', 'page');
  });

  it('handles POST request without body by falling back to root path (/)', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
      method: 'POST',
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.revalidated).toBe(true);
    expect(data.path).toBe('/');
    expect(revalidatePath).toHaveBeenCalledWith('/', 'page');
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

  it('normalizes /home to root path (/)', async () => {
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

  it('correctly extracts /product-family from full production domain URL', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        data: {
          url: 'https://opti-1920.move-esl-forward.org/product-family',
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

  it('correctly extracts /product-detail from full production domain URL', async () => {
    const req = new NextRequest(`http://localhost:5002/api/revalidate?secret=${mockSecret}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        data: {
          url: 'https://opti-1920.move-esl-forward.org/product-detail',
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
});

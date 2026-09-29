import { NextRequest, NextResponse } from 'next/server';

const CMS_FALLBACK_URL = 'https://app-fecu01saas6fn6qt001.cms.optimizely.com';
const CMP_BASE_URL = 'https://images1.cmp.optimizely.com';

/**
 * Cache policy for proxied media:
 * - no-cache, must-revalidate: Browser caches the image on disk, but always validates
 *   via ETag (HTTP 304). If the DAM image is updated, F5 or page navigation immediately
 *   fetches the new version across ALL components (both eager and lazy-loaded) without
 *   requiring a hard reset (Ctrl + Shift + R).
 */
const CACHE_CONTROL_HEADER = 'no-cache, must-revalidate';

async function handleMediaRequest(
  request: NextRequest,
  paramsPromise: Promise<{ path?: string[] }>
) {
  const { path = [] } = await paramsPromise;
  if (!path || path.length === 0) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const isCmp = path[0] === 'cmp';
  const subPath = (isCmp ? path.slice(1) : path).join('/');
  const search = request.nextUrl.search;

  const cmsBase = (process.env.OPTIMIZELY_CMS_URL || CMS_FALLBACK_URL).replace(/\/$/, '');
  const targetOrigin = isCmp ? CMP_BASE_URL : cmsBase;
  const upstreamUrl = `${targetOrigin}/${subPath}${search}`;

  const forwardHeaders: Record<string, string> = {};
  const ifNoneMatch = request.headers.get('if-none-match');
  if (ifNoneMatch) {
    forwardHeaders['if-none-match'] = ifNoneMatch;
  }
  const ifModifiedSince = request.headers.get('if-modified-since');
  if (ifModifiedSince) {
    forwardHeaders['if-modified-since'] = ifModifiedSince;
  }

  try {
    const upstreamRes = await fetch(upstreamUrl, {
      method: request.method,
      headers: forwardHeaders,
    });

    if (upstreamRes.status === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          'Cache-Control': CACHE_CONTROL_HEADER,
        },
      });
    }

    // Preserve important content and cache validation headers
    const headersToPreserve = [
      'content-type',
      'content-length',
      'etag',
      'last-modified',
      'accept-ranges',
    ];

    const preservedHeaders: Record<string, string> = {};
    for (const header of headersToPreserve) {
      const val = upstreamRes.headers.get(header);
      if (val) preservedHeaders[header] = val;
    }

    return new NextResponse(request.method === 'HEAD' ? null : upstreamRes.body, {
      status: upstreamRes.status,
      // Override upstream cache with our no-cache, must-revalidate policy
      headers: { ...preservedHeaders, 'Cache-Control': CACHE_CONTROL_HEADER },
    });
  } catch (error) {
    console.error(`[opti-media proxy] Error fetching ${upstreamUrl}:`, error);
    return new NextResponse('Bad Gateway', { status: 502 });
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  return handleMediaRequest(request, context.params);
}

export async function HEAD(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  return handleMediaRequest(request, context.params);
}

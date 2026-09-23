import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { getGraphClient } from '@/infrastructure/cms/graphClient';

function isAuthorized(request: NextRequest): boolean {
  const expectedSecret = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY;

  if (!expectedSecret) {
    return false;
  }

  // 1. Check query parameters (?cg_webhook_secret=... or ?secret=...)
  const querySecret =
    request.nextUrl.searchParams.get('cg_webhook_secret') ||
    request.nextUrl.searchParams.get('secret');
  if (querySecret && querySecret === expectedSecret) {
    return true;
  }

  // 2. Check Optimizely CMS SaaS Callback-Secret headers
  const callbackSecret =
    request.headers.get('callback-secret') ||
    request.headers.get('x-callback-secret') ||
    request.headers.get('x-revalidate-secret');
  if (callbackSecret && callbackSecret === expectedSecret) {
    return true;
  }

  // 3. Check Authorization header: Bearer <secret>
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerSecret = authHeader.substring(7).trim();
    if (bearerSecret === expectedSecret) {
      return true;
    }
  }

  return false;
}

function isProbeOrVerification(body: unknown): boolean {
  if (!body) return true;
  if (typeof body !== 'object' || body === null) return false;

  const b = body as Record<string, unknown>;
  if (Object.keys(b).length === 0) return true;

  const eventType = String(
    b.type || b.event || b.eventType || b.action || b.topic || ''
  ).toLowerCase();
  if (
    [
      'ping',
      'test',
      'verification',
      'handshake',
      'check',
      'probe',
      'validation',
    ].includes(eventType)
  ) {
    return true;
  }

  // Content Graph test / verification probes
  if (b.data && typeof b.data === 'object') {
    const d = b.data as Record<string, unknown>;
    const dType = String(
      d.type || d.event || d.eventType || d.action || d.topic || ''
    ).toLowerCase();
    if (
      [
        'ping',
        'test',
        'verification',
        'handshake',
        'check',
        'probe',
        'validation',
      ].includes(dType)
    ) {
      return true;
    }
    if (Object.keys(d).length === 0) {
      return true;
    }
  }

  return false;
}

function extractUrlValue(val: unknown): string | null {
  if (!val) return null;
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val !== null) {
    const obj = val as Record<string, unknown>;
    if (typeof obj.default === 'string') return obj.default;
    if (typeof obj.hierarchical === 'string') return obj.hierarchical;
    if (typeof obj.base === 'string') return obj.base;
  }
  return null;
}

/**
 * Resolves the Next.js routes that correspond to a specific published content URL.
 * Revalidates only the specific page that was updated.
 *
 * Examples:
 * - "/home/product-detail/" -> ["/product-detail", "/home/product-detail"]
 * - "/accounts/savings-detail/" -> ["/accounts/savings-detail"]
 * - "/home/" or "/home" -> ["/"]
 * - "/custom-page" -> ["/custom-page"]
 */
function resolveRoutesFromUrl(rawUrl: string): { paths: string[]; isHome: boolean } {
  let clean = rawUrl.trim();
  if (!clean.startsWith('/')) {
    try {
      const urlToParse =
        clean.startsWith('http://') || clean.startsWith('https://')
          ? clean
          : `https://${clean}`;
      const u = new URL(urlToParse);
      clean = u.pathname;
    } catch {
      clean = `/${clean}`;
    }
  }

  // Remove trailing slashes
  while (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }

  // Home experience variations map to root '/'
  if (
    clean === '' ||
    clean === '/' ||
    clean === '/home' ||
    clean === '/home/esl-poc' ||
    clean === '/esl-poc'
  ) {
    return { paths: ['/'], isHome: true };
  }

  const paths = new Set<string>();

  // If the path is organized under Optimizely CMS hierarchy /home/<subpath>,
  // place the clean /<subpath> route first (e.g. /product-detail),
  // and also include /home/<subpath> for dynamic [...slug] compatibility
  if (clean.startsWith('/home/')) {
    const stripped = clean.replace(/^\/home/, '');
    if (stripped) {
      paths.add(stripped);
    }
  }

  paths.add(clean);

  return { paths: Array.from(paths), isHome: false };
}

function extractRawUrlFromPayload(body?: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const d = b.data && typeof b.data === 'object' ? (b.data as Record<string, unknown>) : null;
  const c = b.content && typeof b.content === 'object' ? (b.content as Record<string, unknown>) : null;
  const item =
    (b.item || b.doc) && typeof (b.item || b.doc) === 'object'
      ? ((b.item || b.doc) as Record<string, unknown>)
      : null;

  return (
    extractUrlValue(b.publicUrl) ||
    extractUrlValue(b.url) ||
    extractUrlValue(b.path) ||
    extractUrlValue(b.relativeUrl) ||
    (d && (
      extractUrlValue(d.publicUrl) ||
      extractUrlValue(d.url) ||
      extractUrlValue(d.path) ||
      extractUrlValue(d.relativeUrl) ||
      extractUrlValue(d.routeSegment) ||
      (d.contentLink && typeof d.contentLink === 'object'
        ? extractUrlValue((d.contentLink as Record<string, unknown>).url)
        : null)
    )) ||
    (c && (
      extractUrlValue(c.publicUrl) ||
      extractUrlValue(c.url) ||
      extractUrlValue(c.path) ||
      (c.contentLink && typeof c.contentLink === 'object'
        ? extractUrlValue((c.contentLink as Record<string, unknown>).url)
        : null)
    )) ||
    (item && (
      extractUrlValue(item.publicUrl) ||
      extractUrlValue(item.url) ||
      extractUrlValue(item.path)
    )) ||
    null
  );
}

function extractContentTypeFromPayload(body?: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const d = b.data && typeof b.data === 'object' ? (b.data as Record<string, unknown>) : null;
  const c = b.content && typeof b.content === 'object' ? (b.content as Record<string, unknown>) : null;

  return (
    (typeof d?.contentTypeName === 'string' ? d.contentTypeName : null) ||
    (typeof d?.contentType === 'string' ? d.contentType : null) ||
    (Array.isArray(d?.types) && typeof d.types[0] === 'string' ? d.types[0] : null) ||
    (typeof c?.contentTypeName === 'string' ? c.contentTypeName : null) ||
    (typeof c?.contentType === 'string' ? c.contentType : null) ||
    (typeof b.contentTypeName === 'string' ? b.contentTypeName : null) ||
    (typeof b.contentType === 'string' ? b.contentType : null) ||
    (Array.isArray(b.types) && typeof b.types[0] === 'string' ? b.types[0] : null) ||
    null
  );
}

function mapContentTypeToFallbackPath(typeStr?: unknown): string | null {
  if (typeof typeStr !== 'string') return null;
  const lower = typeStr.toLowerCase();
  if (
    lower.includes('homeexperience') ||
    lower.includes('home experience') ||
    lower.includes('homepage') ||
    lower.includes('home page') ||
    lower.includes('startpage')
  ) {
    return '/';
  }
  if (
    lower.includes('productfamily') ||
    lower.includes('product-family') ||
    lower.includes('product family')
  ) {
    return '/product-family';
  }
  if (
    lower.includes('productdetail') ||
    lower.includes('product-detail') ||
    lower.includes('product detail')
  ) {
    return '/product-detail';
  }
  return null;
}

const GET_CONTENT_BY_GUID_QUERY = `
  query GetContentByGuid($guid: String) {
    _Content(where: { _metadata: { key: { eq: $guid } } }) {
      items {
        _metadata {
          types
          url {
            default
            hierarchical
            type
          }
        }
      }
    }
  }
`;

async function resolveRoutesFromGuid(
  rawGuid: string
): Promise<{ paths: string[]; isHome: boolean } | null> {
  const formattedGuid = rawGuid.replaceAll('-', '');
  const client = getGraphClient();
  if (!client) {
    return null;
  }

  type ContentResponse = {
    _Content?: {
      items?: Array<{
        _metadata?: {
          types?: string[] | null;
          url?: {
            default?: string | null;
            hierarchical?: string | null;
            type?: string | null;
          } | null;
        } | null;
      }> | null;
    } | null;
  };

  try {
    let response = (await client.request(
      GET_CONTENT_BY_GUID_QUERY,
      { guid: formattedGuid },
      undefined,
      false
    )) as ContentResponse;

    let item = response?._Content?.items?.[0];

    // If not found with stripped hyphens, check if raw guid matches
    if (!item?._metadata && rawGuid !== formattedGuid) {
      response = (await client.request(
        GET_CONTENT_BY_GUID_QUERY,
        { guid: rawGuid },
        undefined,
        false
      )) as ContentResponse;
      item = response?._Content?.items?.[0];
    }

    // If still not found, wait 400ms and retry once in case Content Graph indexing is in flight
    if (!item?._metadata) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      response = (await client.request(
        GET_CONTENT_BY_GUID_QUERY,
        { guid: formattedGuid },
        undefined,
        false
      )) as ContentResponse;
      item = response?._Content?.items?.[0];
    }

    if (!item?._metadata) return null;

    const types = item._metadata.types || [];
    const isHomeType = types.some((t) => t.toLowerCase().includes('homeexperience'));

    const rawUrl = item._metadata.url?.hierarchical || item._metadata.url?.default;
    if (rawUrl) {
      const resolved = resolveRoutesFromUrl(rawUrl);
      return {
        paths: resolved.paths,
        isHome: resolved.isHome || isHomeType,
      };
    }

    if (isHomeType) {
      return { paths: ['/'], isHome: true };
    }
  } catch (err) {
    console.error('Error fetching content by guid in revalidation:', err);
  }

  return null;
}

function executeRevalidations(paths: string[], isHome: boolean): void {
  for (const p of paths) {
    try {
      revalidatePath(p, 'page');
    } catch (e) {
      console.error(`Error revalidating path "${p}":`, e);
    }
  }

  if (isHome || paths.includes('/')) {
    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      console.error('Error revalidating layout:', e);
    }
  }
}

export async function GET(request: NextRequest) {
  console.log(`[REVALIDATE GET] url: ${request.url}`);
  console.log(`[REVALIDATE GET] headers:`, Object.fromEntries(request.headers.entries()));

  // If authorized, revalidate the target path
  if (isAuthorized(request)) {
    const queryPath = request.nextUrl.searchParams.get('path') || '/';
    const { paths, isHome } = resolveRoutesFromUrl(queryPath);
    try {
      executeRevalidations(paths, isHome);
      return NextResponse.json({
        revalidated: true,
        path: paths[0],
        paths,
        now: Date.now(),
      });
    } catch (error) {
      return NextResponse.json(
        { message: 'Error revalidating path', error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  // If not authorized, respond 200 ready for Optimizely endpoint readiness verification & health probes
  return NextResponse.json({
    status: 'ready',
    revalidated: false,
    message: 'Revalidation endpoint is reachable and active.',
    now: Date.now(),
  });
}

export async function POST(request: NextRequest) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    // Body may be empty, non-JSON, etc.
  }

  console.log(`[REVALIDATE POST] url: ${request.url}`);
  console.log(`[REVALIDATE POST] headers:`, Object.fromEntries(request.headers.entries()));
  console.log(`[REVALIDATE POST] body:`, JSON.stringify(body));

  const authorized = isAuthorized(request);
  const probe = isProbeOrVerification(body);

  // If this is a probe/test event (used by CMS SaaS / Graph when verifying the endpoint):
  if (probe) {
    console.log(`[REVALIDATE POST] Detected verification probe. Responding 200 OK.`);
    return NextResponse.json({
      status: 'ready',
      revalidated: false,
      message: 'Webhook endpoint verified successfully.',
      now: Date.now(),
    });
  }

  // If not a probe and not authorized, reject with 401
  if (!authorized) {
    console.log(`[REVALIDATE POST] Unauthorized request: missing or invalid secret.`);
    return NextResponse.json(
      { message: 'Invalid or missing authorization secret' },
      { status: 401 }
    );
  }

  const b = body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
  const d = b?.data && typeof b.data === 'object' ? (b.data as Record<string, unknown>) : null;

  // 1. Check for Optimizely Content Graph docId format (e.g. { data: { docId: "<guid>_<locale>_Published" } })
  const docId = (d?.docId as string) || (b?.docId as string);

  if (typeof docId === 'string' && docId.length > 0) {
    // If it's not a published version (e.g. draft, deleted), return 200 with no action taken
    if (!docId.includes('Published')) {
      return NextResponse.json({
        status: 'ok',
        revalidated: false,
        message: 'No action taken (document is not in Published status).',
        now: Date.now(),
      });
    }

    const [rawGuid] = docId.split('_');
    if (rawGuid) {
      const resolved = await resolveRoutesFromGuid(rawGuid);
      if (resolved && resolved.paths.length > 0) {
        executeRevalidations(resolved.paths, resolved.isHome);
        return NextResponse.json({
          revalidated: true,
          path: resolved.paths[0],
          paths: resolved.paths,
          source: 'docId',
          now: Date.now(),
        });
      }
    }
  }

  // 2. Check for direct key / contentGuid in Optimizely CMS SaaS payload
  const guidCandidate =
    (typeof d?.key === 'string' ? d.key.trim() : null) ||
    (typeof d?.contentGuid === 'string' ? d.contentGuid.trim() : null) ||
    (typeof b?.key === 'string' ? b.key.trim() : null) ||
    (typeof b?.contentGuid === 'string' ? b.contentGuid.trim() : null);

  if (guidCandidate && guidCandidate.length > 0) {
    const resolved = await resolveRoutesFromGuid(guidCandidate);
    if (resolved && resolved.paths.length > 0) {
      executeRevalidations(resolved.paths, resolved.isHome);
      return NextResponse.json({
        revalidated: true,
        path: resolved.paths[0],
        paths: resolved.paths,
        source: 'guid',
        now: Date.now(),
      });
    }
  }

  // 3. Check for direct URL in payload (e.g. data.publicUrl, data.url, path, etc.)
  const rawUrl = extractRawUrlFromPayload(body);
  if (rawUrl) {
    const { paths, isHome } = resolveRoutesFromUrl(rawUrl);
    executeRevalidations(paths, isHome);
    return NextResponse.json({
      revalidated: true,
      path: paths[0],
      paths,
      source: 'url',
      now: Date.now(),
    });
  }

  // 4. Fallback to Content Type if payload contains no URL or GUID
  const fallbackType = extractContentTypeFromPayload(body);
  const fallbackPath = mapContentTypeToFallbackPath(fallbackType);
  if (fallbackPath) {
    const isHome = fallbackPath === '/';
    const { paths } = resolveRoutesFromUrl(fallbackPath);
    executeRevalidations(paths, isHome);
    return NextResponse.json({
      revalidated: true,
      path: paths[0],
      paths,
      source: 'contentType',
      now: Date.now(),
    });
  }

  // 5. Check for explicit path in request query parameters (?path=/...)
  const queryPath = request.nextUrl.searchParams.get('path');
  if (queryPath) {
    const { paths, isHome } = resolveRoutesFromUrl(queryPath);
    executeRevalidations(paths, isHome);
    return NextResponse.json({
      revalidated: true,
      path: paths[0],
      paths,
      source: 'queryPath',
      now: Date.now(),
    });
  }

  // 6. Fallback for manual test invocations with empty body
  if (
    body === null ||
    body === undefined ||
    (typeof body === 'object' && Object.keys(body as object).length === 0)
  ) {
    executeRevalidations(['/'], true);
    return NextResponse.json({
      revalidated: true,
      path: '/',
      paths: ['/'],
      source: 'fallback',
      now: Date.now(),
    });
  }

  // 7. If the payload doesn't provide a recognized page URL or GUID (e.g. unmapped asset)
  return NextResponse.json({
    status: 'ok',
    revalidated: false,
    message: 'Payload does not map to any page route. Skipped cache eviction.',
    now: Date.now(),
  });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

export async function OPTIONS(request?: NextRequest) {
  const requestOrigin =
    request?.headers?.get('WebHook-Request-Origin') ||
    request?.headers?.get('webhook-request-origin');

  const headers: Record<string, string> = {
    Allow: 'GET, POST, HEAD, OPTIONS',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  if (requestOrigin) {
    headers['WebHook-Allowed-Origin'] = requestOrigin;
    headers['WebHook-Allowed-Rate'] = '120';
  }

  return new NextResponse(null, {
    status: 200,
    headers,
  });
}

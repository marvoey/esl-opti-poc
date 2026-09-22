import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { getGraphClient } from '@/infrastructure/cms/graphClient';

function isAuthorized(request: NextRequest): boolean {
  const expectedSecret =
    process.env.OPTIMIZELY_GRAPH_SINGLE_KEY ||
    process.env.OPTIMIZELY_REVALIDATE_SECRET ||
    process.env.REVALIDATE_SECRET;

  if (!expectedSecret) {
    return false;
  }

  // 1. Check query parameters:
  // - ?cg_webhook_secret=... (Optimizely Graph convention)
  // - ?secret=... (standard query param)
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

function normalizePath(rawPath: string): string {
  let clean = rawPath.trim();
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

  // Remove trailing slash except for root '/'
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }

  // In Next.js, the homepage Experience (/home) maps to root '/'
  if (clean === '/home') {
    return '/';
  }

  return clean || '/';
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

function mapContentTypeToPath(typeStr?: unknown): string | null {
  if (typeof typeStr !== 'string') return null;
  const lower = typeStr.toLowerCase();
  if (lower.includes('productfamily') || lower.includes('product-family')) {
    return '/product-family';
  }
  if (lower.includes('productdetail') || lower.includes('product-detail')) {
    return '/product-detail';
  }
  if (
    lower.includes('homeexperience') ||
    lower.includes('homepage') ||
    lower.includes('startpage') ||
    lower.includes('header') ||
    lower.includes('footer') ||
    lower.includes('sitesettings')
  ) {
    return '/';
  }
  return null;
}

function mapTypesArrayToPath(types?: unknown): string | null {
  if (Array.isArray(types)) {
    for (const t of types) {
      const p = mapContentTypeToPath(t);
      if (p) return p;
    }
  }
  return null;
}

function mapNameToPath(nameStr?: unknown): string | null {
  if (typeof nameStr !== 'string') return null;
  const lower = nameStr.toLowerCase();
  if (lower.includes('product family') || lower.includes('product-family')) {
    return '/product-family';
  }
  if (lower.includes('product detail') || lower.includes('premier checking')) {
    return '/product-detail';
  }
  if (
    lower === 'home' ||
    lower.includes('esl home') ||
    lower.includes('header') ||
    lower.includes('footer')
  ) {
    return '/';
  }
  return null;
}

const GET_CONTENT_BY_GUID_QUERY = `
  query GetContentByGuid($guid: String) {
    _Content(where: { _metadata: { key: { eq: $guid } } }) {
      items {
        _metadata {
          displayName
          url {
            default
            hierarchical
            type
          }
          types
        }
      }
    }
  }
`;

async function resolvePathFromDocId(docId: string): Promise<string | null> {
  // Expected format: <guid>_<locale>_Published
  const [rawGuid] = docId.split('_');
  if (!rawGuid) return null;

  const formattedGuid = rawGuid.replaceAll('-', '');
  const client = getGraphClient();
  if (!client) {
    return null;
  }

  try {
    const response = (await client.request(GET_CONTENT_BY_GUID_QUERY, {
      guid: formattedGuid,
    })) as {
      _Content?: {
        items?: Array<{
          _metadata?: {
            displayName?: string | null;
            url?: {
              default?: string | null;
              hierarchical?: string | null;
              type?: string | null;
            } | null;
            types?: string[] | null;
          } | null;
        }> | null;
      } | null;
    };

    const item = response?._Content?.items?.[0];
    if (!item?._metadata) return null;

    const urlObj = item._metadata.url;
    const urlType = urlObj?.type;
    const rawUrl =
      urlType === 'SIMPLE'
        ? urlObj?.default
        : urlObj?.hierarchical?.replace('/s', '') || urlObj?.default;

    if (rawUrl) {
      return normalizePath(rawUrl);
    }

    const fromTypes = mapTypesArrayToPath(item._metadata.types);
    if (fromTypes) return fromTypes;

    const fromName = mapNameToPath(item._metadata.displayName);
    if (fromName) return fromName;
  } catch (err) {
    console.error('Error fetching content by guid in revalidation:', err);
  }

  return null;
}

function extractTargetPagePath(request: NextRequest, body?: unknown): string | null {
  // 1. Explicit query parameter: ?path=/product-detail or ?path=/
  const queryPath = request.nextUrl.searchParams.get('path');
  if (queryPath) {
    return normalizePath(queryPath);
  }

  // 2. Parse from Optimizely webhook payload (POST)
  if (body && typeof body === 'object') {
    const b = body as Record<string, unknown>;

    // 2a. Direct string or object url / path
    const directUrl =
      extractUrlValue(b.url) ||
      extractUrlValue(b.path) ||
      extractUrlValue(b.relativeUrl);
    if (directUrl) return normalizePath(directUrl);

    // 2b. Check nested "data" (Optimizely CMS SaaS & Content Graph event structure)
    if (b.data && typeof b.data === 'object') {
      const d = b.data as Record<string, unknown>;
      const dUrl =
        extractUrlValue(d.url) ||
        extractUrlValue(d.path) ||
        extractUrlValue(d.relativeUrl) ||
        (d.contentLink && typeof d.contentLink === 'object'
          ? extractUrlValue((d.contentLink as Record<string, unknown>).url)
          : null);
      if (dUrl) return normalizePath(dUrl);

      const fromType =
        mapContentTypeToPath(d.contentType) || mapTypesArrayToPath(d.types);
      if (fromType) return fromType;

      const fromName =
        mapNameToPath(d.displayName) ||
        mapNameToPath(d.name) ||
        mapNameToPath(d.slug);
      if (fromName) return fromName;
    }

    // 2c. Check nested "content" (Optimizely Content Cloud webhooks add-on structure)
    if (b.content && typeof b.content === 'object') {
      const c = b.content as Record<string, unknown>;
      const cUrl =
        extractUrlValue(c.url) ||
        extractUrlValue(c.path) ||
        (c.contentLink && typeof c.contentLink === 'object'
          ? extractUrlValue((c.contentLink as Record<string, unknown>).url)
          : null);
      if (cUrl) return normalizePath(cUrl);

      const fromType =
        mapContentTypeToPath(c.contentType) ||
        mapTypesArrayToPath(c.contentType) ||
        mapTypesArrayToPath(c.types);
      if (fromType) return fromType;

      const fromName = mapNameToPath(c.displayName) || mapNameToPath(c.name);
      if (fromName) return fromName;
    }

    // 2d. Check nested "item" or "doc" (Optimizely Content Graph doc.updated structure)
    const itemObj = (b.item || b.doc) as Record<string, unknown> | undefined;
    if (itemObj && typeof itemObj === 'object') {
      const iUrl = extractUrlValue(itemObj.url) || extractUrlValue(itemObj.path);
      if (iUrl) return normalizePath(iUrl);

      const fromType =
        mapContentTypeToPath(itemObj.contentType) ||
        mapTypesArrayToPath(itemObj.types);
      if (fromType) return fromType;

      const fromName =
        mapNameToPath(itemObj.displayName) || mapNameToPath(itemObj.name);
      if (fromName) return fromName;
    }

    // 2e. Check root contentType / types / name / slug
    const rootType =
      mapContentTypeToPath(b.contentType) || mapTypesArrayToPath(b.types);
    if (rootType) return rootType;

    const rootName =
      mapNameToPath(b.displayName) ||
      mapNameToPath(b.name) ||
      mapNameToPath(b.slug);
    if (rootName) return rootName;
  }

  // 3. Fallback for explicit manual tests with empty/missing body
  if (
    body === null ||
    body === undefined ||
    (typeof body === 'object' && Object.keys(body as object).length === 0)
  ) {
    return '/';
  }

  return null;
}

export async function GET(request: NextRequest) {
  console.log(`[REVALIDATE GET] url: ${request.url}`);
  console.log(`[REVALIDATE GET] headers:`, Object.fromEntries(request.headers.entries()));

  // If authorized, revalidate the target path
  if (isAuthorized(request)) {
    const targetPath = extractTargetPagePath(request) || '/';
    try {
      revalidatePath(targetPath, 'page');
      if (targetPath === '/') {
        revalidatePath('/', 'layout');
      }
      return NextResponse.json({
        revalidated: true,
        path: targetPath,
        now: Date.now(),
      });
    } catch (error) {
      return NextResponse.json(
        { message: 'Error revalidating path', error: (error as Error).message },
        { status: 500 }
      );
    }
  }

  // If not authorized, respond 200 OK for Optimizely endpoint readiness verification & health probes
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

  // Check for Optimizely Graph docId format (e.g. { data: { docId: "<guid>_<locale>_Published" } })
  const b = body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
  const docId =
    (b?.data && typeof b.data === 'object'
      ? (b.data as Record<string, unknown>).docId
      : null) || b?.docId;

  if (typeof docId === 'string' && docId.length > 0) {
    // If it's not a published version (e.g. draft, deleted, etc.), return 200 with no action taken
    if (!docId.includes('Published')) {
      return NextResponse.json({
        status: 'ok',
        revalidated: false,
        message: 'No action taken (document is not in Published status).',
        now: Date.now(),
      });
    }

    const resolvedPath = await resolvePathFromDocId(docId);
    if (resolvedPath) {
      try {
        revalidatePath(resolvedPath, 'page');
        if (resolvedPath === '/') {
          revalidatePath('/', 'layout');
        }
        return NextResponse.json({
          revalidated: true,
          path: resolvedPath,
          source: 'docId',
          now: Date.now(),
        });
      } catch (error) {
        return NextResponse.json(
          { message: 'Error revalidating path', error: (error as Error).message },
          { status: 500 }
        );
      }
    }
  }

  // Fall back to extracting target page path from standard payload fields
  const targetPath = extractTargetPagePath(request, body);

  if (!targetPath) {
    return NextResponse.json({
      status: 'ok',
      revalidated: false,
      message:
        'Payload does not map to any recognized cached page route. Skipped cache eviction.',
      now: Date.now(),
    });
  }

  try {
    revalidatePath(targetPath, 'page');
    if (targetPath === '/') {
      revalidatePath('/', 'layout');
    }
    return NextResponse.json({
      revalidated: true,
      path: targetPath,
      now: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error revalidating path', error: (error as Error).message },
      { status: 500 }
    );
  }
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

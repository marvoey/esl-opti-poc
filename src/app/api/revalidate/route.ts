import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

function isAuthorized(request: NextRequest): boolean {
  const expectedSecret =
    process.env.OPTIMIZELY_GRAPH_SINGLE_KEY ||
    process.env.REVALIDATE_SECRET;

  if (!expectedSecret) {
    return false;
  }

  // 1. Check query parameter: ?secret=...
  const querySecret = request.nextUrl.searchParams.get('secret');
  if (querySecret && querySecret === expectedSecret) {
    return true;
  }

  // 2. Check header: x-revalidate-secret
  const headerSecret = request.headers.get('x-revalidate-secret');
  if (headerSecret && headerSecret === expectedSecret) {
    return true;
  }

  // 3. Check Optimizely CMS SaaS Callback-Secret headers
  const callbackSecret =
    request.headers.get('callback-secret') ||
    request.headers.get('x-callback-secret');
  if (callbackSecret && callbackSecret === expectedSecret) {
    return true;
  }

  // 4. Check Authorization header: Bearer <secret>
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerSecret = authHeader.substring(7).trim();
    if (bearerSecret === expectedSecret) {
      return true;
    }
  }

  return false;
}

function normalizePath(rawPath: string): string {
  let clean = rawPath.trim();
  if (!clean.startsWith('/')) {
    try {
      const urlToParse = clean.startsWith('http://') || clean.startsWith('https://')
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
    lower.includes('startpage')
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
  if (lower === 'home' || lower.includes('esl home')) {
    return '/';
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
  // If authorized, revalidate the target path
  if (isAuthorized(request)) {
    const targetPath = extractTargetPagePath(request) || '/';
    try {
      revalidatePath(targetPath, 'page');
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
    // Body may be empty or plain text
  }

  // Handle Optimizely verification handshake probes
  const isVerificationProbe =
    !body ||
    (typeof body === 'object' &&
      (('type' in (body as object) && (body as Record<string, unknown>).type === 'verification') ||
        ('event' in (body as object) && (body as Record<string, unknown>).event === 'verification') ||
        Object.keys(body as object).length === 0));

  if (!isAuthorized(request)) {
    if (isVerificationProbe) {
      return NextResponse.json({
        status: 'ready',
        revalidated: false,
        message: 'Revalidation endpoint verified.',
        now: Date.now(),
      });
    }

    return NextResponse.json(
      { message: 'Invalid or missing authorization secret' },
      { status: 401 }
    );
  }

  const targetPath = extractTargetPagePath(request, body);

  if (!targetPath) {
    return NextResponse.json({
      revalidated: false,
      message:
        'Payload does not map to any recognized cached page route. Skipped cache eviction.',
      now: Date.now(),
    });
  }

  try {
    // Revalidates ONLY the specific published page
    revalidatePath(targetPath, 'page');
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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      Allow: 'GET, POST, HEAD, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}

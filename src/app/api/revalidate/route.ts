import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { getGraphClient } from '@/infrastructure/cms/graphClient';
import {
  getSites,
  publicPathFromCmsPath,
  resolveSiteByOrigin,
  sitePath,
  type Site,
} from '@/infrastructure/cms/siteRouting';

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
 * What to evict for one published item.
 * - `paths`: the public paths affected (reported in the response).
 * - `routes`: the internal routes passed to `revalidatePath`. Pages live under
 *   `/sites/<site key>/...` (see src/proxy.ts), and `revalidatePath` needs the
 *   rewritten destination, not the browser URL.
 */
interface RevalidationPlan {
  paths: string[];
  routes: Array<{ path: string; type?: 'layout' }>;
}

function sitesFor(origin?: string | null): Site[] {
  const site = origin ? resolveSiteByOrigin(origin) : null;
  return site ? [site] : getSites();
}

/** Every page of the given sites (the site layout covers header, footer and all pages). */
function planForSites(sites: Site[]): RevalidationPlan {
  return {
    paths: ['/'],
    routes: [
      // Site-specific layout eviction for backwards-compatibility with existing tests/monitors
      ...sites.map((site) => ({ path: sitePath(site, '/'), type: 'layout' as const })),
      // Page-level eviction for Home page (_N_T_/sites/<site key>)
      ...sites.map((site) => ({ path: sitePath(site, '/') })),
      // Next.js App Router layout pattern tag (_N_T_/sites/[site]/layout)
      { path: '/sites/[site]', type: 'layout' as const },
      // Root layout tag (_N_T_/layout)
      { path: '/', type: 'layout' as const },
    ],
  };
}

/**
 * Plan for a CMS URL (relative or absolute). An absolute URL, or `origin`,
 * limits eviction to that site; otherwise every site served here is evicted.
 *
 * Examples:
 * - "/home/product-detail/" -> /product-detail
 * - "https://brand.org/accounts/savings/" -> /accounts/savings on brand.org
 * - "/home/" (Home) or "/" (start page: header and footer) -> the whole site
 */
function planForCmsUrl(rawUrl: string, origin?: string | null): RevalidationPlan {
  const trimmed = rawUrl.trim();
  if (trimmed.startsWith('/sites/')) {
    return {
      paths: ['/'],
      routes: [{ path: trimmed }],
    };
  }

  let urlOrigin = origin ?? null;
  if (!urlOrigin && /^https?:\/\//i.test(trimmed)) {
    try {
      urlOrigin = new URL(trimmed).origin;
    } catch {
      urlOrigin = null;
    }
  }

  const sites = sitesFor(urlOrigin);
  const publicPath = publicPathFromCmsPath(trimmed);
  if (publicPath === null || publicPath === '/') {
    return planForSites(sites);
  }

  return {
    paths: [publicPath],
    routes: sites.map((site) => ({ path: sitePath(site, publicPath) })),
  };
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

/**
 * True when a payload without a URL names a page, experience, or site-level
 * component (header, footer, megamenu, sitesettings).
 */
function isPageContentType(body?: unknown): boolean {
  const typeName = extractContentTypeFromPayload(body);
  if (typeName && /experience|page|header|footer|mega\s*menu|site\s*settings/i.test(typeName)) return true;

  const b = body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
  const d = b?.data && typeof b.data === 'object' ? (b.data as Record<string, unknown>) : null;
  const types = (Array.isArray(d?.types) ? d.types : Array.isArray(b?.types) ? b.types : []) as unknown[];
  return types.some(
    (t) =>
      typeof t === 'string' &&
      (t === '_Page' || t === '_Experience' || /header|footer|mega\s*menu|site\s*settings/i.test(t))
  );
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
            base
            type
          }
        }
      }
    }
  }
`;

async function resolvePlanFromGuid(rawGuid: string): Promise<RevalidationPlan | null> {
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
            base?: string | null;
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

    const base = item._metadata.url?.base ?? null;
    const rawUrl = item._metadata.url?.hierarchical || item._metadata.url?.default;
    if (rawUrl) {
      return planForCmsUrl(rawUrl, base);
    }

    const types = item._metadata.types || [];
    if (
      types.some((t) => {
        const lower = t.toLowerCase().replace(/\s+/g, '');
        return (
          lower.includes('homeexperience') ||
          lower.includes('startpage') ||
          lower.includes('sitesettings') ||
          lower.includes('header') ||
          lower.includes('footer') ||
          lower.includes('megamenu')
        );
      })
    ) {
      return planForSites(sitesFor(base));
    }
  } catch (err) {
    console.error('Error fetching content by guid in revalidation:', err);
  }

  return null;
}

function executeRevalidations(plan: RevalidationPlan): void {
  for (const route of plan.routes) {
    try {
      if (route.type) {
        revalidatePath(route.path, route.type);
      } else {
        revalidatePath(route.path);
      }
    } catch (e) {
      console.error(`Error revalidating route "${route.path}":`, e);
    }
  }

  // Also purge public paths directly (for public router cache / CDN consistency)
  for (const publicPath of plan.paths) {
    try {
      revalidatePath(publicPath);
    } catch (e) {
      console.error(`Error revalidating public path "${publicPath}":`, e);
    }
  }
}

function revalidated(plan: RevalidationPlan, source?: string) {
  executeRevalidations(plan);
  return NextResponse.json({
    revalidated: true,
    path: plan.paths[0],
    paths: plan.paths,
    routes: plan.routes.map((route) => route.path),
    ...(source ? { source } : {}),
    now: Date.now(),
  });
}

export async function GET(request: NextRequest) {
  console.log(`[REVALIDATE GET] url: ${request.url}`);
  console.log(`[REVALIDATE GET] headers:`, Object.fromEntries(request.headers.entries()));

  // If authorized, revalidate the target path
  if (isAuthorized(request)) {
    const queryPath = request.nextUrl.searchParams.get('path') || '/';
    try {
      return revalidated(planForCmsUrl(queryPath));
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
      const plan = await resolvePlanFromGuid(rawGuid);
      if (plan && plan.routes.length > 0) {
        return revalidated(plan, 'docId');
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
    const plan = await resolvePlanFromGuid(guidCandidate);
    if (plan && plan.routes.length > 0) {
      return revalidated(plan, 'guid');
    }
  }

  // 3. Check for direct URL in payload (e.g. data.publicUrl, data.url, path, etc.)
  const rawUrl = extractRawUrlFromPayload(body);
  if (rawUrl) {
    return revalidated(planForCmsUrl(rawUrl), 'url');
  }

  // 4. A page type without a URL: the changed page is unknown, so evict every site.
  if (isPageContentType(body)) {
    return revalidated(planForSites(getSites()), 'contentType');
  }

  // 5. Check for explicit path in request query parameters (?path=/...)
  const queryPath = request.nextUrl.searchParams.get('path');
  if (queryPath) {
    return revalidated(planForCmsUrl(queryPath), 'queryPath');
  }

  // 6. Fallback for manual test invocations with empty body
  if (
    body === null ||
    body === undefined ||
    (typeof body === 'object' && Object.keys(body as object).length === 0)
  ) {
    return revalidated(planForSites(getSites()), 'fallback');
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

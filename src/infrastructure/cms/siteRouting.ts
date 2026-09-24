/**
 * Site and URL routing between the public website and Optimizely CMS.
 *
 * Every CMS page is served by `src/app/sites/[site]/[[...slug]]/page.tsx`.
 * `src/proxy.ts` rewrites each request to `/sites/<site key>/<path>`, choosing
 * the site from the request host, so one deployment can serve several CMS
 * sites (one start page per domain) and each page stays cacheable.
 *
 * URL convention: the Home experience directly under the start page is the
 * public root. CMS `/home/` is served at `/`, CMS `/home/product-family/` at
 * `/product-family`. Pages outside Home keep their CMS path.
 */

type Env = Record<string, string | undefined>;

export const HOME_PREFIX = '/home';
export const SITES_SEGMENT = 'sites';

const DEFAULT_APP_HOST = 'http://localhost:5002';

export interface Site {
  /** URL-safe key used in the internal route segment, e.g. `localhost_5002`. */
  key: string;
  /** CMS application base URL; matches Graph `_metadata.url.base`. */
  origin: string;
}

function toOrigin(value: string): string | null {
  try {
    return new URL(value.trim()).origin;
  } catch {
    return null;
  }
}

export function siteKeyFromHost(host: string): string {
  return host.trim().toLowerCase().replace(/[^a-z0-9.-]/g, '_');
}

function toSite(origin: string): Site {
  return { key: siteKeyFromHost(new URL(origin).host), origin };
}

/**
 * Sites this deployment serves, from `OPTIMIZELY_SITE_HOSTS` (comma-separated
 * origins). `OPTIMIZELY_APP_HOST` is always included and is the default site.
 */
export function getSites(env: Env = process.env): Site[] {
  const defaultOrigin = toOrigin(env.OPTIMIZELY_APP_HOST || DEFAULT_APP_HOST) ?? DEFAULT_APP_HOST;
  const listed = (env.OPTIMIZELY_SITE_HOSTS ?? '')
    .split(',')
    .map((value) => (value.trim() ? toOrigin(value) : null))
    .filter((origin): origin is string => Boolean(origin));

  const origins = [defaultOrigin, ...listed.filter((origin) => origin !== defaultOrigin)];
  return origins.map(toSite);
}

export function getDefaultSite(env: Env = process.env): Site {
  return getSites(env)[0];
}

/**
 * Site for an incoming request host. Unknown hosts (Vercel preview URLs,
 * 127.0.0.1, ...) are served as the default site, so they keep working.
 */
export function resolveSiteForHost(host: string | null | undefined, env: Env = process.env): Site {
  const sites = getSites(env);
  if (host) {
    const key = siteKeyFromHost(host);
    const match = sites.find((site) => site.key === key);
    if (match) return match;
  }
  return sites[0];
}

export function resolveSiteByKey(key: string, env: Env = process.env): Site | null {
  return getSites(env).find((site) => site.key === key) ?? null;
}

export function resolveSiteByOrigin(origin: string, env: Env = process.env): Site | null {
  const normalized = toOrigin(origin);
  return getSites(env).find((site) => site.origin === normalized) ?? null;
}

function normalizePath(path: string): string {
  let clean = path.trim();
  if (!clean.startsWith('/')) clean = `/${clean}`;
  clean = clean.replace(/\/{2,}/g, '/');
  while (clean.length > 1 && clean.endsWith('/')) clean = clean.slice(0, -1);
  return clean;
}

/**
 * CMS paths to try, in order, for a public path. Graph stores page URLs with
 * a trailing slash.
 * - `/`                -> [`/home/`]
 * - `/product-family`  -> [`/home/product-family/`, `/product-family/`]
 */
export function cmsPathCandidates(publicPath: string): string[] {
  const clean = normalizePath(publicPath);
  if (clean === '/') return [`${HOME_PREFIX}/`];
  return [`${HOME_PREFIX}${clean}/`, `${clean}/`];
}

/**
 * Public path for a CMS URL (relative or absolute).
 * - `/home/` -> `/`, `/home/product-family/` -> `/product-family`
 * - `/other/` -> `/other`
 * - `/` (the start page, which holds site settings, not a page) -> null
 */
export function publicPathFromCmsPath(cmsUrl: string): string | null {
  let path = cmsUrl.trim();
  if (/^https?:\/\//i.test(path)) {
    try {
      path = new URL(path).pathname;
    } catch {
      return null;
    }
  }

  const clean = normalizePath(path);
  if (clean === '/') return null;
  if (clean === HOME_PREFIX) return '/';
  if (clean.startsWith(`${HOME_PREFIX}/`)) return clean.slice(HOME_PREFIX.length);
  return clean;
}

/**
 * Canonical public path for a request path: links that still carry the CMS
 * `/home` prefix are redirected to the path without it.
 */
export function canonicalPublicPath(pathname: string): string {
  if (pathname === HOME_PREFIX || pathname === `${HOME_PREFIX}/`) return '/';
  if (pathname.startsWith(`${HOME_PREFIX}/`)) return pathname.slice(HOME_PREFIX.length);
  return pathname;
}

/** Internal route path for a public path, e.g. `/sites/localhost_5002/product-family`. */
export function sitePath(site: Site, publicPath: string): string {
  const clean = normalizePath(publicPath);
  return `/${SITES_SEGMENT}/${site.key}${clean === '/' ? '' : clean}`;
}

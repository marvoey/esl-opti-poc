import { NextResponse, type NextRequest } from 'next/server';
import { canonicalPublicPath, resolveSiteForHost, sitePath } from '@/infrastructure/cms/siteRouting';

/**
 * Routes every page request to the CMS site that owns the request host:
 * `brand.org/product-family` is rendered by `/sites/brand.org/product-family`
 * (an internal rewrite; the browser URL does not change). See siteRouting.ts.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CMS links carry the `/home` prefix; send visitors to the public URL.
  const canonical = canonicalPublicPath(pathname);
  if (canonical !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = canonical;
    return NextResponse.redirect(url, 307);
  }

  const host =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? request.nextUrl.host;
  const site = resolveSiteForHost(host);

  const url = request.nextUrl.clone();
  url.pathname = sitePath(site, pathname);
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except route handlers, Next internals, opti-media proxy, and files with an extension.
  matcher: ['/((?!api/|_next/|opti-media/|.*\\.[a-zA-Z0-9]+$).*)'],
};

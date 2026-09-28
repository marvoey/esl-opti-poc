export interface ImageOptimizationOptions {
  width?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpeg';
}

export interface ImageRefContent {
  key?: string | null;
  item?: {
    Url?: string | null;
    AltText?: string | null;
    Title?: string | null;
    [key: string]: unknown;
  } | null;
  url?: {
    default?: string | null;
    hierarchical?: string | null;
    graph?: string | null;
    base?: string | null;
    internal?: string | null;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
}


/**
 * Checks whether a given hostname belongs to Optimizely's CMS, CMP, or DXP CDN network.
 */
function isOptimizelyDomain(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (
    host.endsWith('.optimizely.com') ||
    host.endsWith('.optimizely.net') ||
    host.endsWith('.cmp.optimizely.com')
  ) {
    return true;
  }

  const cmsBase = process.env.OPTIMIZELY_CMS_URL;
  if (cmsBase) {
    try {
      const cmsHost = new URL(cmsBase).hostname.toLowerCase();
      if (host === cmsHost) return true;
    } catch {
      // Ignore invalid URL in OPTIMIZELY_CMS_URL
    }
  }

  return false;
}

/**
 * Applies on-the-fly Cloudflare CDN image resizing and next-gen format conversion
 * to Optimizely CMS / CMP assets through a first-party /opti-media/ reverse proxy.
 *
 * Pattern: /opti-media/cdn-cgi/image/width=<w>,format=<fmt>,quality=<q>/<path>
 */
export function optimizeMediaUrl(
  rawUrl?: string | null,
  options: ImageOptimizationOptions = {}
): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';

  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  // Local static public assets (e.g. /images/...) should not be modified
  if (trimmed.startsWith('/images/')) {
    return trimmed;
  }

  // Already routed via opti-media proxy
  if (trimmed.startsWith('/opti-media/')) {
    return trimmed;
  }

  const isSvg = trimmed.toLowerCase().endsWith('.svg') || trimmed.includes('.svg?');

  // If already wrapped in cdn-cgi/image, rewrite to /opti-media/ proxy to prevent tracker blocking
  if (trimmed.includes('/cdn-cgi/image/')) {
    try {
      const parsed = new URL(trimmed);
      if (isOptimizelyDomain(parsed.hostname)) {
        const isCmp = parsed.hostname.toLowerCase().endsWith('.cmp.optimizely.com');
        const prefix = isCmp ? '/opti-media/cmp' : '/opti-media';
        const cleanPath = parsed.pathname.replace(/^\/+/, '');
        const search = parsed.search || '';
        return `${prefix}/${cleanPath}${search}`;
      }
    } catch {
      if (trimmed.startsWith('/')) {
        return `/opti-media/${trimmed.replace(/^\/+/, '')}`;
      }
    }
    return trimmed;
  }

  // SVG images are vector-based; never rasterize or convert them, but route through proxy
  if (isSvg) {
    try {
      const parsed = new URL(trimmed);
      if (isOptimizelyDomain(parsed.hostname)) {
        const isCmp = parsed.hostname.toLowerCase().endsWith('.cmp.optimizely.com');
        const prefix = isCmp ? '/opti-media/cmp' : '/opti-media';
        const cleanPath = parsed.pathname.replace(/^\/+/, '');
        const search = parsed.search || '';
        return `${prefix}/${cleanPath}${search}`;
      }
      return trimmed;
    } catch {
      if (trimmed.startsWith('/') && !trimmed.startsWith('/images/')) {
        return `/opti-media/${trimmed.replace(/^\/+/, '')}`;
      }
      return trimmed;
    }
  }

  const { width, quality = 80, format = 'auto' } = options;

  // Build the CDN options list
  const opts: string[] = [];
  if (width && width > 0) opts.push(`width=${width}`);
  if (format) opts.push(`format=${format}`);
  if (quality) opts.push(`quality=${quality}`);

  const optionsString = opts.join(',');

  try {
    const parsed = new URL(trimmed);

    // Apply Cloudflare image optimization to Optimizely CMS domains, and native resizing to Optimizely CMP DAM domains via first-party proxy
    if (isOptimizelyDomain(parsed.hostname)) {
      const isCmp = parsed.hostname.toLowerCase().endsWith('.cmp.optimizely.com');
      const cleanPath = parsed.pathname.replace(/^\/+/, '');

      if (isCmp) {
        // Optimizely CMP DAM natively supports dynamic query parameters (e.g. ?width=...).
        // Bypassing Cloudflare /cdn-cgi/image/ allows DAM asset versioning to update immediately without 24-hour edge cache locks.
        const queryParams = new URLSearchParams(parsed.search);
        if (width && width > 0) queryParams.set('width', String(width));
        const queryString = queryParams.toString();
        return `/opti-media/cmp/${cleanPath}${queryString ? `?${queryString}` : ''}`;
      }

      const search = parsed.search || '';
      return `/opti-media/cdn-cgi/image/${optionsString}/${cleanPath}${search}`;
    }

    return trimmed;
  } catch {
    // Relative URL (e.g. /globalassets/family.jpg)
    if (trimmed.startsWith('/') && !trimmed.startsWith('/images/')) {
      const cleanPath = trimmed.replace(/^\/+/, '');
      return `/opti-media/cdn-cgi/image/${optionsString}/${cleanPath}`;
    }

    return trimmed;
  }
}

/**
 * Resolves a raw CMS image reference object into an optimized media URL.
 */
export function resolveMediaUrl(
  imageRef?: ImageRefContent | null,
  options?: ImageOptimizationOptions
): string {
  if (!imageRef) return '';

  const rawUrl =
    imageRef.item?.Url ||
    imageRef.url?.default ||
    imageRef.url?.hierarchical ||
    imageRef.url?.graph ||
    imageRef.url?.base ||
    imageRef.url?.internal ||
    (typeof imageRef.key === 'string' &&
    (imageRef.key.startsWith('/') || imageRef.key.startsWith('http'))
      ? imageRef.key
      : '') ||
    '';

  if (!rawUrl) return '';

  return optimizeMediaUrl(rawUrl, options);
}

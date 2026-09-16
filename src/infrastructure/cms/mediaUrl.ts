export interface ImageOptimizationOptions {
  width?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpeg';
}

export interface ImageRefContent {
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
 * to Optimizely CMS / CMP assets.
 *
 * Pattern: https://<domain>/cdn-cgi/image/width=<w>,format=<fmt>,quality=<q>/<path>
 */
export function optimizeMediaUrl(
  rawUrl?: string | null,
  options: ImageOptimizationOptions = {}
): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';

  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  // SVG images are vector-based; never rasterize or convert them
  if (trimmed.toLowerCase().endsWith('.svg') || trimmed.includes('.svg?')) {
    return trimmed;
  }

  // If already wrapped in cdn-cgi/image, return as-is to prevent double-wrapping
  if (trimmed.includes('/cdn-cgi/image/')) {
    return trimmed;
  }

  // Local static public assets (e.g. /images/...) should not be modified
  if (trimmed.startsWith('/images/')) {
    return trimmed;
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

    // Apply Cloudflare image optimization to Optimizely CMS/CMP domains
    if (isOptimizelyDomain(parsed.hostname)) {
      const cleanPath = parsed.pathname.replace(/^\/+/, '');
      const search = parsed.search || '';
      return `${parsed.origin}/cdn-cgi/image/${optionsString}/${cleanPath}${search}`;
    }

    return trimmed;
  } catch {
    // Relative URL (e.g. /globalassets/family.jpg)
    if (trimmed.startsWith('/') && !trimmed.startsWith('/images/')) {
      const cmsBase = process.env.OPTIMIZELY_CMS_URL || '';
      if (cmsBase) {
        const baseClean = cmsBase.replace(/\/$/, '');
        const fullUrl = `${baseClean}${trimmed}`;
        return optimizeMediaUrl(fullUrl, options);
      }
      return `/cdn-cgi/image/${optionsString}${trimmed}`;
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
    '';

  if (!rawUrl) return '';

  return optimizeMediaUrl(rawUrl, options);
}

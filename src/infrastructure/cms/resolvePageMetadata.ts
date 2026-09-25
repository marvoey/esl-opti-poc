import { cache } from 'react';
import type { Metadata } from 'next';
import { getGraphClient } from '@/infrastructure/cms/graphClient';
import { resolveMediaUrl } from '@/infrastructure/cms/mediaUrl';
import type { EslSeoProperties } from '@/components/cms/shared/EslSeoContract';
import '@/infrastructure/cms/optimizely-registry';

export interface StartPageSeoData extends EslSeoProperties {
  title?: string | null;
}

const START_PAGE_SEO_QUERY = `
  query GetStartPageSeo($host: String) {
    EslStartPage(where: { _metadata: { url: { base: { eq: $host } } } }) {
      items {
        title
        metaTitle
        metaDescription
        canonicalUrl
        noIndex
        noFollow
        ogTitle
        ogDescription
        ogImage {
          key
          url {
            default
            hierarchical
            graph
            base
            internal
          }
        }
        aeoQuickAnswer
        geoSchemaType
        jsonLdOverride
      }
    }
  }
`;

interface StartPageSeoResponse {
  EslStartPage?: {
    items?: Array<StartPageSeoData>;
  };
}

/**
 * Resolves global SEO and metadata defaults from EslStartPage for a given origin.
 * Wrapped in React `cache` so generateMetadata and the page renderer share a single request.
 */
export const resolveStartPageSeo = cache(
  async (origin: string): Promise<StartPageSeoData | null> => {
    const client = getGraphClient();
    if (!client) return null;

    try {
      const response = (await client.request(
        START_PAGE_SEO_QUERY,
        { host: origin },
        undefined,
        true
      )) as StartPageSeoResponse | null;

      return response?.EslStartPage?.items?.[0] ?? null;
    } catch (error) {
      console.warn('Could not resolve CMS Start Page SEO settings:', error);
      return null;
    }
  }
);

export interface PageMetadataInput {
  pageContent?: (Record<string, unknown> & EslSeoProperties) | null;
  startPageSeo?: StartPageSeoData | null;
  siteOrigin: string;
  pathname: string;
  siteTitle?: string | null;
}

export interface ResolvedPageSeo {
  metadata: Metadata;
  jsonLd: Record<string, unknown> | Array<Record<string, unknown>> | null;
}

/**
 * Normalizes a URL to be absolute given the site origin.
 */
function toAbsoluteUrl(urlOrPath: string, origin: string): string {
  const trimmed = urlOrPath.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${origin.replace(/\/+$/, '')}${cleanPath}`;
}

/**
 * Pure function that computes Next.js Metadata and Schema.org JSON-LD
 * using the two-tier hierarchical fallback model:
 *
 * Page Properties -> Start Page Defaults -> Next.js / Platform Defaults
 */
export function buildPageSeo({
  pageContent,
  startPageSeo,
  siteOrigin,
  pathname,
  siteTitle = 'ESL Federal Credit Union',
}: PageMetadataInput): ResolvedPageSeo {
  const isHome = pathname === '/' || pathname === '/home' || pathname === '';
  const pageDisplayName =
    typeof (pageContent?._metadata as { displayName?: string } | undefined)?.displayName === 'string'
      ? (pageContent?._metadata as { displayName?: string }).displayName
      : undefined;

  // 1. Meta Title
  const authoredMetaTitle =
    (pageContent?.metaTitle && pageContent.metaTitle.trim()) ||
    (isHome && startPageSeo?.metaTitle && startPageSeo.metaTitle.trim()) ||
    undefined;

  const rawMetaTitle = authoredMetaTitle || pageDisplayName || undefined;

  // When an explicit Meta Title is authored, mark it as `absolute` so Next.js does
  // not append the layout's title template suffix (e.g., ` | ESL Federal Credit Union - Optimizely`).
  // Fallbacks like pageDisplayName continue to use the template layout.
  const title: Metadata['title'] = authoredMetaTitle
    ? { absolute: authoredMetaTitle }
    : rawMetaTitle;

  // 2. Meta Description
  const rawMetaDesc =
    (pageContent?.metaDescription && pageContent.metaDescription.trim()) ||
    (startPageSeo?.metaDescription && startPageSeo.metaDescription.trim()) ||
    undefined;

  // 3. Canonical URL
  const authoredCanonical = pageContent?.canonicalUrl && pageContent.canonicalUrl.trim();
  const fallbackCanonicalPath = isHome
    ? '/'
    : pathname.endsWith('/')
    ? pathname
    : `${pathname}/`;
  const canonicalUrl = authoredCanonical
    ? toAbsoluteUrl(authoredCanonical, siteOrigin)
    : toAbsoluteUrl(fallbackCanonicalPath, siteOrigin);

  // 4 & 5. Robots: NoIndex & NoFollow
  const noIndex =
    pageContent?.noIndex === true ||
    (pageContent?.noIndex == null && startPageSeo?.noIndex === true);
  const noFollow =
    pageContent?.noFollow === true ||
    (pageContent?.noFollow == null && startPageSeo?.noFollow === true);

  // 6. OG Title
  const ogTitle =
    (pageContent?.ogTitle && pageContent.ogTitle.trim()) ||
    (isHome && startPageSeo?.ogTitle && startPageSeo.ogTitle.trim()) ||
    (pageContent?.metaTitle && pageContent.metaTitle.trim()) ||
    (isHome && startPageSeo?.metaTitle && startPageSeo.metaTitle.trim()) ||
    pageDisplayName ||
    (startPageSeo?.ogTitle && startPageSeo.ogTitle.trim()) ||
    (startPageSeo?.metaTitle && startPageSeo.metaTitle.trim()) ||
    siteTitle ||
    'ESL Federal Credit Union';

  // 7. OG Description
  const ogDesc =
    (pageContent?.ogDescription && pageContent.ogDescription.trim()) ||
    (pageContent?.metaDescription && pageContent.metaDescription.trim()) ||
    (startPageSeo?.ogDescription && startPageSeo.ogDescription.trim()) ||
    (startPageSeo?.metaDescription && startPageSeo.metaDescription.trim()) ||
    undefined;

  // 8. OG Image
  const rawOgImageRef = pageContent?.ogImage || startPageSeo?.ogImage;
  let resolvedOgImageUrl: string | undefined = undefined;
  if (rawOgImageRef) {
    let mediaUrl = '';
    if (typeof rawOgImageRef === 'string') {
      mediaUrl = rawOgImageRef;
    } else if (typeof rawOgImageRef === 'object' && rawOgImageRef !== null) {
      const candidate = rawOgImageRef as Record<string, unknown>;
      if (typeof candidate.Url === 'string') {
        mediaUrl = candidate.Url;
      } else {
        mediaUrl = resolveMediaUrl(rawOgImageRef as Parameters<typeof resolveMediaUrl>[0]);
      }
    }
    if (mediaUrl) {
      resolvedOgImageUrl = toAbsoluteUrl(mediaUrl, siteOrigin);
    }
  }

  // 9. AEO Quick Answer / TL;DR
  const aeoQuickAnswer =
    (pageContent?.aeoQuickAnswer && pageContent.aeoQuickAnswer.trim()) ||
    (startPageSeo?.aeoQuickAnswer && startPageSeo.aeoQuickAnswer.trim()) ||
    undefined;

  // 10. GEO Schema Type
  const geoSchemaType =
    (pageContent?.geoSchemaType && pageContent.geoSchemaType.trim()) ||
    (startPageSeo?.geoSchemaType && startPageSeo.geoSchemaType.trim()) ||
    'WebPage';

  // Build Next.js Metadata
  const metadata: Metadata = {
    title,
    description: rawMetaDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noFollow,
      ...(noIndex
        ? {
            nocache: true,
            googleBot: {
              index: false,
              follow: !noFollow,
              noimageindex: true,
              'max-video-preview': -1,
              'max-image-preview': 'none',
              'max-snippet': -1,
            },
          }
        : {
            googleBot: {
              index: true,
              follow: !noFollow,
              'max-video-preview': -1,
              'max-image-preview': 'large',
              'max-snippet': -1,
            },
          }),
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonicalUrl,
      siteName: siteTitle || 'ESL Federal Credit Union',
      images: resolvedOgImageUrl ? [{ url: resolvedOgImageUrl }] : undefined,
      type: 'website',
    },
    twitter: {
      card: resolvedOgImageUrl ? 'summary_large_image' : 'summary',
      title: ogTitle,
      description: ogDesc,
      images: resolvedOgImageUrl ? [resolvedOgImageUrl] : undefined,
    },
  };

  if (aeoQuickAnswer) {
    metadata.other = {
      abstract: aeoQuickAnswer,
    };
  }

  // 11. Schema.org JSON-LD (Automatic or Override)
  let jsonLd: Record<string, unknown> | Array<Record<string, unknown>> | null = null;
  const rawJsonOverride = pageContent?.jsonLdOverride && pageContent.jsonLdOverride.trim();

  if (rawJsonOverride) {
    try {
      jsonLd = JSON.parse(rawJsonOverride);
    } catch (parseError) {
      console.warn('Invalid JSON-LD override authored in CMS, falling back to default schema:', parseError);
    }
  }

  if (!jsonLd) {
    const baseSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': geoSchemaType,
      name: ogTitle,
      url: canonicalUrl,
    };

    if (ogDesc) {
      baseSchema.description = ogDesc;
    }
    if (resolvedOgImageUrl) {
      baseSchema.image = resolvedOgImageUrl;
    }
    if (aeoQuickAnswer) {
      baseSchema.abstract = aeoQuickAnswer;
    }

    jsonLd = baseSchema;
  }

  return {
    metadata,
    jsonLd,
  };
}

/**
 * End-to-end resolver combining page content, Start Page SEO defaults,
 * and request parameters into resolved Metadata and JSON-LD.
 */
export async function resolvePageMetadata(
  pageContent: (Record<string, unknown> & EslSeoProperties) | null,
  siteOrigin: string,
  pathname: string,
  siteTitle?: string | null
): Promise<ResolvedPageSeo> {
  const startPageSeo = await resolveStartPageSeo(siteOrigin);
  return buildPageSeo({
    pageContent,
    startPageSeo,
    siteOrigin,
    pathname,
    siteTitle,
  });
}

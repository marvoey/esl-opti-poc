import { cache } from 'react';
import { getGraphClient } from '@/infrastructure/cms/graphClient';
import { getDefaultSite } from '@/infrastructure/cms/siteRouting';
import '@/infrastructure/cms/optimizely-registry';

const SITE_TITLE_QUERY = `
  query GetSiteTitle($host: String) {
    EslStartPage(where: { _metadata: { url: { base: { eq: $host } } } }) {
      items {
        title
      }
    }
  }
`;

interface SiteTitleResponse {
  EslStartPage?: {
    items?: Array<{
      title?: string | null;
    }>;
  };
}

/**
 * Resolves the site title from EslStartPage in Optimizely Graph.
 * Falls back to null if not configured or query fails.
 *
 * Wrapped in `cache` so `generateMetadata` and the page share one request.
 */
export const resolveSiteTitle = cache(async (
  origin: string = getDefaultSite().origin
): Promise<string | null> => {
  const client = getGraphClient();
  if (!client) {
    return null;
  }

  try {
    const response = (await client.request(SITE_TITLE_QUERY, { host: origin }, undefined, true)) as SiteTitleResponse | null;
    const title = response?.EslStartPage?.items?.[0]?.title;
    if (typeof title === 'string' && title.trim().length > 0) {
      return title.trim();
    }
    return null;
  } catch (error) {
    console.warn('Could not resolve CMS site title:', error);
    return null;
  }
});

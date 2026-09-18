import { getGraphClient } from '@/infrastructure/cms/graphClient';
import '@/infrastructure/cms/optimizely-registry';

const SITE_TITLE_QUERY = `
  query GetSiteTitle {
    EslStartPage {
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
 */
export async function resolveSiteTitle(): Promise<string | null> {
  const client = getGraphClient();
  if (!client) {
    return null;
  }

  try {
    const response = (await client.request(SITE_TITLE_QUERY, {}, undefined, true)) as SiteTitleResponse | null;
    const title = response?.EslStartPage?.items?.[0]?.title;
    if (typeof title === 'string' && title.trim().length > 0) {
      return title.trim();
    }
    return null;
  } catch (error) {
    console.warn('Could not resolve CMS site title:', error);
    return null;
  }
}

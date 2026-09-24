import { cache } from 'react';
import type { GraphClient } from '@optimizely/cms-sdk';
import type { OptimizelyComponent } from '@optimizely/cms-sdk/react/server';
import { getGraphClient } from '@/infrastructure/cms/graphClient';
import { cmsPathCandidates } from '@/infrastructure/cms/siteRouting';
import { removeTypePrefix, retryWithoutUnknownTypes } from '@/infrastructure/cms/unknownTypeRecovery';
import '@/infrastructure/cms/optimizely-registry';

export type CmsPageContent = Parameters<typeof OptimizelyComponent>[0]['content'] & {
  _metadata?: {
    key?: string | null;
    displayName?: string | null;
    types?: string[] | null;
    url?: { default?: string | null; base?: string | null } | null;
  } | null;
};

/**
 * Pages at one CMS path. If the schema lags the registry (a component
 * registered in code but not pushed yet), the page is fetched again without
 * that component rather than failing. Other Graph errors propagate: they must
 * surface as errors, not be cached as a 404.
 */
async function getContentByPath(client: GraphClient, cmsPath: string, origin: string) {
  try {
    return (await client.getContentByPath(cmsPath, { host: origin })) as CmsPageContent[] | null;
  } catch (error) {
    const response = (await retryWithoutUnknownTypes(client, error)) as
      | { _Content?: { items?: unknown[] } }
      | null;
    if (!response) throw error;
    return (response._Content?.items ?? []).map(removeTypePrefix) as CmsPageContent[];
  }
}

/**
 * The published CMS page at a public path of one site, or null.
 *
 * The page is looked up by its URL within the site (Graph `url.base` + path),
 * never by content type, so any number of pages of the same type can coexist.
 * Wrapped in `cache` so `generateMetadata` and the page share one request
 * (arguments are compared by value, so pass the origin string, not a Site).
 */
export const resolvePage = cache(async (origin: string, publicPath: string): Promise<CmsPageContent | null> => {
  const client = getGraphClient();
  if (!client) return null;

  for (const cmsPath of cmsPathCandidates(publicPath)) {
    const items = await getContentByPath(client, cmsPath, origin);
    if (items && items.length > 0) return items[0];
  }

  return null;
});

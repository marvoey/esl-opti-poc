import { GraphClient } from '@optimizely/cms-sdk';
import type { FooterProps } from '@/components/organisms/footer/Footer';
import { mapCmsFooterToProps, type RawCmsFooter } from './footerMapper';
import '@/infrastructure/cms/optimizely-registry';

const START_PAGE_FOOTER_QUERY = `
  query GetStartPageFooter {
    EslStartPage {
      items {
        footer {
          brandText
          brandCta {
            text
            title
            target
            url {
              default
              hierarchical
              base
              internal
            }
          }
          columns {
            title
            links {
              text
              title
              target
              url {
                default
                hierarchical
                base
                internal
              }
            }
          }
          addressText
          legalLinks {
            text
            title
            target
            url {
              default
              hierarchical
              base
              internal
            }
          }
          serviceMarksText
          copyrightText
        }
      }
    }
  }
`;

const SITE_SETTINGS_FOOTER_QUERY = `
  query GetSiteSettingsFooter {
    EslSiteSettings {
      items {
        footer {
          brandText
          brandCta {
            text
            title
            target
            url {
              default
              hierarchical
              base
              internal
            }
          }
          columns {
            title
            links {
              text
              title
              target
              url {
                default
                hierarchical
                base
                internal
              }
            }
          }
          addressText
          legalLinks {
            text
            title
            target
            url {
              default
              hierarchical
              base
              internal
            }
          }
          serviceMarksText
          copyrightText
        }
      }
    }
  }
`;

/**
 * Resolves the global site-level footer from Optimizely Graph.
 * Looks first for EslStartPage (site root), then EslSiteSettings.
 * If no published footer exists in the CMS, returns null so no hardcoded
 * footer appears in the UI.
 */
export async function resolveFooterContent(): Promise<FooterProps | null> {
  const apiKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    const client = new GraphClient(apiKey, {
      graphUrl: process.env.OPTIMIZELY_GRAPH_GATEWAY,
    });

    // 1. Try querying EslStartPage from Graph (primary site root)
    try {
      const response = (await client.request(START_PAGE_FOOTER_QUERY, {})) as {
        EslStartPage?: {
          items?: Array<{
            footer?: RawCmsFooter | null;
          }>;
        };
      } | null;

      const items = response?.EslStartPage?.items;
      if (items && items.length > 0 && items[0]?.footer) {
        const mapped = mapCmsFooterToProps(items[0].footer);
        if (mapped) return mapped;
      }
    } catch {
      // ignore and proceed to fallback
    }

    // 2. Try querying EslSiteSettings from Graph
    try {
      const response = (await client.request(SITE_SETTINGS_FOOTER_QUERY, {})) as {
        EslSiteSettings?: {
          items?: Array<{
            footer?: RawCmsFooter | null;
          }>;
        };
      } | null;

      const items = response?.EslSiteSettings?.items;
      if (items && items.length > 0 && items[0]?.footer) {
        const mapped = mapCmsFooterToProps(items[0].footer);
        if (mapped) return mapped;
      }
    } catch {
      // ignore and proceed to path fallback
    }

    // 3. Path Fallback: Check if site-settings or root has footer
    const host = process.env.OPTIMIZELY_APP_HOST || 'http://localhost:5002';
    try {
      const content = await client.getContentByPath('/site-settings', { host });
      if (content && content.length > 0 && (content[0] as { footer?: RawCmsFooter }).footer) {
        const mapped = mapCmsFooterToProps((content[0] as { footer?: RawCmsFooter }).footer);
        if (mapped) return mapped;
      }
    } catch {
      // ignore
    }

    return null;
  } catch (error) {
    console.warn('Could not resolve CMS site footer:', error);
    return null;
  }
}

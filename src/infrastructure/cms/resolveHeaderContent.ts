import { getGraphClient } from '@/infrastructure/cms/graphClient';
import type { HeaderProps } from '@/components/header/Header';
import { mapCmsHeaderToProps, type RawCmsHeader } from './headerMapper';
import '@/infrastructure/cms/optimizely-registry';

const COMBINED_HEADER_QUERY = `
  query GetCombinedSiteHeader {
    EslStartPage {
      items {
        header {
          brandLogo {
            key
            url {
              default
            }
          }
          brandLogoAlt
          brandHref
          navLinks {
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
          cta {
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
      }
    }
    EslSiteSettings {
      items {
        header {
          brandLogo {
            key
            url {
              default
            }
          }
          brandLogoAlt
          brandHref
          navLinks {
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
          cta {
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
      }
    }
  }
`;

/**
 * Resolves the global site-level header from Optimizely Graph in a single round-trip.
 * Queries both EslStartPage (site root) and EslSiteSettings simultaneously.
 * If no published header exists in the CMS, returns null so no hardcoded
 * header appears in the UI (strict headless compliance).
 */
export async function resolveHeaderContent(): Promise<HeaderProps | null> {
  const client = getGraphClient();
  if (!client) {
    return null;
  }

  try {
    // 1. Single round-trip query for both EslStartPage and EslSiteSettings
    try {
      const response = (await client.request(COMBINED_HEADER_QUERY, {}, undefined, true)) as {
        EslStartPage?: {
          items?: Array<{
            header?: RawCmsHeader | null;
          }>;
        };
        EslSiteSettings?: {
          items?: Array<{
            header?: RawCmsHeader | null;
          }>;
        };
      } | null;

      const startPageHeader = response?.EslStartPage?.items?.[0]?.header;
      if (startPageHeader) {
        const mapped = mapCmsHeaderToProps(startPageHeader);
        if (mapped) return mapped;
      }

      const siteSettingsHeader = response?.EslSiteSettings?.items?.[0]?.header;
      if (siteSettingsHeader) {
        const mapped = mapCmsHeaderToProps(siteSettingsHeader);
        if (mapped) return mapped;
      }
    } catch (err) {
      console.warn('CMS Graph header query error:', err);
    }

    // 2. Path Fallback: Check if site-settings has header
    const host = process.env.OPTIMIZELY_APP_HOST || 'http://localhost:5002';
    try {
      const content = await client.getContentByPath('/site-settings', { host });
      if (content && content.length > 0 && (content[0] as { header?: RawCmsHeader }).header) {
        const mapped = mapCmsHeaderToProps((content[0] as { header?: RawCmsHeader }).header);
        if (mapped) return mapped;
      }
    } catch {
      // ignore
    }

    return null;
  } catch (error) {
    console.warn('Could not resolve CMS site header:', error);
    return null;
  }
}

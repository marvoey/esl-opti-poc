import { getGraphClient } from '@/infrastructure/cms/graphClient';
import { getDefaultSite } from '@/infrastructure/cms/siteRouting';
import type { FooterProps } from '@/components/organisms/footer/Footer';
import { mapCmsFooterToProps, type RawCmsFooter } from './footerMapper';
import '@/infrastructure/cms/optimizely-registry';

const COMBINED_FOOTER_QUERY = `
  query GetCombinedSiteFooter($host: String) {
    EslStartPage(where: { _metadata: { url: { base: { eq: $host } } } }) {
      items {
        footer {
          brandLogo {
            key
            url {
              default
            }
          }
          brandLogoAlt
          brandText
          brandCta {
            text
            title
            target
            url {
              default
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
            }
          }
          serviceMarksText
          copyrightText
        }
      }
    }
    EslSiteSettings(where: { _metadata: { url: { base: { eq: $host } } } }) {
      items {
        footer {
          brandLogo {
            key
            url {
              default
            }
          }
          brandLogoAlt
          brandText
          brandCta {
            text
            title
            target
            url {
              default
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
 * Resolves the global site-level footer from Optimizely Graph in a single round-trip.
 * Queries both EslStartPage (site root) and EslSiteSettings simultaneously.
 * If no published footer exists in the CMS, returns null so no hardcoded
 * footer appears in the UI.
 */
export async function resolveFooterContent(
  origin: string = getDefaultSite().origin
): Promise<FooterProps | null> {
  const client = getGraphClient();
  if (!client) {
    return null;
  }

  try {
    // 1. Single round-trip query for both EslStartPage and EslSiteSettings
    try {
      const response = (await client.request(COMBINED_FOOTER_QUERY, { host: origin }, undefined, true)) as {
        EslStartPage?: {
          items?: Array<{
            footer?: RawCmsFooter | null;
          }>;
        };
        EslSiteSettings?: {
          items?: Array<{
            footer?: RawCmsFooter | null;
          }>;
        };
      } | null;

      const startPageFooter = response?.EslStartPage?.items?.[0]?.footer;
      if (startPageFooter) {
        const mapped = mapCmsFooterToProps(startPageFooter);
        if (mapped) return mapped;
      }

      const siteSettingsFooter = response?.EslSiteSettings?.items?.[0]?.footer;
      if (siteSettingsFooter) {
        const mapped = mapCmsFooterToProps(siteSettingsFooter);
        if (mapped) return mapped;
      }
    } catch (err) {
      console.warn('CMS Graph footer query error:', err);
    }

    // 2. Path Fallback: Check if site-settings has footer
    try {
      const content = await client.getContentByPath('/site-settings', { host: origin });
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

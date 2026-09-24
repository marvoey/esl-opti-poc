import { getGraphClient } from '@/infrastructure/cms/graphClient';
import { getDefaultSite } from '@/infrastructure/cms/siteRouting';
import type { HeaderProps } from '@/components/header/Header';
import { mapCmsHeaderToProps, type RawCmsHeader } from './headerMapper';
import '@/infrastructure/cms/optimizely-registry';

const MEGA_MENU_FIELDS = `
  navLabel
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
  columns {
    heading
    items {
      icon
      link {
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
  promo {
    eyebrow
    heading
    description {
      json
      html
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
`;

const COMBINED_HEADER_QUERY = `
  query GetCombinedSiteHeader($host: String) {
    EslStartPage(where: { _metadata: { url: { base: { eq: $host } } } }) {
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
          megaMenus {
            ${MEGA_MENU_FIELDS}
          }
          ctaVariant
          ctaIcon
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
          secondaryCtaVariant
          secondaryCtaIcon
          secondaryCta {
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
    EslSiteSettings(where: { _metadata: { url: { base: { eq: $host } } } }) {
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
          megaMenus {
            ${MEGA_MENU_FIELDS}
          }
          ctaVariant
          ctaIcon
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
          secondaryCtaVariant
          secondaryCtaIcon
          secondaryCta {
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

const COMBINED_HEADER_BASE_QUERY = `
  query GetCombinedSiteHeaderBase($host: String) {
    EslStartPage(where: { _metadata: { url: { base: { eq: $host } } } }) {
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
          megaMenu {
            navLabel
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
            columns {
              heading
              items {
                icon
                link {
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
            promo {
              eyebrow
              heading
              description {
                json
                html
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
          ctaIcon
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
          secondaryCtaIcon
          secondaryCta {
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
    EslSiteSettings(where: { _metadata: { url: { base: { eq: $host } } } }) {
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
          megaMenu {
            navLabel
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
            columns {
              heading
              items {
                icon
                link {
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
            promo {
              eyebrow
              heading
              description {
                json
                html
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
          ctaIcon
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
          secondaryCtaIcon
          secondaryCta {
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

interface HeaderQueryResult {
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
}

/**
 * Resolves the global site-level header from Optimizely Graph in a single round-trip.
 * Queries both EslStartPage (site root) and EslSiteSettings simultaneously.
 * If no published header exists in the CMS, returns null so no hardcoded
 * header appears in the UI (strict headless compliance).
 */
export async function resolveHeaderContent(
  origin: string = getDefaultSite().origin
): Promise<HeaderProps | null> {
  const client = getGraphClient();
  if (!client) {
    return null;
  }

  try {
    // 1. Single round-trip query for both EslStartPage and EslSiteSettings (with MegaMenus)
    try {
      const response = (await client.request(
        COMBINED_HEADER_QUERY,
        { host: origin },
        undefined,
        true
      )) as HeaderQueryResult | null;

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
      console.warn(
        'CMS Graph header query with megaMenu error, falling back to base query:',
        err
      );
      // Fallback: If newly added megaMenu schema is not yet pushed to CMS, run base query
      try {
        const baseResponse = (await client.request(
          COMBINED_HEADER_BASE_QUERY,
          { host: origin },
          undefined,
          true
        )) as HeaderQueryResult | null;

        const startPageHeader = baseResponse?.EslStartPage?.items?.[0]?.header;
        if (startPageHeader) {
          const mapped = mapCmsHeaderToProps(startPageHeader);
          if (mapped) return mapped;
        }

        const siteSettingsHeader =
          baseResponse?.EslSiteSettings?.items?.[0]?.header;
        if (siteSettingsHeader) {
          const mapped = mapCmsHeaderToProps(siteSettingsHeader);
          if (mapped) return mapped;
        }
      } catch (baseErr) {
        console.warn('CMS Graph base header query error:', baseErr);
      }
    }

    // 2. Path Fallback: Check if site-settings has header
    try {
      const content = await client.getContentByPath('/site-settings', { host: origin });
      if (
        content &&
        content.length > 0 &&
        (content[0] as { header?: RawCmsHeader }).header
      ) {
        const mapped = mapCmsHeaderToProps(
          (content[0] as { header?: RawCmsHeader }).header
        );
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

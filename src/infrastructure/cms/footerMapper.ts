import type {
  FooterProps,
  FooterNavColumn,
  FooterLinkItem,
  FooterBrandSection,
} from '@/components/organisms/footer/Footer';
import { optimizeMediaUrl } from './mediaUrl';

export type RawCmsLink = {
  text?: string | null;
  title?: string | null;
  target?: string | null;
  url?: {
    default?: string | null;
    hierarchical?: string | null;
    base?: string | null;
    internal?: string | null;
  } | null;
};

export type RawCmsNavColumn = {
  title?: string | null;
  links?: RawCmsLink[] | null;
};

export type RawCmsMedia = {
  key?: string | null;
  url?: {
    default?: string | null;
    hierarchical?: string | null;
    base?: string | null;
    internal?: string | null;
  } | null;
  item?: {
    Url?: string | null;
  } | null;
};

export type RawCmsFooter = {
  brandLogo?: RawCmsMedia | null;
  brandLogoAlt?: string | null;
  brandText?: string | null;
  brandCta?: RawCmsLink | null;
  columns?: RawCmsNavColumn[] | null;
  addressText?: string | null;
  legalLinks?: RawCmsLink[] | null;
  serviceMarksText?: string | null;
  copyrightText?: string | null;
};

/**
 * Resolves an Optimizely CMS Link object into a standardized link descriptor.
 */
export function resolveCmsLink(linkObj?: RawCmsLink | null, fallbackLabel = '', fallbackHref = '#'): FooterLinkItem {
  if (!linkObj) {
    return {
      id: `link-${Math.random().toString(36).substring(2, 9)}`,
      label: fallbackLabel,
      href: fallbackHref,
    };
  }

  const label = (linkObj.text || linkObj.title || fallbackLabel).trim();
  const rawUrl =
    linkObj.url?.default ||
    linkObj.url?.hierarchical ||
    linkObj.url?.base ||
    linkObj.url?.internal ||
    '';
  const href = rawUrl.trim() ? rawUrl.trim() : fallbackHref;

  const rawTarget = linkObj.target?.trim().toLowerCase() || '';
  const isBlank = rawTarget === '_blank';

  return {
    id: `link-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-') || Math.random().toString(36).substring(2, 9)}`,
    label,
    href,
    target: isBlank ? '_blank' : undefined,
    rel: isBlank ? 'noopener noreferrer' : undefined,
    external: isBlank || href.startsWith('http'),
  };
}

/**
 * Resolves a CMS media reference into a clean public URL.
 */
export function resolveCmsMediaUrl(media?: RawCmsMedia | null): string {
  if (!media) return '';

  const url =
    media.item?.Url ||
    media.url?.default ||
    media.url?.hierarchical ||
    media.url?.base ||
    media.url?.internal ||
    '';

  if (!url) return '';

  return optimizeMediaUrl(url);
}

/**
 * Checks if raw CMS footer has any actual content populated by an editor.
 */
export function hasCmsFooterContent(cmsFooter?: RawCmsFooter | null): boolean {
  if (!cmsFooter) return false;

  const hasBrandLogo = Boolean(resolveCmsMediaUrl(cmsFooter.brandLogo) || cmsFooter.brandLogoAlt?.trim());
  const hasBrandText = Boolean(cmsFooter.brandText?.trim());
  const hasBrandCta = Boolean(
    cmsFooter.brandCta?.text?.trim() ||
    cmsFooter.brandCta?.title?.trim() ||
    cmsFooter.brandCta?.url?.default ||
    cmsFooter.brandCta?.url?.hierarchical
  );
  const hasColumns = Array.isArray(cmsFooter.columns) && cmsFooter.columns.length > 0;
  const hasAddress = Boolean(cmsFooter.addressText?.trim());
  const hasLegalLinks = Array.isArray(cmsFooter.legalLinks) && cmsFooter.legalLinks.length > 0;
  const hasServiceMarks = Boolean(cmsFooter.serviceMarksText?.trim());
  const hasCopyright = Boolean(cmsFooter.copyrightText?.trim());

  return (
    hasBrandLogo ||
    hasBrandText ||
    hasBrandCta ||
    hasColumns ||
    hasAddress ||
    hasLegalLinks ||
    hasServiceMarks ||
    hasCopyright
  );
}

/**
 * Maps raw Optimizely CMS footer data into strongly-typed Footer organism props.
 * Enforces business constraints:
 * - Returns null if the CMS footer has no content or does not exist (zero hardcoded fallback)
 * - At most 4 navigation columns
 * - At most 3 legal links
 */
export function mapCmsFooterToProps(cmsFooter?: RawCmsFooter | null): FooterProps | null {
  if (!hasCmsFooterContent(cmsFooter)) {
    return null;
  }

  // 1. Map Brand Section
  const brandCta = cmsFooter?.brandCta ? resolveCmsLink(cmsFooter.brandCta, '', '') : null;
  const logoUrl = resolveCmsMediaUrl(cmsFooter?.brandLogo) || undefined;
  const logoAlt = cmsFooter?.brandLogoAlt?.trim() || undefined;

  const brand: FooterBrandSection = {
    logoUrl,
    logoAlt,
    wordmark: 'ESL',
    wordmarkHref: '/',
    text: cmsFooter?.brandText?.trim() || '',
    button: (brandCta && brandCta.label)
      ? {
          label: brandCta.label,
          href: brandCta.href,
          variant: 'secondary' as const,
          external: brandCta.external,
        }
      : undefined,
  };

  // 2. Map Columns (strictly capped at 4 columns)
  const columns: FooterNavColumn[] = Array.isArray(cmsFooter?.columns)
    ? cmsFooter!.columns.slice(0, 4).map((col, idx) => {
        const title = col.title?.trim() || `Column ${idx + 1}`;
        const links = Array.isArray(col.links)
          ? col.links.map((link) => resolveCmsLink(link))
          : [];
        return {
          id: `col-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || idx}`,
          title,
          links,
        };
      })
    : [];

  // 3. Map Address
  const addressText = cmsFooter?.addressText?.trim() || undefined;

  // 4. Map Legal Links (strictly capped at 3 links)
  const legalLinks: FooterLinkItem[] = Array.isArray(cmsFooter?.legalLinks)
    ? cmsFooter!.legalLinks.slice(0, 3).map((link) => resolveCmsLink(link))
    : [];

  // 5. Map Service Marks & Copyright
  const serviceMarksText = cmsFooter?.serviceMarksText?.trim() || undefined;
  const copyrightText = cmsFooter?.copyrightText?.trim() || undefined;

  return {
    brand,
    columns,
    addressText,
    legalLinks,
    serviceMarksText,
    copyrightText,
  };
}

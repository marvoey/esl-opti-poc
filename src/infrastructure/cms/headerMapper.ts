import type { HeaderProps, HeaderNavLink } from '@/components/header/Header';
import {
  type RawCmsLink,
  type RawCmsMedia,
  resolveCmsLink,
  resolveCmsMediaUrl,
} from './footerMapper';

export type RawCmsHeader = {
  brandLogo?: RawCmsMedia | null;
  brandLogoAlt?: string | null;
  brandHref?: string | null;
  navLinks?: RawCmsLink[] | null;
  cta?: RawCmsLink | null;
};

/**
 * Checks if raw CMS header has any actual content populated by an editor.
 */
export function hasCmsHeaderContent(cmsHeader?: RawCmsHeader | null): boolean {
  if (!cmsHeader) return false;

  const hasBrandLogo = Boolean(resolveCmsMediaUrl(cmsHeader.brandLogo) || cmsHeader.brandLogoAlt?.trim());
  const hasBrandHref = Boolean(cmsHeader.brandHref?.trim());
  const hasNavLinks = Array.isArray(cmsHeader.navLinks) && cmsHeader.navLinks.length > 0;
  const hasCta = Boolean(
    cmsHeader.cta?.text?.trim() ||
    cmsHeader.cta?.title?.trim() ||
    cmsHeader.cta?.url?.default ||
    cmsHeader.cta?.url?.hierarchical
  );

  return hasBrandLogo || hasBrandHref || hasNavLinks || hasCta;
}

/**
 * Maps raw CMS header data into strongly-typed Header organism props.
 * Enforces business constraints:
 * - Returns null if the CMS header has no content or does not exist (zero hardcoded fallback)
 * - Header logo is an asset stored in the CMS; if not set, logoUrl is undefined (no fallback image in code)
 * - Single row of link references (no columns)
 * - Explore docs button is a CTA link reference, not part of the nav links list
 */
export function mapCmsHeaderToProps(cmsHeader?: RawCmsHeader | null): HeaderProps | null {
  if (!hasCmsHeaderContent(cmsHeader)) {
    return null;
  }

  // 1. Map Brand Logo (explicitly from CMS media asset, no fallback image)
  const logoUrl = resolveCmsMediaUrl(cmsHeader?.brandLogo) || undefined;
  const logoAlt = cmsHeader?.brandLogoAlt?.trim() || undefined;
  const brandHref = cmsHeader?.brandHref?.trim() || '/';

  // 2. Map Nav Links (single row of link references)
  const navLinks: HeaderNavLink[] = Array.isArray(cmsHeader?.navLinks)
    ? cmsHeader!.navLinks.map((link) => {
        const resolved = resolveCmsLink(link);
        const isBlank = link.target?.trim().toLowerCase() === '_blank';
        return {
          id: resolved.id,
          label: resolved.label,
          href: resolved.href,
          isExternal: isBlank,
        };
      })
    : [];

  // 3. Map Explore Docs CTA button (distinct from navLinks)
  let ctaText: string | undefined;
  let ctaHref: string | undefined;
  let ctaTarget: string | undefined;
  let ctaExternal: boolean | undefined;

  if (cmsHeader?.cta) {
    const resolvedCta = resolveCmsLink(cmsHeader.cta);
    if (resolvedCta.label || (cmsHeader.cta.url?.default || cmsHeader.cta.url?.hierarchical)) {
      ctaText = resolvedCta.label || undefined;
      ctaHref = resolvedCta.href;
      const isBlank = cmsHeader.cta.target?.trim().toLowerCase() === '_blank';
      ctaTarget = isBlank ? '_blank' : undefined;
      ctaExternal = isBlank;
    }
  }

  return {
    logoUrl,
    logoAlt,
    brandHref,
    navLinks,
    ctaText,
    ctaHref,
    ctaTarget,
    ctaExternal,
  };
}

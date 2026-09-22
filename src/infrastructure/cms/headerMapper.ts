import type { HeaderProps, HeaderNavLink } from '@/components/header/Header';
import type {
  MegaMenuData,
  MegaMenuColumn,
  MegaMenuColumnItem,
  MegaMenuPromo,
} from '@/components/header/megaMenuData';
import type { IconName } from '@/components/atoms/icons';
import {
  type RawCmsLink,
  type RawCmsMedia,
  resolveCmsLink,
  resolveCmsMediaUrl,
} from './footerMapper';

export type RawCmsMegaMenuColumnItem = {
  icon?: string | null;
  label?: string | null;
  link?: RawCmsLink | null;
};

export type RawCmsMegaMenuColumn = {
  heading?: string | null;
  items?: RawCmsMegaMenuColumnItem[] | null;
};

export type RawCmsMegaMenuPromo = {
  eyebrow?: string | null;
  heading?: string | null;
  description?:
    | {
        json?: unknown;
        html?: string | null;
      }
    | string
    | null;
  cta?: RawCmsLink | null;
};

export type RawCmsMegaMenu = {
  navLabel?: string | null;
  cta?: RawCmsLink | null;
  viewAllLabel?: string | null;
  viewAllLink?: RawCmsLink | null;
  columns?: RawCmsMegaMenuColumn[] | null;
  promo?: RawCmsMegaMenuPromo | null;
};

export type RawCmsHeader = {
  brandLogo?: RawCmsMedia | null;
  brandLogoAlt?: string | null;
  brandHref?: string | null;
  navLinks?: RawCmsLink[] | null;
  megaMenu?: RawCmsMegaMenu | null;
  cta?: RawCmsLink | null;
};

const VALID_ICON_NAMES: Set<IconName> = new Set([
  'user',
  'arrow-right',
  'coins',
  'headphones',
  'piggy-bank',
  'store',
  'play',
  'close',
  'car',
  'check',
  'circle-check',
  'sprout',
  'sparkles',
  'shield-check',
  'home',
  'baby',
  'graduation-cap',
  'sailboat',
  'credit-card',
  'plus',
  'minus',
  'map-pin',
  'landmark',
  'award',
  'vault',
  'smartphone',
  'hand-coins',
  'key-round',
  'wallet',
  'shield-alert',
  'chevron-down',
]);

function toIconName(iconStr?: string | null): IconName {
  if (!iconStr) return 'landmark';
  const clean = iconStr.trim().toLowerCase() as IconName;
  return VALID_ICON_NAMES.has(clean) ? clean : 'landmark';
}

function extractTextFromJson(node: unknown): string {
  if (!node || typeof node !== 'object') return '';
  const obj = node as Record<string, unknown>;
  let result = '';
  if (typeof obj.text === 'string') {
    result += obj.text;
  }
  if (Array.isArray(obj.children)) {
    for (const child of obj.children) {
      result += extractTextFromJson(child);
    }
  }
  if (Array.isArray(obj.content)) {
    for (const item of obj.content) {
      result += extractTextFromJson(item);
    }
  }
  return result;
}

export function extractRichText(
  val?:
    | {
        json?: unknown;
        html?: string | null;
      }
    | string
    | null
): string {
  if (!val) return '';
  if (typeof val === 'string') return val.trim();
  if (typeof val === 'object' && val !== null) {
    if (typeof val.html === 'string' && val.html.trim()) {
      return val.html.replace(/<[^>]*>/g, '').trim();
    }
    if (val.json && typeof val.json === 'object') {
      return extractTextFromJson(val.json).trim();
    }
  }
  return '';
}

/**
 * Checks if raw CMS mega menu has actual content populated by an editor.
 */
export function hasCmsMegaMenuContent(raw?: RawCmsMegaMenu | null): boolean {
  if (!raw) return false;
  const hasCta = Boolean(
    raw.cta?.text?.trim() ||
      raw.cta?.title?.trim() ||
      raw.cta?.url?.default ||
      raw.cta?.url?.hierarchical ||
      raw.viewAllLabel?.trim() ||
      raw.viewAllLink?.text?.trim() ||
      raw.viewAllLink?.url?.default ||
      raw.viewAllLink?.url?.hierarchical
  );
  const hasCols = Array.isArray(raw.columns) && raw.columns.length > 0;
  const hasPromo = Boolean(
    raw.promo?.heading?.trim() ||
      raw.promo?.eyebrow?.trim() ||
      extractRichText(raw.promo?.description) ||
      raw.promo?.cta?.url?.default ||
      raw.promo?.cta?.url?.hierarchical
  );
  return hasCta || hasCols || hasPromo;
}

/**
 * Maps raw CMS mega menu data into strongly-typed MegaMenuData.
 */
export function mapCmsMegaMenuToProps(
  raw?: RawCmsMegaMenu | null
): MegaMenuData | null {
  if (!hasCmsMegaMenuContent(raw)) {
    return null;
  }

  const ctaLink = raw?.cta || raw?.viewAllLink;
  const ctaResolved = resolveCmsLink(ctaLink);
  const viewAllLabel =
    ctaResolved.label || raw?.viewAllLabel?.trim() || 'View All Personal Banking';
  const viewAllHref = ctaResolved.href || '/personal';

  const columns: MegaMenuColumn[] = Array.isArray(raw?.columns)
    ? raw!.columns.map((col) => {
        const heading = col.heading?.trim() || '';
        const items: MegaMenuColumnItem[] = Array.isArray(col.items)
          ? col.items.map((item) => {
              const resolved = resolveCmsLink(item.link);
              return {
                icon: toIconName(item.icon),
                label: resolved.label || item.label?.trim() || '',
                href: resolved.href || '#',
              };
            })
          : [];
        return { heading, items };
      })
    : [];

  const promoResolvedCta = resolveCmsLink(raw?.promo?.cta);
  const promo: MegaMenuPromo = {
    eyebrow: raw?.promo?.eyebrow?.trim() || '',
    heading: raw?.promo?.heading?.trim() || '',
    description: extractRichText(raw?.promo?.description),
    ctaLabel: promoResolvedCta.label || 'Get guidance',
    ctaHref: promoResolvedCta.href || '/financial-wellness',
  };

  return {
    viewAllLabel,
    viewAllHref,
    columns,
    promo,
  };
}

/**
 * Checks if raw CMS header has any actual content populated by an editor.
 */
export function hasCmsHeaderContent(cmsHeader?: RawCmsHeader | null): boolean {
  if (!cmsHeader) return false;

  const hasBrandLogo = Boolean(
    resolveCmsMediaUrl(cmsHeader.brandLogo) || cmsHeader.brandLogoAlt?.trim()
  );
  const hasBrandHref = Boolean(cmsHeader.brandHref?.trim());
  const hasNavLinks =
    Array.isArray(cmsHeader.navLinks) && cmsHeader.navLinks.length > 0;
  const hasMegaMenu = hasCmsMegaMenuContent(cmsHeader.megaMenu);
  const hasCta = Boolean(
    cmsHeader.cta?.text?.trim() ||
      cmsHeader.cta?.title?.trim() ||
      cmsHeader.cta?.url?.default ||
      cmsHeader.cta?.url?.hierarchical
  );

  return hasBrandLogo || hasBrandHref || hasNavLinks || hasMegaMenu || hasCta;
}

/**
 * Maps raw CMS header data into strongly-typed Header organism props.
 * Enforces business constraints:
 * - Returns null if the CMS header has no content or does not exist (zero hardcoded fallback)
 * - Header logo is an asset stored in the CMS; if not set, logoUrl is undefined (no fallback image in code)
 * - Navigation links dynamically merge the optional CMS MegaMenu (e.g. Personal ^) with regular nav links
 * - Explore docs button is a CTA link reference, not part of the nav links list
 */
export function mapCmsHeaderToProps(
  cmsHeader?: RawCmsHeader | null
): HeaderProps | null {
  if (!hasCmsHeaderContent(cmsHeader)) {
    return null;
  }

  // 1. Map Brand Logo (explicitly from CMS media asset, no fallback image)
  const logoUrl = resolveCmsMediaUrl(cmsHeader?.brandLogo) || undefined;
  const logoAlt = cmsHeader?.brandLogoAlt?.trim() || undefined;
  const brandHref = cmsHeader?.brandHref?.trim() || '/';

  // 2. Map Nav Links (regular link references)
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

  // 3. Map Mega Menu (if configured in CMS)
  if (hasCmsMegaMenuContent(cmsHeader?.megaMenu)) {
    const mappedMegaMenu = mapCmsMegaMenuToProps(cmsHeader?.megaMenu);
    if (mappedMegaMenu) {
      const megaNavLabel = cmsHeader?.megaMenu?.navLabel?.trim() || 'Personal';
      const megaHref = mappedMegaMenu.viewAllHref || '/personal';

      // If an existing link in navLinks matches the mega menu label, attach to it
      const existingIndex = navLinks.findIndex(
        (l) => l.label.toLowerCase() === megaNavLabel.toLowerCase()
      );

      const megaNavLink: HeaderNavLink = {
        id: 'nav-personal',
        label: megaNavLabel,
        href: megaHref,
        megaMenu: mappedMegaMenu,
      };

      if (existingIndex >= 0) {
        navLinks[existingIndex] = {
          ...navLinks[existingIndex],
          megaMenu: mappedMegaMenu,
        };
      } else {
        // Prepend as the first navigation item (matching the design layout)
        navLinks.unshift(megaNavLink);
      }
    }
  }

  // 4. Map Explore Docs CTA button (distinct from navLinks)
  let ctaText: string | undefined;
  let ctaHref: string | undefined;
  let ctaTarget: string | undefined;
  let ctaExternal: boolean | undefined;

  if (cmsHeader?.cta) {
    const resolvedCta = resolveCmsLink(cmsHeader.cta);
    if (
      resolvedCta.label ||
      cmsHeader.cta.url?.default ||
      cmsHeader.cta.url?.hierarchical
    ) {
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

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
  megaMenus?: RawCmsMegaMenu[] | null;
  cta?: RawCmsLink | null;
  ctaVariant?: string | null;
  ctaIcon?: string | null;
  secondaryCta?: RawCmsLink | null;
  secondaryCtaVariant?: string | null;
  secondaryCtaIcon?: string | null;
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

export function parseOptionalIconName(iconStr?: string | null): IconName | undefined {
  if (!iconStr) return undefined;
  const clean = iconStr.trim().toLowerCase();
  if (clean === 'none') return undefined;
  return VALID_ICON_NAMES.has(clean as IconName) ? (clean as IconName) : undefined;
}

export function parseOptionalCtaVariant(
  variantStr?: string | null
): 'dark' | 'light' | undefined {
  if (!variantStr) return undefined;
  const clean = variantStr.trim().toLowerCase();
  if (clean === 'dark' || clean === 'primary') return 'dark';
  if (clean === 'light' || clean === 'outline') return 'light';
  return undefined;
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

  const navLabel = raw?.navLabel?.trim() || 'Personal';
  const defaultSlug = navLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const ctaLink = raw?.cta || raw?.viewAllLink;
  const ctaResolved = resolveCmsLink(ctaLink);
  const viewAllLabel =
    ctaResolved.label || raw?.viewAllLabel?.trim() || `View All ${navLabel}`;
  const viewAllHref = ctaResolved.href || `/${defaultSlug}`;

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

  let promo: MegaMenuPromo | undefined;
  if (raw?.promo) {
    const eyebrow = raw.promo.eyebrow?.trim() || '';
    const heading = raw.promo.heading?.trim() || '';
    const description = extractRichText(raw.promo.description);
    const promoResolvedCta = resolveCmsLink(raw.promo.cta);
    const ctaLabel = promoResolvedCta.label || '';
    const ctaHref = promoResolvedCta.href || '';

    // Only set promo if there is actual authored content
    if (heading || description || ctaLabel || ctaHref || eyebrow) {
      promo = {
        eyebrow,
        heading,
        description,
        ctaLabel,
        ctaHref,
      };
    }
  }

  return {
    viewAllLabel,
    viewAllHref,
    columns,
    ...(promo ? { promo } : {}),
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
  const hasMegaMenu =
    hasCmsMegaMenuContent(cmsHeader.megaMenu) ||
    (Array.isArray(cmsHeader.megaMenus) &&
      cmsHeader.megaMenus.some((m) => hasCmsMegaMenuContent(m)));
  const hasCta = Boolean(
    cmsHeader.cta?.text?.trim() ||
      cmsHeader.cta?.title?.trim() ||
      cmsHeader.cta?.url?.default ||
      cmsHeader.cta?.url?.hierarchical
  );
  const hasSecondaryCta = Boolean(
    cmsHeader.secondaryCta?.text?.trim() ||
      cmsHeader.secondaryCta?.title?.trim() ||
      cmsHeader.secondaryCta?.url?.default ||
      cmsHeader.secondaryCta?.url?.hierarchical
  );

  return (
    hasBrandLogo ||
    hasBrandHref ||
    hasNavLinks ||
    hasMegaMenu ||
    hasCta ||
    hasSecondaryCta
  );
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

  // 3. Map Mega Menus (supports both megaMenus array and legacy single megaMenu)
  const rawMegaMenus: RawCmsMegaMenu[] = [];

  if (Array.isArray(cmsHeader?.megaMenus)) {
    for (const m of cmsHeader.megaMenus) {
      if (hasCmsMegaMenuContent(m)) {
        rawMegaMenus.push(m);
      }
    }
  }

  // Include legacy single megaMenu if provided and not already included
  if (hasCmsMegaMenuContent(cmsHeader?.megaMenu)) {
    const single = cmsHeader!.megaMenu!;
    const singleLabel = single.navLabel?.trim().toLowerCase() || 'personal';
    const alreadyPresent = rawMegaMenus.some(
      (m) => (m.navLabel?.trim().toLowerCase() || 'personal') === singleLabel
    );
    if (!alreadyPresent) {
      rawMegaMenus.unshift(single);
    }
  }

  let insertIndex = 0;

  for (const rawMenu of rawMegaMenus) {
    const mappedMegaMenu = mapCmsMegaMenuToProps(rawMenu);
    if (!mappedMegaMenu) continue;

    const megaNavLabel = rawMenu.navLabel?.trim() || 'Personal';
    const slug = megaNavLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const megaHref = mappedMegaMenu.viewAllHref || `/${slug}`;

    // If an existing link in navLinks matches the mega menu label, attach to it
    const existingIndex = navLinks.findIndex(
      (l) => l.label.toLowerCase() === megaNavLabel.toLowerCase()
    );

    const megaNavLink: HeaderNavLink = {
      id: `nav-${slug}`,
      label: megaNavLabel,
      href: megaHref,
      megaMenu: mappedMegaMenu,
    };

    if (existingIndex >= 0) {
      navLinks[existingIndex] = {
        ...navLinks[existingIndex],
        href: navLinks[existingIndex].href || megaHref,
        megaMenu: mappedMegaMenu,
      };
      insertIndex = Math.max(insertIndex, existingIndex + 1);
    } else {
      // Keep all mega menus together in order at the front of the navigation bar
      navLinks.splice(insertIndex, 0, megaNavLink);
      insertIndex++;
    }
  }

  // 4. Map Primary CTA button (distinct from navLinks)
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

  // 5. Map Secondary CTA button
  let secondaryCtaText: string | undefined;
  let secondaryCtaHref: string | undefined;
  let secondaryCtaTarget: string | undefined;
  let secondaryCtaExternal: boolean | undefined;

  if (cmsHeader?.secondaryCta) {
    const resolvedSecCta = resolveCmsLink(cmsHeader.secondaryCta);
    if (
      resolvedSecCta.label ||
      cmsHeader.secondaryCta.url?.default ||
      cmsHeader.secondaryCta.url?.hierarchical
    ) {
      secondaryCtaText = resolvedSecCta.label || undefined;
      secondaryCtaHref = resolvedSecCta.href;
      const isBlank =
        cmsHeader.secondaryCta.target?.trim().toLowerCase() === '_blank';
      secondaryCtaTarget = isBlank ? '_blank' : undefined;
      secondaryCtaExternal = isBlank;
    }
  }

  const ctaVariant = parseOptionalCtaVariant(cmsHeader?.ctaVariant);
  const ctaIcon = parseOptionalIconName(cmsHeader?.ctaIcon);
  const secondaryCtaVariant = parseOptionalCtaVariant(cmsHeader?.secondaryCtaVariant);
  const secondaryCtaIcon = parseOptionalIconName(cmsHeader?.secondaryCtaIcon);

  return {
    logoUrl,
    logoAlt,
    brandHref,
    navLinks,
    ctaText,
    ctaHref,
    ctaTarget,
    ctaExternal,
    ctaVariant,
    ctaIcon,
    secondaryCtaText,
    secondaryCtaHref,
    secondaryCtaTarget,
    secondaryCtaExternal,
    secondaryCtaVariant,
    secondaryCtaIcon,
  };
}

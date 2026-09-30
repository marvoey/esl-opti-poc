"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/atoms/logo/BrandLogo";
import { CmsImage } from "@/components/atoms/image/CmsImage";
import { Button } from "@/components/atoms/button/Button";
import { UserIcon, ChevronDownIcon, CloseIcon, Icon, type IconName } from "@/components/atoms/icons";
import type { NavigationModel } from "@/domain/models/Navigation";
import { MegaMenu } from "./mega-menu/MegaMenu";
import { PERSONAL_MEGA_MENU, type MegaMenuData } from "./megaMenuData";
import styles from "./Header.module.css";

export interface HeaderNavLink {
  id?: string;
  label: string;
  href?: string;
  isExternal?: boolean;
  megaMenu?: MegaMenuData;
}

export interface HeaderProps {
  logoUrl?: string;
  logoAlt?: string;
  brandHref?: string;
  navLinks?: HeaderNavLink[];
  joinText?: string;
  joinHref?: string;
  signInText?: string;
  signInHref?: string;
  ctaText?: string;
  ctaHref?: string;
  ctaTarget?: string;
  ctaExternal?: boolean;
  ctaVariant?: "dark" | "light" | "primary" | "outline";
  ctaIcon?: IconName;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  secondaryCtaTarget?: string;
  secondaryCtaExternal?: boolean;
  secondaryCtaVariant?: "dark" | "light" | "primary" | "outline";
  secondaryCtaIcon?: IconName;
  navigation?: NavigationModel;
}

function renderCtaIcon(iconName?: IconName) {
  if (!iconName) return { leftIcon: undefined, rightIcon: undefined };
  const icon = <Icon name={iconName} size={16} />;
  return iconName === "arrow-right"
    ? { leftIcon: undefined, rightIcon: icon }
    : { leftIcon: icon, rightIcon: undefined };
}

const DEFAULT_HEADER_NAV_LINKS: HeaderNavLink[] = [
  { id: "nav-personal", label: "Personal", href: "/personal", megaMenu: PERSONAL_MEGA_MENU },
  { id: "nav-business", label: "Business", href: "/business" },
  { id: "nav-wealth", label: "Wealth", href: "/wealth" },
  { id: "nav-membership", label: "Membership", href: "/membership" },
];

const CLOSE_DELAY_MS = 150;

// ---------------------------------------------------------------------------
// Private sub-components
// ---------------------------------------------------------------------------

interface DesktopNavProps {
  links: HeaderNavLink[];
  autoId: string;
  openId: string | null;
  onOpen: (id: string) => void;
  onScheduleClose: () => void;
  onCancelClose: () => void;
  onToggle: (id: string) => void;
}

function DesktopNav({ links, autoId, openId, onOpen, onScheduleClose, onCancelClose, onToggle }: DesktopNavProps) {
  if (links.length === 0) return null;
  return (
    <nav className={styles.nav} aria-label="Primary Navigation">
      <ul className={styles.navList}>
        {links.map((link) => {
          const itemId = link.id || link.label;
          const panelId = `${autoId}-${itemId}-panel`;
          const isOpen = openId === itemId;

          if (link.megaMenu) {
            return (
              <li
                key={itemId}
                className={styles.navItem}
                onMouseEnter={() => onOpen(itemId)}
                onMouseLeave={onScheduleClose}
              >
                <button
                  type="button"
                  className={`${styles.navTrigger} ${isOpen ? styles.navTriggerActive : ""}`}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => onToggle(itemId)}
                >
                  <span className={styles.navLabel} data-label={link.label}>
                    {link.label}
                  </span>
                  <ChevronDownIcon size={14} className={styles.navChevron} />
                </button>
                {isOpen && (
                  <div onMouseEnter={onCancelClose} onMouseLeave={onScheduleClose}>
                    <MegaMenu id={panelId} label={link.label} data={link.megaMenu} />
                  </div>
                )}
              </li>
            );
          }

          return (
            <li key={itemId} className={styles.navItem}>
              <Link
                href={link.href ?? "#"}
                className={styles.navLink}
                target={link.isExternal ? "_blank" : undefined}
                rel={link.isExternal ? "noopener noreferrer" : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface MobileDrawerProps {
  id: string;
  links: HeaderNavLink[];
  openId: string | null;
  onToggle: (id: string) => void;
  hasCmsActions: boolean;
  ctaText?: string;
  ctaHref?: string;
  ctaVariant: "primary" | "outline";
  ctaLeftIcon?: React.ReactNode;
  ctaRightIcon?: React.ReactNode;
  ctaBlank: boolean;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  secondaryCtaVariant: "primary" | "outline";
  secondaryCtaLeftIcon?: React.ReactNode;
  secondaryCtaRightIcon?: React.ReactNode;
  secondaryCtaBlank: boolean;
  joinText: string;
  joinHref: string;
  signInText: string;
  signInHref: string;
}

function MobileDrawer({
  id, links, openId, onToggle,
  hasCmsActions,
  ctaText, ctaHref, ctaVariant, ctaLeftIcon, ctaRightIcon, ctaBlank,
  secondaryCtaText, secondaryCtaHref, secondaryCtaVariant, secondaryCtaLeftIcon, secondaryCtaRightIcon, secondaryCtaBlank,
  joinText, joinHref, signInText, signInHref,
}: MobileDrawerProps) {
  return (
    <div id={id} className={styles.mobileDrawer}>
      <ul className={styles.mobileList}>
        {links.map((link) => {
          const itemId = link.id || link.label;
          const isOpen = openId === itemId;
          return (
            <li key={itemId} className={styles.mobileItem}>
              {link.megaMenu ? (
                <>
                  <button
                    type="button"
                    className={styles.mobileTrigger}
                    aria-expanded={isOpen}
                    onClick={() => onToggle(itemId)}
                  >
                    {link.label}
                    <ChevronDownIcon size={16} className={isOpen ? styles.mobileChevronOpen : ""} />
                  </button>
                  {isOpen && (
                    <div className={styles.mobileAccordion}>
                      {link.megaMenu.columns.map((column) => (
                        <div key={column.heading} className={styles.mobileColumn}>
                          <p className={styles.mobileColumnHeading}>{column.heading}</p>
                          <ul className={styles.mobileColumnList}>
                            {column.items.map((navItem) => (
                              <li key={navItem.label}>
                                <Link href={navItem.href} className={styles.mobileColumnLink}>
                                  {navItem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={link.href ?? "#"} className={styles.mobileLink}>
                  {link.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <div className={styles.mobileActions}>
        {hasCmsActions ? (
          <>
            {ctaText && ctaHref && (
              <Button
                variant={ctaVariant}
                size="sm"
                shape="pill"
                href={ctaHref}
                leftIcon={ctaLeftIcon}
                rightIcon={ctaRightIcon}
                fullWidth
                target={ctaBlank ? "_blank" : undefined}
                rel={ctaBlank ? "noopener noreferrer" : undefined}
              >
                {ctaText}
              </Button>
            )}
            {secondaryCtaText && secondaryCtaHref && (
              <Button
                variant={secondaryCtaVariant}
                size="sm"
                shape="pill"
                href={secondaryCtaHref}
                leftIcon={secondaryCtaLeftIcon}
                rightIcon={secondaryCtaRightIcon}
                fullWidth
                target={secondaryCtaBlank ? "_blank" : undefined}
                rel={secondaryCtaBlank ? "noopener noreferrer" : undefined}
              >
                {secondaryCtaText}
              </Button>
            )}
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" shape="pill" href={joinHref} fullWidth>
              {joinText}
            </Button>
            <Button
              variant="outline"
              size="sm"
              shape="pill"
              href={signInHref}
              leftIcon={<UserIcon size={16} />}
              className={styles.mobileSignInButton}
              fullWidth
            >
              {signInText}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

interface DesktopActionsProps {
  hasCmsActions: boolean;
  ctaText?: string;
  ctaHref?: string;
  ctaVariant: "primary" | "outline";
  ctaLeftIcon?: React.ReactNode;
  ctaRightIcon?: React.ReactNode;
  ctaBlank: boolean;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  secondaryCtaVariant: "primary" | "outline";
  secondaryCtaLeftIcon?: React.ReactNode;
  secondaryCtaRightIcon?: React.ReactNode;
  secondaryCtaBlank: boolean;
  joinText: string;
  joinHref: string;
  signInText: string;
  signInHref: string;
  mobileOpen: boolean;
  drawerId: string;
  onMobileToggle: () => void;
}

function DesktopActions({
  hasCmsActions,
  ctaText, ctaHref, ctaVariant, ctaLeftIcon, ctaRightIcon, ctaBlank,
  secondaryCtaText, secondaryCtaHref, secondaryCtaVariant, secondaryCtaLeftIcon, secondaryCtaRightIcon, secondaryCtaBlank,
  joinText, joinHref, signInText, signInHref,
  mobileOpen, drawerId, onMobileToggle,
}: DesktopActionsProps) {
  return (
    <div className={styles.actions}>
      {hasCmsActions ? (
        <>
          {ctaText && ctaHref && (
            <Button
              variant={ctaVariant}
              size="sm"
              shape="pill"
              href={ctaHref}
              leftIcon={ctaLeftIcon}
              rightIcon={ctaRightIcon}
              className={styles.ctaButton}
              target={ctaBlank ? "_blank" : undefined}
              rel={ctaBlank ? "noopener noreferrer" : undefined}
            >
              {ctaText}
            </Button>
          )}
          {secondaryCtaText && secondaryCtaHref && (
            <Button
              variant={secondaryCtaVariant}
              size="sm"
              shape="pill"
              href={secondaryCtaHref}
              leftIcon={secondaryCtaLeftIcon}
              rightIcon={secondaryCtaRightIcon}
              className={styles.secondaryCtaButton}
              target={secondaryCtaBlank ? "_blank" : undefined}
              rel={secondaryCtaBlank ? "noopener noreferrer" : undefined}
            >
              {secondaryCtaText}
            </Button>
          )}
        </>
      ) : (
        <>
          <Button variant="outline" size="sm" shape="pill" href={joinHref} className={styles.joinButton}>
            {joinText}
          </Button>
          <Button
            variant="outline"
            size="sm"
            shape="pill"
            href={signInHref}
            leftIcon={<UserIcon size={16} />}
            className={styles.signInButton}
          >
            {signInText}
          </Button>
        </>
      )}

      <button
        type="button"
        className={styles.mobileToggle}
        aria-expanded={mobileOpen}
        aria-controls={drawerId}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        onClick={onMobileToggle}
      >
        {mobileOpen ? <CloseIcon size={22} /> : <span className={styles.hamburger} aria-hidden="true" />}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hook: mega-menu open state + outside-click / escape dismissal
// ---------------------------------------------------------------------------

interface HeaderInteractions {
  autoId: string;
  openId: string | null;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  headerRef: React.RefObject<HTMLElement | null>;
  cancelClose: () => void;
  scheduleClose: () => void;
  openMenu: (id: string) => void;
  toggleMenu: (id: string) => void;
}

function useHeaderInteractions(): HeaderInteractions {
  const autoId = useId();
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenId(null), CLOSE_DELAY_MS);
  }, [cancelClose]);

  const openMenu = useCallback((id: string) => {
    cancelClose();
    setOpenId(id);
  }, [cancelClose]);

  const toggleMenu = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenId(null);
        setMobileOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenId(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return { autoId, openId, mobileOpen, setMobileOpen, headerRef, cancelClose, scheduleClose, openMenu, toggleMenu };
}

// ---------------------------------------------------------------------------
// Prop resolution (pure — no hooks)
// ---------------------------------------------------------------------------

interface ResolvedHeaderProps {
  resolvedLinks: HeaderNavLink[];
  resolvedBrandHref: string;
  isCtaBlank: boolean;
  isSecondaryCtaBlank: boolean;
  hasCmsActions: boolean;
  primaryIconProps: ReturnType<typeof renderCtaIcon>;
  secondaryIconProps: ReturnType<typeof renderCtaIcon>;
  resolvedPrimaryVariant: "primary" | "outline";
  resolvedSecondaryVariant: "primary" | "outline";
}

function resolveHeaderProps(props: HeaderProps): ResolvedHeaderProps {
  const { navLinks, navigation, brandHref = "/", ctaTarget, ctaExternal, ctaText, ctaHref,
    secondaryCtaTarget, secondaryCtaExternal, secondaryCtaText, secondaryCtaHref,
    ctaVariant, ctaIcon, secondaryCtaVariant, secondaryCtaIcon } = props;

  const resolvedLinks: HeaderNavLink[] = navLinks
    ? navLinks
    : navigation?.items
    ? navigation.items.map((item) => ({ id: item.id, label: item.label, href: item.href, isExternal: item.isExternal }))
    : DEFAULT_HEADER_NAV_LINKS;

  return {
    resolvedLinks,
    resolvedBrandHref: navigation?.brandHref ?? brandHref,
    isCtaBlank: ctaTarget === "_blank" || Boolean(ctaExternal),
    isSecondaryCtaBlank: secondaryCtaTarget === "_blank" || Boolean(secondaryCtaExternal),
    hasCmsActions: Boolean((ctaText && ctaHref) || (secondaryCtaText && secondaryCtaHref)),
    primaryIconProps: renderCtaIcon(ctaIcon),
    secondaryIconProps: renderCtaIcon(secondaryCtaIcon),
    resolvedPrimaryVariant: ctaVariant === "light" || ctaVariant === "outline" ? "outline" : "primary",
    resolvedSecondaryVariant: secondaryCtaVariant === "dark" || secondaryCtaVariant === "primary" ? "primary" : "outline",
  };
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

export function Header(props: HeaderProps = {}) {
  const {
    logoUrl, logoAlt,
    ctaText, ctaHref, secondaryCtaText, secondaryCtaHref,
    joinText = "Join", joinHref = "/join",
    signInText = "Sign in", signInHref = "/sign-in",
  } = props;

  const {
    resolvedLinks, resolvedBrandHref, isCtaBlank, isSecondaryCtaBlank, hasCmsActions,
    primaryIconProps, secondaryIconProps, resolvedPrimaryVariant, resolvedSecondaryVariant,
  } = resolveHeaderProps(props);

  const { autoId, openId, mobileOpen, setMobileOpen, headerRef, cancelClose, scheduleClose, openMenu, toggleMenu } =
    useHeaderInteractions();

  const drawerId = `${autoId}-mobile-drawer`;

  const drawerProps: MobileDrawerProps = {
    id: drawerId,
    links: resolvedLinks,
    openId,
    onToggle: toggleMenu,
    hasCmsActions,
    ctaText, ctaHref, ctaVariant: resolvedPrimaryVariant,
    ctaLeftIcon: primaryIconProps.leftIcon, ctaRightIcon: primaryIconProps.rightIcon, ctaBlank: isCtaBlank,
    secondaryCtaText, secondaryCtaHref, secondaryCtaVariant: resolvedSecondaryVariant,
    secondaryCtaLeftIcon: secondaryIconProps.leftIcon, secondaryCtaRightIcon: secondaryIconProps.rightIcon, secondaryCtaBlank: isSecondaryCtaBlank,
    joinText, joinHref, signInText, signInHref,
  };

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.brandWrapper}>
            <Link
              href={resolvedBrandHref}
              className={styles.brandLink}
              aria-label={logoAlt || "ESL Federal Credit Union - Home"}
            >
              {logoUrl ? (
                <CmsImage
                  src={logoUrl}
                  alt={logoAlt || "Brand Logo"}
                  width={83}
                  height={50}
                  optimizeWidth={166}
                  className={styles.logo}
                  style={{ height: 50 }}
                  priority
                />
              ) : (
                <BrandLogo width={83} height={50} color="var(--color-primary)" className={styles.logo} />
              )}
            </Link>
          </div>

          <DesktopNav
            links={resolvedLinks}
            autoId={autoId}
            openId={openId}
            onOpen={openMenu}
            onScheduleClose={scheduleClose}
            onCancelClose={cancelClose}
            onToggle={toggleMenu}
          />

          <DesktopActions
            hasCmsActions={hasCmsActions}
            ctaText={ctaText} ctaHref={ctaHref} ctaVariant={resolvedPrimaryVariant}
            ctaLeftIcon={primaryIconProps.leftIcon} ctaRightIcon={primaryIconProps.rightIcon} ctaBlank={isCtaBlank}
            secondaryCtaText={secondaryCtaText} secondaryCtaHref={secondaryCtaHref} secondaryCtaVariant={resolvedSecondaryVariant}
            secondaryCtaLeftIcon={secondaryIconProps.leftIcon} secondaryCtaRightIcon={secondaryIconProps.rightIcon} secondaryCtaBlank={isSecondaryCtaBlank}
            joinText={joinText} joinHref={joinHref} signInText={signInText} signInHref={signInHref}
            mobileOpen={mobileOpen}
            drawerId={drawerId}
            onMobileToggle={() => setMobileOpen((open) => !open)}
          />
        </div>
      </div>

      {mobileOpen && <MobileDrawer {...drawerProps} />}
    </header>
  );
}

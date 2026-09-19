"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/atoms/logo/BrandLogo";
import { Button } from "@/components/atoms/button/Button";
import { UserIcon, ChevronDownIcon, CloseIcon } from "@/components/atoms/icons";
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
  brandHref?: string;
  navLinks?: HeaderNavLink[];
  joinText?: string;
  joinHref?: string;
  signInText?: string;
  signInHref?: string;
  navigation?: NavigationModel;
}

export const DEFAULT_HEADER_NAV_LINKS: HeaderNavLink[] = [
  {
    id: "nav-personal",
    label: "Personal",
    href: "/personal",
    megaMenu: PERSONAL_MEGA_MENU,
  },
  { id: "nav-business", label: "Business", href: "/business" },
  { id: "nav-wealth", label: "Wealth", href: "/wealth" },
  { id: "nav-membership", label: "Membership", href: "/membership" },
];

const CLOSE_DELAY_MS = 150;

export function Header({
  brandHref = "/",
  navLinks,
  joinText = "Join",
  joinHref = "/join",
  signInText = "Sign in",
  signInHref = "/sign-in",
  navigation,
}: HeaderProps = {}) {
  const resolvedLinks: HeaderNavLink[] =
    navLinks ??
    navigation?.items.map((item) => ({
      id: item.id,
      label: item.label,
      href: item.href,
      isExternal: item.isExternal,
    })) ??
    DEFAULT_HEADER_NAV_LINKS;

  const resolvedBrandHref = navigation?.brandHref ?? brandHref;

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

  const openMenu = useCallback(
    (id: string) => {
      cancelClose();
      setOpenId(id);
    },
    [cancelClose]
  );

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

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.brandWrapper}>
            <Link
              href={resolvedBrandHref}
              className={styles.brandLink}
              aria-label="Main Navigation"
            >
              <BrandLogo
                width={83}
                height={50}
                color="var(--color-primary)"
                className={styles.logo}
              />
            </Link>
          </div>

          <nav className={styles.nav} aria-label="Primary Navigation">
            <ul className={styles.navList}>
              {resolvedLinks.map((link) => {
                const itemId = link.id || link.label;
                const panelId = `${autoId}-${itemId}-panel`;
                const isOpen = openId === itemId;

                if (link.megaMenu) {
                  return (
                    <li
                      key={itemId}
                      className={styles.navItem}
                      onMouseEnter={() => openMenu(itemId)}
                      onMouseLeave={scheduleClose}
                    >
                      <button
                        type="button"
                        className={`${styles.navTrigger} ${isOpen ? styles.navTriggerActive : ""}`}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        aria-controls={panelId}
                        onClick={() => toggleMenu(itemId)}
                      >
                        {link.label}
                        <ChevronDownIcon
                          size={14}
                          className={styles.navChevron}
                        />
                      </button>
                      {isOpen && (
                        <div
                          onMouseEnter={cancelClose}
                          onMouseLeave={scheduleClose}
                        >
                          <MegaMenu id={panelId} data={link.megaMenu} />
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

          <div className={styles.actions}>
            <Button
              variant="outline"
              size="sm"
              shape="pill"
              href={joinHref}
              className={styles.joinButton}
            >
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

            <button
              type="button"
              className={styles.mobileToggle}
              aria-expanded={mobileOpen}
              aria-controls={`${autoId}-mobile-drawer`}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? (
                <CloseIcon size={22} />
              ) : (
                <span className={styles.hamburger} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div id={`${autoId}-mobile-drawer`} className={styles.mobileDrawer}>
          <ul className={styles.mobileList}>
            {resolvedLinks.map((link) => {
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
                        onClick={() => toggleMenu(itemId)}
                      >
                        {link.label}
                        <ChevronDownIcon
                          size={16}
                          className={isOpen ? styles.mobileChevronOpen : ""}
                        />
                      </button>
                      {isOpen && (
                        <div className={styles.mobileAccordion}>
                          {link.megaMenu.columns.map((column) => (
                            <div key={column.heading} className={styles.mobileColumn}>
                              <p className={styles.mobileColumnHeading}>
                                {column.heading}
                              </p>
                              <ul className={styles.mobileColumnList}>
                                {column.items.map((navItem) => (
                                  <li key={navItem.label}>
                                    <Link
                                      href={navItem.href}
                                      className={styles.mobileColumnLink}
                                    >
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
            <Button variant="outline" size="sm" shape="pill" href={joinHref} fullWidth>
              {joinText}
            </Button>
            <Button
              variant="outline"
              size="sm"
              shape="pill"
              href={signInHref}
              leftIcon={<UserIcon size={16} />}
              fullWidth
            >
              {signInText}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

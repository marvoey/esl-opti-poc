import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/atoms/button/Button';
import type { NavigationModel } from '@/domain/models/Navigation';
import styles from './Header.module.css';

export interface HeaderNavLink {
  id?: string;
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface HeaderProps {
  logoUrl?: string;
  logoAlt?: string;
  brandHref?: string;
  navLinks?: HeaderNavLink[];
  ctaText?: string;
  ctaHref?: string;
  ctaTarget?: string;
  ctaExternal?: boolean;
  navigation?: NavigationModel;
}

export const DEFAULT_HEADER_NAV_LINKS: HeaderNavLink[] = [
  { id: 'nav-home', label: 'Home', href: '/' },
  { id: 'nav-features', label: 'Features', href: '/#features' },
  { id: 'nav-architecture', label: 'Architecture', href: '/#architecture' },
  { id: 'nav-faq', label: 'FAQ', href: '/#faq' },
];

export function Header({
  logoUrl,
  logoAlt,
  brandHref = '/',
  navLinks,
  ctaText,
  ctaHref,
  ctaTarget,
  ctaExternal,
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
    [];

  const resolvedBrandHref = navigation?.brandHref ?? brandHref;

  const isCtaBlank = ctaTarget === '_blank' || Boolean(ctaExternal);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.inner}>
          {logoUrl ? (
            <div className={styles.brandWrapper}>
              <Link
                href={resolvedBrandHref}
                className={styles.brandLink}
                aria-label={logoAlt || 'Main Navigation'}
              >
                <img
                  src={logoUrl}
                  alt={logoAlt || 'Brand Logo'}
                  width={83}
                  height={50}
                  className={styles.logo}
                />
              </Link>
            </div>
          ) : null}

          {resolvedLinks.length > 0 ? (
            <nav className={styles.nav} aria-label="Primary Navigation">
              <ul className={styles.navList}>
                {resolvedLinks.map((link) => (
                  <li key={link.id || link.label} className={styles.navItem}>
                    <Link
                      href={link.href}
                      className={styles.navLink}
                      target={link.isExternal ? '_blank' : undefined}
                      rel={link.isExternal ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {ctaText && ctaHref ? (
            <div className={styles.actions}>
              <Button
                variant="primary"
                size="sm"
                shape="pill"
                href={ctaHref}
                className={styles.ctaButton}
                target={isCtaBlank ? '_blank' : undefined}
                rel={isCtaBlank ? 'noopener noreferrer' : undefined}
              >
                {ctaText}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

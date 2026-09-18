import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/atoms/logo/BrandLogo';
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
  brandHref?: string;
  navLinks?: HeaderNavLink[];
  ctaText?: string;
  ctaHref?: string;
  navigation?: NavigationModel;
}

export const DEFAULT_HEADER_NAV_LINKS: HeaderNavLink[] = [
  { id: 'nav-home', label: 'Home', href: '/' },
  { id: 'nav-features', label: 'Features', href: '/#features' },
  { id: 'nav-architecture', label: 'Architecture', href: '/#architecture' },
  { id: 'nav-faq', label: 'FAQ', href: '/#faq' },
];

export function Header({
  brandHref = '/',
  navLinks,
  ctaText = 'Explore Docs',
  ctaHref = 'https://docs.developers.optimizely.com',
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

  return (
    <header className={styles.header}>
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

          <div className={styles.actions}>
            <Button
              variant="primary"
              size="sm"
              shape="pill"
              href={ctaHref}
              className={styles.ctaButton}
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

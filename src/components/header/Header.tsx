import React from "react";
import Link from "next/link";
import { NavigationModel } from "@/domain/models/Navigation";
import { Menu } from "./menu/Menu";
import styles from "./Header.module.css";

interface HeaderProps {
  navigation: NavigationModel;
}

export function Header({ navigation }: HeaderProps) {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerInner}>
        <Link href={navigation.brandHref} className={styles.brandLink}>
          <span>{navigation.brandName}</span>
          <span className={styles.brandBadge}>SDD</span>
        </Link>
        <Menu items={navigation.items} />
      </div>
    </header>
  );
}

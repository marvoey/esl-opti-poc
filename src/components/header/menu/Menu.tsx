import React from "react";
import Link from "next/link";
import { NavItem } from "@/domain/models/Navigation";
import styles from "./Menu.module.css";

interface MenuProps {
  items: NavItem[];
}

export function Menu({ items }: MenuProps) {
  return (
    <nav aria-label="Main Navigation">
      <ul className={styles.menuList}>
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className={styles.menuItemLink}
              target={item.isExternal ? "_blank" : undefined}
              rel={item.isExternal ? "noopener noreferrer" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SideMenu.module.css";

type StaticPage = { path: string; title: string };
type Status = "idle" | "loading" | "ready" | "error";

// App Router routes, navigated client-side.
const ROUTES: StaticPage[] = [
  { path: "/", title: "Home" },
  { path: "/dry-run-deck", title: "Dry-run deck" },
];

/**
 * Navigation drawer on the left edge that stays collapsed by default. It lists the App Router
 * routes above plus the standalone HTML pages in /public, which come from /api/public-pages and
 * are fetched the first time the drawer opens.
 */
export function SideMenu() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [pages, setPages] = useState<StaticPage[]>([]);
  const rootRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const navId = useId();

  function loadPages() {
    setStatus("loading");
    fetch("/api/public-pages")
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<{ pages: StaticPage[] }>;
      })
      .then((data) => {
        setPages(data.pages);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }

  function toggle() {
    // First open fetches the list; a failed fetch is retried on the next open.
    if (!open && (status === "idle" || status === "error")) loadPages();
    setOpen(!open);
  }

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <aside ref={rootRef} className={styles.menu} data-open={open} aria-label="Side menu">
      <button
        type="button"
        className={styles.tab}
        aria-expanded={open}
        aria-controls={navId}
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={toggle}
      >
        <span className={styles.chevron} aria-hidden="true" />
      </button>
      {/* inert keeps the hidden drawer's links out of the tab order and the accessibility tree */}
      <nav id={navId} className={styles.drawer} aria-label="Site pages" inert={!open}>
        <p className={styles.heading}>Navigate</p>
        {status === "error" && <p className={styles.message}>Could not load pages.</p>}
        <ul className={styles.list}>
          {ROUTES.map((route) => (
            <li key={route.path}>
              <Link
                className={styles.link}
                href={route.path}
                aria-current={route.path === pathname ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span className={styles.title}>{route.title}</span>
                <span className={styles.path}>{route.path}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className={styles.heading}>Pages</p>
        {status === "loading" && <p className={styles.message}>Loading…</p>}
        <ul className={styles.list}>
          {pages.map((page) => (
            <li key={page.path}>
              {/* Plain anchor: these are static files, not App Router routes. */}
              <a
                className={styles.link}
                href={page.path}
                aria-current={page.path === pathname ? "page" : undefined}
              >
                <span className={styles.title}>{page.title}</span>
                <span className={styles.path}>{page.path}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

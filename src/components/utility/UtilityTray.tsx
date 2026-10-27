"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./UtilityTray.module.css";

type StaticPage = { path: string; title: string };
const HOME: StaticPage = { path: "/", title: "Home" };
type Status = "idle" | "loading" | "ready" | "error";

/**
 * Bottom tray that slides up from the viewport edge and stays collapsed by default. It holds a
 * "Pages" button that opens the same page list as the floating widget on the standalone HTML pages
 * in /public (`public/pages-widget.js`). The list comes from /api/public-pages and is fetched the
 * first time it opens.
 */
export function UtilityTray() {
  const [trayOpen, setTrayOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [pages, setPages] = useState<StaticPage[]>([]);
  const rootRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const panelId = useId();

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

  function toggleTray() {
    if (trayOpen) setOpen(false);
    setTrayOpen(!trayOpen);
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
    <aside ref={rootRef} className={styles.tray} data-open={trayOpen} aria-label="Utility tray">
      <button
        type="button"
        className={styles.tab}
        aria-expanded={trayOpen}
        aria-label={trayOpen ? "Hide utility tray" : "Show utility tray"}
        onClick={toggleTray}
      >
        <span className={styles.chevron} aria-hidden="true" />
      </button>
      {/* inert keeps the hidden tray's controls out of the tab order and the accessibility tree */}
      <div className={styles.bar} inert={!trayOpen}>
        {open && (
          <div id={panelId} className={styles.panel}>
            {status === "error" && <p className={styles.message}>Could not load pages.</p>}
            {status === "loading" && <p className={styles.message}>Loading…</p>}
            <ul className={styles.list}>
              {[HOME, ...pages].map((page) => (
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
          </div>
        )}
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          onClick={toggle}
        >
          <span aria-hidden="true">☰</span> Pages
        </button>
      </div>
    </aside>
  );
}

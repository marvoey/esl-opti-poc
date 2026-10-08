"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export interface SessionUserView {
  displayName: string;
}

const SIGNED_OUT_EVENT = "esl:signed-out";

/** Tells every header on the page that the user is signing out, before the server has answered. */
export function announceSignOut(): void {
  window.dispatchEvent(new Event(SIGNED_OUT_EVENT));
}

/**
 * Who is signed in, fetched on the client. The CMS pages are statically cached, so the
 * session cookie is not read while rendering them; this asks the server instead.
 *
 * The header lives in the layout and is not remounted by client-side navigation, so the
 * answer is re-checked on every route change (signing in redirects away from /sign-in) and
 * cleared at once on sign-out (which may redirect to the page you are already on).
 * Anonymous (or unreachable) resolves to null, which keeps the normal "Sign in" button.
 */
export function useSessionUser(): SessionUserView | null {
  const [user, setUser] = useState<SessionUserView | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth/session", { cache: "no-store", credentials: "same-origin", signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { user?: SessionUserView | null } | null) => setUser(data?.user ?? null))
      .catch(() => {
        // Aborted by a newer check or unmount, or the endpoint is unreachable: leave as is.
      });
    return () => controller.abort();
  }, [pathname]);

  useEffect(() => {
    const clear = () => setUser(null);
    window.addEventListener(SIGNED_OUT_EVENT, clear);
    return () => window.removeEventListener(SIGNED_OUT_EVENT, clear);
  }, []);

  return user;
}

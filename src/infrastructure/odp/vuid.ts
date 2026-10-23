export const VUID_COOKIE_NAME = 'vuid';
const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

/** The shape the proxy route accepts; also checked before the server trusts the cookie. ODP stores vuid as char(32), so longer ids are rejected there. */
export const isValidVuid = (value: string): boolean => /^[A-Za-z0-9_-]{8,32}$/.test(value);

/**
 * The visitor id inside a raw `vuid` cookie value, or null when it is not usable. An ODP tracker on
 * the page may already have set this cookie as `<id>|<extra>`; the id is the part before the `|`.
 */
export function normalizeVuid(raw: string | undefined | null): string | null {
  if (!raw) return null;
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    // keep the raw value; validation below rejects it if it is malformed
  }
  const id = decoded.split('|')[0];
  return isValidVuid(id) ? id : null;
}

/** Reads the vuid out of a `document.cookie` string. */
export function parseVuid(cookieString: string): string | null {
  const match = cookieString.match(new RegExp(`(?:^|;\\s*)${VUID_COOKIE_NAME}=([^;]+)`));
  return normalizeVuid(match?.[1]);
}

/**
 * TEMPORARY: demo visitor id built from the browser's local month, day and hour, e.g.
 * `vuid_esl_live_demo_10_23_14`. Everyone browsing in the same hour shares one ODP profile, and a
 * new hour starts a new one. Longest form is 27 characters, under ODP's 32. Replace with a random
 * per-visitor id before real use.
 */
export function demoVuid(now: Date = new Date()): string {
  return `vuid_esl_live_demo_${now.getMonth() + 1}_${now.getDate()}_${now.getHours()}`;
}

/**
 * The visitor id for this browser: the current demo vuid, written to the cookie if the cookie holds
 * anything else (including the previous hour's id). It carries no identity, so it is the only
 * identifier the browser holds. Client-only.
 */
export function getOrCreateClientVuid(): string {
  if (typeof document === 'undefined') return '';
  const vuid = demoVuid();
  if (parseVuid(document.cookie) !== vuid) {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${VUID_COOKIE_NAME}=${vuid}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax${secure}`;
  }
  return vuid;
}

export function clearClientVuid(): void {
  document.cookie = `${VUID_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

const FALLBACK = '/';
const MAX_LENGTH = 2048;

/**
 * Post-sign-in destination from untrusted input (`?next=`). Only same-site relative paths pass,
 * so a crafted link cannot bounce a user to another origin after they sign in.
 */
export function safeRedirectPath(value: unknown, fallback: string = FALLBACK): string {
  if (typeof value !== 'string' || value.length === 0 || value.length > MAX_LENGTH) return fallback;
  if (!value.startsWith('/') || value.startsWith('//')) return fallback;
  // Backslashes and control characters are normalised by browsers into `//` or other origins.
  if (/[\\\u0000-\u001f\u007f]/.test(value)) return fallback;

  try {
    const base = 'http://redirect.invalid';
    const url = new URL(value, base);
    if (url.origin !== base) return fallback;
    if (url.pathname === '/sign-in' || url.pathname.startsWith('/sign-in/')) return fallback;
  } catch {
    return fallback;
  }
  return value;
}

import { findUser } from './userStore';

/**
 * Demo personalization cookie: it holds the member's username so the site can say who is signed in.
 *
 * This is NOT authentication. The cookie is not signed, so anyone can set it to another
 * member's username. Use it only to personalize what a visitor sees; never to protect data or
 * to authorize an action. For that, replace this module with a real identity provider (OIDC).
 *
 * The cookie is only a lookup key: it is matched against data/users.json on every read, so an
 * unknown value yields no user and the displayed name always comes from the file.
 */
export const SESSION_TTL_SECONDS = 8 * 60 * 60;

export interface SessionUser {
  username: string;
  displayName: string;
}

type Env = Record<string, string | undefined>;

/** The cookie value for a member who has just signed in. */
export function createSessionValue(user: { username: string }): string {
  return user.username;
}

/** The member a cookie value refers to, or null when it is missing or not in the users file. */
export function readSessionUser(value: string | undefined | null): SessionUser | null {
  if (!value) return null;
  const user = findUser(value);
  return user ? { username: user.username, displayName: user.displayName } : null;
}

/** `__Host-` pins the cookie to this exact host over HTTPS; it needs Secure, so production only. */
export function sessionCookieName(env: Env = process.env): string {
  return env.NODE_ENV === 'production' ? '__Host-esl_session' : 'esl_session';
}

export function sessionCookieOptions(env: Env = process.env) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  };
}

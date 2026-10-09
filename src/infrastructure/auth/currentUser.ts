import { cookies } from 'next/headers';
import { sessionCookieName, readSessionUser, type SessionUser } from './session';

/** The signed-in member for the current request, or null. Reads cookies, so it makes the caller dynamic. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  return readSessionUser(cookieStore.get(sessionCookieName())?.value);
}

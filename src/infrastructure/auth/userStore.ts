import { z } from 'zod';
import usersFile from '../../../data/users.json';

/**
 * Demo members: `data/users.json` is bundled at build time. Each entry is
 * `{ "username", "displayName" }`; usernames are matched case-insensitively. An entry may also carry
 * an `email`, used server-side only to stitch the visitor's ODP profile on sign-in. It is never
 * sent to the browser.
 * There are no passwords: the sign-in only picks who the site is personalized for.
 */
const UserRecordSchema = z.object({
  username: z.string().trim().min(1).max(64),
  displayName: z.string().trim().min(1).max(100),
  email: z.email().optional(),
});

export type UserRecord = z.infer<typeof UserRecordSchema>;

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

/** Parses the users file; throws when it is malformed or has duplicate usernames. */
export function parseUsers(raw: unknown): UserRecord[] {
  const users = z.array(UserRecordSchema).parse(raw);
  const seen = new Set<string>();
  return users.map((user) => {
    const username = normalizeUsername(user.username);
    if (seen.has(username)) throw new Error(`Duplicate username in users file: ${username}`);
    seen.add(username);
    return { ...user, username };
  });
}

let cached: UserRecord[] | undefined;

/** A malformed users file means nobody can sign in. */
export function getUsers(): UserRecord[] {
  if (cached) return cached;
  try {
    cached = parseUsers(usersFile);
  } catch (error) {
    console.error('[auth] data/users.json is invalid; sign-in is disabled', error);
    cached = [];
  }
  return cached;
}

export function findUser(username: string): UserRecord | undefined {
  const wanted = normalizeUsername(username);
  return getUsers().find((user) => user.username === wanted);
}

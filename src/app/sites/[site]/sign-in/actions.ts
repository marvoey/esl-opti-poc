"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { findUser, type UserRecord } from "@/infrastructure/auth/userStore";
import { safeRedirectPath } from "@/infrastructure/auth/safeRedirect";
import {
  AUDIENCE_COOKIE_NAME,
  AUDIENCE_COOKIE_VALUE,
  audienceCookieOptions,
  createSessionValue,
  sessionCookieName,
  sessionCookieOptions,
} from "@/infrastructure/auth/session";
import { stitchVisitorToMember } from "@/infrastructure/odp/stitch";

export interface SignInState {
  error?: string;
  /**
   * Set on success. The client navigates here with a full page load rather than the server
   * calling redirect(): a soft navigation keeps the Optimizely snippet running, and it only
   * evaluates its cookie audiences on page load.
   */
  redirectTo?: string;
}

// The password field is for show: it is never read or checked. Only the username picks the member.
const SignInSchema = z.object({
  username: z.string().trim().min(1).max(64),
});

const UNKNOWN_MEMBER = "We don't recognize that username.";

function logAuthEvent(event: string, details: Record<string, string | number> = {}) {
  console.info(JSON.stringify({ scope: "auth", event, ...details }));
}

export async function signIn(_previous: SignInState | undefined, formData: FormData): Promise<SignInState> {
  const parsed = SignInSchema.safeParse({ username: formData.get("username") });
  if (!parsed.success) return { error: UNKNOWN_MEMBER };

  const user = findUser(parsed.data.username);
  if (!user) {
    logAuthEvent("sign_in_failed", { usernameHint: parsed.data.username.slice(0, 3) });
    return { error: UNKNOWN_MEMBER };
  }

  await startSession(user);
  return { redirectTo: safeRedirectPath(formData.get("next")) };
}

/** Sets the session cookies, then stitches the visitor's anonymous ODP profile to the member. */
async function startSession(user: UserRecord): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName(), createSessionValue(user), sessionCookieOptions());
  cookieStore.set(AUDIENCE_COOKIE_NAME, AUDIENCE_COOKIE_VALUE, audienceCookieOptions());
  logAuthEvent("sign_in_succeeded", { username: user.username });

  const stitch = await stitchVisitorToMember(user);
  if (stitch) logAuthEvent("identity_stitch", { odpStatus: stitch.status ?? 0, ok: stitch.success ? 1 : 0 });
}

/** One-click sign-in for the presenter HUD (Act 3). Same effect as the sign-in form. */
export async function signInAs(username: string): Promise<{ ok: boolean }> {
  const user = findUser(String(username));
  if (!user) return { ok: false };
  await startSession(user);
  return { ok: true };
}

export async function signOut(): Promise<void> {
  // An expired cookie rather than delete(): the __Host- prefix requires the Secure attribute.
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName(), "", { ...sessionCookieOptions(), maxAge: 0 });
  cookieStore.set(AUDIENCE_COOKIE_NAME, "", { ...audienceCookieOptions(), maxAge: 0 });
  logAuthEvent("sign_out");
}

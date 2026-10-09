"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { findUser } from "@/infrastructure/auth/userStore";
import { safeRedirectPath } from "@/infrastructure/auth/safeRedirect";
import {
  createSessionValue,
  sessionCookieName,
  sessionCookieOptions,
} from "@/infrastructure/auth/session";

export interface SignInState {
  error?: string;
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

  (await cookies()).set(sessionCookieName(), createSessionValue(user), sessionCookieOptions());
  logAuthEvent("sign_in_succeeded", { username: user.username });

  // redirect() throws, so it stays outside any try/catch.
  redirect(safeRedirectPath(formData.get("next")));
}

export async function signOut(): Promise<void> {
  // An expired cookie rather than delete(): the __Host- prefix requires the Secure attribute.
  (await cookies()).set(sessionCookieName(), "", { ...sessionCookieOptions(), maxAge: 0 });
  logAuthEvent("sign_out");
  redirect("/");
}

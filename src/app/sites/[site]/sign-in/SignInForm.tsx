"use client";

import React, { useActionState, useEffect, useId } from "react";
import { Button } from "@/components/atoms/button/Button";
import { Text } from "@/components/atoms/text/Text";
import { signIn, type SignInState } from "./actions";
import styles from "./SignInForm.module.css";

export interface SignInFormProps {
  /** Same-site path to return to after signing in; validated again on the server. */
  next?: string;
}

export function SignInForm({ next }: SignInFormProps) {
  const [state, formAction, pending] = useActionState<SignInState | undefined, FormData>(signIn, undefined);
  const errorId = useId();

  // Full page load so the Optimizely snippet re-evaluates its audiences with the new cookie.
  useEffect(() => {
    if (state?.redirectTo) window.location.assign(state.redirectTo);
  }, [state?.redirectTo]);

  return (
    <form action={formAction} className={styles.form} noValidate>
      {next && <input type="hidden" name="next" value={next} />}

      <div className={styles.field}>
        <label htmlFor="sign-in-username" className={styles.label}>
          Username
        </label>
        <input
          id="sign-in-username"
          name="username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={64}
          required
          className={styles.input}
          aria-invalid={state?.error ? true : undefined}
          aria-describedby={state?.error ? errorId : undefined}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="sign-in-password" className={styles.label}>
          Password
        </label>
        <input
          id="sign-in-password"
          name="password"
          type="password"
          autoComplete="current-password"
          maxLength={128}
          className={styles.input}
        />
      </div>

      {state?.error && (
        <div id={errorId} role="alert" className={styles.error}>
          <Text as="p" variant="body-sm" color="inherit">
            {state.error}
          </Text>
        </div>
      )}

      <Button type="submit" fullWidth isLoading={pending}>
        Sign in
      </Button>
    </form>
  );
}

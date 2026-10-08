"use client";

import React from "react";
import { Button } from "@/components/atoms/button/Button";
import { UserIcon } from "@/components/atoms/icons";
import { signOut } from "@/app/sites/[site]/sign-in/actions";
import { announceSignOut } from "./useSessionUser";
import styles from "./Header.module.css";

export interface AccountMenuProps {
  displayName: string;
  /** Layout variant: the desktop bar (hidden on small screens) or the mobile drawer. */
  variant?: "desktop" | "mobile";
}

/** Signed-in state of the header: who you are, and a sign-out button. */
export function AccountMenu({ displayName, variant = "desktop" }: AccountMenuProps) {
  return (
    <div className={variant === "mobile" ? styles.mobileAccount : styles.account}>
      <span className={styles.accountName}>
        <UserIcon size={16} aria-hidden="true" />
        <span>
          <span className={styles.srOnly}>Signed in as </span>
          {displayName}
        </span>
      </span>
      <form action={signOut} onSubmit={announceSignOut}>
        <Button type="submit" variant="outline" size="sm" shape="pill" fullWidth={variant === "mobile"}>
          Sign out
        </Button>
      </form>
    </div>
  );
}

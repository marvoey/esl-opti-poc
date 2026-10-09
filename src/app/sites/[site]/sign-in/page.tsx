import React from "react";
import type { Metadata } from "next";
import { Heading } from "@/components/atoms/heading/Heading";
import { Text } from "@/components/atoms/text/Text";
import { safeRedirectPath } from "@/infrastructure/auth/safeRedirect";
import { SignInForm } from "./SignInForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Sign in",
};

type Props = {
  searchParams: Promise<{ next?: string | string[] }>;
};

/** Sign-in page. Declared here so `/sign-in` is not looked up as a CMS page. */
export default async function SignInPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const destination = safeRedirectPath(Array.isArray(next) ? next[0] : next);

  return (
    <main id="main-content" className={styles.main}>
      <section className={styles.card} aria-labelledby="sign-in-heading">
        <Heading level="h2" as="h1" id="sign-in-heading">
          Sign in
        </Heading>
        <Text as="p" variant="body" color="secondary">
          Enter your username and password to continue.
        </Text>
        <SignInForm next={destination === "/" ? undefined : destination} />
      </section>
    </main>
  );
}

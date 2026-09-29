import React, { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/organisms/footer/Footer";
import { resolveHeaderContent } from "@/infrastructure/cms/resolveHeaderContent";
import { resolveFooterContent } from "@/infrastructure/cms/resolveFooterContent";
import { resolveSiteTitle } from "@/infrastructure/cms/resolveSiteTitle";
import { getSites, resolveSiteByKey } from "@/infrastructure/cms/siteRouting";

export const revalidate = 60;

export function generateStaticParams() {
  return getSites().map((site) => ({ site: site.key }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ site: string }>;
};

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const site = resolveSiteByKey((await params).site);
  const siteTitle = site ? await resolveSiteTitle(site.origin) : null;
  const defaultTitle = siteTitle || "ESL Federal Credit Union";

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${defaultTitle}`,
    },
  };
}

async function ServerHeader({ origin }: { origin: string }) {
  const headerProps = await resolveHeaderContent(origin);
  if (!headerProps) return null;
  return <Header {...headerProps} />;
}

async function ServerFooter({ origin }: { origin: string }) {
  const footerProps = await resolveFooterContent(origin);
  if (!footerProps) return null;
  return <Footer {...footerProps} />;
}

/** Header and footer come from the start page of the site that owns the request host. */
export default async function SiteLayout({ children, params }: Props) {
  const site = resolveSiteByKey((await params).site);
  if (!site) notFound();

  return (
    <>
      <a href="#main-content" className="skipLink">
        Skip to main content
      </a>
      <Suspense fallback={null}>
        <ServerHeader origin={site.origin} />
      </Suspense>
      {children}
      <Suspense fallback={null}>
        <ServerFooter origin={site.origin} />
      </Suspense>
    </>
  );
}

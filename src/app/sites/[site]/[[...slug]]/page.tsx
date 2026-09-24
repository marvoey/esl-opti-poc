import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OptimizelyComponent } from "@optimizely/cms-sdk/react/server";
import { resolvePage } from "@/infrastructure/cms/resolvePage";
import { resolveSiteByKey } from "@/infrastructure/cms/siteRouting";
import "@/infrastructure/cms/optimizely-registry";

export const revalidate = 60;

// No pages at build time; each is rendered on first visit, then cached (ISR).
export function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ site: string; slug?: string[] }>;
};

async function loadPage(params: Props["params"]) {
  const { site: siteKey, slug = [] } = await params;
  const site = resolveSiteByKey(siteKey);
  if (!site) return null;
  return resolvePage(site.origin, `/${slug.join("/")}`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  // The home page uses the site title from the layout.
  if (slug.length === 0) return {};

  const title = (await loadPage(params))?._metadata?.displayName;
  return title ? { title } : {};
}

/** Every CMS page of every site: the page at this URL, whatever its content type. */
export default async function CmsPage({ params }: Props) {
  const content = await loadPage(params);
  if (!content) notFound();

  return (
    <main>
      <OptimizelyComponent content={content} />
    </main>
  );
}

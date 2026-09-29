import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OptimizelyComponent } from "@optimizely/cms-sdk/react/server";
import { resolvePage } from "@/infrastructure/cms/resolvePage";
import { resolveSiteByKey } from "@/infrastructure/cms/siteRouting";
import { resolveSiteTitle } from "@/infrastructure/cms/resolveSiteTitle";
import { resolvePageMetadata } from "@/infrastructure/cms/resolvePageMetadata";
import type { EslSeoProperties } from "@/components/cms/shared/EslSeoContract";
import "@/infrastructure/cms/optimizely-registry";

export const revalidate = 60;

// No pages at build time; each is rendered on first visit, then cached (ISR).
export function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ site: string; slug?: string[] }>;
};

async function loadPageContext(params: Props["params"]) {
  const { site: siteKey, slug = [] } = await params;
  const site = resolveSiteByKey(siteKey);
  if (!site) return null;

  const publicPath = `/${slug.join("/")}`;
  const content = await resolvePage(site.origin, publicPath);
  return {
    site,
    publicPath,
    content,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const context = await loadPageContext(params);
  if (!context) return {};

  const siteTitle = await resolveSiteTitle(context.site.origin);
  const { metadata } = await resolvePageMetadata(
    context.content as (Record<string, unknown> & EslSeoProperties) | null,
    context.site.origin,
    context.publicPath,
    siteTitle
  );

  return metadata;
}

/**
 * Escapes <, >, and & in a JSON string so it is safe to embed inside a <script> element.
 * JSON.stringify alone does not escape these; a value like "</script>" breaks out of
 * the script block and enables XSS. Unicode escapes are valid JSON and invisible to parsers.
 */
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

/** Every CMS page of every site: the page at this URL, whatever its content type. */
export default async function CmsPage({ params }: Props) {
  const context = await loadPageContext(params);
  if (!context?.content) notFound();

  const siteTitle = await resolveSiteTitle(context.site.origin);
  const { jsonLd } = await resolvePageMetadata(
    context.content as (Record<string, unknown> & EslSeoProperties) | null,
    context.site.origin,
    context.publicPath,
    siteTitle
  );

  return (
    <main id="main-content">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
      )}
      <OptimizelyComponent content={context.content} />
    </main>
  );
}

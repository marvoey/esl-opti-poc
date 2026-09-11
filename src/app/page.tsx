import React from "react";
import { notFound } from "next/navigation";
import { GraphClient } from "@optimizely/cms-sdk";
import { OptimizelyComponent } from "@optimizely/cms-sdk/react/server";
import { TabbedIconCards } from "@/components/organisms/tabbed-icon-cards";
import { SideBySide } from "@/components/organisms/side-by-side";
import { getHomePageQuery } from "@/application/queries/getHomePageQuery";
import "@/infrastructure/cms/optimizely-registry";

async function resolveHomeContent() {
  const host = process.env.OPTIMIZELY_APP_HOST || "http://localhost:5002";
  const apiKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const client = new GraphClient(apiKey, {
      graphUrl: process.env.OPTIMIZELY_GRAPH_GATEWAY,
    });

    let content = await client.getContentByPath("/", {
      host,
    });

    // If the root is a StartPage container or has no registered component, resolve the child ESL Home Page (/home or /new-page)
    if (!content || content.length === 0 || content[0]?._metadata?.types?.includes("StartPage")) {
      try {
        const homeContent = await client.getContentByPath("/home", { host });
        if (homeContent && homeContent.length > 0) {
          content = homeContent;
        } else {
          const childContent = await client.getContentByPath("/new-page", { host });
          if (childContent && childContent.length > 0) {
            content = childContent;
          }
        }
      } catch {
        // ignore and proceed
      }
    }

    return content && content.length > 0 ? content : null;
  } catch (error) {
    console.warn("CMS Graph delivery query returned no published home page yet:", error);
    return null;
  }
}

export default async function Home() {
  const [content, homeMockData] = await Promise.all([
    resolveHomeContent(),
    getHomePageQuery(),
  ]);

  if (content) {
    return (
      <main>
        <OptimizelyComponent content={content[0]} />
        <TabbedIconCards
          heading={homeMockData.tabbedSolutions.heading}
          tabs={homeMockData.tabbedSolutions.tabs}
        />
        <SideBySide {...homeMockData.sideBySidePromo} />
        {homeMockData.sideBySidePromoSecondary && (
          <SideBySide {...homeMockData.sideBySidePromoSecondary} />
        )}
      </main>
    );
  }

  return notFound();
}

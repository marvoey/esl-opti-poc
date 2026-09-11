import React from "react";
import { notFound } from "next/navigation";
import { GraphClient } from "@optimizely/cms-sdk";
import { OptimizelyComponent } from "@optimizely/cms-sdk/react/server";
import { TabbedIconCards } from "@/components/organisms/tabbed-icon-cards";
import {
  CircularImageMetricRow,
  DEFAULT_CIRCULAR_IMAGE_METRIC_ROW,
} from "@/components/organisms/circular-image-metric-row";
import {
  SplitContentImage,
  DEFAULT_SPLIT_CONTENT,
} from "@/components/organisms/split-content-image";
import { SideBySide } from "@/components/organisms/side-by-side";
import { getHomePageQuery } from "@/application/queries/getHomePageQuery";
import "@/infrastructure/cms/optimizely-registry";

const ESL_HOME_PAGE_QUERY = `
  query GetEslHomePage($host: String) {
    EslHomePage(
      where: {
        _metadata: {
          url: {
            base: { eq: $host }
          }
        }
      }
    ) {
      items {
        _id
        _metadata {
          key
          status
          displayName
          types
          lastModified
          container
          path
          url {
            default
            base
          }
        }
        heroSlider {
          slides {
            eyebrow
            heading
            body {
              html
              json
            }
            image {
              key
              url {
                default
                hierarchical
                base
                internal
              }
            }
            imageAlt
            primaryCta {
              text
              title
              target
              url {
                default
                hierarchical
                base
                internal
              }
            }
            secondaryCta {
              text
              title
              target
              url {
                default
                hierarchical
                base
                internal
              }
            }
            badgeStat
            badgeLabel
          }
        }
        snipeCta {
          title
          description
          link {
            text
            title
            target
            url {
              default
              hierarchical
              base
              internal
            }
          }
        }
        showExploreSolutions
      }
    }
  }
`;

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

    // 1. Direct query for published EslHomePage items (bypasses Graph SDK _Content.item metadata bug)
    try {
      const directResult = (await client.request(
        ESL_HOME_PAGE_QUERY,
        { host },
        undefined,
        false
      )) as { EslHomePage?: { items?: any[] } } | undefined;
      const directItems = directResult?.EslHomePage?.items;
      if (directItems && directItems.length > 0) {
        return directItems;
      }
    } catch {
      // ignore and try path-based resolution
    }

    // 2. Fallback to getContentByPath
    let content = await client.getContentByPath("/", {
      host,
    });

    // If the root is an EslStartPage container, resolve its child ESL Home Page
    if (
      !content ||
      content.length === 0 ||
      content[0]?._metadata?.types?.includes("EslStartPage")
    ) {
      const eslStartPageKey = content?.[0]?._metadata?.key;
      try {
        const homeContent = await client.getContentByPath("/home", { host });
        if (homeContent && homeContent.length > 0) {
          // Exclusively match Home pages belonging to the EslStartPage site
          const matched = eslStartPageKey
            ? homeContent.filter((item: any) => {
                const container = item._metadata?.container;
                const path = item._metadata?.path;
                return container === eslStartPageKey || (Array.isArray(path) && path.includes(eslStartPageKey));
              })
            : homeContent;

          content = matched.length > 0 ? matched : homeContent;
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

function selectActiveHomeContent(items?: any[] | null) {
  if (!items || items.length === 0) return null;
  if (items.length === 1) return items[0];

  // Pick the latest modified version
  return [...items].sort((a, b) => {
    const timeA = new Date(a._metadata?.lastModified || 0).getTime();
    const timeB = new Date(b._metadata?.lastModified || 0).getTime();
    return timeB - timeA;
  })[0];
}

export default async function Home() {
  const [content, homeMockData] = await Promise.all([
    resolveHomeContent(),
    getHomePageQuery(),
  ]);

  const activeContent = selectActiveHomeContent(content);

  if (activeContent) {
    return (
      <main>
        <OptimizelyComponent content={content[0]} />
        <TabbedIconCards
          heading={homeMockData.tabbedSolutions.heading}
          tabs={homeMockData.tabbedSolutions.tabs}
        />
        <CircularImageMetricRow {...DEFAULT_CIRCULAR_IMAGE_METRIC_ROW} />
        <SplitContentImage {...DEFAULT_SPLIT_CONTENT} />
        <SideBySide {...homeMockData.sideBySidePromo} />
        {homeMockData.sideBySidePromoSecondary && (
          <SideBySide {...homeMockData.sideBySidePromoSecondary} />
        )}
      </main>
    );
  }

  return notFound();
}

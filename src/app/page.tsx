import React from "react";
import { notFound } from "next/navigation";
import { getGraphClient } from "@/infrastructure/cms/graphClient";
import { OptimizelyComponent } from "@optimizely/cms-sdk/react/server";
import "@/infrastructure/cms/optimizely-registry";

const ESL_HOME_PAGE_EXPERIENCE_QUERY = `
  query GetEslHomePageExperience($host: String) {
    EslHomeExperience(
      where: {
        _metadata: {
          url: {
            base: { eq: $host }
          }
        }
      }
    ) {
      items {
        __typename
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
        composition {
          __typename
          nodes {
            __typename
            key
            nodeType
            type
            displayName
            displayTemplateKey
            layoutType
            ... on CompositionComponentNode {
              component {
                __typename
                ... on EslHeroSlider {
                  variant
                  slides {
                    eyebrow
                    heading
                    body {
                      json
                    }
                    image {
                      key
                      url {
                        default
                      }
                    }
                    imageAlt
                    primaryCta {
                      text
                      title
                      target
                      url {
                        default
                      }
                    }
                    secondaryCta {
                      text
                      title
                      target
                      url {
                        default
                      }
                    }
                    badgeStat
                    badgeLabel
                  }
                }
                ... on EslSnipeCta {
                  title
                  description
                  link {
                    text
                    title
                    target
                    url {
                      default
                    }
                  }
                }
                ... on EslTabbedSolutions {
                  showExploreSolutions
                  heading
                }
                ... on EslVerticalSelectorFeatureCard {
                  showVerticalSelector
                  heading
                }
                ... on EslSideBySide {
                  eyebrow
                  headline
                  body {
                    json
                  }
                  image {
                    key
                    url {
                      default
                    }
                  }
                  imageAlt
                  cta {
                    text
                    title
                    target
                    url {
                      default
                    }
                  }
                  imagePosition
                  colorVariant
                }
                ... on EslMetricCardRow {
                  eyebrow
                  title
                  description
                  cta {
                    text
                    title
                    target
                    url {
                      default
                    }
                  }
                  cards {
                    category
                    categoryIcon
                    rate
                    rateUnit
                    rateLabel
                    title
                    description
                    cta {
                      text
                      title
                      target
                      url {
                        default
                      }
                    }
                    variant
                  }
                }
                ... on EslSplitContentCards {
                  eyebrow
                  title
                  splitDescription: description {
                    json
                  }
                  cta {
                    text
                    title
                    target
                    url {
                      default
                    }
                  }
                  backgroundImage {
                    key
                    url {
                      default
                    }
                  }
                  heroMetricSubhead
                  heroMetricValue
                  heroMetricUnit
                  heroMetricDescription
                  statCards {
                    value
                    label
                  }
                }
                ... on EslMediaCardGrid {
                  eyebrow
                  title
                  cards {
                    image {
                      key
                      url {
                        default
                      }
                    }
                    imageAlt
                    badge
                    badgeVariant
                    title
                    mediaDescription: description {
                      json
                    }
                    cta {
                      text
                      title
                      target
                      url {
                        default
                      }
                    }
                  }
                }
                ... on EslVideoStoryCardRow {
                  eyebrow
                  title
                  videoStoryDescription: description {
                    json
                  }
                  cta {
                    text
                    title
                    target
                    url {
                      default
                    }
                  }
                  cards {
                    image {
                      key
                      url {
                        default
                      }
                    }
                    imageAlt
                    videoUrl
                    videoTitle
                    categoryIcon
                    title
                    quote {
                      json
                    }
                    authorName
                    authorRole
                    authorLocation
                  }
                }
                ... on EslCircularImageMetricRow {
                  eyebrow
                  title
                  circularDescription: description {
                    json
                  }
                  cta {
                    text
                    title
                    target
                    url {
                      default
                    }
                  }
                  metrics {
                    image {
                      key
                      url {
                        default
                      }
                    }
                    imageAlt
                    stat
                    label
                  }
                }
                ... on EslSplitContentImage {
                  title
                  splitImageDescription: description {
                    json
                  }
                  primaryCta {
                    text
                    title
                    target
                    url {
                      default
                    }
                  }
                  secondaryCta {
                    text
                    title
                    target
                    url {
                      default
                    }
                  }
                  eligibilityNote
                  image {
                    key
                    url {
                      default
                    }
                  }
                  imageAlt
                }
                ... on EslMediaCardGridCarousel {
                  eyebrow
                  title
                  cards {
                    image {
                      key
                      url {
                        default
                      }
                    }
                    imageAlt
                    badge
                    badgeVariant
                    title
                    mediaDescription: description {
                      json
                    }
                    cta {
                      text
                      title
                      target
                      url {
                        default
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export interface HomeContentMetadata {
  key?: string | null;
  status?: string | null;
  displayName?: string | null;
  types?: string[] | null;
  lastModified?: string | null;
  container?: string | null;
  path?: string[] | string | null;
  url?: {
    default?: string | null;
    base?: string | null;
    hierarchical?: string | null;
  } | null;
}

export type HomeContentItem = Parameters<typeof OptimizelyComponent>[0]["content"] & {
  __typename?: string;
  _id?: string | null;
  _metadata?: HomeContentMetadata | null;
  composition?: {
    __typename?: string;
    nodes?: unknown[];
  } | null;
  [key: string]: unknown;
};

interface ExperienceQueryResult {
  EslHomeExperience?: {
    items?: HomeContentItem[];
  };
}

async function resolveHomeContent(): Promise<HomeContentItem[] | null> {
  const host = process.env.OPTIMIZELY_APP_HOST || "http://localhost:5002";
  const client = getGraphClient();

  if (!client) {
    return null;
  }

  try {
    // 1. Direct query for Experience composition (Visual Builder)
    try {
      const expResult = (await client.request(
        ESL_HOME_PAGE_EXPERIENCE_QUERY,
        { host },
        undefined,
        true
      )) as ExperienceQueryResult | undefined;
      const expItems = expResult?.EslHomeExperience?.items;
      if (expItems && expItems.length > 0) {
        return expItems;
      }
    } catch (err) {
      console.warn("CMS Graph experience query error:", err);
      // ignore and try path-based resolution
    }

    // 2. Fallback to getContentByPath
    let content = (await client.getContentByPath("/", {
      host,
    })) as HomeContentItem[] | null;

    // If the root is an EslStartPage container, resolve its child ESL Home Page
    if (
      !content ||
      content.length === 0 ||
      content[0]?._metadata?.types?.includes("EslStartPage")
    ) {
      const eslStartPageKey = content?.[0]?._metadata?.key;
      try {
        const homeContent = (await client.getContentByPath("/home", { host })) as HomeContentItem[] | null;
        if (homeContent && homeContent.length > 0) {
          // Exclusively match Home pages belonging to the EslStartPage site
          const matched = eslStartPageKey
            ? homeContent.filter((item: HomeContentItem) => {
              const container = item._metadata?.container;
              const path = item._metadata?.path;
              return (
                container === eslStartPageKey ||
                (Array.isArray(path) && path.includes(eslStartPageKey))
              );
            })
            : homeContent;

          content = matched.length > 0 ? matched : homeContent;
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

export const revalidate = 60;

function selectActiveHomeContent(
  items?: HomeContentItem[] | null
): HomeContentItem | null {
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
  const content = await resolveHomeContent();
  const activeContent = selectActiveHomeContent(content);

  if (activeContent) {
    return (
      <main>
        <OptimizelyComponent content={activeContent} />
      </main>
    );
  }

  return notFound();
}

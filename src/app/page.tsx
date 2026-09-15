import React from "react";
import { notFound } from "next/navigation";
import { GraphClient } from "@optimizely/cms-sdk";
import { OptimizelyComponent } from "@optimizely/cms-sdk/react/server";
import {
  CircularImageMetricRow,
  DEFAULT_CIRCULAR_IMAGE_METRIC_ROW,
} from "@/components/organisms/circular-image-metric-row";
import {
  VideoStoryCardRow,
  DEFAULT_VIDEO_STORY_CARD_ROW,
} from "@/components/organisms/video-story-card-row";
import {
  MediaCardGrid,
  DEFAULT_MEDIA_CARD_GRID,
  DEFAULT_MEDIA_CARD_GRID_2_CARDS,
} from "@/components/organisms/media-card-grid";
import { OfferCardRow } from "@/components/organisms/offer-card-row";
import {
  SplitContentImage,
  DEFAULT_SPLIT_CONTENT,
} from "@/components/organisms/split-content-image";
import { VerticalSelectorFeatureCard } from "@/components/organisms/vertical-selector-feature-card";
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
                ... on EslSnipeCta {
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
                ... on EslTabbedSolutions {
                  showExploreSolutions
                  heading
                }
                ... on EslSideBySide {
                  eyebrow
                  headline
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
                  cta {
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
                      hierarchical
                      base
                      internal
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
                        hierarchical
                        base
                        internal
                      }
                    }
                    variant
                  }
                }
                ... on EslSplitContentCards {
                  eyebrow
                  title
                  description {
                    html
                    json
                  }
                  cta {
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
                  backgroundImage {
                    key
                    url {
                      default
                      hierarchical
                      base
                      internal
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
              }
            }
          }
        }
      }
    }
  }
`;

const ESL_HOME_PAGE_LEGACY_QUERY = `
  query GetEslHomePageLegacy($host: String) {
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

interface LegacyQueryResult {
  EslHomePage?: {
    items?: HomeContentItem[];
  };
}

async function resolveHomeContent(): Promise<HomeContentItem[] | null> {
  const host = process.env.OPTIMIZELY_APP_HOST || "http://localhost:5002";
  const apiKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const client = new GraphClient(apiKey, {
      graphUrl: process.env.OPTIMIZELY_GRAPH_GATEWAY,
    });

    // 1. Direct query for Experience composition (Visual Builder)
    try {
      const expResult = (await client.request(
        ESL_HOME_PAGE_EXPERIENCE_QUERY,
        { host },
        undefined,
        false
      )) as ExperienceQueryResult | undefined;
      const expItems = expResult?.EslHomeExperience?.items;
      if (expItems && expItems.length > 0) {
        return expItems;
      }
    } catch {
      // ignore and try legacy query
    }

    // 2. Direct query for legacy EslHomePage items
    try {
      const legacyResult = (await client.request(
        ESL_HOME_PAGE_LEGACY_QUERY,
        { host },
        undefined,
        false
      )) as LegacyQueryResult | undefined;
      const legacyItems = legacyResult?.EslHomePage?.items;
      if (legacyItems && legacyItems.length > 0) {
        return legacyItems;
      }
    } catch {
      // ignore and try path-based resolution
    }

    // 3. Fallback to getContentByPath
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
        } else {
          const childContent = (await client.getContentByPath("/new-page", { host })) as HomeContentItem[] | null;
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
        <VerticalSelectorFeatureCard id="solutions-selector" />
        <CircularImageMetricRow {...DEFAULT_CIRCULAR_IMAGE_METRIC_ROW} />
        <VideoStoryCardRow {...DEFAULT_VIDEO_STORY_CARD_ROW} />
        <MediaCardGrid {...DEFAULT_MEDIA_CARD_GRID} />
        <MediaCardGrid {...DEFAULT_MEDIA_CARD_GRID_2_CARDS} id="media-card-grid-2" />
        <OfferCardRow id="offer-card-row" />
        <SplitContentImage {...DEFAULT_SPLIT_CONTENT} />
      </main>
    );
  }

  return notFound();
}

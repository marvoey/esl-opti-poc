import type { Metadata } from "next";
import React from "react";
import { getGraphClient } from "@/infrastructure/cms/graphClient";
import { OptimizelyComponent } from "@optimizely/cms-sdk/react/server";
import { ProductDetailStaticSections } from "@/components/cms/pages/EslProductDetailPageRenderer";
import "@/infrastructure/cms/optimizely-registry";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Premier Checking",
  description:
    "Checking that gives a little back. Everything you use day to day, plus a balance that earns dividends and our member-only Owners’ Dividend.",
};

const ESL_PRODUCT_DETAIL_PAGE_EXPERIENCE_QUERY = `
  query GetEslProductDetailPageExperience($host: String) {
    EslProductDetailExperience(
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
                ... on EslKeyFactsRow {
                  title
                  subtitle
                  facts {
                    value
                    callout
                    description {
                      json
                      html
                    }
                  }
                }
                ... on EslDisclosure {
                  heading
                  items {
                    boldText
                    regularText {
                      json
                    }
                  }
                }
                ... on EslFaqStates {
                  showFaqStates
                  heading
                }
                ... on EslAccordionCardGrid {
                  eyebrow
                  title
                  accordionDescription: description {
                    json
                    html
                  }
                  items {
                    term
                    definition {
                      json
                      html
                    }
                  }
                }
                ... on EslSplitContentCta {
                  showSplitContentCta
                  heading
                }
                ... on EslFeatureCardRow {
                  showFeatureCardRow
                  heading
                }
                ... on EslSwitchSupport {
                  eyebrow
                  title
                  switchDescription: description {
                    json
                  }
                  steps {
                    step
                    title
                    description {
                      json
                    }
                  }
                  cta {
                    text
                    title
                    target
                    url {
                      default
                    }
                  }
                  link {
                    text
                    title
                    target
                    url {
                      default
                    }
                  }
                }
                ... on EslProductCardsRow {
                  eyebrow
                  title
                  rowDescription: description {
                    json
                    html
                  }
                  items {
                    title
                    description {
                      json
                      html
                    }
                  }
                }
                ... on EslProductCardsRowVariant2 {
                  eyebrow
                  title
                  rowDescription: description {
                    json
                    html
                  }
                  items {
                    icon
                    title
                    description {
                      json
                      html
                    }
                    link {
                      text
                      title
                      target
                      url {
                        default
                      }
                    }
                  }
                }
                ... on EslIconCardSingleColumnGrid {
                  title
                  items {
                    icon
                    title
                    link {
                      text
                      title
                      target
                      url {
                        default
                      }
                    }
                    description {
                      json
                      html
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

const ESL_PRODUCT_DETAIL_PAGE_BASE_EXPERIENCE_QUERY = `
  query GetEslProductDetailPageBaseExperience($host: String) {
    EslProductDetailExperience(
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
                ... on EslKeyFactsRow {
                  title
                  subtitle
                  facts {
                    value
                    callout
                    description {
                      json
                      html
                    }
                  }
                }
                ... on EslDisclosure {
                  heading
                  items {
                    boldText
                    regularText {
                      json
                    }
                  }
                }
                ... on EslFaqStates {
                  showFaqStates
                  heading
                }
                ... on EslSwitchSupport {
                  eyebrow
                  title
                  switchDescription: description {
                    json
                  }
                  steps {
                    step
                    title
                    description {
                      json
                    }
                  }
                  cta {
                    text
                    title
                    target
                    url {
                      default
                    }
                  }
                  link {
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
`;

export interface ProductDetailMetadata {
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
  } | null;
}

export type ProductDetailContentItem = Parameters<typeof OptimizelyComponent>[0]["content"] & {
  __typename?: string;
  _id?: string | null;
  _metadata?: ProductDetailMetadata | null;
  composition?: {
    __typename?: string;
    nodes?: unknown[];
  } | null;
  [key: string]: unknown;
};

interface ExperienceQueryResult {
  EslProductDetailExperience?: {
    items?: ProductDetailContentItem[];
  };
}

async function resolveProductDetailContent(): Promise<ProductDetailContentItem[] | null> {
  const host = process.env.OPTIMIZELY_APP_HOST || "http://localhost:5002";
  const client = getGraphClient();

  if (!client) {
    return null;
  }

  try {
    // 1. Direct query for Experience composition (Visual Builder)
    try {
      const expResult = (await client.request(
        ESL_PRODUCT_DETAIL_PAGE_EXPERIENCE_QUERY,
        { host },
        undefined,
        true
      )) as ExperienceQueryResult | undefined;
      const expItems = expResult?.EslProductDetailExperience?.items;
      if (expItems && expItems.length > 0) {
        return expItems;
      }
    } catch (err) {
      console.warn("CMS Graph experience query error for product-detail, trying base query:", err);
      try {
        const baseResult = (await client.request(
          ESL_PRODUCT_DETAIL_PAGE_BASE_EXPERIENCE_QUERY,
          { host },
          undefined,
          true
        )) as ExperienceQueryResult | undefined;
        const baseItems = baseResult?.EslProductDetailExperience?.items;
        if (baseItems && baseItems.length > 0) {
          return baseItems;
        }
      } catch (baseErr) {
        console.warn("CMS Graph base experience query error for product-detail:", baseErr);
      }
    }

    // 2. Fallback to getContentByPath
    let content = (await client.getContentByPath("/product-detail", {
      host,
    })) as ProductDetailContentItem[] | null;

    if (!content || content.length === 0) {
      content = (await client.getContentByPath("/product-detail/", {
        host,
      })) as ProductDetailContentItem[] | null;
    }

    return content && content.length > 0 ? content : null;
  } catch (error) {
    console.warn("CMS Graph delivery query returned no product-detail page yet:", error);
    return null;
  }
}

function selectActiveContent(
  items?: ProductDetailContentItem[] | null
): ProductDetailContentItem | null {
  if (!items || items.length === 0) return null;
  if (items.length === 1) return items[0];

  return [...items].sort((a, b) => {
    const timeA = new Date(a._metadata?.lastModified || 0).getTime();
    const timeB = new Date(b._metadata?.lastModified || 0).getTime();
    return timeB - timeA;
  })[0];
}

export default async function ProductDetailPage() {
  const content = await resolveProductDetailContent();
  const activeContent = selectActiveContent(content);

  if (activeContent) {
    return (
      <main>
        <OptimizelyComponent content={activeContent} />
      </main>
    );
  }

  return (
    <main>
      <ProductDetailStaticSections />
    </main>
  );
}

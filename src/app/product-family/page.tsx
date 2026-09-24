import type { Metadata } from "next";
import React from "react";
import { notFound } from "next/navigation";
import { getGraphClient } from "@/infrastructure/cms/graphClient";
import { OptimizelyComponent } from "@optimizely/cms-sdk/react/server";
import "@/infrastructure/cms/optimizely-registry";


export const revalidate = 60;

export const metadata: Metadata = {
  title: "Product Family",
  description:
    "Explore our family of financial products and services designed for every stage of your life.",
};

const ESL_PRODUCT_FAMILY_PAGE_EXPERIENCE_QUERY = `
  query GetEslProductFamilyPageExperience($host: String) {
    EslProductFamilyExperience(
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
                ... on EslComparisonCardPair {
                  eyebrow
                  title
                  comparisonDescription: description {
                    json
                    html
                  }
                  cards {
                    title
                    badgeText
                    cardDescription: description {
                      json
                      html
                    }
                    features {
                      text
                      iconType
                    }
                    cta {
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
                  }
                }
                ... on EslCompareTable {
                  showCompareTable
                  heading
                }
                ... on EslFinalCta {
                  showFinalCta
                  heading
                }
                ... on EslLearningHub {
                  showLearningHub
                  heading
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

const ESL_PRODUCT_FAMILY_PAGE_BASE_EXPERIENCE_QUERY = `
  query GetEslProductFamilyPageBaseExperience($host: String) {
    EslProductFamilyExperience(
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
                ... on EslComparisonCardPair {
                  eyebrow
                  title
                  comparisonDescription: description {
                    json
                    html
                  }
                  cards {
                    title
                    badgeText
                    cardDescription: description {
                      json
                      html
                    }
                    features {
                      text
                      iconType
                    }
                    cta {
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

export interface ProductFamilyMetadata {
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

export type ProductFamilyContentItem = Parameters<typeof OptimizelyComponent>[0]["content"] & {
  __typename?: string;
  _id?: string | null;
  _metadata?: ProductFamilyMetadata | null;
  composition?: {
    __typename?: string;
    nodes?: unknown[];
  } | null;
  [key: string]: unknown;
};

interface ExperienceQueryResult {
  EslProductFamilyExperience?: {
    items?: ProductFamilyContentItem[];
  };
}

async function resolveProductFamilyContent(): Promise<ProductFamilyContentItem[] | null> {
  const host = process.env.OPTIMIZELY_APP_HOST || "http://localhost:5002";
  const client = getGraphClient();

  if (!client) {
    return null;
  }

  try {
    // 1. Direct query for Experience composition with all types
    try {
      const expResult = (await client.request(
        ESL_PRODUCT_FAMILY_PAGE_EXPERIENCE_QUERY,
        { host },
        undefined,
        true
      )) as ExperienceQueryResult | undefined;
      const expItems = expResult?.EslProductFamilyExperience?.items;
      if (expItems && expItems.length > 0) {
        return expItems;
      }
    } catch (err) {
      console.warn("CMS Graph experience query error for product-family, trying base query:", err);
      // Fallback: If newly added types are not yet registered in CMS schema, run base experience query
      try {
        const baseResult = (await client.request(
          ESL_PRODUCT_FAMILY_PAGE_BASE_EXPERIENCE_QUERY,
          { host },
          undefined,
          true
        )) as ExperienceQueryResult | undefined;
        const baseItems = baseResult?.EslProductFamilyExperience?.items;
        if (baseItems && baseItems.length > 0) {
          return baseItems;
        }
      } catch (baseErr) {
        console.warn("CMS Graph base experience query error:", baseErr);
      }
    }

    // 2. Fallback to getContentByPath
    let content = (await client.getContentByPath("/product-family", {
      host,
    })) as ProductFamilyContentItem[] | null;

    if (!content || content.length === 0) {
      content = (await client.getContentByPath("/product-family/", {
        host,
      })) as ProductFamilyContentItem[] | null;
    }

    return content && content.length > 0 ? content : null;
  } catch (error) {
    console.warn("CMS Graph delivery query returned no product-family page yet:", error);
    return null;
  }
}

function selectActiveContent(
  items?: ProductFamilyContentItem[] | null
): ProductFamilyContentItem | null {
  if (!items || items.length === 0) return null;
  if (items.length === 1) return items[0];

  return [...items].sort((a, b) => {
    const timeA = new Date(a._metadata?.lastModified || 0).getTime();
    const timeB = new Date(b._metadata?.lastModified || 0).getTime();
    return timeB - timeA;
  })[0];
}

export default async function ProductFamilyPage() {
  const content = await resolveProductFamilyContent();
  const activeContent = selectActiveContent(content);

  if (activeContent) {
    return (
      <main>
        <OptimizelyComponent content={activeContent} />
      </main>
    );
  }

  return notFound();
}


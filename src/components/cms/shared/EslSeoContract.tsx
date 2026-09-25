import { contract } from '@optimizely/cms-sdk';

/**
 * Reusable SEO, Metadata, and GEO (Generative Engine Optimization) contract.
 *
 * Defines the 11 fields available across all pages, experiences, and the site start page,
 * grouped under the 'seo' property group.
 */
export const EslSeoContract = contract({
  key: 'EslSeoSettings',
  displayName: 'SEO Settings',
  properties: {
    metaTitle: {
      type: 'string',
      displayName: 'Meta Title',
      description: 'Custom browser tab and search engine title.',
      group: 'seo',
      sortOrder: 10,
    },
    metaDescription: {
      type: 'string',
      displayName: 'Meta Description',
      description: 'Summary of page content for search engine snippets.',
      group: 'seo',
      sortOrder: 20,
    },
    canonicalUrl: {
      type: 'string',
      displayName: 'Canonical URL',
      description: 'Preferred URL for this page to prevent duplicate content.',
      group: 'seo',
      sortOrder: 30,
    },
    noIndex: {
      type: 'boolean',
      displayName: 'No Index (Hide from search)',
      description: 'Instruct search engines not to index this page in search results.',
      group: 'seo',
      sortOrder: 40,
    },
    noFollow: {
      type: 'boolean',
      displayName: 'No Follow (Do not follow links)',
      description: 'Instruct search engines not to follow links on this page.',
      group: 'seo',
      sortOrder: 50,
    },
    ogTitle: {
      type: 'string',
      displayName: 'OG Title',
      description: 'Title used when sharing this page on social platforms.',
      group: 'seo',
      sortOrder: 60,
    },
    ogDescription: {
      type: 'string',
      displayName: 'OG Description',
      description: 'Description displayed in social media share cards.',
      group: 'seo',
      sortOrder: 70,
    },
    ogImage: {
      type: 'contentReference',
      displayName: 'OG Image',
      description: 'Preview image for social media and messaging app cards.',
      allowedTypes: ['_image'],
      group: 'seo',
      sortOrder: 80,
    },
    aeoQuickAnswer: {
      type: 'string',
      displayName: 'AEO Quick Answer / TL;DR',
      description: 'Concise summary for Answer Engine Optimization (AI search & generative answers).',
      group: 'seo',
      sortOrder: 90,
    },
    geoSchemaType: {
      type: 'string',
      format: 'selectOne',
      displayName: 'GEO Schema Type',
      description: 'Schema.org entity type for Generative Engine Optimization (GEO).',
      enum: [
        { value: 'WebPage', displayName: 'WebPage (Default)' },
        { value: 'FinancialService', displayName: 'FinancialService' },
        { value: 'FinancialProduct', displayName: 'FinancialProduct' },
        { value: 'Article', displayName: 'Article' },
        { value: 'FAQPage', displayName: 'FAQPage' },
        { value: 'AboutPage', displayName: 'AboutPage' },
        { value: 'ContactPage', displayName: 'ContactPage' },
      ],
      group: 'seo',
      sortOrder: 100,
    },
    jsonLdOverride: {
      type: 'string',
      displayName: 'Structured Data JSON-LD Override',
      description: 'Custom Schema.org JSON-LD to augment or override page structured data.',
      group: 'seo',
      sortOrder: 110,
    },
  },
});

export interface EslSeoProperties {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean | null;
  noFollow?: boolean | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?:
    | {
        key?: string | null;
        item?: {
          Url?: string | null;
          [key: string]: unknown;
        } | null;
        url?: {
          default?: string | null;
          hierarchical?: string | null;
          graph?: string | null;
          base?: string | null;
          internal?: string | null;
          [key: string]: unknown;
        } | null;
        _metadata?: { url?: { default?: string | null } | null } | null;
      }
    | string
    | null;
  aeoQuickAnswer?: string | null;
  geoSchemaType?: string | null;
  jsonLdOverride?: string | null;
}

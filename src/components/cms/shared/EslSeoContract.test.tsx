import { describe, it, expect } from 'vitest';
import { EslSeoContract } from './EslSeoContract';

describe('EslSeoContract', () => {
  it('defines EslSeoSettings contract with 11 properties all belonging to group seo', () => {
    expect(EslSeoContract.key).toBe('EslSeoSettings');
    expect(EslSeoContract.displayName).toBe('SEO Settings');
    expect(EslSeoContract.properties).toBeDefined();

    const props = EslSeoContract.properties as Record<
      string,
      {
        group?: string;
        sortOrder?: number;
        type?: string;
        format?: string;
        enum?: Array<{ value: string }>;
        allowedTypes?: string[];
      }
    >;
    const propKeys = Object.keys(props);
    expect(propKeys).toHaveLength(11);

    const expectedKeys = [
      'metaTitle',
      'metaDescription',
      'canonicalUrl',
      'noIndex',
      'noFollow',
      'ogTitle',
      'ogDescription',
      'ogImage',
      'aeoQuickAnswer',
      'geoSchemaType',
      'jsonLdOverride',
    ];

    expect(propKeys).toEqual(expectedKeys);

    // Verify all properties belong to the 'seo' group
    for (const key of expectedKeys) {
      expect(props[key].group).toBe('seo');
    }

    // Verify sort orders are strictly increasing
    const sortOrders = expectedKeys.map((k) => props[k].sortOrder as number);
    for (let i = 0; i < sortOrders.length - 1; i++) {
      expect(sortOrders[i]).toBeLessThan(sortOrders[i + 1]);
    }

    // Verify specific property configurations
    expect(props.metaTitle.type).toBe('string');
    expect(props.metaDescription.type).toBe('string');
    expect(props.canonicalUrl.type).toBe('string');
    expect(props.noIndex.type).toBe('boolean');
    expect(props.noFollow.type).toBe('boolean');
    expect(props.ogTitle.type).toBe('string');
    expect(props.ogDescription.type).toBe('string');
    expect(props.ogImage.type).toBe('contentReference');
    expect(props.ogImage.allowedTypes).toEqual(['_image']);
    expect(props.aeoQuickAnswer.type).toBe('string');
    expect(props.geoSchemaType.type).toBe('string');
    expect(props.geoSchemaType.format).toBe('selectOne');
    expect(props.geoSchemaType.enum).toBeDefined();
    expect(props.geoSchemaType.enum?.map((e) => e.value)).toContain('WebPage');
    expect(props.jsonLdOverride.type).toBe('string');
  });
});

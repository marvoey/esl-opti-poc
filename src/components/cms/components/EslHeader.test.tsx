import { describe, it, expect } from 'vitest';
import { EslHeaderContentType } from './EslHeader';

describe('EslHeader CMS Content Type', () => {
  it('exposes correct Optimizely Content Type definition', () => {
    expect(EslHeaderContentType.key).toBe('ESLHeader');
    expect(EslHeaderContentType.displayName).toBe('ESL Header');
    expect(EslHeaderContentType.baseType).toBe('_component');

    const properties = EslHeaderContentType.properties;
    expect(properties).toBeDefined();
    expect(properties).toHaveProperty('brandLogo');
    expect(properties).toHaveProperty('brandLogoAlt');
    expect(properties).toHaveProperty('brandHref');
    expect(properties).toHaveProperty('navLinks');
    expect(properties).not.toHaveProperty('megaMenu');
    expect(properties).toHaveProperty('megaMenus');
    expect(properties).toHaveProperty('ctaVariant');
    expect(properties).toHaveProperty('ctaIcon');
    expect(properties).toHaveProperty('cta');
    expect(properties).toHaveProperty('secondaryCtaVariant');
    expect(properties).toHaveProperty('secondaryCtaIcon');
    expect(properties).toHaveProperty('secondaryCta');

    expect(properties.brandLogo.type).toBe('contentReference');
    expect(properties.brandLogo.allowedTypes).toContain('_image');
    expect(properties.navLinks.type).toBe('array');
    expect(properties.megaMenus.type).toBe('array');
    expect(properties.cta.type).toBe('link');
    expect(properties.ctaVariant.type).toBe('string');
    expect(properties.ctaVariant.format).toBe('selectOne');
    expect(properties.secondaryCtaVariant.type).toBe('string');
    expect(properties.secondaryCtaVariant.format).toBe('selectOne');
  });
});

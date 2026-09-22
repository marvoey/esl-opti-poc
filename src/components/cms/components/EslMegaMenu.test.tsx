import { describe, it, expect } from 'vitest';
import { EslMegaMenuContentType } from './EslMegaMenu';
import { EslMegaMenuColumnContentType } from './EslMegaMenuColumn';
import { EslMegaMenuColumnItemContentType } from './EslMegaMenuColumnItem';
import { EslMegaMenuPromoContentType } from './EslMegaMenuPromo';

describe('EslMegaMenu Content Types', () => {
  it('EslMegaMenuColumnItem has expected schema key, baseType, and properties', () => {
    expect(EslMegaMenuColumnItemContentType.key).toBe('EslMegaMenuColumnItem');
    expect(EslMegaMenuColumnItemContentType.baseType).toBe('_component');
    const props = EslMegaMenuColumnItemContentType.properties;
    expect(props).toBeDefined();
    expect(props.icon.type).toBe('string');
    expect((props as Record<string, unknown>).label).toBeUndefined();
    expect(props.link.type).toBe('link');
  });

  it('EslMegaMenuColumn has expected schema key, baseType, and properties', () => {
    expect(EslMegaMenuColumnContentType.key).toBe('EslMegaMenuColumn');
    expect(EslMegaMenuColumnContentType.baseType).toBe('_component');
    const props = EslMegaMenuColumnContentType.properties;
    expect(props).toBeDefined();
    expect(props.heading.type).toBe('string');
    expect(props.items.type).toBe('array');
    expect(props.items.items.type).toBe('component');
  });

  it('EslMegaMenuPromo has expected schema key, baseType, and richText description', () => {
    expect(EslMegaMenuPromoContentType.key).toBe('EslMegaMenuPromo');
    expect(EslMegaMenuPromoContentType.baseType).toBe('_component');
    const props = EslMegaMenuPromoContentType.properties;
    expect(props).toBeDefined();
    expect(props.eyebrow.type).toBe('string');
    expect(props.heading.type).toBe('string');
    expect(props.description.type).toBe('richText');
    expect(props.cta.type).toBe('link');
  });

  it('EslMegaMenu has expected schema key, baseType, and composition properties', () => {
    expect(EslMegaMenuContentType.key).toBe('EslMegaMenu');
    expect(EslMegaMenuContentType.baseType).toBe('_component');
    const props = EslMegaMenuContentType.properties;
    expect(props).toBeDefined();
    expect(props.navLabel.type).toBe('string');
    expect(props.cta.type).toBe('link');
    expect((props as Record<string, unknown>).viewAllLabel).toBeUndefined();
    expect((props as Record<string, unknown>).viewAllLink).toBeUndefined();
    expect(props.columns.type).toBe('array');
    expect(props.columns.items.type).toBe('component');
    expect(props.promo.type).toBe('component');
  });
});

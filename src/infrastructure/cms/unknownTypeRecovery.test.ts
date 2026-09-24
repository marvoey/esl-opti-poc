import { describe, it, expect, vi } from 'vitest';
import type { GraphClient } from '@optimizely/cms-sdk';
import {
  removeTypePrefix,
  retryWithoutUnknownTypes,
  sanitizeFields,
  sanitizeQuery,
  unknownFieldsFromError,
  unknownTypesFromError,
} from './unknownTypeRecovery';

// Shape of the SDK's generated experience query: named fragments per component,
// spread into the composition and into the _IComponent interface fragment.
const QUERY = `query Q($where: _ContentWhereInput) {
  _Content(where: $where) { items { ...EslProductFamilyExperience } }
}
fragment EslProductFamilyExperience on EslProductFamilyExperience { composition { nodes { ... on CompositionComponentNode { component { ..._IComponent } } } } }
fragment _IComponent on _IComponent { __typename ...EslHeroSlider ...EslNewThing }
fragment EslHeroSlider on EslHeroSlider { variant slides { heading } }
fragment EslNewThing on EslNewThing { title items { ...EslNewThingItem } }
fragment EslNewThingItem on EslNewThingItem { label }`;

const unknownTypeError = (types: string[], query = QUERY) => ({
  errors: types.map((t) => ({ message: `Unknown type "${t}".` })),
  request: { query, variables: { where: { x: 1 } } },
});

describe('unknownTypeRecovery', () => {
  it('reads the unknown type names from a Graph error', () => {
    expect(unknownTypesFromError(unknownTypeError(['EslNewThing', 'EslNewThingItem']))).toEqual([
      'EslNewThing',
      'EslNewThingItem',
    ]);
    expect(unknownTypesFromError({ errors: [{ message: 'Syntax Error' }] })).toEqual([]);
    expect(unknownTypesFromError(new Error('network'))).toEqual([]);
  });

  it('removes the fragments and spreads of unknown types, keeping the rest', () => {
    const sanitized = sanitizeQuery(QUERY, ['EslNewThing', 'EslNewThingItem']);
    expect(sanitized).not.toContain('EslNewThing');
    expect(sanitized).toContain('...EslHeroSlider');
    expect(sanitized).toContain('fragment EslHeroSlider on EslHeroSlider { variant slides { heading } }');
  });

  it('removes inline fragments of unknown types', () => {
    expect(sanitizeQuery('{ a { ... on EslNewThing { title } b } }', ['EslNewThing'])).toBe('{ a {  b } }');
  });

  it('retries without the unknown types, with the original variables', async () => {
    const request = vi.fn().mockResolvedValue({ _Content: { items: [] } });
    const client = { request } as unknown as GraphClient;

    await expect(
      retryWithoutUnknownTypes(client, unknownTypeError(['EslNewThing', 'EslNewThingItem']), 'token')
    ).resolves.toEqual({ _Content: { items: [] } });

    const [query, variables, previewToken] = request.mock.calls[0];
    expect(query).not.toContain('EslNewThing');
    expect(variables).toEqual({ where: { x: 1 } });
    expect(previewToken).toBe('token');
  });

  it('keeps retrying while Graph reports more unknown types', async () => {
    const request = vi
      .fn()
      .mockRejectedValueOnce(unknownTypeError(['EslNewThingItem'], 'sanitized once'))
      .mockResolvedValueOnce({ ok: true });
    const client = { request } as unknown as GraphClient;

    await expect(retryWithoutUnknownTypes(client, unknownTypeError(['EslNewThing']))).resolves.toEqual({ ok: true });
    // The second attempt starts from the original query without both types.
    expect(request.mock.calls[1][0]).not.toContain('EslNewThing');
  });

  it('returns null for errors it cannot recover from', async () => {
    const request = vi.fn();
    const client = { request } as unknown as GraphClient;

    await expect(retryWithoutUnknownTypes(client, new Error('network'))).resolves.toBeNull();
    await expect(
      retryWithoutUnknownTypes(client, { errors: [{ message: 'Syntax Error' }], request: { query: QUERY, variables: {} } })
    ).resolves.toBeNull();
    expect(request).not.toHaveBeenCalled();
  });

  it('gives up after a few attempts', async () => {
    const request = vi.fn().mockRejectedValue(unknownTypeError(['EslOther']));
    const client = { request } as unknown as GraphClient;

    await expect(retryWithoutUnknownTypes(client, unknownTypeError(['EslNewThing']))).resolves.toBeNull();
    expect(request).toHaveBeenCalledTimes(3);
  });

  it('strips SDK type prefixes from field names', () => {
    expect(
      removeTypePrefix({
        __typename: 'EslHeroSlider',
        EslHeroSlider__variant: 'dark',
        slides: [{ __typename: 'EslSlide', EslSlide__heading: 'Hi' }],
      })
    ).toEqual({ __typename: 'EslHeroSlider', variant: 'dark', slides: [{ __typename: 'EslSlide', heading: 'Hi' }] });
  });

  it('reads unknown field names from Graph "Cannot query field" errors', () => {
    const error = {
      errors: [
        { message: 'Cannot query field "primaryCtaIcon" on type "EslHeroSlideProperty". Did you mean "primaryCta"?' },
        { message: 'Cannot query field "secondaryCtaIcon" on type "EslHeroSlideProperty". Did you mean "secondaryCta"?' },
      ],
    };
    expect(unknownFieldsFromError(error)).toEqual([
      { field: 'primaryCtaIcon', type: 'EslHeroSlideProperty' },
      { field: 'secondaryCtaIcon', type: 'EslHeroSlideProperty' },
    ]);
  });

  it('sanitizes unknown fields and their aliases from queries', () => {
    const query = 'fragment F on EslHeroSlideProperty { EslHeroSlideProperty__primaryCtaIcon:primaryCtaIcon EslHeroSlideProperty__primaryCta:primaryCta { text } }';
    const sanitized = sanitizeFields(query, [{ field: 'primaryCtaIcon' }]);
    expect(sanitized).not.toContain('primaryCtaIcon');
    expect(sanitized).toContain('EslHeroSlideProperty__primaryCta:primaryCta { text }');
  });

  it('sanitizes unknown fields with sub-selections', () => {
    const query = '{ title unknownSubObject { id name items { x } } description }';
    const sanitized = sanitizeFields(query, [{ field: 'unknownSubObject' }]);
    expect(sanitized).not.toContain('unknownSubObject');
    expect(sanitized).toContain('{ title  description }');
  });

  it('retries and succeeds when Graph reports Cannot query field errors', async () => {
    const request = vi.fn().mockResolvedValue({ _Content: { item: { heading: 'Hello' } } });
    const client = { request } as unknown as GraphClient;

    const error = {
      errors: [
        { message: 'Cannot query field "primaryCtaIcon" on type "EslHeroSlideProperty".' },
      ],
      request: {
        query: 'fragment F on EslHeroSlideProperty { EslHeroSlideProperty__primaryCtaIcon:primaryCtaIcon heading }',
        variables: {},
      },
    };

    const res = await retryWithoutUnknownTypes(client, error, 'token-123');
    expect(res).toEqual({ _Content: { item: { heading: 'Hello' } } });
    expect(request).toHaveBeenCalledTimes(1);
    expect(request.mock.calls[0][0]).not.toContain('primaryCtaIcon');
    expect(request.mock.calls[0][0]).toContain('heading');
  });
});

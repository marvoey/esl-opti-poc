import type { GraphClient } from '@optimizely/cms-sdk';

/**
 * Recovery from Graph "Unknown type" errors.
 *
 * The SDK builds each experience query with a fragment for every component in
 * the registry. When code registers a component the CMS schema doesn't have
 * yet (code deployed before `cms:push`), Graph rejects the whole query and
 * every page fails. These helpers drop the unknown fragments and retry, so the
 * page renders without that component instead.
 */

type FailedGraphRequest = {
  errors?: Array<{ message?: string }>;
  request?: { query: string; variables: Record<string, unknown> };
};

const MAX_RETRIES = 3;

/** Type names Graph reported as unknown, e.g. `EslNewComponent`. */
export function unknownTypesFromError(error: unknown): string[] {
  const errors = (error as FailedGraphRequest | null)?.errors ?? [];
  const types: string[] = [];
  for (const e of errors) {
    const match = typeof e?.message === 'string' && e.message.match(/Unknown type "([^"]+)"/);
    if (match && match[1]) types.push(match[1]);
  }
  return types;
}

export type UnknownField = {
  field: string;
  type?: string;
};

/** Field names Graph reported as unknown on a type, e.g. `primaryCtaIcon` on `EslHeroSlideProperty`. */
export function unknownFieldsFromError(error: unknown): UnknownField[] {
  const errors = (error as FailedGraphRequest | null)?.errors ?? [];
  const fields: UnknownField[] = [];
  for (const e of errors) {
    if (typeof e?.message === 'string') {
      const match = e.message.match(/Cannot query field "([^"]+)"(?: on type "([^"]+)")?/);
      if (match && match[1]) {
        fields.push({
          field: match[1],
          type: match[2] || undefined,
        });
      }
    }
  }
  return fields;
}

/** Removes spreads, inline fragments and fragment definitions of the given types. */
export function sanitizeQuery(query: string, unknownTypes: string[]): string {
  let sanitized = query;
  for (const typeName of unknownTypes) {
    sanitized = sanitized.replace(new RegExp(`\\.\\.\\.${typeName}\\b`, 'g'), '');
    sanitized = sanitized.replace(new RegExp(`\\.\\.\\.\\s*on\\s+${typeName}\\s*\\{[^}]*\\}`, 'g'), '');
    const fragStart = sanitized.indexOf(`fragment ${typeName} on ${typeName}`);
    if (fragStart !== -1) {
      const openBrace = sanitized.indexOf('{', fragStart);
      if (openBrace !== -1) {
        let depth = 1;
        let pos = openBrace + 1;
        while (pos < sanitized.length && depth > 0) {
          if (sanitized[pos] === '{') depth++;
          else if (sanitized[pos] === '}') depth--;
          pos++;
        }
        sanitized = sanitized.slice(0, fragStart) + sanitized.slice(pos);
      }
    }
  }
  return sanitized;
}

/** Removes unknown fields (including aliases and nested sub-selections) from the query. */
export function sanitizeFields(query: string, unknownFields: UnknownField[]): string {
  let sanitized = query;
  for (const { field } of unknownFields) {
    const regex = new RegExp(`(?:[a-zA-Z0-9_]+:)?\\b${field}\\b(?:\\s*\\([^)]*\\))?`, 'g');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(sanitized)) !== null) {
      const matchStart = match.index;
      let pos = match.index + match[0].length;

      while (pos < sanitized.length && /\s/.test(sanitized[pos])) {
        pos++;
      }

      if (sanitized[pos] === '{') {
        let depth = 1;
        pos++;
        while (pos < sanitized.length && depth > 0) {
          if (sanitized[pos] === '{') depth++;
          else if (sanitized[pos] === '}') depth--;
          pos++;
        }
      }

      sanitized = sanitized.slice(0, matchStart) + sanitized.slice(pos);
      regex.lastIndex = matchStart;
    }
  }
  return sanitized;
}

/**
 * Strips the `<Type>__` prefixes the SDK's generated queries put on field
 * names, as the SDK does for its own results.
 */
export function removeTypePrefix(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(removeTypePrefix);
  }
  if (typeof obj === 'object' && obj !== null) {
    const record = obj as Record<string, unknown>;
    const obj2: Record<string, unknown> = {};
    if ('__typename' in record && typeof record.__typename === 'string') {
      const metadata = record._metadata as { types?: string[] } | undefined;
      const types = metadata?.types || [record.__typename];
      for (const k in record) {
        if (!k.includes('__')) {
          obj2[k] = removeTypePrefix(record[k]);
          continue;
        }
        let stripped = false;
        for (let i = 0; i < types.length; i++) {
          const prefix = types[i] + '__';
          if (k.startsWith(prefix)) {
            obj2[k.slice(prefix.length)] = removeTypePrefix(record[k]);
            stripped = true;
            break;
          }
        }
        if (!stripped) {
          obj2[k] = removeTypePrefix(record[k]);
        }
      }
    } else {
      for (const k in record) {
        obj2[k] = removeTypePrefix(record[k]);
      }
    }
    return obj2;
  }
  return obj;
}

/**
 * Re-runs a failed SDK request without the types or fields Graph reported as unknown.
 * Returns the raw response, or null when the error is not an unknown-type/field
 * error (the caller should rethrow it). Retries a few times in case Graph
 * reports errors in batches.
 */
export async function retryWithoutUnknownTypes(
  client: GraphClient,
  error: unknown,
  previewToken?: string
): Promise<unknown | null> {
  const original = (error as FailedGraphRequest | null)?.request;
  if (!original?.query) return null;

  const unknown = new Set<string>();
  const unknownFields = new Map<string, UnknownField>();
  let current = error;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const types = unknownTypesFromError(current);
    const fields = unknownFieldsFromError(current);
    if (types.length === 0 && fields.length === 0) return null;
    types.forEach((type) => unknown.add(type));
    fields.forEach((f) => unknownFields.set(f.field, f));

    console.warn(
      '[cms] Graph does not know these registered types or fields; rendering without them. Push the CMS schema:',
      { types: [...unknown], fields: [...unknownFields.keys()] }
    );
    try {
      let sanitized = sanitizeQuery(original.query, [...unknown]);
      sanitized = sanitizeFields(sanitized, [...unknownFields.values()]);
      return await client.request(
        sanitized,
        original.variables,
        previewToken,
        false
      );
    } catch (retryError) {
      current = retryError;
    }
  }
  return null;
}

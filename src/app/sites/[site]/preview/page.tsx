import React from 'react';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { GraphClient, type PreviewParams } from '@optimizely/cms-sdk';
import {
  OptimizelyComponent,
  withAppContext,
} from '@optimizely/cms-sdk/react/server';
import { PreviewComponent } from '@optimizely/cms-sdk/react/client';
import '@/infrastructure/cms/optimizely-registry';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function removeTypePrefix(obj: unknown): unknown {
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

function decorateWithContext(obj: unknown, params: PreviewParams): unknown {
  if (Array.isArray(obj)) {
    return obj.map((e) => decorateWithContext(e, params));
  }
  if (typeof obj === 'object' && obj !== null) {
    const record = { ...(obj as Record<string, unknown>) };
    for (const k in record) {
      record[k] = decorateWithContext(record[k], params);
    }
    if ('__typename' in record) {
      record.__context = {
        edit: params.ctx === 'edit',
        preview_token: params.preview_token,
      };
    }
    return record;
  }
  return obj;
}

function sanitizeQuery(query: string, unknownTypes: string[]): string {
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

async function fetchPreviewContentResilient(
  client: GraphClient,
  params: PreviewParams
): Promise<React.ComponentProps<typeof OptimizelyComponent>['content'] | null> {
  try {
    return await client.getPreviewContent(params);
  } catch (error) {
    const errorObj = error as {
      errors?: Array<{ message: string }>;
      request?: {
        query: string;
        variables: Record<string, unknown>;
      };
    };

    const errors = errorObj?.errors || [];
    const unknownTypes: string[] = [];
    for (const e of errors) {
      const match = typeof e?.message === 'string' && e.message.match(/Unknown type "([^"]+)"/);
      if (match && match[1]) {
        unknownTypes.push(match[1]);
      }
    }

    if (unknownTypes.length > 0 && errorObj?.request?.query) {
      console.warn('[PreviewPage] Recovering from unknown GraphQL types:', unknownTypes);
      const cleanedQuery = sanitizeQuery(errorObj.request.query, unknownTypes);
      const retryRes = (await client.request(
        cleanedQuery,
        errorObj.request.variables,
        params.preview_token,
        false
      )) as { _Content?: { item?: unknown } } | undefined;
      const rawItem = retryRes?._Content?.item;
      if (rawItem) {
        return decorateWithContext(
          removeTypePrefix(rawItem),
          params
        ) as React.ComponentProps<typeof OptimizelyComponent>['content'];
      }
    }

    throw error;
  }
}

async function PreviewPage({ searchParams }: Props) {
  const params = (await searchParams) as PreviewParams;

  const client = new GraphClient(process.env.OPTIMIZELY_GRAPH_SINGLE_KEY!, {
    graphUrl: process.env.OPTIMIZELY_GRAPH_GATEWAY,
  });

  let content: React.ComponentProps<typeof OptimizelyComponent>['content'] | null = null;
  try {
    console.log('[PreviewPage] incoming params:', params);
    content = await fetchPreviewContentResilient(client, params);
    console.log('[PreviewPage] fetched content:', JSON.stringify(content, null, 2));
  } catch (error) {
    console.error('[PreviewPage] Error fetching preview content:', error);
  }

  if (!content) {
    return notFound();
  }

  const cmsUrl = process.env.OPTIMIZELY_CMS_URL || '';
  const injectorUrl = cmsUrl
    ? new URL('/util/javascript/communicationinjector.js', cmsUrl).href
    : '';

  return (
    <main>
      {injectorUrl && <Script src={injectorUrl} strategy="afterInteractive" />}
      <PreviewComponent />
      <OptimizelyComponent content={content} />
    </main>
  );
}

export default withAppContext(PreviewPage);

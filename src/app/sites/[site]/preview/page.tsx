import React from 'react';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { GraphClient, type PreviewParams } from '@optimizely/cms-sdk';
import {
  OptimizelyComponent,
  withAppContext,
} from '@optimizely/cms-sdk/react/server';
import { PreviewComponent } from '@optimizely/cms-sdk/react/client';
import {
  removeTypePrefix,
  retryWithoutUnknownTypes,
} from '@/infrastructure/cms/unknownTypeRecovery';
import '@/infrastructure/cms/optimizely-registry';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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

async function fetchPreviewContentResilient(
  client: GraphClient,
  params: PreviewParams
): Promise<React.ComponentProps<typeof OptimizelyComponent>['content'] | null> {
  try {
    return await client.getPreviewContent(params);
  } catch (error) {
    const retryRes = (await retryWithoutUnknownTypes(client, error, params.preview_token)) as
      | { _Content?: { item?: unknown } }
      | null;
    const rawItem = retryRes?._Content?.item;
    if (rawItem) {
      return decorateWithContext(
        removeTypePrefix(rawItem),
        params
      ) as React.ComponentProps<typeof OptimizelyComponent>['content'];
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
    <main id="main-content">
      {injectorUrl && <Script src={injectorUrl} strategy="afterInteractive" />}
      <PreviewComponent />
      <OptimizelyComponent content={content} />
    </main>
  );
}

export default withAppContext(PreviewPage);

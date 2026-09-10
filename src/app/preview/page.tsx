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

async function PreviewPage({ searchParams }: Props) {
  const params = (await searchParams) as PreviewParams;

  const client = new GraphClient(process.env.OPTIMIZELY_GRAPH_SINGLE_KEY!, {
    graphUrl: process.env.OPTIMIZELY_GRAPH_GATEWAY,
  });

  let content: React.ComponentProps<typeof OptimizelyComponent>['content'] | null = null;
  try {
    console.log('[PreviewPage] incoming params:', params);
    content = await client.getPreviewContent(params);
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

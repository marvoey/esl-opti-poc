import React from 'react';
import { notFound } from 'next/navigation';
import { GraphClient } from '@optimizely/cms-sdk';
import { OptimizelyComponent } from '@optimizely/cms-sdk/react/server';
import '@/infrastructure/cms/optimizely-registry';

type Props = {
  params: Promise<{
    slug: string[];
  }>;
};

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const path = `/${slug.join('/')}/`;
  const host = process.env.OPTIMIZELY_APP_HOST || 'http://localhost:5002';
  const apiKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY;

  if (!apiKey) {
    return notFound();
  }

  const client = new GraphClient(apiKey, {
    graphUrl: process.env.OPTIMIZELY_GRAPH_GATEWAY,
  });

  let content;
  try {
    content = await client.getContentByPath(path, { host });
    console.log('[DynamicPage] path:', path, 'content:', JSON.stringify(content, null, 2));
  } catch (error) {
    console.error('[DynamicPage] Error fetching CMS content for path:', path, error);
    return notFound();
  }

  if (!content || content.length === 0) {
    return notFound();
  }

  return <OptimizelyComponent content={content[0]} />;
}

import { GraphClient } from '@optimizely/cms-sdk';

let cachedClient: GraphClient | null = null;

export function getGraphClient(): GraphClient | null {
  const apiKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY;
  if (!apiKey) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = new GraphClient(apiKey, {
      graphUrl: process.env.OPTIMIZELY_GRAPH_GATEWAY,
    });
  }

  return cachedClient;
}

export interface OdpEvent {
  type: string;
  action: string;
  identifiers: { vuid: string; email?: string };
  data?: Record<string, string | number | boolean | null>;
}

export interface OdpResult {
  success: boolean;
  status?: number;
}

type Env = Record<string, string | undefined>;

/**
 * Sends events to the ODP v3 REST API. Server-only: it uses the private API key.
 * Never throws; a demo should not break because ODP is unreachable or unconfigured.
 */
export async function sendOdpEvents(events: OdpEvent[], env: Env = process.env): Promise<OdpResult> {
  const apiKey = env.ODP_PRIVATE_API_KEY;
  if (!apiKey) {
    console.warn('[odp] ODP_PRIVATE_API_KEY is not set; event not sent');
    return { success: false };
  }

  const region = env.ODP_REGION || 'us1';
  try {
    const response = await fetch(`https://api.${region}.odp.optimizely.com/v3/events`, {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(events),
      cache: 'no-store',
    });
    if (!response.ok) {
      console.error(`[odp] event rejected with status ${response.status}`);
      return { success: false, status: response.status };
    }
    return { success: true, status: response.status };
  } catch (error) {
    console.error('[odp] event request failed', error instanceof Error ? error.message : error);
    return { success: false };
  }
}

export const nowSeconds = (): number => Math.floor(Date.now() / 1000);

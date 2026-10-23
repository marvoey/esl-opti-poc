import { NextResponse, type NextRequest } from 'next/server';
import { ClientEventsSchema } from '@/infrastructure/odp/events';
import { nowSeconds, sendOdpEvents } from '@/infrastructure/odp/tracker';

/**
 * Forwards anonymous browser events to ODP so the private API key stays on the server.
 * Only the shapes in events.ts are accepted, and the server stamps `ts`.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = ClientEventsSchema.safeParse(Array.isArray(body) ? body : [body]);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
  }

  const ts = nowSeconds();
  const result = await sendOdpEvents(
    parsed.data.map((event) => ({ ...event, data: { ts, ...event.data } }))
  );
  return NextResponse.json({ success: result.success }, { status: result.success ? 200 : 502 });
}

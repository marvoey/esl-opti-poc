import { afterEach, describe, it, expect, vi } from 'vitest';
import type { NextRequest } from 'next/server';
import { POST } from './route';

const send = vi.hoisted(() => vi.fn());
vi.mock('@/infrastructure/odp/tracker', () => ({ sendOdpEvents: send, nowSeconds: () => 1700000000 }));

const request = (body: unknown) =>
  ({ json: async () => body }) as unknown as NextRequest;

const pageview = {
  type: 'navigation',
  action: 'pageview',
  identifiers: { vuid: 'vuid_esl_abcdef123456' },
  data: { page_path: '/personal/auto-loans', page_title: 'Auto Loans' },
};

afterEach(() => send.mockReset());

describe('POST /api/odp/event', () => {
  it('rejects events that are not allowlisted without calling ODP', async () => {
    const response = await POST(request([{ ...pageview, identifiers: { ...pageview.identifiers, email: 'a@b.co' } }]));
    expect(response.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('forwards a valid event with a server-stamped timestamp', async () => {
    send.mockResolvedValue({ success: true, status: 202 });
    const response = await POST(request([pageview]));
    expect(response.status).toBe(200);
    expect(send.mock.calls[0][0][0].data).toMatchObject({ ts: 1700000000, page_path: '/personal/auto-loans' });
  });

  it('reports a bad gateway when ODP does not accept the event', async () => {
    send.mockResolvedValue({ success: false });
    expect((await POST(request([pageview]))).status).toBe(502);
  });
});

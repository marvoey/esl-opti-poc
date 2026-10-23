import { afterEach, describe, it, expect, vi } from 'vitest';
import { sendOdpEvents } from './tracker';

const event = { type: 'customer', action: 'login', identifiers: { vuid: 'vuid_esl_abcdef123456' } };

afterEach(() => vi.unstubAllGlobals());

describe('sendOdpEvents', () => {
  it('does nothing without an API key', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(await sendOdpEvents([event], {})).toEqual({ success: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('posts to the regional endpoint with the key in a header', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 202 });
    vi.stubGlobal('fetch', fetchMock);
    const result = await sendOdpEvents([event], { ODP_PRIVATE_API_KEY: 'k', ODP_REGION: 'eu1' });
    expect(result).toEqual({ success: true, status: 202 });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.eu1.odp.optimizely.com/v3/events');
    expect(init.headers['x-api-key']).toBe('k');
  });

  it('reports a rejected request without throwing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 400 }));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await sendOdpEvents([event], { ODP_PRIVATE_API_KEY: 'k' })).toEqual({ success: false, status: 400 });
  });

  it('reports a network failure without throwing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await sendOdpEvents([event], { ODP_PRIVATE_API_KEY: 'k' })).toEqual({ success: false });
  });
});

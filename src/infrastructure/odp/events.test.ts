import { describe, it, expect } from 'vitest';
import { ClientEventsSchema } from './events';

const vuid = 'vuid_esl_abcdef123456';
const pageview = {
  type: 'navigation',
  action: 'pageview',
  identifiers: { vuid },
  data: { page_path: '/personal/auto-loans', page_title: 'Auto Loans' },
};

describe('ClientEventsSchema', () => {
  it('accepts an anonymous pageview', () => {
    expect(ClientEventsSchema.safeParse([pageview]).success).toBe(true);
  });

  it('rejects an email identifier so the browser cannot stitch identities', () => {
    const event = { ...pageview, identifiers: { vuid, email: 'someone@example.com' } };
    expect(ClientEventsSchema.safeParse([event]).success).toBe(false);
  });

  it('rejects event types that are not allowlisted', () => {
    expect(ClientEventsSchema.safeParse([{ ...pageview, type: 'customer', action: 'login' }]).success).toBe(false);
  });

  it('rejects a client-supplied timestamp', () => {
    const event = { ...pageview, data: { ...pageview.data, ts: 1 } };
    expect(ClientEventsSchema.safeParse([event]).success).toBe(false);
  });

  it('rejects malformed vuids and empty batches', () => {
    expect(ClientEventsSchema.safeParse([{ ...pageview, identifiers: { vuid: 'a b' } }]).success).toBe(false);
    expect(ClientEventsSchema.safeParse([]).success).toBe(false);
  });
});

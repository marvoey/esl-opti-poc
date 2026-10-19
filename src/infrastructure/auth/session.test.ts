import { describe, it, expect } from 'vitest';
import {
  AUDIENCE_COOKIE_NAME,
  SESSION_TTL_SECONDS,
  audienceCookieOptions,
  sessionCookieOptions,
} from './session';

describe('audienceCookieOptions', () => {
  it('is readable by the Optimizely snippet while the session cookie stays HttpOnly', () => {
    expect(audienceCookieOptions({ NODE_ENV: 'development' }).httpOnly).toBe(false);
    expect(sessionCookieOptions({ NODE_ENV: 'development' }).httpOnly).toBe(true);
  });

  it('is secure only in production', () => {
    expect(audienceCookieOptions({ NODE_ENV: 'production' }).secure).toBe(true);
    expect(audienceCookieOptions({ NODE_ENV: 'development' }).secure).toBe(false);
  });

  it('lives as long as the session and applies site-wide', () => {
    const options = audienceCookieOptions({ NODE_ENV: 'production' });
    expect(options.maxAge).toBe(SESSION_TTL_SECONDS);
    expect(options.path).toBe('/');
    expect(options.sameSite).toBe('lax');
  });

  it('has the same name in every environment', () => {
    expect(AUDIENCE_COOKIE_NAME).toBe('esl_signed_in');
  });
});

import { describe, it, expect } from 'vitest';
import robots from './robots';

describe('robots metadata configuration', () => {
  it('disallows all crawlers across all paths', () => {
    const config = robots();

    expect(config).toBeDefined();
    expect(config.rules).toEqual({
      userAgent: '*',
      disallow: '/',
    });
  });
});

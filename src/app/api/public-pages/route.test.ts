import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('GET /api/public-pages', () => {
  it('lists the standalone HTML pages in /public with their titles', async () => {
    const { pages } = await (await GET()).json();
    expect(pages).toContainEqual({
      path: '/esl-business-strategy-competitive-positioning.html',
      title: expect.stringContaining('Business Strategy and Competitive Positioning'),
    });
    expect(pages.every((p: { path: string }) => p.path.endsWith('.html'))).toBe(true);
  });
});

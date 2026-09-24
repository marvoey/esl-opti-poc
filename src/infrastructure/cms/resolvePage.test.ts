import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/infrastructure/cms/graphClient', () => ({
  getGraphClient: vi.fn(),
}));

import { getGraphClient } from '@/infrastructure/cms/graphClient';
import { resolvePage } from './resolvePage';

const getContentByPath = vi.fn();

describe('resolvePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getGraphClient).mockReturnValue({ getContentByPath } as unknown as ReturnType<typeof getGraphClient>);
  });

  it('looks the page up by URL within the site, under Home first', async () => {
    const page = { __typename: 'EslProductFamilyExperience', _metadata: { key: 'a' } };
    getContentByPath.mockResolvedValueOnce([page]);

    await expect(resolvePage('https://brand.example', '/product-family')).resolves.toBe(page);
    expect(getContentByPath).toHaveBeenCalledTimes(1);
    expect(getContentByPath).toHaveBeenCalledWith('/home/product-family/', { host: 'https://brand.example' });
  });

  it('falls back to the path as-is for pages outside Home', async () => {
    const page = { __typename: 'EslProductDetailExperience', _metadata: { key: 'b' } };
    getContentByPath.mockResolvedValueOnce([]).mockResolvedValueOnce([page]);

    await expect(resolvePage('http://localhost:5002', '/accounts/savings')).resolves.toBe(page);
    expect(getContentByPath).toHaveBeenLastCalledWith('/accounts/savings/', { host: 'http://localhost:5002' });
  });

  it('returns null when no page has the URL', async () => {
    getContentByPath.mockResolvedValue([]);
    await expect(resolvePage('http://localhost:5002', '/missing')).resolves.toBeNull();
  });

  it('returns null without a Graph client', async () => {
    vi.mocked(getGraphClient).mockReturnValue(null);
    await expect(resolvePage('http://localhost:5002', '/')).resolves.toBeNull();
  });

  it('lets Graph errors propagate instead of reporting a missing page', async () => {
    getContentByPath.mockRejectedValue(new Error('Unknown type "EslNew"'));
    await expect(resolvePage('http://localhost:5002', '/rates')).rejects.toThrow('Unknown type');
  });
});

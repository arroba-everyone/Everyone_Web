import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

// Mock server-only modules BEFORE importing posts
vi.mock('@everyone-web/libs/supabase.server', () => ({
  getServerClient: vi.fn(),
  getServiceClient: vi.fn(),
}));
vi.mock('@tanstack/react-start/server', () => ({
  getRequest: vi.fn(),
}));
vi.mock('@everyone-web/server/auth.server', () => ({
  getSession: vi.fn(),
  requireAdmin: vi.fn(),
}));
vi.mock('@tanstack/react-start', () => ({
  createServerFn: vi.fn(() => ({
    inputValidator: vi.fn().mockReturnThis(),
    handler: vi.fn((fn: unknown) => fn),
  })),
}));

import { getAllPostsForAdminFn, getPublishedPostsFn } from '@everyone-web/services/posts';
import { getServiceClient, getServerClient } from '@everyone-web/libs/supabase.server';
import { getRequest } from '@tanstack/react-start/server';
import { requireAdmin } from '@everyone-web/server/auth.server';
import type { Post } from '@everyone-web/types/supabase';

function makePost(overrides: Partial<Post> = {}): Post {
  return {
    id: overrides.id ?? 'post-1',
    title: overrides.title ?? 'Post de prueba',
    slug: overrides.slug ?? 'post-de-prueba',
    author: overrides.author ?? 'Autor',
    published_at: overrides.published_at ?? '2026-01-01T00:00:00Z',
    thumbnail_url: overrides.thumbnail_url ?? 'https://example.com/thumb.jpg',
    markdown_path: overrides.markdown_path ?? 'post-1.md',
    status: overrides.status ?? 'draft',
  };
}

const mockFakeRequest = {} as Request;

beforeEach(() => {
  vi.clearAllMocks();
  (getRequest as Mock).mockReturnValue(mockFakeRequest);
});

// ---------------------------------------------------------------------------
// getAllPostsForAdminFn
// ---------------------------------------------------------------------------

describe('getAllPostsForAdminFn', () => {
  it('throws 403-equivalent for non-admin', async () => {
    (requireAdmin as Mock).mockRejectedValue(new Response(null, { status: 403 }));

    await expect(
      (getAllPostsForAdminFn as unknown as () => Promise<unknown>)()
    ).rejects.toBeInstanceOf(Response);
  });

  it('returns ALL posts regardless of status for admin', async () => {
    (requireAdmin as Mock).mockResolvedValue({
      userId: 'admin-1',
      email: 'a@a.com',
      role: 'admin',
    });

    const posts = [
      makePost({ id: 'p1', status: 'published' }),
      makePost({ id: 'p2', status: 'draft' }),
    ];

    const orderMock = vi.fn().mockResolvedValue({ data: posts, error: null });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });
    (getServiceClient as Mock).mockReturnValue({ from: fromMock });

    const result = await (getAllPostsForAdminFn as unknown as () => Promise<Post[]>)();
    expect(result).toHaveLength(2);
    expect(result.some(p => p.status === 'draft')).toBe(true);
    expect(result.some(p => p.status === 'published')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// getPublishedPostsFn (Phase 15.1 regression guard)
// ---------------------------------------------------------------------------

describe('getPublishedPostsFn', () => {
  it('returns ONLY published posts (filters out drafts)', async () => {
    // The server fn uses getServerClient + eq('status', 'published')
    // But RLS also filters — in tests we simulate the RLS by having the mock
    // return only published rows (as RLS would do on anon key).

    const publishedPost = makePost({ id: 'p-pub', status: 'published' });
    // Draft should NOT be in the response (RLS filters + explicit eq)
    const publishedOnly = [publishedPost];

    const orderMock = vi.fn().mockResolvedValue({ data: publishedOnly, error: null });
    const eqMock = vi.fn().mockReturnValue({ order: orderMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });
    (getServerClient as Mock).mockReturnValue({ from: fromMock });

    const result = await (getPublishedPostsFn as unknown as () => Promise<Post[]>)();

    // Verify eq was called with status = published
    expect(eqMock).toHaveBeenCalledWith('status', 'published');
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('published');
  });

  it('returns empty array when no published posts exist', async () => {
    const orderMock = vi.fn().mockResolvedValue({ data: [], error: null });
    const eqMock = vi.fn().mockReturnValue({ order: orderMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    const fromMock = vi.fn().mockReturnValue({ select: selectMock });
    (getServerClient as Mock).mockReturnValue({ from: fromMock });

    const result = await (getPublishedPostsFn as unknown as () => Promise<Post[]>)();
    expect(result).toHaveLength(0);
  });
});

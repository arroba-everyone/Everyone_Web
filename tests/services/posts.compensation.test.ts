import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

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

import { createPostFn } from '@everyone-web/services/posts';
import { getServiceClient } from '@everyone-web/libs/supabase.server';
import { getRequest } from '@tanstack/react-start/server';
import { requireAdmin } from '@everyone-web/server/auth.server';
import type { PostCreateInput } from '@everyone-web/lib/validators/post';

const mockRequest = {} as Request;

beforeEach(() => {
  vi.clearAllMocks();
  (getRequest as Mock).mockReturnValue(mockRequest);
  (requireAdmin as Mock).mockResolvedValue({ userId: 'admin-1', email: 'a@a.com', displayName: 'Admin', avatarUrl: null, role: 'admin' });
});

const validInput: PostCreateInput = {
  title: 'Test post',
  slug: 'test-post',
  author: 'Admin',
  thumbnail_url: 'https://example.com/thumb.jpg',
  markdown: '# Hola\nMundo',
};

describe('createPostFn — compensation (Storage upload failure)', () => {
  it('deletes the inserted row when Storage upload throws', async () => {
    const insertedRow = {
      id: 'new-post-id',
      slug: 'test-post',
      title: 'Test post',
      author: 'Admin',
      thumbnail_url: 'https://example.com/thumb.jpg',
      markdown_path: '',
      status: 'draft',
      published_at: null,
    };

    // For slug uniqueness check: .from('posts').select('id').eq('slug', slug).single()
    const slugCheckSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const slugCheckEq = vi.fn().mockReturnValue({ single: slugCheckSingle });

    // Insert: .from('posts').insert(...).select().single()
    const insertSingle = vi.fn().mockResolvedValue({ data: insertedRow, error: null });
    const insertSelect = vi.fn().mockReturnValue({ single: insertSingle });
    const insertMock = vi.fn().mockReturnValue({ select: insertSelect });

    // Delete compensation: .from('posts').delete().eq('id', id)
    const deleteEqMock = vi.fn().mockResolvedValue({ data: null, error: null });
    const deleteMock = vi.fn().mockReturnValue({ eq: deleteEqMock });

    let selectCallCount = 0;
    const fromMock = vi.fn().mockReturnValue({
      select: vi.fn().mockImplementation(() => {
        // First select is for slug check
        selectCallCount++;
        if (selectCallCount === 1) return { eq: slugCheckEq };
        return { eq: slugCheckEq };
      }),
      insert: insertMock,
      delete: deleteMock,
    });

    // Storage upload throws
    const uploadError = new Error('Storage bucket not available');
    const uploadMock = vi.fn().mockRejectedValue(uploadError);
    const storageMock = { from: vi.fn().mockReturnValue({ upload: uploadMock }) };

    (getServiceClient as Mock).mockReturnValue({ from: fromMock, storage: storageMock });

    await expect(
      (createPostFn as unknown as (input: { data: PostCreateInput }) => Promise<unknown>)({
        data: validInput,
      })
    ).rejects.toThrow('Storage bucket not available');

    // Verify compensation: delete was called
    expect(deleteMock).toHaveBeenCalled();
    expect(deleteEqMock).toHaveBeenCalledWith('id', 'new-post-id');
  });

  it('propagates the upload error to the caller after compensation', async () => {
    const insertedRow = {
      id: 'post-comp-2',
      slug: 'test-post',
      title: 'Test post',
      author: 'Admin',
      thumbnail_url: 'https://example.com/thumb.jpg',
      markdown_path: '',
      status: 'draft',
      published_at: null,
    };

    const slugCheckSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const slugCheckEq = vi.fn().mockReturnValue({ single: slugCheckSingle });

    const insertSingle = vi.fn().mockResolvedValue({ data: insertedRow, error: null });
    const insertSelect = vi.fn().mockReturnValue({ single: insertSingle });
    const insertMock = vi.fn().mockReturnValue({ select: insertSelect });

    const deleteEqMock = vi.fn().mockResolvedValue({ data: null, error: null });
    const deleteMock = vi.fn().mockReturnValue({ eq: deleteEqMock });

    const specificError = new Error('NETWORK_FAILURE');
    const uploadMock = vi.fn().mockRejectedValue(specificError);
    const storageMock = { from: vi.fn().mockReturnValue({ upload: uploadMock }) };

    (getServiceClient as Mock).mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({ eq: slugCheckEq }),
        insert: insertMock,
        delete: deleteMock,
      }),
      storage: storageMock,
    });

    const result = await (
      createPostFn as unknown as (input: { data: PostCreateInput }) => Promise<unknown>
    )({ data: validInput }).catch((e: Error) => e);

    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe('NETWORK_FAILURE');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Post } from '@everyone-web/types/supabase';

vi.mock('@tanstack/react-router', async importOriginal => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    useRouterState: vi.fn().mockReturnValue({ location: { pathname: '/blog/manage' } }),
  };
});

import { PostsTable } from '@everyone-web/components/admin/PostsTable';

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

const mixedPosts: Post[] = [
  makePost({ id: 'p1', title: 'Mi primer post', status: 'draft' }),
  makePost({
    id: 'p2',
    title: 'Mi segundo post',
    status: 'published',
    published_at: '2026-02-01T00:00:00Z',
  }),
];

const noop = vi.fn();

describe('PostsTable', () => {
  it('renders all statuses with correct badges', () => {
    render(
      <PostsTable
        posts={mixedPosts}
        onPublish={noop}
        onUnpublish={noop}
        onEdit={noop}
        onDelete={noop}
      />
    );

    expect(screen.getByText('Mi primer post')).toBeTruthy();
    expect(screen.getByText('Mi segundo post')).toBeTruthy();

    // Status badges (Spanish labels)
    expect(screen.getByText('Borrador')).toBeTruthy();
    expect(screen.getByText('Publicado')).toBeTruthy();
  });

  it('calls onPublish with post id when Publicar is clicked for a draft post', () => {
    const onPublish = vi.fn();
    render(
      <PostsTable
        posts={[makePost({ id: 'p-draft', status: 'draft' })]}
        onPublish={onPublish}
        onUnpublish={noop}
        onEdit={noop}
        onDelete={noop}
      />
    );

    const publishBtn = screen.getByRole('button', { name: /publicar/i });
    fireEvent.click(publishBtn);
    expect(onPublish).toHaveBeenCalledWith('p-draft');
    expect(onPublish).toHaveBeenCalledTimes(1);
  });

  it('calls onUnpublish with post id when Despublicar is clicked for a published post', () => {
    const onUnpublish = vi.fn();
    render(
      <PostsTable
        posts={[makePost({ id: 'p-pub', status: 'published' })]}
        onPublish={noop}
        onUnpublish={onUnpublish}
        onEdit={noop}
        onDelete={noop}
      />
    );

    const unpublishBtn = screen.getByRole('button', { name: /despublicar/i });
    fireEvent.click(unpublishBtn);
    expect(onUnpublish).toHaveBeenCalledWith('p-pub');
    expect(onUnpublish).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete with post id when Eliminar is clicked', () => {
    const onDelete = vi.fn();
    render(
      <PostsTable
        posts={[makePost({ id: 'p-del', status: 'draft' })]}
        onPublish={noop}
        onUnpublish={noop}
        onEdit={noop}
        onDelete={onDelete}
      />
    );

    const deleteBtn = screen.getByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledWith('p-del');
  });

  it('shows filter select with "Todos" default', () => {
    render(
      <PostsTable
        posts={mixedPosts}
        onPublish={noop}
        onUnpublish={noop}
        onEdit={noop}
        onDelete={noop}
      />
    );

    // Filter defaults to "Todos"
    expect(screen.getByText('Todos')).toBeTruthy();
  });
});

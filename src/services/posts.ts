// posts.ts — server fns for blog posts.
//
// Public reads: getPublishedPostsFn, getPostBySlugFn
// Admin reads:  getAllPostsForAdminFn
// Admin writes: createPostFn, updatePostFn, deletePostFn, setPostStatusFn
//
// All mutations call requireAdmin(request) as the FIRST operation.
// Writes use getServiceClient() (RLS bypass — admin already validated).
// Reads use getServerClient(request) (RLS applied — anon key with session cookie).
//
// Storage: markdown files live in the `landingBlog` bucket under `${post.id}.md`.
// createPostFn flow: insert row → upload markdown → update row with markdown_path
//   Compensation: if upload fails, delete the row to avoid orphans.
// deletePostFn flow: delete row → best-effort delete storage file (log on error).

import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { getServerClient, getServiceClient } from '@everyone-web/libs/supabase.server';
import { requireAdmin } from '@everyone-web/server/auth.server';
import type { Post, PostInsert, PostStatus } from '@everyone-web/types/supabase';
import type { PostCreateInput, PostUpdateInput } from '@everyone-web/lib/validators/post';

export type { PostCreateInput, PostUpdateInput };

// ---------------------------------------------------------------------------
// Public reads
// ---------------------------------------------------------------------------

/**
 * Returns all published posts for the public blog index.
 * Filters by status='published' explicitly (RLS also enforces this for anon key).
 * See REQ-BLOG-PUBLIC-1 and the regression guard test in posts.test.ts.
 */
export const getPublishedPostsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest();
  const client = getServerClient(request);

  const { data, error } = await client
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Post[];
});

/**
 * Returns a single published post by slug, including markdown content from Storage.
 * Returns null if the post doesn't exist or isn't published.
 */
export const getPostBySlugFn = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const request = getRequest();
    const client = getServerClient(request);

    const { data: post, error } = await client
      .from('posts')
      .select('title, author, published_at, thumbnail_url, slug, markdown_path')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) throw error;
    if (!post) throw new Error('Post no encontrado');

    const { data: file, error: fileError } = await client.storage
      .from('landingBlog')
      .download(post.markdown_path);

    if (fileError) throw fileError;

    const markdown = await file.text();

    return {
      title: post.title,
      author: post.author,
      publishedAt: post.published_at,
      thumbnailUrl: post.thumbnail_url,
      slug: post.slug,
      markdown,
    };
  });

// ---------------------------------------------------------------------------
// Admin reads
// ---------------------------------------------------------------------------

/**
 * Returns ALL posts regardless of status. Admin-gated.
 * See REQ-BLOG-MANAGE-1.
 */
export const getAllPostsForAdminFn = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest();
  await requireAdmin(request);
  const svc = getServiceClient();

  const { data, error } = await svc
    .from('posts')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Post[];
});

/**
 * Downloads the markdown content for a post (used in edit mode).
 * Admin-gated.
 */
export const getPostMarkdownFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const request = getRequest();
    await requireAdmin(request);
    const svc = getServiceClient();

    const { data: post, error } = await svc
      .from('posts')
      .select('markdown_path')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!post) throw new Error('Post no encontrado');

    const { data: file, error: fileError } = await svc.storage
      .from('landingBlog')
      .download(post.markdown_path);

    if (fileError) throw fileError;

    return file.text();
  });

// ---------------------------------------------------------------------------
// Admin mutations
// ---------------------------------------------------------------------------

/**
 * Creates a new post.
 *
 * Flow:
 *  1. requireAdmin
 *  2. Insert row (status='draft', markdown_path='')
 *  3. Upload markdown to Storage as `${id}.md`
 *  4. Update row with markdown_path
 *  Compensation: if step 3 fails, delete the inserted row.
 *
 * See design §4.5 and §5.E.
 */
export const createPostFn = createServerFn({ method: 'POST' })
  .inputValidator((input: PostCreateInput) => input)
  .handler(async ({ data }) => {
    const request = getRequest();
    await requireAdmin(request);
    const svc = getServiceClient();

    // Check slug uniqueness
    const { data: existing } = await svc.from('posts').select('id').eq('slug', data.slug).single();

    if (existing) {
      throw Object.assign(new Error('Ya existe un post con ese slug'), {
        code: 'SLUG_TAKEN',
      });
    }

    // Insert row with empty markdown_path placeholder
    const insertPayload: PostInsert = {
      title: data.title,
      slug: data.slug,
      author: data.author,
      thumbnail_url: data.thumbnail_url,
      status: 'draft' as PostStatus,
      markdown_path: '',
    };

    const { data: row, error: insertError } = await svc
      .from('posts')
      .insert(insertPayload)
      .select()
      .single();

    if (insertError || !row) throw insertError ?? new Error('Error al crear el post');

    // Upload markdown to Storage
    try {
      const { error: uploadError } = await svc.storage
        .from('landingBlog')
        .upload(`${row.id}.md`, new Blob([data.markdown], { type: 'text/markdown' }), {
          upsert: false,
        });

      if (uploadError) throw uploadError;
    } catch (uploadErr) {
      // Compensation: delete the row to avoid orphans
      await svc.from('posts').delete().eq('id', row.id);
      throw uploadErr;
    }

    // Update row with real markdown_path
    const { data: updated, error: updateError } = await svc
      .from('posts')
      .update({ markdown_path: `${row.id}.md` })
      .eq('id', row.id)
      .select()
      .single();

    if (updateError || !updated) throw updateError ?? new Error('Error al actualizar el post');

    return updated as Post;
  });

/**
 * Updates an existing post.
 * If markdown has changed, overwrites the Storage file.
 * Admin-gated.
 */
export const updatePostFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (input: { id: string; fields: Partial<PostCreateInput> & { markdown?: string } }) => input
  )
  .handler(async ({ data: { id, fields } }) => {
    const request = getRequest();
    await requireAdmin(request);
    const svc = getServiceClient();

    // If slug is changing, check uniqueness
    if (fields.slug) {
      const { data: existing } = await svc
        .from('posts')
        .select('id')
        .eq('slug', fields.slug)
        .neq('id', id)
        .single();

      if (existing) {
        throw Object.assign(new Error('Ya existe un post con ese slug'), {
          code: 'SLUG_TAKEN',
        });
      }
    }

    const { markdown, ...rowFields } = fields;

    // Update DB row
    const { data: updated, error } = await svc
      .from('posts')
      .update(rowFields)
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) throw error ?? new Error('Error al actualizar el post');

    // Overwrite markdown in Storage if provided
    if (markdown !== undefined) {
      const { error: uploadError } = await svc.storage
        .from('landingBlog')
        .upload(`${id}.md`, new Blob([markdown], { type: 'text/markdown' }), { upsert: true });

      if (uploadError) {
        console.error('Error al subir markdown a Storage:', uploadError);
        // Non-fatal: row was updated, storage is best-effort for updates
      }
    }

    return updated as Post;
  });

/**
 * Deletes a post.
 *
 * Flow: delete DB row first, then best-effort delete Storage file.
 * If Storage delete fails, log and continue (do NOT roll back the row delete).
 * See design §4.5 (confirmed default #3).
 */
export const deletePostFn = createServerFn({ method: 'POST' })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data: { id } }) => {
    const request = getRequest();
    await requireAdmin(request);
    const svc = getServiceClient();

    // Read markdown_path before deleting row
    const { data: row } = await svc.from('posts').select('markdown_path').eq('id', id).single();

    // Delete DB row first
    const { error } = await svc.from('posts').delete().eq('id', id);
    if (error) throw error;

    // Best-effort Storage cleanup
    if (row?.markdown_path) {
      try {
        await svc.storage.from('landingBlog').remove([row.markdown_path]);
      } catch (storageErr) {
        console.warn('No se pudo eliminar el archivo de Storage:', storageErr);
      }
    }
  });

/**
 * Changes a post's status.
 *
 * - transitioning to 'published': sets published_at = now() if currently null.
 * - transitioning to 'draft': leaves published_at unchanged.
 * See REQ-BLOG-MANAGE-5, REQ-BLOG-MANAGE-6.
 */
export const setPostStatusFn = createServerFn({ method: 'POST' })
  .inputValidator((input: { id: string; status: PostStatus }) => input)
  .handler(async ({ data: { id, status } }) => {
    const request = getRequest();
    await requireAdmin(request);
    const svc = getServiceClient();

    let published_at: string | undefined;
    if (status === 'published') {
      const { data: current } = await svc
        .from('posts')
        .select('published_at')
        .eq('id', id)
        .single();
      if (!current?.published_at) {
        published_at = new Date().toISOString();
      }
    }

    const updatePayload = published_at !== undefined ? { status, published_at } : { status };

    const { data, error } = await svc
      .from('posts')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) throw error ?? new Error('Error al actualizar estado');
    return data as Post;
  });

// ---------------------------------------------------------------------------
// Browser hook (for future use — e.g. tanstack query wrapper)
// ---------------------------------------------------------------------------

export type { Post };

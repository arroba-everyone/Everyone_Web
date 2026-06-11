import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import slugify from 'slugify';
import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@everyone-web/ui/input';
import { Button } from '@everyone-web/ui/button';
import { Card } from '@everyone-web/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@everyone-web/ui/tabs';
import { Label } from '@everyone-web/ui/label';
import { MarkdownPreview } from '@everyone-web/components/markdown/MarkdownPreview';
import { createPostFn, updatePostFn, setPostStatusFn } from '@everyone-web/services/posts';
import { cn } from '@everyone-web/libs/utils';
import { BlockList } from './PostBlocks/BlockList';
import { DEFAULT_HEADER, type Block, type PostHeader } from './PostBlocks/types';
import {
  computeReadingTime,
  extractYouTubeId,
  fetchYouTubeDurationMinutes,
  formatMonthYear,
  parsePost,
  serializePost,
} from './PostBlocks/markdown';
import type { Post, PostStatus } from '@everyone-web/types/supabase';

interface PostEditorProps {
  mode: 'create' | 'edit';
  post?: Post & { markdown: string };
}

function toSlug(title: string): string {
  return slugify(title, { lower: true, strict: true });
}

/**
 * Full-page post editor.
 *
 * Composition:
 *  - Header form  → title, author handle, avatar, reading time, date, hero image.
 *  - Block editor → ordered list of body blocks (paragraph, heading, divider,
 *                   image, list, timestamps, tags). Click "+ Añadir bloque".
 *  - Tabs:
 *      "Edición"      → header form + block editor.
 *      "Vista previa" → renders the post EXACTLY as `/blog/$slug` does.
 *                       Same wrappers, same component overrides.
 *
 * Persistence: header + blocks → markdown via `serializePost()`. On edit, the
 * stored markdown is parsed back into header + blocks via `parsePost()`.
 */
export function PostEditor({ mode, post }: PostEditorProps) {
  const router = useRouter();
  const navigate = useNavigate();

  // ---------- Form state ----------
  const initial = useMemo(() => {
    if (mode === 'edit' && post?.markdown) {
      return parsePost(post.markdown);
    }
    return { header: { ...DEFAULT_HEADER }, blocks: [] as Block[] };
  }, [mode, post]);

  const [title, setTitle] = useState(post?.title ?? initial.header.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [author, setAuthor] = useState(post?.author ?? '@everyone');
  const [thumbnailUrl, setThumbnailUrl] = useState(post?.thumbnail_url ?? '');
  const [header, setHeader] = useState<PostHeader>({
    ...initial.header,
    // Title and hero are mirrored from the dedicated form fields.
    title: post?.title ?? initial.header.title,
    heroUrl: post?.thumbnail_url ?? initial.header.heroUrl,
  });
  const [blocks, setBlocks] = useState<Block[]>(initial.blocks);

  const [serverError, setServerError] = useState<string | null>(null);
  const [busy, setBusy] = useState<
    'idle' | 'saving' | 'publishing' | 'unpublishing' | 'detecting'
  >('idle');
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');

  const status: PostStatus = post?.status ?? 'draft';

  // Auto-derive slug from title in create mode while user hasn't touched it.
  useEffect(() => {
    if (!slugTouched && title) {
      setSlug(toSlug(title));
    }
  }, [title, slugTouched]);

  // Auto-compute reading time from block content (200 wpm), unless the post
  // has a video URL with an explicit duration — then it wins.
  const readingTime = useMemo(
    () =>
      computeReadingTime(
        blocks,
        header.videoUrl.trim() ? header.videoDurationMinutes : undefined
      ),
    [blocks, header.videoUrl, header.videoDurationMinutes]
  );

  // Auto-compute the date label: published posts freeze on their publish date,
  // drafts and new posts always show the current month.
  const dateLabel = useMemo(() => {
    const source = post?.published_at ? new Date(post.published_at) : new Date();
    return formatMonthYear(source);
  }, [post?.published_at]);

  // Keep header in sync with the dedicated columns + auto-derived fields.
  useEffect(() => {
    setHeader(h => ({
      ...h,
      title,
      heroUrl: thumbnailUrl,
      readingTime,
      date: dateLabel,
    }));
  }, [title, thumbnailUrl, readingTime, dateLabel]);

  const markdown = useMemo(() => serializePost(header, blocks), [header, blocks]);

  // Deferred value for the preview tab — lets the edit tab remain responsive while
  // the markdown parse+render pipeline (inside React.memo'd MarkdownPreview) catches up.
  const deferredMarkdown = useDeferredValue(markdown);

  // ---------- Persistence ----------

  const persist = async (): Promise<string | null> => {
    setServerError(null);
    if (!title.trim()) {
      setServerError('El título es obligatorio.');
      return null;
    }
    if (!slug.trim()) {
      setServerError('El slug es obligatorio.');
      return null;
    }
    if (!author.trim()) {
      setServerError('El autor es obligatorio.');
      return null;
    }
    if (!thumbnailUrl.trim()) {
      setServerError('La URL de la imagen es obligatoria.');
      return null;
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      author: author.trim(),
      thumbnail_url: thumbnailUrl.trim(),
      markdown,
    };

    try {
      if (mode === 'create') {
        const result = (await (
          createPostFn as unknown as (input: { data: typeof payload }) => Promise<{ id: string }>
        )({ data: payload })) as { id: string };
        return result.id;
      } else if (post) {
        await (
          updatePostFn as unknown as (input: {
            data: { id: string; fields: typeof payload };
          }) => Promise<unknown>
        )({ data: { id: post.id, fields: payload } });
        return post.id;
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    }
    return null;
  };

  const handleSave = async () => {
    setBusy('saving');
    try {
      const id = await persist();
      if (id) {
        await router.invalidate();
        await navigate({ to: '/blog/manage' });
      }
    } finally {
      setBusy('idle');
    }
  };

  const handlePublish = async () => {
    setBusy('publishing');
    try {
      const id = await persist();
      if (!id) return;
      await (
        setPostStatusFn as unknown as (input: {
          data: { id: string; status: 'published' };
        }) => Promise<unknown>
      )({ data: { id, status: 'published' } });
      await router.invalidate();
      await navigate({ to: '/blog/manage' });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error al publicar');
    } finally {
      setBusy('idle');
    }
  };

  const handleUnpublish = async () => {
    if (!post) return;
    setBusy('unpublishing');
    try {
      const id = await persist();
      if (!id) return;
      await (
        setPostStatusFn as unknown as (input: {
          data: { id: string; status: 'draft' };
        }) => Promise<unknown>
      )({ data: { id, status: 'draft' } });
      await router.invalidate();
      await navigate({ to: '/blog/manage' });
    } finally {
      setBusy('idle');
    }
  };

  const heroTitle = mode === 'create' ? 'Crear post' : 'Editar post';
  const isBusy = busy !== 'idle';

  // ---------- Render ----------

  return (
    <div className="flex flex-col gap-8 tablet-lg:gap-10">
      {/* Header bar */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-2">
          <Link
            to="/blog/manage"
            className="text-sm text-foreground/60 hover:text-primary inline-flex items-center gap-1 w-fit transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la lista
          </Link>
          <h1 className="font-bold text-3xl md:text-4xl tablet-lg:text-5xl laptop:text-6xl">
            {heroTitle}
          </h1>
          {mode === 'edit' && (
            <p className="text-sm text-foreground/60">
              Estado actual: <span className="font-semibold text-foreground">{status}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            onClick={() => void navigate({ to: '/blog/manage' })}
            disabled={isBusy}
            className="rounded-full px-5 cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => void handleSave()}
            disabled={isBusy}
            className="rounded-full px-5 cursor-pointer"
          >
            {busy === 'saving' ? 'Guardando…' : 'Guardar borrador'}
          </Button>
          {status === 'published' ? (
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleUnpublish()}
              disabled={isBusy}
              className="rounded-full px-5 cursor-pointer transition-all hover:scale-105"
            >
              {busy === 'unpublishing' ? 'Despublicando…' : 'Despublicar'}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => void handlePublish()}
              disabled={isBusy}
              className="rounded-full px-5 cursor-pointer transition-all hover:scale-105"
            >
              {busy === 'publishing' ? 'Publicando…' : 'Publicar'}
            </Button>
          )}
        </div>
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {serverError}
        </div>
      )}

      <Tabs value={tab} onValueChange={v => setTab(v as 'edit' | 'preview')}>
        <TabsList>
          <TabsTrigger value="edit">Edición</TabsTrigger>
          <TabsTrigger value="preview">Vista previa</TabsTrigger>
        </TabsList>

        {/* Edit tab — header form + block editor. */}
        <TabsContent value="edit" className="mt-0 flex flex-col gap-6 tablet-lg:gap-8">
          {/* Header form */}
          <Card
            className={cn(
              'bg-card overflow-hidden flex flex-col gap-5',
              'rounded-3xl tablet-lg:rounded-[2rem]',
              'p-6 md:p-8 tablet-lg:p-10'
            )}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="font-semibold text-lg">Cabecera del post</h2>
              <span
                className="rounded-full bg-foreground/[.04] border border-foreground/10 px-4 py-1.5 text-xs text-foreground/70 inline-flex items-center gap-2"
                aria-label="Resumen automático"
              >
                <span className="font-mono">{readingTime}</span>
                <span className="text-foreground/30">·</span>
                <span className="font-mono">{dateLabel}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormRow label="Título" htmlFor="post-title">
                <Input
                  id="post-title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Título del post"
                  className="rounded-full bg-background border-foreground/15 px-5 h-11"
                />
              </FormRow>

              <FormRow label="Slug" htmlFor="post-slug">
                <Input
                  id="post-slug"
                  value={slug}
                  onChange={e => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="mi-post-slug"
                  className="rounded-full bg-background border-foreground/15 px-5 h-11 font-mono text-sm"
                />
              </FormRow>

              <FormRow label="Autor (handle visible)" htmlFor="post-author">
                <Input
                  id="post-author"
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  placeholder="@everyone"
                  className="rounded-full bg-background border-foreground/15 px-5 h-11"
                />
              </FormRow>

              <FormRow
                label="URL del avatar (cabecera)"
                htmlFor="post-avatar"
                hint="Pequeño icono junto al nombre."
              >
                <Input
                  id="post-avatar"
                  value={header.authorAvatarUrl}
                  onChange={e =>
                    setHeader(h => ({ ...h, authorAvatarUrl: e.target.value }))
                  }
                  placeholder="https://…"
                  className="rounded-full bg-background border-foreground/15 px-5 h-11"
                />
              </FormRow>

              <FormRow
                label="URL imagen principal"
                htmlFor="post-hero"
                hint="También se usa como miniatura en el listado del blog."
              >
                <Input
                  id="post-hero"
                  value={thumbnailUrl}
                  onChange={e => setThumbnailUrl(e.target.value)}
                  placeholder="https://…"
                  className="rounded-full bg-background border-foreground/15 px-5 h-11"
                />
              </FormRow>

              <FormRow label="Texto alternativo (imagen principal)" htmlFor="post-hero-alt">
                <Input
                  id="post-hero-alt"
                  value={header.heroAlt}
                  onChange={e => setHeader(h => ({ ...h, heroAlt: e.target.value }))}
                  placeholder="Imagen del post"
                  className="rounded-full bg-background border-foreground/15 px-5 h-11"
                />
              </FormRow>
            </div>

            {/* Video section — collapsible */}
            <details className="rounded-2xl border border-foreground/10 bg-background/40 mt-2">
              <summary className="cursor-pointer text-sm font-medium px-5 py-3 select-none text-foreground/80 hover:text-primary transition-colors">
                ¿El contenido principal es un vídeo? (opcional)
              </summary>
              <div className="px-5 pb-5 flex flex-col gap-5">
                <p className="text-xs text-foreground/60">
                  Si rellenas la URL, el post mostrará un reproductor incrustado en lugar de la
                  imagen. La miniatura del listado del blog seguirá siendo la URL principal de
                  arriba — pon ahí una imagen representativa del vídeo.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormRow
                    label="URL del vídeo (YouTube, Vimeo…)"
                    htmlFor="post-video-url"
                    hint="Acepta enlaces de share, embed o youtu.be."
                  >
                    <Input
                      id="post-video-url"
                      value={header.videoUrl}
                      onChange={e =>
                        setHeader(h => ({ ...h, videoUrl: e.target.value }))
                      }
                      placeholder="https://www.youtube.com/watch?v=…"
                      className="rounded-full bg-background border-foreground/15 px-5 h-11"
                    />
                  </FormRow>

                  <FormRow
                    label="Duración (minutos)"
                    htmlFor="post-video-duration"
                    hint="Auto-detectado desde YouTube al pegar la URL. Sustituye al cálculo automático del tiempo de lectura."
                  >
                    <div className="flex gap-2">
                      <Input
                        id="post-video-duration"
                        type="number"
                        min={0}
                        value={header.videoDurationMinutes || ''}
                        onChange={e =>
                          setHeader(h => ({
                            ...h,
                            videoDurationMinutes: Number.parseInt(e.target.value, 10) || 0,
                          }))
                        }
                        placeholder="12"
                        className="rounded-full bg-background border-foreground/15 px-5 h-11 flex-1"
                        disabled={!header.videoUrl.trim()}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          const id = extractYouTubeId(header.videoUrl);
                          const apiKey = import.meta.env['VITE_YOUTUBE_API_KEY'] as
                            | string
                            | undefined;
                          if (!id || !apiKey) return;
                          setBusy('detecting');
                          try {
                            const minutes = await fetchYouTubeDurationMinutes(id, apiKey);
                            if (minutes) {
                              setHeader(h => ({ ...h, videoDurationMinutes: minutes }));
                            } else {
                              setServerError(
                                'No se pudo obtener la duración. Rellena el campo manualmente.'
                              );
                            }
                          } finally {
                            setBusy('idle');
                          }
                        }}
                        disabled={
                          !extractYouTubeId(header.videoUrl) ||
                          !import.meta.env['VITE_YOUTUBE_API_KEY'] ||
                          busy === 'detecting'
                        }
                        className="rounded-full whitespace-nowrap"
                        title="Detectar la duración del vídeo de YouTube"
                      >
                        {busy === 'detecting' ? 'Detectando…' : 'Auto'}
                      </Button>
                    </div>
                  </FormRow>
                </div>
              </div>
            </details>
          </Card>

          {/* Block editor */}
          <Card
            className={cn(
              'bg-card overflow-hidden flex flex-col gap-5',
              'rounded-3xl tablet-lg:rounded-[2rem]',
              'p-6 md:p-8 tablet-lg:p-10'
            )}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Cuerpo del post</h2>
              <span className="text-xs text-foreground/50">
                {blocks.length} {blocks.length === 1 ? 'bloque' : 'bloques'}
              </span>
            </div>
            <BlockList blocks={blocks} onChange={setBlocks} />
          </Card>
        </TabsContent>

        {/* Preview tab — clone of /blog/$slug body. */}
        <TabsContent value="preview" className="mt-0">
          <div
            className={cn(
              'rounded-3xl tablet-lg:rounded-[2rem] overflow-hidden',
              'bg-background border border-foreground/10'
            )}
          >
            <div className="flex flex-col justify-center items-center px-4 py-12 md:py-20">
              <div className="w-full max-w-4xl" data-testid="post-preview">
                {deferredMarkdown.trim().length > 0 && title.trim().length > 0 ? (
                  <MarkdownPreview content={deferredMarkdown} />
                ) : (
                  <p className="text-foreground/50 text-sm italic text-center py-20">
                    Rellena la cabecera y añade bloques en la pestaña{' '}
                    <strong>Edición</strong> para ver la vista previa.
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Small helper to keep label + input + hint consistent.
function FormRow({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-foreground/50">{hint}</p>}
    </div>
  );
}

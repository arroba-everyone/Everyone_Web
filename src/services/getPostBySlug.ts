import supabase from '@everyone-web/libs/supabase';
import { useQuery } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';

export interface IPostData {
  title: string;
  author: string;
  publishedAt: string;
  thumbnailUrl: string;
  slug: string;
  markdown: string;
}

export const getPostBySlugFn = createServerFn({ method: 'GET' })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const { data: post, error } = await supabase
      .from('posts')
      .select('title, author, published_at, thumbnail_url, slug, markdown_path')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    if (error) throw error;
    if (!post) throw new Error('Post no encontrado');

    const { data: file, error: fileError } = await supabase.storage
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
    } as IPostData;
  });

export const useGetPostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['posts', slug],
    queryFn: async () => {
      const { data: post, error } = await supabase
        .from('posts')
        .select('markdown_path')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      if (error) throw error;
      if (!post) throw new Error('Post no encontrado');

      const { data: file, error: fileError } = await supabase.storage
        .from('landingBlog')
        .download(post.markdown_path);

      if (fileError) throw fileError;

      const markdown = await file.text();

      return markdown;
    },
  });
};

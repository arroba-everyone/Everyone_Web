import supabase from '@everyone-web/libs/supabase';
import { useQuery } from '@tanstack/react-query';

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
        .from('landingBlog') // nombre del bucket
        .download(post.markdown_path);

      if (fileError) throw fileError;

      const markdown = await file.text();

      return markdown;
    },
  });
};

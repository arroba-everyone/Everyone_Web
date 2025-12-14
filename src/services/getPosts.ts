import supabase from '@everyone-web/libs/supabase';
import { keysToCamel } from '@everyone-web/utils/snakeToCamel';
import { useQuery } from '@tanstack/react-query';

export interface IPost {
  id: string;
  author: string;
  publishedAt: string;
  title: string;
  slug: string;
  markdownPath: string;
  status: string;
  thumbnailUrl: string;
}

export const useGetPosts = () => {
  return useQuery<IPost[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select()
        .order('published_at', { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return keysToCamel<IPost[]>(data);
    },
  });
};

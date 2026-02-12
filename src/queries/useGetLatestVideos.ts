import { getLatestVideos } from '@everyone-web/services/getLatestVideos';
import { useSuspenseQuery } from '@tanstack/react-query';

export const FALLBACK_VIDEOS = ['CeG7qPpoWiM', 'HX6_nQz_ASs'];

export const useGetLatestVideos = () => {
  return useSuspenseQuery({
    queryKey: ['latestVideos'],
    queryFn: getLatestVideos,
  });
};

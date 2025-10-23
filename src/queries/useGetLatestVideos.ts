import { getLatestVideos } from '@everyone-web/services/getLatestVideos';
import { useQuery } from '@tanstack/react-query';

export const FALLBACK_VIDEOS = ['CeG7qPpoWiM', 'HX6_nQz_ASs'];

export const useGetLatestVideos = () => {
  return useQuery({
    queryKey: ['latestVideos'],
    queryFn: getLatestVideos,
    placeholderData: FALLBACK_VIDEOS,
  });
};

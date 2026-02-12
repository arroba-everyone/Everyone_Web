import { API_KEY, EVERYONE_YT_LINK } from '@everyone-web/constants/dotenv.constants';
import { FALLBACK_VIDEOS } from '@everyone-web/queries/useGetLatestVideos';
import type { IGetLatestVideosResponse } from '@everyone-web/types/getLatestVideos.interfaces';

export const getLatestVideos = async (): Promise<Array<string>> => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${EVERYONE_YT_LINK}&part=snippet,id&order=date&maxResults=2&type=video`
  );
  const data: IGetLatestVideosResponse = await response.json();
  const res = data?.items?.map(({ id: { videoId } }) => videoId);
  return res ?? FALLBACK_VIDEOS;
};

import { CircularProgress, Flex } from '@chakra-ui/react';

import { EpisodeDetailEditor } from '../../features/episodes/components/EpisodeDetailEditor';
import { useEpisode } from '../../features/episodes/hooks/useEpisode';
import { episodeDetailRoute } from '../../routes';

export const EpisodeDetailPage: React.FC = () => {
  const { bookId, episodeId } = episodeDetailRoute.useParams();

  const { data: episode } = useEpisode({ episodeId });

  if (episode == null) {
    return (
      <Flex align="center" height="100%" justify="center" width="100%">
        <CircularProgress isIndeterminate flexGrow={0} flexShrink={0} size={120} />
      </Flex>
    );
  }

  return <EpisodeDetailEditor bookId={bookId} episode={episode} />;
};

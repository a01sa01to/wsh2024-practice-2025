import styled from 'styled-components';

import type { GetEpisodeListResponse } from '@wsh-2024/schema/src/api/episodes/GetEpisodeListResponse';

import { ComicViewerCore } from '../../../features/viewer/components/ComicViewerCore';

const _Container = styled.div`
  position: relative;
`;

const _Wrapper = styled.div`
  --min-page-width: 354px;
  --max-page-width: 460px;
  --pagecnt: 2;
  @media (max-width: 708px) {
    --pagecnt: 1;
  }
  --manga-page-width: clamp(var(--min-page-width), calc(min(100vw, 1024px) / var(--pagecnt)), var(--max-page-width));
  height: calc(var(--manga-page-width) / 1075 * 1518);
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  overflow: hidden;
`;

type Props = {
  episode: GetEpisodeListResponse[0];
};

export const ComicViewer: React.FC<Props> = ({ episode }) => {
  return (
    <_Container>
      <_Wrapper>
        <ComicViewerCore episode={episode} />
      </_Wrapper>
    </_Container>
  );
};

import styled from 'styled-components';

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
  episodeId: string;
};

export const ComicViewer: React.FC<Props> = ({ episodeId }) => {
  return (
    <_Container>
      <_Wrapper>
        <ComicViewerCore episodeId={episodeId} />
      </_Wrapper>
    </_Container>
  );
};

import { Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useEpisode } from '../../episode/hooks/useEpisode';

import { ComicViewerPage } from './ComicViewerPage';

/** スクロールスナップで適切な位置になるための X 軸の移動距離を計算する */
function getScrollToLeft({ scrollView }: { scrollView: HTMLDivElement }) {
  const scrollViewClientRect = scrollView.getBoundingClientRect();
  const scrollViewCenterX = (scrollViewClientRect.left + scrollViewClientRect.right) / 2;

  const children = [...scrollView.children] as HTMLDivElement[];

  let scrollToLeft = Number.MAX_SAFE_INTEGER;

  // 画面に表示されているページの中心と、スクロールビューの中心との差分を計算する
  for (const [idx, child] of children.entries()) {
    const nthChild = idx + 1;
    const elementClientRect = child.getBoundingClientRect();

    // CSS 変数から取得
    const pageCountParView = Number(getComputedStyle(scrollView).getPropertyValue('--pagecnt'));

    const pageWidth = elementClientRect.width;

    // 見開き2ページの場合は、scroll-margin で表示領域にサイズを合わせる
    const scrollMargin =
      pageCountParView === 2
        ? {
            // 奇数ページのときは左側に1ページ分の幅を追加する
            left: nthChild % 2 === 0 ? pageWidth : 0,
            // 偶数ページのときは右側に1ページ分の幅を追加する
            right: nthChild % 2 === 1 ? pageWidth : 0,
          }
        : { left: 0, right: 0 };

    // scroll-margin の分だけ広げた範囲を計算する
    const areaClientRect = {
      bottom: elementClientRect.bottom,
      left: elementClientRect.left - scrollMargin.left,
      right: elementClientRect.right + scrollMargin.right,
      top: elementClientRect.top,
    };

    const areaCenterX = (areaClientRect.left + areaClientRect.right) / 2;
    // ページの中心をスクロールビューの中心に合わせるための移動距離
    const candidateScrollToLeft = areaCenterX - scrollViewCenterX;

    // もっともスクロール量の少ないものを選ぶ
    if (Math.abs(candidateScrollToLeft) < Math.abs(scrollToLeft)) {
      scrollToLeft = candidateScrollToLeft;
    }
  }

  return scrollToLeft;
}

const _Container = styled.div`
  position: relative;
`;

const _Wrapper = styled.div`
  background-color: black;
  cursor: grab;
  direction: rtl;
  display: grid;
  grid-auto-columns: var(--manga-page-width);
  grid-auto-flow: column;
  grid-template-rows: minmax(auto, 100%);
  height: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  overscroll-behavior: none;
  padding-inline: calc(
    (min(100vw, 1024px) - var(--manga-page-width) * var(--pagecnt)) / 2 + var(--manga-page-width) * (var(--pagecnt) - 1)
  );
  touch-action: none;

  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  > * {
    scroll-snap-align: center;

    &:nth-child(even) {
      scroll-margin-left: calc((var(--pagecnt) - 1) * var(--manga-page-width));
    }
    &:nth-child(odd) {
      scroll-margin-right: calc((var(--pagecnt) - 1) * var(--manga-page-width));
    }
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

type Props = {
  episodeId: string;
};

const ComicViewerCore: React.FC<Props> = ({ episodeId }) => {
  const { data: episode } = useEpisode({ params: { episodeId } });

  const [scrollView, scrollViewRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    let isPressed = false;

    const handlePointerDown = (ev: PointerEvent) => {
      const scrollView = ev.currentTarget as HTMLDivElement;
      isPressed = true;
      scrollView.style.cursor = 'grabbing';
      scrollView.setPointerCapture(ev.pointerId);
      scrollView.style.scrollSnapType = 'none';
    };

    const handlePointerMove = (ev: PointerEvent) => {
      if (isPressed) {
        const scrollView = ev.currentTarget as HTMLDivElement;
        scrollView.scrollBy({
          behavior: 'instant',
          left: -1 * ev.movementX,
        });
      }
    };

    const handlePointerUp = (ev: PointerEvent) => {
      const scrollView = ev.currentTarget as HTMLDivElement;
      isPressed = false;
      scrollView.releasePointerCapture(ev.pointerId);
      scrollView.style.cursor = 'grab';
      const diff = getScrollToLeft({ scrollView });
      if (diff === 0) {
        // scrollend event が発火しないので
        scrollView.style.scrollSnapType = 'x mandatory';
      } else {
        scrollView.scrollBy({
          behavior: 'smooth',
          left: diff,
        });
      }
    };

    const handleScrollEnd = (ev: Event) => {
      const scrollView = ev.currentTarget as HTMLDivElement;
      if (!isPressed) scrollView.style.scrollSnapType = 'x mandatory';
    };

    scrollView?.addEventListener('pointerdown', handlePointerDown, { passive: false, signal: abortController.signal });
    scrollView?.addEventListener('pointermove', handlePointerMove, { passive: false, signal: abortController.signal });
    scrollView?.addEventListener('pointerup', handlePointerUp, { passive: false, signal: abortController.signal });
    scrollView?.addEventListener('scrollend', handleScrollEnd, { passive: false, signal: abortController.signal });

    return () => {
      abortController.abort();
    };
  }, [scrollView]);

  return (
    <_Container>
      <_Wrapper ref={scrollViewRef}>
        {episode.pages.map((page) => {
          return <ComicViewerPage key={page.id} pageImageId={page.image.id} />;
        })}
      </_Wrapper>
    </_Container>
  );
};

const ComicViewerCoreWithSuspense: React.FC<Props> = ({ episodeId }) => {
  return (
    <Suspense fallback={null}>
      <ComicViewerCore episodeId={episodeId} />
    </Suspense>
  );
};

export { ComicViewerCoreWithSuspense as ComicViewerCore };

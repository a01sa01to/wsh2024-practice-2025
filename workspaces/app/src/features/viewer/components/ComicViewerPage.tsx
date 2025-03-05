import { useRef } from 'react';
import { useAsync } from 'react-use';
import styled from 'styled-components';

import { decrypt } from '@wsh-2024/image-encrypt/src/encdec';

import { getImageUrl } from '../../../lib/image/getImageUrl';

const _Canvas = styled.canvas`
  height: 100%;
  width: auto;
  flex-grow: 0;
  flex-shrink: 0;
`;

type Props = {
  pageImageId: string;
};

export const ComicViewerPage = ({ pageImageId }: Props) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useAsync(async () => {
    const url = getImageUrl({
      format: 'avif',
      height: 850,
      imageId: pageImageId,
      width: 600,
    });
    const buf = await fetch(url).then((res) => res.arrayBuffer());
    const blob = new Blob([decrypt(new Uint8Array(buf))], { type: 'image/avif' });
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = ref.current;
      if (canvas == null) return;
      canvas.width = 600;
      canvas.height = 850;
      canvas.setAttribute('role', 'img');
      const ctx = canvas.getContext('2d');
      if (ctx == null) return;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(img.src);
    };
  }, [pageImageId]);

  return <_Canvas ref={ref} />;
};

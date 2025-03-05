import { getImageUrl } from '../../lib/image/getImageUrl';

export const useImage = ({ height, imageId, width }: { height: number; imageId: string; width: number }) => {
  // const dpr = window.devicePixelRatio;
  const dpr = 1;
  return getImageUrl({
    format: 'avif',
    height: height * dpr,
    imageId,
    width: width * dpr,
  });
};

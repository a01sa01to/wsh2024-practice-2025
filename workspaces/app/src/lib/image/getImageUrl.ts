type Params = {
  format: 'avif' | 'webp' | 'png' | 'jpg' | 'jxl';
  height?: number;
  imageId: string;
  width?: number;
};

export function getImageUrl({ format, height, imageId, width }: Params): string {
  return `/img/${imageId}-${width}x${height}.${format}`;
}

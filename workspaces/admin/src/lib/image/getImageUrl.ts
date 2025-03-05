type Params = {
  format: 'avif' | 'webp' | 'png' | 'jpg' | 'jxl';
  height?: number;
  imageId: string;
  width?: number;
};

export function getImageUrl({ format, height, imageId, width }: Params): string {
  // const url = new URL(`/images/${imageId}`, location.href);

  // url.searchParams.set('format', format);
  // if (width != null) {
  //   url.searchParams.set('width', `${width}`);
  // }
  // if (height != null) {
  //   url.searchParams.set('height', `${height}`);
  // }
  const url = new URL(`/img/${imageId}-${width}x${height}.${format}`, location.href);

  if (format === 'jxl') {
    url.pathname = `/images/${imageId}`;
    url.search = 'format=jxl';
  }

  return url.href;
}

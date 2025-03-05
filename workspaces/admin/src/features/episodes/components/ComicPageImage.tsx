import { Image as ChakraImage } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { decrypt } from '@wsh-2024/image-encrypt/src/encdec';

import { getImageUrl } from '../../../lib/image/getImageUrl';

type Props = {
  pageImageId: string;
};

export const ComicPageImage: React.FC<Props> = ({ pageImageId }) => {
  const { data: blob } = useQuery({
    queryFn: async ({ queryKey: [, { pageImageId }] }) => {
      const url = getImageUrl({
        format: 'avif',
        height: 850,
        imageId: pageImageId,
        width: 600,
      });
      const buf = await fetch(url).then((res) => res.arrayBuffer());
      return new Blob([decrypt(new Uint8Array(buf))], { type: 'image/avif' });
    },
    queryKey: ['ComicPageImage', { pageImageId }] as const,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const [blobUrl, updateBlobUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (blob == null) return;
    const blobUrl = URL.createObjectURL(blob);
    updateBlobUrl(blobUrl);
    return () => URL.revokeObjectURL(blobUrl);
  }, [blob]);

  return (
    <ChakraImage alt={blobUrl != null ? pageImageId : ''} height={304} objectFit="cover" src={blobUrl} width={216} />
  );
};

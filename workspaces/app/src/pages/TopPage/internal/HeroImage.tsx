import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

const _Wrapper = styled.div`
  aspect-ratio: 16 / 9;
  width: 100%;
`;

const _Image = styled.img`
  display: inline-block;
  width: 100%;
`;

export const HeroImage: React.FC = () => {
  const imageRef = useRef<HTMLImageElement | null>(null);

  const updateImage = useCallback(({ height, width }: { height: number; width: number }) => {
    const image = imageRef.current;
    if (image == null) {
      return;
    }
    image.width = width;
    image.height = height;
  }, []);

  useEffect(() => {
    const resize = () => {
      const image = imageRef.current;
      if (image == null) {
        return;
      }

      const width = image.clientWidth;
      const height = (image.clientWidth / 16) * 9;
      updateImage({
        height,
        width,
      });
    };

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [updateImage]);

  return (
    <_Wrapper>
      <_Image ref={imageRef} alt="Cyber TOON" src='/assets/hero.png' />
    </_Wrapper>
  );
};
